

//Change node module paths dev/prod (rootModules)

function updateConsole(workerNumber, text) {

    var message = [
        workerNumber,
        "consoleMessage",
        text,
    ];
    process.send(message);
}

process.on('uncaughtException', function (err) {
    console.error(err.stack);

    updateConsole(workerNumber, ":" + err.stack)





    process.exit();
});

//Globals

var shellThreadModule
var path = require("path");
//__dirname = path.resolve();
var exitRequestSent = false
var errorLogFull

if (process.platform == 'win32') {

    var stringProcessingSlash = "/";
    //   var stringProcessingSlash = "\\";
}

if (process.platform == 'linux' || process.platform == 'darwin') {
    var stringProcessingSlash = "/";
}



var fs = require('fs');

if (fs.existsSync(path.join(process.cwd() + "/npm"))) {

    var rootModules = path.join(process.cwd() + '/npm/node_modules/')

} else {

    var rootModules = ''

}




var shell = require(rootModules + 'shelljs');
var fsextra = require(rootModules + 'fs-extra')
const isDocker = require(rootModules + 'is-docker');
const shortid = require(rootModules + 'shortid');


var fileToProcess
var inputFolderStem
var outputFolder
var container
var preset
var handBrakeMode
var FFmpegMode
var frameCount
var reQueueAfter


var currentSourceLine
var currentDestinationLine

var finalFilePath
var mode
var settingsDBIndex

var oldProgress = ""
var lastProgCheck = ""

var currentFileObject
var folderToFolderConversionEnabled
var folderToFolderConversionFolder

var processFile
var librarySettings
var ffmpegNVENCBinary
var TranscodeDecisionMaker





function getRootDir() {

    var rootDir = path.resolve();
    rootDir = rootDir.split("\\")
    var firstEle = rootDir.length - 5
    rootDir.splice(firstEle, 5)
    rootDir = rootDir.join("\\")


    return rootDir
}


var workerNumber = process.argv[2]
var workerType = process.argv[3]


checkifQueuePause()
updateConsole(workerNumber, "Worker online. Requesting item")




