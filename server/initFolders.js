


module.exports = function initFolders(homePath) {
    const fs = require('fs');
    const isDocker = require('is-docker');

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

    if (!fs.existsSync(homePath + "/Tdarr/Backups")) {
        fs.mkdirSync(homePath + "/Tdarr/Backups");
    }

    if (!fs.existsSync(homePath + "/Tdarr/Logs")) {
        fs.mkdirSync(homePath + "/Tdarr/Logs");
    }

    if (isDocker()) {
        console.log('Running inside a Docker container');
        if (!fs.existsSync("/temp")) {
            fs.mkdirSync("/temp");
        }
    } else {
        console.log('Not running inside a Docker container');
    }
}