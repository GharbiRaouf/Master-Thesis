import os
from flask_script import Manager,Server
from flask import Flask
from application import create_app

config_name = os.getenv('FLASK_ENV')
app = create_app(config_name)

manager = Manager(app)
manager.add_command("runserver", Server(host="127.0.0.1", port=5000))

if __name__ == '__main__':
    manager.run()
