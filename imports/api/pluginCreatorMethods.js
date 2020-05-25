import { Meteor } from "meteor/meteor";
import homePath from "../../server//paths.js";

//Globals
const shortid = require("shortid");
const fs = require("fs");
const path = require("path");

Meteor.methods({
  createPlugin(details, conditionalsString, conditionalNotes, action) {
    var ID = shortid.generate();
    var text = `

    var fs = require('fs');
    var path = require('path');
    if (fs.existsSync(path.join(process.cwd() , '/npm'))) {
    var rootModules = path.join(process.cwd() , '/npm/node_modules/')
    } else{
    var rootModules = ''
    }
   
    const importFresh = require(rootModules+'import-fresh');
    const library = importFresh('../methods/library.js')
      
    module.exports.details = function details() {
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

    module.exports.plugin = function plugin(file) {

          //Must return this object at some point
          var response = {
             processFile : false,
             preset : '',
             container : '.mkv',
             handBrakeMode : false,
             FFmpegMode : true,
             reQueueAfter : true,
             infoLog : '',
        
          }

          response.infoLog += ${conditionalNotes}
        
          if((${conditionalsString}) || file.forceProcessing === true){
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

      `;
    fs.writeFileSync(
      homePath + `/Tdarr/Plugins/Local/${ID}.js`,
      text,
      "utf8"
    );
  },
});
