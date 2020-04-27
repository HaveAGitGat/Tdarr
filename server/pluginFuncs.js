import logger from "./logger.js";
import homePath from "./paths.js";
import { GlobalSettingsDB, SettingsDB } from "../imports/api/database.js";

const fs = require('fs');
const fsextra = require("fs-extra");
const path = require("path");
const importFresh = require("import-fresh");
const unzipper = require("unzipper");

Meteor.methods({
    searchPlugins(string, pluginType) {
        //  logger.info(string)
        try {
            var plugins = [];
            fs.readdirSync(homePath + `/Tdarr/Plugins/${pluginType}`).forEach(
                (file) => {
                    try {
                        var pluginID = file.split(".")[0];
                        var pluginLocalPath = path.join(
                            process.cwd(),
                            `/assets/app/plugins/${pluginType}/` + pluginID + ".js"
                        );
                        fsextra.copySync(
                            homePath + `/Tdarr/Plugins/${pluginType}/` + file,
                            pluginLocalPath
                        );
                        var plugin = importFresh(pluginLocalPath);
                        var obj = plugin.details();
                        obj.source = pluginType;
                        plugins.push(obj);
                    } catch (err) {
                        // logger.error(err.stack)
                        var obj = {
                            Name: "Read error",
                            Type: "Read error",
                            Operation: "Read error",
                            Description: err.toString(),
                            Version: "Read error",
                            Link: "Read error",
                            source: pluginType,
                        };
                        plugins.push(obj);
                    }
                }
            );

            string = string.split(",");
            plugins = plugins.filter((row) => {
                try {
                    for (var i = 0; i < string.length; i++) {
                        if (
                            !JSON.stringify(row)
                                .toLowerCase()
                                .includes(string[i].toLowerCase())
                        ) {
                            return false;
                        }
                    }

                    return true;
                } catch (err) {
                    logger.error(err.stack);
                }
            });
        } catch (err) {
            logger.error(err.stack);
        }
        return [plugins, pluginType];
    },

    deletePlugin(pluginID) {
        try {
            fs.unlinkSync(homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js");
            return [true, pluginID];
        } catch (err) {
            logger.error(err);
            return [false, pluginID];
        }
    },

    readPluginText(pluginID) {
        var locPath = homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js";
        try {
            var text = fs.readFileSync(locPath, "utf8");
            return [true, pluginID, text];
        } catch (err) {
            logger.error(err);
            return [false, pluginID];
        }
    },

    savePluginText(pluginID, text) {
        var locPath = homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js";
        try {
            //var text = fs.readFileSync(locPath, 'utf8')
            if (fs.existsSync(locPath)) {
                fs.unlinkSync(locPath);
            }
            fs.writeFileSync(locPath, text, "utf8");
            return [true, pluginID, text];
        } catch (err) {
            logger.error(err);
            return [false, pluginID];
        }
    },

    verifyPlugin(pluginID, DB_id, community) {
        if (community == true) {
            var path = homePath + "/Tdarr/Plugins/Community/" + pluginID + ".js";
        } else {
            var path = homePath + "/Tdarr/Plugins/Local/" + pluginID + ".js";
        }

        if (fs.existsSync(path)) {
            SettingsDB.upsert(DB_id, {
                $set: {
                    pluginValid: true,
                },
            });
        } else {
            SettingsDB.upsert(DB_id, {
                $set: {
                    pluginValid: false,
                },
            });
        }
    },

    copyCommunityToLocal(pluginID, forceOverwrite) {
        var comPath = homePath + `/Tdarr/Plugins/Community/` + pluginID + ".js";
        var locPath = homePath + `/Tdarr/Plugins/Local/` + pluginID + ".js";

        if (forceOverwrite == false && fs.existsSync(locPath)) {
            return ["exist", pluginID];
        } else {
            try {
                fsextra.copySync(comPath, locPath);
                return [true, pluginID];
            } catch (err) {
                logger.error(err);
                return [false, pluginID];
            }
        }
    },

    updatePlugins() {
        const request = require("request");
        const progress = require("request-progress");
        try {
            fsextra.removeSync(homePath + "/Tdarr/Plugins/temp.zip");
        } catch (err) {
            logger.error(err.stack);
        }
        try {
            fsextra.removeSync(homePath + "/Tdarr/Plugins/temp");
        } catch (err) {
            logger.error(err.stack);
        }
        (async function clonePlugins() {
            logger.info("Cloning plugins");
            var downloadStatus;
            await downloadNew()
                .then((res) => {
                    downloadStatus = res;
                })
                .catch((err) => {
                    logger.error(err);
                    downloadStatus = "Error!";
                });

            if (downloadStatus == "Done!") {
                var unzipStatus;
                await unzip()
                    .then((res) => {
                        unzipStatus = res;
                    })
                    .catch((err) => {
                        logger.error(err);
                        unzipStatus = "Error!";
                    });
                await waitUnzip();

                if (unzipStatus == "Done!") {
                    try {
                        fsextra.copySync(
                            homePath + "/Tdarr/Plugins/temp/Tdarr_Plugins-master/Community",
                            homePath + "/Tdarr/Plugins/Community",
                            { overwrite: true }
                        );
                    } catch (err) {
                        logger.error(err.stack);
                    }

                    try {
                        //COMMENT OUT WHEN WORKING ON LIBRARY FITLERS/ACTIONS
                        fsextra.copySync(
                            homePath + "/Tdarr/Plugins/temp/Tdarr_Plugins-master/methods",
                            homePath + "/Tdarr/Plugins/methods",
                            { overwrite: true }
                        );
                    } catch (err) {
                        logger.error(err.stack);
                    }

                    try {
                        fsextra.copySync(
                            homePath + "/Tdarr/Plugins/methods",
                            path.join(process.cwd(), `/assets/app/plugins/methods`),
                            { overwrite: true }
                        );
                    } catch (err) {
                        logger.error(err.stack);
                    }

                    try {
                        fsextra.removeSync(homePath + "/Tdarr/Plugins/temp.zip");
                    } catch (err) {
                        logger.error(err.stack);
                    }

                    try {
                        fsextra.removeSync(homePath + "/Tdarr/Plugins/temp");
                    } catch (err) {
                        logger.error(err.stack);
                    }

                    logger.info("Plugin update finished");
                    GlobalSettingsDB.upsert("globalsettings", {
                        $set: {
                            pluginSearchLoading: false,
                        },
                    });
                } else {
                    logger.error("Plugin unzip failed!");
                }
            } else {
                logger.error("Plugin download failed!");
            }
        })();

        function waitUnzip() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        }

        function downloadNew() {
            return new Promise((resolve) => {
                try {
                    const filename = homePath + "/Tdarr/Plugins/temp.zip";
                    if (fs.existsSync(filename)) {
                        fs.unlinkSync(filename);
                    }
                    progress(
                        request(
                            "https://github.com/HaveAGitGat/Tdarr_Plugins/archive/master.zip"
                        ),
                        {}
                    )
                        .on("progress", function (state) { })
                        .on("error", function (err) {
                            // Do something with err
                            logger.error(err);
                            resolve("Error!");
                        })
                        .on("end", function () {
                            // Do something after request finishes
                            logger.info("Finished downloading plugins!");
                            resolve("Done!");
                        })
                        .pipe(fs.createWriteStream(filename));
                } catch (err) {
                    logger.error(err);

                    resolve("Error!");
                }
            });
        }

        function unzip() {
            return new Promise((resolve) => {
                try {
                    var zipPath = homePath + "/Tdarr/Plugins/temp.zip";
                    var unzipPath = homePath + "/Tdarr/Plugins/temp";
                    if (!fs.existsSync(zipPath)) {
                        logger.error("Zip path does not exist!");
                        resolve("Error!");
                    } else {
                        var stream = fs
                            .createReadStream(zipPath)
                            .pipe(unzipper.Extract({ path: unzipPath }))
                            .on("error", (err) => { })
                            .on("finish", function () {
                                resolve("Done!");
                            });
                    }
                } catch (err) {
                    logger.error(err);
                    resolve("Error!");
                }
            });
        }
    },
});