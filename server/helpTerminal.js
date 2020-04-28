
import logger from "./logger.js";
import homePath from "./paths.js";
import cliPaths from "./cliPaths.js";

const fs = require('fs');
var shell = require("shelljs");
Meteor.methods({

    runHelpCommand(mode, text) {
        logger.info(mode, text);
  
        if (mode == "handbrake") {
          workerCommand = cliPaths.getHandBrakePath() + " " + text;
        } else if (mode == "ffmpeg") {
          workerCommand = cliPaths.getFFmpegPath() + " " + text;
        }
  
        logger.info(workerCommand);
  
        fs.writeFileSync(homePath + "/Tdarr/Data/" + mode + ".txt", "", "utf8");
        var shellWorker = shell.exec(workerCommand, {silent:true}, function (
          code,
          stdout,
          stderr,
          stdin
        ) {
          logger.info("Exit code:", code);
          fs.appendFileSync(
            homePath + "/Tdarr/Data/" + mode + ".txt",
            stdout + "\n",
            "utf8"
          );
          fs.appendFileSync(
            homePath + "/Tdarr/Data/" + mode + ".txt",
            stderr + "\n",
            "utf8"
          );
        });
      },
  
      readHelpCommandText() {
        try {
          var ffmpegText = fs.readFileSync(
            homePath + "/Tdarr/Data/ffmpeg.txt",
            "utf8"
          );
        } catch (err) {
          logger.error(err.stack);
          var ffmpegText = "";
        }
  
        try {
          var handbrakeText = fs.readFileSync(
            homePath + "/Tdarr/Data/handbrake.txt",
            "utf8"
          );
        } catch (err) {
          logger.error(err.stack);
          var handbrakeText = "";
        }
  
        return [ffmpegText, handbrakeText];
      },
});