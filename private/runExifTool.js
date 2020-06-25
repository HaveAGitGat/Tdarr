const fs = require("fs");
const path = require("path");
if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
  var rootModules = path.join(process.cwd(), "/npm/node_modules/");
} else {
  var rootModules = "";
}

module.exports = function runExifTool(filepath, exiftool) {
  //const exiftool = require(rootModules + "exiftool-vendored").exiftool

  return new Promise((resolve) => {
    try {
      exiftool
        .read(filepath)
        .then((tags /*: Tags */) => {
          resolve({
            result: "success",
            data: tags,
          });
        })
        .catch((error) => {
          resolve({
            result: "error",
            data: error,
          });
        });
    } catch (err) {
      resolve({
        result: "error",
        data: "Exif tool encountered an error.",
      });
    }
  });
};
