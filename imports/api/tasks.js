import { Mongo } from 'meteor/mongo';

export const FileDB = new Mongo.Collection('FileDB');
export const LogDB = new Mongo.Collection('logs');
export const SettingsDB = new Mongo.Collection('settings');
export const GlobalSettingsDB = new Mongo.Collection('globalsettings');
export const StatisticsDB = new Mongo.Collection('statistics');
export const ClientDB = new Mongo.Collection('clientDB');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('FileDB', function tasksPublication() {
    return FileDB.find();
  });
  Meteor.publish('LogDB', function tasksPublication() {
    return LogDB.find();
  });
  Meteor.publish('SettingsDB', function tasksPublication() {
    return SettingsDB.find();
  });
  Meteor.publish('GlobalSettingsDB', function tasksPublication() {
    return GlobalSettingsDB.find();
  });
  Meteor.publish('StatisticsDB', function tasksPublication() {
    return StatisticsDB.find();
  });
  Meteor.publish('ClientDB', function tasksPublication() {
    return ClientDB.find();
  });
}






