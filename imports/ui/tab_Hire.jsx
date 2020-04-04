import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';






export default class App extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {

  }


  render() {



    return (



      <div className="containerGeneral">
        <div className="tabWrap" >

 

            <center><h1>Hi!</h1></center>
            <br />

      <center>
            <div className="hireBody">

              <p>I'm looking to do some freelance work with regards to the following:</p>
              <br />

              <p>Custom versions, special/urgent requests or 1-to-1 help for my apps (below)</p>
              <p>Small/medium sized cross platform desktop applications</p>
              <p>Small/medium sized websites/web apps</p>
              <p>Tools, utilities or scripts</p>
              <p>Transcode related projects</p>
              <p>Remote junior/graduate role (or on-site in UK)</p>
              <p>Learning to code</p>


              <br />
              <p>$20/hr through Paypal. If you have any questions or know anyone looking for the above then please don't hesitate to contact me!</p>
              <br />

              <p>Contact: roystubbs.dev@gmail.com</p>
              <p>Website: <a href="https://roystubbs.dev">roystubbs.dev</a></p>


              <br />
              <p>Thanks, Roy</p>

              <br />
              <br />

              <p>My Apps:</p>
              <br />
              <a href="https://github.com/HaveAGitGat/HBBatchBeast">HBBatchBeast</a>
              <p>A free GUI application for HandBrake and FFmpeg/FFprobe on Windows, macOS and Linux (+ Linux Docker image) with
              an emphasis on multi HandBrake/FFmpeg instance batch conversion (including recursive folder scans and folder watching).
              The destination folder structure is kept the same as the source folder structure. Media in subfolders is also converted.
            Multiple folders can be monitored and different conversion presets can be specified for each folder.</p>

              <br />

              <a href="https://github.com/HaveAGitGat/HBBatchBeast">Tdarr</a>
              <p>Tdarr is a self hosted web-app for automating media library transcode/remux management and making sure your files
              are exactly how you need them to be in terms of codecs/streams/containers etc. Designed to work alongside Sonarr/Radarr
              and built with the aim of modularisation, parallelisation and scalability, each library you add has its own transcode
              settings, filters and schedule. Workers can be fired up and closed down as necessary, and are split into 3 types - 'general',
                'transcode' and 'health check'. Worker limits can be managed by the scheduler as well as manually.</p>

            </div>
            </center>

          </div>
        </div>
   
    );
  }
}