process.on('message', (m) => {



    if (m[0] == "requestNewItem") {
        checkifQueuePause()
    }




    if (m[0] == "continueWork") {
        checkifQueuePause()
    }


    if (m[0] == "suicide") {

        var message = [
            workerNumber,
            "cancelled",
            currentSourceLine,
            settingsDBIndex,
            mode,
            "suicide"
        ];
        process.send(message);

        updateConsole(workerNumber, "Stop command received. Closing sub-processes")

        if (process.platform == 'win32') {
            var killCommand = 'taskkill /PID ' + process.pid + ' /T /F'
        } else if (process.platform == 'linux') {
            var killCommand = 'pkill -P ' + process.pid
        } else if (process.platform == 'darwin') {
            var killCommand = 'pkill -P ' + process.pid
        }

        if (shell.exec(killCommand).code !== 0) {
            shell.exit(1);
        }

    }

    if (m[0] == "exitThread") {

        updateConsole(workerNumber, "Cancelling")

        var infoArray = [
            "exitThread",
            "itemCancelled",
        ];

        try {
            if (shellThreadModule != "") {
                shellThreadModule.send(infoArray);
            }
        } catch (err) { }

        try {

            if (repair_worker != "") {
                repair_worker.send(infoArray);
            }
        } catch (err) { }
    }



    if (m[0] == "queueNumber") {


        mode = m[1];
        fileToProcess = m[2];
        inputFolderStem = m[3];
        outputFolder = m[4]
        container = m[5]
        preset = m[6]
        handBrakeMode = m[7]
        FFmpegMode = m[8]
        frameCount = m[9]
        settingsDBIndex = m[10]
        reQueueAfter = m[11]
        currentFileObject = m[12]
        folderToFolderConversionEnabled = m[13]
        folderToFolderConversionFolder = m[14]
        processFile = m[15]
        librarySettings = m[16]
        ffmpegNVENCBinary = m[17]
        TranscodeDecisionMaker = m[18]



        if (container.charAt(0) != '.') {

            container = '.' + container

        }


        updateConsole(workerNumber, "File received:" + fileToProcess)



        var presetSplit
        presetSplit = preset.split(',')
        var workerCommand = "";


    
        //Create folder to folder conversion output folders

        if (folderToFolderConversionEnabled == true) {

            if(fileToProcess.includes(folderToFolderConversionFolder)){
                console.log("File includes F2F output folder")
                currentDestinationLine = getOutputPath(fileToProcess, container, folderToFolderConversionFolder, outputFolder)
            }else{
                console.log("File doesn't include F2F output folder")
                currentDestinationLine = getOutputPath(fileToProcess, container, inputFolderStem, outputFolder)     
            }

            finalFilePath = getOutputPath(currentDestinationLine, container, outputFolder, folderToFolderConversionFolder)

            var outputFolderPath = finalFilePath.substring(0, finalFilePath.lastIndexOf(stringProcessingSlash))

            if (!fs.existsSync(outputFolderPath)) {
                try {

                    if (mode != "healthcheck") {
                        shell.mkdir('-p', outputFolderPath);

                    }
                } catch (err) {
                    updateConsole(workerNumber, "Unable to create folder!")
                }
            }
        } else {

            currentDestinationLine = getOutputPath(fileToProcess, container, inputFolderStem, outputFolder)
            finalFilePath = getOutputPath(currentDestinationLine, container, outputFolder, inputFolderStem)
        }


        var fileID = shortid.generate()
        

        currentDestinationLine = currentDestinationLine.split(".")
        currentDestinationLine[currentDestinationLine.length - 2] = currentDestinationLine[currentDestinationLine.length - 2] + "-TdarrCacheFile-"+fileID
        currentDestinationLine = currentDestinationLine.join(".")

        currentDestinationLine = currentDestinationLine.split("/")
        currentDestinationLine = path.join( outputFolder ,currentDestinationLine[currentDestinationLine.length - 1])

           

        updateConsole(workerNumber, "currentDestinationLine:" + currentDestinationLine)
        updateConsole(workerNumber, "finalFilePath:" + finalFilePath)

         //Create transcode cache output folders

        var outputFolderPath = currentDestinationLine.substring(0, currentDestinationLine.lastIndexOf(stringProcessingSlash))


        if (!fs.existsSync(outputFolderPath)) {
            try {

                if (mode != "healthcheck") {
                    shell.mkdir('-p', outputFolderPath);
                }

            } catch (err) {
                updateConsole(workerNumber, "Unable to create folder!")
            }
        }




        if (fs.existsSync(path.join(process.cwd() + "/npm"))) {

            var handBrakeCLIPath = path.join(process.cwd() + '/assets/app/HandBrakeCLI.exe')
            var ffmpegPathLinux = path.join(process.cwd() + '/assets/app/ffmpeg/ffmpeg')
        } else {
            var handBrakeCLIPath = path.join(process.cwd() + '/private/HandBrakeCLI.exe')
            var ffmpegPathLinux = path.join(process.cwd() + '/private/ffmpeg/ffmpeg')
        }


        var ffmpegPath = getFFmpegCLIPath();


        currentSourceLine = fileToProcess


        if (process.platform == 'win32' && handBrakeMode == true) {
            workerCommand = handBrakeCLIPath + " -i \"" + currentSourceLine + "\" -o \"" + currentDestinationLine + "\" " + preset;
        } else if (process.platform == 'win32' && FFmpegMode == true) {
            workerCommand = ffmpegPath + " " + presetSplit[0] + " -i \"" + currentSourceLine + "\" " + presetSplit[1] + " \"" + currentDestinationLine + "\" "

        }


        var currentSourceLineUnix = currentSourceLine.replace(/'/g, '\'\"\'\"\'');
        var currentDestinationLineUnix = currentDestinationLine.replace(/'/g, '\'\"\'\"\'');
        var presetUnix = preset.replace(/'/g, '\'\"\'\"\'');


        var ffmpegPathUnix = ffmpegPath.replace(/'/g, '\'\"\'\"\'');
        try {
            var preset0Unix = presetSplit[0].replace(/'/g, '\'\"\'\"\'');
        } catch (err) { }
        try {
            var preset1Unix = presetSplit[1].replace(/'/g, '\'\"\'\"\'');
        } catch (err) { }




        if (process.platform == 'linux' && handBrakeMode == true) {

            workerCommand = "HandBrakeCLI -i '" + currentSourceLineUnix + "' -o '" + currentDestinationLineUnix + "' " + presetUnix;

        } else if (process.platform == 'linux' && FFmpegMode == true) {

            workerCommand = ffmpegPathUnix + " " + preset0Unix + " -i '" + currentSourceLineUnix + "' " + preset1Unix + " '" + currentDestinationLineUnix + "' "

        }


        //

        if (process.platform == 'darwin' && handBrakeMode == true) {
            workerCommand = "/usr/local/bin/HandBrakeCLI -i '" + currentSourceLineUnix + "' -o '" + currentDestinationLineUnix + "' " + presetUnix;
        } else if (process.platform == 'darwin' && FFmpegMode == true) {
            workerCommand = ffmpegPathUnix + " " + preset0Unix + " -i '" + currentSourceLineUnix + "' " + preset1Unix + " '" + currentDestinationLineUnix + "' "
        }

        if (ffmpegNVENCBinary == true) {
            // console.log("Worker in Docker")
            if (process.platform == 'linux' && handBrakeMode == true) {
                //  workerCommand = "/usr/local/bin/HandBrakeCLI -i '" + currentSourceLineUnix + "' -o '" + currentDestinationLineUnix + "' " + presetUnix;
            } else if (process.platform == 'linux' && FFmpegMode == true) {
                workerCommand = ffmpegPathLinux + " " + preset0Unix + " -i '" + currentSourceLineUnix + "' " + preset1Unix + " '" + currentDestinationLineUnix + "' "

            }

        }


        console.log(workerCommand)


        if (mode == "transcode") {

            if (fs.existsSync(currentDestinationLine)) {
                fs.unlinkSync(currentDestinationLine)
            }
        }

        errorLogFull = ""
        errorLogFull += "Command: \r\n"
        errorLogFull += workerCommand + "\r\n"


        ///currentFileObject.ffProbeRead == "success"


        if (folderToFolderConversionEnabled == true && mode != "healthcheck" && processFile == false) {

            try { var sourcefileSizeInGbytes = (((fs.statSync(currentSourceLine)).size) / 1000000000.0); } catch (err) {

                var sourcefileSizeInGbytes = 0
            }
                var sizeDiffGB = 0;
       
            try {

                errorLogFull += "Attempting to move new file to output folder" + "\r\n"
                updateConsole(workerNumber, "Attempting to move new file to output folder" + currentSourceLine)



                finalFilePath = finalFilePath.split(".")

                //set container to original source file
                finalFilePath[finalFilePath.length - 1] = currentFileObject.container

                finalFilePath = finalFilePath.join(".")

                
                var finalFilePathCopy = finalFilePath


                finalFilePathCopy = finalFilePathCopy.split(".")
                finalFilePathCopy[finalFilePathCopy.length - 2] = finalFilePathCopy[finalFilePathCopy.length - 2] + "-TdarrNew"
                finalFilePathCopy = finalFilePathCopy.join(".")




                fsextra.copySync(currentSourceLine, finalFilePathCopy, {
                    overwrite: true
                })

                errorLogFull += "Copying file successful:" + "\r\n"
                updateConsole(workerNumber, "Copying file successful:" + currentSourceLine + " to " + finalFilePathCopy)

               

                //Delete source file ONLY after first pass when file is still in original source folder.



                if(librarySettings.folderToFolderConversionDeleteSource === true && !fileToProcess.includes(folderToFolderConversionFolder)){

                    errorLogFull += "Attempting to delete original file" + "\r\n"
                    updateConsole(workerNumber, "Attempting to delete original file" + currentSourceLine)
    
                    fs.unlinkSync(currentSourceLine)
                    errorLogFull += "Original file deleted" + "\r\n"
                    updateConsole(workerNumber, "Original file deleted" + currentSourceLine)

                }
             


                errorLogFull += "Renaming new file:" + "\r\n"
                updateConsole(workerNumber, "Renaming new file:" + finalFilePathCopy + " to " + finalFilePath)

                fsextra.moveSync(finalFilePathCopy, finalFilePath, {
                    overwrite: true
                })

                errorLogFull += "Renaming new file success:" + "\r\n"
                updateConsole(workerNumber, "Renaming new file success:" + finalFilePathCopy + " to " + finalFilePath)


                var cliLog = "\n Original size GB:" + sourcefileSizeInGbytes
                cliLog += "\n New size GB:" + sourcefileSizeInGbytes


                var filePropertiesToAdd = {
                    HealthCheck: "Queued",
                    TranscodeDecisionMaker: TranscodeDecisionMaker != false ? TranscodeDecisionMaker : currentFileObject.oldSize ? "Transcode success" : "Not required" ,
                    lastTranscodeDate: new Date(),
                    cliLog: cliLog,
                    oldSize: currentFileObject.oldSize ? currentFileObject.oldSize : sourcefileSizeInGbytes,
                    newSize: sourcefileSizeInGbytes,
                    bumped: false,
                    history: currentFileObject.history == undefined ? "" : currentFileObject.history
                }

                var message = [
                    workerNumber,
                    "success",
                    finalFilePath,
                    settingsDBIndex,
                    mode,
                    currentSourceLine,
                    JSON.stringify(filePropertiesToAdd),
                    sizeDiffGB,
                ];
                process.send(message);

                checkifQueuePause();

                


            } catch (err) {

                errorLogFull += err + "\r\n"
                errorLogFull += "Deleting original/moving new file unsuccessful" + "\r\n"
                updateConsole(workerNumber, "Deleting original/moving new file unsuccessful:" + currentSourceLine + " to " + finalFilePath + " err:" + err)


                var message = [
                    workerNumber,
                    "error",
                    currentSourceLine,
                    settingsDBIndex,
                    mode,
                    errorLogFull

                ];
                process.send(message);

                checkifQueuePause();

            }





        } else {

            processFileFunc()

        }


        function processFileFunc() {
            //

            var childProcess = require('child_process');
            // var shellThreadPath = "worker2.js"

            //
            updateConsole(workerNumber, "Launching sub-worker:")

            // var workerPath = path.join(__dirname, "/imports/api/worker2.js")

            var workerPath = "assets/app/worker2.js"



            shellThreadModule = childProcess.fork(workerPath, [], {
                silent: true
            });
            // var shellThreadModule = childProcess.fork(path.join(__dirname, shellThreadPath ));
            updateConsole(workerNumber, "Launching sub-worker successful:")



            var infoArray = [
                "processFile",
                workerCommand
            ];

            updateConsole(workerNumber, "Sending command to sub-worker:" + workerCommand)
            shellThreadModule.send(infoArray);


            shellThreadModule.stdout.on('data', function (data) {
                //  ('stdoutWorker: ' + data);
                //log console output to text file

                var str = "" + data;



                if (handBrakeMode == true) {

                    var numbers = "0123456789"
                    var n = str.indexOf("%")

                    if (str.length >= 6 && str.indexOf("%") >= 6 && numbers.includes(str.charAt(n - 5))) {

                        var output = str.substring(n - 6, n + 1)


                        output = output.split("")
                        output.splice(output.length - 1, 1)
                        output = output.join("")

                        // updateConsole(workerNumber, " : " + output)


                        updateETA(output)

                        var message = [
                            workerNumber,
                            "percentage",
                            output
                        ];
                        process.send(message);




                    }
                } else if (FFmpegMode == true) {

                    if (str.includes("frame=")) {
                        if (str.length >= 6) {
                            var n = str.indexOf("fps");

                            if (n >= 6) {


                                var output = str.substring(6, n)


                                output = getFFmpegPercentage(output, frameCount, currentFileObject.meta.VideoFrameRate, currentFileObject.meta.Duration)


                                updateETA(output)
                                //  updateConsole(workerNumber, " : " + output)
                                var message = [
                                    workerNumber,
                                    "percentage",
                                    output
                                ];
                                process.send(message);


                            }
                        }
                    }
                }
                if (str.includes("Exit code:")) {

                }

                if (str.includes("stderr:")) {

                }
            });


            shellThreadModule.stderr.on('data', function (data) {

                //('stderrorWorker: ' + data);

                errorLogFull += data + "\r\n";

                var str = "" + data;


                if (handBrakeMode == true) {

                    var numbers = "0123456789"
                    var n = str.indexOf("%")
                    if (str.length >= 6 && str.indexOf("%") >= 6 && numbers.includes(str.charAt(n - 5))) {

                        var output = str.substring(n - 6, n + 1)

                        output = output.split("")
                        output.splice(output.length - 1, 1)
                        output = output.join("")

                        //  updateConsole(workerNumber, " : " + output)
                        updateETA(output)

                        var message = [
                            workerNumber,
                            "percentage",
                            output
                        ];
                        process.send(message);


                    }



                } else if (FFmpegMode == true) {

                    if (str.includes("frame=")) {
                        if (str.length >= 6) {
                            var n = str.indexOf("fps");

                            if (n >= 6) {

                                //get frame
                                var output = str.substring(6, n)


                                output = getFFmpegPercentage(output, frameCount, currentFileObject.meta.VideoFrameRate, currentFileObject.meta.Duration)



                                //

                                updateETA(output)
                                // updateConsole(workerNumber, " : " + output)
                                var message = [
                                    workerNumber,
                                    "percentage",
                                    output
                                ];
                                process.send(message);


                            }
                        }
                    }
                }
            });




            shellThreadModule.on("exit", function (code, ) {
                //('shellThreadExited:', code,);
                updateConsole(workerNumber, "Sub-worker exited")

            });


            shellThreadModule.on('message', function (message) {




                if (message[0] == "consoleMessage") {

                    updateConsole("Worker " + workerNumber + ":" + message[1] + "");
                }



                if (message.error) {
                    console.error(message.error);
                }


                if (message[0] == "Exit") {


                    updateConsole(workerNumber, "Sub-worker exit status received")

                    shellThreadModule = "";


                    if (mode != "healthcheck" && !fs.existsSync(currentDestinationLine)) {

                        updateConsole(workerNumber, "Tdarr ALERT: NO OUTPUT FILE PRODUCED" + currentDestinationLine)


                        var message = [
                            workerNumber,
                            "error",
                            currentSourceLine,
                            settingsDBIndex,
                            mode,
                            errorLogFull

                        ];
                        process.send(message);


                        checkifQueuePause();


                    } else if (message[1] != 0) {

                        workerEncounteredError(message[1])

                    } else {
                        //     // workerEncounteredError(message[1])
                        workerNotEncounteredError();


                    }

                }
            });
        }
    }




    if (m[0] == "completed") {

        if (exitRequestSent == false) { }


        var message = [
            workerNumber,
            "exitRequest",
        ];

        process.send(message);

        updateConsole(workerNumber, "Exit request")

        exitRequestSent = true


    }


    if (m[0] == "exitApproved") {

        updateConsole(workerNumber, "Exiting")

        process.exit();



    }

});



