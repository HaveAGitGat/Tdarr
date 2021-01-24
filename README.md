Note: Tdarr is currently undergoing a rewrite. ETA 24th Jan


# Tdarr V2: Distributed Transcoding System
Audio/Video Library Analytics & Transcode/Remux Automation

<p align="center">
  <img src="https://storage.googleapis.com/tdarr/media/images/banner-systems.png"/>
</p>


- FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/)[![Discord](https://img.shields.io/badge/Discord-Chat-green.svg)](https://discord.gg/GF8X8cq) [![paypal](https://img.shields.io/badge/-donate-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L5MWTNDLLB6AC&source=url) 

[![patreon](https://img.shields.io/badge/patreon-support-brightgreen.svg)](https://www.patreon.com/Tdarr)

<h2>
<a href="https://tdarr.io/docs/installation" target="_blank">Setup/Installation</a>
</h2>  


<h2>About:</h2>  

Tdarr is a self hosted web-app for automating media library transcode/remux management and making sure your files are exactly how you need them to be in terms of codecs/streams/containers etc. Designed to work alongside Sonarr/Radarr and built with the aim of modularisation, parallelisation and scalability, each library you add has its own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 4 types - Transcode CPU/GPU and Health Check CPU/GPU. Worker limits can be managed by the scheduler as well as manually. For a desktop application with similar functionality please see [HBBatchBeast](https://github.com/HaveAGitGat/HBBatchBeast).


- Cross-platform Tdarr Nodes which work together with Tdarr Server to process your files
- GPU and CPU workers
- Use/create Tdarr Plugins for infinite control on how your files are processed:
https://github.com/HaveAGitGat/Tdarr_Plugins
- Audio and video library management
- 7 day, 24 hour scheduler
- Folder watcher
- Worker stall detector
- Load balancing between libraries/drives
- Use HandBrake or FFmpeg
- Tested on a 1,000,000 file dummy library
- Search for files based on hundreds of properties
- Library stats
- Hardware transcoding container (install Nvidia plugin on unRAID/Nvidia runtime container on Ubuntu)



<p align="center">
<img src="https://i.imgur.com/wRV6tBJ.png" height="300" />
</p>

---------------------------------------------------------------------------------------
## Transcode management
![Screenshot](https://storage.googleapis.com/tdarr/media/images/Nodes.PNG)
---------------------------------------------------------------------------------------
## Stats
![Screenshot](https://storage.googleapis.com/tdarr/media/images/Stats2.PNG)
---------------------------------------------------------------------------------------
## Search
![Screenshot](https://storage.googleapis.com/tdarr/media/images/Search2.PNG)
---------------------------------------------------------------------------------------
## Plugins
![Screenshot](https://storage.googleapis.com/tdarr/media/images/Plugins2.PNG)
-------------------------------------------------------------------------------------------------------------

Requirements (MongoDB + NodeJS 8.x)

-------------------------------------------------------------------------------------------------------------

Tdarr is extremely modular/configurable and the main idea behind it is creating a plugin stack to clean up/standardise your files. For example, a typical plugin stack might look like this:


    (1) Transcode non hevc files into hevc

    (2) Remove subs

    (3) Remove meta data (if title)

    (4) Add aac stereo audio if none (eng preferred)

    (5) Remove closed captions


In this example, plugins 1,2,3 and 5 are community plugins which are available for you to use immediately. Plugin 4 can be created in the plugin creator interface in Tdarr and will appear as a local plugin.


Each of the plugins are conditional, so are only used if needed. They are located in Tdarr/Documents and are written in JavaScript so if none of the plugins do what you want then you can modify/create new plugins if you have a bit of coding experience (or get the gist from having a look). Steps for doing so are in the README here:https://github.com/HaveAGitGat/Tdarr_Plugins . Ask for help in the Discord channel if need be.


Here is an illustration of how the plugin stack works:

https://i.imgur.com/483AakN.png


For the term 'streams', here is an example of how a file appears in Tdarr search results:

https://i.imgur.com/RaKnq2c.png


That file has 3 streams - a video, audio and subtitle stream. Subtitles and closed captions are very different. Where is the closed caption data in this example? It's embedded inside the h264 video stream.


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

Some of the actions have become quite complicated so take a bit more time. For example, the 'Keep one audio stream' has 16 different outcomes as it tries to determine the best audio stream to keep based on the codec, language and channel count you specify.


If you have a request for a new filter/action, then try and think of it generically so I can implement it in way that other people can configure and apply it to their (slightly) different circumstances. Request on GitHub,Reddit or Discord.


I like to maximise the chance of direct play, so my plugin stack looks like this:


    (1) If not in h264, transcode into h264 [h264 is a more universal video codec than others]

    (2) If not in mp4, remux into mp4 [mp4 is the most universal container]

    (3) Remove subs

    (4) Remove closed captions
 
    (5) Add aac stereo audio if none (eng preferred) [very universal audio codec/channel count]

    (6) Remove meta-data if title meta detected [Stops annoying titles appearing in Plex]









