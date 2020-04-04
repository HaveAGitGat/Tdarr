import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';




export default class App extends Component {

  constructor(props) {
    super(props);

  }






  render() {



    return (




      <div>

          <p> Beta v1.107 release [4th April 2020]:
            
            <br />Changes:

            <br />-[New] Small UI changes and help info updates
            <br />-[New] Folder watch: Option to use file system events (FSE) instead of polling (try if polling causes high CPU). FSE may not work with all drives/shares.
            <br />-[New] HandBrake and FFmpeg binary paths passed to plugins
            <br />-[Improvement] Error shown if problem with reading plugin
            <br />-[Improvement] New files appended with '.partial' while copying to source to prevent app/services scanning temp file
            <br />-[Improvement] Logs saved to txt file (inside Tdarr/Logs) instead of DB
            <br />-[Fix] Detect if files are replaced with file of same file name+extension
            <br />-[Fix] Limit transcode error logs to 200 lines (Sometimes 70,000+ lines which causes DB issues)
            <br />-[Fix] Info log added for post-processing plugins
            <br />-[Fix] Prevent corrupt item causing whole backup restore process to stop
            <br />
            <br />

            </p>


      </div>

    );
  }
}

