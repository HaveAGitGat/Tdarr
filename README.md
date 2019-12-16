<p align="center">
  <img src="https://i.imgur.com/M0ikBYL.png"/>
</p>


# Tdarr Beta - Audio/Video Library Analytics & Transcode/Remux Automation

- FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/)[![Discord](https://img.shields.io/badge/Discord-Chat-green.svg)](https://discord.gg/GF8X8cq) 

2019-12-16:  Please note I'm on a 2 week break. Sorry for the inconvenience.


Tdarr is a self hosted web-app for automating media library transcode/remux management and making sure your files are exactly how you need them to be in terms of codecs/streams/containers etc. Designed to work alongside Sonarr/Radarr and built with the aim of modularisation, parallelisation and scalability, each library you add has its own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 3 types - 'general', 'transcode' and 'health check'. Worker limits can be managed by the scheduler as well as manually. For a desktop application with similar functionality please see [HBBatchBeast](https://github.com/HaveAGitGat/HBBatchBeast).


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
- Hardware transcoding container (install Nvidia plugin on unRAID/Nvidia runtime container on Ubuntu)


Currently in Beta but looking for feedback/suggestions. 

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

Tdarr is extremely modular/configurable and the main idea behind it is creating a plugin stack to clean up/standardise your files. For example, a typical plugin stack might look like this:


    (1) Transcode non hevc files into hevc

    (2) Remove subs

    (3) Remove meta data (if title)

    (4) Add aac stereo audio if none (eng preferred)

    (5) Remove closed captions


In this example, plugins 1,2,3 and 5 are community plugins which are available for you to use immediately. Plugin 5 can be created in the plugin creator interface in Tdarr and will appear as a local plugin.


Each of the plugins are conditional, so are only used if needed. They are located in Tdarr/Documents and are written in JavaScript so if none of the plugins do what you want then you can modify/create new plugins if you have a bit of coding experience (or get the gist from having a look). Steps for doing so are in the README here:https://github.com/HaveAGitGat/Tdarr_Plugins . Ask for help in the Discord channel if need be.


Here is an illustration of how the plugin stack works:

https://i.imgur.com/483AakN.png


For those of you wondering what is meant by the term 'streams', here is an example of how a file appears in Tdarr search results:

https://i.imgur.com/RaKnq2c.png


That file has 3 streams - a video, audio and subtitle stream. For those that don't know, subtitles and closed captions are very different. Where is the closed caption data in this example? It's embedded inside the h264 video stream.


Extra streams and closed captions which you don't need can cause problems with direct playing and syncing files, so you might as well remove them (I recommend using Bazarr for subtitles). Even when playing files in programs such as VLC or Kodi, subtitles/closed captions can cause playback delays and make things stuttery for a few seconds when jumping around the video.


Extra streams can also take up a lot of space. Don't be surprised to see some files in your library with 15+ audio/commentary/subtitle tracks in a bunch of different languages . These can take up an extra GB+ per file.


The plugin creator is split into 'Filters' and 'Actions'. Filters encapsulate the actions, so the actions will only be carried out if the filter conditions are met.


Current filters:

    Filter by codec

    Filter by medium

    Filter by age

    Filter by resolution

    Filter by size



Current actions:

    Transcode - HandBrake basic options

    Transcode - HandBrake/FFmpeg custom arguments

    Transcode - Standardise audio stream codecs

    Transcode - Add audio stream

    Transcode - Keep one audio stream

    Remux container


Some actions/plugins have built-in filters (specified in the plugin creator). This means they'll automatically detect if a file needs to be processed or not (such as the remove subtitles community plugin). Additional filters can be added.


I'm adding in new filters/actions each week but some of the actions have become quite complicated so take a bit more time. For example, the 'Keep one audio stream' has 16 different outcomes as it tries to determine the best audio stream to keep based on the codec, language and channel count you specify.


If you have a request for a new filter/action, then try and think of it generically so I can implement it in way that other people can configure and apply it to their (slightly) different circumstances. Request on GitHub,Reddit or Discord.


I like to maximise the chance of direct play, so my plugin stack looks like this:


    (1) If not in h264, transcode into h264 [h264 is a more universal video codec than others]

    (2) If not in mp4, remux into mp4 [mp4 is the most universal container]

    (3) Remove subs

    (4) Remove closed captions

    (5) Add aac stereo audio if none (eng preferred) [very universal audio stream]

    (6) Remove meta-data if title meta detected [Stops annoying titles appearing in Plex]


h264 takes up more space than hevc/h265 but I don't mind that as my 1080p videos are only around 2GB.


I know some of you here hate re-encoding video as it reduces quality depending on your settings, but you can still make use of Tdarr to do a lot of other things which don't affect the video stream.


If you give it a try then make sure to set up a test folder and play around with various settings to see how Tdarr operates. For example, you may see the same file appear in the transcode/remux queue multiple times. This is because each plugin pass is done separately. Also, all newly scanned files appear in the transcode queue. It is only when a worker picks the file up that it decides if anything should be done to it or not.


When using Tdarr it's important that you implement conditions/filters to prevent your files from going through an infinite transcode/remux cycle. Most community plugins already have built-in filters and the plugin creator specifies when you need to add a filter around the action.

Additional points:

- Tdarr can handle both audio and video libraries. I can add the option for image libraries if need be.

- Use it for transcoding, remuxing, health checking or just to see library codec data. Different types of workers mean if you don't want to do transcoding or health checking then just set Tdarr up to not use any of those workers.

- Files are sent through a transcode decision-maker based on file property data. Currently, you can filter by codec, size and resolution (height and width). Many more options are in the pipeline to match HBBatchBeast while providing a better UI.

- As file property data is used instead of say, a list of files which have been processed, this means that at any time you can delete your Tdarr installation and data completely then reinstall and all files already in the correct codec etc will be marked as 'Transcode:Not required' by the transcode decision-maker.

- Transcoding and health checking won't occur on the same file at the same time to prevent errors. All newly transcoded files will automatically be put into the health check queue to make sure they are valid.

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







