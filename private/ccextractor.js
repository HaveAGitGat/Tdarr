process.on("uncaughtException", function (err) {});

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

process.on("message", (infoArray) => {
  console.log("shellThread");

  if (infoArray[0] == "processFile") {
    var workerCommand = infoArray[1];

    shellWorker = shell.exec(workerCommand, function (
      code,
      stdout,
      stderr,
      stdin
    ) {
      //console.log(code)

      killSelf();
    });

    setTimeout(killSelf, 1000);
  }

  if (infoArray[0] == "exitThread") {
    killSelf();
  }
});

function killSelf() {
  // console.log("killSelf")

  // var message = [
  //     "Exit",
  // ];
  // process.send(message);

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

  process.exit();
}
