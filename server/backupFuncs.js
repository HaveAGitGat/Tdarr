import { Meteor } from "meteor/meteor";
import { GlobalSettingsDB } from "../imports/api/database.js";
import logger from "./logger.js";

const fs = require("fs");

Meteor.methods({
  trimBackups(homePath) {
    try {
      logger.info("Trimming backups");
      var backups = [];
      fs.readdirSync(homePath + `/Tdarr/Backups/`).forEach((file) => {
        if (file.includes(".zip")) {
          var fullPath = homePath + `/Tdarr/Backups/` + file;
          var statSync = fs.statSync(fullPath);
          backups.push({
            fullPath: fullPath,
            statSync: statSync,
          });
        }
      });

      backups = backups.sort(function (a, b) {
        return new Date(a.statSync.ctime) - new Date(b.statSync.ctime);
      });
      var backupLimit = GlobalSettingsDB.find({}, {}).fetch()[0].backupLimit;

      if (backupLimit == undefined) {
        backupLimit = 30;
      }

      logger.info(`Num backups:${backups.length}, Backup limit:${backupLimit}`);

      while (backups.length > backupLimit) {
        console.log("Deleting backup:" + backups[0].fullPath);
        fs.unlinkSync(backups[0].fullPath);
        backups.splice(0, 1);
      }
    } catch (err) {
      logger.error(err.stack);
    }
  },
});
