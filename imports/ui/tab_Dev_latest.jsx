import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';




export default class App extends Component {

  constructor(props) {
    super(props);

  }






  render() {



    return (




      <div >

<p>Beta v1.104 release [7th Feb 2020]:
            
            <br />Changes:

            <br />-[New] Option to copy/paste plugin stack
            <br />-[New] Option to rescan individual files
            <br />-[New] Server time added to dashboard/schedule tab to help with schedule debugging
            <br />

            <br />-[New] Current plugins now referred to as 'Pre-processing' plugins
            <br />-[New] onTranscodeError, onTranscodeSuccess availability added to Pre-processing plugins
            <br />-[New]'Post-processing' plugins now possible - execute at very end of plugin stack

            <br />

            <br />-[New] More information passed to plugins (<b>custom inputs configurable from plugin stack UI</b>, library settings)

            <br />

            <br />-[New] Plugins can update/remove files in database
            <br />-[New] Workers now show that a file is being copied after transcoding has finished
            <br />-[New] Plugin stack progress added to workers. E.g (3/5)
            <br />-[New] Cache cleaner run on startup
            <br />-[New] HandBrakeCLI updated to 1.3.1 on Windows and tdarr_aio
            <br />-[New] FFmpeg 4.2 is now default on tdarr_aio
            <br />

            <br />-[New][TESTING]Tdarr_Plugin_075a_Transcode_Customisable
            <br />-[New][TESTING]Tdarr_Plugin_076a_re_order_audio_streams
            <br />-[New][TESTING]Tdarr_Plugin_076b_re_order_subtitle_streams
            <br />-[New][TESTING]Tdarr_Plugin_z18s_rename_files_based_on_codec
            <br />-[New][TESTING]Tdarr_Plugin_43az_add_to_radarr
            <br />-[New][TESTING]Tdarr_Plugin_e5c3_CnT_Keep_Preferred_Audio
            


            <br />
            <br />-[Fix] Prevent file scanner crashing on certain files
            <br />-[Fix] Prevent problem with one database collection stopping other collection backups


            <br />
            <br />

            </p>


      </div>

    );
  }
}

