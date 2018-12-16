from config import app_config
import os
from flask import Flask, request, send_from_directory, render_template, jsonify, url_for, redirect, g
from flask_bcrypt import Bcrypt
from .utils.auth import generate_token, requires_auth, verify_token
from random import choice
from flask_cors import CORS
from .pusherconfig.pcfg import pusher
# local imports

bcrypt = Bcrypt()


def create_app(config_name):
    app = Flask(__name__, static_url_path='',static_folder='./backend_dashboard/build')
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('../config.py')
    CORS(app)
    # app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    bcrypt.init_app(app)


    @app.route('/', defaults={'path': ''})
    def serve(path):
        if path != "" and os.path.exists("./backend_dashboard/build/" + path):
            return send_from_directory('./backend_dashboard/build', path)
        else:
            return send_from_directory('./backend_dashboard/build', 'index.html')


    # @app.route('/<path:path>', methods=['GET'])
    # def any_root_path(path):
    #     return render_template('index.html')

    @app.errorhandler(500)
    def internal_server_error(error):
        pass
        return render_template('errors/500.html', title='Server Error'), 500

    from .api import api as api_bp
    app.register_blueprint(api_bp, url_prefix='/api/v1')

    return app
