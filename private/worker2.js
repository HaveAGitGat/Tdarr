//Change node module paths dev/prod (rootModules)

function updateConsole(text) {
    var message = ["consoleMessage", text];
    process.send(message);
  }
  
  process.on("uncaughtException", function (err) {
    //console.error(err.stack);
    updateConsole("Shell thread module: " + err.stack);
    process.exit();
  });
  
  const path = require("path");
  const fs = require("fs");
  
  if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
    var rootModules = path.join(process.cwd(), "/npm/node_modules/");
  } else {
    var rootModules = "";
  }
  
  //global variables
  var shellWorker;
  var shell = require(rootModules + "shelljs");
  
  //console.log(randomvariable)
  
  process.on("message", (infoArray) => {
    // updateConsole("infoArray received")
  
    console.log("shellThread");
  
    if (infoArray[0] == "processFile") {
      //updateConsole("processFile received")
  
      var workerCommand = infoArray[1];
  
      //updateConsole("workerCommand: " +workerCommand)
  
      shellWorker = shell.exec(workerCommand, function (
        code,
        stdout,
        stderr,
        stdin
      ) {
        //console.log('Exit code:', code);
  
        var message = ["Exit", code];
        process.send(message);
  
        //console.log('Program output:', stdout+"    PID:"+shellWorker.pid);
        //console.log('stderr:', stderr);
        //fs.appendFileSync(homePath+"/HBBatchBeast/Config/Processes/WorkerStatus/Console/ShellLog.txt", "exit", 'utf8');
  
        process.exit();
      });
    }
  
    if (infoArray[0] == "exitThread") {
      if (infoArray[1] == "itemCancelled") {
        var message = ["Exit", "Cancelled"];
        process.send(message);
      }
  
      try {
        if (process.platform == "win32") {
          var killCommand = "taskkill /PID " + shellWorker.pid + " /T /F";
        }
        if (process.platform == "linux") {
          //var killCommand = 'vps -o pid --no-headers --ppid ' + shellWorker.pid
          var killCommand = "pkill -P " + shellWorker.pid;
        }
        if (process.platform == "darwin") {
          //var killCommand = 'pgrep -P ' + shellWorker.pid
          var killCommand = "pkill -P " + shellWorker.pid;
        }
        if (shell.exec(killCommand).code !== 0) {
          shell.exit(1);
        }
      } catch (err) {}
  
      //process.send("Exit,"+"Cancelled");
      process.exit();
    }
  });
  