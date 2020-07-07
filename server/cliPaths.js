const fs = require('fs');
const path = require("path");

if (fs.existsSync(path.join(process.cwd(), "/npm"))) {
    var handBrakeCLIPathWin32 = path.join(
        process.cwd(),
        "/assets/app/bin/handbrake/win32/HandBrakeCLI.exe"        
    );
    var handBrakeCLIPathLinux = path.join(
        process.cwd(),
        "/assets/app/bin/handbrake/linux/HandBrakeCLI"        
    );
    var handBrakeCLIPathDarwin = path.join(
        process.cwd(),
        "/assets/app/bin/handbrake/darwin/HandBrakeCLI"        
    );
} else {
    var handBrakeCLIPathWin32 = path.join(
        process.cwd(),
        "/private/bin/handbrake/win32/HandBrakeCLI.exe"
    );
    var handBrakeCLIPathLinux = path.join(
        process.cwd(),
        "/private/bin/handbrake/linux/HandBrakeCLI.exe"
    );
    var handBrakeCLIPathDarwin = path.join(
        process.cwd(),
        "/private/bin/handbrake/darwin/HandBrakeCLI"
    );
}

var ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

module.exports.getHandBrakePath = function getHandBrakePath() {
    var path;
    if (process.env.TDARR_HANDBRAKE) {
        path = process.env.TDARR_HANDBRAKE;
    } else {

        if (process.platform == "win32") {
            path = handBrakeCLIPathWin32;
        }

        if (process.platform == "linux") {
            path = handBrakeCLIPathLinux;
        }

        if (process.platform == "darwin") {
            path = handBrakeCLIPathDarwin;
        }
    } 
    
    return path;
}

module.exports.getFFmpegPath = function getFFmpegPath() {
    var path;
    if (process.env.TDARR_FFMPEG) {
        path = process.env.TDARR_FFMPEG;
    } else {

        if (process.platform == "win32") {
            path = ffmpegPath;
        }

        if (process.platform == "linux") {
            path = ffmpegPath;
        }

        if (process.platform == "darwin") {
            path = ffmpegPath;
        }
    }
    
    return path;
}