function checkifQueuePause() {


    var message = [
        workerNumber,
        "queueRequest",
        workerType,
    ];
    process.send(message);


}



//path.join(__dirname, workerPath )




// Workers.remove({workerNumber})


function getFFmpegCLIPath() {


    var ffmpegPath = require(rootModules + '@ffmpeg-installer/ffmpeg').path;


    return ffmpegPath

}







function getHandBrakeCLIPath() {


    //handbrake CLI path
    if (process.platform == 'win32') {
        var handBrakeCLIPath = path.join(__dirname, "/imports/api/HandBrakeCLI.exe")

    }


    if (process.platform == 'linux' || process.platform == 'darwin') {
        //development && //production
        var handBrakeCLIPath = "HandBrakeCLI -i \""
    }

    return handBrakeCLIPath

}



function getOutputPath(inputFilePath, outputFileContainer, inputPathStem, outputPathStem) {

    while (inputPathStem.charAt(inputPathStem.length - 1) == '/') {
        inputPathStem = inputPathStem.split("")
        inputPathStem.splice(inputPathStem.length - 1, 1)
        inputPathStem = inputPathStem.join("")
    }

    while (outputPathStem.charAt(outputPathStem.length - 1) == '/') {
        outputPathStem = outputPathStem.split("")
        outputPathStem.splice(outputPathStem.length - 1, 1)
        outputPathStem = outputPathStem.join("")
    }


    inputPathStemSplit = inputPathStem.split(','); // comma removed step 1:  /path/to/folder



    topFolder = inputPathStemSplit[inputPathStemSplit.length - 1] // comma removed step 2:  /path/to/folder

    topFolderCharLength = topFolder.length   //



    var str = inputFilePath  // path/to/topfolder/subfolder/test.mp4


    str = str.substring(topFolderCharLength);       // /subfolder/test.mp4


    pointer = str.split(stringProcessingSlash);

    filePathEnd = pointer[pointer.length - 1]   //     test.mp4

    filePathEndFileType = filePathEnd.slice(0, filePathEnd.lastIndexOf('.'));   // test



    subfilePath = filePathEndFileType + outputFileContainer;   // "test" +".mp4"


    LongsubfilePath = str.slice(0, str.lastIndexOf(stringProcessingSlash)); //  path/to/folder
    newsubfilePath = LongsubfilePath + stringProcessingSlash + subfilePath; // path/to/folder + "/" + "test.mp4"
    outputFilePath = outputPathStem + newsubfilePath;

    return outputFilePath.replace(/\\/g, "/");
}


