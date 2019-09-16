import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ToggleButton from 'react-toggle-button'



import { SettingsDB } from '../api/tasks.js';

import { withTracker } from 'meteor/react-meteor-data';

import VideoCodec from './VideoCodec.jsx';
import AudioCodec from './AudioCodec.jsx';
import ScheduleBlock from './ScheduleBlock.jsx';
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';

import { css } from '@emotion/core';


import ScaleLoader from 'react-spinners/ScaleLoader';


var libButtonStyle = {
  display: 'inline-block',
}

const override = css`

`;

class Folder extends Component {

  constructor(props) {
    super(props);
    this.scanFiles = this.scanFiles.bind(this);
    this.toggleFolderWatch = this.toggleFolderWatch.bind(this);



    this.removeLibrary = this.removeLibrary.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeChkBx = this.handleChangeChkBx.bind(this);
    this.showHideSettings = this.showHideSettings.bind(this);

  }

  handleChange(event) {

    //turn off folder watcher if folder name change detected
    if (event.target.name == "folder") {

      SettingsDB.upsert(
        

        this.props.libraryItem._id,
        {
          $set: {
            folderWatching: false,
          }
        }
      );

      Meteor.call('toggleFolderWatch', event.target.value, this.props.libraryItem._id, false, function (error, result) { })


      Meteor.call('verifyFolder', event.target.value, this.props.libraryItem._id,"folderValid", function (error, result) {})



    }

    if (event.target.name == "cache") {

      Meteor.call('verifyFolder', event.target.value, this.props.libraryItem._id,"cacheValid", function (error, result) {})

    }



    //this.setState({folder: event.target.value});
    SettingsDB.upsert(

      this.props.libraryItem._id,
      {
        $set: {
          [event.target.name]: event.target.value,
        }
      }
    );


  }

