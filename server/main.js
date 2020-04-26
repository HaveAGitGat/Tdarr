/* eslint-disable prettier/prettier */
import '../imports/api/manipulateLib.js';
import '../imports/api/pluginCreatorMethods.js';
import '../imports/api/tasks.js';
import '../imports/api/transcodeSettings.js';
import { LogDB, FileDB, SettingsDB, GlobalSettingsDB, StatisticsDB, ClientDB } from '../imports/api/tasks.js';
import dateFuncs from './dateFuncs.js';
import './backupFuncs.js';

//Globals
const shortid = require('shortid');
const util = require('util')
const path = require("path");
const fs = require('fs');
const fsextra = require('fs-extra')
const rimraf = require("rimraf");
const os = require('os-utils');
var zipFolder = require('zip-folder');
const unzipper = require('unzipper');
const schedule = require('node-schedule');
const importFresh = require('import-fresh');


var workers = {}
var fileScanners = {}
//var fileScannersData = {}
var verboseLogs
var folderWatchers = {}
var runningScans = []

// var workerDB = [{
//   _id:"test",
//   file:"test file",
//   percentage:20.01,
//   mode:"transcode",
// }]

var workerDB = []
var filesToAddToDB = []
var filesBeingProcessed = []
var backupStatus = false
var hasDBChanged = true
var workerLaunched = 0

//Create Tdarr documents folder structure if not exist
import homePath from './paths.js';
import initFolders from './initFolders.js';
initFolders(homePath)

GlobalSettingsDB.upsert(
  "globalsettings",
  {
    $set: {
      homePath: homePath,
    }
  }
);

import logger from './logger.js';
logger.info('Tdarr started.');
logger.info("Tdarr documents folder:" + homePath)
logger.info("Checking directories")

//READ  variables from json file
if (fs.existsSync(homePath + "/Tdarr/Data/env.json")) {
  try {
    jsonConfig = JSON.parse(fs.readFileSync(homePath + "/Tdarr/Data/env.json", 'utf8'))
    logger.info(jsonConfig)
    if (jsonConfig.BASE != undefined) {
      GlobalSettingsDB.upsert(
        "globalsettings",
        {
          $set: {
            basePath: jsonConfig.BASE,
          }
        }
      );
    }
  } catch (err) {
    logger.error("Unable to load configuration file")
    logger.error(err.stack)
  }
}

//No need to backup client DB

var collections = [
  [FileDB, "FileDB"],
  [LogDB, "LogDB"],
  [SettingsDB, "SettingsDB"],
  [GlobalSettingsDB, "GlobalSettingsDB"],
  [StatisticsDB, "StatisticsDB"],
]

Meteor.methods({

  'getTimeNow'() {
    var d = new Date(),
      h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
      m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    var timenow = `${h}:${m}:${s}`
    return timenow
  },
  'modifyFileDB'(mode, fileID, obj) {
    //mode == add, update, delete
    try {

      if (mode == 'insert') {
        FileDB.insert(obj);
      } else if (mode == 'update') {
        FileDB.update(fileID,
          {
            $set: obj
          });
      } if (mode == 'upsert') {
        FileDB.upsert(fileID,
          {
            $set: obj
          });
      } else if (mode == 'removeOne') {
        FileDB.remove(fileID);
      } else if (mode == 'removeByDB') {
        FileDB.remove({ DB: fileID });
      } else if (mode == 'removeAll') {
        FileDB.remove({});
      }
    } catch (err) {
      logger.error(err.stack)
    }
    Meteor.call('DBHasChanged', (error, result) => { })
  },

  'getBackups'() {
    try {
      var backups = []
      fs.readdirSync(homePath + `/Tdarr/Backups/`).forEach(file => {
        if (file.includes('.zip')) {
          var fullPath = homePath + `/Tdarr/Backups/` + file
          var statSync = fs.statSync(fullPath)
          var sizeInMbytes = ((statSync.size) / 1000000.0).toPrecision(2);
          backups.push({
            name: file,
            size: sizeInMbytes,
            statSync: statSync,
          })
        }
      });

    } catch (err) {
      logger.error(err.stack)
    }
    return backups.sort(function (a, b) {
      return new Date(b.statSync.ctime) - new Date(a.statSync.ctime);
    });
  },

  'restoreBackup'(name) {
    backupStatus = [
      { name: "Extract", status: "Running" },
    ]

    if (fs.existsSync(homePath + `/Tdarr/Backups/${name}-unzip`)) {
      try {
        fsextra.removeSync(homePath + `/Tdarr/Backups/${name}-unzip`)
      } catch (err) { }
    }

    if (!fs.existsSync(homePath + `/Tdarr/Backups/${name}`)) {
      backupStatus.push({ name: "Status", status: `Backup file ${name} does not exist!` })
    }

    try {
      var file = (name.split('.'))[0]
      var stream = fs.createReadStream(homePath + `/Tdarr/Backups/${name}`)
        .pipe(unzipper.Extract({ path: homePath + `/Tdarr/Backups/${file}-unzip` }))
        .on('finish', Meteor.bindEnvironment(function () {
          backupStatus[0].status = "Complete"

          for (var i = 0; i < collections.length; i++) {
            var count = 0
            backupStatus.push({ name: collections[i][1] })
            backupStatus[i + 1].status = "Cleaning existing DB"
            collections[i][0].remove({});
            backupStatus[i + 1].status = "Existing DB cleaned"
            try {
              var dbItems = fs.readFileSync(homePath + `/Tdarr/Backups/${file}-unzip/${collections[i][1]}.txt`, dbItems, 'utf8');
              backupStatus[i + 1].status = "Reading backup file"
              dbItems = JSON.parse(dbItems)
              if (dbItems.length > 0) {

                for (var j = 0; j < dbItems.length; j++) {
                  count++
                  backupStatus[i + 1].status = "Restoring:" + count + "/" + dbItems.length
                  if (dbItems[j]._id) {
                    var id = dbItems[j]._id
                    try {
                      collections[i][0].upsert(id,
                        {
                          $set: dbItems[j]
                        }
                      );
                    } catch (err) {
                      logger.error("Error restoring item:")
                      logger.error(j)
                      logger.error(dbItems[j]._id)
                    }
                  }
                }

              } else {
                backupStatus[i + 1].status = "No items to restore!"
              }
            } catch (err) {
              logger.error(err)
              backupStatus[i + 1].status = "Error:" + JSON.stringify(err)
            }
          }

          fsextra.removeSync(homePath + `/Tdarr/Backups/${file}-unzip`)
          backupStatus.push({ name: "Status", status: "Finished!" })
        }));
    } catch (err) {
      logger.error(err)
      backupStatus.push({ name: "Status", status: "Error:" + JSON.stringify(err) })
    }

  }, 'deleteBackup'(name) {
    try {
      fsextra.removeSync(homePath + `/Tdarr/Backups/${name}`)
      return true
    } catch (err) {
      logger.error(err)
      return false
    }

  }, 'getBackupStatus'() {
    return backupStatus
  }, 'resetBackupStatus'() {
    backupStatus = false

  }, 'createBackup'() {

    //push backup status into array, array is displayed on front end in table.
    backupStatus = []
    try {
      var currentDate = dateFuncs.getDateNow()

      if (!fs.existsSync(homePath + `/Tdarr/Backups/Backup-${currentDate}`)) {
        fs.mkdirSync(homePath + `/Tdarr/Backups/Backup-${currentDate}`);
      }

      for (var i = 0; i < collections.length; i++) {
        try {
          backupStatus.push({ name: collections[i][1] })
          backupStatus[i].status = "Fetching data"
          var dbItems = collections[i][0].find({}).fetch()
          dbItems = JSON.stringify(dbItems)
          backupStatus[i].status = "Writing to file"
          fs.writeFileSync(homePath + `/Tdarr/Backups/Backup-${currentDate}/${collections[i][1]}.txt`, dbItems, 'utf8');
          backupStatus[i].status = "Complete"
        } catch (err) {
          logger.error(err)
          backupStatus.push({ name: "Status", status: "Error:" + JSON.stringify(err) })
        }
      }

      dbItems = ""
      backupStatus.push({ name: "Local plugins", status: "Copying" })

      if (!fs.existsSync(homePath + `/Tdarr/Backups/Backup-${currentDate}/LocalPlugins`)) {
        fs.mkdirSync(homePath + `/Tdarr/Backups/Backup-${currentDate}/LocalPlugins`);
      }

      fsextra.copySync(homePath + "/Tdarr/Plugins/Local", homePath + `/Tdarr/Backups/Backup-${currentDate}/LocalPlugins/`)
      backupStatus[5].status = "Complete"
      backupStatus.push({ name: "Zipping", status: "Running" })
      zipFolder(homePath + `/Tdarr/Backups/Backup-${currentDate}`, homePath + `/Tdarr/Backups/Backup-${currentDate}.zip`, Meteor.bindEnvironment(function (err) {

        if (err) {
          backupStatus[6].status = "Error:" + JSON.stringify(err)
        } else {
          backupStatus[6].status = "Complete"
        }

        fsextra.removeSync(homePath + `/Tdarr/Backups/Backup-${currentDate}`)
      }));

    } catch (err) {
      logger.error(err)
    }
  }
})

//Backup
var dailyBackup = schedule.scheduleJob('0 0 0 * * *', Meteor.bindEnvironment(function () {
  Meteor.call('createBackup', (error, result) => {
    Meteor.call('trimBackups', homePath, (error, result) => { })
  })
}));


Meteor.call('trimBackups', homePath, (error, result) => { })



setTimeout(Meteor.bindEnvironment(main), 1000);

