import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { FileDB } from "../api/tasks.js";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastUpdate: 0,
      showButton: true,
    };
  }

  componentDidMount() {
    // this.getDBStatus()
  }

  getDBStatus = () => {
    Meteor.subscribe("FileDB", () => {
      var file = FileDB.find({ _id: this.props.file._id }).fetch()[0];

      if (this.props.time >= file.lastUpdate) {
        this.setState({
          showButton: true,
        });
      } else {
        this.setState({
          showButton: false,
        });
      }
    });
  };

  triggerLoadState = () => {
    var tempObj = {
      lastUpdate: new Date(),
    };
    Meteor.call(
      "modifyFileDB",
      "update",
      this.props.file.file,
      tempObj,
      (error, result) => {}
    );
    this.setState({
      lastUpdate: new Date().getTime(),
    });
    // setTimeout(this.reset, 1000);
  };

  // reset = () => {
  //   this.setState({
  //     lastUpdate:0,
  //   })

  // }

  render() {
    var serverTime = this.props.time;

    //dates are stringified when backup created:
    try {
      var lastUpdate = this.props.file.lastUpdate
        ? new Date(this.props.file.lastUpdate).getTime()
        : 0;
    } catch (err) {
      var lastUpdate = 0;
    }

    if (this.props.type == "updateDBAction") {
      return (
        <div>
          {this.props.time >= this.state.lastUpdate ? (
            <Button
              variant="outline-light"
              onClick={() => {
                this.triggerLoadState();
                Meteor.call(
                  "modifyFileDB",
                  "update",
                  this.props.file.file,
                  this.props.obj,
                  (error, result) => {}
                );
              }}
            >
              <span className="buttonTextSize">{this.props.symbol}</span>
            </Button>
          ) : (
            <ClipLoader
              sizeUnit={"px"}
              size={25}
              color={"white"}
              loading={true}
            />
          )}
        </div>
      );
    }

    if (this.props.type == "createSample") {
      return (
        <div>
          {true ? (
            <Button
              variant="outline-light"
              onClick={() => {
                this.triggerLoadState();
                Meteor.call(
                  "createSample",
                  this.props.file.file,
                  (error, result) => {
                    alert("Sample created for " + this.props.file.file);
                  }
                );
              }}
            >
              <span className="buttonTextSize">{this.props.symbol}</span>
            </Button>
          ) : (
            <ClipLoader
              sizeUnit={"px"}
              size={25}
              color={"white"}
              loading={true}
            />
          )}
        </div>
      );
    }

    if (this.props.type == "removeFile") {
      return (
        <div>
          {true ? (
            <Button
              variant="outline-light"
              onClick={() => {
                this.triggerLoadState();
                Meteor.call(
                  "modifyFileDB",
                  "removeOne",
                  this.props.file._id,
                  (error, result) => {}
                );
              }}
            >
              <span className="buttonTextSize">{this.props.symbol}</span>
            </Button>
          ) : (
            <ClipLoader
              sizeUnit={"px"}
              size={25}
              color={"white"}
              loading={true}
            />
          )}
        </div>
      );
    }

    if (this.props.type == "reScan") {
      return (
        <div>
          {true ? (
            <Button
              variant="outline-light"
              onClick={() => {
                this.triggerLoadState();
                Meteor.call(
                  "modifyFileDB",
                  "removeOne",
                  this.props.file._id,
                  (error, result) => {}
                );
                var obj = {
                  HealthCheck: "Queued",
                  TranscodeDecisionMaker: "Queued",
                  cliLog: "",
                  bumped: false,
                  history: "",
                };
                Meteor.call(
                  "scanFiles",
                  this.props.file.DB,
                  [this.props.file._id],
                  0,
                  3,
                  obj,
                  function (error, result) {}
                );
              }}
            >
              <span className="buttonTextSize">{this.props.symbol}</span>
            </Button>
          ) : (
            <ClipLoader
              sizeUnit={"px"}
              size={25}
              color={"white"}
              loading={true}
            />
          )}
        </div>
      );
    }
  }
}
