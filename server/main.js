import '../imports/api/Methods.js';
import '../imports/api/Logger.js';
import '../imports/api/tasks.js';




import { LogDB, FileDB, SettingsDB, GlobalSettingsDB, StatisticsDB, ClientDB } from '../imports/api/tasks.js';


console.log("Tdarr started")


const shortid = require('shortid');
const util = require('util')



//new file comes in
//=> file added to DB
//=> decision maker triggered




//Globals
var path = require("path");
var fs = require('fs');
const fsextra = require('fs-extra')
var rimraf = require("rimraf");

var os = require('os-utils');


var workers = {}
var fileScanners = {}
//var fileScannersData = {}
var verboseLogs
var folderWatchers = {}

// var workerDB = [{
//   _id:"test",
//   file:"test file",
//   percentage:20.01,
//   mode:"transcode",
// }]

var workerDB = []
var filesToAddToDB = []
var logsToAddToDB = []

//__dirname = getRootDir()

var filesBeingProcessed = []





function getRootDir() {

  var rootDir = path.resolve();
  rootDir = rootDir.split("\\")
  var firstEle = rootDir.length - 5
  rootDir.splice(firstEle, 5)
  rootDir = rootDir.join("\\")


  return rootDir
}


var home = require("os").homedir();

//console.log("process.env.DATA:" + process.env.DATA)

if (process.env.NODE_ENV == 'production') {

  if (process.env.DATA) {
    var homePath = process.env.DATA
  } else {
    var homePath = home + '/Documents'
  }


  if (process.env.BASE) {

    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          basePath:process.env.BASE,
        }
      }
    );

  } else {

    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          basePath:"",
        }
      }
    );
  }



} else {
  var homePath = home + '/Documents'

  GlobalSettingsDB.upsert(
    "globalsettings",
    {
      $set: {
        basePath:"",
      }
    }
  );
}

console.log("Tdarr documents folder:"+ homePath)



console.log("Checking directories")


const isDocker = require('is-docker');

if (isDocker()) {
  console.log('Running inside a Docker container');
  if (!fs.existsSync("/temp")) {
    fs.mkdirSync("/temp");
  
  }
}else{
  console.log('Not running inside a Docker container');

}






if (!fs.existsSync(homePath + "")) {
  fs.mkdirSync(homePath + "");

}

if (!fs.existsSync(homePath + "/Tdarr")) {
  fs.mkdirSync(homePath + "/Tdarr");

}



if (!fs.existsSync(homePath + "/Tdarr/Plugins")) {
  fs.mkdirSync(homePath + "/Tdarr/Plugins");

}



if (!fs.existsSync(homePath + "/Tdarr/Data")) {
  fs.mkdirSync(homePath + "/Tdarr/Data");

}



if (!fs.existsSync(homePath + "/Tdarr/Plugins/Community")) {
  fs.mkdirSync(homePath + "/Tdarr/Plugins/Community");

}

if (!fs.existsSync(homePath + "/Tdarr/Plugins/Local")) {
  fs.mkdirSync(homePath + "/Tdarr/Plugins/Local");

}

if (!fs.existsSync(homePath + "/Tdarr/Samples")) {
  fs.mkdirSync(homePath + "/Tdarr/Samples");

}


//Test
//console.log("homePath:"+homePath)
//fs.writeFileSync(homePath + "/Tdarr/Data/test.txt", "Hello", 'utf8');


//migration step


console.log("Initialising DB")

allFilesPulledTable = FileDB.find({}).fetch()


for (var i = 0; i < allFilesPulledTable.length; i++) {

  console.log("Checking file:"+(i+1))

  if (allFilesPulledTable[i].TranscodeDecisionMaker == "Not attempted") {

    FileDB.upsert(
      allFilesPulledTable[i].file,
      {
        $set: {
          TranscodeDecisionMaker: "Queued",
        }
      }
    );
  }

  if (allFilesPulledTable[i].TranscodeDecisionMaker == "Passed") {

    FileDB.upsert(
      allFilesPulledTable[i].file,
      {
        $set: {
          TranscodeDecisionMaker: "Not required",
        }
      }
    );
  }

  if (allFilesPulledTable[i].HealthCheck == "Not attempted") {

    FileDB.upsert(
      allFilesPulledTable[i].file,
      {
        $set: {
          HealthCheck: "Queued",
        }
      }
    );


  }


  if (!allFilesPulledTable[i].lastTranscodeDate) {

    FileDB.upsert(
      allFilesPulledTable[i].file,
      {
        $set: {
          lastTranscodeDate: new Date(),
        }
      }
    );
  }

  if (!allFilesPulledTable[i].lastHealthCheckDate) {

    FileDB.upsert(
      allFilesPulledTable[i].file,
      {
        $set: {
          lastHealthCheckDate: new Date(),
        }
      }
    );
  }


}







process.on('uncaughtException', function (err) {
  console.error(err.stack);

  // process.exit();
});



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
        queueSortType:"sortDateNewest",
        verboseLogs: false,
      }
    }
  );
}else{
//init sort vars

if(count[0].queueSortType == undefined){

  GlobalSettingsDB.upsert(
    "globalsettings",
    {
      $set: {
        queueSortType:"sortDateNewest",
      }
    }
  );

}

if(count[0].prioritiseLibraries == undefined){

  GlobalSettingsDB.upsert(
    "globalsettings",
    {
      $set: {
        prioritiseLibraries:false,
      }
    }
  );

}

}

GlobalSettingsDB.upsert('globalsettings',
  {
    $set: {
      logsLoading: false,
      selectedLibrary: 0,
    }
  }
);

//configure libraries

var count = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch()

