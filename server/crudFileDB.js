
import {FileDB} from "../imports/api/database.js";


Meteor.methods({
    modifyFileDB(mode, fileID, obj) {
      //mode == add, update, delete
      try {
        if (mode == "insert") {
          FileDB.insert(obj);
        } else if (mode == "update") {
          FileDB.update(fileID, {
            $set: obj,
          });
        }
        if (mode == "upsert") {
          FileDB.upsert(fileID, {
            $set: obj,
          });
        } else if (mode == "removeOne") {
          FileDB.remove(fileID);
        } else if (mode == "removeByDB") {
          FileDB.remove({ DB: fileID });
        } else if (mode == "removeAll") {
          FileDB.remove({});
        }
      } catch (err) {
        logger.error(err.stack);
      }
      Meteor.call("DBHasChanged", (error, result) => { });
    },
  });