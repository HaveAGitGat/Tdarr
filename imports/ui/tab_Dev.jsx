import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';









export default class App extends Component {

  constructor(props) {
    super(props);

  }

  clearDB = () => {


    if (confirm('Are you sure you want to delete the Tdarr database? Your files will not be affected.')) {

      Meteor.call('clearDB', (error, result) => {



        alert('Cleared! Please restart Tdarr.')


      });


    }
  }




  render() {



    return (



      <div className="containerGeneral">

        <center>

          <p align="center">
            <img src="https://i.imgur.com/M0ikBYL.png" />
          </p>

          <header>
            <h1>Welcome to Tdarr Alpha</h1>
          </header>

        </center>

        <p></p>
        <p></p>
        <p></p>


        <center>




          <div className="introText">
            <p>Make sure to use the <Button variant="outline-dark">i</Button> buttons on each tab to learn more about how Tdarr operates.</p>
          </div>

          <p></p>
          <p></p>
          <p></p>

          <p align="center">
            <img src="https://i.imgur.com/wRV6tBJ.png" height="300" />
          </p>

          <p></p>
          <p></p>
          <p></p>

          <div className="introText">
            <p>Tdarr is very much still in development. There's chance something may
        go wrong between version updates due to changing the way features work and how data is stored/manipulated.</p>




            <p>If things aren't working as expected, it may be necessary to clear the database using the following button. Your files will not be affected. Please restart Tdarr after doing so.</p>

            <center>
            <Button variant="outline-danger" onClick={() => this.clearDB()} >Clear database</Button>
            </center>
            <p></p>
            <p></p>
            <p></p>
            <p>Credits:</p>

            <p></p>
            <p>@Roxedus for a slimline container.</p>
            <p></p>
            <p>@GilbN and @Drawmonster for support and debugging.</p>

            <p></p>
            <p></p>
            <p></p>

            <p>Change log</p>


<p>v1.004 release [23rd Oct 19]:
  <br/>No breaking changes.
  <br/>Changes:
  <br/>-Scan on start switch added
  <br/>-Prevent Tdarr temp output files mistakenly being scanned
  <br/>-Docker memory fix for large libraries (30,000+ files)
  <br/>-Improved garbage collection
  <br/>-Temp scanner data written inside container (Should fix permission issues with host)
  <br/>-tdarr_aio (All-in-one) Ubuntu container now available with MongoDB inside container.
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  </p>
            <p>v1.003 release [10th Oct 19]:
  <br/>No breaking changes.
  <br/>Changes:
  <br/>-Workers now show more detailed information: ETA, CLI type, preset, process reasons, start time, duration and original file size.
  <br/>-Help links updated
  <br/>-Improvements to FFmpeg percentages
  <br/>-Switch to turn processing of a library On/Off
  <br/>-Can now click on Pie-chart segments to see files in those segments
  <br/>-'Not attempted' items renamed to 'Queued'. 'Transcode:Passed' items renamed to 'Transcode:Not required'
  <br/>-Status tables have been put into tabs. Each tab shows the number of related items on it (e.g. No. items in queue.) Additional information added to items (codec,resolution etc)
  <br/>-Date time stamp now shown on processed items. Old/New size now shown for transcode items.
  <br/>-HandBrake and FFmpeg terminal implemented on the 'Help' tab. This is mainly so you can see documentation such as what encoder types are enabled etc but any HandBrake/FFmpeg commands can be put into the terminal.
  <br/>-Create a sample button added to items in Search results. Clicking the button will create a 30 second sample of the selected file and output it in the new 'Samples' folder in the Tdarr data folder. Use the sample to test plugins/transcode settings and to help when reporting bugs.
  <br/>-Additional schedule buttons added so you can bulk change daily hour slots.
  <br/>-Reduced 720p boundaries so now 960*720 video files will show up in the 720p category instead of just 1280*720 files.
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
</p>




          </div>


        </center>







      </div>

    );
  }
}

