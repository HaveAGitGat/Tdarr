# Tdarr V2: Distributed Transcoding System
Audio/Video Library Analytics & Transcode/Remux Automation

<p align="center">
  <img src="https://storage.googleapis.com/tdarr/media/images/banner-systems.png"/>
</p>


- FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/)[![Discord](https://img.shields.io/badge/Discord-Chat-green.svg)](https://discord.gg/GF8X8cq)


<h2>
<a href="https://tdarr.io/docs/installation" target="_blank">Setup/Installation</a>
</h2>  


<h2>About:</h2>  
More information can be found on the following websites: 

[https://tdarr.io/](https://tdarr.io/)

[https://docs.tdarr.io/](https://docs.tdarr.io/)

Tdarr V2 is a cross-platform conditional based transcoding application for automating media library transcode/remux management in order to process your media files as required. For example, you can set rules for the required codecs, containers, languages etc that your media should have which helps keeps things organized and can increase compatability with your devices. A common use for Tdarr is to simply convert video files from h264 to h265 (hevc), saving 40%-50% in size.

The application is in the form of a click-to-run web-app, comprised of the following 2 components:


- Tdarr_Server -  Central process which all Nodes connect with
- Tdarr_Node - Processes running on same/other devices which collect tasks from the Server


Put your spare hardware to use with Tdarr Nodes for Windows, Linux (including Linux arm/arm64) and macOS.

Designed to work alongside applications like Sonarr/Radarr and built with the aim of modularisation, parallelisation and scalability, each library you add has its own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 4 types - Transcode CPU/GPU and Health Check CPU/GPU. Worker limits can be managed by the scheduler as well as manually. For a desktop application with similar functionality please see [HBBatchBeast](https://github.com/HaveAGitGat/HBBatchBeast).

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
## Stats
![image](https://user-images.githubusercontent.com/43864057/163762996-65381fc8-0a57-4651-ba20-b5cba28e39d3.png)
---------------------------------------------------------------------------------------
## Nodes
![image](https://user-images.githubusercontent.com/43864057/163763000-35742f0e-ae67-40b4-a44c-eee60eae61cf.png)
---------------------------------------------------------------------------------------
## Job reports
![image](https://user-images.githubusercontent.com/43864057/163763006-a73a06cb-9fec-4960-bc72-46fb9744f9a9.png)
---------------------------------------------------------------------------------------
## Property explorer
![image](https://user-images.githubusercontent.com/43864057/163763020-2231d5d1-d016-4c5c-84bf-662a6069ed01.png)
---------------------------------------------------------------------------------------
## Worker verdict history
![image](https://user-images.githubusercontent.com/43864057/163763035-5a90e2a3-9516-44c4-994e-77d844123527.png)
---------------------------------------------------------------------------------------
## Plugin stack system
![image](https://user-images.githubusercontent.com/43864057/163763049-fea46078-3749-4fb9-997c-3ced5b19049f.png)
---------------------------------------------------------------------------------------
## Property search
![image](https://user-images.githubusercontent.com/43864057/163763064-24193295-1494-4c08-aa2e-76892a771b7b.png)
---------------------------------------------------------------------------------------
## Library schedule
![image](https://user-images.githubusercontent.com/43864057/163763073-c00a3e8d-486a-4d12-b99d-7e4120961248.png)
---------------------------------------------------------------------------------------


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


Extra streams and closed captions which you don't need can cause problems with direct playing and syncing files, so you might as well remove them (it's recommended to use something like Bazarr for subtitles). Even when playing files in programs such as VLC or Kodi, subtitles/closed captions can cause playback delays and make things stuttery for a few seconds when jumping around the video.


Extra streams can also take up a lot of space. Don't be surprised to see some files in your library with 15+ audio/commentary/subtitle tracks in a bunch of different languages. These can take up an extra GB+ per file.


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


For example, to maximize direct play, a plugin stack like this can be used:


    (1) If not in h264, transcode into h264 [h264 is a more universal video codec than others]

    (2) If not in mp4, remux into mp4 [mp4 is the most universal container]

    (3) Remove subs

    (4) Remove closed captions
 
    (5) Add aac stereo audio if none (eng preferred) [very universal audio codec/channel count]

    (6) Remove meta-data if title meta detected [Stops annoying titles appearing in Plex]
