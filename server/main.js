import '../imports/api/Methods.js';
import '../imports/api/Logger.js';
import '../imports/api/tasks.js';




import { FileDB, SettingsDB, GlobalSettingsDB,StatisticsDB,ClientDB } from '../imports/api/tasks.js';




const chokidar = require('chokidar');

const shortid = require('shortid');



//new file comes in
//=> file added to DB
//=> decision maker triggered




//Globals
var path = require("path");
var fs = require('fs');
var workers = {}
var fileScanners = {}

// var workerDB = [{
//   _id:"test",
//   file:"test file",
//   percentage:20,
//   mode:"transcode",
// }]

var workerDB = []


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
        generalWorkerLimit:0,
        transcodeWorkerLimit:0,
        healthcheckWorkerLimit:0,
      }
    }
  );



}

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
}

//initialise stats properties

var count = StatisticsDB.find({}, {}).fetch()

if (!Array.isArray(count) || !count.length) {

  StatisticsDB.upsert('statistics',
    {
      $set: {
        totalFileCount:0,
        totalTranscodeCount:0,
        totalHealthCheckCount:0,
        pie1: [{name:"No data",value:1}],
        pie2: [{name:"No data",value:1}],
        pie3: [{name:"No data",value:1}],
        pie4: [{name:"No data",value:1}],
        pie5: [{name:"No data",value:1}],
        pie6: [{name:"No data",value:1}],
        pie7: [{name:"No data",value:1}],
      }
    }
  );



}

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

    var allFiles =FileDB.find({}).fetch()
    allFiles = allFiles.sort(function(a,b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    });


    allFiles = allFiles.filter(row => (row.file).toLowerCase().includes(string.toLowerCase()) );
    return allFiles
    //FileDB.find({},{ sort: { createdAt: - 1 }}).fetch()


   // return (FileDB.find({},{ sort: { createdAt: - 1 }}).fetch()).filter(row => (row.file).toLowerCase().includes(string.toLowerCase()) );



  },

  
  'resetAllStatus'(mode) {

  //  var allFiles = FileDB.find({},{ sort: { createdAt: - 1 }}).fetch()

  var allFiles =FileDB.find({}).fetch()
  allFiles = allFiles.sort(function(a,b){
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

    for(var i = 0; i < allFiles.length; i++){

      FileDB.upsert(
        allFiles[i].file,
        {
          $set: {
            [mode]: "Not attempted",
          }
        }
      );
    }



  },

  'verifyFolder'(folderPath,DB_id,folderType) {

    if(fs.existsSync(folderPath)) {

      SettingsDB.upsert(
      DB_id,
      {
        $set: {
          [folderType]: true,
        }
      }
    );


    }else{

      SettingsDB.upsert(

        DB_id,
        {
          $set: {
            [folderType]: false,
          }
        }
      );


    }

// const { lstatSync, readdirSync } = require('fs')
// const { join } = require('path')

// const isDirectory = source => lstatSync(source).isDirectory()
// const getDirectories = source =>
//   readdirSync(source).map(name => join(source, name)).filter(isDirectory)

  },

    'getWorkers'() {


      return workerDB

    },

    'upsertWorkers'(w_id,obj) {
      upsertWorker(w_id, obj)
    },

  //launch worker
  'launchWorker'(workerType,number) {

    console.log("here")


    for (var i = 1; i <= number; i++) {
      launchWorkerModule(workerType)

    }

  },

  'killWorker'(workerID, file, mode) {

    var messageOut = [
      "suicide",
    ];


    try {

      workers[workerID].send(messageOut);

    } catch (err) { }

    //var indexEle = filesBeingProcessed.indexOf(file)
    //filesBeingProcessed.splice(indexEle, 1)




  }, 'cancelWorkerItem'(workerID) {


    var messageOut = [
      "exitThread",
    ];

    try {
      workers[workerID].send(messageOut);
    } catch (err) { }


  }, 'scanFiles'(DB_id, arrayOrPath, arrayOrPathSwitch, mode,HealthCheck,TranscodeDecisionMaker) {



    if (mode == 0) {

      console.log("Commencing file update scan. Deleting non-existent files and adding new files.")

     // var filesInDB = FileDB.find({ DB: DB_id }, { sort: { createdAt: 1 } }).fetch()

     var filesInDB  = FileDB.find({}).fetch()
     filesInDB = filesInDB.sort(function(a,b){
       return new Date(b.createdAt) - new Date(a.createdAt);
     });
   
     filesInDB  = filesInDB.filter(row => row.DB == DB_id );

      filesInDB = filesInDB.map((file, i) => {
        if (!(fs.existsSync(file.file))) {
          //delete files in DBs if not exist anymore (cleanse)
          console.log("File does not exist anymore, removing:" + file.file)
          FileDB.remove(file.file)
        } else {
          return file.file

        }
      });


    } else if (mode == 1) {

      console.log("Commencing fresh file scan.");
      FileDB.remove({ DB: DB_id });

      var filesInDB = []

    } else if (mode == 3) {

      var filesInDB = []

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




    var scannerID = shortid.generate()

    var scannerPath = "assets/app/fileScanner.js"

    var childProcess = require("child_process");
    var child_argv = [
      scannerID,
      DB_id,
      arrayOrPath,
      arrayOrPathSwitch,
      allowedContainers,
      filesInDB,
      HealthCheck,
      TranscodeDecisionMaker,
    ]

    fileScanners[scannerID] = childProcess.fork(scannerPath, child_argv);
    updateConsole("" + "Scanner " + scannerID + " launched" + "")


    fileScanners[scannerID].on("exit", Meteor.bindEnvironment(function (code, signal) {

      updateConsole("" + "Worker exited" + "")



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


        console.log("addFileToDB")



        // console.log(message[2])
        // console.log(message[3])
        // console.log(message[4])

        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              file: message[2],
              DB: message[4],
              HealthCheck: message[5],
              TranscodeDecisionMaker: message[6],
              processingStatus:false,
              createdAt: new Date(),
            }
          }

        );

        //   var obj = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');

        //  var jsonData = JSON.parse(message[3]);

        var jsonData = message[3];

       // console.log(message[2])

      //   console.log(jsonData)

        if (typeof jsonData === 'object' && jsonData !== null) {

        //  console.log("jsonData is object")

        } else {

       //   console.log("jsonData isn't object")


        }

                  try{

          FileDB.upsert(message[2],
            {
              $set: jsonData
            }
          );

        }catch(err){

          console.log("Error adding file property to DB")

        }



        // Object.keys(jsonData).forEach(function (key) {

        //   try{

        //   FileDB.upsert(message[2],
        //     {
        //       $set: {
        //         [key]: jsonData[key]
        //       }
        //     }
        //   );

        // }catch(err){

        //   console.log("Error adding file property to DB")

        // }



        // });




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

        updateConsole("Scanner " + message[0] + ":" + message[2] + "");



        //  }


      }


    }));



  }
})

