import { SettingsDB } from "../imports/api/database.js";
import logger from "./logger.js";

module.exports = function runScheduledSimpleScan() {
    logger.info("Running hourly scan!");

    try {
      var settingsInit = SettingsDB.find({}, {}).fetch();

      for (var i = 0; i < settingsInit.length; i++) {
        if (settingsInit[i].scanOnStart !== false) {
          var obj = {
            HealthCheck: "Queued",
            TranscodeDecisionMaker: "Queued",
            cliLog: "",
            bumped: false,
            history: "",
          };
          Meteor.call(
            "scanFiles",
            settingsInit[i]._id,
            settingsInit[i].folder,
            1,
            0,
            obj,
            function (error, result) { }
          );
        }
      }
    } catch (err) {
      logger.error(err.stack);
    }

    setTimeout(Meteor.bindEnvironment(runScheduledSimpleScan), 3600000);
  }