if (Array.isArray(count) || count.length) {


  if(count[0] != undefined && count[0].priority == undefined){

    for(var i = 0 ; i < count.length; i++){

      SettingsDB.upsert(
        count[i]._id,
        {
          $set: {
            priority : i,
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
      pie1: [{ name: "No data", value: 1 }],
      pie2: [{ name: "No data", value: 1 }],
      pie3: [{ name: "No data", value: 1 }],
      pie4: [{ name: "No data", value: 1 }],
      pie5: [{ name: "No data", value: 1 }],
      pie6: [{ name: "No data", value: 1 }],
      pie7: [{ name: "No data", value: 1 }],

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







Meteor.methods({

  'searchDB'(string) {

    doTablesUpdate = false

    string = string.replace(/\\/g, "/");

    console.log(string)


    var allFiles = allFilesPulledTable

    string = string.split(',')


    allFiles = allFiles.filter(row => {

      try {
        for (var i = 0; i < string.length; i++) {




          /// 

          var match = []

          if(string[i].charAt(0) == "!"){

           var subString = string[i].substring(1)

            if ((JSON.stringify(row)).toLowerCase().includes(subString.toLowerCase())) {
             // match.push(true)
             return false
            }


          }else{

            if (!(JSON.stringify(row)).toLowerCase().includes(string[i].toLowerCase())) {
            //  match.push(false)
            return false
            }
          }



         
        }

        return true

      } catch (err) {
         console.log(err.stack)
      }


    }


    );


    //Add queue positions to search results

    for (var i = 0; i < allFiles.length; i++) {
      var tFiles = transcodeFiles.map(row => row.file )
      var hFiles = healthcheckFiles.map(row => row.file )
      allFiles[i].tPosition =  tFiles.indexOf(allFiles[i].file)+1
      allFiles[i].hPosition =  hFiles.indexOf(allFiles[i].file)+1
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

  },

  'searchPlugins'(string,pluginType) {

    //  console.log(string)


    try {

      var plugins = []


      fs.readdirSync(homePath + `/Tdarr/Plugins/${pluginType}`).forEach(file => {
        // console.log(homePath + '/Tdarr/Plugins/Community/'+file);
        //  var temp = require(homePath + '/Tdarr/Plugins/Community/' + file);

        var hwSource = fs.readFileSync(homePath + `/Tdarr/Plugins/${pluginType}/` + file, 'utf8');
        var hwFunc = new Function('module', hwSource);
        var hwModule = { exports: {} };
        hwFunc(hwModule)
        var hw = hwModule.exports;

        var obj = hw.details();

        //  console.log(obj)


        plugins.push(obj)

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



        } catch (err) { console.log(err.stack) }


      }


      );

    } catch (err) {

      console.log(err.stack)
    }


    GlobalSettingsDB.upsert('globalsettings',
      {
        $set: {
          pluginSearchLoading: false,
        }
      }
    );


    return [plugins,pluginType]

  }, 'verifyPlugin'(pluginID, DB_id, community) {

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




    try {
      fsextra.removeSync(homePath + '/Tdarr/Plugins/temp')
    } catch (err) {  console.log(err.stack)}

    var clone = require('git-clone');

    console.log('Cloning plugins')

    clone("https://github.com/HaveAGitGat/Tdarr_Plugins/", homePath + '/Tdarr/Plugins/temp/', Meteor.bindEnvironment(function (err, result) {



      try {
        fsextra.copySync(homePath + '/Tdarr/Plugins/temp/Community', homePath + "/Tdarr/Plugins/Community", { overwrite: true })
      } catch (err) { console.log(err.stack) }


      try {
        fsextra.removeSync(homePath + '/Tdarr/Plugins/temp')
      } catch (err) { console.log(err.stack) }


      console.log('Plugin update finished')


      GlobalSettingsDB.upsert('globalsettings',
        {
          $set: {
            pluginSearchLoading: false,
          }
        }
      );


    })
    )








  }, 'resetAllStatus'(DB_id,mode) {


    var allFiles = allFilesPulledTable

    if(DB_id != "all"){
      allFiles =  allFiles.filter(row => row.DB == DB_id);
    }
    
    for (var i = 0; i < allFiles.length; i++) {

      try {

        FileDB.upsert(
          allFiles[i].file,
          {
            $set: {
              [mode]: "Queued",
            }
          }
        );

      } catch (err) {  console.log(err.stack)}
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

        var folders = getDirectories(folderPath)

        folders = folders.map((row) => {

          return {

            fullPath: path.join(folderPath + '/' + row),
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

        var folders = getDirectories(folderPath)

        folder = folders.map((row) => {

          return {

            fullPath: path.join(folderPath + '/' + row),
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






    } catch (err) { console.log(err.stack) }

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
    FileDB.remove({})
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

    } catch (err) { console.log(err.stack) }

    //var indexEle = filesBeingProcessed.indexOf(file)
    //filesBeingProcessed.splice(indexEle, 1)




  }, 'cancelWorkerItem'(workerID) {


    var messageOut = [
      "exitThread",
    ];

    try {
      workers[workerID].send(messageOut);
    } catch (err) { console.log(err.stack) }


  }, 'scanFiles'(DB_id, arrayOrPath, arrayOrPathSwitch, mode, filePropertiesToAdd) {



    var scannerID = shortid.generate()

    if (mode == 0) {



      updateConsole("Commencing file update scan. Deleting non-existent files and adding new files.", false)




  

      var filesInDB = allFilesPulledTable

      filesInDB = filesInDB.filter(row => row.DB == DB_id);


      filesInDB2 = filesInDB.map(row => row._id + '\r\n')
      filesInDB2 = filesInDB2.join("")

      // fs.writeFileSync(homePath + "/Tdarr/Data/test.txt", filesInDB2, 'utf8');

      filesInDB = filesInDB.map((file, i) => {
        if (!(fs.existsSync(file.file))) {
          //delete files in DBs if not exist anymore (cleanse)
          console.log("File does not exist anymore, removing:" + file.file)
          FileDB.remove(file.file)
        } else {
          return file.file

        }
      });

      filesInDB = filesInDB.map(row => row + '\r\n')
      filesInDB = filesInDB.join("")

      try {

        if (isDocker()) {
          fs.writeFileSync("/temp/" + scannerID + ".txt", filesInDB, 'utf8');
        }else{
          fs.writeFileSync(homePath + "/Tdarr/Data/" + scannerID + ".txt", filesInDB, 'utf8');
        }
       

      } catch (err) {
        console.log(err.stack)
        updateConsole("Error writing to file: " + err.stack, false)

      }



      filesInDB = []

    } else if (mode == 1) {

      updateConsole("Commencing fresh file scan.", false)



      FileDB.remove({ DB: DB_id });

      //  var filesInDB = []

    } else if (mode == 3) {

      // var filesInDB = []

      arrayOrPath = arrayOrPath.map(row => row + '\r\n')
      arrayOrPath = arrayOrPath.join("")


      try {

        if (isDocker()) {
          fs.writeFileSync("/temp/" + scannerID + ".txt", arrayOrPath, 'utf8');
        }else{
          fs.writeFileSync(homePath + "/Tdarr/Data/" + scannerID + ".txt", arrayOrPath, 'utf8');
        }
       



      } catch (err) { console.log(err.stack)
        updateConsole("Error writing to file: " + err.stack, false)
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




    var allowedContainers = SettingsDB.find({ _id: DB_id }, { sort: { createdAt: 1 } }).fetch()
    allowedContainers = allowedContainers[0].containerFilter
    allowedContainers = allowedContainers.split(',');



    var scannerPath = "assets/app/fileScanner.js"

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
    ]

    fileScanners[scannerID] = childProcess.fork(scannerPath, child_argv);
    updateConsole("" + "Scanner " + scannerID + " launched" + "", false)


    fileScanners[scannerID].on("exit", Meteor.bindEnvironment(function (code, signal) {

      updateConsole("" + "File scanner exited" + "", false)



    }));

    fileScanners[scannerID].on("error", console.error.bind(console));






    fileScanners[scannerID].on('message', Meteor.bindEnvironment(function (message) {

      if (message[1] == "pathRequest") {

        // var messageOut = [
        //   "initInfo",

        // ];

        // fileScanners[message[0]].send(messageOut);



      }

      if (message[1] == "addFileToDB") {


        //  console.log("Queueing file to be added to DB")

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
          //  console.log("jsonData is object")
        } else {
          //   console.log("jsonData isn't object")
        }

        updateConsole(`Add file to DB request received for: ${jsonData._id}. Queueing`, true)

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

        updateConsole("Scanner " + message[0] + ":Finished", false);

        SettingsDB.upsert(message[2],
          {
            $set: {
              scanButtons: true,
            }
          }
        );


      }


      if (message[1] == "consoleMessage") {

        //  if(message[2].includes("File received:")){

        updateConsole("Scanner " + message[0] + ":" + message[2] + "", true);



        //  }


      }


    }));



  }, 'returnPieFiles'(property, fileMedium, detail) {



    var allFilesWithProp = allFilesPulledTable


    if (fileMedium == "video" || fileMedium == "audio") {

      allFilesWithProp = allFilesWithProp.filter(row => (!!row[property] && row.fileMedium == fileMedium));

    } else {

      allFilesWithProp = allFilesWithProp.filter(row => (!!row[property]));

    }





    allFilesWithProp = allFilesWithProp.filter(row => row[property] == detail)

    for (var i = 0; i < allFilesWithProp.length; i++) {
      var tFiles = transcodeFiles.map(row => row.file )
      var hFiles = healthcheckFiles.map(row => row.file )
      allFilesWithProp[i].tPosition =  tFiles.indexOf(allFilesWithProp[i].file)+1
      allFilesWithProp[i].hPosition =  hFiles.indexOf(allFilesWithProp[i].file)+1
    }

    return allFilesWithProp






  }, 'runHelpCommand'(mode, text) {

    console.log(mode, text)






    if (process.platform == 'win32' && mode == "handbrake") {
      workerCommand = handBrakeCLIPath + " " + text
    } else if (process.platform == 'win32' && mode == "ffmpeg") {
      workerCommand = ffmpegPath + " " + text
    }

    if (process.platform == 'linux' && mode == "handbrake") {
      workerCommand = "HandBrakeCLI" + " " + text
    } else if (process.platform == 'linux' && mode == "ffmpeg") {

      workerCommand = ffmpegPath + " " + text

    }

    if (process.platform == 'darwin' && mode == "handbrake") {
      workerCommand = "/usr/local/bin/HandBrakeCLI" + " " + text
    } else if (process.platform == 'darwin' && mode == "ffmpeg") {
      workerCommand = ffmpegPath + " " + text
    }


    if (process.env.HWT == true) {
    if (isDocker()) {

    if (process.platform == 'linux' && mode == "handbrake") {
      workerCommand = "/usr/local/bin/HandBrakeCLI " + text
    } else if (process.platform == 'linux' && mode == "ffmpeg") {

      workerCommand = "/usr/local/bin/ffmpeg " + text

    }
  }
}



    fs.writeFileSync(homePath + "/Tdarr/Data/" + mode + ".txt", "", 'utf8');


    var shellWorker = shell.exec(workerCommand, function (code, stdout, stderr, stdin) {

      console.log('Exit code:', code);

      fs.appendFileSync(homePath + "/Tdarr/Data/" + mode + ".txt", stdout + '\n', 'utf8');
      fs.appendFileSync(homePath + "/Tdarr/Data/" + mode + ".txt", stderr + '\n', 'utf8');

    });



  },

  'readHelpCommandText'() {

    try {
      var ffmpegText = fs.readFileSync(homePath + "/Tdarr/Data/ffmpeg.txt", 'utf8')
    } catch (err) { 
      console.log(err.stack)
      var ffmpegText = ''
    }

    try {
      var handbrakeText = fs.readFileSync(homePath + "/Tdarr/Data/handbrake.txt", 'utf8')
    } catch (err) {
      console.log(err.stack)
      var handbrakeText = ''
    }

    return [ffmpegText, handbrakeText]

  },
  'createSample'(filePath) {

    console.log(filePath)
    var inputFile = filePath
    var outputFile = filePath.split(".")

    outputFile[outputFile.length - 2] = outputFile[outputFile.length - 2] + " - TdarrSample"
    outputFile = outputFile.join(".")

    outputFile = outputFile.split("/")
    outputFile = homePath + "/Tdarr/Samples/" + outputFile[outputFile.length - 1]

    var inputFileUnix = inputFile.replace(/'/g, '\'\"\'\"\'');
    var outputFileUnix = outputFile.replace(/'/g, '\'\"\'\"\'');
    var ffmpegPathUnix = ffmpegPath.replace(/'/g, '\'\"\'\"\'');

    //var preset1 = "-ss 1 -t 30 -acodec copy -vcodec copy"

    var preset1 = "-ss 1 -t 30"
    var preset2 = "-codec copy"

    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile)
    }


    if (process.platform == 'win32') {
      workerCommand = ffmpegPath + " " + preset1 + " -i \"" + inputFile + "\" " + preset2 + " \"" + outputFile + "\" "
    }

    if (process.platform == 'linux' || process.platform == 'darwin') {

      workerCommand = ffmpegPathUnix + " " + preset1 + " -i '" + inputFileUnix + "' " + preset2 + " '" + outputFileUnix + "' "
    }

    var shellWorker = shell.exec(workerCommand, function (code, stdout, stderr, stdin) {

      console.log('Exit code:', code);
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

  if(settingsInit[i].scanOnStart !== false){

 
    //fileDB

    var obj = {
      HealthCheck:"Queued",
      TranscodeDecisionMaker:"Queued",
      cliLog:"",
      bumped:false,
      history:""
    }

    Meteor.call('scanFiles', settingsInit[i]._id, settingsInit[i].folder, 1, 0, obj, function (error, result) {});

  }
}


//runScheduledManualScan()

setTimeout(Meteor.bindEnvironment(runScheduledManualScan), 3600000);

function runScheduledManualScan(){

  console.log("scanning!")

  try{


  var settingsInit = SettingsDB.find({}, {}).fetch()

  // allFilesPulledTable = []
  // allFilesPulledTable = FileDB.find({}).fetch()


  for (var i = 0; i < settingsInit.length; i++) {
  
    if(settingsInit[i].folderWatching == true && settingsInit[i].scanOnStart !== false){

      var obj = {
        HealthCheck:"Queued",
        TranscodeDecisionMaker:"Queued",
        cliLog:"",
        bumped:false,
        history:""
      }
  
      Meteor.call('scanFiles', settingsInit[i]._id, settingsInit[i].folder, 1, 0, obj, function (error, result) {});
  
    }
  }


}catch(err){

  console.log(err.stack)
}


setTimeout(Meteor.bindEnvironment(runScheduledManualScan), 3600000);

}




if (fs.existsSync(path.join(process.cwd() + "/npm"))) {
  var handBrakeCLIPath = path.join(process.cwd() + '/assets/app/HandBrakeCLI.exe')
} else {
  var handBrakeCLIPath = path.join(process.cwd() + '/private/HandBrakeCLI.exe')
}

var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var shell = require('shelljs');








scheduledPluginUpdate()


function scheduledPluginUpdate() {

  console.log('Updating plugins')

  try {

    Meteor.call('updatePlugins', function (error, result) {



    });


  } catch (err) {
    console.log(err.stack)
   }



  setTimeout(Meteor.bindEnvironment(scheduledPluginUpdate), 3600000);

}


//scheduledCacheClean()

function scheduledCacheClean() {

  try {

    var settings = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch()

    for (var i = 0; i < settings.length; i++) {


      try {
        traverseDir(settings[i].cache)
      } catch (err) {
        console.log(err.stack)
       }
    }




    function traverseDir(inputPathStem) {

      try {
        fs.readdirSync(inputPathStem).forEach(file => {

          var fullPath = (path.join(inputPathStem, file)).replace(/\\/g, "/");

          try {




            var stats = fs.statSync(fullPath);
            var mtime = stats.mtime;
            var n = new Date()
            var secsSinceModified = (n - mtime) / 1000

            if (secsSinceModified > 86400) {

              console.log("Removing:" + fullPath)

              try {
                rimraf.sync(fullPath);
              } catch (err) {
                console.error(err.stack);
                try {
                  traverseDir(fullPath);
                } catch (err) {
                  console.error(err.stack);

                }
              }

            } else {

              try {
                traverseDir(fullPath);
              } catch (err) {
                console.error(err.stack);

              }
            }



          } catch (err) {


            console.error(err.stack);
          }
        });



      } catch (err) { console.log(err.stack) }
    }


  } catch (err) {  console.log(err.stack)}

  setTimeout(Meteor.bindEnvironment(scheduledCacheClean), 60000);
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

        console.log(err.stack)

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




  //var workerPath = "/imports/api/worker1.js"
  var workerPath = "assets/app/worker1.js"



  var childProcess = require("child_process");
  //var path = require("path");



  var child_argv = [
    workerID,
    workerType,
  ]



  //workers.push(childProcess.fork(path.join(__dirname, workerPath ),[], { silent: true }));

  //use this
  //workers[workerID - 1] = childProcess.fork(path.join(__dirname, workerPath), child_argv);
  workers[workerID] = childProcess.fork(workerPath, child_argv);



  updateConsole("" + "Worker " + workerID + " launched" + "", true)



  // workers[workerID - 1].stdout.on('data', function(data) {
  // //console.log('stdout: ' + data);
  // //Here is where the output goes
  // });



  // var messageOut = [
  //     "workerNumber",
  //     i,
  // ];

  // workers[workerID - 1].send(messageOut);



  // var worker = workers[1];
  //  worker.send("w:"+2);


  workers[workerID].on("exit", Meteor.bindEnvironment(function (code, signal) {

    updateConsole("" + "Worker exited" + "", true)



  }));

  workers[workerID].on("error", console.error.bind(console));






  workers[workerID].on('message', Meteor.bindEnvironment(function (message) {

    // updateConsole("Worker "+message[0]+":"+message+"");


    //  console.log("Message:" + message);


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

      //  if(message[2].includes("File received:")){

      if (message[2].includes('File received')) {

        updateConsole("Worker " + message[0] + ":" + message[2] + "", false);

      } else {
        updateConsole("Worker " + message[0] + ":" + message[2] + "", true);

      }





      //  }


    }




    if (message[1] == "queueRequest") {




      var workerType = message[2]





      var workerStats = findWorker(message[0])
      //workerStats[0].percentage = 0

      //console.log(workerStats)



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


            console.log(`Server: Worker ${message[0]} requesting item. Nothing to process for this worker.`)

            var messageOut = [
              "completed",
            ];

            workers[message[0]].send(messageOut);

          } else {

            var firstItem = files[0]

            files.splice(0, 1)

            //Settings from fileDB

            if (filesBeingProcessed.includes(firstItem.file + "")) {

              //put item to back of the queue so doesn't hold up queue

              var messageOut = [
                "requestNewItem",

              ]
              workers[message[0]].send(messageOut);

            } else {

              filesBeingProcessed.push(firstItem.file + "")

              FileDB.upsert(firstItem.file,
                {
                  $set: {
                    _id: firstItem.file,
                    processingStatus: true

                  }
                }
              );

            


              if (workerType == "general") {

                if (firstItem.HealthCheck == "Queued" && firstItem.fileMedium == "video") {

                  var mode = "healthcheck"

                } else if (firstItem.TranscodeDecisionMaker == "Queued") {
                  var mode = "transcode"
                }
              }








              var fileToProcess = firstItem.file
              var fileID = firstItem._id
              var settings = SettingsDB.find({ _id: firstItem.DB }, { sort: { createdAt: 1 } }).fetch()


              //Settings from SettingsDB
              var settingsDBIndex = firstItem.DB
              var inputFolderStem = (settings[0].folder).replace(/\\/g, "/");
              var outputFolder = (settings[0].cache).replace(/\\/g, "/");
              var container = settings[0].container
              var preset = settings[0].preset
              var handBrakeMode = settings[0].handbrake
              var FFmpegMode = settings[0].ffmpeg

              var handbrakescan = settings[0].handbrakescan
              var ffmpegscan = settings[0].ffmpegscan

              var processFile = true

              var cliLogAdd = ""

              var reQueueAfter = false

              //  console.log(util.inspect(firstItem, {showHidden: false, depth: null}))


              if (mode == "healthcheck") {

                cliLogAdd += 'Health check! \n'




                if (handbrakescan == true) {

                  handBrakeMode = true
                  FFmpegMode = false

                  preset = "--scan"

                } else if (ffmpegscan == true) {

                  handBrakeMode = false
                  FFmpegMode = true

                  preset = "-v error, -f null"

                }

                var frameCount = 1

                var messageOut = [
                  "queueNumber",
                  mode, //update
                  fileToProcess,
                  inputFolderStem,
                  outputFolder,
                  container,
                  preset,
                  handBrakeMode,
                  FFmpegMode,
                  frameCount,
                  settingsDBIndex,
                  reQueueAfter

                ]


              } else if (mode == "transcode") {



                //Transcode decision maker

                //Plugin filter


                console.log("here")

                if (settings[0].decisionMaker.pluginFilter == true) {

                  var pluginsSelected = settings[0].pluginIDs

                  pluginsSelected = pluginsSelected.filter(row => (row.checked));


                  if (pluginsSelected.length == 0) {

                    processFile = false
                    preset = ''
                    container = ''
                    handBrakeMode = ''
                    FFmpegMode = ''
                    reQueueAfter = ''
                    cliLogAdd += '☒No plugins selected!  \n'



                  } else {


                    for (var i = 0; i < pluginsSelected.length; i++) {

                      try {

                        //var pluginID = settings[0].pluginID
                        var pluginID = pluginsSelected[i]._id


                        var plugin = ''

                        if (settings[0].pluginCommunity == true) {
                          // var plugin = require(homePath + '/Tdarr/Plugins/Community/' + pluginID + '.js');

                          var hwSource = fs.readFileSync(homePath + '/Tdarr/Plugins/Community/' + pluginID + '.js', 'utf8');
                          var hwFunc = new Function('module', hwSource);
                          var hwModule = { exports: {} };
                          hwFunc(hwModule)
                          var plugin = hwModule.exports;


                        } else {
                          // var plugin = require(homePath + '/Tdarr/Plugins/Local/' + pluginID + '.js');
                          var hwSource = fs.readFileSync(homePath + '/Tdarr/Plugins/Local/' + pluginID + '.js', 'utf8');
                          var hwFunc = new Function('module', hwSource);
                          var hwModule = { exports: {} };
                          hwFunc(hwModule)
                          var plugin = hwModule.exports;
                        }



                        var response = plugin.plugin(firstItem);

                        console.dir(response)

                        processFile = response.processFile
                        preset = response.preset
                        container = response.container
                        handBrakeMode = response.handBrakeMode
                        FFmpegMode = response.FFmpegMode
                        reQueueAfter = response.reQueueAfter
                        cliLogAdd += response.infoLog

                        if (processFile == true) {

                          break

                        }
                      } catch (err) {
                        console.log(err.stack)


                        processFile = false
                        preset = ''
                        container = ''
                        handBrakeMode = ''
                        FFmpegMode = ''
                        reQueueAfter = ''
                        cliLogAdd += '☒Plugin does not exist!  \n'


                      }
                    }
                  }










                  //


                  //Video settings
                } else if (settings[0].decisionMaker.videoFilter == true) {

                  if (firstItem.fileMedium !== "video") {

                    console.log("File is not video")

                    cliLogAdd += "☒File is not video \n"

                    processFile = false;
                  } else {

                    video_codec_names_exclude = settings[0].decisionMaker.video_codec_names_exclude
                    video_codec_names_exclude = video_codec_names_exclude.map(row => {
                      if (row.checked == true) {
                        return row.codec
                      }
                    })


                    if (video_codec_names_exclude.includes(firstItem.ffProbeData.streams[0]["codec_name"]) && typeof firstItem.ffProbeData.streams[0]["codec_name"] !== 'undefined') {

                      console.log(video_codec_names_exclude + "   " + firstItem.video_codec_name)

                      console.log("File video already in required codec")

                      cliLogAdd += "☑File already in required codec  \n"

                      processFile = false;

                    } else {
                      cliLogAdd += "☒File video not in required codec  \n"

                    }

                    if (firstItem.file_size >= settings[0].decisionMaker.video_size_range_include.max || firstItem.file_size <= settings[0].decisionMaker.video_size_range_include.min) {
                      console.log("File not in video size range")

                      cliLogAdd += "☒File not in video size range  \n"

                      processFile = false;
                    } else {
                      cliLogAdd += "File in video size range \n"
                    }

                    if (firstItem.ffProbeData.streams[0]["height"] >= settings[0].decisionMaker.video_height_range_include.max || firstItem.ffProbeData.streams[0]["height"] <= settings[0].decisionMaker.video_height_range_include.min) {
                      console.log("File not in video height range")

                      cliLogAdd += "☒File not in video height range  \n"

                      processFile = false;
                    } else {
                      cliLogAdd += "File in video height range \n"
                    }

                    if (firstItem.ffProbeData.streams[0]["width"] >= settings[0].decisionMaker.video_width_range_include.max || firstItem.ffProbeData.streams[0]["width"] <= settings[0].decisionMaker.video_width_range_include.min) {
                      console.log("File not in video width range")
                      cliLogAdd += "☒File not in video width range  \n"

                      processFile = false;
                    } else {
                      cliLogAdd += "File in video width range  \n"

                    }

                  }





                } else if (settings[0].decisionMaker.audioFilter == true) {

                  if (firstItem.fileMedium !== "audio") {

                    console.log("File is not audio")
                    cliLogAdd += "☒File is not audio  \n"

                    processFile = false;
                  } else {

                    audio_codec_names_exclude = settings[0].decisionMaker.audio_codec_names_exclude
                    audio_codec_names_exclude = audio_codec_names_exclude.map(row => {
                      if (row.checked == true) {
                        return row.codec
                      }
                    })


                    if (audio_codec_names_exclude.includes(firstItem.ffProbeData.streams[0]["codec_name"]) && typeof firstItem.ffProbeData.streams[0]["codec_name"] !== 'undefined') {

                      console.log("File already in required codec")
                      cliLogAdd += "☑File already in required codec  \n"

                      processFile = false;

                    } else {
                      cliLogAdd += "☒File audio not in required codec  \n"

                    }

                    if (firstItem.file_size >= settings[0].decisionMaker.audio_size_range_include.max || firstItem.file_size <= settings[0].decisionMaker.audio_size_range_include.min) {

                      console.log("File not in audio size range")

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
                  fileToProcess,
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


                ]

                //decision maker
                //process file or add to output db and get new file

              }


              //File filtered out by transcode decision maker
              if (processFile == false) {



                FileDB.upsert(fileToProcess,
                  {
                    $set: {
                      _id: fileToProcess,
                      TranscodeDecisionMaker: firstItem.oldSize ? "Transcode success" : "Not required",
                      processingStatus: false,
                      cliLog: cliLogAdd,
                      lastTranscodeDate: new Date(),
                      bumped:false,

                    }
                  }
                );


                var indexEle = filesBeingProcessed.indexOf(firstItem.file + "")
                filesBeingProcessed.splice(indexEle, 1)
                console.log("after:" + filesBeingProcessed)



                var messageOut = [
                  "requestNewItem",

                ]
                workers[message[0]].send(messageOut);



                //






              } else if (processFile == true) {


                try {
                  var sourcefileSizeInGbytes = (((fs.statSync(fileToProcess)).size) / 1000000000.0);
                } catch (err) {
                  console.log(err.stack)
                  var sourcefileSizeInGbytes = "Error"
                }

                if (handBrakeMode == true) {

                  var CLIType = "HandBrake"

                } else if (FFmpegMode == true) {

                  var CLIType = "FFmpeg"
                }





                upsertWorker(message[0], {
                  _id: message[0],
                  file: fileToProcess,
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
                })


                workers[message[0]].send(messageOut);

                workerStatus[message[0]] = [fileToProcess + 0 + "", 0]


              }

            }

          }
        }

      }

    }//if


    if (message[1] == "processing") {


    }


    if (message[1] == "percentage") {


      upsertWorker(message[0], {
        percentage: message[2],
      })
    }

    if (message[1] == "ETAUpdate") {

      upsertWorker(message[0], {
        ETA: message[2],
      })
    }

    if (message[1] == "repair_worker_percentage") {

    }



    if (message[1] == "error") {


      upsertWorker(message[0], {
        _id: message[0],
        percentage: 100
      })



      var indexEle = filesBeingProcessed.indexOf(message[2] + "")
      filesBeingProcessed.splice(indexEle, 1)

      console.log("filesBeingProcessed:" + filesBeingProcessed)


      if (message[4] == "healthcheck") {



        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              HealthCheck: "Error",
              processingStatus: false,
              cliLog: message[5],
              lastHealthCheckDate: new Date()
            }
          }
        );

        StatisticsDB.update("statistics",
          {
            $inc: { totalHealthCheckCount: 1 }
          }
        );


      } else if (message[4] == "transcode") {



        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              TranscodeDecisionMaker: "Transcode error",
              processingStatus: false,
              cliLog: message[5],
              lastTranscodeDate: new Date()
            }
          }
        );
        //  ffprobeLaunch([message[2]], OutputDB, message[3])



      }
    }



    if (message[1] == "success") {


      upsertWorker(message[0], {
        _id: message[0],
        percentage: 100
      })



      var indexEle = filesBeingProcessed.indexOf(message[2] + "")
      filesBeingProcessed.splice(indexEle, 1)

      console.log("filesBeingProcessed:" + filesBeingProcessed)


      if (message[4] == "healthcheck") {


        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              HealthCheck: "Success",
              processingStatus: false,
              lastHealthCheckDate: new Date()
            }
          }
        );


        StatisticsDB.update("statistics",
          {
            $inc: { totalHealthCheckCount: 1 }
          }
        );




      } else if (message[4] == "transcode") {



        FileDB.remove(message[5])

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


      }


      console.log(`Server:Worker completed:" ${message[2]}`)


    }

    try {
      if (message[1].includes("Skipped")) {


      }
    } catch (err) { console.log(err.stack) }

    if (message[1] == "copied") {


    }


    if (message[1] == "copiedFail") {



    }


    //if (message[1] == "originalReplaced") {
    try {
      if (message[1].includes("Original replaced")) {


      }
    } catch (err) { console.log(err.stack) }

    //if (message[1] == "originalNotReplaced") {
    try {
      if (message[1].includes("Original not replaced")) {



      }
    } catch (err) { console.log(err.stack) }



    try {
      if (message[1].includes("File repaired")) {



      }
    } catch (err) { console.log(err.stack) }

    try {
      if (message[1].includes("Unable to repair file")) {



      }
    } catch (err) {  console.log(err.stack)}




    if (message[1] == "FFPROBE") {


    }






    if (message[1] == "cancelled") {

      console.log("Cancelled message received")

      console.log(message)



      if (message[5] == "notsuicide") {


        upsertWorker(message[0], {
          _id: message[0],
          percentage: 100
        })


      } else if (message[5] == "suicide") {


        removeWorker(message[0])


        workers[message[0]] = "idle";



      }



      var indexEle = filesBeingProcessed.indexOf(message[2] + "")
      filesBeingProcessed.splice(indexEle, 1)


      if (message[4] == "healthcheck") {



        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              HealthCheck: "Cancelled",
              processingStatus: false,
              cliLog: "Item was cancelled by user.",
              lastHealthCheckDate: new Date(),
            }
          }
        );


      } else if (message[4] == "transcode") {


        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              TranscodeDecisionMaker: "Transcode cancelled",
              processingStatus: false,
              cliLog: "Item was cancelled by user.",
              lastTranscodeDate: new Date(),
            }
          }
        );

      }

    }


    if (message[1] == "writeRequest") {


    }




    if (message[1] == "appendRequest") {


    }







  }));








}



