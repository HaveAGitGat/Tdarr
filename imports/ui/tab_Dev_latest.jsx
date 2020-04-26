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
          {" "}
          Beta v1.108 release [18th April 2020]:
          <br />
          Changes:
          <br />
          -[New] Add default plugins to new libraries
          <br />
          -[Improvement] Check other properties to calculate bitrate
          <br />
          -[Improvement] Reduce worker spawn rate
          <br />
          -[Improvement] Change process priority from "Below normal" to "Low"
          when switch enabled (Win)
          <br />
          -[Fix] Prevent folder watcher re-adding already scanned files
          <br />
          <br />
        </p>
      </div>
    );
  }
}
