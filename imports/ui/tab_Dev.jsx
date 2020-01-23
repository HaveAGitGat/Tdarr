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

        <br/><br/>

        <div className="libraryContainer">

          <center>

            <p align="center">

              <img src="/images/icon_dark.png" />

            </p>

            <header>
              <h1>Welcome to Tdarr Beta</h1>
            </header>

          </center>


          <p></p>
          <p></p>
          <p></p>


          <center>




            <div className="introText">
              <p>Make sure to use the <Button variant="outline-light"><span className="buttonTextSize">i</span></Button> buttons on each tab to learn more about how Tdarr operates.</p>
            </div>

            <p></p>
            <p></p>
            <p></p>

            <p align="center">
              <img src="/images/example_file_replacement.png" height="300" />
            </p>

            <p></p>
            <p></p>
            <p></p>

            <div className="introText">
              <p>Tdarr is very much still in development. There's chance something may
        go wrong between version updates due to changing the way features work and how data is stored/manipulated.</p>




              <p>If things aren't working as expected, please try restoring from a backup. Else it may be necessary to clear the database using the following button. Your files will not be affected. Please restart Tdarr after doing so.</p>

              <center>
                <Button variant="outline-danger" onClick={() => this.clearDB()} ><span className="buttonTextSize">Clear database</span></Button>
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
              <p>@jonocairns for development help.</p>
              <p></p>
              <p></p>

              <p>Change log</p>

              <p>Beta v1.102 release [18th Jan 2020]:
            
            <br />Changes:

            <br />-[New] Plugin creator option (Filter by age) - select 'Date created' or 'Date modified' 
            <br />-[New] Plugin creator option (Filter by age) - include files OLDER than specified time
            <br />-[New] Options to sort queue by date (Scanned, Created, Modified)
            <br />-[Fix] Audio file codec not showing in search results
            <br />-[Fix] MJPEG video incorrectly tagged as audio file
            <br />-[Fix] Default plugin priority
            <br />-[Fix] 'Too many packets buffered for output stream' when health checking
            <br />-[Fix] Folder path placeholder text

            <br />
            <br />

            </p>

              <p>Beta v1.101 release [6th Dec 19]:
            
            <br />Changes:

            <br />-[New] Force processing of files
            <br />-[New] Action: HandBrake basic options
            <br />-[New] Action: Add one audio stream
            <br />-[New] Action: Keep one audio stream
            <br />-[New] Action: Standardise audio stream codecs 
            <br />-[New] Channel count now shown in streams table
            <br />-[Fix] Rare search result bug (no results shown)
            <br />-[Fix] Audio files with cover art being detected as video

            <br />
            <br />

            </p>

             <p>Alpha v1.008 release [1st Dec 19]:
            
            <br />Changes:

            <br />-[New] Plugin creator UI and groundwork for future Filters and Actions. Filters now encapsulate Action taken. No separate Filter needed
            <br />-[New] Re-order streams plugin added by default for new libraries
            <br />-[New] Backup and restore feature (scheduled midnight backup)
            <br />-[New] Toggle copying to output folder if file already meets conditions
            <br />-[Improvement] Change to how plugins are imported. Built-in NodeJS modules can now be used when creating plugins. (Can use e.g. require('fs') etc)
            <br />-[Improvement] Idle CPU usage drastically reduced
            <br />-[Improvement] Various stability fixes
            <br />-[Improvement] Confirmation needed when restoring from backup
            <br />-[Fix] Video resolution boundaries improved
            <br />-[Fix] Non existent files + junk removed when running Find-New scan
            <br />-[Fix] Corrected error when creating remux container plugin
            <br />-[Fix] If one plugin has an error, the rest will still load
            <br />-[Fix] Auto cache cleaner disabled due to issues on some systems
            <br />-[Fix] Move item to Transcode:Error instead of Transcode:Not required if error with plugin
            <br />
            <br />

            </p>


              <p>Alpha v1.007 release [22nd Nov 19]:
            
            <br />Changes:

            <br />-[New] Option to enable Linux FFmpeg NVENC binary (3.4.5 for unRAID compatibility)
            <br />-[New] Option to ignore source sub-folders
            <br />-[New] Skip health check button
            <br />-[New] Option to change visible queue length
            <br />-[New] Option to duplicate library
            <br />-[New] Customise search result columns
            <br />-[New] UI improvements (@jono)
            <br />-[New] Option to delete source file when using folder to folder conversion.
            <br />-[New] Community plugins (Remove commentary tracks etc)
            <br />-[New] Option to delete local plugins
            <br />-[New] Auto clean cache folder + preventing non-Tdarr cache files being deleted in case of incorrect mapping.
            <br />-[Fix] Reset processing status of all files on startup so no files stuck in limbo
            <br />-[Fix] Transcode pie showing incorrect data
            <br />-[Fix] Folder watcher will now wait longer to detect if a new file has finished copying
            <br />-[Fix] Folder to folder conversion: Files which already meet requirements will be copied to output folder
            <br />-[Fix] Folder to folder conversion: Cache/Output folder bug
            <br />-[Fix] Default containers to scan for now include ts/m2ts 
            <br />-[Fix] Keep all stream types when using remux plugin creator
            <br />-[Fix] Prevent too many workers occassionally starting
            <br />-[Fix] Newly transcoded files will be bumped correctly to top of queue when sorting by size
            <br />-[Fix] Closed caption scanning now much faster & accurate (even on empty captions)
            <br />-[Fix] Plugin creator plugin path error
            <br />-[Fix] Health check error when using FFmpeg hardware transcoding


            <br />
            <br />

            </p>


              <p>Alpha v1.006 release [9th Nov 19]:
            
            <br />Changes:

            <br />-[New] NVENC for FFmpeg enabled (linux + tdarr_aio)
            <br />-[New] Per library stat breakdown
            <br />-[New] Plugin creator 
            <br />-[New] Plugin creator option - Filter by codec
            <br />-[New] Plugin creator option - Filter by date
            <br />-[New] Plugin creator option - Filter by medium
            <br />-[New] Plugin creator option - Filter by size
            <br />-[New] Plugin creator option - Filter by resolution
            <br />-[New] Plugin creator option - Transcode
            <br />-[New] Plugin creator option - Remux container
            <br />-[New] Option to detect closed captions (linux + tdarr_aio + windows)
            <br />-[New] Community plugin - remove closed captions
            <br />-[New] Configurable plugin stack (mix local and community plugins, re-order etc)
            <br />-[New] Folder to folder conversion (feedback needed, test first)
            <br />-[New] Skip transcoding button
            <br />-[New] Options tab - set base URL
            <br />-[New] Remove item from library button
            <br />-[New] Exclude codec whitelist/blacklist
            <br />-[New] Navgiation bar UI
            <br />-[New] Queue library alternation option
            <br />-[Fix] 'Re-queue' buttons on 'Tdarr' tab
            <br />-[Fix] Prevent find-new/fresh scans occuring on a library at the same time. Hourly find-new scan re-enabled for libraries with folder watch ON.
            <br />-[Fix] Library prioritisation sort
            <br />-[Fix] Reduced search result number for quicker render
            <br />+ UI changes
            </p>

            <br />
            <br />

              <p>Alpha v1.005 release [1st Nov 19]:
  <br />Changes:
  <br />-[New] UI overhaul (Dark theme)
  <br />-[New] Hardware transcoding using tdarr_aio container + HandBrake
  <br />-[New] Improved bump-file system
  <br />-[New] Improved plugin/transcode formatting
  <br />-[New] File history
  <br />-[New] Search tab shows queue position, streams, file history + more
  <br />-[New] Sort and filter search results
  <br />-[New] Prioritise libraries
  <br />-[New] Sort queues by size/date created
  <br />-[New] Full file path shown on workers
  <br />-[New] Total file count shown when files being scanned/processed
  <br />-[New] Search local plugins
  <br />-[New] Set base URL with env variable
  <br />-[New] Requeue-all buttons added to Tdarr tab
  <br />-[Fix] Library requeue buttons requeue only specified library
  <br />-[Fix] Ubuntu container permissions
  <br />-[Fix] File scanner logs
  <br />-[Fix] Video height boundaries reduced for 720p,180p etc
  <br />-[Fix] Bigger font through-out
              
              
  <br />
                <br />
                <br />


              </p>


              <p>Alpha v1.004 release [23rd Oct 19]:
  <br />Changes:
  <br />-Scan on start switch added
  <br />-Prevent Tdarr temp output files mistakenly being scanned
  <br />-Docker memory fix for large libraries (30,000+ files)
  <br />-Improved garbage collection
  <br />-Temp scanner data written inside container (Should fix permission issues with host)
  <br />-tdarr_aio (All-in-one) Ubuntu container now available with MongoDB inside container.
  <br />
                
              </p>

              <br />
                <br />



              <p>Alpha v1.003 release [10th Oct 19]:
  <br />Changes:
  <br />-Workers now show more detailed information: ETA, CLI type, preset, process reasons, start time, duration and original file size.
  <br />-Help links updated
  <br />-Improvements to FFmpeg percentages
  <br />-Switch to turn processing of a library On/Off
  <br />-Can now click on Pie-chart segments to see files in those segments
  <br />-'Not attempted' items renamed to 'Queued'. 'Transcode:Passed' items renamed to 'Transcode:Not required'
  <br />-Status tables have been put into tabs. Each tab shows the number of related items on it (e.g. No. items in queue.) Additional information added to items (codec,resolution etc)
  <br />-Date time stamp now shown on processed items. Old/New size now shown for transcode items.
  <br />-HandBrake and FFmpeg terminal implemented on the 'Help' tab. This is mainly so you can see documentation such as what encoder types are enabled etc but any HandBrake/FFmpeg commands can be put into the terminal.
  <br />-Create a sample button added to items in Search results. Clicking the button will create a 30 second sample of the selected file and output it in the new 'Samples' folder in the Tdarr data folder. Use the sample to test plugins/transcode settings and to help when reporting bugs.
  <br />-Additional schedule buttons added so you can bulk change daily hour slots.
  <br />-Reduced 720p boundaries so now 960*720 video files will show up in the 720p category instead of just 1280*720 files.
  <br />
                <br />
                <br />
              </p>




            </div>


          </center>




        </div>



      </div>

    );
  }
}