function updateConsole(message, skipWrite) {

  //console.log(skipWrite)

  if (verboseLogs == true) {
    skipWrite = false
  }

  //console.log(skipWrite)

  if (skipWrite == false) {

    console.log(`Server: ${message}`)

    var _id = shortid.generate()
    var a1 = message
    // var a2 = process.memoryUsage()
    // var a3 = (os.totalmem()-os.freemem())/1000
    // var a4 =(os.freemem())/1000
    // var a5 = (v*100)
    var a6 = new Date()

    var temp = {

      _id: _id,
      text: a1,
      // nodeMem:a2,
      // systemUsedMem:a3,
      // systemFreeMem:a4,
      // systemCPUPercentage:a5,
      createdAt: a6,

    }

    logsToAddToDB.push(temp)


  }








  // os.cpuUsage( Meteor.bindEnvironment(function(v){





  //       }));



}


//File watching




var settings = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch()

for (var i = 0; i < settings.length; i++) {

  if (settings[i].folderWatching == true) {

    console.log("Turning folder watch on for:" + settings[i].folder)


    createFolderWatch(settings[i].folder, settings[i]._id)

  }


}


Meteor.methods({

  'toggleFolderWatch'(Folder, DB_id, status) {


    if (status == true) {

      console.log("Turning folder watch on for:" + Folder)

      updateConsole("Turning folder watch on for:" + Folder, true)

      createFolderWatch(Folder, DB_id)


    } else if (status == false) {

      console.log("Turning folder watch off for:" + Folder)

      updateConsole("Turning folder watch off for:" + Folder, true)

      deleteFolderWatch(DB_id)


    }





  }

});




