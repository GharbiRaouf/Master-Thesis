import os
from pymongo import MongoClient
from application import bcrypt
# First, declare a Document/Collection pair (a "model"):
from mongokat import Collection, Document

client = MongoClient(host=os.getenv(
    'DATABASE_HOST', 'localhost'), connect=False)
# client= MongoClient(
#     os.environ['DB_PORT_27017_TCP_ADDR'],
#     27017)
db = client[os.getenv('DATABASE_NAME', 'CanvasDB')]


class UserDocument(Document):
    def my_sum(self):
        return self["a"] + self["b"]


class NotesCollection(Collection):
    __collection__ = 'notes'
    structure = {
        "note_id": str,
        "note_questionNumber": int,
        "note_position": int,
        "note_author": object,
        "note_lastEdited": str,
        "note_headline": str,
        "note_description": str,
        "note_color": str,
        "note_status": str,
        "note_info_expanded": bool,
        "note_is_supervised": bool,
        "note_ai_rating": str,
        "note_ai_suggestion": str,
        "note_admin_rating": str,
        "note_admin_suggestion": str,
        "note_canvas": str,
    }

    def __init__(self, db, *args, **kwargs):
        Collection.__init__(
            self, collection=db[self.__collection__], *args, **kwargs)


class CanvasCollection(Collection):
    __collection__ = 'canvas'
    structure = {
        'canvas_id': str,
        'canvas_name': str,
        'canvas_description': str,
        'canvas_type': str,
        'canvas_team': list,
        'canvas_preview': str,
        'canvas_notes': list,
        'canvas_shared': str,
        'canvas_rating': str,
        'canvas_ratings': list,
        'canvas_lastUpdate': str
    }

    def __init__(self, db, *args, **kwargs):
        Collection.__init__(
            self, collection=db[self.__collection__], *args, **kwargs)


class UserCollection(Collection):
    document_class = UserDocument

    __collection__ = 'users'
    structure = {'user_id': str,
                 'email': str,
                 'password': str,
                 'user_group': str,
                 'username': str,
                 'isloggedin': bool,
                 'canvas_collections': list}
    protected_fields = ('password')

    def __init__(self, db, *args, **kwargs):
        Collection.__init__(
            self, collection=db[self.__collection__], *args, **kwargs)

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    def get_user_with_email_and_password(self, email, password):
        user = self.find_one({'email': email})
        if user and bcrypt.check_password_hash(user['password'], password):
            return user
        else:
            return None


# Then use it in your code like this:
User = UserCollection(db)
Notes = NotesCollection(db)
Canvas = CanvasCollection(db)
