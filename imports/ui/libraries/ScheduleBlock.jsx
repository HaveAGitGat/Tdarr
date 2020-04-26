import React from "react";

const ScheduleBlock = ({ item, DB_id }) => {
  const toggleChecked = () => {
    Meteor.call("updateScheduleBlock", DB_id, item._id, !item.checked);
  };

  return (
    <span className="scheduleContainer-item d-flex align-items-center justify-content-center">
      <div className="custom-control custom-checkbox" onClick={toggleChecked}>
        <input
          type="checkbox"
          className="custom-control-input"
          checked={item.checked}
          readOnly
        />
        <label className="custom-control-label"></label>
      </div>
    </span>
  );
};

export default ScheduleBlock;
