
import { Meteor } from 'meteor/meteor';



const shortid = require('shortid');

//Globals
var fs = require('fs');
var path = require('path');



Meteor.methods({

  'createPlugin'(details, conditionalsString, conditionalNotes, action) {



    var ID = shortid.generate()

    var text = `

    const importFresh = require('import-fresh');
    const library = importFresh('../methods/library.js')
      
      function details() {

          return {
            id: "${ID}",
            Name: "${details.Name}",
            Type: "${details.Type}",
            Operation: "${details.Operation}",
            Description: "${details.Description}",
            Version: "",
            Link: ""
          }
        }



        function plugin(file) {
        
        
          //Must return this object at some point
        
          var response = {
        
             processFile : true,
             preset : '',
             container : '',
             handBrakeMode : false,
             FFmpegMode : true,
             reQueueAfter : true,
             infoLog : '',
        
          }

          response.infoLog += ${conditionalNotes}
        
          
          if(${conditionalsString}){

             
              response.preset = ${action.preset}
              response.container = ${action.container}
              response.handBrakeMode = ${action.handBrakeMode}
              response.FFmpegMode = ${action.FFmpegMode}

              response.reQueueAfter = true;
              response.processFile = ${action.processFile}
              response.infoLog +=  ${action.infoLog}
              return response
        
        
             }else{

              response.processFile = false;
              response.infoLog += ${action.infoLog}
              return response
        
        
             }
        }

module.exports.details = details;
module.exports.plugin = plugin;

      `
    fs.writeFileSync(process.env.homePath + `/Tdarr/Plugins/Local/${ID}.js`, text, 'utf8');


  }
});








