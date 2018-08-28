#! /bin/bash
printf "Running Virtual Environment...\n"
virtualenv env
source env/bin/activate
pip3 install -r ./requirements.txt
printf "Running Prototype...\n"
python --version
# currentdir=pwd
currentdir= "../../Installation/"
cd "../Prototype/WebApp"
# printf "we are in $(pwd)\n----\n----\n----\n"
# gunicorn app --timeout 500
gunicorn app:app.py --timeout 500
cd $currentdir
deactivate

