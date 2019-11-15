
import { Meteor } from 'meteor/meteor';



const shortid = require('shortid');

//Globals
var fs = require('fs');
var path = require('path');



Meteor.methods({



    'createPluginFilterCodec'(mode, codecs) {

        var ID = shortid.generate()

        if (mode == true) {

            var modeType = "Exclude"

        } else {
            var modeType = "Include"
        }

        var text = `
        
function details() {

  return {
    id: "${ID}_FilterByCodec_${modeType}_${codecs}",
    Name: "Filter by codec",
    Type: "General",
    Operation: "Filter",
    Description: "Files in ${codecs} will be ${modeType}d",
    Version: "",
    Link: ""
  }



}

function plugin(file) {


  //Must return this object

  var response = {

     processFile : false,
     preset : '',
     container : '.mp4',
     handBrakeMode : false,
     FFmpegMode : false,
     reQueueAfter : true,
     infoLog : '',

  }

  
  if (file.fileMedium !== "video") {

    console.log("File is not video")
  
    response.infoLog += "☒File is not video \\n"
    response.processFile = false;
  
    return response
  
  } else { 
  
   if(${mode} === true){
  
    if("${codecs}".toLowerCase().includes(file.ffProbeData.streams[0].codec_name.toLowerCase())){
  
  
      response.infoLog += "☑Codec excluded \\n"
      response.processFile = false;
      return response
  
     }else{
  
  
      response.infoLog += "☑Codec included \\n"
      response.processFile = true;
      return response
  
  
     }
  
   }else{
  
    if("${codecs}".toLowerCase().includes(file.ffProbeData.streams[0].codec_name.toLowerCase())){
  
      response.infoLog += "☑Codec included \\n"
      response.processFile = true;
      return response
  
     }else{
  
      response.infoLog += "☑Codec excluded \\n"
      response.processFile = false;
      return response
  
  
     }
   } 
  }
}

module.exports.details = details;

module.exports.plugin = plugin;

        `
        fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}_FilterByCodec_${modeType}_${codecs}.js`, text, 'utf8');


    },





    'createPluginFilterMedium'(type) {

        var ID = shortid.generate()



        var text = `
        
function details() {

  return {
    id: "${ID}_FilterByMedium_Include_${type}",
    Name: "Filter by medium",
    Type: "${type}",
    Operation: "Filter",
    Description: "Files of ${type} type will be included.",
    Version: "",
    Link: ""
  }



}

function plugin(file) {


  //Must return this object

  var response = {

     processFile : false,
     preset : '',
     container : '.mp4',
     handBrakeMode : false,
     FFmpegMode : false,
     reQueueAfter : true,
     infoLog : '',

  }

  
  if (file.fileMedium !== "${type}") {

    console.log("File is not ${type}")
  
    response.infoLog += "☒File is not ${type} \\n"
    response.processFile = false;
  
    return response
  
  } else { 

      response.infoLog += "☑File is ${type} \\n"  
      response.processFile = true;
      return response
  }
}

module.exports.details = details;

module.exports.plugin = plugin;

        `
        fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}_FilterByMedium_Include_${type}.js`, text, 'utf8');


    },
    
    
    'createPluginFilterDate'(totalSeconds,string) {

        var ID = shortid.generate()



        var text = `
        
        function details() {

            return {
              id: "${ID}_FilterByDate_ExcludeOlderThan_${string}",
              Name: "Filter by date created.",
              Type: "General",
              Operation: "Filter",
              Description: "Files older than ${string} will be excluded.",
              Version: "",
              Link: ""
            }
          
          
          
          }
          
          function plugin(file) {
          
          
            //Must return this object
          
            var response = {
          
               processFile : false,
               preset : '',
               container : '.mp4',
               handBrakeMode : false,
               FFmpegMode : false,
               reQueueAfter : true,
               infoLog : '',
          
            }
          
            var timeNow = new Date()
            var dateCreated  = new Date(file.statSync.birthtime)
            var fileAge = Math.round((timeNow - dateCreated) / 1000)
          
          
            if (fileAge > ${totalSeconds}) {
          
              console.log("File creation date is older than specified requirement.")
          
              response.infoLog += "☒File creation date is older than specified requirement. \\n"
              response.processFile = false;
          
              return response
          
            } else {
          
              console.log("File creation date is within specified requirement.")
          

              response.infoLog += "☑File creation date is within specified requirement. \\n"
              response.processFile = true;
          
              return response
          
          
            }
          }

module.exports.details = details;

module.exports.plugin = plugin;

        `
        fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}_FilterByDate_ExcludeOlderThan_${string}.js`, text, 'utf8');

    },


    'createPluginFilterResolution'(mode,resolution) {

        var ID = shortid.generate()
        
        var modeType

        if(mode == false){

            modeType = "Include"

        }else{

            modeType = "Exclude"
        }


        var text = `
        
        function details() {

            return {
              id: "${ID}_FilterByResolution_${modeType}_${resolution}",
              Name: "Filter by resolution",
              Type: "General",
              Operation: "Filter",
              Description: "Files in ${resolution} will be ${modeType}d",
              Version: "",
              Link: ""
            }
          
          
          }
          function plugin(file) {
          
          
            //Must return this object
          
            var response = {
          
               processFile : false,
               preset : '',
               container : '.mp4',
               handBrakeMode : false,
               FFmpegMode : false,
               reQueueAfter : true,
               infoLog : '',
          
            }
          
            
            if( ${mode} === true){


                if ("${resolution}".toLowerCase().includes(file.video_resolution.toLowerCase()) ) {
          
                    console.log("File is in excluded resolution.")
                
                    response.infoLog += "☒File is in excluded resolution. \\n"
                    response.processFile = false;
                
                    return response
                
                  } else {
                
                    console.log("File is not in excluded resolution.")
                    response.infoLog += "☑File is not in excluded resolution. \\n"
                    response.processFile = true;
                
                    return response
              
                  }



            }else{

                if ("${resolution}".toLowerCase().includes(file.video_resolution.toLowerCase()) ) {
          
                    console.log("File is in included resolution")
                    response.infoLog += "☑File is in included resolution. \\n"
                    response.processFile = true;
                
                    return response
                
                  } else {
                
                    console.log("File is not in included resolution.")
                    response.infoLog += "☒File is not in included resolution. \\n"
                    response.processFile = false;
    
                    return response
              
                  }


            }
          }

