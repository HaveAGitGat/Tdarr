
import { Meteor } from 'meteor/meteor';

import { FileDB, SettingsDB } from '../api/tasks.js';



//Globals
var fs = require('fs');
var path = require('path');

const shortid = require('shortid');

Meteor.methods({



    'remove'() {


        FileDB.remove({});
        SettingsDB.remove({});


    },


    'consolelog'(message) {


        console.log(message)


    },

    'removelibrary'(DB) {


        FileDB.remove({ DB: DB });



    },



    'addPluginInclude'(DB_id, ele,source,index) {




        SettingsDB.update({
            '_id': DB_id,


        }, {
            $addToSet: {
                "pluginIDs": {
                    _id: ele,
                    checked: false,
                    source:source,
                    priority:index,
                }
            }
        })



    },

    'updatePluginInclude'(DB_id, ele, status) {




        SettingsDB.update({
            "_id": DB_id,
            "pluginIDs._id": ele
        }, {
            $set: { "pluginIDs.$.checked": status }
        },
            false,
            true

        );
    },
    'removePluginInclude'(DB_id, ele) {

        SettingsDB.update(
            { "_id": DB_id },
            { $pull: { 'pluginIDs': { _id: ele } } }
        );

    },








    'addVideoCodecExclude'(DB_id, ele) {

        var settings = SettingsDB.find({}, { sort: { priority: 1 } }).fetch()

        for(var i = 0; i < settings.length ; i++){

            if(settings[i].decisionMaker.video_codec_names_exclude.filter(row => row.codec === ele).length == 0){

                SettingsDB.update({
                    '_id': settings[i]._id,
        
        
                }, {
                    $addToSet: {
                        "decisionMaker.video_codec_names_exclude": {
                            _id: shortid.generate(),
                            codec: ele,
                            checked: false,
                        }
                    }
                })


            }

        }






    },

    'updateVideoCodecExclude'(DB_id, ele, status) {




        SettingsDB.update({
            "_id": DB_id,
            "decisionMaker.video_codec_names_exclude.codec": ele
        }, {
            $set: { "decisionMaker.video_codec_names_exclude.$.checked": status }
        },
            false,
            true

        );
    },
    'removeVideoCodecExclude'(DB_id, ele) {

        SettingsDB.update(
            { "_id": DB_id },
            { $pull: { 'decisionMaker.video_codec_names_exclude': { codec: ele } } }
        );

    },
    'addAudioCodecExclude'(DB_id, ele) {

        var settings = SettingsDB.find({}, { sort: { priority: 1 } }).fetch()

        for(var i = 0; i < settings.length ; i++){

            if(settings[i].decisionMaker.audio_codec_names_exclude.filter(row => row.codec === ele).length == 0){

                SettingsDB.update({
                    '_id': settings[i]._id,
        
        
                }, {
                    $addToSet: {
                        "decisionMaker.audio_codec_names_exclude": {
                            _id: shortid.generate(),
                            codec: ele,
                            checked: false,
                        }
                    }
                })


            }

        }

    },

    'updateAudioCodecExclude'(DB_id, ele, status) {


        SettingsDB.update({
            "_id": DB_id,
            "decisionMaker.audio_codec_names_exclude.codec": ele
        }, {
            $set: { "decisionMaker.audio_codec_names_exclude.$.checked": status }
        },
            false,
            true

        );
    },
    'removeAudioCodecExclude'(DB_id, ele) {

        SettingsDB.update(
            { "_id": DB_id },
            { $pull: { 'decisionMaker.audio_codec_names_exclude': { codec: ele } } }
        );

    }, 'updateScheduleBlock'(DB_id, ele, status) {


        SettingsDB.update({
            "_id": DB_id,
            "schedule._id": ele
        }, {
            $set: { "schedule.$.checked": status }
        },
            false,
            true

        );
    }, 'toggleSchedule'(DB_id, status, start, end, type) {


        var chxBoxes = SettingsDB.find({ _id: DB_id }, {}).fetch()
        chxBoxes = chxBoxes[0].schedule

        var status = true

        if (type == "Hour") {

            for (var i = start; i < chxBoxes.length; i += end) {

                if(chxBoxes[i].checked == true){
                        status = false
                }
            }


            for (var i = start; i < chxBoxes.length; i += end) {

                SettingsDB.update({
                    "_id": DB_id,
                    "schedule._id": chxBoxes[i]._id
                }, {
                    $set: { "schedule.$.checked": status }
                },
                    false,
                    true

                );

            }


        } else {

            for (var i = start; i < end; i++) {

                if(chxBoxes[i].checked == true){
                    status = false
            }

            }

            for (var i = start; i < end; i++) {

                SettingsDB.update({
                    "_id": DB_id,
                    "schedule._id": chxBoxes[i]._id
                }, {
                    $set: { "schedule.$.checked": status }
                },
                    false,
                    true

                );

            }


        }


    }

});








