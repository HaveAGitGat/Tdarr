# Tdarr (pre-alpha) -Audio/Video library analytics + transcode automation using FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/)[![Discord](https://img.shields.io/badge/Discord-Chat-green.svg)](https://discord.gg/GF8X8cq) 

Tdarr is a self hosted web-app for automating media library transcode management and making sure your content is in your preferred codecs and works well in the 'arr' family of apps. Built with the aim of modularisation, parallelisation and scalability, each library you add has its own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 3 types - 'general', 'transcode' and 'health check'. Worker limits can be managed by the scheduler as well as manually. For a desktop application with similar functionality please see [HBBatchBeast](https://github.com/HaveAGitGat/HBBatchBeast).

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
         -v /where/to/store/plugins/:/home/Tdarr/Documents/Tdarr \
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
Some additional points on the application for this interested (taken from Reddit Unraid post):



-The UI is very bland at the moment as I'm getting the core functionality up and running first.

-Tdarr can handle both audio and video libraries. I can add the option for image libraries if need be.

-Use it for transcoding, health checking or just to see library codec data. Different types of workers mean if you don't want to do transcoding or health checking then just set Tdarr up to not use any of those workers.

-Files are passed through a transcode decision-maker based on meta-data. Currently, you can filter by codec, size and resolution (height and width). Many more options are in the pipeline to match HBBatchBeast while providing a better UI.

-As meta-data is used instead of say, a list of files which have been processed, this means that at any time you can delete your Tdarr installation + data completely then reinstall and all files already in the correct codec etc will be 'passed' by the transcode decision-maker.

-Transcoding and health checking won't occur on the same file at the same time to prevent errors. Fetching files from the database can take some time, so there is additional logic to make sure workers don't process the same tasks. Also, all newly transcoded files will automatically be put into the health check queue to make sure they are valid.

-I've put a lot of work into making the program as asynchronous as possible. This means you can scan multiple libraries at the same as running multiple transcode + health check workers. This is crucial for 100TB+ libraries due to the amount of time it can take to process them.

-There is no single transcode/health check queue generated and then processed. Items are pulled from the database in real-time. This prevents queue errors when for example you move files in/out/around your libraries.

-Only videos are health checked.

-If you toggle a worker to 'Off', it will finish its current item before exiting.

-Due to the aim of this being used with large libraries, the server intermittently generates a mini-database to be displayed by any clients (UI queues are currently limited to 20 items). This keeps the UI running smoothly but I still have plenty of improvement to do on this as I've only tested it with an 8,000 file library. If nothing shows when you click on one of the tabs, then give it a minute and items should show up.

-There is a worker status watcher which automatically cancels items after 5 minutes of no transcode progression.

-I'm currently working on implementing logic so workers load-balance between libraries which will allow high bandwidth processing (Gigabit+) when doing health checks using multiple workers on a powerful server.

-Lots of graphs and stats additions are in the pipeline.

-There will be integration with Sonarr/Radarr to automatically replace corrupt video files.

-A database meta-data search engine will be added.

-General workers prioritise health check items before transcode items.

-All newly scanned items are moved to the top of the queue as people generally want to prioritise their new media. You can use the search bar to move any item to the top of the queue or re-queue it for a transcode/health check.

- Default port is 8265 (say it enough and it may start to sound like h265).



Some usage points taken from the Help tab:



-When you're first getting started, add a new library on the 'Libraries' tab and specify a source folder, select the container types you'd like to scan for and then click then click 'Scan (Fresh)'. This will do a fresh scan of the library and extract meta-data from files which fit your specified container settings. The data will then be saved in the database.

-'Scan (Find new)' does 2 things - it removes files from the database which don't exist anymore, and adds newly detected files. Turn on 'Folder watch' to automate this process.

-All new files will be added to both the transcode queues and the health check queues. If you're not interested in using one or the other, then just make sure not to fire up any workers for that respective queue.



-Back to the library settings, if using FFmpeg, you need to separate the input and output parameters with a comma. Such as: '-r 1,-r 24'. Here are some HandBrake preset examples:

-e x264 -q 20 -B

-Z "Very Fast 1080p30"

-Z "Very Fast 480p30"

--preset-import-file "C:\Users\HaveAGitGat\Desktop\testpreset.json" -Z "My Preset"



-If you're having trouble with custom presets, it may be due to a known bug with the HandBrakeCLI (will be fixed in next HandBrakeCLI release). Please see this for a temporary solution: https://github.com/HandBrake/HandBrake/issues/2047

-Regarding the transcode filter settings, these are applied when the items are being processed in the transcode queue. If files do not meet the transcode requirements then they will be passed.

-Watch out for the schedule settings. If scheduled blocks are ticked, and worker limits are set at the top of the 'Tdarr' tab, then workers will be fired up even if you keep closing them down. It's also important to note that workers won't process items for the respective library outside the selected time blocks. If you're wanting to manually control workers, make sure to tick all the schedule blocks and then set the 'Scheduled worker limits' on the 'Tdarr' tab to 0. Start-up and close down workers as you wish.
        