module.exports.details = details;

module.exports.plugin = plugin;

        `
        fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}_FilterByResolution_${modeType}_${resolution}.js`, text, 'utf8');

    },

    'createPluginFilterSize'(lowerBound,upperBound,string) {

        var ID = shortid.generate()
        
  

        var text = `
        
        function details() {

            return {
              id: "${ID}_FilterBySize_Include_${string}",
              Name: "Filter by size",
              Type: "General",
              Operation: "Filter",
              Description: "Files with size ${string} will be processed.",
              Version: "",
              Link: ""
            }
          
          
          }
          function plugin(file) {
          
          
            //Must return this object
          
            var response = {
          
               processFile : false,
               preset : '',
               container : '.mp4',
               handBrakeMode : false,
               FFmpegMode : false,
               reQueueAfter : true,
               infoLog : '',
          
            }
          
            
                if (file.file_size/1000 >= ${lowerBound} && file.file_size/1000 <= ${upperBound}) {
          
                    console.log("File size is within filter limits")
                
                    response.infoLog += "☑File size is within filter limits. \\n"
                    response.processFile = true;
                
                    return response
                
                  } else {
                
                    console.log("File size is not within filter limits.")
                    response.infoLog += "☒File size is not within filter limits. \\n"
                    response.processFile = false;
                
                    return response
              
                  }



          }

module.exports.details = details;

module.exports.plugin = plugin;

        `
        fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}_FilterBySize_Include_${string}.js`, text, 'utf8');

    },


    
    'createPluginTranscode'(preset,container,handBrakeMode,FFmpegMode) {

        var ID = shortid.generate()
        var CLI = ""

        if(handBrakeMode == true){

            CLI = "HandBrake"

        }else if(FFmpegMode == true){

            CLI = "FFmpeg"
        }
        
  

        var text = `
        
        function details() {

            return {
              id: "${ID}_Transcode_${CLI}",
              Name: "Transcode ${CLI}",
              Type: "General",
              Operation: "Transcode",
              Description: 'Files will be transcoded with ${CLI} using the following arguments:${preset} . The output container is ${container}.',
              Version: "",
              Link: ""
            }
          
          
          }
          function plugin(file) {
          
          
            //Must return this object
          
            var response = {
          
               processFile : true,
               preset : '${preset}',
               container : '${container}',
               handBrakeMode : ${handBrakeMode},
               FFmpegMode : ${FFmpegMode},
               reQueueAfter : true,
               infoLog : 'Transcode plugin',
          
            }
          
            return response
              




          }

module.exports.details = details;

module.exports.plugin = plugin;

        `
        fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}_Transcode_${CLI}.js`, text, 'utf8');

    },


    
    'createPluginRemuxContainer'(container) {

        var ID = shortid.generate()

        var containerNoDot = container.substring(1);
   

 
  

        var text = `
        
        function details() {

            return {
              id: "${ID}_RemuxContainer_${containerNoDot}",
              Name: "Remux container ${containerNoDot}",
              Type: "General",
              Operation: "Remux",
              Description: 'If files are not in ${containerNoDot}, they will be remuxed into ${containerNoDot}.',
              Version: "",
              Link: ""
            }
          
          
          }
          function plugin(file) {
          
          
            //Must return this object
          
            var response = {
          
               processFile : true,
               preset : '',
               container : '${container}',
               handBrakeMode : false,
               FFmpegMode : true,
               reQueueAfter : true,
               infoLog : '',
          
            }
          
            
            if( file.container != '${containerNoDot}'){

                response.infoLog += "☒File is not in ${containerNoDot} container! \\n"
                response.preset = ', -map 0 -codec copy'
                response.reQueueAfter = true;
                response.processFile = true;
                return response
          
          
               }else{
          
                response.infoLog += "☑File is in ${containerNoDot} container! \\n"
                return reponse
          
          
               }
              




          }

module.exports.details = details;

module.exports.plugin = plugin;

        `
        fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}_RemuxContainer_${containerNoDot}.js`, text, 'utf8');

    },


});








