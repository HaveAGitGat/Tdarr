


function updateConsole(scannerID, text) {

    var message = [
        scannerID,
        "consoleMessage",
        text,
    ];
    process.send(message);
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);

    updateConsole(scannerID, ":" + err.stack)

    if (arrayOrPathSwitch == 1) {

        var message = [
            scannerID,
            "finishScan",
            DB_id,

        ];
        process.send(message);

    }





    process.exit();
});


var path = require("path");
var fs = require('fs');

if (fs.existsSync(path.join(process.cwd() + "/npm"))) {

    var rootModules = path.join(process.cwd() + '/npm/node_modules/')

} else {

    var rootModules = ''

}


var scannerID = process.argv[2]
var DB_id = process.argv[3]
var arrayOrPath = process.argv[4]
var arrayOrPathSwitch = process.argv[5]
var allowedContainers = process.argv[6]
allowedContainers = allowedContainers.split(',');
var filesInDB = process.argv[7]

var HealthCheck = process.argv[8]
var TranscodeDecisionMaker = process.argv[9]




updateConsole(scannerID, ":File scanner " + scannerID + " online.")

//console.log("arrayOrPath" + arrayOrPath)
//console.log(arrayOrPathSwitch)


if (arrayOrPathSwitch == 0) {

    // process array

    arrayOrPath = arrayOrPath.split(',');

    for(var i = 0; i < arrayOrPath.length; i++){



        if(checkContainer(arrayOrPath[i]) != true){

            arrayOrPath.splice(i,1)
            i--;

        }



    }


    ffprobeLaunch(arrayOrPath)



}

if (arrayOrPathSwitch == 1) {

    //scanFiles'(DB_id,arrayOrPath,arrayOrPathSwitch) {

    // scanFilePath

    var foundCounter = 0

    var filesToScan = []



    traverseDir(arrayOrPath)


    function traverseDir(inputPathStem) {


        fs.readdirSync(inputPathStem).forEach(file => {

            let fullPath = (path.join(inputPathStem, file)).replace(/\\/g, "/");

            try {
                if (fs.lstatSync(fullPath).isDirectory()) {

                    try {
                        traverseDir(fullPath);
                    } catch (err) {
                       // console.log(err)
                    }
                } else {




                    // SettingsDB.upsert(DB,
                    //     {
                    //         $set: {
                    //             transcodeScanFound: "Files found:" + foundCounter,
                    //         }
                    //     }
                    // );

                    fullPath = fullPath.replace(/\\/g, "/");

                    if (filesInDB.includes(fullPath)) {


                       // console.log("File already in DB " + fullPath)


                    } else {

                        if (checkContainer(fullPath) == true) {

                            // console.log("New  file!:" + fullPath)
                            



                            foundCounter++


                            if( foundCounter % 100 == 0){

                                var message = [
                                    scannerID,
                                    "updateScanFound",
                                    DB_id,
                                    "Found:" + foundCounter,
    
                                ];
                                process.send(message);


                            }

                    



                            // ffprobeLaunch([fullPath])

                            filesToScan.push(fullPath)

                          console.log(`File ${fullPath} has been added.`)

                        } else {
                          //  console.log(`File ${fullPath} is not supported.`)

                        }


                    }






                }  //end current file, go to next

            } catch (err) {
               // console.log(err)
            }
        });



    };


    foundCounter = 0

    ffprobeLaunch(filesToScan)


}




// var message = [
//     workerNumber,
//     "percentage",
//     output
// ];
// process.send(message);







function checkContainer(newFile) {
    var path = require('path');
    var fileType = ((path.extname(newFile)).split(".")).join("")

    for (var j = 0; j < allowedContainers.length; j++) {

        //console.log(fileType.toLowerCase())
        //    console.log(allowedContainers[j].toLowerCase())

        if (fileType.toLowerCase() == allowedContainers[j].toLowerCase()) {
            return true
        }
    }
    return false
}






process.on('exit', (code) => {

 //   console.log(`About to exit with code: ${code}`);


    if (arrayOrPathSwitch == 1) {

        var message = [
            scannerID,
            "finishScan",
            DB_id,

        ];
        process.send(message);

    }
});




