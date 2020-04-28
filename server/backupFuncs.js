import { Meteor } from "meteor/meteor";
import {
  LogDB,
  FileDB,
  SettingsDB,
  GlobalSettingsDB,
  StatisticsDB,
} from "../imports/api/database.js";

import logger from "./logger.js";
import homePath from "./paths.js";
import dateFuncs from "./dateFuncs.js";
var zipFolder = require("zip-folder");

const fs = require("fs");
const fsextra = require("fs-extra");
var backupStatus = false;
const unzipper = require("unzipper");

//No need to backup client DB

var collections = [
  [FileDB, "FileDB"],
  [LogDB, "LogDB"],
  [SettingsDB, "SettingsDB"],
  [GlobalSettingsDB, "GlobalSettingsDB"],
  [StatisticsDB, "StatisticsDB"],
];


Meteor.methods({
  trimBackups() {
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
  deleteBackup(name) {
    try {
      fsextra.removeSync(homePath + `/Tdarr/Backups/${name}`);
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },
  getBackups() {
    try {
      var backups = [];
      fs.readdirSync(homePath + `/Tdarr/Backups/`).forEach((file) => {
        if (file.includes(".zip")) {
          var fullPath = homePath + `/Tdarr/Backups/` + file;
          var statSync = fs.statSync(fullPath);
          var sizeInMbytes = (statSync.size / 1000000.0).toPrecision(2);
          backups.push({
            name: file,
            size: sizeInMbytes,
            statSync: statSync,
          });
        }
      });
    } catch (err) {
      logger.error(err.stack);
    }
    return backups.sort(function (a, b) {
      return new Date(b.statSync.ctime) - new Date(a.statSync.ctime);
    });
  },
  restoreBackup(name) {
    backupStatus = [{ name: "Extract", status: "Running" }];

    if (fs.existsSync(homePath + `/Tdarr/Backups/${name}-unzip`)) {
      try {
        fsextra.removeSync(homePath + `/Tdarr/Backups/${name}-unzip`);
      } catch (err) { }
    }

    if (!fs.existsSync(homePath + `/Tdarr/Backups/${name}`)) {
      backupStatus.push({
        name: "Status",
        status: `Backup file ${name} does not exist!`,
      });
    }

    try {
      var file = name.split(".")[0];
      var stream = fs
        .createReadStream(homePath + `/Tdarr/Backups/${name}`)
        .pipe(
          unzipper.Extract({ path: homePath + `/Tdarr/Backups/${file}-unzip` })
        )
        .on(
          "finish",
          Meteor.bindEnvironment(function () {
            backupStatus[0].status = "Complete";

            for (var i = 0; i < collections.length; i++) {
              var count = 0;
              backupStatus.push({ name: collections[i][1] });
              backupStatus[i + 1].status = "Cleaning existing DB";
              collections[i][0].remove({});
              backupStatus[i + 1].status = "Existing DB cleaned";
              try {
                var dbItems = fs.readFileSync(
                  homePath +
                  `/Tdarr/Backups/${file}-unzip/${collections[i][1]}.txt`,
                  dbItems,
                  "utf8"
                );
                backupStatus[i + 1].status = "Reading backup file";
                dbItems = JSON.parse(dbItems);
                if (dbItems.length > 0) {
                  for (var j = 0; j < dbItems.length; j++) {
                    count++;
                    backupStatus[i + 1].status =
                      "Restoring:" + count + "/" + dbItems.length;
                    if (dbItems[j]._id) {
                      var id = dbItems[j]._id;
                      try {
                        collections[i][0].upsert(id, {
                          $set: dbItems[j],
                        });
                      } catch (err) {
                        logger.error("Error restoring item:");
                        logger.error(j);
                        logger.error(dbItems[j]._id);
                      }
                    }
                  }
                } else {
                  backupStatus[i + 1].status = "No items to restore!";
                }
              } catch (err) {
                logger.error(err);
                backupStatus[i + 1].status = "Error:" + JSON.stringify(err);
              }
            }

            fsextra.removeSync(homePath + `/Tdarr/Backups/${file}-unzip`);
            backupStatus.push({ name: "Status", status: "Finished!" });
          })
        );
    } catch (err) {
      logger.error(err);
      backupStatus.push({
        name: "Status",
        status: "Error:" + JSON.stringify(err),
      });
    }
  },
  getBackupStatus() {
    return backupStatus;
  },
  resetBackupStatus() {
    backupStatus = false;
  },
  createBackup() {
    //push backup status into array, array is displayed on front end in table.
    backupStatus = [];
    try {
      var currentDate = dateFuncs.getDateNow();

      if (!fs.existsSync(homePath + `/Tdarr/Backups/Backup-${currentDate}`)) {
        fs.mkdirSync(homePath + `/Tdarr/Backups/Backup-${currentDate}`);
      }

      for (var i = 0; i < collections.length; i++) {
        try {
          backupStatus.push({ name: collections[i][1] });
          backupStatus[i].status = "Fetching data";
          var dbItems = collections[i][0].find({}).fetch();
          dbItems = JSON.stringify(dbItems);
          backupStatus[i].status = "Writing to file";
          fs.writeFileSync(
            homePath +
            `/Tdarr/Backups/Backup-${currentDate}/${collections[i][1]}.txt`,
            dbItems,
            "utf8"
          );
          backupStatus[i].status = "Complete";
        } catch (err) {
          logger.error(err);
          backupStatus.push({
            name: "Status",
            status: "Error:" + JSON.stringify(err),
          });
        }
      }

      dbItems = "";
      backupStatus.push({ name: "Local plugins", status: "Copying" });

      if (
        !fs.existsSync(
          homePath + `/Tdarr/Backups/Backup-${currentDate}/LocalPlugins`
        )
      ) {
        fs.mkdirSync(
          homePath + `/Tdarr/Backups/Backup-${currentDate}/LocalPlugins`
        );
      }

      fsextra.copySync(
        homePath + "/Tdarr/Plugins/Local",
        homePath + `/Tdarr/Backups/Backup-${currentDate}/LocalPlugins/`
      );
      backupStatus[5].status = "Complete";
      backupStatus.push({ name: "Zipping", status: "Running" });
      zipFolder(
        homePath + `/Tdarr/Backups/Backup-${currentDate}`,
        homePath + `/Tdarr/Backups/Backup-${currentDate}.zip`,
        Meteor.bindEnvironment(function (err) {
          if (err) {
            backupStatus[6].status = "Error:" + JSON.stringify(err);
          } else {
            backupStatus[6].status = "Complete";
          }

          fsextra.removeSync(homePath + `/Tdarr/Backups/Backup-${currentDate}`);
        })
      );
    } catch (err) {
      logger.error(err);
    }
  },
});
