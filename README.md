# Tdarr (pre-alpha) - Audio/Video library encoding statistics + transcode automation using FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/)[![Discord](https://img.shields.io/badge/Discord-Chat-green.svg)](https://discord.gg/GF8X8cq) 

Tdarr is a self hosted web-app for automating media library encode management and making sure your content is in your preferred codecs, whatever they may be. Built with the aim of modularisation, parallelisation and scalability, each library you add has it's own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 3 types - 'general', 'transcode' and 'health check'. Worker limits can be managed by the scheduler as well as manually. For a desktop application with similar functionality please see HBBatchBeast.

Currently in pre-alpha but looking for feedback/suggestions. 

![Screenshot](https://i.imgur.com/fabZThG.png)

---------------------------------------------------------------------------------------

![Screenshot](https://i.imgur.com/wfhrjhy.png)


Requirements (MongoDB + NodeJS 8.x)

---------------------------------------------------------------------------------------

INSTALLATION - (Docker -- Easiest method):

1. Pull the docker image:

       docker pull haveagitgat/tdarr
  
2. Create a persistent docker volume for Tdarr data - Mapping a host folder most likely won't work as MongoDB requires a filesystem that supports fsync() on directories amongst other things.

       docker volume create TdarrData

3. Run the container (change the '8265' on the left to your preferred port and add required volumes)

       docker run -ti -d --rm \
         -p 8265:8265 \
         -v /your/video/library/path/:/home/Tdarr/Media \
         -v TdarrData:/var/lib/mongodb/ \
         haveagitgat/tdarr
        
        
Visit localhost:8265 in a web browser to use the application

---------------------------------------------------------------------------------------

INSTALLATION - (Windows):

1. Download MongoDB from the server tab (https://www.mongodb.com/download-center/community) and install

2. Download and install NodeJS 8: https://nodejs.org/dist/latest-v8.x/

3. Download the relevant Tdarr-Windows zip from https://github.com/HaveAGitGat/Tdarr/releases

4. Extract zip, open a cmd terminal in the root folder and run the following:

       set MONGO_URL=mongodb://localhost:27017/Tdarr
       set PORT=8265
       set ROOT_URL=http://localhost/
       node main.js
  
Visit localhost:8265 in a web browser to use the application
  
  ---------------------------------------------------------------------------------------

INSTALLATION - (macOS):

1. Install MongoDB an run as a service as taken from https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

        /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        brew tap mongodb/brew
        brew install mongodb-community@4.2
        brew services start mongodb-community@4.2

2. Download and install NodeJS 8: https://nodejs.org/dist/latest-v8.x/

3. Install HandBrakeCLI using the following command in a terminal:

       brew install handbrake

4. Download the relevant Tdarr-macOS zip from https://github.com/HaveAGitGat/Tdarr/releases

5. Extract zip, open a terminal in the root folder and run the following:

       export MONGO_URL=mongodb://localhost:27017/Tdarr
       export PORT=8265 
       export ROOT_URL=http://localhost/
       node main.js

Visit localhost:8265 in a web browser to use the application

---------------------------------------------------------------------------------------

INSTALLATION - (Linux):

1.  Install MongoDB an run as a service

        sudo apt install -y mongodb-server 
        sudo service mongodb start

2. Download and install NodeJS 8: https://nodejs.org/dist/latest-v8.x/

3. Install HandBrakeCLI using the following 3 commands in a terminal:

         sudo add-apt-repository ppa:stebbins/handbrake-releases
         sudo apt-get update
         sudo apt-get install handbrake-cli handbrake-gtk

4. Download the relevant Tdarr-Linux zip from https://github.com/HaveAGitGat/Tdarr/releases

5. Extract zip, open a terminal in the root folder and run the following:

        MONGO_URL=mongodb://localhost:27017/Tdarr PORT=8265 ROOT_URL=http://localhost/ node main.js

Visit localhost:8265 in a web browser to use the application





        






