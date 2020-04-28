import logger from "./logger.js";
import homePath from "./paths.js";
import cliPaths from "./cliPaths.js";

const fs = require('fs');
var shell = require("shelljs");

Meteor.methods({

    createSample(filePath) {
        logger.info("Creating sample");
        logger.info(filePath);
        var inputFile = filePath;
        var outputFile = filePath.split(".");
        outputFile[outputFile.length - 2] =
          outputFile[outputFile.length - 2] + " - TdarrSample";
        outputFile = outputFile.join(".");
        outputFile = outputFile.split("/");
        outputFile =
          homePath + "/Tdarr/Samples/" + outputFile[outputFile.length - 1];
        var inputFileUnix = inputFile.replace(/'/g, "'\"'\"'");
        var outputFileUnix = outputFile.replace(/'/g, "'\"'\"'");
        
        var preset1 = "-ss 00:00:1";
        var preset2 =
          "-t 00:00:30 -map 0:v? -map 0:a? -map 0:s? -map 0:d? -c copy";
        //  var preset1 = "-ss 00:00:1"
        //  var preset2 = "-t 00:00:30 -c copy -map 0"
  
        if (fs.existsSync(outputFile)) {
          fs.unlinkSync(outputFile);
        }
  
        if (process.platform == "win32") {
          workerCommand =
            cliPaths.getFFmpegPath() +
            " " +
            preset1 +
            ' -i "' +
            inputFile +
            '" ' +
            preset2 +
            ' "' +
            outputFile +
            '" ';
        } else {
          workerCommand =
            cliPaths.getFFmpegPath() +
            " " +
            preset1 +
            " -i '" +
            inputFileUnix +
            "' " +
            preset2 +
            " '" +
            outputFileUnix +
            "' ";
        }
  
        var shellWorker = shell.exec(workerCommand, {silent:true}, function (
          code,
          stdout,
          stderr,
          stdin
        ) {
          logger.info("Exit code:", code);
        });
      },
})