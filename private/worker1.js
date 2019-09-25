

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

if (fs.existsSync(path.join(process.cwd()+"/npm"))) {

    var rootModules = path.join(process.cwd()+'/npm/node_modules/')

}else{

    var rootModules = ''

}




var shell = require(rootModules+'shelljs');
var fsextra = require(rootModules+'fs-extra')


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






function getRootDir(){

    var rootDir =  path.resolve();
    rootDir = rootDir.split("\\")
    var firstEle =  rootDir.length - 5
    rootDir.splice(firstEle, 5)
    rootDir = rootDir.join("\\")
  
  
    return rootDir
  }
  
  //__dirname = getRootDir()




// var message = [
//     "workerOnline",
// ];
// process.send(message);


var workerNumber = process.argv[2]
var workerType = process.argv[3]

//workerNumber =process.argv[2]

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

       // repair_worker


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
        reQueueAfter= m[11]

        console.log("mode"+mode)
        


        updateConsole(workerNumber, "File received:"+ fileToProcess )
        

        // Workers.upsert(workerNumber,


        //     {
        //         $set: {
        //             _id: workerNumber,
        //             workerNumber: workerNumber,
        //             processingFile: fileToProcess,
        //         }
        //     }
        // );



        
        

        
        
        
        
        
        var presetSplit
        presetSplit = preset.split(',')
        var workerCommand = "";
        
        currentDestinationLine = getOutputPath(fileToProcess, container, inputFolderStem, outputFolder)

        updateConsole(workerNumber, "currentDestinationLine:"+currentDestinationLine)

        finalFilePath = getOutputPath(currentDestinationLine, container, outputFolder,inputFolderStem )

        updateConsole(workerNumber, "finalFilePath:"+finalFilePath)
        
        
        
        var outputFolderPath = currentDestinationLine.substring(0, currentDestinationLine.lastIndexOf(stringProcessingSlash))

        if (fs.existsSync(outputFolderPath)) {


        } else {


               try {

                   // if (mode != "healthcheck") {


                        shell.mkdir('-p', outputFolderPath);



                //    }

                } catch (err) {
                    updateConsole(workerNumber, "Unable to create folder!")
                 }            

        }

        if (fs.existsSync(path.join(process.cwd()+"/npm"))) {

            var handBrakeCLIPath =  path.join(process.cwd()+'/assets/app/HandBrakeCLI.exe')


        }else{
            var handBrakeCLIPath =   path.join(process.cwd()+'/private/HandBrakeCLI.exe')
        }

        
       



        var ffmpegPath = getFFmpegCLIPath();


        
        currentSourceLine = fileToProcess
        
        
        
        
        if(process.platform == 'win32' && handBrakeMode == true) {
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
        

        if (mode == "transcode") {

            if(fs.existsSync(currentDestinationLine)){

                fs.unlinkSync(currentDestinationLine)

            }
        }

        errorLogFull = ""
        errorLogFull += "Command: \n\n"
        errorLogFull += workerCommand + "\n\n"
        
        

        
       
        
        processFile()
        
        function processFile() {
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
        
                // if (saveWorkerLogs) {
        
                //     var message = [
                //         workerNumber,
                //         "appendRequest",
                //         homePath + "/Documents/HBBatchBeast/Logs/Worker" + workerNumber + "ConsoleOutput.txt",
                //         str,
                //         //currentSourceLine+" ConversionError\n",
                //     ];
                //     process.send(message);
                // }
        
                // send percentage update to GUI
        
                if (handBrakeMode == true) {
        
                    var numbers = "0123456789"
                    var n = str.indexOf("%")
        
                    if (str.length >= 6 && str.indexOf("%") >= 6 && numbers.includes(str.charAt(n - 5))) {
        
                        var output = str.substring(n - 6, n + 1)
        
        
                        output = output.split("")
                        output.splice(output.length-1,1)
                        output = output.join("")
                 
                       // updateConsole(workerNumber, " : " + output)
                   
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


                                if(frameCount != "undefined"){

                                output = ((output / frameCount) * 100).toFixed(2) + "%"
                                output = output.split("")
                                output.splice(output.length-1,1)
                                output = output.join("")


                                }else{
                                    output = output

                                }
        
                        
        
    
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

                errorLogFull += data;


                var str = "" + data;
        
                // if (saveWorkerLogs) {
                //     var message = [
                //         workerNumber,
                //         "appendRequest",
                //         homePath + "/Documents/HBBatchBeast/Logs/Worker" + workerNumber + "ConsoleOutputError.txt",
                //         str,
                //         //currentSourceLine+" ConversionError\n",
                //     ];
                //     process.send(message);
                // }
        
               // errorLogFull += data;
                // send percentage update to GUI
        
                if (handBrakeMode == true) {
        
                    var numbers = "0123456789"
                    var n = str.indexOf("%")
                    if (str.length >= 6 && str.indexOf("%") >= 6 && numbers.includes(str.charAt(n - 5))) {
        
                        var output = str.substring(n - 6, n + 1)
        
                        output = output.split("")
                        output.splice(output.length-1,1)
                        output = output.join("")

                      //  updateConsole(workerNumber, " : " + output)
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
        
                                if(frameCount != "undefined"){

                                    output = ((output / frameCount) * 100).toFixed(2) + "%"
                                    output = output.split("")
                                    output.splice(output.length-1,1)
                                    output = output.join("")
    
    
                                    }else{
                                        output = output
    
                                    }

                                
        
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
        
                //var message2 = message.split(",");
        
        
        
                if (message[0] == "Exit") {
        
        
                   updateConsole(workerNumber, "Sub-worker exit status received")
        
                    shellThreadModule = "";
        
                
        
        
        
        
                    //// exit code begin
        
        
        
        
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
        
        
        
        
                    //     // errorLogFull += "\n HBBatchBeast ALERT: NO OUTPUT FILE PRODUCED";
                    //     // if (currentSourceLine.includes("'") && process.platform == 'linux') {
                    //     //     errorLogFull += "\n Operation may have failed due to apostrophe in file name. Please try using the setting 'Remove apostrophes from filenames' in the advanced settings section.:" + currentSourceLine
                    //     //     updateConsole(workerNumber, "\n Operation may have failed due to apostrophe in file name. Please try using the setting 'Remove apostrophes from filenames' in the advanced settings section.:" + currentSourceLine)
                    //     // }
        
                    //     // var message = [
                    //     //     workerNumber,
                    //     //     "error",
                    //     //     globalQueueNumber,
                    //     //     preset,
                    //     //     errorLogFull
                    //     // ];
                    //     // process.send(message);
        
                    //   //  checkifQueuePause();

                    checkifQueuePause();
        
        
                     } else if (message[1] != 0) {
        
                     workerEncounteredError(message[1])
        
                     } else {
                    //     // workerEncounteredError(message[1])
                    workerNotEncounteredError();
        
        
                     }



    
        
        
        
        
        
                //    checkifQueuePause()
        
                
        
                }
            });
        }
    }








    if (m[0] == "completed") {





        if(exitRequestSent == false){}
        
        
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


        var ffmpegPath = require(rootModules+'@ffmpeg-installer/ffmpeg').path;

  
    return ffmpegPath
  
  }
  
  
  
  
  
  
  
  function getHandBrakeCLIPath() {
  
  
    //handbrake CLI path
    if (process.platform == 'win32') {
        var handBrakeCLIPath = path.join(__dirname, "/imports/api/HandBrakeCLI.exe" )

    }
  
  
    if (process.platform == 'linux' || process.platform == 'darwin') {
        //development && //production
        var handBrakeCLIPath = "HandBrakeCLI -i \""
    }
  
    return handBrakeCLIPath
  
  }
  
  
  
  function getOutputPath(inputFilePath, outputFileContainer, inputPathStem, outputPathStem) {
  
  
    inputPathStemSplit = inputPathStem.split(','); // comma removed step 1:  /path/to/folder
  
  
  
    topFolder = inputPathStemSplit[inputPathStemSplit.length - 1] // comma removed step 2:  /path/to/folder
  
    topFolderCharLength = topFolder.length   //
  
  
  
    // var thisFile = fullPath + "" // path/to/folder/test.mp4
  
    // fileTypeSplit = thisFile.split('.');    // 
    // fileType = fileTypeSplit[fileTypeSplit.length - 1]   // mp4
  
  
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

try{
        var sourcefileSizeInGbytes = (((fs.statSync(currentSourceLine)).size) / 1000000000.0);
        var destfileSizeInGbytes = (((fs.statSync(currentDestinationLine)).size) / 1000000000.0);
        var sizeDiffGB = sourcefileSizeInGbytes - destfileSizeInGbytes

    }catch(err){

        var sizeDiffGB = 0;


    }



        // var message = [
        //     workerNumber,
        //     "fileSizes",
        //     globalQueueNumber,
        //     sourcefileSizeInGbytes,
        //     destfileSizeInGbytes

        // ];
        // process.send(message);

        //currentSourceLine

        

            updateConsole(workerNumber, "Moving file:" + currentDestinationLine + " to " + finalFilePath)



            try{

                errorLogFull += "Attempting to delete original file"
                updateConsole(workerNumber, "Attempting to delete original file" + currentSourceLine)

                fs.unlinkSync(currentSourceLine)


                errorLogFull += "Original file deleted"
                updateConsole(workerNumber, "Original file deleted" + currentSourceLine)


                errorLogFull += "Attempting to move new file to original folder"
                updateConsole(workerNumber, "Attempting to move new file to original folder" + currentSourceLine)

                fsextra.moveSync(currentDestinationLine, finalFilePath, {
                    overwrite: true
                })

                errorLogFull += "Moving file successful:"
                updateConsole(workerNumber, "Moving file successful:" + currentDestinationLine + " to " + finalFilePath)


                var message = [
                    workerNumber,
                    "success",
                    finalFilePath,
                    settingsDBIndex,
                    mode,
                    currentSourceLine,
                    reQueueAfter,
                    sizeDiffGB,
                ];
                process.send(message);

                checkifQueuePause();




            }catch(err){

                errorLogFull += err

                errorLogFull += "Deleting original file and moving new file unsuccessful"

                updateConsole(workerNumber, "Deleting original file and moving new file unsuccessful:" + currentDestinationLine + " to " + finalFilePath +" err:"+err)


                var message = [
                    workerNumber,
                    "error",
                    currentSourceLine,
                    settingsDBIndex,
                    mode,
                    errorLogFull
        
                ];
                process.send(message);

                // var message = [
                //     workerNumber,
                //     "Original not replaced",
                //     currentSourceLine,
        
                // ];
                // process.send(message);


                checkifQueuePause();

            }






     

    }
}




  function workerEncounteredError(messageOne) {


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

                // if (moveCorruptFileOnOff == true) {
                //     moveCorruptedFile();
                // }

                // if (saveWorkerLogs) {
                //     var errorLogWrite = "[" + getDateNow() + "#" + getTimeNow() + "]" + currentSourceLine + "\r\n" + errorLogFull + "\r\n"

                // }else{
                //     var errorLogWrite =   currentSourceLine + "\r\n"

                // }

                // var message = [
                //     workerNumber,
                //     "appendRequest",
                //     homePath + "/Documents/HBBatchBeast/Logs/ErrorLog.txt",
                //     errorLogWrite,
                // ];
                // process.send(message);
                // checkifQueuePause();

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

            // updateConsole(workerNumber, "Sub worker error when processing:" + currentSourceLine)

            // if (tempFolderSelected == true) {
            //     var message = [
            //         workerNumber,
            //         "appendRequest",
            //         homePath + "/Documents/HBBatchBeast/Logs/fileConversionLog.txt",
            //         "[" + getDateNow() + "#" + getTimeNow() + "]"+ "--------ERROR----------" + currentSourceLine + "------------to----------" + currentDestinationFinalLine + "----------using preset----------:" + preset + "\r\n" + errorLogFull + "\r\n",
            //     ];
            //     process.send(message);
            // } else {
            //     var message = [
            //         workerNumber,
            //         "appendRequest",
            //         homePath + "/Documents/HBBatchBeast/Logs/fileConversionLog.txt",
            //         "[" + getDateNow() + "#" + getTimeNow() + "]" + "--------ERROR----------" + currentSourceLine + "------------to----------" + currentDestinationLine + "----------using preset----------:" + preset + "\r\n" + errorLogFull + "\r\n",
            //     ];
            //     process.send(message);
            // }

            checkifQueuePause();

        }
    }
}