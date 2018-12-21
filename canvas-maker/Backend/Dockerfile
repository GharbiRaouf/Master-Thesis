FROM python:3.5-jessie
RUN apt-get update

WORKDIR /root
RUN mkdir backend-project
COPY ./ ./backend-project/
RUN pip install -qr ./backend-project/requirements.txt
ENV FLASK_ENV=production 

ENTRYPOINT ["python", "./backend-project/manage.py","runserver"]
EXPOSE 5000
#export FLASK_ENV=production
#python3 manage.py runserver