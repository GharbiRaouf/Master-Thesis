import os
from flask_script import Manager
from flask import Flask
from application import create_app

config_name = os.getenv('FLASK_ENV')
app = create_app(config_name)

manager = Manager(app)


if __name__ == '__main__':
    manager.run()
