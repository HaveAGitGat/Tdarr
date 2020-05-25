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
          Beta v1.1092 release [25th May 2020]:
          <br />
          <br />
          Small fix for local plugin creator (plugins not saving)
        </p>
      </div>
    );
  }
}
