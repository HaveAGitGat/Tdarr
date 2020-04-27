import { SettingsDB } from "../imports/api/database.js";
import logger from "./logger.js";

const fs = require('fs');
const path = require("path");
const rimraf = require("rimraf");

module.exports = function scheduledCacheClean(filesBeingProcessed) {
    try {
      var settings = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch();

      for (var i = 0; i < settings.length; i++) {
        try {
          traverseDir(settings[i].cache);
        } catch (err) {
          logger.error(err.stack);
        }
      }

      function traverseDir(inputPathStem) {
        try {
          fs.readdirSync(inputPathStem).forEach((file) => {
            var fullPath = path.join(inputPathStem, file).replace(/\\/g, "/");
            function isBeingProcessed(filePath) {
              for (var i = 0; i < filesBeingProcessed.length; i++) {
                var base = filesBeingProcessed[i].split("/");
                base = base[base.length - 1];
                base = base.split(".");
                base = base[base.length - 2];
                if (filePath.includes(base)) {
                  return true;
                }
              }
              return false;
            }

            try {
              if (
                isBeingProcessed(fullPath) == false &&
                fullPath.includes("TdarrCacheFile")
              ) {
                logger.info("Removing:" + fullPath);

                try {
                  rimraf.sync(fullPath);
                } catch (err) {
                  logger.error(err.stack);
                  try {
                    traverseDir(fullPath);
                  } catch (err) {
                    logger.error(err.stack);
                  }
                }
              } else if (!fullPath.includes("TdarrCacheFile")) {
                logger.info(
                  "File not Tdarr cache file, won't remove:" + fullPath
                );
              } else {
                logger.warn("Cache file in use, won't remove:" + fullPath);
              }
            } catch (err) {
              logger.error(err.stack);
            }
          });
        } catch (err) {
          logger.error(err.stack);
        }
      }
    } catch (err) {
      logger.error(err.stack);
    }
    // setTimeout(Meteor.bindEnvironment(scheduledCacheClean), 10000);
  }