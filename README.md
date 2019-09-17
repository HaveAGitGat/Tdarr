# Tdarr (pre-alpha) - Audio/Video library encoding statistics + transcode automation using FFmpeg/HandBrake + video health checking (Windows, macOS, Linux & Docker)

[![Reddit](https://img.shields.io/badge/Reddit-HBBatchBeast-FF5700.svg?style=flat-square)](https://www.reddit.com/r/Tdarr/) 

Tdarr is a self hosted web-app for automating media library encode management and making sure your content is in your preferred codecs, whatever they may be. Built with the aim of modularisation, parallelisation and scalability, each library you add has it's own transcode settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 3 types - 'general', 'transcode' and 'health check' and worker limits can be managed by the scheduler as well as manually. 

Currently in pre-alpha but looking for feedback/suggestions. 

![Screenshot](https://i.imgur.com/pSNJFSj.png)



Requirements (MongoDB + NodeJS 8.x)

---------------------------------------------------------------------------------------

INSTALLATION - (All versions):

1. Download MongoDB from the server tab (https://www.mongodb.com/download-center/community) and install

2. Download and install NodeJS 8: https://nodejs.org/dist/latest-v8.x/

3. Download the relevant Tdarr zip from https://github.com/HaveAGitGat/Tdarr/releases

4. Extract zip, open a terminal in the root folder and run the following:

Windows:

  set MONGO_URL=mongodb://localhost:27017/Tdarr
  set PORT=8265 
  set ROOT_URL=http://localhost/
  node main.js
  
macOS and Linux:

MONGO_URL=mongodb://localhost:27017/Tdarr PORT=8265 ROOT_URL=http://localhost/ node main.js




