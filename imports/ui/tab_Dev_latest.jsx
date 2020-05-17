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

          IMPORTANT:
          <br />
          On Sunday 24th May 2020 the 'tdarr' container will be replaced with the 'tdarr_aio' container as the
          tdarr container does not provide much benefit but makes things increasingly difficult as Tdarr
          development progresses. It's also confusing for new users to have a selection of containers.
          <br />
          After 24th May 2020, both the tdarr and tdarr_aio containers will be the SAME but all documentation will direct new
          users to download the new 'tdarr' container. Existing tdarr_aio users can continue using that container (tdarr_aio) and will receive updates.
          <br />
          Current 'tdarr' container users will need to create a Tdarr backup (on the 'Backups' tab) and then restore the backup once they've set up the new 'tdarr'
          container on/after 24th May 2020.
          <br />
          <br />
          In summary:
          <br />
          Pre 24th May 2020:
          <br />
          tdarr - Alpine image with MongoDB needed separately
          <br />
          tdarr_aio - all-in-one Ubuntu image with MongoDB inside and hardware transcoding
          <br />
          <br />
          Post 24th May 2020:
          <br />
          tdarr - all-in-one Ubuntu image with MongoDB inside and hardware transcoding
          <br />
          tdarr_aio - all-in-one Ubuntu image with MongoDB inside and hardware transcoding
          <br />
          <br />
          Please use the channels on the 'Help' tab if you have any questions



          <br />
          <br />
          {" "}
          Beta v1.109 release [17th May 2020]:
          <br />
          Changes:
          <br />
          -[New] Added health check and transcode cache description
          <br />
          -[New] More errors detected during thorough health check
          <br />
          -[New] Health check will be skipped if both options (Quick/Thorough) unchecked
          <br />
          -[New] Queue files for transcode even if they've failed reading with FFprobe
          <br />
          -[New] More comprehensive logging system
          <br />
          -[New] Clearer UI for how to edit library titles
          <br />
          -[New] Split FFmpeg input and output args with {'<io>'} to prevent issues when FFmpeg command contains commas
          <br />
          <br />
        </p>
      </div>
    );
  }
}
