# Tdarr v2 Preview

1.99.08 Module Matrix

| Platform/Module      | Updater | Server | Node | WebUI | Desktop |
|----------------------|---------|--------|------|-------|---------|
| linux_x64            | ✔       | ✔      | ✔    | ✔     | ✔       |
| win32_x64            | ✔       | ✔      | ✔    | ✔     | ✔       |
| darwin_x64           | ✔       | ✔      | ✔    | ✔     |         |
| linux_arm (Armv7 64) | ✔       | ✔      | ✔    |✔      |         |
| Docker               | -       | ✔ tdarr:1.99.08| ✔  tdarr_node:1.99.08    | ✔     | -       |

Download the relevant Tdarr_Updater:

<a href="https://storage.googleapis.com/tdarr/versions/1.99.05/linux_x64/Tdarr_Updater.zip" target="_blank">Tdarr_Updater linux_x64 </a>

<a href="https://storage.googleapis.com/tdarr/versions/1.99.05/win32_x64/Tdarr_Updater.zip" target="_blank">Tdarr_Updater win32_x64</a>

<a href="https://storage.googleapis.com/tdarr/versions/1.99.05/darwin_x64/Tdarr_Updater.zip" target="_blank">Tdarr_Updater darwin_x64</a>

<a href="https://storage.googleapis.com/tdarr/versions/1.99.08/linux_arm/Tdarr_Updater.zip" target="_blank">Tdarr_Updater linux_arm</a>


Unzip it.

If on linux or mac it's best to run the packages from a terminal so you can see the output. 

Run /Tdarr_Updater

4 Modules will be downloaded.

Run /Tdarr_Server/Tdarr_Server

Run /Tdarr_Node/Tdarr_Node

Close both down once init has finished.

Open /configs/Tdarr_Server_Config.json:

    {
      "serverPort": "8266",
      "handbrakePath": "",
      "ffmpegPath": ""
    }


Leave port as 8266 (will be configurable in future),
Add handbrakePath and ffmpegPath, make sure to use double back slash or a single forward slash in the paths e.g.:

    C:\\ffmpeg\\ffmpeg

    C:/ffmpeg/ffmpeg
    
Open /configs/Tdarr_WebUI_Config.json:    
    
    {
       "webUIPort": 8265,
       "serverIP": "0.0.0.0",
       "serverPort": 8266
    }
    
Open /configs/Tdarr_Node_Config.json:

        {
        "nodeID": "QUkJYfSSD",
        "nodeIP": "0.0.0.0",
        "nodePort": "8267",
        "serverIP": "0.0.0.0",
        "serverPort": "8266",
        "handbrakePath": "",
        "ffmpegPath": "",
        "pathTranslators": [
            {
            "server": "",
            "node": ""
            }
        ]
        }


Add handbrakePath and ffmpegPath. Set whichever nodePort you like. If running a node on a different machine to the server,
make sure to specify the serverIP address. Also make sure the node and server machines have the same library and cache paths. For example,
y:\Movies on the server should point to the same location as y:\Movies on the node machine. Else you can use the pathTranslators
in the config above, similar to Docker. e.g.:

    {
      "server": "y:/Movies",
      "node": "z:/Stuff/Movies"
    }

In the above config, when the server sends a file path to the node, the base path will be translated and vice versa.

Make sure ports are open (8266 for server and 8267 for a default node).

Run /Tdarr_Server/Tdarr_Server

Run /Tdarr_Node/Tdarr_Node

Run /Tdarr_WebUI/Tdarr_WebUI

Visit http://localhost:8265/ and the Tdarr UI should be visible. The connected node should appear on the 'Tdarr' tab. 




For Tdarr Desktop, run /Tdarr_Desktop/Tdarr_Desktop which will by default start a server and a local node.

A new config /configs/Tdarr_Desktop_Config.json will be created:

    {
      "Tdarr_Node": true,
      "Tdarr_Server": true,
      "Tdarr_WebUI": false,
      "serverIP": "0.0.0.0",
      "serverPort": 8266
    }

Above you can specify which modules will run when you start Tdarr_Desktop

If all is working, you should be able to start up workers on different nodes on the 'Tdarr' tab if you have a library set up and some files scanned.
![Screenshot](https://i.imgur.com/4uxBkDy.png)

Logs for all modules stored in:

    /logs/
    
Docker run examples:

        docker run -ti \
        -v /home/h/Desktop/server:/app/server \
        -v /home/h/Desktop/Transcode:/mount \
        --network host \
        -e "serverIP=0.0.0.0" \
        -e "serverPort=8266" \
        -e "webUIPort=8265" \
        -e "TZ=Europe/London" \
        -e PUID=1000 \
        -e PGID=1000 \
        haveagitgat/tdarr:1.99.07
        
        docker run -ti \
        -v /home/h/Desktop/Transcode:/mount \
        -e "serverIP=0.0.0.0" \
        -e "serverPort=8266" \
        --network host \
        -e "TZ=Europe/London" \
        -e PUID=1000 \
        -e PGID=1000 \
        haveagitgat/tdarr_node:1.99.07
        
Note: All the variables in the config files can be set through environment variables

Work in progress. Feedback welcome!