  handleChangeChkBx(event) {

    //this.setState({folder: event.target.value});
    SettingsDB.upsert(

      this.props.libraryItem._id,
      {
        $set: {
          [event.target.name]: event.target.checked,
        }
      }
    );


    if (event.target.name == "handbrake" && event.target.checked == true) {

      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            ffmpeg: false,
          }
        }
      );


    }

    if (event.target.name == "ffmpeg" && event.target.checked == true) {

      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            handbrake: false,
          }
        }
      );


    }

    if (event.target.name == "handbrakescan" && event.target.checked == true) {

      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            ffmpegscan: false,
          }
        }
      );


    }

    if (event.target.name == "ffmpegscan" && event.target.checked == true) {

      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            handbrakescan: false,
          }
        }
      );


    }






  }

  renderVideoCodecsExclude() {

    let videoCodecsExclude = this.props.settings;

    videoCodecsExclude = videoCodecsExclude.filter(setting => setting._id == this.props.libraryItem._id);
    videoCodecsExclude = videoCodecsExclude[0].decisionMaker.video_codec_names_exclude



    return videoCodecsExclude.map((videocodec) => {



      return (
        <VideoCodec

        key={videocodec._id}
          videocodec={videocodec}
          DB_id={this.props.libraryItem._id}
        />
      );
    });
  }

  renderAudioCodecsExclude() {

    let audioCodecsExclude = this.props.settings;
    audioCodecsExclude = audioCodecsExclude.filter(setting => setting._id == this.props.libraryItem._id);
    audioCodecsExclude = audioCodecsExclude[0].decisionMaker.audio_codec_names_exclude

    return audioCodecsExclude.map((audiocodec) => {



      return (
        <AudioCodec

        key={audiocodec._id}
       
          audiocodec={audiocodec}
          DB_id={this.props.libraryItem._id}
        />
      );
    });
  }



  renderScheduleBlocks(){

    
    let blocks = this.props.settings;
    blocks = blocks.filter(setting => setting._id == this.props.libraryItem._id);
    blocks = blocks[0].schedule

    return blocks.map((item) => {



      return (
        <ScheduleBlock
        key={item._id}
          item={item}
          DB_id={this.props.libraryItem._id}
        />
      );
    });



  }

  showHideSettings(event) {



    SettingsDB.upsert(

      this.props.libraryItem._id,
      {
        $set: {
          expanded: !this.props.libraryItem.expanded,
        }
      }
    );


  }


  removeLibrary() {

    Meteor.call('removelibrary', this.props.libraryItem._id, function (error, result) { });

  }

  scanFiles(mode) {



      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            scanButtons: false,
          }
        }
      );



    Meteor.call('scanFiles', this.props.libraryItem._id,this.props.libraryItem.folder ,1,mode,"Not attempted","Not attempted", function (error, result) {
      Meteor.call('consolelog', result);

    });



  }

  resetAllStatus(mode) {

    if (confirm('Are you want reset all files '+mode+ ' status to "Not attempted"?')) {

    Meteor.call('resetAllStatus', mode, function (error, result) { })

    }


  }

  toggleFolderWatch() {


  }

  addVideoCodecExclude(event) {

    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.addVideoCodecExcludeText).value.trim();


    //using this to validate user
    Meteor.call('addVideoCodecExclude', this.props.libraryItem._id, text, function (error, result) { });


    ReactDOM.findDOMNode(this.refs.addVideoCodecExcludeText).value = '';
  }

  addAudioCodecExclude(event) {

    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.addAudioCodecExcludeText).value.trim();


    //using this to validate user
    Meteor.call('addAudioCodecExclude', this.props.libraryItem._id, text, function (error, result) { });


    ReactDOM.findDOMNode(this.refs.addAudioCodecExcludeText).value = '';
  }


  deleteThisLibrary() {

    if (confirm('Are you sure you want to delete this library?')) {

      SettingsDB.remove(this.props.libraryItem._id);

      Meteor.call('removelibrary', this.props.libraryItem._id, function (error, result) { });

      Meteor.call('toggleFolderWatch', this.props.libraryItem.folder, this.props.libraryItem._id, false, function (error, result) { })

    }

  }




  render() {

    return (
      <span>

        <div className="libraryContainer">

          <div className="libraryContainerItems">

            <div style={libButtonStyle}>
              <div className={this.props.libraryItem.scanButtons ? '' : 'hidden'} style={libButtonStyle}>
                <input type="button" className="scanButton" onClick={() => this.scanFiles(0)} value="Scan (Find new)" />
                <input type="button" className="scanButton" onClick={() => this.scanFiles(1)} value="Scan (Fresh)" />

                <input type="button" className="scanButton" onClick={() => this.resetAllStatus('TranscodeDecisionMaker')} value="Reset all transcode status" />
                <input type="button" className="scanButton" onClick={() => this.resetAllStatus('HealthCheck')} value="Reset all health check status" />
              </div>

              <div className={this.props.libraryItem.scanButtons ? 'hidden' : ''} style={libButtonStyle}>
                <span> {this.props.libraryItem.scanFound}</span>

                <div className='sweet-loading'>
        <ScaleLoader
          css={override}
          sizeUnit={"px"}
          size={15}
          color={'#000000'}
          loading={true}
        />
           </div> 
              </div>




              <div className={this.props.libraryItem.scanButtons ? '' : 'hidden'} style={libButtonStyle}>
                  <input type="button" className="cancelAllWorkersButton" onClick={() => {

                    if (confirm('Are you sure you want to clear this library?')) {
                      this.removeLibrary(this.props.libraryItem._id)
                    }
                  }

                  } value="Clear library"></input>

                  <button className="cancelAllWorkersButton" onClick={this.deleteThisLibrary.bind(this)}>  Delete library </button>
               
              </div>


            </div>


            {/* <span > <strong>{this.props.libraryItem.folder}</strong>  </span> */}


              <p> </p>
            <div style={libButtonStyle}>
              Source folder:{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'} Folder watch:
        <div style={libButtonStyle}>
                <ToggleButton

                  name="folderWatching"
                  value={!!this.props.libraryItem.folderWatching || false}
                  onToggle={() => {

                    SettingsDB.upsert(

                      this.props.libraryItem._id,
                      {
                        $set: {
                          folderWatching: !this.props.libraryItem.folderWatching,
                        }
                      }
                    );


                    Meteor.call('toggleFolderWatch', this.props.libraryItem.folder, this.props.libraryItem._id, !this.props.libraryItem.folderWatching, function (error, result) { })
                  }

                  }
                />
              </div>

            </div>



            <input type="text" className="folderPaths" name="folder" defaultValue={this.props.libraryItem.folder} onChange={this.handleChange}></input>

            <div className={this.props.libraryItem.folderValid ? 'hidden' : ''}>

             <span className="invalidFolder" ><center> Invalid folder </center></span>

             </div>

           
            <p></p>
            <input type="button" className="generalWorkerButton" onClick={this.showHideSettings} value="Show/hide settings" />

            <div className={this.props.libraryItem.expanded ? '' : 'hidden'}>

              <p> Transcode cache folder:</p>

              <input type="text" className="folderPaths" name="cache" defaultValue={this.props.libraryItem.cache} onChange={this.handleChange}></input>

              <div className={this.props.libraryItem.cacheValid ? 'hidden' : ''}>

<span className="invalidFolder" ><center> Invalid folder </center></span>

</div>


              <p>Output file container: </p>

              <input type="text" name="container" className="folderPaths" defaultValue={this.props.libraryItem.container} onChange={this.handleChange}></input>

              <p> Container types to scan for:</p>

              <input type="text" className="folderPaths" name="containerFilter" defaultValue={this.props.libraryItem.containerFilter} onChange={this.handleChange}></input>



              <p>HandBrake:
        <input type="checkbox" name="handbrake" checked={!!this.props.libraryItem.handbrake} onChange={this.handleChangeChkBx} />
                FFmpeg:
        <input type="checkbox" name="ffmpeg" checked={!!this.props.libraryItem.ffmpeg} onChange={this.handleChangeChkBx} />
              </p>

              <p>CLI arguments/preset: </p>
              <input type="text" name="preset" defaultValue={this.props.libraryItem.preset} onChange={this.handleChange}></input>


             














              <p>Transcode Decision Maker</p>


              Video library: <div style={libButtonStyle}><ToggleButton

                value={!!this.props.libraryItem.decisionMaker.videoFilter}
                onToggle={() => {

                  SettingsDB.upsert(
                    this.props.libraryItem._id,
                    {
                      $set: {
                        "decisionMaker.videoFilter": !this.props.libraryItem.decisionMaker.videoFilter,
                        "decisionMaker.audioFilter": this.props.libraryItem.decisionMaker.videoFilter,
                      }
                    }
                  );
                }

                }
              /></div>

<div className={!!this.props.libraryItem.decisionMaker.videoFilter ? '' : 'hidden'}>

<p>Health check type:</p>
<p>Quick:
        <input type="checkbox" name="handbrakescan" checked={!!this.props.libraryItem.handbrakescan} onChange={this.handleChangeChkBx} />
                Thorough:
        <input type="checkbox" name="ffmpegscan" checked={!!this.props.libraryItem.ffmpegscan} onChange={this.handleChangeChkBx} />
              </p>


              <p>Don't transcode videos already in these codecs:</p>


              <form onSubmit={this.addVideoCodecExclude.bind(this)} >
                <input
                  type="text"
                  ref="addVideoCodecExcludeText"
                  placeholder="Add new video codecs...(use Enter↵)"
                  className="folderPaths"
                />
              </form>

              <ul>
                {this.renderVideoCodecsExclude()}
              </ul>

              <p>Video size range (MB)</p>

              <InputRange
                maxValue={200000}
                minValue={0}
                value={this.props.libraryItem.decisionMaker.video_size_range_include}
                onChange={(value) => {

                  SettingsDB.upsert(

                    this.props.libraryItem._id,
                    {
                      $set: {
                        "decisionMaker.video_size_range_include": value,
                      }
                    }
                  );
                }}
                step={0.1}
             
                 /> 



              <p>Video resolution height range (px)</p>

              <InputRange
                maxValue={5000}
                minValue={0}
                value={this.props.libraryItem.decisionMaker.video_height_range_include}
                onChange={(value) => {

                  SettingsDB.upsert(

                    this.props.libraryItem._id,
                    {
                      $set: {
                        "decisionMaker.video_height_range_include": value,
                      }
                    }
                  );
                }}
                step={1}
    
                 /> 




              <p>Video resolution width range (px)</p>

              <InputRange
                maxValue={8000}
                minValue={0}
                value={this.props.libraryItem.decisionMaker.video_width_range_include}
                onChange={(value) => {

                  SettingsDB.upsert(

                    this.props.libraryItem._id,
                    {
                      $set: {
                        "decisionMaker.video_width_range_include": value,
                      }
                    }
                  );
                }}
                step={1}
            
                 /> 

</div>



              <p>Audio library:</p>

              <div style={libButtonStyle}> <ToggleButton

                value={!!this.props.libraryItem.decisionMaker.audioFilter}
                onToggle={() => {

                  SettingsDB.upsert(

                    this.props.libraryItem._id,
                    {
                      $set: {
                        "decisionMaker.audioFilter": !this.props.libraryItem.decisionMaker.audioFilter,
                        "decisionMaker.videoFilter": this.props.libraryItem.decisionMaker.audioFilter,
                      }
                    }
                  );
                }

                }
              /></div>

<div className={!!this.props.libraryItem.decisionMaker.audioFilter ? '' : 'hidden'}>
              <p>Don't transcode audio already in these codecs:</p>

              <form onSubmit={this.addAudioCodecExclude.bind(this)} >
                <input
                  type="text"
                  ref="addAudioCodecExcludeText"
                  placeholder="Add new audio codecs...(use Enter↵)"
                />
              </form>


              <ul>
                {this.renderAudioCodecsExclude()}
              </ul>

              <p>Audio size range (MB)</p>


              <InputRange
                maxValue={1000}
                minValue={0}
                value={this.props.libraryItem.decisionMaker.audio_size_range_include}
                onChange={(value) => {

                  SettingsDB.upsert(

                    this.props.libraryItem._id,
                    {
                      $set: {
                        "decisionMaker.audio_size_range_include": value,
                      }
                    }
                  );
                }}
                step={0.1}
             
                 /> 


</div>


<p>Schedule:</p>
<div className="scheduleContainer">
{this.renderScheduleBlocks()}

</div>




            </div>
          </div>

        </div>

      </span>
    );
  }
}

export default withTracker(() => {

  Meteor.subscribe('SettingsDB');


  return {
    settings: SettingsDB.find({}, {}).fetch(),

  };
})(Folder);


