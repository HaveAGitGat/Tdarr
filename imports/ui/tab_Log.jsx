import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import ToggleButton from "react-toggle-button";
import { Button } from "react-bootstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { render } from "react-dom";
import ClipLoader from "react-spinners/ClipLoader";

import { GlobalSettingsDB } from "../api/database.js";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  Brush,
} from "recharts";

var dateFormat = require("dateformat");

const borderRadiusStyle = { borderRadius: 2 };

var ButtonStyle = {
  display: "inline-block",
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  renderVerboseLogsButton() {
    return this.props.globalSettings.map((item, i) => (
      <ToggleButton
        thumbStyle={borderRadiusStyle}
        trackStyle={borderRadiusStyle}
        value={item.verboseLogs}
        style={ButtonStyle}
        onToggle={() => {
          GlobalSettingsDB.upsert("globalsettings", {
            $set: {
              verboseLogs: !item.verboseLogs,
            },
          });
        }}
      />
    ));
  }



  render() {
    return (
      <div className="containerGeneral">
        <div className="tabWrap">
          <center>
            <header>
              <h1>Logs</h1>
            </header>
          </center>

          <p></p>

          <div className="libraryContainer">
            <center>
              <p>
                Stored in:{" "}
                {this.props && this.props.globalSettings[0]
                  ? this.props.globalSettings[0].homePath.replace(/\\/g, "/")
                  : null}
                /Tdarr/Logs
              </p>
            </center>
            <center>
              <div style={ButtonStyle}>
                <p>Verbose logs (large size, debug only):</p>

                {this.renderVerboseLogsButton()}
              </div>
            </center>

            <p></p>
            <p></p>

            <p>
              <div id="rawLog"></div>
            </p>

            <div id="logDiv"></div>

            <div className="memGraph" id="memGraphDiv"></div>

            <div className="memGraph" id="sysmemGraphDiv"></div>

            <div className="memGraph" id="syscpuGraphDiv"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("GlobalSettingsDB");

  return {
    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),
  };
})(App);
