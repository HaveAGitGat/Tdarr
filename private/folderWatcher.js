


function updateConsole(watcherID, text) {

    var message = [
        watcherID,
        "consoleMessage",
        text,
    ];
    process.send(message);
}

process.on('uncaughtException', function (err) {

    console.error(err.stack);

    updateConsole(watcherID, ":" + err.stack)


    process.exit();
});


var path = require("path");
var fs = require('fs');
var watcherFilesToScan = {}
var watchers = {}

if (fs.existsSync(path.join(process.cwd() , "/npm"))) {

    var rootModules = path.join(process.cwd() , '/npm/node_modules/')

} else {

    var rootModules = ''

}


var watcherID = process.argv[2]
var Folder = process.argv[3]
var DB_id = process.argv[4]

var exitRequestSent = false



const chokidar = require(rootModules+'chokidar');



updateConsole("Folder watcher: Creating folder watch for library:" +Folder)


watcherFilesToScan[DB_id] = {}
watcherFilesToScan[DB_id].id = DB_id
watcherFilesToScan[DB_id].filesToScan = []
watcherFilesToScan[DB_id].oldLength = 0
watcherFilesToScan[DB_id].newLength = 0


watchers[DB_id] = chokidar.watch(Folder, {
  persistent: true,
  ignoreInitial: true,
  followSymlinks: true,
  usePolling: true,
  interval: 30000,
  binaryInterval: 30000,
  awaitWriteFinish: {
    stabilityThreshold: 10000,
    pollInterval: 1000
  },
});

// Something to use when events are received.
const log = console.log.bind(console);
// Add event listeners.
watchers[DB_id]
  .on('add', newFile => {

    newFile = newFile.replace(/\\/g, "/");


    updateConsole("Folder watcher: File detected, adding to queue:" +newFile)

    watcherFilesToScan[DB_id].filesToScan.push(newFile)


  })
  // .on('change', path => log(`File ${path} has been changed`))
  .on('unlink', path => {

    path = path.replace(/\\/g, "/");

    updateConsole("Folder watcher: file removed, removing:" +path)

    //  log(`File ${path} has been removed`)
   

    var message = [
      watcherID,
      "removeThisFileFromDB",
      path,

  ];
  process.send(message);


  })
  .on('error', error => {
    updateConsole(`Folder Watcher: error: ${error}`)
  })

  .on('ready', () => { updateConsole("Folder watcher: Initial scan complete. Ready for changes")})

//on close


process.on('message', (m) => {

    if (m[0] == "closeDown") {

    
      if(exitRequestSent == false){

        watchers[DB_id].close();

        var message = [
            watcherID,
            "requestingExit",
            DB_id,

        ];
        process.send(message);

      }


        exitRequestSent = true
       

    }


    if (m[0] == "exitApproved") {

        process.exit();


    }

})







  scanWatcherFiles()


function scanWatcherFiles() {



  updateConsole("Folder watcher:" +JSON.stringify(watcherFilesToScan))


  Object.keys(watcherFilesToScan).forEach(function (key) {

    try {


      //newLength = watcherFilesToScan.length
      watcherFilesToScan[key].newLength = watcherFilesToScan[key].filesToScan.length

      if (watcherFilesToScan[key].newLength == watcherFilesToScan[key].oldLength && watcherFilesToScan[key].filesToScan.length != 0) {

        updateConsole("Folder watcher: Sending files for scanning, library :" +watcherFilesToScan[key].id)


        var message = [
            watcherID,
            "sendFilesForExtract",
            DB_id,
            watcherFilesToScan[key].filesToScan,

        ];
        process.send(message);

       
       
       
       watcherFilesToScan[key].filesToScan = []

      }
      // oldLength = newLength

      watcherFilesToScan[key].oldLength = watcherFilesToScan[key].newLength


    } catch (err) { }
  });



  setTimeout(scanWatcherFiles, 10000);
}