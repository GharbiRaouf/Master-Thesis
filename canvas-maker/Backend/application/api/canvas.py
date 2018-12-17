from flask import request, jsonify, g
from ..utils.auth import generate_token, requires_auth, verify_token
from ..api import api as api_bp
from ..models import Canvas, Notes,User
import nanoid
from random import choice
import time
import requests as API_REQUESTS
from ..pusherconfig.pcfg import pusher

# from ..train import TEXT_GEN
alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
awesome_text = ["A good Project", "Fantastic Project",
                "An awesome project", "Best Project all over the world"]


# f=open("notes.txt","a")
# f.write("ezaezae")
# f.close()

@api_bp.route("/destroy_tests", methods=["GET"])
def destroy_tests():
    Canvas.delete_many({"canvas_name": {'$regex': '.*est.*'}})
    return jsonify(response="DONE")

@api_bp.route("/d_n_a_u", methods=["GET"])
def destroy_all_anonymous_users():
    User.remove({})
    return jsonify(response="DONE")

@api_bp.route("/d_n_a_n", methods=["GET"])
def destroy_no_author_notes():
    Notes.remove({})
    return jsonify(response="DONE")


@api_bp.route("/expose_db_notes", methods=["GET"])
def expose_db():
    # every_note=list(Canvas.find({"canvas_name":{'$regex': '.*est.*'}},{"_id":0}))
    every_good_canvas = list(Canvas.find(
        {"canvas_rating": {"$gt": 3}}, {"_id": 0}))
    # every_canvas_notes=[x["canvas_notes"] for x in list(Canvas.find({}, {"_id": 0,"canvas_notes.note_headline":1,"canvas_notes.note_description":1}))]
    every_canvas_notes = [x["canvas_notes"] for x in every_good_canvas]
    every_note = []
    for item in every_canvas_notes:
        for i in item:
            every_note.append([i["note_headline"], i["note_description"]])
    if (not request):
        result = open("notes.txt", "a")
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
        'canvas_team': [{"user": g.current_user["email"], "role": "creator"}],
        'canvas_preview': None,
        'canvas_notes': None,
        'canvas_lastUpdate': int(1000 * time.time())
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
        if updated_canvas["canvas_ratings"]:
            updated_canvas["canvas_rating"] = sum(updated_canvas["canvas_ratings"]) / len(
                updated_canvas["canvas_ratings"])
        Canvas.find_one_and_update({'canvas_id': updated_canvas['canvas_id']}, {
            '$set': updated_canvas})
        restored_canvas = Canvas.find_one({'canvas_id': updated_canvas['canvas_id']}, {"_id": 0})
        updated_canvas_notes = [a["note_id"] for a in updated_canvas["canvas_notes"]]
        try:
            restored_canvas_notes = [a["note_id"] for a in restored_canvas["canvas_notes"]]
        except Exception as E:
            restored_canvas_notes = []
        deleted_notes = list(set(restored_canvas_notes) - set(updated_canvas_notes))
        for n_id in deleted_notes:
            Notes.find_one_and_delete({"note_id": n_id})
            pusher.trigger(u'canvas', u'note_deleted', n_id)

        for note in updated_canvas['canvas_notes']:
            try:
                if note["note_id"] in restored_canvas_notes:
                    old_note = Notes.find_one({"note_id": note["note_id"]}, {"_id": 0})
                    Notes.find_one_and_update({"note_id": note["note_id"]}, {'$set': note}, upsert=False)
                    Notes.find_one_and_update({"note_id": note["note_id"]}, {'$set': {
                        "note_admin_suggestion": old_note["note_ai_suggestion"],
                        "note_admin_rating": old_note["note_admin_rating"],
                        "note_is_supervised": old_note["note_is_supervised"]
                    }}, upsert=False)
                else:
                    newnote = Notes(note)
                    newnote.save()
            except Exception as E:
                newnote = Notes(note)
                newnote.save()
            finally:
                pusher.trigger(u'canvas', u'note_field_update', note)

        return jsonify(user_canvas=Canvas.find_one({'canvas_id': updated_canvas['canvas_id']}, {"_id": 0}))
    except Exception as E:
        return jsonify(error=False)


@api_bp.route("/delete_canvas", methods=["POST"])
@requires_auth
def delete_canvas():
    try:
        target_canvas = request.get_json()['canvas_id']
        Canvas.find_one_and_delete({'canvas_id': target_canvas})
        pusher.trigger(u'canvas', u'canvas_delete', target_canvas)
        Notes.delete_many({"note_canvas": target_canvas})
        return jsonify(deleteState=True)
    except:
        return jsonify(deleteState=False)


# note_file=open(filename,"r")
# note_file=open("notes.txt","r")
# note_file=open("..\\train\\docs\\notes.txt","r")
# note_file.close()
# from textgenrnn import textgenrnn

# TEXT_GENERATOR = textgenrnn()
# try:
#     import os
#     dirname = os.path.dirname(__file__)
#     filename = os.path.join(dirname, 'allnotes.txt')
#     note_file = open(filename,"r")
#     if not note_file:
#         expose_db()
#     print(len(note_file.readlines()))
#     note_file.close()
#     TEXT_GENERATOR.train_from_file(filename, num_epochs=2)
# except Exception as E:
#     TEXT_GENERATOR = textgenrnn()


# note_is_supervised
# note_ai_rating
# note_ai_suggestion
# note_admin_rating
# note_admin_suggestion


@api_bp.route("/list_notes", methods=["GET"])
def list_notes():
    return jsonify(listed=list(Notes.find({}, {"_id": 0})))


