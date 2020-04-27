import { GlobalSettingsDB } from "../imports/api/database.js";
import logger from "./logger.js";

var shell = require("shelljs");

module.exports.setProcessPriority = function setProcessPriority() {
    try {
      if (process.platform == "win32") {
        var workerCommandFFmpeg =
          'wmic process where name="ffmpeg.exe" CALL setpriority "Low"';
        var workerCommandHandBrake =
          'wmic process where name="HandBrakeCLI.exe" CALL setpriority "Low"';
      }

      if (process.platform == "linux") {
        var workerCommandFFmpeg =
          "for p in $(pgrep ^ffmpeg$); do renice -n 20 -p $p; done";
        var workerCommandHandBrake =
          "for p in $(pgrep ^HandBrakeCLI$); do renice -n 20 -p $p; done";
      }

      if (process.platform == "darwin") {
        var workerCommandFFmpeg =
          "for p in $(pgrep ^ffmpeg$); do renice -n 20 -p $p; done";
        var workerCommandHandBrake =
          "for p in $(pgrep ^HandBrakeCLI$); do renice -n 20 -p $p; done";
      }

      var globalSettings = GlobalSettingsDB.find({}, {}).fetch();

      //logger.info(globalSettings)
      if (globalSettings[0].lowCPUPriority == true) {
        shellWorker = shell.exec(workerCommandFFmpeg, function (
          code,
          stdout,
          stderr,
          stdin
        ) { });
        shellWorker = shell.exec(workerCommandHandBrake, function (
          code,
          stdout,
          stderr,
          stdin
        ) { });
      }
    } catch (err) {
      logger.error(err.stack);
    }
    setTimeout(Meteor.bindEnvironment(setProcessPriority), 10000);
  }