# Windows v2 Preview: Module test

<a href="https://storage.googleapis.com/tdarr/versions/1.9900/win32_x64/Tdarr_Updater.zip" target="_blank">Download Tdarr_Updater</a>

Run /Tdarr_Updater.exe

4 Modules will be downloaded.

Run /Tdarr_Server/Tdarr_Server.exe
Run /Tdarr_Node/Tdarr_Node.exe

Close both down once init has finished.

Open /Tdarr_Server_Config.json:

    {
      "serverPort": "8266",
      "handbrakePath": "",
      "ffmpegPath": ""
    }


Leave port as 8266 (will be configurable in future),
Add handbrakePath and ffmpegPath

Open /Tdarr_Node_Config.json:
    {
      "nodeID": "QUkJYfSSD",
      "nodeIP": "127.0.0.1",
      "nodePort": "8267",
      "serverIP": "127.0.0.1",
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
      "server": "y:\Movies",
      "node": "z:\Stuff\Movies"
    }

In the above config, when the server sends a file path to the node, the base path will be translated and vice versa.

Make sure ports are open (8266 for server and 8267 for a default node).

Run /Tdarr_Server/Tdarr_Server.exe
Run /Tdarr_Node/Tdarr_Node.exe
Run /Tdarr_WebUI/Tdarr_WebUI.exe

Visit http://localhost:8265/ and the Tdarr UI should be visible. The connected node should appear on the 'Tdarr' tab. Else close everything down
and run /Tdarr_Desktop/Tdarr_Desktop.exe which will by default start a server and a local node.

A new config /Tdarr_Desktop_Config.json will be created:

    {
      "Tdarr_Node": true,
      "Tdarr_Server": true,
      "Tdarr_WebUI": false
    }

Above you can specify which modules will run when you start Tdarr_Desktop.exe

If all is working, you should be able to start up workers on different nodes on the 'Tdarr' tab if you have a library set up and some files scanned.
![Screenshot](https://i.imgur.com/6ONVOre.png)

Work in progress. Feedback welcome!










