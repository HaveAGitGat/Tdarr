# Tdarr (pre-alpha) - Audio/Video library encoding statistics + transcode automation using FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/) 

Tdarr is a self hosted web-app for automating media library encode management and making sure your content is in your preferred codecs, whatever they may be. Built with the aim of modularisation, parallelisation and scalability, each library you add has it's own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 3 types - 'general', 'transcode' and 'health check' and worker limits can be managed by the scheduler as well as manually. 

Currently in pre-alpha but looking for feedback/suggestions. 

![Screenshot](https://i.imgur.com/fabZThG.png)

---------------------------------------------------------------------------------------

![Screenshot](https://i.imgur.com/wfhrjhy.png)


Requirements (MongoDB + NodeJS 8.x)

---------------------------------------------------------------------------------------

INSTALLATION - (Windows):

1. Download MongoDB from the server tab (https://www.mongodb.com/download-center/community) and install

2. Download and install NodeJS 8: https://nodejs.org/dist/latest-v8.x/

3. Download the relevant Tdarr-Windows zip from https://github.com/HaveAGitGat/Tdarr/releases

4. Extract zip, open a cmd terminal in the root folder and run the following:

  **set MONGO_URL=mongodb://localhost:27017/Tdarr**
  
  **set PORT=8265**
  
  **set ROOT_URL=http://localhost/**
  
  **node main.js**
  
Visit localhost:8265 in a web browser to use the application
  
  ---------------------------------------------------------------------------------------

INSTALLATION - (macOS):

1. Download MongoDB from the server tab (https://www.mongodb.com/download-center/community) and install

2. Download and install NodeJS 8: https://nodejs.org/dist/latest-v8.x/

3. Install HandBrakeCLI using the following 2 commands in a terminal:

    **/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"**
    
    **brew install handbrake**

4. Download the relevant Tdarr-macOS zip from https://github.com/HaveAGitGat/Tdarr/releases

5. Extract zip, open a terminal in the root folder and run the following:

    **MONGO_URL=mongodb://localhost:27017/Tdarr PORT=8265 ROOT_URL=http://localhost/ node main.js**
  
Visit localhost:8265 in a web browser to use the application

---------------------------------------------------------------------------------------

INSTALLATION - (Linux):

1. Download MongoDB from the server tab (https://www.mongodb.com/download-center/community) and install

2. Download and install NodeJS 8: https://nodejs.org/dist/latest-v8.x/

3. Install HandBrakeCLI using the following 3 commands in a terminal:

    **sudo add-apt-repository ppa:stebbins/handbrake-releases**
    
    **sudo apt-get update**
    
    **sudo apt-get install handbrake-cli handbrake-gtk**

4. Download the relevant Tdarr-Linux zip from https://github.com/HaveAGitGat/Tdarr/releases

5. Extract zip, open a terminal in the root folder and run the following:

    **MONGO_URL=mongodb://localhost:27017/Tdarr PORT=8265 ROOT_URL=http://localhost/ node main.js**

Visit localhost:8265 in a web browser to use the application

---------------------------------------------------------------------------------------

INSTALLATION - (Docker):

1. Download MongoDB from the server tab (https://www.mongodb.com/download-center/community) and install

2. Pull the docker image:

  **docker pull haveagitgat/tdarr**

3. Run the container (change /media/mount/Video/ to the location of your media )

docker run -ti -d --rm  \ 

   --net=host \ 
        
   -v /media/mount/Video/:/home/developer/Media  \ 
        
   haveagitgat/tdarr
        
        
Visit localhost:8265 in a web browser to use the application



        






