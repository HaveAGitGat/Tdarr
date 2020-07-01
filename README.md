#  <img width="24px" alt="Tdarr" src="https://i.imgur.com/M0ikBYL.png"/> Tdarr 

[![Reddit](https://img.shields.io/badge/Reddit-Tdarr-orange)](https://www.reddit.com/r/Tdarr/)[![Discord](https://img.shields.io/badge/Discord-Chat-green.svg)](https://discord.gg/GF8X8cq) [![paypal](https://img.shields.io/badge/-donate-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L5MWTNDLLB6AC&source=url)

Tdarr is a self hosted web-app for automating media library transcode/remux management and making sure your files are exactly how you need them to be in terms of codecs/streams/containers etc. Designed to work alongside Sonarr/Radarr and built with the aim of modularisation, parallelisation and scalability. For a desktop application with similar functionality please see [HBBatchBeast](https://github.com/HaveAGitGat/HBBatchBeast).

# Getting Started

- [Downloads](https://github.com/likeadoc/Tdarr/releases) (Linux, MacOS, Windows)
- [Installation](https://github.com/likeadoc/Tdarr/wiki/Installation)
- [Docker](https://github.com/likeadoc/Tdarr/wiki/Configuration#Docker)
- [Development](https://github.com/likeadoc/Tdarr/wiki/Setup)
- [Wiki](https://github.com/likeadoc/Tdarr/wiki)

# Features
- Audio and video library management
- Use & create [Tdarr Plugins](https://github.com/HaveAGitGat/Tdarr_Plugins) for infinite control on how your files are processed
- 7 day, 24 hour scheduler
- Folder watcher
- Worker stall detector
- Load balancing between libraries/drives
- Use HandBrake or FFmpeg
- Tested on a 180,000 file dummy library with 60 workers
- Search for files based on hundreds of properties
- Expanding stats page
- Hardware transcoding containers (install Nvidia plugin on unRAID/Nvidia runtime container on Ubuntu)
