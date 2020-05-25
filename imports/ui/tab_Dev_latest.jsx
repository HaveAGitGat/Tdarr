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
          Beta v1.1091 release [24th May 2020]:
          <br />
          <br />
          All containers are now the same (tdarr, tdarr_aio, tdarr_aio:qsv) and are based on the tdarr_aio:qsv container which
          supports NVENC and QSV hardware transcoding.
          <br />
          <br />
          tdarr_aio and tdarr_aio:qsv users, you can continue using those containers as normal and will receive updates. You don't need to do anything.
          <br />
          <br />
          Users who were previously using the tdarr container will need to set up the container again and restore from a backup.
          There is now no need for a separate MongoDB container. Please see the following for help:
          <br />
          http://tdarr.io/tools
          <br />
          https://github.com/HaveAGitGat/Tdarr/wiki/2---Installation
          <br />
        </p>
      </div>
    );
  }
}
