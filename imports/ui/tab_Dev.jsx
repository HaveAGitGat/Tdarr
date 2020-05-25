import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Button } from "react-bootstrap";
import LatestDevNotes from "./tab_Dev_latest.jsx";
import LocalImage from "./Local_Image.jsx";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  clearDB = () => {
    if (
      confirm(
        "Are you sure you want to delete the Tdarr database? Your files will not be affected."
      )
    ) {
      Meteor.call("clearDB", (error, result) => {
        alert("Cleared! Please restart Tdarr.");
      });
    }
  };

  render() {
    return (
      <div className="containerGeneral">
        <div className="tabWrap">
          <center>
            <header>
              <h1>Welcome to Tdarr Beta</h1>
            </header>
          </center>{" "}
          <br />
          <div className="libraryContainer">
            <center>
              <LocalImage link="/images/icon_dark.png" />
            </center>
            <p></p>
            <p></p>
            <p></p>
            <center>
              <div className="introText">
                <p>
                  Make sure to use the{" "}
                  <Button variant="outline-light">
                    <span className="buttonTextSize">i</span>
                  </Button>{" "}
                  buttons on each tab to learn more about how Tdarr operates.
                </p>
              </div>
              <p></p>
              <p></p>
              <p></p>

              <LocalImage
                link="/images/example_file_replacement.png"
                height="300"
              />

              <p></p>
              <p></p>
              <p></p>
              <div className="introText">
                <p>
                  Tdarr is very much still in development. There's chance
                  something may go wrong between version updates due to changing
                  the way features work and how data is stored/manipulated.
                </p>
                <p>
                  If things aren't working as expected, please try restoring
                  from a backup. Else it may be necessary to clear the database
                  using the following button. Your files will not be affected.
                  Please restart Tdarr after doing so.
                </p>
                <Button variant="outline-danger" onClick={() => this.clearDB()}>
                  <span className="buttonTextSize">Clear database</span>
                </Button>
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
                <LatestDevNotes />
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
                <p>
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
                <p>
                  {" "}
                  Beta v1.107 release [4th April 2020]:
                  <br />
                  Changes:
                  <br />
                  -[New] tdarr_aio ffmpeg updated to 4.2.2 with libaom enabled
                  <br />
                  -[New] Small UI changes and help info updates
                  <br />
                  -[New] Folder watch: Option to use file system events (FSE)
                  instead of polling (try if polling causes high CPU/disk IO).
                  FSE may not work with all drives/shares.
                  <br />
                  -[New] HandBrake and FFmpeg binary paths passed to plugins
                  <br />
                  -[Improvement] Error shown if problem with reading plugin
                  <br />
                  -[Improvement] New files appended with '.partial' while
                  copying to source to prevent app/services scanning temp file
                  <br />
                  -[Improvement] Logs saved to txt file (inside Tdarr/Logs)
                  instead of DB
                  <br />
                  -[Fix] Detect if files are replaced with file of same file
                  name+extension
                  <br />
                  -[Fix] Limit transcode error logs to 200 lines (Sometimes
                  70,000+ lines which causes DB issues)
                  <br />
                  -[Fix] Info log added for post-processing plugins
                  <br />
                  -[Fix] Prevent corrupt item causing whole backup restore
                  process to stop
                  <br />
                  <br />
                </p>
                <p>
                  {" "}
                  Beta v1.106 release [20th March 2020]:
                  <br />
                  Changes:
                  <br />
                  -[New] Option to copy community plugins to local
                  <br />
                  -[New] Option to edit source code of local plugins
                  <br />
                  -[New] A simple daily scan will occur if 'Scan on start' is
                  enabled for library (prevents some disk IO issues some people
                  have with the folder watcher)
                  <br />
                  -[New] Option on 'Options' tab to change resolution boundaries
                  <br />
                  -[New] Option to reset all stats or individual library stats
                  <br />
                  -[Improvement] Tab state no longer saved for plugin, library
                  and library sub-section tabs
                  <br />
                  -[Fix] Text breaking in worker UI
                  <br />
                  -[Fix] Small CPU spikes when idle
                  <br />
                  -[Fix] Button error if restoring from backup
                  <br />
                  -[Fix] Delete local plugin button restored
                  <br />
                  <br />
                </p>
                <p>
                  Beta v1.105 release [20th Feb 2020]:
                  <br />
                  Changes:
                  <br />
                  -[New] Categorised plugin browser
                  <br />
                  -[New] Set backup limit (Options tab - default 30)
                  <br />
                  -[New] Alert on Tdarr tab if libraries unchecked/out of
                  schedule
                  <br />
                  -[Improvement] Git not required on host OS
                  <br />
                  -[Improvement] File scanner fails more rarely
                  <br />
                  -[Improvement] Snappier plugin stack UI
                  <br />
                  -[Improvement] Numerous other UI changes (workers, schedule,
                  plugin stack, search results, backups etc)
                  <br />
                  -[Fix] Local images show when using base path
                  <br />
                  <br />
                </p>
                <p>
                  Beta v1.104 release [7th Feb 2020]:
                  <br />
                  Changes:
                  <br />
                  -[New] Option to copy/paste plugin stack
                  <br />
                  -[New] Option to rescan individual files
                  <br />
                  -[New] Server time added to dashboard/schedule tab to help
                  with schedule debugging
                  <br />
                  -[New] Current plugins now referred to as 'Pre-processing'
                  plugins
                  <br />
                  -[New] onTranscodeError, onTranscodeSuccess availability added
                  to Pre-processing plugins
                  <br />
                  -[New]'Post-processing' plugins now possible - execute at very
                  end of plugin stack
                  <br />
                  -[New] More information passed to plugins (
                  <b>custom inputs configurable from plugin stack UI</b>,
                  library settings)
                  <br />
                  -[New] Plugins can update/remove files in database
                  <br />
                  -[New] Workers now show that a file is being copied after
                  transcoding has finished
                  <br />
                  -[New] Plugin stack progress added to workers. E.g (3/5)
                  <br />
                  -[New] Cache cleaner run on startup
                  <br />
                  -[New] HandBrakeCLI updated to 1.3.1 on Windows and tdarr_aio
                  <br />
                  -[New] FFmpeg 4.2 is now default on tdarr_aio
                  <br />
                  -[New][TESTING]Tdarr_Plugin_075a_Transcode_Customisable
                  <br />
                  -[New][TESTING]Tdarr_Plugin_076a_re_order_audio_streams
                  <br />
                  -[New][TESTING]Tdarr_Plugin_076b_re_order_subtitle_streams
                  <br />
                  -[New][TESTING]Tdarr_Plugin_z18s_rename_files_based_on_codec
                  <br />
                  -[New][TESTING]Tdarr_Plugin_43az_add_to_radarr
                  <br />
                  -[New][TESTING]Tdarr_Plugin_e5c3_CnT_Keep_Preferred_Audio
                  <br />
                  -[Fix] Prevent file scanner crashing on certain files
                  <br />
                  -[Fix] Prevent problem with one database collection stopping
                  other collection backups
                  <br />
                  <br />
                </p>
                <p>
                  Beta v1.103 release [27th Jan 2020]:
                  <br />
                  Changes:
                  <br />
                  -[New] Option to set folder watch scan interval (default 30
                  secs)
                  <br />
                  -[New] Button to skip all for transcode and health check
                  queues
                  <br />
                  -[New] Option on 'Options' tab to toggle worker stall detector
                  <br />
                  -[New] Basic output file size estimation shown on workers
                  <br />
                  -[Re-Fix] Prevent too many workers being started
                  <br />
                  -[Fix] Links open correctly when using context menu
                  <br />
                  -[Fix] Images stored locally
                  <br />
                  <br />
                </p>
                <p>
                  Beta v1.102 release [18th Jan 2020]:
                  <br />
                  Changes:
                  <br />
                  -[New] Plugin creator option (Filter by age) - select 'Date
                  created' or 'Date modified'
                  <br />
                  -[New] Plugin creator option (Filter by age) - include files
                  OLDER than specified time
                  <br />
                  -[New] Options to sort queue by date (Scanned, Created,
                  Modified)
                  <br />
                  -[Fix] Audio file codec not showing in search results
                  <br />
                  -[Fix] MJPEG video incorrectly tagged as audio file
                  <br />
                  -[Fix] Default plugin priority
                  <br />
                  -[Fix] 'Too many packets buffered for output stream' when
                  health checking
                  <br />
                  -[Fix] Folder path placeholder text
                  <br />
                  <br />
                </p>
                <p>
                  Beta v1.101 release [6th Dec 19]:
                  <br />
                  Changes:
                  <br />
                  -[New] Force processing of files
                  <br />
                  -[New] Action: HandBrake basic options
                  <br />
                  -[New] Action: Add one audio stream
                  <br />
                  -[New] Action: Keep one audio stream
                  <br />
                  -[New] Action: Standardise audio stream codecs
                  <br />
                  -[New] Channel count now shown in streams table
                  <br />
                  -[Fix] Rare search result bug (no results shown)
                  <br />
                  -[Fix] Audio files with cover art being detected as video
                  <br />
                  <br />
                </p>
                <p>
                  Alpha v1.008 release [1st Dec 19]:
                  <br />
                  Changes:
                  <br />
                  -[New] Plugin creator UI and groundwork for future Filters and
                  Actions. Filters now encapsulate Action taken. No separate
                  Filter needed
                  <br />
                  -[New] Re-order streams plugin added by default for new
                  libraries
                  <br />
                  -[New] Backup and restore feature (scheduled midnight backup)
                  <br />
                  -[New] Toggle copying to output folder if file already meets
                  conditions
                  <br />
                  -[Improvement] Change to how plugins are imported. Built-in
                  NodeJS modules can now be used when creating plugins. (Can use
                  e.g. require('fs') etc)
                  <br />
                  -[Improvement] Idle CPU usage drastically reduced
                  <br />
                  -[Improvement] Various stability fixes
                  <br />
                  -[Improvement] Confirmation needed when restoring from backup
                  <br />
                  -[Fix] Video resolution boundaries improved
                  <br />
                  -[Fix] Non existent files + junk removed when running Find-New
                  scan
                  <br />
                  -[Fix] Corrected error when creating remux container plugin
                  <br />
                  -[Fix] If one plugin has an error, the rest will still load
                  <br />
                  -[Fix] Auto cache cleaner disabled due to issues on some
                  systems
                  <br />
                  -[Fix] Move item to Transcode:Error instead of Transcode:Not
                  required if error with plugin
                  <br />
                  <br />
                </p>
                <p>
                  Alpha v1.007 release [22nd Nov 19]:
                  <br />
                  Changes:
                  <br />
                  -[New] Option to enable Linux FFmpeg NVENC binary (3.4.5 for
                  unRAID compatibility)
                  <br />
                  -[New] Option to ignore source sub-folders
                  <br />
                  -[New] Skip health check button
                  <br />
                  -[New] Option to change visible queue length
                  <br />
                  -[New] Option to duplicate library
                  <br />
                  -[New] Customise search result columns
                  <br />
                  -[New] UI improvements (@jono)
                  <br />
                  -[New] Option to delete source file when using folder to
                  folder conversion.
                  <br />
                  -[New] Community plugins (Remove commentary tracks etc)
                  <br />
                  -[New] Option to delete local plugins
                  <br />
                  -[New] Auto clean cache folder + preventing non-Tdarr cache
                  files being deleted in case of incorrect mapping.
                  <br />
                  -[Fix] Reset processing status of all files on startup so no
                  files stuck in limbo
                  <br />
                  -[Fix] Transcode pie showing incorrect data
                  <br />
                  -[Fix] Folder watcher will now wait longer to detect if a new
                  file has finished copying
                  <br />
                  -[Fix] Folder to folder conversion: Files which already meet
                  requirements will be copied to output folder
                  <br />
                  -[Fix] Folder to folder conversion: Cache/Output folder bug
                  <br />
                  -[Fix] Default containers to scan for now include ts/m2ts
                  <br />
                  -[Fix] Keep all stream types when using remux plugin creator
                  <br />
                  -[Fix] Prevent too many workers occassionally starting
                  <br />
                  -[Fix] Newly transcoded files will be bumped correctly to top
                  of queue when sorting by size
                  <br />
                  -[Fix] Closed caption scanning now much faster & accurate
                  (even on empty captions)
                  <br />
                  -[Fix] Plugin creator plugin path error
                  <br />
                  -[Fix] Health check error when using FFmpeg hardware
                  transcoding
                  <br />
                  <br />
                </p>
                <p>
                  Alpha v1.006 release [9th Nov 19]:
                  <br />
                  Changes:
                  <br />
                  -[New] NVENC for FFmpeg enabled (linux + tdarr_aio)
                  <br />
                  -[New] Per library stat breakdown
                  <br />
                  -[New] Plugin creator
                  <br />
                  -[New] Plugin creator option - Filter by codec
                  <br />
                  -[New] Plugin creator option - Filter by date
                  <br />
                  -[New] Plugin creator option - Filter by medium
                  <br />
                  -[New] Plugin creator option - Filter by size
                  <br />
                  -[New] Plugin creator option - Filter by resolution
                  <br />
                  -[New] Plugin creator option - Transcode
                  <br />
                  -[New] Plugin creator option - Remux container
                  <br />
                  -[New] Option to detect closed captions (linux + tdarr_aio +
                  windows)
                  <br />
                  -[New] Community plugin - remove closed captions
                  <br />
                  -[New] Configurable plugin stack (mix local and community
                  plugins, re-order etc)
                  <br />
                  -[New] Folder to folder conversion (feedback needed, test
                  first)
                  <br />
                  -[New] Skip transcoding button
                  <br />
                  -[New] Options tab - set base URL
                  <br />
                  -[New] Remove item from library button
                  <br />
                  -[New] Exclude codec whitelist/blacklist
                  <br />
                  -[New] Navgiation bar UI
                  <br />
                  -[New] Queue library alternation option
                  <br />
                  -[Fix] 'Re-queue' buttons on 'Tdarr' tab
                  <br />
                  -[Fix] Prevent find-new/fresh scans occuring on a library at
                  the same time. Hourly find-new scan re-enabled for libraries
                  with folder watch ON.
                  <br />
                  -[Fix] Library prioritisation sort
                  <br />
                  -[Fix] Reduced search result number for quicker render
                  <br />+ UI changes
                </p>
                <br />
                <br />
                <p>
                  Alpha v1.005 release [1st Nov 19]:
                  <br />
                  Changes:
                  <br />
                  -[New] UI overhaul (Dark theme)
                  <br />
                  -[New] Hardware transcoding using tdarr_aio container +
                  HandBrake
                  <br />
                  -[New] Improved bump-file system
                  <br />
                  -[New] Improved plugin/transcode formatting
                  <br />
                  -[New] File history
                  <br />
                  -[New] Search tab shows queue position, streams, file history
                  + more
                  <br />
                  -[New] Sort and filter search results
                  <br />
                  -[New] Prioritise libraries
                  <br />
                  -[New] Sort queues by size/date created
                  <br />
                  -[New] Full file path shown on workers
                  <br />
                  -[New] Total file count shown when files being
                  scanned/processed
                  <br />
                  -[New] Search local plugins
                  <br />
                  -[New] Set base URL with env variable
                  <br />
                  -[New] Requeue-all buttons added to Tdarr tab
                  <br />
                  -[Fix] Library requeue buttons requeue only specified library
                  <br />
                  -[Fix] Ubuntu container permissions
                  <br />
                  -[Fix] File scanner logs
                  <br />
                  -[Fix] Video height boundaries reduced for 720p,180p etc
                  <br />
                  -[Fix] Bigger font through-out
                  <br />
                  <br />
                  <br />
                </p>
                <p>
                  Alpha v1.004 release [23rd Oct 19]:
                  <br />
                  Changes:
                  <br />
                  -[New] Scan on start switch added
                  <br />
                  -[New] tdarr_aio (All-in-one) Ubuntu container now available
                  with MongoDB inside container.
                  <br />
                  -[Fix] Prevent Tdarr temp output files mistakenly being
                  scanned
                  <br />
                  -[Fix] Docker memory fix for large libraries (30,000+ files)
                  <br />
                  -[Fix] Improved garbage collection
                  <br />
                  -[Fix] Temp scanner data written inside container (Should fix
                  permission issues with host)
                </p>
                <br />
                <br />
                <p>
                  Alpha v1.003 release [10th Oct 19]:
                  <br />
                  Changes:
                  <br />
                  -[New] Workers now show more detailed information: ETA, CLI
                  type, preset, process reasons, start time, duration and
                  original file size.
                  <br />
                  -[New] Help links updated
                  <br />
                  -[New] Improvements to FFmpeg percentages
                  <br />
                  -[New] Switch to turn processing of a library On/Off
                  <br />
                  -[New] Can now click on Pie-chart segments to see files in
                  those segments
                  <br />
                  -[New] 'Not attempted' items renamed to 'Queued'.
                  'Transcode:Passed' items renamed to 'Transcode:Not required'
                  <br />
                  -[New] Status tables have been put into tabs. Each tab shows
                  the number of related items on it (e.g. No. items in queue.)
                  Additional information added to items (codec,resolution etc)
                  <br />
                  -[New] Date time stamp now shown on processed items. Old/New
                  size now shown for transcode items.
                  <br />
                  -[New] HandBrake and FFmpeg terminal implemented on the 'Help'
                  tab. This is mainly so you can see documentation such as what
                  encoder types are enabled etc but any HandBrake/FFmpeg
                  commands can be put into the terminal.
                  <br />
                  -[New] Create a sample button added to items in Search
                  results. Clicking the button will create a 30 second sample of
                  the selected file and output it in the new 'Samples' folder in
                  the Tdarr data folder. Use the sample to test
                  plugins/transcode settings and to help when reporting bugs.
                  <br />
                  -[New] Additional schedule buttons added so you can bulk
                  change daily hour slots.
                  <br />
                  -[Fix]Reduced 720p boundaries so now 960*720 video files will
                  show up in the 720p category instead of just 1280*720 files.
                  <br />
                  <br />
                  <br />
                </p>
              </div>
            </center>
          </div>
        </div>
      </div>
    );
  }
}
