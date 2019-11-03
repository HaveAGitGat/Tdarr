import {Meteor} from 'meteor/meteor';

import {LogDB} from '../api/tasks.js';

const shortid = require('shortid');

Meteor.methods({
  logthis(text) {
    var id = shortid.generate();
    LogDB.upsert(id, {
      $set: {
        _id: id,
        text: text,
        createdAt: new Date(),
      },
    });
  },
});