function findWorker(w_id){


  if(w_id){

      var idx = workerDB.findIndex(row => row._id == w_id);

  if (idx >= 0) {
     return [workerDB[idx]]
  }else{

    return []
  }


  }else{

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

              console.log("Error adding file property to DB")

          }



      });


  } else {
      workerDB.push({ _id: w_id })
      upsertWorker(w_id, obj)

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



  updateConsole("" + "Worker " + workerID + " launched" + "")



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

    updateConsole("" + "Worker exited" + "")



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

      updateConsole("Worker " + message[0] + ":" + message[2] + "");



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

          }else if(workerType == "healthcheck"){

 
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

            files.splice(0,1)

            //Settings from fileDB

            if (filesBeingProcessed.includes(firstItem.file+"")) {

              //put item to back of the queue so doesn't hold up queue

            var messageOut = [
              "requestNewItem",

            ]
              workers[message[0]].send(messageOut);

            } else {







              FileDB.upsert(firstItem.file,
                {
                  $set: {
                    _id: firstItem.file,
                    processingStatus:true

                  }
                }
              );

              filesBeingProcessed.push(firstItem.file+"")

              if (workerType == "general") {

                if(firstItem.HealthCheck =="Not attempted" && firstItem.fileMedium == "video"){
      
                  var mode = "healthcheck"
      
                }else if(firstItem.TranscodeDecisionMaker =="Not attempted"){
                  var mode = "transcode"
                }
              }



              upsertWorker(message[0], {
                _id: message[0],
                file: firstItem.file,
                mode: workerType,
                modeType: mode,
                idle: false,
                percentage: 0
              })



             

              var fileToProcess = firstItem.file
              var fileID = firstItem._id
              var settings = SettingsDB.find({ _id: firstItem.DB }, { sort: { createdAt: 1 } }).fetch()


              //Settings from SettingsDB
              var settingsDBIndex = firstItem.DB
              var inputFolderStem = settings[0].folder
              var outputFolder = settings[0].cache
              var container = settings[0].container
              var preset = settings[0].preset
              var handBrakeMode = settings[0].handbrake
              var FFmpegMode = settings[0].ffmpeg

              var handbrakescan = settings[0].handbrakescan
              var ffmpegscan = settings[0].ffmpegscan

              var processFile = true

              var cliLogAdd = ""
      

              if (mode == "healthcheck") {

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
                  settingsDBIndex

                ]


              } else if (mode == "transcode") {



                //Transcode decision maker


                //Video settings
                if (settings[0].decisionMaker.videoFilter == true) {

                  if (firstItem.fileMedium !== "video") {
                    
                    console.log("File is not video")

                    cliLogAdd +="File is not video"

                    processFile = false;
                  }else{

                  video_codec_names_exclude = settings[0].decisionMaker.video_codec_names_exclude
                  video_codec_names_exclude = video_codec_names_exclude.map(row => {
                    if (row.checked == true) {
                      return row.codec
                    }
                  })


                  if (video_codec_names_exclude.includes(firstItem.video_codec_name) && typeof firstItem.video_codec_name !== 'undefined') {

                    console.log(video_codec_names_exclude +"   "+firstItem.video_codec_name)

                    console.log("File already in required codec")

                    cliLogAdd += "File already in required codec"

                    processFile = false;

                  }

                  if (firstItem.file_size >= settings[0].decisionMaker.video_size_range_include.max || firstItem.file_size <= settings[0].decisionMaker.video_size_range_include.min) {
                    console.log("File not in video size range")

                    cliLogAdd += "File not in video size range"

                    processFile = false;
                  }

                  if (firstItem.video_height >= settings[0].decisionMaker.video_height_range_include.max || firstItem.video_height <= settings[0].decisionMaker.video_height_range_include.min) {
                    console.log("File not in video height range")

                    cliLogAdd += "File not in video height range"

                    processFile = false;
                  }

                  if (firstItem.video_width >= settings[0].decisionMaker.video_width_range_include.max || firstItem.video_width <= settings[0].decisionMaker.video_width_range_include.min) {
                    console.log("File not in video width range")
                    cliLogAdd += "File not in video width range"

                    processFile = false;
                  }

                }

                }

                if (settings[0].decisionMaker.audioFilter == true) {

                  if (firstItem.fileMedium !== "audio") {

                    console.log("File is not audio")
                    cliLogAdd += "File is not audio"

                    processFile = false;
                  }else{

                  audio_codec_names_exclude = settings[0].decisionMaker.audio_codec_names_exclude
                  audio_codec_names_exclude = audio_codec_names_exclude.map(row => {
                    if (row.checked == true) {
                      return row.codec
                    }
                  })


                  if (audio_codec_names_exclude.includes(firstItem.audio_codec_name)  && typeof firstItem.audio_codec_name !== 'undefined') {

                    console.log("File already in required codec")
                    cliLogAdd += "File already in required codec"

                    processFile = false;

                  }

                  if (firstItem.file_size >= settings[0].decisionMaker.audio_size_range_include.max || firstItem.file_size <= settings[0].decisionMaker.audio_size_range_include.min) {
                    
                    console.log("File not in audio size range")

                    cliLogAdd += "File not in audio size range"

                    processFile = false;
                  }


                }

                }


                var frameCount = firstItem.video_nb_frames

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
                  settingsDBIndex

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
                        TranscodeDecisionMaker:"Passed",
                        processingStatus:false,
                        cliLog:cliLogAdd,

                      }
                    }
                  );


                var indexEle = filesBeingProcessed.indexOf(firstItem.file  + "")
                filesBeingProcessed.splice(indexEle, 1)
                console.log("after:" + filesBeingProcessed)


             
               var messageOut = [
                "requestNewItem",

              ]
                workers[message[0]].send(messageOut);



                //






              } else if (processFile == true) {


                upsertWorker(message[0], {
                  _id: message[0],
                  file: fileToProcess,
                  mode: workerType,
                  modeType: mode,
                  idle: false,
                  percentage: 0
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

    // if (mode != "healthCheck") {

    // }

    if (message[1] == "percentage") {


      upsertWorker(message[0], {
        percentage: message[2],
      })

      // console.log(`Server: ${message[2]}`)

    }

    if (message[1] == "repair_worker_percentage") {

    }



    if (message[1] == "error") {


      upsertWorker(message[0], {
        _id: message[0],
        percentage: 100
      })



      var indexEle = filesBeingProcessed.indexOf(message[2]  + "")
      filesBeingProcessed.splice(indexEle, 1)

      console.log("filesBeingProcessed:" + filesBeingProcessed)


      if (message[4] == "healthcheck") {

        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              HealthCheck:"Error",
              processingStatus:false,
              cliLog:message[5],
              createdAt: new Date(),
            }
          }
        );

        StatisticsDB.update("statistics",
        {
          $inc: { totalHealthCheckCount: 1}
        }
      );


      } else if (message[4] == "transcode") {

        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              TranscodeDecisionMaker:"Transcode error",
              processingStatus:false,
              cliLog:message[5],
              createdAt: new Date(),
            }
          }
        );
      //  ffprobeLaunch([message[2]], OutputDB, message[3])

      StatisticsDB.update("statistics",
      {
        $inc: { totalTranscodeCount: 1}
      }
    );


      }
    }



    if (message[1] == "success") {


      upsertWorker(message[0], {
        _id: message[0],
        percentage: 100
      })



      var indexEle = filesBeingProcessed.indexOf(message[2]  + "")
      filesBeingProcessed.splice(indexEle, 1)

      console.log("filesBeingProcessed:" + filesBeingProcessed)


      if (message[4] == "healthcheck") {


        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              HealthCheck:"Success",
              processingStatus:false,
              createdAt: new Date(),
            }
          }
        );


        StatisticsDB.update("statistics",
          {
            $inc: { totalHealthCheckCount: 1}
          }
        );




      } else if (message[4] == "transcode") {

       // console.log("HERE")

        //console.log(message[2])

        // FileDB.upsert(message[2],
        //   {
        //     $set: {
        //       _id: message[2],
        //       file: message[2],
        //       DB: message[3],
        //       mode: message[4],

        //       createdAt: new Date(),
        //     }
        //   }
        // );


      //  ffprobeLaunch([message[2]], OutputDB, message[3])

      FileDB.remove(message[5])

      newFile = [message[2],]
      Meteor.call('scanFiles', message[3], newFile, 0, 3,"Not attempted","Transcode success", function (error, result) { });

      StatisticsDB.update("statistics",
      {
        $inc: { totalTranscodeCount: 1}
      }
    );


      }


      console.log(`Server:Worker completed:" ${message[2]}`)


    }

    try {
      if (message[1].includes("Skipped")) {


      }
    } catch (err) { }

    if (message[1] == "copied") {


    }


    if (message[1] == "copiedFail") {



    }


    //if (message[1] == "originalReplaced") {
    try {
      if (message[1].includes("Original replaced")) {


      }
    } catch (err) { }

    //if (message[1] == "originalNotReplaced") {
    try {
      if (message[1].includes("Original not replaced")) {



      }
    } catch (err) { }



    try {
      if (message[1].includes("File repaired")) {



      }
    } catch (err) { }

    try {
      if (message[1].includes("Unable to repair file")) {



      }
    } catch (err) { }




    if (message[1] == "FFPROBE") {


    }






    if (message[1] == "cancelled") {

      console.log("Cancelled message received")

      console.log(message)



      if(message[5] == "notsuicide"){


      upsertWorker(message[0], {
        _id: message[0],
        percentage: 100
      })


    }else if(message[5] == "suicide"){


      removeWorker(message[0])


      workers[message[0]] = "idle";
  


    }



      var indexEle = filesBeingProcessed.indexOf(message[2]  + "")
      filesBeingProcessed.splice(indexEle, 1)


      if (message[4] == "healthcheck") {

        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              HealthCheck:"Cancelled",
              processingStatus:false,
              cliLog:"Item was cancelled by user.",
              createdAt: new Date(),
            }
          }
        );


      } else if (message[4] == "transcode") {

        FileDB.upsert(message[2],
          {
            $set: {
              _id: message[2],
              TranscodeDecisionMaker:"Transcode cancelled",
              processingStatus:false,
              cliLog:"Item was cancelled by user.",
              createdAt: new Date(),
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


  console.log(`Server: ${message}`)

}


//File watching

var watchers = {}


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

      createFolderWatch(Folder, DB_id)


    } else if (status == false) {

      console.log("Turning folder watch off for:" + Folder)

      deleteFolderWatch(DB_id)


    }





  }

});

