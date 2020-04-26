import { Meteor } from "meteor/meteor";
import { SettingsDB } from "./database.js";

Meteor.methods({
  remove() {
    Meteor.call("modifyFileDB", "removeAll", (error, result) => {});
    SettingsDB.remove({});
  },

  removelibrary(DB) {
    Meteor.call("modifyFileDB", "removeByDB", DB, (error, result) => {});
  },
});
