import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Button } from "react-bootstrap";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  patreon = () => {

    let patrons = [
      'Jeffrey',
      'Chris',
      'Jegler',
      'Lordbob75',
      'Vodka',
      'Ryan',
      'Slemons',
      'Stéphane',
      'Victor',
      'Peter',
      'Blackdixxa',
      'Zach',
      'Bryan',
      'Steven',
      'Simon',
      'binary',
      'Henrik',
      'Michael',
      'George'
    ]


    patrons = patrons.map(row => row + ', ')

    return <p>{patrons}</p>


  }

  render() {
    return (
      <div className='release-notes-latest'>
        <p>Special thanks to those supporting on Patreon: </p>{this.patreon()}
        <br />
        <br />
        <p>
          Beta v1.1093 release [8th August 2020]:
          <br />Health check option with nvdec
          <br />Some UI changes (Logout button, release notes, plugins, workers)
          <br />Tdarr pro notifier
        </p>
      </div>
    );
  }
}
