import { GlobalSettingsDB } from "../imports/api/database.js";
var home = require("os").homedir();
var homePath;

//Check if different documents path has been set as env var
if (process.env.NODE_ENV == "production") {
  if (process.env.TDARR_DATA) {
    homePath = process.env.TDARR_DATA;
  } else {
    homePath = home + "/Documents";
  }

  //Check if base path set
  if (process.env.BASE) {
    GlobalSettingsDB.upsert("globalsettings", {
      $set: {
        basePath: process.env.TDARR_BASEPATH,
      },
    });
  } else {
    GlobalSettingsDB.upsert("globalsettings", {
      $set: {
        basePath: "",
      },
    });
  }
} else {
  //Development Environment
  homePath = home + "/Documents";
  GlobalSettingsDB.upsert("globalsettings", {
    $set: {
      basePath: "",
    },
  });
}

module.exports = homePath;
