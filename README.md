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
- Hardware transcoding container (install Nvidia plugin on UnRaid/Nvidia runtime container on Ubuntu)


Currently in Alpha but looking for feedback/suggestions. 

<p align="center">
<img src="https://i.imgur.com/wRV6tBJ.png" height="300" />
</p>


---------------------------------------------------------------------------------------
#Search

![Screenshot](https://i.imgur.com/m5aQ9cJ.png)
---------------------------------------------------------------------------------------
#Stats

![Screenshot](https://i.imgur.com/zofsBP5.png)

---------------------------------------------------------------------------------------
#Transcode management

![Screenshot](https://i.imgur.com/8vEmI7d.png)


Requirements (MongoDB + NodeJS 8.x)

---------------------------------------------------------------------------------------

INSTALLATION - https://github.com/HaveAGitGat/Tdarr/wiki/2---Installation

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







