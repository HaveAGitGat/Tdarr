const fs = require("fs");
const path = require("path");
if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
  var rootModules = path.join(process.cwd(), "/npm/node_modules/");
} else {
  var rootModules = "";
}

module.exports = function runCCExtractor(filepath) {
  return new Promise((resolve) => {
    try {
      var CCExtractorPath;
      var workerCommand;

      if (process.platform == "win32") {
        if (process.env.TDARR_CCEXTRACTOR) {
          CCExtractorPath = process.env.TDARR_CCEXTRACTOR;
        } else {
          if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
            CCExtractorPath = path.join(
              process.cwd(),
              "/assets/app/bin/ccextractor/win32/ccextractorwinfull.exe"
            );
          } else {
            CCExtractorPath = path.join(
              process.cwd(),
              "/private/bin/ccextractor/win32/ccextractorwinfull.exe"
            );
          }
        }
        workerCommand =
          CCExtractorPath +
          ' -debug  -stdout -endat 01:00 --screenfuls 1 -out=null "' +
          filepath +
          '"';
        }

      if (process.platform == "linux") {
        if (process.env.TDARR_CCEXTRACTOR) {
          CCExtractorPath = process.env.TDARR_CCEXTRACTOR;
        } else {
          if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
            CCExtractorPath = path.join(
              process.cwd(),
              "/assets/app/bin/ccextractor/linux/ccextractor"
            );
          } else {
            CCExtractorPath = path.join(
              process.cwd(),
              "/private/bin/ccextractor/linux/ccextractor"
            );
          }
        }

        var filepathUnix = filepath.replace(/'/g, "'\"'\"'");
        workerCommand =
          CCExtractorPath +
          " -debug  -stdout -endat 01:00 --screenfuls 1 -out=null '" +
          filepathUnix +
          "'";
      }

      if (process.platform == "darwin") {
        if (process.env.TDARR_CCEXTRACTOR) {
          CCExtractorPath = process.env.TDARR_CCEXTRACTOR;
        } else {
          if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
            CCExtractorPath = path.join(
              process.cwd(),
              "/assets/app/bin/ccextractor/darwin/ccextractor"
            );
          } else {
            CCExtractorPath = path.join(
              process.cwd(),
              "/private/bin/ccextractor/darwin/ccextractor"
            );
          }
        }

        var filepathUnix = filepath.replace(/'/g, "'\"'\"'");
        workerCommand =
          CCExtractorPath +
          " -debug  -stdout -endat 01:00 --screenfuls 1 -out=null '" +
          filepathUnix +
          "'";
      }

      const childProcess = require("child_process");
      const workerPath = "assets/app/ccextractor.js";
      var hasClosedCaptions = false;

      shellThreadModule = childProcess.fork(workerPath, [], {
        silent: true,
      });

      var infoArray = ["processFile", workerCommand];

      shellThreadModule.send(infoArray);

      shellThreadModule.stderr.on("data", function (data) {
        //console.log(data)
        // console.log(data.toString())

        if (
          data.includes("Permission denied") ||
          data.includes("error while loading")
        ) {
          console.log(data.toString());
        }

        if (data.includes("XDS:") || data.includes("Caption block")) {
          var infoArray = ["exitThread", "itemCancelled"];

          try {
            killFlag = true;
            if (shellThreadModule != "") {
              shellThreadModule.send(infoArray);
            }
          } catch (err) {}

          hasClosedCaptions = true;
        }
      });

      shellThreadModule.on("exit", function (code) {
        resolve({
          result: "success",
          data: hasClosedCaptions,
        });
      });
    } catch (err) {
      resolve({
        result: "error",
        data: "CCextractor encountered an error.",
      });
    }
  });
};
