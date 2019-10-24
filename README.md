<p align="center">
  <img src="https://i.imgur.com/M0ikBYL.png"/>
</p>


# Tdarr Alpha - Audio/Video Library Analytics & Transcode Automation

- FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/)[![Discord](https://img.shields.io/badge/Discord-Chat-green.svg)](https://discord.gg/GF8X8cq) 

Tdarr is a self hosted web-app for automating media library transcode management and making sure your content is in your preferred codecs. Designed to work alongside Sonarr/Radarr and built with the aim of modularisation, parallelisation and scalability, each library you add has its own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 3 types - 'general', 'transcode' and 'health check'. Worker limits can be managed by the scheduler as well as manually. For a desktop application with similar functionality please see [HBBatchBeast](https://github.com/HaveAGitGat/HBBatchBeast).


- Use/create Tdarr Plugins for infinite control on how your files are processed:
https://github.com/HaveAGitGat/Tdarr_Plugins
- Audio and video library management
- 7 day, 24 hour scheduler
- Folder watcher
- Worker stall detector
- Load balancing between libraries/drives
- Use HandBrake or FFmpeg
- Tested on a 180,000 file dummy library with 60 workers
- Search for files based on hundreds of properties
- Expanding stats page


Currently in Alpha but looking for feedback/suggestions. 

<p align="center">
<img src="https://i.imgur.com/wRV6tBJ.png" height="300" />
</p>


![Screenshot](https://i.imgur.com/8iqpGQk.png)

---------------------------------------------------------------------------------------

![Screenshot](https://i.imgur.com/DIcTee2.png)


Requirements (MongoDB + NodeJS 8.x)

---------------------------------------------------------------------------------------

INSTALLATION - (Docker/unRAID -- Easiest method):

There are 2 Docker containers:

    tdarr - Alpine image with MongoDB separate (same as before)
    tdarr_aio - all-in-one Ubuntu image with MongoDB inside + hardware transcoding in future

tdarr:
1. Pull and run the MongoDB Docker container:

        docker pull mongo
        
        docker run -p 27017-27019:27017-27019 \
          -v data:/data/db \
          mongo:latest

2. Pull the Tdarr Docker image:

       docker pull haveagitgat/tdarr
  
3. Run the container (change the '8265' on the left to your preferred port and add required volumes)

       docker run -ti --rm \
        --net=host \
        -v /media:/home/Tdarr/Media \
        -v /home/user/Documents/Tdarr:/home/Tdarr/Documents/Tdarr \
        -p 8265:8265 \
        -e "MONGO_URL=mongodb://localhost:27017/Tdarr" \
        -v /etc/localtime:/etc/localtime:ro \
         haveagitgat/tdarr
        
        
Visit localhost:8265 in a web browser to use the application


For unRAID please see the following screenshots for the MongoDB and Tdarr container configs:


![Screenshot](https://i.imgur.com/qnP9YhI.png)

![Screenshot](https://i.imgur.com/7WFU0AJ.png)

 tdarr_aio:
 
 1. Pull the Tdarr Docker image:

        docker pull haveagitgat/tdarr_aio
        
2. Create a TdarrData docker volume (recommended) else skip this step and replace 'TdarrData' in the step below with any folder on your host machine where you want the MongoDB data to be kept (may cause errors).

        docker volume create TdarrData
  
3. Run the container (change the '8265' on the left to your preferred port and add required volumes)
         
         docker run -ti --rm \
        -v /media:/home/Tdarr/Media \
 	      -v /home/user/Documents/Tdarr:/home/Tdarr/Documents/Tdarr \
        -p 8265:8265 \
        -v TdarrData:/var/lib/mongodb \
        -v /etc/localtime:/etc/localtime:ro \
        haveagitgat/tdarr_aio

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

1. Install MongoDB and run as a service as taken from https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

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

1.  Install MongoDB and run as a service

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




-------------------------------------------------------------------------------------------------------------

Additional points:

- Tdarr can handle both audio and video libraries. I can add the option for image libraries if need be.

- Use it for transcoding, remuxing, health checking or just to see library codec data. Different types of workers mean if you don't want to do transcoding or health checking then just set Tdarr up to not use any of those workers.

- Files are sent through a transcode decision-maker based on file property data. Currently, you can filter by codec, size and resolution (height and width). Many more options are in the pipeline to match HBBatchBeast while providing a better UI.

- As file property data is used instead of say, a list of files which have been processed, this means that at any time you can delete your Tdarr installation and data completely then reinstall and all files already in the correct codec etc will be marked as 'Transcode:Not required' by the transcode decision-maker.

- Transcoding and health checking won't occur on the same file at the same time to prevent errors. Fetching files from the database can take some time, so there is additional logic to make sure workers don't process the same tasks. Also, all newly transcoded files will automatically be put into the health check queue to make sure they are valid.

- I've put a lot of work into making the program as asynchronous as possible. This means you can scan multiple libraries at the same as running multiple transcode + health check workers. This is crucial for 100TB+ libraries due to the amount of time it can take to process them.

- There is no single transcode/health check queue generated and then processed. Items are pulled from the database in real-time. This prevents queue errors when for example you move files in/out/around your libraries.

- Only videos are health checked.

- If you toggle a worker to 'Off', it will finish its current item before exiting.

- There is a worker status watcher which automatically cancels items after 5 minutes of no transcode progression.

- Lots of graphs and stats additions are in the pipeline.

- There will be integration with Sonarr/Radarr to automatically replace corrupt video files.

- General workers prioritise health check items before transcode items.

- All newly scanned items are moved to the top of the queue as people generally want to prioritise their new media. You can use the search bar to move any item to the top of the queue or re-queue it for a transcode/health check.

- Default port is 8265 (say it enough and it may start to sound like h265).







