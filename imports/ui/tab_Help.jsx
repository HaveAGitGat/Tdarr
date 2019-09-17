import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';










export default class App extends Component {

  constructor(props) {
    super(props);

  }

  render() {



    return (



        <div className="container">

          <h1>Help</h1>


          <p>Reddit:https://www.reddit.com/r/Tdarr/</p>
          <p>Discord:https://discord.gg/GF8X8cq</p>


          <p>Just some brief notes for v pre-alpha (will be expanded on greatly in future)</p>


          <p>Tdarr is designed to automatically manage transcoding and health checking of your media libraries. If you've used HBBatchBeast, a lot of the settings will look familiar.</p>


        <p>When you're first getting started, add a new library on the 'Libraries' tab and specify a source folder, select the container types you'd like to scan for and then click then click 'Scan (Fresh)'. This will do a fresh scan of the library and extract meta-data from files which fit your specified container settings. The data will then be saved in the database.</p>

        <p>'Scan (Find new)' does 2 things - it removes files from the database which don't exist anymore, and adds newly detected files. Turn on 'Folder watch' to automate this process.</p>
        <p>All new files will be added to both the transcode queues and the health check queues. If you're not interested in using one or the other, then just make sure not to fire up any workers for that respective queue.</p>
        <p>Back to the library settings, if using FFmpeg, you need to separate the input and output parameters with a comma. Such as:  '-r 1,-r 24'. Here are some HandBrake preset examples:</p>
        <p>-e x264 -q 20 -B</p>
        <p>-Z "Very Fast 1080p30"</p>
        <p>-Z "Very Fast 480p30"</p>
        <p>--preset-import-file "C:\Users\HaveAGitGat\Desktop\testpreset.json" -Z "My Preset"</p>

        <p>If you're having trouble with custom presets, it may be due to a known bug with the HandBrakeCLI (will be fixed in next HandBrakeCLI release). Please see this for a temporary solution:  https://github.com/HandBrake/HandBrake/issues/2047</p>
        <p></p>
        <p>Regarding the transcode filter settings, these are applied when the items are being processed in the transcode queue. If files do not meet the transcode requirements then they will be passed.</p>
        
        
        <p>Watch out for the schedule settings. If scheduled blocks are ticked, and worker limits are set at the top of the 'Tdarr' tab, then workers will be fired up even if you keep closing them down. It's also important to note that workers won't process items for the respective library outside the selected time blocks. If you're wanting to manually control workers, make sure to tick all the schedule blocks and then set the 'Scheduled worker limits' on the 'Tdarr' tab to 0. Start up and close down workers as you wish.</p>


        <p>The UI is rough at the moment but bear with me!</p>
      
        </div>

    );
  }
}