function deleteFolderWatch(DB_id) {

  updateConsole("Deleting folder watcher:" + DB_id, true)

  try {


    //try send message

    var messageOut = [
      "closeDown",
    ];

    folderWatchers[DB_id].send(messageOut)


    //delete watchers[DB_id]


  } catch (err) {
    console.log(err.stack)

    console.log("Deleting folder watcher failed (does not exist)")

    updateConsole("Deleting folder watcher failed (does not exist):" + DB_id, true)


  }


}










function createFolderWatch(Folder, DB_id) {


  var watcherID = DB_id

  var watcherPath = "assets/app/folderWatcher.js"

  var childProcess = require("child_process");
  var child_argv = [
    watcherID,
    Folder,
    DB_id,

  ]

  folderWatchers[watcherID] = childProcess.fork(watcherPath, child_argv);
  updateConsole("" + "Watcher " + watcherID + " launched" + "", false)


  folderWatchers[watcherID].on("exit", Meteor.bindEnvironment(function (code, signal) {

    updateConsole("" + "Folder Watcher exited" + "", false)



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
        bumped:false,
        history:""
      }

      Meteor.call('scanFiles', DB_id, filesToProcess, 0, 3, obj, function (error, result) { });

    }

    if (message[1] == "removeThisFileFromDB") {

      FileDB.remove(message[2])

    }




    if (message[1] == "requestingExit") {


      var messageOut = [
        "exitApproved",
      ];
      folderWatchers[message[0]].send(messageOut);


    }


    if (message[1] == "consoleMessage") {


      updateConsole("Scanner " + message[0] + ":" + message[2] + "", true);


    }

  }));



  //






}

