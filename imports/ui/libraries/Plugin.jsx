import React, { Component } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { Button } from "react-bootstrap";
import Modal from "reactjs-popup";

import { SettingsDB } from "../../api/database.js";

export default class Plugin extends Component {
  constructor(props) {
    super(props);

    this.toggleChecked = this.toggleChecked.bind(this);
    this.deleteThisPlugin = this.deleteThisPlugin.bind(this);
  }

  toggleChecked(event) {
    Meteor.call(
      "updatePluginInclude",
      this.props.DB_id,
      this.props.pluginItem._id,
      event.target.checked,
      function (error, result) {}
    );
  }

  deleteThisPlugin() {
    var thisLibraryPlugins = SettingsDB.find(
      { _id: this.props.DB_id },
      { sort: { createdAt: 1 } }
    ).fetch()[0].pluginIDs;

    for (var i = 0; i < thisLibraryPlugins.length; i++) {
      if (thisLibraryPlugins[i].priority > this.props.pluginItem.priority) {
        thisLibraryPlugins[i].priority = thisLibraryPlugins[i].priority - 1;
      }
    }

    SettingsDB.upsert(this.props.DB_id, {
      $set: {
        pluginIDs: thisLibraryPlugins,
      },
    });

    Meteor.call(
      "removePluginInclude",
      this.props.DB_id,
      this.props.pluginItem._id,
      function (error, result) {}
    );
  }

  renderInputs = (inputs) => {
    var desc = inputs.map((row) => {
      var tooltip = row.tooltip.split("\\n");

      for (var i = 0; i < tooltip.length; i++) {
        var current = i;

        if (tooltip[i].includes("Example:") && i + 1 < tooltip.length) {
          tooltip[i + 1] = (
            <div className="toolTipHighlight">
              <p>{tooltip[i + 1]}</p>
            </div>
          );
          i++;
        }

        tooltip[current] = <p>{tooltip[current]}</p>;
      }

      return (
        <div>
          <Modal
            trigger={
              <Button variant="outline-light">
                <span className="buttonTextSize">i</span>
              </Button>
            }
            modal
            closeOnDocumentClick
          >
            <div className="modalContainer">
              <div className="frame">
                <div className="scroll">
                  <div className="modalText">
                    <p>Usage:</p>
                    <p></p>
                    <p></p>
                    {tooltip}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <span>
            <p>{row.name}:</p>
            <input
              type="text"
              defaultValue={
                this.props.pluginItem.InputsDB &&
                this.props.pluginItem.InputsDB[row.name] != undefined
                  ? this.props.pluginItem.InputsDB[row.name]
                  : ""
              }
              name={row.name}
              onChange={this.saveInput}
            ></input>
          </span>
        </div>
      );
    });

    return desc;
  };

  saveInput = (event) => {
    const { name, value } = event.target;

    var thisLibraryPlugins = SettingsDB.find(
      { _id: this.props.DB_id },
      { sort: { createdAt: 1 } }
    ).fetch()[0].pluginIDs;

    if (
      thisLibraryPlugins[this.props.pluginItem.priority].InputsDB == undefined
    ) {
      thisLibraryPlugins[this.props.pluginItem.priority].InputsDB = {};
    }
    thisLibraryPlugins[this.props.pluginItem.priority].InputsDB[name] = value;

    SettingsDB.upsert(this.props.DB_id, {
      $set: {
        pluginIDs: thisLibraryPlugins,
      },
    });
  };

