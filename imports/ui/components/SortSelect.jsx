import { SelectInput } from "./SelectInput";
import { GlobalSettingsDB } from "../../api/database.js";
import React from "react";

export class SortSelect extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      sortOptions: {
        sortDateOldest: "Oldest (Scanned):",
        sortDateNewest: "Newest (Scanned):",
        sortDateFileCreatedOldest: "Oldest (Created):",
        sortDateFileCreatedNewest: "Newest (Created):",
        sortDateFileModifiedOldest: "Oldest (Modified):",
        sortDateFileModifiedNewest: "Newest (Modified):",
        sortSizeSmallest: "Smallest:",
        sortSizeLargest: "Largest:"
      }
    }
  }
  
  setSort(event) {
    GlobalSettingsDB.upsert("globalsettings", {
      $set: {
        queueSortType: event.target.value
      }
    });
  }
  
  render() {
    return (
      <SelectInput
      items={this.state.sortOptions}
      onChangeHandler={this.setSort}
      className="queueSortSelect"
      />
      )
    }
  }
