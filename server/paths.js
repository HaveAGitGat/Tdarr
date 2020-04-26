import { GlobalSettingsDB } from "../imports/api/tasks.js";
var home = require("os").homedir();
var homePath;

//Check if different documents path has been set as env var
if (process.env.NODE_ENV == "production") {
  if (process.env.DATA) {
    homePath = process.env.DATA;
  } else {
    homePath = home + "/Documents";
  }

  //Check if base path set
  if (process.env.BASE) {
    GlobalSettingsDB.upsert("globalsettings", {
      $set: {
        basePath: process.env.BASE,
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
  //set dev env
  homePath = home + "/Documents";
  GlobalSettingsDB.upsert("globalsettings", {
    $set: {
      basePath: "",
    },
  });
}

module.exports = homePath;
