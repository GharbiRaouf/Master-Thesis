from flask import request, jsonify, g
from ..utils.auth import generate_token, requires_auth, verify_token
from ..api import api as api_bp
from ..models import User, Canvas
from ..api.constants import CanvasInitializer
from ..pusherconfig.pcfg import pusher


@api_bp.route("/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@api_bp.route("/get_online_users", methods=["GET"])
def get_online_user():
    o_user = list(User.find({'isloggedin': True}, {"_id": 0, "password": 0}))

    return jsonify(result=o_user)


@api_bp.route("/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        {'email': incoming["email"], 'password': User.hashed_password(incoming["password"]), 'isloggedin': True})
    default_canvas = CanvasInitializer().get_default_canvas(incoming["email"])
    try:
        user.save()
    except Exception:
        return jsonify(message="User with that email already exists"), 409
    try:
        for canvas in default_canvas:
            c = Canvas(canvas)
            c.save()
    except Exception:
        return jsonify(message="Something Wrong happened..."), 209
    new_user = User.find_one({'email': incoming["email"]})
    user_detail = User.find_one({'email': incoming["email"]}, {"_id": 0, "password": 0})
    pusher.trigger(u'user', u'user_joined', user_detail)
    return jsonify(id=str(new_user['_id']), token=generate_token(new_user))


@api_bp.route("/update_user", methods=["POST"])
@requires_auth
def update_user():
    incoming = request.get_json()
    updated_user = User({'email': incoming["email"],
                         'password': User.hashed_password(incoming["password"]),
                         'username': incoming["username"],
                         'isloggedin': True})
    User.update_one({'email': updated_user["email"]}, {
        "$set": updated_user}, upsert=False)
    new_user = User.find_one({'email': incoming["email"]})
    return jsonify(
        id=str(new_user['_id']),
        token=generate_token(new_user)
    )


@api_bp.route("/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(
        incoming["email"], incoming["password"])

    if user:
        user['isloggedin'] = True
        User.find_one_and_update({'email': user['email']}, {
            "$set": user}, upsert=False)

        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@api_bp.route("/disconnect", methods=["POST"])
def unset_token():
    incoming = request.get_json()
    incoming = verify_token(incoming["token"])
    user_detail = incoming
    pusher.trigger(u'user', u'user_left', user_detail)
    try:
        User.find_one_and_update({'email': user_detail["email"]}, {"$set": {'isloggedin': False}}, upsert=False)
        return jsonify(error=False), 200
    except Exception as E:
        return jsonify(error=True), 403


@api_bp.route("/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403
