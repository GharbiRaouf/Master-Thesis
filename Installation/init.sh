#! /bin/bash

if [ -z "$(which python3)" ]; then 
	sudo apt-get install python3
	printf "Python3 installation done\n" 
else 
	printf "Python does exists\n" 
fi

if [ -z "$(which pip3)" ]; then 
	printf "PiP3 installation ...\r"
	sudo apt install python3-pip
	printf "PiP3 installation done\n" 
else 
	printf "PiP3 does exists\n" 
fi

printf "installing NGINX ...\r"
sudo apt-get install nginx
printf "installing NGINX : Done\n"

if [ "requirements.txt" == "$(ls -R requirements.txt 2>/dev/null )" ]; then
	printf "Installing Python requirements ..."
	sudo -H pip3 install -r requirements.txt
	printf "Installing Python requirements : Done\n"
else
	printf "Requirements file is missing.\n"
fi

printf "Testing NGINX ...\n"
sudo /etc/init.d/nginx start
printf "Initialize NGINX enabled sites ...\r"
sudo rm /etc/nginx/sites-enabled/default
sudo touch /etc/nginx/sites-available/flask_seetings
sudo ln -s /etc/nginx/sites-available/flask_seetings /etc/nginx/sites-enabled/flask_settings
sudo printf "server {
location / {
	proxy_pass http://127.0.0.1:8000;
	proxy_set_header Host $host;
	proxy_set_header X-Real_IP $remote_addr;}}" > /etc/nginx/sites-enabled/flask_settings
printf "Initialize NGINX enabled sites: Done...\n"
sudo /etc/init.d/nginx restart
printf "Testing NGINX : Done\n"

while true; do
	read  -p "Proceed and Run The Prototype Server? [y/n]: " ans
	if [ "${ans^^}" == "Y" ]; then
		. startprototype.sh;
		break;
	elif [ "${ans^^}" == "N" ]; then
		printf "Start it by running:\n\t. startprototype.sh\n";
		break;
	else
		printf "Bad entry .. Try again \n";
	fi
done

while true; do
	read  -p "Make The Prototye multi user? [y/n]: " ansv
	if [ "${ansv^^}" == "Y" ]; then
		. startupservice;
		break;
	elif [ "${ansv^^}" == "N" ]; then
		printf "Make it Multi-User Service by running:\n\t. startupservice.sh\n";
		break;
	else
		printf "Bad entry .. Try again \n";
	fi

done