function main() {
  logger.info("Initialising DB")
  allFilesPulledTable = FileDB.find({}).fetch()

  for (var i = 0; i < allFilesPulledTable.length; i++) {
    logger.info("Checking file:" + (i + 1) + "/" + allFilesPulledTable.length)

    // reset processing status of files onload.
    if (allFilesPulledTable[i].processingStatus !== false) {
      var tempObj = {
        processingStatus: false,
      }
      Meteor.call('modifyFileDB', 'update', allFilesPulledTable[i].file, tempObj, (error, result) => { })
    }
  }

  process.on('uncaughtException', Meteor.bindEnvironment(function (err) {
    logger.error('Error in main thread:' + err)
  }));

  //Set globalDB settings on init
  var count = GlobalSettingsDB.find({}, {}).fetch()

  if (!Array.isArray(count) || !count.length) {
    GlobalSettingsDB.upsert('globalsettings',
      {
        $set: {
          lowCPUPriority: false,
          generalWorkerLimit: 0,
          transcodeWorkerLimit: 0,
          healthcheckWorkerLimit: 0,
          queueSortType: "sortDateNewest",
          verboseLogs: false,
        }
      }
    );
  } else {
    if (count[0].generalWorkerLimit == undefined) {

      GlobalSettingsDB.upsert('globalsettings',
        {
          $set: {
            lowCPUPriority: false,
            generalWorkerLimit: 0,
            transcodeWorkerLimit: 0,
            healthcheckWorkerLimit: 0,
            queueSortType: "sortDateNewest",
            verboseLogs: false,
          }
        }
      );
    }
  }

  //Search result columns
  if (count[0].searchResultColumns == undefined) {
    var searchResultColumns = {
      index: true,
      fileName: true,
      streams: true,
      closedCaptions: true,
      codec: true,
      resolution: true,
      size: true,
      bitrate: true,
      duration: true,
      bump: true,
      createSample: true,
      transcode: true,
      healthCheck: true,
      info: true,
      history: true,
      remove: true,
    }

    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          searchResultColumns: searchResultColumns,
        }
      }
    );
  }

  //UI queue size
  if (count[0].tableSize == undefined) {
    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          tableSize: 20,
        }
      }
    );
  }

  //init sort vars
  if (count[0].queueSortType == undefined) {
    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          queueSortType: "sortDateNewest",
        }
      }
    );
  }

  if (count[0].prioritiseLibraries == undefined) {
    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          prioritiseLibraries: false,
        }
      }
    );
  }

  if (count[0].alternateLibraries == undefined) {
    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          alternateLibraries: true,
        }
      }
    );
  }

  if (count[0].basePath == undefined) {
    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          basePath: "",
        }
      }
    );
  }

  if (count[0].resBoundaries == undefined) {
    var resBoundaries = {
      res480p: {
        widthMin: 100,
        widthMax: 792,
        heightMin: 100,
        heightMax: 528,
      },
      res576p: {
        widthMin: 100,
        widthMax: 792,
        heightMin: 100,
        heightMax: 634,
      },
      res720p: {
        widthMin: 100,
        widthMax: 1408,
        heightMin: 100,
        heightMax: 792,
      },
      res1080p: {
        widthMin: 100,
        widthMax: 2112,
        heightMin: 100,
        heightMax: 1188,
      },
      res4KUHD: {
        widthMin: 100,
        widthMax: 4224,
        heightMin: 100,
        heightMax: 2376,
      },
      resDCI4K: {
        widthMin: 100,
        widthMax: 4506,
        heightMin: 100,
        heightMax: 2376,
      },
      res8KUHD: {
        widthMin: 100,
        widthMax: 8448,
        heightMin: 100,
        heightMax: 5752,
      },

    }
    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          resBoundaries: resBoundaries,
        }
      }
    );
  }

  GlobalSettingsDB.upsert('globalsettings',
    {
      $set: {
        logsLoading: false,
        selectedLibrary: 0,
        propertySearchLoading: false,
      }
    }
  );

  //configure libraries
  var count = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch()

  if (Array.isArray(count) || count.length) {

    if (count[0] != undefined && count[0].priority == undefined) {
      for (var i = 0; i < count.length; i++) {
        SettingsDB.upsert(
          count[i]._id,
          {
            $set: {
              priority: i,
            }
          }
        );
      }
    }

  }

  //initialise stats properties
  var count = StatisticsDB.find({}, {}).fetch()

  if (count.length == 0) {
    StatisticsDB.upsert('statistics',
      {
        $set: {
          totalFileCount: 0,
          totalTranscodeCount: 0,
          totalHealthCheckCount: 0,
          sizeDiff: 0,
        }
      }
    );
  }

  StatisticsDB.upsert("statistics",
    {
      $set: {
        DBPollPeriod: "4s",
        DBFetchTime: "1s",
        DBLoadStatus: "Stable",
        DBQueue: 0,
        pies: []

      }
    }
  );

  ClientDB.upsert('client',
    {
      $set: {
        table1: [{}],
        table2: [{}],
        table3: [{}],
        table4: [{}],
        table5: [{}],
        table6: [{}],
      }
    }
  );

  function loggerFunc(type,string){

    switch (type) {
      case 'trace':
        logger.trace(string);
        break;
      case 'debug':
        logger.debug(string);
        break;
      case 'info':
        logger.info(string);
        break;
      case 'warn':
        logger.warn(string);
        break;
      case 'error':
        logger.error(string);
        break;
      case 'fatal':
        logger.fatal(string);
        break;
      default:
      logger.info(string);
    }
  }

  if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
    var handBrakeCLIPath = path.join(process.cwd(), '/assets/app/HandBrakeCLI.exe')
    var ffmpegPathLinux345 = path.join(process.cwd(), '/assets/app/ffmpeg/ffmpeg345/ffmpeg')
    var ffmpegPathLinux42 = path.join(process.cwd(), '/assets/app/ffmpeg/ffmpeg42/ffmpeg')
  } else {
    var handBrakeCLIPath = path.join(process.cwd(), '/private/HandBrakeCLI.exe')
    var ffmpegPathLinux345 = path.join(process.cwd(), '/private/ffmpeg/ffmpeg345/ffmpeg')
    var ffmpegPathLinux42 = path.join(process.cwd(), '/private/ffmpeg/ffmpeg42/ffmpeg')
  }

  var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  ffmpegPathLinux345 = ffmpegPathLinux345.replace(/'/g, '\'\"\'\"\'');
  ffmpegPathLinux42 = ffmpegPathLinux42.replace(/'/g, '\'\"\'\"\'');

  function getHandBrakePath() {
    var path

    if (process.platform == 'win32') {
      path = handBrakeCLIPath
    }

    if (process.platform == 'linux') {
      path = "HandBrakeCLI"
    }

    if (process.platform == 'darwin') {
      path = "/usr/local/bin/HandBrakeCLI"
    }

    return path
  }

  function getFFmpegPath() {
    var path

    if (process.platform == 'win32') {
      path = ffmpegPath
    }

    if (process.platform == 'linux') {
      path = ffmpegPathLinux42
    }

    if (process.platform == 'darwin') {
      path = ffmpegPath
    }

    var ffmpegNVENCBinary = (GlobalSettingsDB.find({}, {}).fetch())[0].ffmpegNVENCBinary

    if (ffmpegNVENCBinary == true) {
      if (process.platform == 'linux') {
        path = ffmpegPathLinux345
      }
    }

    return path
  }

  Meteor.methods({

    'DBHasChanged'() {
      //logger.info('DBHasChanged')
      setTimeout(Meteor.bindEnvironment(setHasFilesDBChanged), 1000);
      function setHasFilesDBChanged() {
        hasDBChanged = true
      }
    },

    'searchDB'(string) {
      try {
        doTablesUpdate = false
        string = string.replace(/\\/g, "/");
        logger.info(string)
        var allFiles = allFilesPulledTable
        string = string.split(',')
        allFiles = allFiles.filter(row => {
          try {

            for (var i = 0; i < string.length; i++) {
              var match = []

              if (string[i].charAt(0) == "!") {
                var subString = string[i].substring(1)
                if ((JSON.stringify(row)).toLowerCase().includes(subString.toLowerCase())) {
                  return false
                }
              } else {
                if (!(JSON.stringify(row)).toLowerCase().includes(string[i].toLowerCase())) {
                  return false
                }
              }

            }

            return true
          } catch (err) {
            logger.error(err.stack)
          }
        }
        );

        //Add queue positions to search results
        for (var i = 0; i < allFiles.length; i++) {
          var tFiles = transcodeFiles.map(row => row.file)
          var hFiles = healthcheckFiles.map(row => row.file)
          allFiles[i].tPosition = tFiles.indexOf(allFiles[i].file) + 1
          allFiles[i].hPosition = hFiles.indexOf(allFiles[i].file) + 1
        }

        GlobalSettingsDB.upsert('globalsettings',
          {
            $set: {
              propertySearchLoading: false,
            }
          }
        );
        doTablesUpdate = true
        return allFiles
      } catch (err) {
        GlobalSettingsDB.upsert('globalsettings',
          {
            $set: {
              propertySearchLoading: false,
            }
          }
        );
        doTablesUpdate = true
        return null
      }
    },

    'searchPlugins'(string, pluginType) {
      //  logger.info(string)
      try {
        var plugins = []
        fs.readdirSync(homePath + `/Tdarr/Plugins/${pluginType}`).forEach(file => {
          try {
            var pluginID = (file.split('.'))[0]
            var pluginLocalPath = path.join(process.cwd(), `/assets/app/plugins/${pluginType}/` + pluginID + '.js')
            fsextra.copySync(homePath + `/Tdarr/Plugins/${pluginType}/` + file, pluginLocalPath)
            var plugin = importFresh(pluginLocalPath)
            var obj = plugin.details();
            obj.source = pluginType;
            plugins.push(obj)
          } catch (err) {
            // logger.error(err.stack)
            var obj = {
              Name: "Read error",
              Type: "Read error",
              Operation: "Read error",
              Description: err.toString(),
              Version: "Read error",
              Link: "Read error",
              source: pluginType,
            }
            plugins.push(obj)
          }
        });

        string = string.split(',')
        plugins = plugins.filter(row => {
          try {

            for (var i = 0; i < string.length; i++) {
              if (!(JSON.stringify(row)).toLowerCase().includes(string[i].toLowerCase())) {
                return false
              }
            }

            return true
          } catch (err) { logger.error(err.stack) }
        }
        );
      } catch (err) {
        logger.error(err.stack)
      }
      return [plugins, pluginType]
    },

    'deletePlugin'(pluginID) {
      try {
        fs.unlinkSync(homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js")

        return [true, pluginID]
      } catch (err) {
        logger.error(err)
        return [false, pluginID]
      }
    },

    'copyCommunityToLocal'(pluginID, forceOverwrite) {
      var comPath = homePath + `/Tdarr/Plugins/Community/` + pluginID + ".js"
      var locPath = homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js"

      if (forceOverwrite == false && fs.existsSync(locPath)) {
        return ["exist", pluginID]
      } else {
        try {
          fsextra.copySync(comPath, locPath)
          return [true, pluginID]
        } catch (err) {
          logger.error(err)
          return [false, pluginID]
        }
      }

    },

    'readPluginText'(pluginID) {
      var locPath = homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js"
      try {
        var text = fs.readFileSync(locPath, 'utf8')
        return [true, pluginID, text]
      } catch (err) {
        logger.error(err)
        return [false, pluginID]
      }
    },

    'savePluginText'(pluginID, text) {
      var locPath = homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js"
      try {
        //var text = fs.readFileSync(locPath, 'utf8')
        if (fs.existsSync(locPath)) {
          fs.unlinkSync(locPath)
        }
        fs.writeFileSync(locPath, text, 'utf8');
        return [true, pluginID, text]
      } catch (err) {
        logger.error(err)
        return [false, pluginID]
      }
    },

    'buildPluginStack'() {

      for (var i = 0; i < plugins.length; i++) {
        try {
          var pluginLocalPath = path.join(process.cwd(), `/assets/app/plugins/${plugins[i].source}/` + plugins[i]._id + '.js')
          fsextra.copySync(homePath + `/Tdarr/Plugins/${plugins[i].source}/` + plugins[i]._id + ".js", pluginLocalPath)
          var plugin = importFresh(pluginLocalPath)
          var obj = plugin.details();
          plugins[i] = { ...plugins[i], ...obj };
        } catch (err) {
          var obj = {
            Name: "Read error",
            Type: "Read error",
            Operation: "Read error",
            Description: err.toString(),
            Version: "Read error",
            Link: "Read error"
          }
          plugins[i] = { ...plugins[i], ...obj };
        }
      }

      return plugins
    },

    'verifyPlugin'(pluginID, DB_id, community) {

      if (community == true) {
        var path = homePath + '/Tdarr/Plugins/Community/' + pluginID + '.js'
      } else {
        var path = homePath + '/Tdarr/Plugins/Local/' + pluginID + '.js'
      }

      if (fs.existsSync(path)) {
        SettingsDB.upsert(
          DB_id,
          {
            $set: {
              pluginValid: true,
            }
          }
        );
      } else {
        SettingsDB.upsert(
          DB_id,
          {
            $set: {
              pluginValid: false,
            }
          }
        );
      }

    }, 'updatePlugins'() {
      const request = require('request');
      const progress = require('request-progress');
      try {
        fsextra.removeSync(homePath + '/Tdarr/Plugins/temp.zip')
      } catch (err) { logger.error(err.stack) }
      try {
        fsextra.removeSync(homePath + '/Tdarr/Plugins/temp')
      } catch (err) { logger.error(err.stack) }
      (async function clonePlugins() {
        logger.info('Cloning plugins')
        var downloadStatus
        await downloadNew()
          .then((res) => {
            downloadStatus = res
          })
          .catch((err) => {
            logger.error(err)
            downloadStatus = 'Error!'
          })

        if (downloadStatus == 'Done!') {
          var unzipStatus
          await unzip()
            .then((res) => {
              unzipStatus = res
            })
            .catch((err) => {
              logger.error(err)
              unzipStatus = 'Error!'
            })
          await waitUnzip()

          if (unzipStatus == 'Done!') {

            try {
              fsextra.copySync(homePath + '/Tdarr/Plugins/temp/Tdarr_Plugins-master/Community', homePath + "/Tdarr/Plugins/Community", { overwrite: true })
            } catch (err) { logger.error(err.stack) }

            try {
              //COMMENT OUT WHEN WORKING ON LIBRARY FITLERS/ACTIONS
              fsextra.copySync(homePath + '/Tdarr/Plugins/temp/Tdarr_Plugins-master/methods', homePath + '/Tdarr/Plugins/methods', { overwrite: true })
            } catch (err) { logger.error(err.stack) }

            try {
              fsextra.copySync(homePath + '/Tdarr/Plugins/methods', path.join(process.cwd(), `/assets/app/plugins/methods`), { overwrite: true })
            } catch (err) { logger.error(err.stack) }

            try {
              fsextra.removeSync(homePath + '/Tdarr/Plugins/temp.zip')
            } catch (err) { logger.error(err.stack) }

            try {
              fsextra.removeSync(homePath + '/Tdarr/Plugins/temp')
            } catch (err) { logger.error(err.stack) }

            logger.info('Plugin update finished')
            GlobalSettingsDB.upsert('globalsettings',
              {
                $set: {
                  pluginSearchLoading: false,
                }
              }
            );
          } else {
            logger.error('Plugin unzip failed!')
          }
        } else {
          logger.error('Plugin download failed!')
        }

      })();

      function waitUnzip() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 2000);

        });
      }

      function downloadNew() {
        return new Promise(resolve => {
          try {
            const filename = homePath + '/Tdarr/Plugins/temp.zip'
            if (fs.existsSync(filename)) {
              fs.unlinkSync(filename)
            }
            progress(request('https://github.com/HaveAGitGat/Tdarr_Plugins/archive/master.zip'), {
            })
              .on('progress', function (state) {
              })
              .on('error', function (err) {
                // Do something with err 
                logger.error(err)
                resolve('Error!')
              })
              .on('end', function () {
                // Do something after request finishes 
                logger.info('Finished downloading plugins!')
                resolve('Done!')
              })
              .pipe(fs.createWriteStream(filename))
          } catch (err) {
            logger.error(err)

            resolve('Error!')
          }
        });
      }

      function unzip() {
        return new Promise(resolve => {
          try {
            var zipPath = homePath + '/Tdarr/Plugins/temp.zip'
            var unzipPath = homePath + '/Tdarr/Plugins/temp'
            if (!fs.existsSync(zipPath)) {
              logger.error('Zip path does not exist!')
              resolve('Error!')
            } else {
              var stream = fs.createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: unzipPath }))
                .on('error', err => {
                })
                .on('finish', function () {
                  resolve('Done!')
                })
            }
          } catch (err) {
            logger.error(err)
            resolve('Error!')
          }
        });
      }

    }, 'setAllStatus'(DB_id, mode, table, processStatus) {

      //Files transcode/health check status is reset from either the library 'Options' or from the table 'Re-qeueue' button
      var allFiles

      //from table requeue buttons
      if (DB_id == "all") {
        if (table == "table1") {
          allFiles = table1data
        } else if (table == "table2") {
          allFiles = table2data
        } else if (table == "table3") {
          allFiles = table3data
        } else if (table == "table4") {
          allFiles = table4data
        } if (table == "table5") {
          allFiles = table5data
        } if (table == "table6") {
          allFiles = table6data
        }
      } else

        //from library options
        if (DB_id != "all") {
          allFiles = allFilesPulledTable
          allFiles = allFiles.filter(row => row.DB == DB_id);
        }

      for (var i = 0; i < allFiles.length; i++) {

        try {
          var tempObj = {
            //[mode]: 'Queued',
            [mode]: processStatus,
          }
          Meteor.call('modifyFileDB', 'update', allFiles[i].file, tempObj, (error, result) => { })
        } catch (err) { logger.error(err.stack) }
      }
    },

    'verifyFolder'(folderPath, DB_id, folderType) {
      try {
        folderPath = folderPath.replace(/\\/g, "/");

        if (fs.existsSync(folderPath)) {
          SettingsDB.upsert(
            DB_id,
            {
              $set: {
                [folderType]: true,
              }
            }
          );

          try {
            var folders = getDirectories(folderPath)
          } catch (err) { var folders = [] }

          folders = folders.map((row) => {
            return {
              fullPath: path.join(folderPath, row),
              folder: row
            }
          }
          )

          return folders
        } else {
          SettingsDB.upsert(
            DB_id,
            {
              $set: {
                [folderType]: false,
              }
            }
          );
          folderPath2 = folderPath.split('/')
          var idx = folderPath2.length - 1
          folderPath2.splice(idx, 1)
          folderPath2 = folderPath2.join('/')

          try {
            var folders = getDirectories(folderPath)
          } catch (err) { var folders = [] }

          folder = folders.map((row) => {
            return {
              fullPath: path.join(folderPath, row),
              folder: row
            }
          }
          )

          return folders
        }

        function getDirectories(path) {
          return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
          });
        }
      } catch (err) { logger.error(err.stack) }

    },

    'getWorkers'() {
      return workerDB
    },

    'getLog'() {
      var log = LogDB.find({}).fetch()
      log = log.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      GlobalSettingsDB.upsert('globalsettings',
        {
          $set: {
            logsLoading: false,
          }
        }
      );

      return log
    },

    'clearLogDB'() {
      LogDB.remove({})
      GlobalSettingsDB.upsert('globalsettings',
        {
          $set: {
            logsLoading: false,
            propertySearchLoading: false,
            pluginSearchLoading: false,
          }
        }
      );

    }, 'clearDB'() {
      LogDB.remove({})
      Meteor.call('modifyFileDB', 'removeAll', (error, result) => { })
      SettingsDB.remove({})
      StatisticsDB.remove({})
      ClientDB.remove({})
      GlobalSettingsDB.remove({})
    },

    'upsertWorkers'(w_id, obj) {
      upsertWorker(w_id, obj)
    },

    //launch worker
    'launchWorker'(workerType, number) {

      for (var i = 1; i <= number; i++) {
        launchWorkerModule(workerType)
      }

      return null
    },

    'killWorker'(workerID, file, mode) {
      var messageOut = [
        "suicide",
      ];

      try {
        workers[workerID].send(messageOut);
      } catch (err) { logger.error(err.stack) }
    },

    'cancelWorkerItem'(workerID) {
      var messageOut = [
        "exitThread",
      ];
      try {
        workers[workerID].send(messageOut);
      } catch (err) { logger.error(err.stack) }
    }, 'scanFiles'(DB_id, arrayOrPath, arrayOrPathSwitch, mode, filePropertiesToAdd) {

      //arrayOrPath: array or string
      //arrayOrPathSwitch:   0 (array) or 1 (path)
      //mode: 0 (scan for new files only) or 1 (full fresh scan) or 3 (array of files coming in from folder watcher)
      //filePropertiesToAdd: obj of properties to add to newly scanned files
      //prevent multiple scans being done on same library (if not folder watcher files)
      if (runningScans.includes(DB_id) && (mode == 0 || mode == 1)) {
        logger.warn('Scan is already running on library')
      } else {
        if (mode == 0 || mode == 1) {
          runningScans.push(DB_id)
        }

        var scannerID = shortid.generate()

        if (mode == 0) {
          logger.info("Commencing file update scan. Deleting non-existent files and adding new files.")
          var filesInDB = allFilesPulledTable

          for (var i = 0; i < filesInDB.length; i++) {
            try {

              if ((!filesInDB[i].file || !(fs.existsSync(filesInDB[i].file))) && (filesInDB[i].DB == DB_id || filesInDB[i].DB == undefined)) {
                //delete files in DBs if not exist anymore (cleanse)
                logger.info("File does not exist anymore, removing:" + filesInDB[i].file)
                Meteor.call('modifyFileDB', 'removeOne', filesInDB[i]._id, (error, result) => { })
                filesInDB.splice(i, 1)
                i--
              }
            } catch (err) { }
          }

          filesInDB = filesInDB.filter(row => row.DB == DB_id);
          filesInDB = filesInDB.map((file, i) => {
            if (file.file) {
              return file.file
            }
          })

          filesInDB = filesInDB.map(row => row + '\r\n')
          filesInDB = filesInDB.join("")

          try {

            if (isDocker()) {
              fs.writeFileSync("/temp/" + scannerID + ".txt", filesInDB, 'utf8');
            } else {
              fs.writeFileSync(homePath + "/Tdarr/Data/" + scannerID + ".txt", filesInDB, 'utf8');
            }
          } catch (err) {
            logger.error(err.stack)
          }

          filesInDB = []
        } else if (mode == 1) {
          logger.info("Commencing fresh file scan.")
          Meteor.call('modifyFileDB', 'removeByDB', DB_id, (error, result) => { })
        } else if (mode == 3) {
          arrayOrPath = arrayOrPath.map(row => row + '\r\n')
          arrayOrPath = arrayOrPath.join("")
          try {
            if (isDocker()) {
              fs.writeFileSync("/temp/" + scannerID + ".txt", arrayOrPath, 'utf8');
            } else {
              fs.writeFileSync(homePath + "/Tdarr/Data/" + scannerID + ".txt", arrayOrPath, 'utf8');
            }
          } catch (err) {
            logger.error("Error writing to file: " + err.stack)
          }
          arrayOrPath = []
        }

        if (mode == 0 || mode == 1) {
          SettingsDB.upsert(DB_id,
            {
              $set: {
                scanButtons: false,
                scanFound: "Files found:" + 0,
              }
            }
          );
        }

        var thisItemsLib = SettingsDB.find({ _id: DB_id }, { sort: { createdAt: 1 } }).fetch()
        var allowedContainers = thisItemsLib[0].containerFilter
        allowedContainers = allowedContainers.split(',');
        var closedCaptionScan = thisItemsLib[0].closedCaptionScan
        var foldersToIgnore = thisItemsLib[0].foldersToIgnore
        var globSettings = GlobalSettingsDB.find({}, {}).fetch()[0]
        var resBoundaries = globSettings.resBoundaries
        var scannerPath = "assets/app/fileScanner/fileScanner.js"
        var childProcess = require("child_process");
        var child_argv = [
          scannerID,
          DB_id,
          arrayOrPath,
          arrayOrPathSwitch,
          allowedContainers,
          mode,
          JSON.stringify(filePropertiesToAdd),
          homePath,
          closedCaptionScan,
          foldersToIgnore,
          JSON.stringify(resBoundaries),
        ]

        fileScanners[scannerID] = childProcess.fork(scannerPath, child_argv);
        logger.info("" + "Scanner " + scannerID + " launched" + "")
        fileScanners[scannerID].on("exit", Meteor.bindEnvironment(function (code, signal) {
          logger.info("" + "File scanner exited" + "")
        }));

        fileScanners[scannerID].on("error", console.error.bind(console));
        fileScanners[scannerID].on('message', Meteor.bindEnvironment(function (message) {

          if (message[1] == "pathRequest") {
          }

          if (message[1] == "addFileToDB") {
            var jsonData = JSON.parse(message[2]);

            if (jsonData.createdAt) {
              jsonData.createdAt = new Date(jsonData.createdAt);
            }

            if (jsonData.lastHealthCheckDate) {
              jsonData.lastHealthCheckDate = new Date(jsonData.lastHealthCheckDate);
            }

            if (jsonData.lastTranscodeDate) {
              jsonData.lastTranscodeDate = new Date(jsonData.lastTranscodeDate);
            }

            if (typeof jsonData === 'object' && jsonData !== null) {
              //  logger.info("jsonData is object")
            } else {
              //   logger.info("jsonData isn't object")
            }

            logger.info(`Add file to DB request received for: ${jsonData._id}. Queueing`)
            filesToAddToDB.push(jsonData)
          }

          if (message[1] == "updateScanFound") {
            SettingsDB.upsert(message[2],
              {
                $set: {
                  scanFound: message[3],
                }
              }
            );
          }

          if (message[1] == "finishScan") {
            logger.info("Scanner " + message[0] + ":Finished");
            var indexEle = runningScans.indexOf(message[2])
            runningScans.splice(indexEle, 1)
            SettingsDB.upsert(message[2],
              {
                $set: {
                  scanButtons: true,
                }
              }
            );
          }

          if (message[1] == "consoleMessage") {
            var type = message[2]
            var string = "Scanner " + message[0] + ":" + message[3] + ""
            loggerFunc(type,string);
          }
        }));
      }
    },

    'returnPieFiles'(property, fileMedium, detail, DB_id) {
      var allFilesWithProp = allFilesPulledTable

      if (DB_id != "all") {
        allFilesWithProp = allFilesWithProp.filter(row => row.DB == DB_id);
      }

      if (fileMedium == "video" || fileMedium == "audio") {
        allFilesWithProp = allFilesWithProp.filter(row => (!!row[property] && row.fileMedium == fileMedium));
      } else {
        allFilesWithProp = allFilesWithProp.filter(row => (!!row[property]));
      }

      allFilesWithProp = allFilesWithProp.filter(row => row[property] == detail)

      for (var i = 0; i < allFilesWithProp.length; i++) {
        var tFiles = transcodeFiles.map(row => row.file)
        var hFiles = healthcheckFiles.map(row => row.file)
        allFilesWithProp[i].tPosition = tFiles.indexOf(allFilesWithProp[i].file) + 1
        allFilesWithProp[i].hPosition = hFiles.indexOf(allFilesWithProp[i].file) + 1
      }

      return allFilesWithProp
    },

    'runHelpCommand'(mode, text) {
      logger.info(mode, text)

      if (mode == "handbrake") {
        workerCommand = getHandBrakePath() + " " + text
      } else if (mode == "ffmpeg") {
        workerCommand = getFFmpegPath() + " " + text
      }

      logger.info(workerCommand)
      
      fs.writeFileSync(homePath + "/Tdarr/Data/" + mode + ".txt", "", 'utf8');
      var shellWorker = shell.exec(workerCommand, function (code, stdout, stderr, stdin) {
        logger.info('Exit code:', code);
        fs.appendFileSync(homePath + "/Tdarr/Data/" + mode + ".txt", stdout + '\n', 'utf8');
        fs.appendFileSync(homePath + "/Tdarr/Data/" + mode + ".txt", stderr + '\n', 'utf8');
      });
    },

    'readHelpCommandText'() {

      try {
        var ffmpegText = fs.readFileSync(homePath + "/Tdarr/Data/ffmpeg.txt", 'utf8')
      } catch (err) {
        logger.error(err.stack)
        var ffmpegText = ''
      }

      try {
        var handbrakeText = fs.readFileSync(homePath + "/Tdarr/Data/handbrake.txt", 'utf8')
      } catch (err) {
        logger.error(err.stack)
        var handbrakeText = ''
      }

      return [ffmpegText, handbrakeText]
    },

    'createSample'(filePath) {
      logger.info(filePath)
      var inputFile = filePath
      var outputFile = filePath.split(".")
      outputFile[outputFile.length - 2] = outputFile[outputFile.length - 2] + " - TdarrSample"
      outputFile = outputFile.join(".")
      outputFile = outputFile.split("/")
      outputFile = homePath + "/Tdarr/Samples/" + outputFile[outputFile.length - 1]
      var inputFileUnix = inputFile.replace(/'/g, '\'\"\'\"\'');
      var outputFileUnix = outputFile.replace(/'/g, '\'\"\'\"\'');
      var ffmpegPathUnix = ffmpegPath.replace(/'/g, '\'\"\'\"\'');
      var preset1 = "-ss 00:00:1"
      var preset2 = "-t 00:00:30 -map 0:v? -map 0:a? -map 0:s? -map 0:d? -c copy"
      //  var preset1 = "-ss 00:00:1"
      //  var preset2 = "-t 00:00:30 -c copy -map 0"

      if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile)
      }

      if (process.platform == 'win32') {
        workerCommand = getFFmpegPath() + " " + preset1 + " -i \"" + inputFile + "\" " + preset2 + " \"" + outputFile + "\" "
      } else {
        workerCommand = getFFmpegPath() + " " + preset1 + " -i '" + inputFileUnix + "' " + preset2 + " '" + outputFileUnix + "' "
      }

      var shellWorker = shell.exec(workerCommand, function (code, stdout, stderr, stdin) {
        logger.info('Exit code:', code);
      });
    },
  })

  //Init help page
  Meteor.call('runHelpCommand', "ffmpeg", "--help", function (error, result) { })
  Meteor.call('runHelpCommand', "handbrake", "--help", function (error, result) { })

  //initialise GUI properties
  var settingsInit = SettingsDB.find({}, {}).fetch()

  for (var i = 0; i < settingsInit.length; i++) {
    SettingsDB.upsert(settingsInit[i]._id,
      {
        $set: {
          scanButtons: true,
          scanFound: "Files found:" + 0,
        }
      }
    );

    //Add folder watch scan interval
    if (settingsInit[i].folderWatchScanInterval == undefined) {
      SettingsDB.upsert(settingsInit[i]._id,
        {
          $set: {
            folderWatchScanInterval: 30,
          }
        }
      );
    }

    //Run scan on start if needed
    if (settingsInit[i].scanOnStart !== false) {
      var obj = {
        HealthCheck: "Queued",
        TranscodeDecisionMaker: "Queued",
        cliLog: "",
        bumped: false,
        history: ""
      }
      Meteor.call('scanFiles', settingsInit[i]._id, settingsInit[i].folder, 1, 0, obj, function (error, result) { });
    }
  }

  //runScheduledManualScan()
  //run find-new scan every hour
  setTimeout(Meteor.bindEnvironment(runScheduledManualScan), 86400000);

  function runScheduledManualScan() {
    logger.info("Running hourly scan!")

    try {
      var settingsInit = SettingsDB.find({}, {}).fetch()

      for (var i = 0; i < settingsInit.length; i++) {

        if (settingsInit[i].scanOnStart !== false) {

          var obj = {
            HealthCheck: "Queued",
            TranscodeDecisionMaker: "Queued",
            cliLog: "",
            bumped: false,
            history: ""
          }
          Meteor.call('scanFiles', settingsInit[i]._id, settingsInit[i].folder, 1, 0, obj, function (error, result) { });
        }
      }
    } catch (err) {
      logger.error(err.stack)
    }

    setTimeout(Meteor.bindEnvironment(runScheduledManualScan), 3600000);
  }

  var shell = require('shelljs');
  scheduledPluginUpdate()

  function scheduledPluginUpdate() {
    logger.info('Updating plugins')

    try {
      Meteor.call('updatePlugins', function (error, result) {
      });
    } catch (err) {
      logger.error(err.stack)
    }

    setTimeout(Meteor.bindEnvironment(scheduledPluginUpdate), 3600000);
  }

  scheduledCacheClean()
  function scheduledCacheClean() {

    try {
      var settings = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch()

      for (var i = 0; i < settings.length; i++) {
        try {
          traverseDir(settings[i].cache)
        } catch (err) {
          logger.error(err.stack)
        }
      }

      function traverseDir(inputPathStem) {

        try {
          fs.readdirSync(inputPathStem).forEach(file => {
            var fullPath = (path.join(inputPathStem, file)).replace(/\\/g, "/");
            function isBeingProcessed(filePath) {
              for (var i = 0; i < filesBeingProcessed.length; i++) {
                var base = filesBeingProcessed[i].split("/")
                base = base[base.length - 1]
                base = base.split(".")
                base = base[base.length - 2]
                if (filePath.includes(base)) {
                  return true
                }
              }
              return false
            }

            try {

              if (isBeingProcessed(fullPath) == false && fullPath.includes("TdarrCacheFile")) {
                logger.info("Removing:" + fullPath)

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
                logger.info("File not Tdarr cache file, won't remove:" + fullPath)
              } else {
                logger.warn("Cache file in use, won't remove:" + fullPath)
              }
            } catch (err) {
              logger.error(err.stack);
            }
          });
        } catch (err) { logger.error(err.stack) }
      }
    } catch (err) { logger.error(err.stack) }
    // setTimeout(Meteor.bindEnvironment(scheduledCacheClean), 10000);
  }

  function findWorker(w_id) {

    if (w_id) {
      var idx = workerDB.findIndex(row => row._id == w_id);

      if (idx >= 0) {
        return [workerDB[idx]]
      } else {
        return []
      }
    } else {
      return workerDB
    }
  }

  function removeWorker(w_id) {
    var idx = workerDB.findIndex(row => row._id == w_id);

    if (idx >= 0) {
      workerDB.splice(idx, 1)
    }
  }

  function upsertWorker(w_id, obj) {
    var idx = workerDB.findIndex(row => row._id == w_id);

    if (idx >= 0) {
      Object.keys(obj).forEach(function (key) {
        try {
          workerDB[idx][key] = obj[key]
        } catch (err) {
          logger.error(err.stack)
        }
      });
    } else {
      if (obj.created != undefined) {
        workerDB.push({ _id: w_id })
        upsertWorker(w_id, obj)
      }
    }
  }

  function launchWorkerModule(workerType) {
    var workerID = shortid.generate()
    var workerPath = "assets/app/worker1.js"
    var childProcess = require("child_process");
    var child_argv = [
      workerID,
      workerType,
    ]

    //workers.push(childProcess.fork(path.join(__dirname, workerPath ),[], { silent: true }));
    //use this
    //workers[workerID - 1] = childProcess.fork(path.join(__dirname, workerPath), child_argv);
    workers[workerID] = childProcess.fork(workerPath, child_argv);
    logger.info("" + "Worker " + workerID + " launched" + "")

    // workers[workerID - 1].stdout.on('data', function(data) {
    // //logger.info('stdout: ' + data);
    // //Here is where the output goes
    // });

    workers[workerID].on("exit", Meteor.bindEnvironment(function (code, signal) {
      logger.info("" + "Worker exited" + "")
    }));

    workers[workerID].on("error", console.error.bind(console));
    workers[workerID].on('message', Meteor.bindEnvironment(function (message) {

      // logger.info("Worker "+message[0]+":"+message+"");
      //  logger.info("Message:" + message);

      if (message[1] == "deleteThisFile") {
      }

      if (message[1] == "exitRequest") {
        var exitMessage = [
          "exitApproved",
        ];
        workers[message[0]].send(exitMessage);
        workers[message[0]] = "idle"
        removeWorker(message[0])
      }

      if (message[1] == "consoleMessage") {
        var type = message[2]
        var string = "Worker " + message[0] + ":" + message[3] + ""
        loggerFunc(type,string);
      }

      if (message[1] == "queueRequest") {
        var workerType = message[2]
        var workerStats = findWorker(message[0])

        if (!(workerStats[0] === undefined) && !(workerStats[0].idle === undefined) && workerStats[0].idle == true) {
          var exitMessage = [
            "exitApproved",
          ];

          workers[message[0]].send(exitMessage);
          removeWorker(message[0])
          workers[message[0]] = "idle"

        } else {
          getNewTask()

          function getNewTask() {

            if (workerType == "general") {
              var files = generalFiles
            } else if (workerType == "transcode") {
              var files = transcodeFiles
              var mode = "transcode"
            } else if (workerType == "healthcheck") {
              var files = healthcheckFiles
              var mode = "healthcheck"
            }

            if (!Array.isArray(files) || !files.length) {
              logger.info(`Server: Worker ${message[0]} requesting item. Nothing to process for this worker.`)
              var messageOut = [
                "completed",
              ];
              workers[message[0]].send(messageOut);
            } else {
              var firstItem = files[0]
              files.splice(0, 1)

              if (filesBeingProcessed.includes(firstItem.file + "")) {
                var messageOut = [
                  "requestNewItem",
                ]
                workers[message[0]].send(messageOut);
              } else {
                filesBeingProcessed.push(firstItem.file + "")
                var originalID = firstItem._id
                var tempObj = {
                  _id: firstItem.file,
                  processingStatus: true

                }
                Meteor.call('modifyFileDB', 'update', firstItem.file, tempObj, (error, result) => { })

                if (workerType == "general") {

                  if (firstItem.HealthCheck == "Queued" && firstItem.fileMedium == "video") {
                    var mode = "healthcheck"
                  } else if (firstItem.TranscodeDecisionMaker == "Queued") {
                    var mode = "transcode"
                  }
                }

                var settings = SettingsDB.find({ _id: firstItem.DB }, { sort: { createdAt: 1 } }).fetch()
                var ffmpegNVENCBinary = (GlobalSettingsDB.find({}, {}).fetch())[0].ffmpegNVENCBinary

                //Settings from SettingsDB
                var settingsDBIndex = firstItem.DB
                var inputFolderStem = (settings[0].folder).replace(/\\/g, "/");
                var outputFolder = (settings[0].cache).replace(/\\/g, "/");
                var folderToFolderConversionEnabled = settings[0].folderToFolderConversion
                try {
                  var folderToFolderConversionFolder = (settings[0].output).replace(/\\/g, "/");
                } catch (err) { var folderToFolderConversionFolder = "" }
                var container = settings[0].container
                var preset = settings[0].preset
                var handBrakeMode = settings[0].handbrake
                var FFmpegMode = settings[0].ffmpeg
                var handbrakescan = settings[0].handbrakescan
                var ffmpegscan = settings[0].ffmpegscan
                var processFile = true
                var cliLogAdd = ""
                var reQueueAfter = false
                var TranscodeDecisionMaker = false
                var copyIfConditionsMet = settings[0].copyIfConditionsMet
                var lastPluginDetails = ''

                //  logger.info(util.inspect(firstItem, {showHidden: false, depth: null}))
                if (mode == "healthcheck") {
                  if (handbrakescan == false && ffmpegscan == false) {
                    cliLogAdd += 'Skipping health check! \n'
                  } else {
                    cliLogAdd += 'Health check! \n'

                    if (handbrakescan == true) {
                      handBrakeMode = true
                      FFmpegMode = false
                      preset = "--scan"

                    } else if (ffmpegscan == true) {
                      handBrakeMode = false
                      FFmpegMode = true
                      preset = "-v error, -f null -max_muxing_queue_size 9999"
                    }

                    var frameCount = 1
                    var messageOut = [
                      "queueNumber",
                      mode, //update
                      firstItem.file,
                      inputFolderStem,
                      outputFolder,
                      container,
                      preset,
                      handBrakeMode,
                      FFmpegMode,
                      frameCount,
                      settingsDBIndex,
                      reQueueAfter,
                      firstItem,
                      folderToFolderConversionEnabled,
                      folderToFolderConversionFolder,
                      processFile,
                      settings[0],
                      ffmpegNVENCBinary,
                      null,
                      null,
                    ]
                  }
                } else if (mode == "transcode") {

                  //Transcode decision maker
                  //Plugin filter
                  if (settings[0].decisionMaker.pluginFilter == true) {
                    var pluginsSelected = settings[0].pluginIDs
                    pluginsSelected = pluginsSelected.sort(function (a, b) {
                      return a.priority - b.priority;
                    });

                    pluginsSelected = pluginsSelected.filter(row => row.checked);
                    var preProcPluginSelected = false

                    for (var i = 0; i < pluginsSelected.length; i++) {
                      try {
                        var pluginID = pluginsSelected[i]._id
                        var pluginLocalPath = path.join(process.cwd(), `/assets/app/plugins/${pluginsSelected[i].source}/` + pluginID + '.js')
                        fsextra.copySync(homePath + `/Tdarr/Plugins/${pluginsSelected[i].source}/` + pluginID + '.js', pluginLocalPath)
                        lastPluginDetails = {
                          source: pluginsSelected[i].source,
                          id: pluginID,
                          number: (i + 1) + '/' + pluginsSelected.length
                        }
                        var otherArguments = {
                          homePath: homePath,
                          handbrakePath: getHandBrakePath(),
                          ffmpegPath: getFFmpegPath()
                        }
                        var librarySettings = settings[0]
                        var plugin = importFresh(pluginLocalPath)
                        var pluginInputs = SettingsDB.find({ _id: firstItem.DB }, { sort: { createdAt: 1 } }).fetch()[0].pluginIDs.filter(row => row._id == pluginID)[0].InputsDB

                        if (plugin.details().Stage == undefined || plugin.details().Stage == 'Pre-processing') {
                          cliLogAdd += plugin.details().id + " - Pre-processing\n"
                          preProcPluginSelected = true
                          var response = plugin.plugin(firstItem, librarySettings, pluginInputs, otherArguments);

                          if (response && response.removeFromDB == true) {
                            Meteor.call('modifyFileDB', 'removeOne', response.file._id, (error, result) => { })
                            Meteor.call('modifyFileDB', 'removeOne', originalID, (error, result) => { })
                          }

                          if (response && response.updateDB == true) {
                            Meteor.call('modifyFileDB', 'removeOne', response.file._id, (error, result) => { })
                            Meteor.call('modifyFileDB', 'removeOne', originalID, (error, result) => { })
                            Meteor.call('modifyFileDB', 'insert', response.file._id, response.file, (error, result) => { })
                            firstItem = { ...firstItem, ...response.file };
                          }

                          //run post processing functions inside - pre-processing plugins (last run plugin ID must match)
                          if (firstItem.lastPluginDetails && firstItem.lastPluginDetails.id === pluginID) {
                            cliLogAdd += plugin.details().id + " - Transcode success post processing\n"
                            try {
                              var temp = plugin.onTranscodeSuccess(firstItem, librarySettings, pluginInputs, otherArguments);

                              if (temp && temp.removeFromDB == true) {
                                Meteor.call('modifyFileDB', 'removeOne', temp.file._id, (error, result) => { })
                                Meteor.call('modifyFileDB', 'removeOne', originalID, (error, result) => { })
                              }

                              if (temp && temp.updateDB == true) {
                                Meteor.call('modifyFileDB', 'removeOne', temp.file._id, (error, result) => { })
                                Meteor.call('modifyFileDB', 'removeOne', originalID, (error, result) => { })
                                Meteor.call('modifyFileDB', 'insert', temp.file._id, temp.file, (error, result) => { })
                                firstItem = { ...firstItem, ...temp.file };
                              }
                            } catch (err) { }
                          }

                          console.dir(response)
                          processFile = response.processFile
                          if (processFile === undefined) {
                            throw 'No proceesFile value returned from plugin!'
                          }
                          preset = response.preset
                          container = response.container
                          handBrakeMode = response.handBrakeMode
                          FFmpegMode = response.FFmpegMode
                          reQueueAfter = response.reQueueAfter
                          cliLogAdd += response.infoLog

                          if (processFile == true && plugin.details().Operation == "Filter") {
                            //do nothing
                          } else if (processFile == false && plugin.details().Operation == "Filter") {
                            break
                          } else if (processFile == true) {
                            break
                          }
                        }

                      } catch (err) {
                        logger.error(err)
                        // err = JSON.stringify(err)
                        processFile = false
                        preset = ''
                        container = ''
                        handBrakeMode = ''
                        FFmpegMode = ''
                        reQueueAfter = ''
                        cliLogAdd += `☒Plugin error! ${err} \n`
                        TranscodeDecisionMaker = "Transcode error"
                        break
                      }
                    }

                    if (preProcPluginSelected == false) {
                      processFile = false
                      preset = ''
                      container = ''
                      handBrakeMode = ''
                      FFmpegMode = ''
                      reQueueAfter = ''
                      cliLogAdd += '☒No pre-processing plugins selected!  \n'
                    }

                    //Video settings
                  } else if (settings[0].decisionMaker.videoFilter == true) {

                    if (firstItem.fileMedium !== "video") {
                      logger.info("File is not video")
                      cliLogAdd += "☒File is not video \n"
                      processFile = false;
                    } else {
                      video_codec_names_exclude = settings[0].decisionMaker.video_codec_names_exclude
                      video_codec_names_exclude = video_codec_names_exclude.map(row => {
                        if (row.checked == true) {
                          return row.codec
                        }
                      })

                      if (settings[0].decisionMaker.videoExcludeSwitch == false) {

                        if (video_codec_names_exclude.includes(firstItem.ffProbeData.streams[0]["codec_name"]) && typeof firstItem.ffProbeData.streams[0]["codec_name"] !== 'undefined') {
                          logger.info(video_codec_names_exclude + "   " + firstItem.video_codec_name)
                          logger.info("File codec included in transcode whitelist")
                          cliLogAdd += "☑File codec included in transcode whitelist  \n"
                        } else {
                          cliLogAdd += "☒File codec not included in transcode whitelist  \n"
                          processFile = false;
                        }
                      } else {

                        if (video_codec_names_exclude.includes(firstItem.ffProbeData.streams[0]["codec_name"]) && typeof firstItem.ffProbeData.streams[0]["codec_name"] !== 'undefined') {
                          logger.info(video_codec_names_exclude + "   " + firstItem.video_codec_name)
                          logger.info("File video already in required codec")
                          cliLogAdd += "☑File already in required codec  \n"
                          processFile = false;
                        } else {
                          cliLogAdd += "☒File video not in required codec  \n"
                        }
                      }

                      if (firstItem.file_size >= settings[0].decisionMaker.video_size_range_include.max || firstItem.file_size <= settings[0].decisionMaker.video_size_range_include.min) {
                        logger.info("File not in video size range")
                        cliLogAdd += "☒File not in video size range  \n"
                        processFile = false;
                      } else {
                        cliLogAdd += "File in video size range \n"
                      }

                      if (firstItem.ffProbeData.streams[0]["height"] >= settings[0].decisionMaker.video_height_range_include.max || firstItem.ffProbeData.streams[0]["height"] <= settings[0].decisionMaker.video_height_range_include.min) {
                        logger.info("File not in video height range")
                        cliLogAdd += "☒File not in video height range  \n"
                        processFile = false;
                      } else {
                        cliLogAdd += "File in video height range \n"
                      }

                      if (firstItem.ffProbeData.streams[0]["width"] >= settings[0].decisionMaker.video_width_range_include.max || firstItem.ffProbeData.streams[0]["width"] <= settings[0].decisionMaker.video_width_range_include.min) {
                        logger.info("File not in video width range")
                        cliLogAdd += "☒File not in video width range  \n"
                        processFile = false;
                      } else {
                        cliLogAdd += "File in video width range  \n"
                      }
                    }
                  } else if (settings[0].decisionMaker.audioFilter == true) {

                    if (firstItem.fileMedium !== "audio") {
                      logger.info("File is not audio")
                      cliLogAdd += "☒File is not audio  \n"
                      processFile = false;
                    } else {
                      audio_codec_names_exclude = settings[0].decisionMaker.audio_codec_names_exclude
                      audio_codec_names_exclude = audio_codec_names_exclude.map(row => {
                        if (row.checked == true) {
                          return row.codec
                        }
                      })

                      if (settings[0].decisionMaker.audioExcludeSwitch == false) {

                        if (audio_codec_names_exclude.includes(firstItem.ffProbeData.streams[0]["codec_name"]) && typeof firstItem.ffProbeData.streams[0]["codec_name"] !== 'undefined') {
                          logger.info("File codec included in transcode whitelist")
                          cliLogAdd += "☑File codec included in transcode whitelist  \n"
                        } else {
                          cliLogAdd += "☒File codec not included in transcode whitelist  \n"
                          processFile = false;
                        }
                      } else {

                        if (audio_codec_names_exclude.includes(firstItem.ffProbeData.streams[0]["codec_name"]) && typeof firstItem.ffProbeData.streams[0]["codec_name"] !== 'undefined') {
                          logger.info("File already in required codec")
                          cliLogAdd += "☑File already in required codec  \n"
                          processFile = false;
                        } else {
                          cliLogAdd += "☒File audio not in required codec  \n"
                        }
                      }

                      if (firstItem.file_size >= settings[0].decisionMaker.audio_size_range_include.max || firstItem.file_size <= settings[0].decisionMaker.audio_size_range_include.min) {
                        logger.info("File not in audio size range")
                        cliLogAdd += "☒File not in audio size range  \n"
                        processFile = false;
                      } else {
                        cliLogAdd += "File in audio size range  \n"
                      }
                    }
                  } else {
                    cliLogAdd += "☒No library settings selected.  \n"
                    processFile = false;
                  }

                  if (firstItem.ffProbeData == undefined || firstItem.ffProbeData.streams[0]["nb_frames"] == undefined || firstItem.ffProbeData.streams[0] == undefined) {
                    var frameCount = "undefined"
                  } else {
                    var frameCount = firstItem.ffProbeData.streams[0]["nb_frames"]
                  }

                  var messageOut = [
                    "queueNumber",
                    mode, //update
                    firstItem.file,
                    inputFolderStem,
                    outputFolder,
                    container,
                    preset,
                    handBrakeMode,
                    FFmpegMode,
                    frameCount,
                    settingsDBIndex,
                    reQueueAfter,
                    firstItem,
                    folderToFolderConversionEnabled,
                    folderToFolderConversionFolder,
                    processFile,
                    settings[0],
                    ffmpegNVENCBinary,
                    TranscodeDecisionMaker,
                    lastPluginDetails,
                  ]
                }

                if (mode == "healthcheck" && handbrakescan == false && ffmpegscan == false) {
                  var tempObj = {
                    _id: firstItem.file,
                    HealthCheck: "Ignored",
                    processingStatus: false,
                    cliLog: cliLogAdd,
                    lastHealthCheckDate: new Date(),

                  }

                  Meteor.call('modifyFileDB', 'update', firstItem.file, tempObj, (error, result) => { })
                  removeFromProcessing(originalID)
                  var messageOut = [
                    "requestNewItem",

                  ]
                  workers[message[0]].send(messageOut);
                }

                //File filtered out by transcode decision maker
                else if ((processFile == false && folderToFolderConversionEnabled !== true) || (processFile == false && folderToFolderConversionEnabled === true && copyIfConditionsMet === false)) {

                  //post processing script
                  if (settings[0].decisionMaker.pluginFilter == true) {
                    try {
                      var pluginsSelected = settings[0].pluginIDs
                      pluginsSelected = pluginsSelected.sort(function (a, b) {
                        return a.priority - b.priority;
                      });
                      pluginsSelected = pluginsSelected.filter(row => row.checked);
                      var postProcPluginSelected = false

                      for (var i = 0; i < pluginsSelected.length; i++) {

                        try {
                          var pluginID = pluginsSelected[i]._id
                          var pluginLocalPath = path.join(process.cwd(), `/assets/app/plugins/${pluginsSelected[i].source}/` + pluginID + '.js')
                          fsextra.copySync(homePath + `/Tdarr/Plugins/${pluginsSelected[i].source}/` + pluginID + '.js', pluginLocalPath)
                          lastPluginDetails = {
                            source: pluginsSelected[i].source,
                            id: pluginID,
                          }
                          var otherArguments = {
                            homePath: homePath,
                            handbrakePath: getHandBrakePath(),
                            ffmpegPath: getFFmpegPath()
                          }
                          var librarySettings = settings[0]
                          var plugin = importFresh(pluginLocalPath)
                          var pluginInputs = SettingsDB.find({ _id: firstItem.DB }, { sort: { createdAt: 1 } }).fetch()[0].pluginIDs.filter(row => row._id == pluginID)[0].InputsDB

                          if (plugin.details().Stage == 'Post-processing') {
                            cliLogAdd += plugin.details().id + " - Post-processing\n"
                            postProcPluginSelected = true
                            var response = plugin.plugin(firstItem, librarySettings, pluginInputs, otherArguments);

                            if (response && response.removeFromDB == true) {
                              Meteor.call('modifyFileDB', 'removeOne', response.file._id, (error, result) => { })
                              Meteor.call('modifyFileDB', 'removeOne', originalID, (error, result) => { })
                            }

                            if (response && response.updateDB == true) {
                              Meteor.call('modifyFileDB', 'removeOne', response.file._id, (error, result) => { })
                              Meteor.call('modifyFileDB', 'removeOne', originalID, (error, result) => { })
                              Meteor.call('modifyFileDB', 'insert', response.file._id, response.file, (error, result) => { })
                              firstItem = { ...firstItem, ...response.file };
                            }
                            cliLogAdd += response.infoLog
                          }
                        } catch (err) {
                          logger.error(err)
                          logger.error('final post processing failed' + i)
                        }
                      }
                    } catch (err) {
                      logger.error(err)
                      logger.error('final post processing failed')
                    }
                  }

                  if (preProcPluginSelected == false && postProcPluginSelected == false) {
                    cliLogAdd += '☒No pre or post-processing plugins selected!  \n'
                    TranscodeDecisionMaker = "Transcode error"
                  }

                  //TranscodeDecisionMaker status first depends on if error encountered during plugins, else depends on
                  // if file has already been processed or not (no oldSize if it hasn't been processed)
                  var tempObj = {
                    _id: firstItem.file,
                    TranscodeDecisionMaker: TranscodeDecisionMaker != false ? TranscodeDecisionMaker : firstItem.oldSize ? "Transcode success" : "Not required",
                    processingStatus: false,
                    cliLog: cliLogAdd,
                    lastTranscodeDate: new Date(),
                    bumped: false,
                    lastPluginDetails: 'none'

                  }
                  Meteor.call('modifyFileDB', 'update', firstItem.file, tempObj, (error, result) => { })
                  removeFromProcessing(originalID)
                  var messageOut = [
                    "requestNewItem",

                  ]
                  workers[message[0]].send(messageOut);
                } else {

                  try {
                    var sourcefileSizeInGbytes = (((fs.statSync(firstItem.file)).size) / 1000000000.0);
                  } catch (err) {
                    logger.error(err.stack)
                    var sourcefileSizeInGbytes = "Error"
                  }

                  if (handBrakeMode == true) {
                    var CLIType = "HandBrake"
                  } else if (FFmpegMode == true) {
                    var CLIType = "FFmpeg"
                  }

                  upsertWorker(message[0], {
                    _id: message[0],
                    file: firstItem.file,
                    mode: workerType,
                    modeType: mode,
                    idle: false,
                    percentage: 0,
                    created: true,
                    cliLogAdd: cliLogAdd,
                    sourcefileSizeInGbytes: sourcefileSizeInGbytes,
                    startTime: new Date(),
                    CLIType: CLIType,
                    preset: preset,
                    ETA: "Calculating...",
                    lastPluginDetails
                  })

                  workers[message[0]].send(messageOut);
                  workerStatus[message[0]] = [firstItem.file + 0 + "", 0]
                }
              }
            }
          }
        }

        //check if this is worker's first request
        if (message[3] == true) {
          //reset worker launch status
          workerLaunched--
        }
      }

      if (message[1] == "processing") {
      }

      if (message[1] == "percentage") {
        upsertWorker(message[0], {
          percentage: message[2],
        })
      }

      if (message[1] == "ETAUpdate") {

        if (message[2] != 'Copying') {
          upsertWorker(message[0], {
            ETA: message[2],
            outputFileSizeInGbytes: message[3],
            estSize: message[4],
          })
        } else {
          upsertWorker(message[0], {
            ETA: message[2],
          })
        }
      }

      if (message[1] == "repair_worker_percentage") {
      }

      if (message[1] == "error") {
        upsertWorker(message[0], {
          _id: message[0],
          percentage: 100
        })

        removeFromProcessing(message[2])

        if (message[4] == "healthcheck") {
          var tempObj = {
            _id: message[2],
            HealthCheck: "Error",
            processingStatus: false,
            cliLog: message[5],
            lastHealthCheckDate: new Date()
          }
          Meteor.call('modifyFileDB', 'update', message[2], tempObj, (error, result) => { })
          StatisticsDB.update("statistics",
            {
              $inc: { totalHealthCheckCount: 1 }
            }
          );
        } else if (message[4] == "transcode") {

          try {
            var lastPluginDetails = message[6]
            var file = message[6]
            var pluginLocalPath = path.join(process.cwd(), `/assets/app/plugins/${lastPluginDetails.source}/` + lastPluginDetails.id + '.js')
            fsextra.copySync(homePath + `/Tdarr/Plugins/${lastPluginDetails.source}/` + lastPluginDetails.id + '.js', pluginLocalPath)
            var librarySettings = SettingsDB.find({ _id: file.DB }, { sort: { createdAt: 1 } }).fetch()[0]
            var otherArguments = {
              homePath: homePath,
              handbrakePath: getHandBrakePath(),
              ffmpegPath: getFFmpegPath()
            }
            var plugin = importFresh(pluginLocalPath)
            var pluginInputs = SettingsDB.find({ _id: file.DB }, { sort: { createdAt: 1 } }).fetch()[0].pluginIDs.filter(row => row._id == lastPluginDetails.id)[0].InputsDB
            var response = plugin.onTranscodeError(file, librarySettings, pluginInputs, otherArguments);

            if (response && response.removeFromDB == true) {
              Meteor.call('modifyFileDB', 'removeOne', response.file._id, (error, result) => { })
            }

            if (response && response.updateDB == true) {
              Meteor.call('modifyFileDB', 'removeOne', response.file._id, (error, result) => { })
              //Meteor.call('modifyFileDB', 'update', response.file._id, response.file, (error, result) => { })
              Meteor.call('modifyFileDB', 'insert', response.file._id, response.file, (error, result) => { })
              message[2] = response.file._id;
            }
          } catch (err) { logger.info('onTranscodeError failed') }
          var tempObj = {
            _id: message[2],
            TranscodeDecisionMaker: "Transcode error",
            processingStatus: false,
            cliLog: message[5],
            lastTranscodeDate: new Date(),
            lastPluginDetails: 'none'
          }
          Meteor.call('modifyFileDB', 'update', message[2], tempObj, (error, result) => { })
        }
      }

      if (message[1] == "success") {
        upsertWorker(message[0], {
          _id: message[0],
          percentage: 100
        })

        if (message[4] == "healthcheck") {
          removeFromProcessing(message[2])
          var tempObj = {
            _id: message[2],
            HealthCheck: "Success",
            processingStatus: false,
            lastHealthCheckDate: new Date()
          }
          Meteor.call('modifyFileDB', 'update', message[2], tempObj, (error, result) => { })
          StatisticsDB.update("statistics",
            {
              $inc: { totalHealthCheckCount: 1 }
            }
          );
          SettingsDB.update(
            message[3],
            {
              $inc: { totalHealthCheckCount: 1 }
            }
          );

        } else if (message[4] == "transcode") {
          removeFromProcessing(message[5])
          Meteor.call('modifyFileDB', 'removeOne', message[5], (error, result) => { })
          newFile = [message[2],]
          Meteor.call('scanFiles', message[3], newFile, 0, 3, JSON.parse(message[6]), function (error, result) { });
          StatisticsDB.update("statistics",
            {
              $inc: {
                totalTranscodeCount: 1,
                sizeDiff: message[7]

              }
            }
          );
          SettingsDB.update(
            message[3],
            {
              $inc: {
                totalTranscodeCount: 1,
                sizeDiff: message[7]
              }
            }
          );
        }
        logger.info(`Server:Worker completed:" ${message[2]}`)
      }

      try {
        if (message[1].includes("Skipped")) {
        }
      } catch (err) { logger.error(err.stack) }
      if (message[1] == "copied") {
      }

      if (message[1] == "copiedFail") {
      }

      //if (message[1] == "originalReplaced") {
      try {
        if (message[1].includes("Original replaced")) {
        }
      } catch (err) { logger.error(err.stack) }

      //if (message[1] == "originalNotReplaced") {
      try {
        if (message[1].includes("Original not replaced")) {
        }
      } catch (err) { logger.error(err.stack) }

      try {
        if (message[1].includes("File repaired")) {
        }
      } catch (err) { logger.error(err.stack) }

      try {
        if (message[1].includes("Unable to repair file")) {
        }
      } catch (err) { logger.error(err.stack) }

      if (message[1] == "FFPROBE") {
      }

      if (message[1] == "cancelled") {
        logger.info("Cancelled message received")
        logger.info(message)

        if (message[5] == "notsuicide") {
          upsertWorker(message[0], {
            _id: message[0],
            percentage: 100
          })
        } else if (message[5] == "suicide") {
          removeWorker(message[0])
          workers[message[0]] = "idle";
        }

        removeFromProcessing(message[2])

        if (message[4] == "healthcheck") {
          var tempObj = {
            _id: message[2],
            HealthCheck: "Cancelled",
            processingStatus: false,
            cliLog: "Item was cancelled by user.",
            lastHealthCheckDate: new Date(),
          }
          Meteor.call('modifyFileDB', 'update', message[2], tempObj, (error, result) => { })
        } else if (message[4] == "transcode") {
          var tempObj = {
            _id: message[2],
            TranscodeDecisionMaker: "Transcode cancelled",
            processingStatus: false,
            cliLog: "Item was cancelled by user.",
            lastTranscodeDate: new Date(),
          }
          Meteor.call('modifyFileDB', 'update', message[2], tempObj, (error, result) => { })

        }
      }

      if (message[1] == "writeRequest") {
      }

      if (message[1] == "appendRequest") {
      }
    }));
  }

  //File watching
  var settings = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch()

  for (var i = 0; i < settings.length; i++) {

    if (settings[i].folderWatching == true) {

      logger.info("Turning folder watch on for:" + settings[i].folder)
      createFolderWatch(settings[i].folder, settings[i]._id)

    }
  }

  Meteor.methods({

    'toggleFolderWatch'(Folder, DB_id, status) {

      if (status == true) {
        logger.info("Turning folder watch on for:" + Folder)
        createFolderWatch(Folder, DB_id)

      } else if (status == false) {
        logger.info("Turning folder watch off for:" + Folder)
        deleteFolderWatch(DB_id)
      }
    }
  });

  function deleteFolderWatch(DB_id) {
    logger.info("Deleting folder watcher:" + DB_id)

    try {
      //try send message
      var messageOut = [
        "closeDown",
      ];
      folderWatchers[DB_id].send(messageOut)
      //delete watchers[DB_id]
    } catch (err) {
      logger.error(err.stack)
      logger.error("Deleting folder watcher failed (does not exist):" + DB_id)
    }
  }

  function createFolderWatch(Folder, DB_id) {
    var watcherID = DB_id
    var librarySettings = SettingsDB.find({ _id: DB_id }, { sort: { createdAt: 1 } }).fetch()[0]
    var folderWatchScanInterval = librarySettings.folderWatchScanInterval
    var useFsEvents = librarySettings.useFsEvents
    logger.info(folderWatchScanInterval)
    var watcherPath = "assets/app/folderWatcher.js"
    var childProcess = require("child_process");
    var child_argv = [
      watcherID,
      Folder,
      DB_id,
      folderWatchScanInterval,
      useFsEvents

    ]

    folderWatchers[watcherID] = childProcess.fork(watcherPath, child_argv);
    logger.info("" + "Watcher " + watcherID + " launched" + "")
    folderWatchers[watcherID].on("exit", Meteor.bindEnvironment(function (code, signal) {
      logger.info("" + "Folder Watcher exited" + "")
    }));

    folderWatchers[watcherID].on("error", console.error.bind(console));
    folderWatchers[watcherID].on('message', Meteor.bindEnvironment(function (message) {

      if (message[1] == "sendFilesForExtract") {
        var DB_id = message[2]
        var filesToProcess = message[3]
        var obj = {
          HealthCheck: "Queued",
          TranscodeDecisionMaker: "Queued",
          cliLog: "",
          bumped: false,
          history: ""
        }
        Meteor.call('scanFiles', DB_id, filesToProcess, 0, 3, obj, function (error, result) { });
      }

      if (message[1] == "removeThisFileFromDB") {
        Meteor.call('modifyFileDB', 'removeOne', message[2], (error, result) => { })
      }

      if (message[1] == "requestingExit") {
        var messageOut = [
          "exitApproved",
        ];
        folderWatchers[message[0]].send(messageOut);
      }

      if (message[1] == "consoleMessage") {
        var type = message[2]
        var string = "Folder watcher " + message[0] + ":" + message[3] + ""
        loggerFunc(type,string);
      }
    }));
  }

  dbUpdatePush();

  function dbUpdatePush() {

    try {

      for (var i = 0; i < filesToAddToDB.length; i++) {

        if (addFilesToDB == false) {
          break
        } else {

          try {
            var tempObj = filesToAddToDB[i]

            //if exact file already exists in DB then do nothing
            //else remove existing item and insert
            var existingFile = FileDB.findOne({ _id: filesToAddToDB[i]._id });

            if (existingFile == undefined) {
              logger.info("This exact file does not exist in DB. Adding")
              Meteor.call('modifyFileDB', 'insert', filesToAddToDB[i]._id, tempObj, (error, result) => { })
              logger.info(`Adding file to DB: ${filesToAddToDB[i]._id}`)
            } else {

              //compare modified time and bitrate
              var mtime_new = filesToAddToDB[i].statSync.mtimeMs
              var mtime_old = existingFile.statSync.mtimeMs
              var br_new = filesToAddToDB[i].bit_rate
              var br_old = existingFile.bit_rate

              if (mtime_new == mtime_old && br_new == br_old) {
                logger.info("This exact file already exists in DB.")
              } else {
                logger.info("This exact file does not exist in DB. Removing old, adding new")
                Meteor.call('modifyFileDB', 'removeOne', filesToAddToDB[i]._id, (error, result) => { })
                Meteor.call('modifyFileDB', 'insert', filesToAddToDB[i]._id, tempObj, (error, result) => { })
                logger.info(`Adding file to DB: ${filesToAddToDB[i]._id}`)
              }
            }
          } catch (err) {
            logger.error(err.stack)
          }
          filesToAddToDB.splice(i, 1)
          i--
        }
      }
    } catch (err) {
      logger.error(err.stack)
    }
    setTimeout(Meteor.bindEnvironment(dbUpdatePush), 1000);
  }

  var allFilesPulledTable = []
  var generalFiles
  var transcodeFiles
  var healthcheckFiles
  var table1data
  var table2data
  var table3data
  var table4data
  var table5data
  var table6data
  var filesToAddToDBLengthNew = 0
  var filesToAddToDBLengthOld = 0
  var newFetchtime = 0
  var oldFetchtime = 0
  var DBPollPeriod = 4000
  var addFilesToDB = true
  var doTablesUpdate = true

  tablesUpdate()

  function tablesUpdate() {

    try {

      if (doTablesUpdate == false) {
      } else if (hasDBChanged === true) {

        //logger.info('Updating queues')
        hasDBChanged = false
        addFilesToDB = false
        allFilesPulledTable = FileDB.find({}).fetch()
        var startDate = new Date();

        //sort queues based on user preference
        var globalSettings = GlobalSettingsDB.find({}, {}).fetch()

        //Sort by date scanned (date createdAt in Tdarr db)
        if (globalSettings[0].queueSortType == "sortDateOldest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        } else if (globalSettings[0].queueSortType == "sortDateNewest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          //Sort by date created
        } else if (globalSettings[0].queueSortType == "sortDateFileCreatedOldest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            return new Date(a.statSync.ctime) - new Date(b.statSync.ctime);
          });
        } else if (globalSettings[0].queueSortType == "sortDateFileCreatedNewest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            return new Date(b.statSync.ctime) - new Date(a.statSync.ctime);
          });
        }

        //Sort by date modified
        else if (globalSettings[0].queueSortType == "sortDateFileModifiedOldest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            return new Date(a.statSync.mtime) - new Date(b.statSync.mtime);
          });
        } else if (globalSettings[0].queueSortType == "sortDateFileModifiedNewest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            return new Date(b.statSync.mtime) - new Date(a.statSync.mtime);
          });
        } else if (globalSettings[0].queueSortType == "sortSizeSmallest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            var one = !isNaN(b.file_size) ? b.file_size : 0
            var two = !isNaN(a.file_size) ? a.file_size : 0
            return two - one;
          });
        } else if (globalSettings[0].queueSortType == "sortSizeLargest") {
          allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
            var one = !isNaN(b.file_size) ? b.file_size : 0
            var two = !isNaN(a.file_size) ? a.file_size : 0
            return one - two;
          });
        }

        newSortType = globalSettings[0].queueSortType
        var settings = SettingsDB.find({}, { sort: { priority: 1 } }).fetch()
        var tableSize = globalSettings[0].tableSize

        //Alternating libraries in queue
        // prioritise libraries based on order
        if (globalSettings[0].prioritiseLibraries == true) {

          for (var i = 0; i < settings.length; i++) {
            var length = allFilesPulledTable.length
            var count = 0

            for (var j = 0; j < allFilesPulledTable.length; j++) {

              if (allFilesPulledTable[j].DB === settings[i]._id) {
                allFilesPulledTable.push(allFilesPulledTable[j])
                allFilesPulledTable.splice(j, 1)
                j--

                if (count == length) {
                  break
                }
              }
              count++
            }
          }
        } else if (globalSettings[0].alternateLibraries == true) {

          //alternate libraries
          var step = settings.length
          var idxHolder = {}
          var newArr = []

          for (var i = 0; i < settings.length; i++) {
            idxHolder[settings[i]._id] = i
          }

          for (var i = 0; i < allFilesPulledTable.length; i++) {
            newArr[idxHolder[allFilesPulledTable[i].DB]] = allFilesPulledTable[i]
            idxHolder[allFilesPulledTable[i].DB] += step
          }

          newArr = newArr.filter(function (el) {
            return el != null;
          });

          allFilesPulledTable = newArr.slice()
          newArr = []
        }

        //push bumped files to top of queue
        var bumpedFiles = []
        for (var i = 0; i < allFilesPulledTable.length; i++) {
          if (allFilesPulledTable[i].bumped != false && allFilesPulledTable[i].bumped != undefined) {
            bumpedFiles.push(allFilesPulledTable[i])
            allFilesPulledTable.splice(i, 1)
            i--
          }
        }

        bumpedFiles = bumpedFiles.sort(function (a, b) {
          return new Date(a.bumped) - new Date(b.bumped);
        });

        allFilesPulledTable = bumpedFiles.concat(allFilesPulledTable)
        table1data = allFilesPulledTable.filter(row => (row.TranscodeDecisionMaker == "Queued" && row.processingStatus == false));
        table2data = allFilesPulledTable.filter(row => ((row.TranscodeDecisionMaker == "Transcode success" || row.TranscodeDecisionMaker == "Not required") && row.processingStatus == false));
        table3data = allFilesPulledTable.filter(row => ((row.TranscodeDecisionMaker == "Transcode error" || row.TranscodeDecisionMaker == "Transcode cancelled") && row.processingStatus == false));
        table4data = allFilesPulledTable.filter(row => (row.HealthCheck == "Queued" && row.fileMedium !== "audio" && row.processingStatus == false));
        table5data = allFilesPulledTable.filter(row => (row.HealthCheck == "Success" && row.processingStatus == false));
        table6data = allFilesPulledTable.filter(row => ((row.HealthCheck == "Error" || row.HealthCheck == "Cancelled") && row.processingStatus == false));
        table2data = sortTable(table2data, "lastTranscodeDate")
        table3data = sortTable(table3data, "lastTranscodeDate")
        table5data = sortTable(table5data, "lastHealthCheckDate")
        table6data = sortTable(table6data, "lastHealthCheckDate")

        function sortTable(data, sortType) {
          return data.sort(function (a, b) {
            return new Date(b[sortType]) - new Date(a[sortType]);
          });
        }

        var tab1Length = table1data.length
        StatisticsDB.upsert('statistics',
          {
            $set: {
              tdarrScore: ((table2data.length * 100.00) / (table1data.length + table2data.length + table3data.length)).toPrecision(4),
              healthCheckScore: ((table5data.length * 100.00) / (table4data.length + table5data.length + table6data.length)).toPrecision(4),
              // table1Count: table1data.length,
              table2Count: table2data.length,
              table3Count: table3data.length,
              table4Count: table4data.length,
              table5Count: table5data.length,
              table6Count: table6data.length,
            }
          }
        );

        generalFiles = (table4data).concat(table1data)
        transcodeFiles = table1data
        healthcheckFiles = table4data

        function getTimeNow() {
          var d = new Date(),
            h = (d.getHours() < 10 ? '' : '') + d.getHours(),
            m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
          var s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
          var timenow = h
          return timenow
        }

        var timeIdx = getTimeNow()
        var d = new Date()
        d = d.getDay()

        //logger.info(timeIdx)
        timeIdx = parseInt(timeIdx) + (d * 24)
        var libNotice = ' -Libraries OFF:'

        for (var i = 0; i < settings.length; i++) {
          try {

            if ((settings[i].schedule[timeIdx] !== undefined && settings[i].schedule[timeIdx].checked === false) || settings[i].processLibrary === false) {
              libNotice += (i + 1) + ','
              generalFiles = generalFiles.filter(row => row.DB != settings[i]._id);
              transcodeFiles = transcodeFiles.filter(row => row.DB != settings[i]._id);
              healthcheckFiles = healthcheckFiles.filter(row => row.DB != settings[i]._id);
              table1data = table1data.filter(row => row.DB != settings[i]._id);
              // table2data = table2data.filter(row => row.DB != settings[i]._id);
              // table3data = table3data.filter(row => row.DB != settings[i]._id);
              table4data = table4data.filter(row => row.DB != settings[i]._id);
              // table5data = table5data.filter(row => row.DB != settings[i]._id);
              // table6data = table6data.filter(row => row.DB != settings[i]._id);
            }
          } catch (err) { logger.error(err.stack) }
        }

        //old
        if (libNotice == ' -Libraries OFF:') {
          libNotice = ''
        }

        StatisticsDB.upsert('statistics',
          {
            $set: {
              table1Count: tab1Length + libNotice,
            }
          }
        );

        table1dataSlice = table1data.slice(0, tableSize)
        table2dataSlice = table2data.slice(0, tableSize)
        table3dataSlice = table3data.slice(0, tableSize)
        table4dataSlice = table4data.slice(0, tableSize)
        table5dataSlice = table5data.slice(0, tableSize)
        table6dataSlice = table6data.slice(0, tableSize)

        var endDate = new Date();
        var seconds2 = (endDate.getTime() - startDate.getTime()) / 1000;
        newFetchtime = Math.round(seconds2 * 10) / 10;

        //logger.info("Fetch time: " + newFetchtime)
        //logger.info("data done")
        ClientDB.upsert("client",
          {
            $set: {
              table1: table1dataSlice,
              table2: table2dataSlice,
              table3: table3dataSlice,
              table4: table4dataSlice,
              table5: table5dataSlice,
              table6: table6dataSlice,
            }
          }
        );

        statisticsUpdate();

        filesToAddToDBLengthNew = filesToAddToDB.length
        var DBLoadStatus

        if (filesToAddToDBLengthNew > filesToAddToDBLengthOld || newFetchtime > oldFetchtime) {
          DBLoadStatus = "Increasing"

          //DBPollPeriod += 1000
        } else {

          if (filesToAddToDBLengthNew == filesToAddToDBLengthOld && newFetchtime == oldFetchtime) {
            DBLoadStatus = "Decreasing"
          } else {
            DBLoadStatus = "Stable"
          }

          // if (DBPollPeriod > 1000) {
          //   DBPollPeriod -=1000
          // }
        }

        DBPollPeriod = allFilesPulledTable.length + filesToAddToDB.length

        //logger.info("DBPollPeriod:" + DBPollPeriod)
        oldFetchtime = newFetchtime
        filesToAddToDBLengthOld = filesToAddToDB.length
        StatisticsDB.upsert("statistics",
          {
            $set: {
              DBPollPeriod: DBPollPeriod > 1000 ? (DBPollPeriod / 1000) + "s" : "1s",
              DBFetchTime: (newFetchtime).toFixed(1) + "s",
              DBTotalTime: ((DBPollPeriod > 1000 ? (DBPollPeriod / 1000) : 1) + newFetchtime).toFixed(1) + "s",
              DBLoadStatus: DBLoadStatus,
              DBQueue: filesToAddToDB.length
            }
          }
        );

      }

      GlobalSettingsDB.upsert(
        "globalsettings",
        {
          $set: {
            lastQueueUpdateTime: (new Date()).getTime(),
          }
        }
      );

      setTimeout(Meteor.bindEnvironment(tablesUpdate), DBPollPeriod > 1000 ? DBPollPeriod : 1000);
    } catch (err) {
      logger.error(err.stack)
      setTimeout(Meteor.bindEnvironment(tablesUpdate), 10000);
    }

    setTimeout(Meteor.bindEnvironment(() => { addFilesToDB = true }), 1000);
  }

  var allFilesPulled

  function statisticsUpdate() {
    StatisticsDB.upsert("statistics",
      {
        $set: {
          totalFileCount: allFilesPulledTable.length
        }
      }
    );

    var pieArray = []
    var statistics = StatisticsDB.find({}, {}).fetch()[0]

    // Create pies for 'All' tab
    var pieSubArray = []
    pieSubArray.push("All")
    pieSubArray.push("all")
    pieSubArray.push(allFilesPulledTable.length)
    pieSubArray.push(statistics.totalTranscodeCount)
    pieSubArray.push(statistics.sizeDiff)
    pieSubArray.push(statistics.totalHealthCheckCount)
    pieSubArray.push(updatePieStats("TranscodeDecisionMaker", '', 'all'))
    pieSubArray.push(updatePieStats('HealthCheck', '', 'all'))
    pieSubArray.push(updatePieStats('video_codec_name', 'video', 'all'))
    pieSubArray.push(updatePieStats('container', 'video', 'all'))
    pieSubArray.push(updatePieStats('video_resolution', 'video', 'all'))
    pieSubArray.push(updatePieStats('audio_codec_name', 'audio', 'all'))
    pieSubArray.push(updatePieStats('container', 'audio', 'all'))
    pieArray.push(pieSubArray)

    //Create pies for each library
    var settings = SettingsDB.find({}, { sort: { priority: 1 } }).fetch()

    for (var i = 0; i < settings.length; i++) {
      var pieSubArray = []
      pieSubArray.push(settings[i].name)
      pieSubArray.push(settings[i]._id)
      pieSubArray.push(allFilesPulledTable.filter(row => row.DB == settings[i]._id).length)
      pieSubArray.push(settings[i].totalTranscodeCount)
      pieSubArray.push(settings[i].sizeDiff)
      pieSubArray.push(settings[i].totalHealthCheckCount)
      pieSubArray.push(updatePieStats("TranscodeDecisionMaker", '', settings[i]._id))
      pieSubArray.push(updatePieStats('HealthCheck', '', settings[i]._id))
      pieSubArray.push(updatePieStats('video_codec_name', 'video', settings[i]._id))
      pieSubArray.push(updatePieStats('container', 'video', settings[i]._id))
      pieSubArray.push(updatePieStats('video_resolution', 'video', settings[i]._id))
      pieSubArray.push(updatePieStats('audio_codec_name', 'audio', settings[i]._id))
      pieSubArray.push(updatePieStats('container', 'audio', settings[i]._id))
      pieArray.push(pieSubArray)
    }

    StatisticsDB.upsert("statistics",
      {
        $set: {
          pies: pieArray
        }
      }
    );
  }

  function updatePieStats(property, fileMedium, DB_id) {
    const data = [];
    var allFilesWithProp = allFilesPulledTable

    //Filter files
    if (DB_id != "all") {
      allFilesWithProp = allFilesWithProp.filter(row => row.DB == DB_id);
    }

    if (fileMedium == "video" || fileMedium == "audio") {
      allFilesWithProp = allFilesWithProp.filter(row => (!!row[property] && row.fileMedium == fileMedium));
    } else {
      allFilesWithProp = allFilesWithProp.filter(row => (!!row[property]));
    }

    var uniquePropArr = []

    //Create unique value array
    for (var i = 0; i < allFilesWithProp.length; i++) {

      if (!(uniquePropArr.includes(allFilesWithProp[i][property]))) {
        uniquePropArr.push(allFilesWithProp[i][property])
      }
    }

    //Make sure to update Pie chart read section if this is changed
    for (var i = 0; i < uniquePropArr.length; i++) {
      data.push({ name: uniquePropArr[i], value: allFilesWithProp.filter(row => row[property] == uniquePropArr[i]).length })
    }

    return data
  }

  //set cpu priority low
  setProcessPriority()

  function setProcessPriority() {

    try {
      if (process.platform == 'win32') {
        var workerCommandFFmpeg = 'wmic process where name=\"ffmpeg.exe\" CALL setpriority \"Low\"'
        var workerCommandHandBrake = 'wmic process where name=\"HandBrakeCLI.exe\" CALL setpriority \"Low\"'
      }

      if (process.platform == 'linux') {
        var workerCommandFFmpeg = 'for p in $(pgrep ^ffmpeg$); do renice -n 20 -p $p; done'
        var workerCommandHandBrake = 'for p in $(pgrep ^HandBrakeCLI$); do renice -n 20 -p $p; done'
      }

      if (process.platform == 'darwin') {
        var workerCommandFFmpeg = 'for p in $(pgrep ^ffmpeg$); do renice -n 20 -p $p; done'
        var workerCommandHandBrake = 'for p in $(pgrep ^HandBrakeCLI$); do renice -n 20 -p $p; done'
      }

      var shell = require('shelljs');
      var globalSettings = GlobalSettingsDB.find({}, {}).fetch()

      //logger.info(globalSettings)
      if (globalSettings[0].lowCPUPriority == true) {
        shellWorker = shell.exec(workerCommandFFmpeg, function (code, stdout, stderr, stdin) { });
        shellWorker = shell.exec(workerCommandHandBrake, function (code, stdout, stderr, stdin) { });
      }
    } catch (err) {
      logger.error(err.stack)
    }
    setTimeout(Meteor.bindEnvironment(setProcessPriority), 10000);
  }

  var workerStatus = {}
  workerUpdateCheck();

  //worker will cancel item if percentage stays the same for 300 secs
  function workerUpdateCheck() {
    try {
      var generalWorkers = workerDB.filter(row => row.mode == "general")
      var transcodeWorkers = workerDB.filter(row => row.mode == "transcode")
      var healthcheckWorkers = workerDB.filter(row => row.mode == "healthcheck")
      var globs = GlobalSettingsDB.find({}, {}).fetch()
      var gDiff = globs[0].generalWorkerLimit - generalWorkers.length
      var tDiff = globs[0].transcodeWorkerLimit - transcodeWorkers.length
      var hDiff = globs[0].healthcheckWorkerLimit - healthcheckWorkers.length
      verboseLogs = globs[0].verboseLogs

      if (gDiff >= 1 && generalFiles.length > 0) {
        if (workerLaunched === 0) {
          workerLaunched++
          Meteor.call('launchWorker', "general", 1, function (error, result) { });
        }
      }

      if (tDiff >= 1 && transcodeFiles.length > 0) {
        if (workerLaunched === 0) {
          workerLaunched++
          Meteor.call('launchWorker', "transcode", 1, function (error, result) { });
        }
      }

      if (hDiff >= 1 && healthcheckFiles.length > 0) {
        if (workerLaunched === 0) {
          workerLaunched++
          Meteor.call('launchWorker', "healthcheck", 1, function (error, result) { });
        }
      }

      var workerCheck = findWorker() //[]
      checkReduceIncrease(gDiff, generalWorkers)
      checkReduceIncrease(tDiff, transcodeWorkers)
      checkReduceIncrease(hDiff, healthcheckWorkers)

      function checkReduceIncrease(Diff, WorkerType) {

        //set all running workers to enabled
        for (var i = 0; i < WorkerType.length; i++) {
          upsertWorker(WorkerType[i]._id, {
            _id: WorkerType[i]._id,
            idle: false,
          })
        }

        // disable unnecessary workers (disable newest first)
        if (Diff <= -1) {
          var count = 0

          for (var i = WorkerType.length - 1; i >= 0; i--) {

            if (WorkerType[i].idle == false) {
              upsertWorker(WorkerType[i]._id, {
                _id: WorkerType[i]._id,
                idle: true,
              })
              count--
              if (count == Diff) {
                break
              }
            }
          }
        }
      }

      var workerStallDetector = (GlobalSettingsDB.find({}, {}).fetch())[0].workerStallDetector

      if (workerStallDetector === true) {
        var workerCheck = findWorker()

        for (var i = 0; i < workerCheck.length; i++) {
          try {

            if (workerStatus[workerCheck[i]._id][1] == 300) {

              if (workerStatus[workerCheck[i]._id][0] == workerCheck[i].file + workerCheck[i].percentage + "") {
                //logger.info("Worker " + workerCheck[i]._id + " stalled. Cancelling item.")
                Meteor.call('cancelWorkerItem', workerCheck[i]._id, function (error, result) { })
                workerStatus[workerCheck[i]._id][0] = ""
                workerStatus[workerCheck[i]._id][1] = -1
              } else {

                //logger.info("Worker " + workerCheck[i]._id + " has not stalled.")
                workerStatus[workerCheck[i]._id][0] = workerCheck[i].file + workerCheck[i].percentage + ""
                workerStatus[workerCheck[i]._id][1] = 0
              }
            } else {
              workerStatus[workerCheck[i]._id][1] = (workerStatus[workerCheck[i]._id][1]) + 1
            }
          } catch (err) { logger.error(err.stack) }
        }
      }
    } catch (err) { logger.error(err.stack) }
    setTimeout(Meteor.bindEnvironment(workerUpdateCheck), 3000);
  }

  function removeFromProcessing(file) {
    var indexEle = filesBeingProcessed.indexOf(file + '')

    if (indexEle >= 0) {
      filesBeingProcessed.splice(indexEle, 1)
    }
  }

  var initialising = true;
  SettingsDB.find().observe({
    added: function (document) {
      if (!initialising) {
        //logger.info('doc added');
        Meteor.call('DBHasChanged', (error, result) => { })
      }
    },
    changed: function (new_document, old_document) {
      if (!initialising) {
        //logger.info('doc changed');
        Meteor.call('DBHasChanged', (error, result) => { })
      }
    },
    removed: function (document) {
      if (!initialising) {
        //logger.info('doc removed');
        Meteor.call('DBHasChanged', (error, result) => { })
      }
    }
  });

  GlobalSettingsDB.find().observe({
    added: function (document) {
      if (!initialising) {
        //logger.info('doc added');
        Meteor.call('DBHasChanged', (error, result) => { })
      }
    },
    changed: function (new_document, old_document) {
      if (!initialising) {
        //logger.info('doc changed');
        if (new_document.lastQueueUpdateTime == old_document.lastQueueUpdateTime) {
          Meteor.call('DBHasChanged', (error, result) => { })
        }

      }
    },
    removed: function (document) {
      if (!initialising) {
        //logger.info('doc removed');
        Meteor.call('DBHasChanged', (error, result) => { })
      }
    }
  });
  initialising = false;
}