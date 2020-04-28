import { SettingsDB } from "../imports/api/database.js";
import logger from "./logger.js";

const fs = require('fs');
var folderWatchers = {};

Meteor.methods({

    verifyFolder(folderPath, DB_id, folderType) {
        try {
          folderPath = folderPath.replace(/\\/g, "/");
  
          if (fs.existsSync(folderPath)) {
            SettingsDB.upsert(DB_id, {
              $set: {
                [folderType]: true,
              },
            });
  
            try {
              var folders = getDirectories(folderPath);
            } catch (err) {
              var folders = [];
            }
  
            folders = folders.map((row) => {
              return {
                fullPath: path.join(folderPath, row),
                folder: row,
              };
            });
  
            return folders;
          } else {
            SettingsDB.upsert(DB_id, {
              $set: {
                [folderType]: false,
              },
            });
            folderPath2 = folderPath.split("/");
            var idx = folderPath2.length - 1;
            folderPath2.splice(idx, 1);
            folderPath2 = folderPath2.join("/");
  
            try {
              var folders = getDirectories(folderPath);
            } catch (err) {
              var folders = [];
            }
  
            folder = folders.map((row) => {
              return {
                fullPath: path.join(folderPath, row),
                folder: row,
              };
            });
  
            return folders;
          }
  
          function getDirectories(path) {
            return fs.readdirSync(path).filter(function (file) {
              return fs.statSync(path + "/" + file).isDirectory();
            });
          }
        } catch (err) {
          logger.error(err.stack);
        }
      },

      toggleFolderWatch(Folder, DB_id, status) {
        if (status == true) {
          logger.info("Turning folder watch on for:" + Folder);
          createFolderWatch(Folder, DB_id);
        } else if (status == false) {
          logger.info("Turning folder watch off for:" + Folder);
          deleteFolderWatch(DB_id);
        }
      },

});


 function createFolderWatch(Folder, DB_id) {
    var watcherID = DB_id;
    var librarySettings = SettingsDB.find(
      { _id: DB_id },
      { sort: { createdAt: 1 } }
    ).fetch()[0];
    var folderWatchScanInterval = librarySettings.folderWatchScanInterval;
    var useFsEvents = librarySettings.useFsEvents;
    logger.info(folderWatchScanInterval);
    var watcherPath = "assets/app/folderWatcher.js";
    var childProcess = require("child_process");
    var child_argv = [
      watcherID,
      Folder,
      DB_id,
      folderWatchScanInterval,
      useFsEvents,
    ];

    folderWatchers[watcherID] = childProcess.fork(watcherPath, child_argv);
    logger.info("" + "Watcher " + watcherID + " launched" + "");
    folderWatchers[watcherID].on(
      "exit",
      Meteor.bindEnvironment(function (code, signal) {
        logger.info("" + "Folder Watcher exited" + "");
      })
    );

    folderWatchers[watcherID].on("error", console.error.bind(console));
    folderWatchers[watcherID].on(
      "message",
      Meteor.bindEnvironment(function (message) {
        if (message[1] == "sendFilesForExtract") {
          var DB_id = message[2];
          var filesToProcess = message[3];
          var obj = {
            HealthCheck: "Queued",
            TranscodeDecisionMaker: "Queued",
            cliLog: "",
            bumped: false,
            history: "",
          };
          Meteor.call("scanFiles", DB_id, filesToProcess, 0, 3, obj, function (
            error,
            result
          ) { });
        }

        if (message[1] == "removeThisFileFromDB") {
          Meteor.call(
            "modifyFileDB",
            "removeOne",
            message[2],
            (error, result) => { }
          );
        }

        if (message[1] == "requestingExit") {
          var messageOut = ["exitApproved"];
          folderWatchers[message[0]].send(messageOut);
        }

        if (message[1] == "consoleMessage") {
          var type = message[2];
          var string = "Folder watcher " + message[0] + ":" + message[3] + "";
          logger.loggerFunc(type, string);
        }
      })
    );
  }

  module.exports.createFolderWatch = createFolderWatch;

  function deleteFolderWatch(DB_id) {
    logger.info("Deleting folder watcher:" + DB_id);

    try {
      //try send message
      var messageOut = ["closeDown"];
      folderWatchers[DB_id].send(messageOut);
      //delete watchers[DB_id]
    } catch (err) {
      //logger.error(err.stack);
      logger.error("Deleting folder watcher failed (does not exist):" + DB_id);
    }
  }