function workerNotEncounteredError() {


    if (mode == "healthcheck") {

        var message = [
            workerNumber,
            "success",
            currentSourceLine,
            settingsDBIndex,
            mode,

        ];
        process.send(message);
        updateConsole(workerNumber, "No errors found with this file:" + currentSourceLine)


        checkifQueuePause();

    } else {


        // function transcodeWorkerFinish()

        try { var sourcefileSizeInGbytes = (((fs.statSync(currentSourceLine)).size) / 1000000000.0); } catch (err) {

            var sourcefileSizeInGbytes = 0
        }
        try { var destfileSizeInGbytes = (((fs.statSync(currentDestinationLine)).size) / 1000000000.0); } catch (err) {

            var destfileSizeInGbytes = 0
        }
        try { var sizeDiffGB = sourcefileSizeInGbytes - destfileSizeInGbytes } catch (err) {

            var sizeDiffGB = 0;
        }











        try {





            if (folderToFolderConversionEnabled == true) {

                errorLogFull += "Attempting to move new file to output folder" + "\r\n"
                updateConsole(workerNumber, "Attempting to move new file to output folder" + currentSourceLine)


                var finalFilePathCopy = finalFilePath


                finalFilePathCopy = finalFilePathCopy.split(".")


                finalFilePathCopy[finalFilePathCopy.length - 2] = finalFilePathCopy[finalFilePathCopy.length - 2] + "-TdarrNew"
                finalFilePathCopy = finalFilePathCopy.join(".")


                fsextra.moveSync(currentDestinationLine, finalFilePathCopy, {
                    overwrite: true
                })

                errorLogFull += "Moving file successful:" + "\r\n"
                updateConsole(workerNumber, "Moving file successful:" + currentDestinationLine + " to " + finalFilePathCopy)


                //Delete source file ONLY after first pass when file is still in original source folder.

                if(librarySettings.folderToFolderConversionDeleteSource === true && !fileToProcess.includes(folderToFolderConversionFolder)){

                    errorLogFull += "Attempting to delete original file" + "\r\n"
                    updateConsole(workerNumber, "Attempting to delete original file" + currentSourceLine)
    
                    fs.unlinkSync(currentSourceLine)
                    errorLogFull += "Original file deleted" + "\r\n"
                    updateConsole(workerNumber, "Original file deleted" + currentSourceLine)

                }
             


                


                errorLogFull += "Renaming new file:" + "\r\n"
                updateConsole(workerNumber, "Renaming new file:" + finalFilePathCopy + " to " + finalFilePath)

                fsextra.moveSync(finalFilePathCopy, finalFilePath, {
                    overwrite: true
                })

                errorLogFull += "Renaming new file success:" + "\r\n"
                updateConsole(workerNumber, "Renaming new file success:" + finalFilePathCopy + " to " + finalFilePath)


                var cliLog = "\n Original size GB:" + sourcefileSizeInGbytes
                cliLog += "\n New size GB:" + destfileSizeInGbytes




            } else {

                updateConsole(workerNumber, "Moving file:" + currentDestinationLine + " to " + finalFilePath)

                errorLogFull += "Attempting to move new file to original folder" + "\r\n"
                updateConsole(workerNumber, "Attempting to move new file to original folder" + currentSourceLine)

                var finalFilePathCopy = finalFilePath


                finalFilePathCopy = finalFilePathCopy.split(".")


                finalFilePathCopy[finalFilePathCopy.length - 2] = finalFilePathCopy[finalFilePathCopy.length - 2] + "-TdarrNew"
                finalFilePathCopy = finalFilePathCopy.join(".")


                fsextra.moveSync(currentDestinationLine, finalFilePathCopy, {
                    overwrite: true
                })

                errorLogFull += "Moving file successful:" + "\r\n"
                updateConsole(workerNumber, "Moving file successful:" + currentDestinationLine + " to " + finalFilePathCopy)


                errorLogFull += "Attempting to delete original file" + "\r\n"
                updateConsole(workerNumber, "Attempting to delete original file" + currentSourceLine)



                fs.unlinkSync(currentSourceLine)
                errorLogFull += "Original file deleted" + "\r\n"
                updateConsole(workerNumber, "Original file deleted" + currentSourceLine)


                errorLogFull += "Renaming new file:" + "\r\n"
                updateConsole(workerNumber, "Renaming new file:" + finalFilePathCopy + " to " + finalFilePath)

                fsextra.moveSync(finalFilePathCopy, finalFilePath, {
                    overwrite: true
                })

                errorLogFull += "Renaming new file success:" + "\r\n"
                updateConsole(workerNumber, "Renaming new file success:" + finalFilePathCopy + " to " + finalFilePath)


                var cliLog = "\n Original size GB:" + sourcefileSizeInGbytes
                cliLog += "\n New size GB:" + destfileSizeInGbytes


            }







            if (reQueueAfter == true) {

                var filePropertiesToAdd = {
                    HealthCheck: "Queued",
                    TranscodeDecisionMaker: "Queued",
                    lastTranscodeDate: new Date(),
                    cliLog: cliLog,
                    oldSize: currentFileObject.oldSize ? currentFileObject.oldSize : sourcefileSizeInGbytes,
                    newSize: destfileSizeInGbytes,
                    bumped: new Date(),
                    history: currentFileObject.history == undefined ? "" : currentFileObject.history
                }

            } else {

                var filePropertiesToAdd = {
                    HealthCheck: "Queued",
                    TranscodeDecisionMaker: "Transcode success",
                    lastTranscodeDate: new Date(),
                    cliLog: cliLog,
                    oldSize: currentFileObject.oldSize ? currentFileObject.oldSize : sourcefileSizeInGbytes,
                    newSize: destfileSizeInGbytes,
                    bumped: false,
                    history: currentFileObject.history == undefined ? "" : currentFileObject.history
                }
            }






            var message = [
                workerNumber,
                "success",
                finalFilePath,
                settingsDBIndex,
                mode,
                currentSourceLine,
                JSON.stringify(filePropertiesToAdd),
                sizeDiffGB,
            ];
            process.send(message);

            checkifQueuePause();




        } catch (err) {

            errorLogFull += err + "\r\n"

            errorLogFull += "Deleting original file and moving new file unsuccessful" + "\r\n"

            updateConsole(workerNumber, "Deleting original file and moving new file unsuccessful:" + currentDestinationLine + " to " + finalFilePath + " err:" + err)


            var message = [
                workerNumber,
                "error",
                currentSourceLine,
                settingsDBIndex,
                mode,
                errorLogFull

            ];
            process.send(message);


            checkifQueuePause();

        }
    }
}