@api_bp.route("/force_update", methods=["POST"])
def force_update():
    note_to_force = request.get_json()['note_to_force']
    try:
        Notes.find_one_and_update({"note_id": note_to_force["note_id"]}, {
            "$set": {"note_admin_rating": note_to_force["note_admin_rating"],
                     "note_admin_suggestion": note_to_force["note_admin_suggestion"],
                     "note_is_supervised": note_to_force["note_is_supervised"]}})
        veridict= {
            "note_id":note_to_force["note_id"],
            "veridict":note_to_force["note_admin_rating"]
        }
        return jsonify(success=True)
    except Exception:
        return jsonify(success=False)
    finally:
        pusher.trigger(u'canvas', u'master_noticed_you', veridict)


@api_bp.route("/optimize_text", methods=["POST"])
def optimize_text():
    canvas_field = request.get_json()['canvas_field']

    notes_to_optimize = request.get_json()['notes_to_optimize']
    resp="No Suggestions could be Provided"
    try:
        restored_note = Notes.find_one(
            {"note_id": notes_to_optimize["note_id"]}, {"_id": 0})
    except:
        restored_note = notes_to_optimize
    try:
        if restored_note["note_is_supervised"]:
            notes_to_optimize["note_is_supervised"] = True
            resp = restored_note["note_admin_suggestion"]
        else:
            dictToSend = {'canvas_field': canvas_field}
            res = API_REQUESTS.post(
                'http://localhost:8000/suggest_description', json=dictToSend)
            dictFromOtherServer = res.json()
            resp = dictFromOtherServer["response"]
    except Exception:
        resp = "No suggestions"
    finally:
        notes_to_optimize["note_ai_suggestion"] = resp
        try:
            Notes.find_one_and_update({"note_id": notes_to_optimize["note_id"]}, {
                "$set": notes_to_optimize})
            nn = Notes.find_one({"note_id": notes_to_optimize["note_id"]})
            pusher.trigger(u'canvas', u'note_field_update', notes_to_optimize)

        finally:
            return jsonify(suggestions=resp)


def parse_rating(s):
    a = 0
    c = ""
    try:
        a = float(s)
    except Exception as e:
        a = choice([0, 10, 43, 68, 78, 79])
    finally:
        if a < 50:
            c = "red"
        elif a < 70:
            c = "orange"
        else:
            c = "green"
    return [c, a]


@api_bp.route("/qualify_headline", methods=["POST"])
def qualify_headline():
    # headline = request.get_json()['headline']
    # note_type = request.get_json()['note_type']
    # notes_to_optimize = request.get_json()['notes_to_optimize']
    # dictFromOtherServer = {"quality": ["red", "Not enough input text"]}
    # try:
    #     restored_note = Notes.find_one(
    #         {"note_id": notes_to_optimize["note_id"]}, {"_id": 0})
    # except Exception as D:
    #     restored_note = notes_to_optimize
    # try:
    #     if restored_note["note_is_supervised"]:
    #         # notes_to_optimize["note_ai_suggestion"] = restored_note["note_admin_suggestion"]
    #         notes_to_optimize["note_is_supervised"] = True
    #         dictFromOtherServer = {"quality": parse_rating(restored_note["note_admin_rating"])}
    #     else:
    #         dictToSend = {
    #             "headline": headline,
    #             "note_type": note_type}
    #         res = API_REQUESTS.post(
    #             'http://localhost:8000/qualify_notes_headline', json=dictToSend)

    #         dictFromOtherServer = res.json()
    # finally:
    #     try:
    #         notes_to_optimize["note_ai_rating"] = dictFromOtherServer
    #         pusher.trigger(u'canvas', u'note_field_update', notes_to_optimize)
    #         Notes.find_one_and_replace(
    #             {"note_id": notes_to_optimize["note_id"]}, notes_to_optimize)
    #     except Exception as e:
    #         pass
        # finally:
        #     return jsonify(quality=dictFromOtherServer)
    group=request.get_json()['group']
    note_content=request.get_json()['note_content']
    note_field=request.get_json()['note_field']
    # dictFromOtherServer = {"quality": ["red", "Not enough input text"]}
    dictFromOtherServer = {"veridict": -1} 

    try:
        restored_note = Notes.find_one(
            {"note_id": note_content["note_id"]}, {"_id": 0})
    except Exception as D:
        restored_note = note_content
    try:
        if restored_note["note_is_supervised"] or group in "CD":
            note_content["note_is_supervised"] = True
            dictFromOtherServer = {"quality": parse_rating(restored_note["note_admin_rating"])}
            pusher.trigger(u'canvas', u'notice_me_master', note_content)
        
        else:
            dictToSend = {
                "headline": note_content["note_headline"],
                "note_type": note_field}
            res = API_REQUESTS.post(
                'http://localhost:8000/qualify_notes_headline', json=dictToSend)

            dictFromOtherServer = res.json()
            veridict= {
                "note_id":note_content["note_id"],
                "veridict":dictFromOtherServer["qualit"]
            }
            return jsonify(veridict=veridict)
        
            try:
                note_content["note_ai_rating"] = dictFromOtherServer
                pusher.trigger(u'canvas', u'note_field_update', note_content)
                Notes.find_one_and_replace(
                    {"note_id": note_content["note_id"]}, note_content)
            except Exception as e:
                return  jsonify(veridict=dictFromOtherServer["quality"])
    except Exception as Es:
        print(Es)
    finally:
        return  jsonify(veridict=dictFromOtherServer["quality"])
        