dbUpdatePush();


function dbUpdatePush() {

  try {

    for (var i = 0; i < filesToAddToDB.length; i++) {

      if (addFilesToDB == false) {

        break

      } else {



        try {


          updateConsole(`Adding file to DB: ${filesToAddToDB[i]._id}`, true)


          FileDB.upsert(filesToAddToDB[i]._id,
            {
              $set: filesToAddToDB[i]
            }
          );


        } catch (err) {

          console.log(err.stack)

        }

        filesToAddToDB.splice(i, 1)

        i--

      }

    }



    for (var i = 0; i < logsToAddToDB.length; i++) {

      if (addFilesToDB == false) {

        break

      } else {
        try {


          //  updateConsole(`Adding log to DB: ${logsToAddToDB[i].text}`,true)

          LogDB.upsert(logsToAddToDB[i]._id,
            {
              $set: logsToAddToDB[i]
            }

          );



        } catch (err) {
          console.log(err.stack)


        }

        logsToAddToDB.splice(i, 1)

        i--

      }
    }
  } catch (err) {
    console.log(err.stack)
   }


  setTimeout(Meteor.bindEnvironment(dbUpdatePush), 1000);
}




var allFilesPulledTable = []
var generalFiles
var transcodeFiles
var healthcheckFiles


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


    } else {



      addFilesToDB = false

      allFilesPulledTable = []
      allFilesPulledTable = FileDB.find({}).fetch()


      var startDate = new Date();



      //sort queues based on user preference
      var globalSettings = GlobalSettingsDB.find({}, {}).fetch()

      if (globalSettings[0].queueSortType == "sortDateOldest") {

 

        allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });


      } else if (globalSettings[0].queueSortType == "sortDateNewest") {


        allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

      } else if (globalSettings[0].queueSortType == "sortSizeSmallest") {

        allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
          return a.file_size - b.file_size;
        });


      } else if (globalSettings[0].queueSortType == "sortSizeLargest") {


        allFilesPulledTable = allFilesPulledTable.sort(function (a, b) {
          return b.file_size - a.file_size;
        });

      }

      newSortType = globalSettings[0].queueSortType





      var settings = SettingsDB.find({}, { sort: { priority: 1 } }).fetch()



      //


      //Alternating libraries in queue



      // prioritise libraries based on order

      if (globalSettings[0].prioritiseLibraries == true) {



        for (var i = 0; i < settings.length; i++) {
          var length = allFilesPulledTable.length
          var count = 0
          for (var j = 0; j < allFilesPulledTable.length; j++) {

            if(allFilesPulledTable[j].DB === settings[i]._id){

              allFilesPulledTable.push(allFilesPulledTable[j])
              allFilesPulledTable.splice(j, 1)
              j--
              count++
              
              if(count == length){
                break
              }


            }
          }
        }

      }else{

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

        if(allFilesPulledTable[i].bumped instanceof Date){

        bumpedFiles.push(allFilesPulledTable[i])
        allFilesPulledTable.splice(i, 1)
        i--
        }
      }


      bumpedFiles = bumpedFiles.sort(function (a, b) {
        return new Date(b.bumped) - new Date(a.bumped);
      });

      allFilesPulledTable = bumpedFiles.concat(allFilesPulledTable)





      var table1data = allFilesPulledTable.filter(row => (row.TranscodeDecisionMaker == "Queued" && row.processingStatus == false));
      var table2data = allFilesPulledTable.filter(row => ((row.TranscodeDecisionMaker == "Transcode success" || row.TranscodeDecisionMaker == "Not required") && row.processingStatus == false));
      var table3data = allFilesPulledTable.filter(row => ((row.TranscodeDecisionMaker == "Transcode error" || row.TranscodeDecisionMaker == "Transcode cancelled") && row.processingStatus == false));
      var table4data = allFilesPulledTable.filter(row => (row.HealthCheck == "Queued" && row.fileMedium !== "audio" && row.processingStatus == false));
      var table5data = allFilesPulledTable.filter(row => (row.HealthCheck == "Success" && row.processingStatus == false));
      var table6data = allFilesPulledTable.filter(row => ((row.HealthCheck == "Error" || row.HealthCheck == "Cancelled") && row.processingStatus == false));

      table2data = sortTable(table2data, "lastTranscodeDate")
      table3data = sortTable(table3data, "lastTranscodeDate")

      table5data = sortTable(table5data, "lastHealthCheckDate")
      table6data = sortTable(table6data, "lastHealthCheckDate")


      function sortTable(data, sortType) {

        return data.sort(function (a, b) {
          return new Date(b[sortType]) - new Date(a[sortType]);
        });

      }


      StatisticsDB.upsert('statistics',
        {
          $set: {
            tdarrScore: ((table2data.length * 100.00) / (table1data.length + table2data.length + table3data.length)).toPrecision(4),
            healthCheckScore: ((table5data.length * 100.00) / (table4data.length + table5data.length + table6data.length)).toPrecision(4),
            table1Count: table1data.length,
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

      //







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

      //console.log(timeIdx)

      timeIdx = parseInt(timeIdx) + (d * 24)


      for (var i = 0; i < settings.length; i++) {

        try {
          if ((settings[i].schedule[timeIdx] !== undefined && settings[i].schedule[timeIdx].checked === false) || settings[i].processLibrary === false) {

            generalFiles = generalFiles.filter(row => row.DB != settings[i]._id);
            transcodeFiles = transcodeFiles.filter(row => row.DB != settings[i]._id);
            healthcheckFiles = healthcheckFiles.filter(row => row.DB != settings[i]._id);
            table1data = table1data.filter(row => row.DB != settings[i]._id);
            table2data = table2data.filter(row => row.DB != settings[i]._id);
            table3data = table3data.filter(row => row.DB != settings[i]._id);
            table4data = table4data.filter(row => row.DB != settings[i]._id);
            table5data = table5data.filter(row => row.DB != settings[i]._id);
            table6data = table6data.filter(row => row.DB != settings[i]._id);

          }
        } catch (err) { console.log(err.stack) }
      }

      //old





      //

      table1data = table1data.slice(0, 20)
      table2data = table2data.slice(0, 20)
      table3data = table3data.slice(0, 20)
      table4data = table4data.slice(0, 20)
      table5data = table5data.slice(0, 20)
      table6data = table6data.slice(0, 20)














      var endDate = new Date();
      var seconds2 = (endDate.getTime() - startDate.getTime()) / 1000;

      newFetchtime = Math.round(seconds2 * 10) / 10;

      // console.log("Fetch time: " + newFetchtime)

      //console.log("data done")



      ClientDB.upsert("client",
        {
          $set: {
            table1: table1data,
            table2: table2data,
            table3: table3data,
            table4: table4data,
            table5: table5data,
            table6: table6data,
          }
        }
      );


      //   ClientDB.upsert("client",
      //   {
      //       $set: {
      //           table1:table1data,
      //         }
      //   }
      // );




      statisticsUpdate();






      // filesToAddToDBLengthNew = 0
      // filesToAddToDBLengthOld = 0
      filesToAddToDBLengthNew = filesToAddToDB.length + logsToAddToDB.length

      var DBLoadStatus

      if (filesToAddToDBLengthNew > filesToAddToDBLengthOld || newFetchtime > oldFetchtime) {

        DBLoadStatus = "Increasing"

        //    DBPollPeriod += 1000

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

      DBPollPeriod = allFilesPulledTable.length + filesToAddToDB.length + logsToAddToDB.length



      //console.log("DBPollPeriod:" + DBPollPeriod)

      oldFetchtime = newFetchtime
      filesToAddToDBLengthOld = filesToAddToDB.length + logsToAddToDB.length


      StatisticsDB.upsert("statistics",
        {
          $set: {
            DBPollPeriod: DBPollPeriod > 1000 ? (DBPollPeriod / 1000) + "s" : "1s",
            DBFetchTime: (newFetchtime).toFixed(1) + "s",
            DBTotalTime: ((DBPollPeriod / 1000) + newFetchtime).toFixed(1) + "s",
            DBLoadStatus: DBLoadStatus,
            DBQueue: filesToAddToDB.length + + logsToAddToDB.length
          }
        }
      );




    }


    setTimeout(Meteor.bindEnvironment(tablesUpdate), DBPollPeriod > 1000 ? DBPollPeriod : 1000);

  } catch (err) {

    console.log(err.stack)

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



  updatePieStats("TranscodeDecisionMaker", '', 'pie1')
  updatePieStats('HealthCheck', '', 'pie2')

  updatePieStats('video_codec_name', 'video', 'pie3')
  updatePieStats('container', 'video', 'pie4')
  updatePieStats('video_resolution', 'video', 'pie5')

  updatePieStats('audio_codec_name', 'audio', 'pie6')
  updatePieStats('container', 'audio', 'pie7')

}


function updatePieStats(property, fileMedium, pie) {


  const data = [];

  var allFilesWithProp = allFilesPulledTable


  if (fileMedium == "video" || fileMedium == "audio") {

    allFilesWithProp = allFilesWithProp.filter(row => (!!row[property] && row.fileMedium == fileMedium));

  } else {

    allFilesWithProp = allFilesWithProp.filter(row => (!!row[property]));

  }


  var uniquePropArr = []


  for (var i = 0; i < allFilesWithProp.length; i++) {

    if (!(uniquePropArr.includes(allFilesWithProp[i][property]))) {
      uniquePropArr.push(allFilesWithProp[i][property])
    }


  }

  //Make sure to update Pie chart read section if this is changed

  for (var i = 0; i < uniquePropArr.length; i++) {

    data.push({ name: uniquePropArr[i], value: allFilesWithProp.filter(row => row[property] == uniquePropArr[i]).length })

  }

  StatisticsDB.upsert("statistics",
    {
      $set: {
        [pie]: data
      }
    }
  );


}





//set cpu priority low

setProcessPriority()




function setProcessPriority() {

  try {

    if (process.platform == 'win32') {

      var workerCommandFFmpeg = 'wmic process where name=\"ffmpeg.exe\" CALL setpriority \"Below normal\"'
      var workerCommandHandBrake = 'wmic process where name=\"HandBrakeCLI.exe\" CALL setpriority \"Below normal\"'
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

    //console.log(globalSettings)



    if (globalSettings[0].lowCPUPriority == true) {

      shellWorker = shell.exec(workerCommandFFmpeg, function (code, stdout, stderr, stdin) { });
      shellWorker = shell.exec(workerCommandHandBrake, function (code, stdout, stderr, stdin) { });

    }

  } catch (err) { 
    console.log(err.stack)
  }

  setTimeout(Meteor.bindEnvironment(setProcessPriority), 10000);

}

var workerStatus = {}




workerUpdateCheck();

//worker will cancel item if percentage stays the same for 300 secs
function workerUpdateCheck() {

  //

  try {

    var generalWorkers = workerDB.filter(row => row.mode == "general")
    var transcodeWorkers = workerDB.filter(row => row.mode == "transcode")
    var healthcheckWorkers = workerDB.filter(row => row.mode == "healthcheck")

    //

    var globs = GlobalSettingsDB.find({}, {}).fetch()

    var gDiff = globs[0].generalWorkerLimit - generalWorkers.length
    var tDiff = globs[0].transcodeWorkerLimit - transcodeWorkers.length
    var hDiff = globs[0].healthcheckWorkerLimit - healthcheckWorkers.length

    verboseLogs = globs[0].verboseLogs

    if (gDiff >= 1 && generalFiles.length > 0) {
      Meteor.call('launchWorker', "general", gDiff, function (error, result) { });
    }
    if (tDiff >= 1 && transcodeFiles.length > 0) {
      Meteor.call('launchWorker', "transcode", tDiff, function (error, result) { });
    }

    if (hDiff >= 1 && healthcheckFiles.length > 0) {
      Meteor.call('launchWorker', "healthcheck", hDiff, function (error, result) { });
    }

    var workerCheck = findWorker() //[]





    checkReduceIncrease(gDiff, generalWorkers)
    checkReduceIncrease(tDiff, transcodeWorkers)
    checkReduceIncrease(hDiff, healthcheckWorkers)

    function checkReduceIncrease(Diff, WorkerType) {

      for (var i = 0; i < WorkerType.length; i++) {
        upsertWorker(WorkerType[i]._id, {
          _id: WorkerType[i]._id,
          idle: false,
        })
      }

      if (Diff <= -1) {

        var count = 0

        for (var i = 0; i < WorkerType.length; i++) {

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
    //



    var workerCheck = findWorker()

    for (var i = 0; i < workerCheck.length; i++) {

      try {



        if (workerStatus[workerCheck[i]._id][1] == 300) {



          if (workerStatus[workerCheck[i]._id][0] == workerCheck[i].file + workerCheck[i].percentage + "") {

            console.log("Worker " + workerCheck[i]._id + " stalled. Cancelling item.")
            // Meteor.call('cancelWorkerItem', workerCheck[i]._id, function (error, result) { })
            workerStatus[workerCheck[i]._id][0] = ""
            workerStatus[workerCheck[i]._id][1] = -1

          } else {

            console.log("Worker " + workerCheck[i]._id + " has not stalled.")

            workerStatus[workerCheck[i]._id][0] = workerCheck[i].file + workerCheck[i].percentage + ""
            workerStatus[workerCheck[i]._id][1] = 0

          }


        } else {

          workerStatus[workerCheck[i]._id][1] = (workerStatus[workerCheck[i]._id][1]) + 1

        }



      } catch (err) { console.log(err.stack) }
    }


  } catch (err) { console.log(err.stack) }

  setTimeout(Meteor.bindEnvironment(workerUpdateCheck), 1000);
}