function deleteFolderWatch(DB_id) {

  try {

    watchers[DB_id].close();

    delete watchers[DB_id]
  } catch (err) {

    console.log("Deleting folder watcher failed (does not exist)")

  }


}


function createFolderWatch(Folder, DB_id) {

  watchers[DB_id] = chokidar.watch(Folder, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  // Something to use when events are received.
  const log = console.log.bind(console);
  // Add event listeners.
  watchers[DB_id]
    .on('add', Meteor.bindEnvironment(newFile => {

      newFile = newFile.replace(/\\/g, "/");

      newFile = [newFile,]
      Meteor.call('scanFiles', DB_id, newFile, 0, 3,"Not attempted","Not attempted", function (error, result) { });








    }))
    // .on('change', path => log(`File ${path} has been changed`))
    .on('unlink', Meteor.bindEnvironment(path => {

      path = path.replace(/\\/g, "/");

      log(`File ${path} has been removed`)
      FileDB.remove(path)


    }));



}


tableUpdate = setInterval(Meteor.bindEnvironment(tablesUpdate), 4000);

var allFilesPulledTable
var generalFiles 
var transcodeFiles 
var healthcheckFiles 

function tablesUpdate(){

  var startDate = new Date();

  // allFilesPulledTable = FileDB.find({}).fetch()

  // allFilesPulledTable = allFilesPulledTable.sort(function(a,b){
  //   return new Date(b.createdAt) - new Date(a.createdAt);
  // });
  allFilesPulledTable = FileDB.find({},{ sort: { createdAt: - 1 }}).fetch()



//all_reviews = db_handle.find().sort('reviewDate', pymongo.ASCENDING)
//db_handle.ensure_index([("reviewDate", pymongo.ASCENDING)])

//all_reviews = db_handle.aggregate([{$sort: {'reviewDate': 1}}], {allowDiskUse: true})



 var table1data = allFilesPulledTable.filter(row => ( row.TranscodeDecisionMaker == "Not attempted" && row.processingStatus == false ) );
 var table2data = allFilesPulledTable.filter(row => ( (row.TranscodeDecisionMaker == "Transcode success" ||row.TranscodeDecisionMaker == "Passed" ) && row.processingStatus == false ) );
 var table3data = allFilesPulledTable.filter(row => ( (row.TranscodeDecisionMaker == "Transcode error" || row.TranscodeDecisionMaker == "Transcode cancelled" ) && row.processingStatus == false ) );
 var table4data = allFilesPulledTable.filter(row => ( row.HealthCheck == "Not attempted" && row.fileMedium == "video"  && row.processingStatus == false ) );
 var table5data = allFilesPulledTable.filter(row => ( row.HealthCheck == "Success"  && row.processingStatus == false ) );
 var table6data = allFilesPulledTable.filter(row => ( (row.HealthCheck == "Error" || row.HealthCheck == "Cancelled")  && row.processingStatus == false ) );

 generalFiles = (table4data).concat(table1data)
 //console.log("generalFiles:"+generalFiles)
 transcodeFiles  = table1data
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
 //console.log(timeIdx)

 var settings = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch()

 for(var i = 0; i < settings.length; i++){


  if(settings[i].schedule[timeIdx].checked == false){



    generalFiles = generalFiles.filter(row => row.DB != settings[i]._id );
    transcodeFiles  = transcodeFiles.filter(row => row.DB != settings[i]._id );
    healthcheckFiles = healthcheckFiles.filter(row => row.DB != settings[i]._id );


  }
 }

 //

 var generalWorkers = workerDB.filter(row => row.mode == "general"  ).length;
 var transcodeWorkers = workerDB.filter(row => row.mode == "transcode"  ).length;
 var healthcheckWorkers = workerDB.filter(row => row.mode == "healthcheck"  ).length;

 //

 var globs =GlobalSettingsDB.find({}, {}).fetch()

 var gDiff = globs[0].generalWorkerLimit - generalWorkers
 var tDiff = globs[0].transcodeWorkerLimit - transcodeWorkers
 var hDiff = globs[0].healthcheckWorkerLimit - healthcheckWorkers

 if(gDiff >= 1){
  Meteor.call('launchWorker', "general",gDiff, function (error, result) { });
 }
 if(tDiff >= 1){
  Meteor.call('launchWorker', "transcode",tDiff, function (error, result) { });
 }

 if(hDiff >= 1){
  Meteor.call('launchWorker', "healthcheck",hDiff, function (error, result) { });
 }





StatisticsDB.upsert('statistics',
 {
     $set: {
         tdarrScore:((table2data.length*100.00)/(table1data.length+table2data.length+table3data.length)).toPrecision(4),
         healthCheckScore:((table5data.length*100.00)/(table4data.length+table5data.length+table6data.length)).toPrecision(4),
       }
 }
);


table1data = table1data.slice(0,20)
table2data = table2data.slice(0,20)
table3data = table3data.slice(0,20)
table4data = table4data.slice(0,20)
table5data = table5data.slice(0,20)
table6data = table6data.slice(0,20)







 var endDate = new Date();
 var seconds2 = (endDate.getTime() - startDate.getTime()) / 1000;

 var time = seconds2

 //console.log("time taken: "+time)

//console.log("data done")



    ClientDB.upsert("client",
  {
      $set: {
          table1:table1data,
          table2:table2data,
          table3:table3data,
          table4:table4data,
          table5:table5data,
          table6:table6data,
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

}




var allFilesPulled

function statisticsUpdate(){



  StatisticsDB.upsert("statistics",
                            {
                                $set: {
                                    totalFileCount: allFilesPulledTable.length
                                }
                            }
                        );



  updatePieStats("TranscodeDecisionMaker",'','pie1')
  updatePieStats('HealthCheck','','pie2')
  updatePieStats('video_codec_name','video','pie3')
  updatePieStats('container','video','pie4')
  updatePieStats('video_resolution','video','pie5')
  updatePieStats('audio_codec_name','audio','pie6')
  updatePieStats('container','audio','pie7')

}


function updatePieStats(property,fileMedium,pie) {

  



    const data = [];

    var allFilesWithProp =  allFilesPulledTable


    if(fileMedium == "video" || fileMedium == "audio"){

      allFilesWithProp = allFilesWithProp.filter(row => ( !!row[property] && row.fileMedium == fileMedium ) );

    }else{

      allFilesWithProp = allFilesWithProp.filter(row => ( !!row[property]) );
      
    }


    var uniquePropArr = []


    for(var i = 0; i < allFilesWithProp.length; i++){

      if( !(uniquePropArr.includes(allFilesWithProp[i][property]))){
        uniquePropArr.push(allFilesWithProp[i][property])
      }


    }

    for(var i = 0; i < uniquePropArr.length; i++){

      data.push({name:uniquePropArr[i], value: allFilesWithProp.filter(row => row[property] == uniquePropArr[i]).length })


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
priorityCheck = setInterval(Meteor.bindEnvironment(setProcessPriority), 5000);


function setProcessPriority() {


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


  let globalSettings = GlobalSettingsDB.find({}, {}).fetch()

  //console.log(globalSettings)



  if (globalSettings[0].lowCPUPriority == true) {

    shellWorker = shell.exec(workerCommandFFmpeg, function (code, stdout, stderr, stdin) { });
    shellWorker = shell.exec(workerCommandHandBrake, function (code, stdout, stderr, stdin) { });

  }


}

var workerStatus = {}

checkIfWorkerStalled = setInterval(Meteor.bindEnvironment(workerStallCheck), 1000);


//worker will cancel item if percentage stays the same for 300 secs
function workerStallCheck() {

  let workerCheck = findWorker()

  for (var i = 0; i < workerCheck.length; i++) {

    try {



      if (workerStatus[workerCheck[i]._id][1] == 300) {



        if (workerStatus[workerCheck[i]._id][0] == workerCheck[i].file + workerCheck[i].percentage + "") {

          console.log("Worker " + workerCheck[i]._id + " stalled. Cancelling item.")
          Meteor.call('cancelWorkerItem', workerCheck[i]._id, function (error, result) { })
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



    } catch (err) { }
  }
}

