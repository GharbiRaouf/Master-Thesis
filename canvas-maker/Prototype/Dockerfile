FROM tiangolo/uwsgi-nginx:python3.6
RUN apt-get update

WORKDIR /root
RUN mkdir prototype-project
COPY ./ ./prototype-project/
RUN pip install -qr ./prototype-project/WebApp/requirements.txt
ENV FLASK_ENV=production 

ENTRYPOINT ["python", "./prototype-project/WebApp/app.py"]
EXPOSE 8000