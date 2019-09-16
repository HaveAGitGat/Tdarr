
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

        console.log("1")
        console.log(message)


    },

    'removelibrary'(DB) {


        FileDB.remove({ DB: DB });



    },
    'addVideoCodecExclude'(DB_id, ele) {


        SettingsDB.update({
            '_id': DB_id,


        }, {
                $addToSet: {
                    "decisionMaker.video_codec_names_exclude": {
                        _id:shortid.generate(),
                        codec: ele,
                        checked: false,
                    }
                }
            })



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


        SettingsDB.update({
            '_id': DB_id,


        }, {
                $addToSet: {
                    "decisionMaker.audio_codec_names_exclude": {
                        _id:shortid.generate(),
                        codec: ele,
                        checked: false,
                    }
                }
            })



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

    },'updateScheduleBlock'(DB_id, ele, status) {


        SettingsDB.update({
            "_id": DB_id,
            "schedule._id": ele
        }, {
                $set: { "schedule.$.checked": status }
            },
            false,
            true

        );
    },
});








