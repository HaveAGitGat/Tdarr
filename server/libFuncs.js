import { SettingsDB } from "../imports/api/database.js";
import logger from "./logger.js";

const fs = require('fs');

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

});