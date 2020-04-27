import {
    FileDB,
    SettingsDB,
    GlobalSettingsDB,
    StatisticsDB,
    ClientDB
} from "../imports/api/database.js";
import logger from "./logger.js";

module.exports.initGlobalSettingsDB = function initGlobalSettingsDB() {
    //Set globalDB settings on init
    var gSettings = GlobalSettingsDB.find({}, {}).fetch();

    
    if (!Array.isArray(gSettings) || !gSettings.length) {
        logger.warn('GlobalSettingsDB is empty. Initialising')
        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                lowCPUPriority: false,
                generalWorkerLimit: 0,
                transcodeWorkerLimit: 0,
                healthcheckWorkerLimit: 0,
                queueSortType: "sortDateNewest",
                verboseLogs: false,
            },
        });
    } else {
        var gSettings = gSettings[0]
        if (gSettings.generalWorkerLimit == undefined) {
            GlobalSettingsDB.upsert("globalsettings", {
                $set: {
                    lowCPUPriority: false,
                    generalWorkerLimit: 0,
                    transcodeWorkerLimit: 0,
                    healthcheckWorkerLimit: 0,
                    queueSortType: "sortDateNewest",
                    verboseLogs: false,
                },
            });
        }
    }

    //Search result columns
    if (gSettings.searchResultColumns == undefined) {
        var searchResultColumns = {
            index: true,
            fileName: true,
            streams: true,
            closedCaptions: true,
            codec: true,
            resolution: true,
            size: true,
            bitrate: true,
            duration: true,
            bump: true,
            createSample: true,
            transcode: true,
            healthCheck: true,
            info: true,
            history: true,
            remove: true,
        };

        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                searchResultColumns: searchResultColumns,
            },
        });
    }

    //UI queue size
    if (gSettings.tableSize == undefined) {
        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                tableSize: 20,
            },
        });
    }

    //init sort vars
    if (gSettings.queueSortType == undefined) {
        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                queueSortType: "sortDateNewest",
            },
        });
    }

    if (gSettings.prioritiseLibraries == undefined) {
        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                prioritiseLibraries: false,
            },
        });
    }

    if (gSettings.alternateLibraries == undefined) {
        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                alternateLibraries: true,
            },
        });
    }

    if (gSettings.basePath == undefined) {
        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                basePath: "",
            },
        });
    }

    if (gSettings.resBoundaries == undefined) {
        var resBoundaries = {
            res480p: {
                widthMin: 100,
                widthMax: 792,
                heightMin: 100,
                heightMax: 528,
            },
            res576p: {
                widthMin: 100,
                widthMax: 792,
                heightMin: 100,
                heightMax: 634,
            },
            res720p: {
                widthMin: 100,
                widthMax: 1408,
                heightMin: 100,
                heightMax: 792,
            },
            res1080p: {
                widthMin: 100,
                widthMax: 2112,
                heightMin: 100,
                heightMax: 1188,
            },
            res4KUHD: {
                widthMin: 100,
                widthMax: 4224,
                heightMin: 100,
                heightMax: 2376,
            },
            resDCI4K: {
                widthMin: 100,
                widthMax: 4506,
                heightMin: 100,
                heightMax: 2376,
            },
            res8KUHD: {
                widthMin: 100,
                widthMax: 8448,
                heightMin: 100,
                heightMax: 5752,
            },
        };
        GlobalSettingsDB.upsert("globalsettings", {
            $set: {
                resBoundaries: resBoundaries,
            },
        });
    }

    GlobalSettingsDB.upsert("globalsettings", {
        $set: {
            logsLoading: false,
            selectedLibrary: 0,
            propertySearchLoading: false,
        },
    });
}

module.exports.initLibrarySettingsDB = function initLibrarySettingsDB() {

    //configure libraries
    var libDB = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch();

    if (Array.isArray(libDB) || libDB.length) {
        if (libDB[0] != undefined && libDB[0].priority == undefined) {
            for (var i = 0; i < libDB.length; i++) {
                SettingsDB.upsert(libDB[i]._id, {
                    $set: {
                        priority: i,
                    },
                });
            }
        }
    }
}

module.exports.initStatisticsDB = function initStatisticsDB() {

    //initialise stats properties
    var statsDB = StatisticsDB.find({}, {}).fetch();

    if (statsDB.length == 0) {
        StatisticsDB.upsert("statistics", {
            $set: {
                totalFileCount: 0,
                totalTranscodeCount: 0,
                totalHealthCheckCount: 0,
                sizeDiff: 0,
            },
        });
    }

    StatisticsDB.upsert("statistics", {
        $set: {
            DBPollPeriod: "4s",
            DBFetchTime: "1s",
            DBLoadStatus: "Stable",
            DBQueue: 0,
            pies: [],
        },
    });
}

module.exports.initClientDB = function initClientDB() {
    ClientDB.upsert("client", {
        $set: {
            table1: [{}],
            table2: [{}],
            table3: [{}],
            table4: [{}],
            table5: [{}],
            table6: [{}],
        },
    });
}