  render() {
    var stack = [
      <div className="pluginStackCol1">
        <span className="buttonTextSize">
          {this.props.pluginItem.source != undefined
            ? this.props.pluginItem.source
            : "-"}
        </span>
      </div>,
      <div className="pluginStackCol1">
        <Checkbox
          checked={!!this.props.pluginItem.checked}
          onChange={this.toggleChecked}
        />
      </div>,
      <div className="pluginStackCol1">
        <span className="buttonTextSize">
          {this.props.pluginItem._id} <br />
          {this.props.pluginItem.Name != undefined
            ? this.props.pluginItem.Name
            : "-"}
        </span>
      </div>,
      <div className="pluginStackCol1">
        <span className="buttonTextSize">
          {this.props.pluginItem.Stage == "Pre-processing"
            ? "Pre"
            : this.props.pluginItem.Stage == "Post-processing"
            ? "Post"
            : ""}
        </span>
      </div>,
      <div className="pluginStackCol1">
        <span className="buttonTextSize">{this.props.pluginItem.Type}</span>
      </div>,
      <div className="pluginStackCol1">
        <span className="buttonTextSize">
          {this.props.pluginItem.Operation != undefined
            ? this.props.pluginItem.Operation
            : "-"}
        </span>
      </div>,
      <div className="pluginStackCol1">
        <span className="buttonTextSize">
          {this.props.pluginItem.Description != undefined
            ? this.props.pluginItem.Description
            : "-"}
        </span>
      </div>,
      <div className="pluginStackCol1">
        <span className="buttonTextSize">
          {this.props.pluginItem.Inputs != undefined
            ? this.renderInputs(this.props.pluginItem.Inputs)
            : "-"}
        </span>
      </div>,
      <div className="pluginStackCol1">
        <div className="priorityButtonsGrid">
          <div>
            <Button
              variant="outline-light"
              onClick={() => {
                var thisLibraryPlugins = SettingsDB.find(
                  { _id: this.props.DB_id },
                  { sort: { createdAt: 1 } }
                ).fetch()[0].pluginIDs;

                if (this.props.pluginItem.priority == 0) {
                } else {
                  var thisPlugin =
                    thisLibraryPlugins[this.props.pluginItem.priority];
                  thisPlugin.priority = thisPlugin.priority - 1;
                  var pluginBelow =
                    thisLibraryPlugins[this.props.pluginItem.priority - 1];
                  pluginBelow.priority = pluginBelow.priority + 1;

                  thisLibraryPlugins.splice(
                    this.props.pluginItem.priority - 1,
                    2,
                    thisPlugin,
                    pluginBelow
                  );

                  SettingsDB.upsert(this.props.DB_id, {
                    $set: {
                      pluginIDs: thisLibraryPlugins,
                    },
                  });
                }
              }}
            >
              <span className="buttonTextSize">↑</span>
            </Button>
          </div>
          <div>
            <span className="buttonTextSize">
              {"\u00A0"}
              {"\u00A0"}
              {this.props.pluginItem.priority != undefined
                ? this.props.pluginItem.priority + 1
                : "-"}{" "}
              {"\u00A0"}
              {"\u00A0"}
            </span>
          </div>
          <div>
            <Button
              variant="outline-light"
              onClick={() => {
                var thisLibraryPlugins = SettingsDB.find(
                  { _id: this.props.DB_id },
                  { sort: { createdAt: 1 } }
                ).fetch()[0].pluginIDs;

                if (
                  this.props.pluginItem.priority ==
                  thisLibraryPlugins.length - 1
                ) {
                } else {
                  var thisPlugin =
                    thisLibraryPlugins[this.props.pluginItem.priority];
                  thisPlugin.priority = thisPlugin.priority + 1;
                  var pluginAbove =
                    thisLibraryPlugins[this.props.pluginItem.priority + 1];
                  pluginAbove.priority = pluginAbove.priority - 1;

                  thisLibraryPlugins.splice(
                    this.props.pluginItem.priority,
                    2,
                    pluginAbove,
                    thisPlugin
                  );

                  SettingsDB.upsert(this.props.DB_id, {
                    $set: {
                      pluginIDs: thisLibraryPlugins,
                    },
                  });
                }
              }}
            >
              <span className="buttonTextSize">↓</span>
            </Button>
          </div>
        </div>
      </div>,
      <div className="pluginStackCol1">
        <button
          className="deleteCodecButton"
          onClick={this.deleteThisPlugin.bind(this)}
        >
          &times;
        </button>
      </div>,
    ];
    return stack;
  }
}

var noBreak = {
  display: "inline-block",
};
