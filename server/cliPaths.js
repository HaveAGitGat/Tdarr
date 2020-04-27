import {
    GlobalSettingsDB,
  } from "../imports/api/database.js";

const fs = require('fs');
const path = require("path");

if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
    var handBrakeCLIPath = path.join(
        process.cwd(),
        "/assets/app/HandBrakeCLI.exe"
    );
    var ffmpegPathLinux345 = path.join(
        process.cwd(),
        "/assets/app/ffmpeg/ffmpeg345/ffmpeg"
    );
    var ffmpegPathLinux42 = path.join(
        process.cwd(),
        "/assets/app/ffmpeg/ffmpeg42/ffmpeg"
    );
} else {
    var handBrakeCLIPath = path.join(
        process.cwd(),
        "/private/HandBrakeCLI.exe"
    );
    var ffmpegPathLinux345 = path.join(
        process.cwd(),
        "/private/ffmpeg/ffmpeg345/ffmpeg"
    );
    var ffmpegPathLinux42 = path.join(
        process.cwd(),
        "/private/ffmpeg/ffmpeg42/ffmpeg"
    );
}

var ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpegPathLinux345 = ffmpegPathLinux345.replace(/'/g, "'\"'\"'");
ffmpegPathLinux42 = ffmpegPathLinux42.replace(/'/g, "'\"'\"'");

module.exports.getHandBrakePath = function getHandBrakePath() {
    var path;

    if (process.platform == "win32") {
        path = handBrakeCLIPath;
    }

    if (process.platform == "linux") {
        path = "HandBrakeCLI";
    }

    if (process.platform == "darwin") {
        path = "/usr/local/bin/HandBrakeCLI";
    }

    return path;
}

module.exports.getFFmpegPath = function getFFmpegPath() {
    var path;

    if (process.platform == "win32") {
        path = ffmpegPath;
    }

    if (process.platform == "linux") {
        path = ffmpegPathLinux42;
    }

    if (process.platform == "darwin") {
        path = ffmpegPath;
    }

    var ffmpegNVENCBinary = GlobalSettingsDB.find({}, {}).fetch()[0]
        .ffmpegNVENCBinary;

    if (ffmpegNVENCBinary == true) {
        if (process.platform == "linux") {
            path = ffmpegPathLinux345;
        }
    }

    return path;
}