function workerEncounteredError(messageOne) {


    try{
    if (fs.existsSync(currentDestinationLine)) {
        fs.unlinkSync(currentDestinationLine)
    }
}catch(err){console.log(err)}


    if (messageOne == "Cancelled") {

        

        var message = [
            workerNumber,
            "cancelled",
            currentSourceLine,
            settingsDBIndex,
            mode,
            "notsuicide"
        ];
        process.send(message);

        updateConsole(workerNumber, "Item cancelled:" + currentSourceLine)

        checkifQueuePause();


    } else {


        if (mode == "healthcheck") {
            //function everything else waits

            //if repair file == true

            var message = [
                workerNumber,
                "error",
                currentSourceLine,
                settingsDBIndex,
                mode,
                errorLogFull

            ];
            process.send(message);

            updateConsole(workerNumber, "Sub worker error when processing:" + currentSourceLine)


            checkifQueuePause();




        } else {

            var message = [
                workerNumber,
                "error",
                currentSourceLine,
                settingsDBIndex,
                mode,
                errorLogFull

            ];
            process.send(message);

            checkifQueuePause();

        }
    }
}

var progAVG = []

function updateETA(perc) {

    if (!isNaN(perc) && perc > 0) {




        if (lastProgCheck == "") {

            lastProgCheck = new Date()
            oldProgress = perc


        } else {

            if (perc != oldProgress) {


                var n = new Date()
                var secsSinceLastCheck = (n - lastProgCheck) / 1000


                if (secsSinceLastCheck > 1) {

                    //eta total
                    var eta = Math.round((100 / (perc - oldProgress)) * secsSinceLastCheck)

                    //eta remaining
                    eta = ((100 - perc) / 100) * eta

                    progAVG.push(eta)

                    // var values = [2, 56, 3, 41, 0, 4, 100, 23];
                    var sum = progAVG.reduce((previous, current) => current += previous);
                    var avg = sum / progAVG.length;

                    var message = [
                        workerNumber,
                        "ETAUpdate",
                        fancyTimeFormat(avg)
                    ];
                    process.send(message);

                    if (progAVG.length > 30) {
                        progAVG.splice(0, 1)
                    }



                    lastProgCheck = n
                    oldProgress = perc







                }

            }
        }
    }
}

function fancyTimeFormat(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    //  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    // }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


function getFFmpegPercentage(frame, frameCount, VideoFrameRate, Duration) {

    if (frameCount != "undefined") {

        return ((frame / frameCount) * 100).toFixed(2)

    } else if (VideoFrameRate != 'undefined' && Duration != 'undefined') {

        return (((frame / VideoFrameRate) / Duration) * 100).toFixed(2)

    } else {
        return output
    }

}