function ffprobeLaunch(filesToScan) {



    var ffprobe = require(rootModules+'ffprobe'),
        ffprobeStatic = require(rootModules+'ffprobe-static');
    var path = require("path");
    var ffprobeStaticPath = ''


    ffprobeStaticPath = require(rootModules+'ffprobe-static').path


    var k = 0;


    function loopArray(filesToScan, i) {






        var filepath = filesToScan[i]




        if (fs.existsSync(filepath)) {

            // Meteor.call('logthis', "Extracting data from this file:" + filepath, function (error, result) { });




            ffprobe(filepath, { path: ffprobeStaticPath }, function (err, jsonData) {
                //if (err) return done(err);



                if (err) {

                    extractDataError(filepath, err)

                }

                if(jsonData){

                    extractData(filepath, jsonData)

                }

              





             //   console.log("Finished:" + filepath)


                i++;

                if (i < filesToScan.length) {
                    loopArray(filesToScan, i);
                } else {



                }



            });
        }

    }





    if (!Array.isArray(filesToScan) || !filesToScan.length) {



    } else {

        loopArray(filesToScan, k);

    }


    function extractDataError(filepath, err) {

       // console.log("Error with file:" + filepath)
      //  console.log("Err2:" + err)

        var thisFileObject = {}

        var path = require('path');
        var container = ((path.extname(filepath)).split(".")).join("")
        thisFileObject.container = container.toLowerCase();

        thisFileObject.ffProbeRead = "error"

        // DocumentsDB.upsert(filepath,


        //     {
        //         $set: {
        //             video_resolution: "Error",
        //             status: "Error"
        //         }
        //     }
        // );

        //  Meteor.call('logthis', "Error extracting properties from this file:" + filepath, function (error, result) { });

        // console.log(thisFileObject)

        thisFileObject.cliLog = "FFprobe was unable to extract data from this file."

        addFileToDB(filepath, thisFileObject,"Error","Transcode error")

    }



    function extractData(filepath, jsonData) {

        var thisFileObject = {}

        var path = require('path');
        var container = ((path.extname(filepath)).split(".")).join("")
        thisFileObject.container = container.toLowerCase();

        thisFileObject.ffProbeRead = "success"


        try {
            var medium = ""
            for (var j = 0; j < jsonData.streams.length; j++) {

                if (jsonData.streams[j].codec_type == "video") {
                    medium = "video_"
                } else if (jsonData.streams[j].codec_type == "audio") {
                    medium = "audio_"
                } else {
                    medium = "other_"
                }


                Object.keys(jsonData.streams[j]).forEach(function (key) {
                    // JSONBomb += key+": '"+jsonData.streams[j][key]+"' \n"


                    var thisKey = medium + key + ""

                    thisFileObject[thisKey] = jsonData.streams[j][key]

                    // DocumentsDB.upsert(filepath,


                    //     {
                    //         $set: {
                    //             [thisKey]: jsonData.streams[j][key]
                    //         }
                    //     }
                    // );



                });
            }

        } catch (err) {}




            // DocumentsDB.upsert(filepath,


            //     {
            //         $set: {
            //             video_resolution: videoResolution
            //         }
            //     }
            // );


            try {
                var singleFileSize = fs.statSync(filepath)
                var singleFileSize = singleFileSize.size
                var bit_rate = (8 * singleFileSize) / (parseInt(jsonData.streams[0]["duration"]))
                var fileSizeInMbytes = singleFileSize / 1000000.0;


                thisFileObject.bit_rate = bit_rate
                thisFileObject.file_size = fileSizeInMbytes

                // DocumentsDB.upsert(filepath,


                //     {
                //         $set: {
                //             bit_rate: bit_rate,
                //             file_size: fileSizeInMbytes
                //         }
                //     }
                // );


            } catch (err) { }
 

        if (!!("video_codec_name" in thisFileObject)) {

            try {

                // var vidWidth = jsonData.streams[0]["width"]
                // var vidHeight = jsonData.streams[0]["height"]

                var vidWidth = thisFileObject.video_width
                var vidHeight = thisFileObject.video_height
                var videoResolution = ""
    
           //    console.log(vidWidth, vidHeight)
    
                //Bounds +- 10%
                // 480p	720	480		648	792		432	528
                // 576p	720	576		648	792		518.4	633.6
                // 720p	1280	720		1152	1408		648	792
                // 1080p	1920	1080		1728	2112		972	1188
                // 4KUHD	3840	2160		3456	4224		1944	2376
                // DCI4K	4096	2160		3686.4	4505.6		1944	2376
                // 8KUHD	7680	4320		6912	8448		3888	4752
    
    
    
    
                if (vidWidth >= 642 && vidWidth <= 792 && vidHeight >= 432 && vidHeight <= 528) {
                    videoResolution = "480p"
                } else if (vidWidth >= 648 && vidWidth <= 792 && vidHeight >= 518 && vidHeight <= 634) {
                    videoResolution = "576p"
                } else if (vidWidth >= 1152 && vidWidth <= 1408 && vidHeight >= 648 && vidHeight <= 792) {
                    videoResolution = "720p"
                } else if (vidWidth >= 1728 && vidWidth <= 2112 && vidHeight >= 972 && vidHeight <= 1188) {
                    videoResolution = "1080p"
                } else if (vidWidth >= 3456 && vidWidth <= 4224 && vidHeight >= 1944 && vidHeight <= 2376) {
                    videoResolution = "4KUHD"
                } else if (vidWidth >= 3686 && vidWidth <= 4506 && vidHeight >= 1944 && vidHeight <= 2376) {
                    videoResolution = "DCI4K"
                } else if (vidWidth >= 6912 && vidWidth <= 8448 && vidHeight >= 3888 && vidHeight <= 5752) {
                    videoResolution = "8KUHD"
                } else {
                    videoResolution = "Other"
                }
    
    
                thisFileObject.video_resolution = videoResolution
    
            } catch (err) {}
            
            thisFileObject.fileMedium = "video"


            

          }else if(!!("audio_codec_name" in thisFileObject)){

            thisFileObject.fileMedium = "audio"
          }else{

            thisFileObject.fileMedium = "other"
          }


        //console.log(thisFileObject)

        addFileToDB(filepath, thisFileObject,HealthCheck,TranscodeDecisionMaker)

    }
}


function addFileToDB(filePath, FileObject,HealthCheck,TranscodeDecisionMaker) {

    //  FileObject = JSON.stringify(FileObject);

    //console.log("Adding to DB2:"+filePath)
    var message = [
        scannerID,
        "addFileToDB",
        filePath,
        FileObject,
        DB_id,
        HealthCheck,
        TranscodeDecisionMaker,

    ];
    process.send(message);

    foundCounter++

    if( foundCounter % 10 == 0){


    var message = [
        scannerID,
        "updateScanFound",
        DB_id,
        "Processing:" + foundCounter,

    ];
    process.send(message);

}


}


