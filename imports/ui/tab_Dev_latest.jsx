import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Button } from "react-bootstrap";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>
          Beta v1.110 release [25th June 2020]:
          <br />
          Changes:
          <br />
          [NEW] updated meteor to 1.10.2 (Node 12.x)
          <br />
          [NEW] removed non GPL compliant binary files
          <br />
          [NEW] massive docker image update (compiling ffmpeg & supporting libvmaf)
          <br />
          [NEW] added new environmental variables for paths of ccextractor, HandBrakeCLI and ffmpeg
          <br />
          <br />
        </p>
      </div>
    );
  }
}
