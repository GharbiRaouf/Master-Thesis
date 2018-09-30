from flask import request, jsonify, g
from ..utils.auth import generate_token, requires_auth, verify_token
from ..api import api as api_bp
from ..models import Canvas
import nanoid
from random import choice
import time
import requests as API_REQUESTS

# from ..train import TEXT_GEN 
alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
awesome_text = ["A good Project", "Fantastic Project",
                "An awesome project", "Best Project all over the world"]

import os
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'application/train/docs/notes.txt')

# note_file=open("../train/docs/notes.txt","r")

from textgenrnn import textgenrnn

TEXT_GENERATOR = textgenrnn()
TEXT_GENERATOR.generate()

# from textgenrnn import textgenrnn
# TEXT_GENERATOR=textgenrnn()
# try:
#     note_file=open("../train/docs/notes.txt","r")
#     if(not note_file):
#         expose_db()
#     note_file.close()
#     TEXT_GENERATOR.train_from_file("../train/docs/notes.tx",num_epochs=2)
# except:
#     TEXT_GENERATOR.train_from_file("../train/docs/sample.txt",num_epochs=2)


@api_bp.route("/destroy_tests",methods=["GET"])
def destroy_tests():
    Canvas.delete_many({"canvas_name":{'$regex': '.*est.*'}})
    return jsonify(response="DONE")


@api_bp.route("/expose_db_notes",methods=["GET"])
def expose_db():
    # every_note=list(Canvas.find({"canvas_name":{'$regex': '.*est.*'}},{"_id":0}))
    every_canvas_notes=[x["canvas_notes"] for x in list(Canvas.find({}, {"_id": 0,"canvas_notes.note_headline":1,"canvas_notes.note_description":1}))]
    every_note=[]
    for item in every_canvas_notes:
        for i in item:
            every_note.append([i["note_headline"],i["note_description"]])
    if(not request):
        result=open("../train/docs/notes.txt","w")
        result.writelines("\n".join([" : ".join(x) for x in every_note]))
        result.close()
        return
    return jsonify(canvas=every_note)

@api_bp.route("/new_canvas", methods=["POST"])
@requires_auth
def get_new_cavas():
    incoming = request.get_json()
    canvas_id = nanoid.generate(size=20)
    canvas_type = incoming["canvas_type"]
    canvas = Canvas({
        'canvas_id': canvas_id,
        'canvas_name': "New Canvas",
        'canvas_description': choice(awesome_text),
        'canvas_type': canvas_type,
        'canvas_team': [{"user": g.current_user["email"], "role":"creator"}],
        'canvas_preview': None,
        'canvas_notes': None,
        'canvas_lastUpdate': int(1000*time.time())
    })
    try:
        canvas.save()
    except:
        return "Couldn't save that!", 501
    last_canvas = Canvas.find_one({"canvas_id": canvas_id}, {"_id": 0})
    return jsonify(canvas=last_canvas)


@api_bp.route("/get_canvas_by_canvas_id", methods=["POST"])
@requires_auth
def get_canvas_by_canvas_id():
    try:
        canvas_id = request.get_json()["canvas_id"]
    except:
        return jsonify(canvas={})
    canvas = Canvas.find_one({"canvas_id": canvas_id}, {"_id": 0})
    return jsonify(canvas=canvas)


@api_bp.route("/get_canvas_by_user", methods=["POST"])
@requires_auth
def get_canvas_by_user():
    if request.get_json():
        email = request.get_json()["email"]
    else:
        email = g.current_user["email"]
    canvas_list = list(Canvas.find({"canvas_team.user": email}, {"_id": 0}))

    return jsonify(user_canvas=canvas_list)


@api_bp.route("/update_many_canvas", methods=["GET"])
def many_canvas_update():
    incoming = request.get_json()
    Canvas.update({},
                  {'$set': incoming["canvas"]},
                  multi=True)
    canvas_list = Canvas.find({"canvas_id": incoming["canvas_id"]}, {"_id": 0})
    return jsonify(list(canvas_list))


@api_bp.route("/update_canvas", methods=["POST"])
@requires_auth
def update_canvas():
    try:
        updated_canvas = request.get_json()['canvas']
        Canvas.find_one_and_update({'canvas_id': updated_canvas['canvas_id']}, {
                                   '$set': updated_canvas})
        return jsonify(user_canvas=Canvas.find_one({'canvas_id': updated_canvas['canvas_id']}, {"_id": 0}))
    except:
        return jsonify(error=False)

@api_bp.route("/delete_canvas", methods=["POST"])
@requires_auth
def delete_canvas():
    try:
        target_canvas = request.get_json()['canvas_id']
        Canvas.find_one_and_delete({'canvas_id': target_canvas})
        return jsonify(deleteState=True)
    except:
        return jsonify(deleteState=False)


@api_bp.route("/optimize_text",methods=["POST"])
def optimize_text():
    resultGen = TEXT_GENERATOR.generate(1,return_as_list=True)
    return jsonify(suggestions=resultGen[0])
    # try:
    #     resultGen = TEXT_GENERATOR.generate(n=1,return_as_list=True)
    #     return jsonify(suggestions=resultGen[0])
    # except Exception:
    #     return jsonify(suggestions="No suggestions")

@api_bp.route("/qualify_headline",methods=["POST"])
def qualify_headline():
    
    header=request.get_json()['text_to_enhance']
    dictToSend = {'headline':header}
    res = API_REQUESTS.post('http://localhost:8000/qualify_notes_headline', json=dictToSend)

    dictFromOtherServer = res.json()
    return jsonify(quality=dictFromOtherServer)
