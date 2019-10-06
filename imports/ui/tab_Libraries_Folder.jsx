import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ToggleButton from 'react-toggle-button'


import { render } from 'react-dom';

import { SettingsDB } from '../api/tasks.js';

import { withTracker } from 'meteor/react-meteor-data';

import VideoCodec from './VideoCodec.jsx';
import AudioCodec from './AudioCodec.jsx';
import Plugin from './Plugin.jsx';
import ScheduleBlock from './ScheduleBlock.jsx';
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';

import Checkbox from '@material-ui/core/Checkbox';

import { Button, Dropdown } from 'react-bootstrap';


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

    this.state = {
      scheduleAll: false,
      folderBrowser: false,
      cacheBrowser: false

    };


    this.scanFiles = this.scanFiles.bind(this);
    this.toggleFolderWatch = this.toggleFolderWatch.bind(this);



    this.removeLibrary = this.removeLibrary.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeChkBx = this.handleChangeChkBx.bind(this);
    this.showHideSettings = this.showHideSettings.bind(this);

  }

  componentDidMount = () => {

    this.verifyFolder(ReactDOM.findDOMNode(this.refs[this.props.libraryItem._id + 'f']).value, 'folder', this.props.libraryItem._id + 'f')

    this.verifyFolder(ReactDOM.findDOMNode(this.refs[this.props.libraryItem._id + 'f']).value, 'cache', this.props.libraryItem._id + 'c')


  }

  toggleFolderWatch = (status) => {

    Meteor.call('toggleFolderWatch', status, this.props.libraryItem._id, false, function (error, result) { })
  }

  verifyFolder = (folderPath, type, refType) => {

    Meteor.call('verifyFolder', folderPath, this.props.libraryItem._id, type + "Valid", (error, result) => {




      if (result === undefined) {


      } else if (result.length == 0) {

        render(
          <Button variant="outline-dark" onClick={() => {

            var temp = ReactDOM.findDOMNode(this.refs[refType]).value
            temp = temp.replace(/\\/g, "/");

            temp = temp.split('/')
            var idx = temp.length - 1
            temp.splice(idx, 1)
            temp = temp.join('/')

            SettingsDB.upsert(
              this.props.libraryItem._id,
              {
                $set: {
                  [type]: temp,
                }
              }
            );

            ReactDOM.findDOMNode(this.refs[refType]).value = temp;
            this.verifyFolder(temp, type, refType)


          }}  >Back</Button>



          , document.getElementById(refType + 'Results'));

      } else {



        var results = result.map((row, i) => {

          return <tr><td><p>{row.folder}</p></td>


            <td> <Button variant="outline-dark" onClick={() => {

              SettingsDB.upsert(

                this.props.libraryItem._id,
                {
                  $set: {
                    [type]: row.fullPath.replace(/\\/g, "/"),
                  }
                }
              );

              ReactDOM.findDOMNode(this.refs[refType]).value = row.fullPath.replace(/\\/g, "/");

              this.verifyFolder((row.fullPath).replace(/\\/g, "/"), type, refType)


            }}  >-></Button></td>



          </tr>

        });

        render(
          <div>

            <Button variant="outline-dark" onClick={() => {

              var temp = ReactDOM.findDOMNode(this.refs[refType]).value
              temp = temp.replace(/\\/g, "/");

              temp = temp.split('/')
              var idx = temp.length - 1
              temp.splice(idx, 1)
              temp = temp.join('/')

              SettingsDB.upsert(
                this.props.libraryItem._id,
                {
                  $set: {
                    [type]: temp,
                  }
                }
              );

              ReactDOM.findDOMNode(this.refs[refType]).value = temp;
              this.verifyFolder(temp, type, refType)


            }}  >Back</Button>

            <table>
              <tbody>
                {results}
              </tbody>
            </table>
          </div>
          , document.getElementById(refType + 'Results'));

      }


    })


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


      //

      this.toggleFolderWatch(event.target.value)

      this.verifyFolder(event.target.value, 'folder', this.props.libraryItem._id + 'f')





    }

    if (event.target.name == "cache") {

      this.verifyFolder(event.target.value, 'cache', this.props.libraryItem._id + 'c')

    }

    if (event.target.name == "pluginID") {

      Meteor.call('verifyPlugin', event.target.value, this.props.libraryItem._id, this.props.libraryItem.pluginCommunity, function (error, result) { })

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

    if (event.target.name == "community" && event.target.checked == true) {

      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            "pluginCommunity": true,
          }
        }
      );


    }

    if (event.target.name == "local" && event.target.checked == true) {

      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            "pluginCommunity": false,
          }
        }
      );


    }






  }

  renderPlugins() {

    let plugins = this.props.settings;

    plugins = plugins.filter(setting => setting._id == this.props.libraryItem._id);
    plugins = plugins[0].pluginIDs


    return plugins.map((pluginItem) => {



      return (
        <Plugin
          key={pluginItem._id}
          pluginItem={pluginItem}
          DB_id={this.props.libraryItem._id}
        />
      );
    });


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



  renderScheduleBlocks = () => {


    let blocks = this.props.settings;
    blocks = blocks.filter(setting => setting._id == this.props.libraryItem._id);
    blocks = blocks[0].schedule


    //UpdateMigration
    if (blocks.length < 168) {

      SettingsDB.upsert(

        this.props.libraryItem._id,
        {
          $set: {
            schedule: [

              {
                _id: "Sun:00-01",
                checked: true
              },
              {
                _id: "Sun:01-02",
                checked: true
              },
              {
                _id: "Sun:02-03",
                checked: true
              },
              {
                _id: "Sun:03-04",
                checked: true
              },
              {
                _id: "Sun:04-05",
                checked: true
              },
              {
                _id: "Sun:05-06",
                checked: true
              },
              {
                _id: "Sun:06-07",
                checked: true
              },
              {
                _id: "Sun:07-08",
                checked: true
              },
              {
                _id: "Sun:08-09",
                checked: true
              },
              {
                _id: "Sun:09-10",
                checked: true
              },
              {
                _id: "Sun:10-11",
                checked: true
              },
              {
                _id: "Sun:11-12",
                checked: true
              },
              {
                _id: "Sun:12-13",
                checked: true
              },
              {
                _id: "Sun:13-14",
                checked: true
              },
              {
                _id: "Sun:14-15",
                checked: true
              },
              {
                _id: "Sun:15-16",
                checked: true
              },
              {
                _id: "Sun:16-17",
                checked: true
              },
              {
                _id: "Sun:17-18",
                checked: true
              },
              {
                _id: "Sun:18-19",
                checked: true
              },
              {
                _id: "Sun:19-20",
                checked: true
              },
              {
                _id: "Sun:20-21",
                checked: true
              },
              {
                _id: "Sun:21-22",
                checked: true
              },
              {
                _id: "Sun:22-23",
                checked: true
              },
              {
                _id: "Sun:23-00",
                checked: true
              },


              {
                _id: "Mon:00-01",
                checked: true
              },
              {
                _id: "Mon:01-02",
                checked: true
              },
              {
                _id: "Mon:02-03",
                checked: true
              },
              {
                _id: "Mon:03-04",
                checked: true
              },
              {
                _id: "Mon:04-05",
                checked: true
              },
              {
                _id: "Mon:05-06",
                checked: true
              },
              {
                _id: "Mon:06-07",
                checked: true
              },
              {
                _id: "Mon:07-08",
                checked: true
              },
              {
                _id: "Mon:08-09",
                checked: true
              },
              {
                _id: "Mon:09-10",
                checked: true
              },
              {
                _id: "Mon:10-11",
                checked: true
              },
              {
                _id: "Mon:11-12",
                checked: true
              },
              {
                _id: "Mon:12-13",
                checked: true
              },
              {
                _id: "Mon:13-14",
                checked: true
              },
              {
                _id: "Mon:14-15",
                checked: true
              },
              {
                _id: "Mon:15-16",
                checked: true
              },
              {
                _id: "Mon:16-17",
                checked: true
              },
              {
                _id: "Mon:17-18",
                checked: true
              },
              {
                _id: "Mon:18-19",
                checked: true
              },
              {
                _id: "Mon:19-20",
                checked: true
              },
              {
                _id: "Mon:20-21",
                checked: true
              },
              {
                _id: "Mon:21-22",
                checked: true
              },
              {
                _id: "Mon:22-23",
                checked: true
              },
              {
                _id: "Mon:23-00",
                checked: true
              },

              {
                _id: "Tue:00-01",
                checked: true
              },
              {
                _id: "Tue:01-02",
                checked: true
              },
              {
                _id: "Tue:02-03",
                checked: true
              },
              {
                _id: "Tue:03-04",
                checked: true
              },
              {
                _id: "Tue:04-05",
                checked: true
              },
              {
                _id: "Tue:05-06",
                checked: true
              },
              {
                _id: "Tue:06-07",
                checked: true
              },
              {
                _id: "Tue:07-08",
                checked: true
              },
              {
                _id: "Tue:08-09",
                checked: true
              },
              {
                _id: "Tue:09-10",
                checked: true
              },
              {
                _id: "Tue:10-11",
                checked: true
              },
              {
                _id: "Tue:11-12",
                checked: true
              },
              {
                _id: "Tue:12-13",
                checked: true
              },
              {
                _id: "Tue:13-14",
                checked: true
              },
              {
                _id: "Tue:14-15",
                checked: true
              },
              {
                _id: "Tue:15-16",
                checked: true
              },
              {
                _id: "Tue:16-17",
                checked: true
              },

              {
                _id: "Tue:17-18",
                checked: true
              },
              {
                _id: "Tue:18-19",
                checked: true
              },
              {
                _id: "Tue:19-20",
                checked: true
              },
              {
                _id: "Tue:20-21",
                checked: true
              },
              {
                _id: "Tue:21-22",
                checked: true
              },
              {
                _id: "Tue:22-23",
                checked: true
              },
              {
                _id: "Tue:23-00",
                checked: true
              },

              {
                _id: "Wed:00-01",
                checked: true
              },
              {
                _id: "Wed:01-02",
                checked: true
              },
              {
                _id: "Wed:02-03",
                checked: true
              },
              {
                _id: "Wed:03-04",
                checked: true
              },
              {
                _id: "Wed:04-05",
                checked: true
              },
              {
                _id: "Wed:05-06",
                checked: true
              },
              {
                _id: "Wed:06-07",
                checked: true
              },
              {
                _id: "Wed:07-08",
                checked: true
              },
              {
                _id: "Wed:08-09",
                checked: true
              },
              {
                _id: "Wed:09-10",
                checked: true
              },
              {
                _id: "Wed:10-11",
                checked: true
              },
              {
                _id: "Wed:11-12",
                checked: true
              },
              {
                _id: "Wed:12-13",
                checked: true
              },
              {
                _id: "Wed:13-14",
                checked: true
              },
              {
                _id: "Wed:14-15",
                checked: true
              },
              {
                _id: "Wed:15-16",
                checked: true
              },
              {
                _id: "Wed:16-17",
                checked: true
              },
              {
                _id: "Wed:17-18",
                checked: true
              },
              {
                _id: "Wed:18-19",
                checked: true
              },
              {
                _id: "Wed:19-20",
                checked: true
              },
              {
                _id: "Wed:20-21",
                checked: true
              },
              {
                _id: "Wed:21-22",
                checked: true
              },
              {
                _id: "Wed:22-23",
                checked: true
              },
              {
                _id: "Wed:23-00",
                checked: true
              },

              {
                _id: "Thur:00-01",
                checked: true
              },
              {
                _id: "Thur:01-02",
                checked: true
              },
              {
                _id: "Thur:02-03",
                checked: true
              },
              {
                _id: "Thur:03-04",
                checked: true
              },
              {
                _id: "Thur:04-05",
                checked: true
              },
              {
                _id: "Thur:05-06",
                checked: true
              },
              {
                _id: "Thur:06-07",
                checked: true
              },
              {
                _id: "Thur:07-08",
                checked: true
              },
              {
                _id: "Thur:08-09",
                checked: true
              },
              {
                _id: "Thur:09-10",
                checked: true
              },
              {
                _id: "Thur:10-11",
                checked: true
              },
              {
                _id: "Thur:11-12",
                checked: true
              },
              {
                _id: "Thur:12-13",
                checked: true
              },
              {
                _id: "Thur:13-14",
                checked: true
              },
              {
                _id: "Thur:14-15",
                checked: true
              },
              {
                _id: "Thur:15-16",
                checked: true
              },
              {
                _id: "Thur:16-17",
                checked: true
              },
              {
                _id: "Thur:17-18",
                checked: true
              },
              {
                _id: "Thur:18-19",
                checked: true
              },
              {
                _id: "Thur:19-20",
                checked: true
              },
              {
                _id: "Thur:20-21",
                checked: true
              },
              {
                _id: "Thur:21-22",
                checked: true
              },
              {
                _id: "Thur:22-23",
                checked: true
              },
              {
                _id: "Thur:23-00",
                checked: true
              },

              {
                _id: "Fri:00-01",
                checked: true
              },
              {
                _id: "Fri:01-02",
                checked: true
              },
              {
                _id: "Fri:02-03",
                checked: true
              },
              {
                _id: "Fri:03-04",
                checked: true
              },
              {
                _id: "Fri:04-05",
                checked: true
              },
              {
                _id: "Fri:05-06",
                checked: true
              },
              {
                _id: "Fri:06-07",
                checked: true
              },
              {
                _id: "Fri:07-08",
                checked: true
              },
              {
                _id: "Fri:08-09",
                checked: true
              },
              {
                _id: "Fri:09-10",
                checked: true
              },
              {
                _id: "Fri:10-11",
                checked: true
              },
              {
                _id: "Fri:11-12",
                checked: true
              },
              {
                _id: "Fri:12-13",
                checked: true
              },
              {
                _id: "Fri:13-14",
                checked: true
              },
              {
                _id: "Fri:14-15",
                checked: true
              },
              {
                _id: "Fri:15-16",
                checked: true
              },
              {
                _id: "Fri:16-17",
                checked: true
              },
              {
                _id: "Fri:17-18",
                checked: true
              },
              {
                _id: "Fri:18-19",
                checked: true
              },
              {
                _id: "Fri:19-20",
                checked: true
              },
              {
                _id: "Fri:20-21",
                checked: true
              },
              {
                _id: "Fri:21-22",
                checked: true
              },
              {
                _id: "Fri:22-23",
                checked: true
              },
              {
                _id: "Fri:23-00",
                checked: true
              },

              {
                _id: "Sat:00-01",
                checked: true
              },
              {
                _id: "Sat:01-02",
                checked: true
              },
              {
                _id: "Sat:02-03",
                checked: true
              },
              {
                _id: "Sat:03-04",
                checked: true
              },
              {
                _id: "Sat:04-05",
                checked: true
              },
              {
                _id: "Sat:05-06",
                checked: true
              },
              {
                _id: "Sat:06-07",
                checked: true
              },
              {
                _id: "Sat:07-08",
                checked: true
              },
              {
                _id: "Sat:08-09",
                checked: true
              },
              {
                _id: "Sat:09-10",
                checked: true
              },
              {
                _id: "Sat:10-11",
                checked: true
              },
              {
                _id: "Sat:11-12",
                checked: true
              },
              {
                _id: "Sat:12-13",
                checked: true
              },
              {
                _id: "Sat:13-14",
                checked: true
              },
              {
                _id: "Sat:14-15",
                checked: true
              },
              {
                _id: "Sat:15-16",
                checked: true
              },
              {
                _id: "Sat:16-17",
                checked: true
              },
              {
                _id: "Sat:17-18",
                checked: true
              },
              {
                _id: "Sat:18-19",
                checked: true
              },
              {
                _id: "Sat:19-20",
                checked: true
              },
              {
                _id: "Sat:20-21",
                checked: true
              },
              {
                _id: "Sat:21-22",
                checked: true
              },
              {
                _id: "Sat:22-23",
                checked: true
              },
              {
                _id: "Sat:23-00",
                checked: true
              },

            ]
          }
        }
      );



    }

    blocks = blocks.map((item, i) => {



      return (

        <td>
          <ScheduleBlock
            key={item._id}
            item={item}
            DB_id={this.props.libraryItem._id}
          />
        </td>
      );
    });

    var row1 = blocks.slice(0, 24)
    var row2 = blocks.slice(24, 48)
    var row3 = blocks.slice(48, 72)
    var row4 = blocks.slice(72, 96)
    var row5 = blocks.slice(96, 120)
    var row6 = blocks.slice(120, 144)
    var row7 = blocks.slice(144, 168)






    return <table className="scheduleTable">
      <tbody>
        <tr>
          <td>Day</td>
          <td>{'\u00A0'}{'\u00A0'}00</td>
          <td>{'\u00A0'}{'\u00A0'}01</td>
          <td>{'\u00A0'}{'\u00A0'}02</td>
          <td>{'\u00A0'}{'\u00A0'}03</td>
          <td>{'\u00A0'}{'\u00A0'}04</td>
          <td>{'\u00A0'}{'\u00A0'}05</td>
          <td>{'\u00A0'}{'\u00A0'}06</td>
          <td>{'\u00A0'}{'\u00A0'}07</td>
          <td>{'\u00A0'}{'\u00A0'}08</td>
          <td>{'\u00A0'}{'\u00A0'}09</td>
          <td>{'\u00A0'}{'\u00A0'}10</td>
          <td>{'\u00A0'}{'\u00A0'}11</td>
          <td>{'\u00A0'}{'\u00A0'}12</td>
          <td>{'\u00A0'}{'\u00A0'}13</td>
          <td>{'\u00A0'}{'\u00A0'}14</td>
          <td>{'\u00A0'}{'\u00A0'}15</td>
          <td>{'\u00A0'}{'\u00A0'}16</td>
          <td>{'\u00A0'}{'\u00A0'}17</td>
          <td>{'\u00A0'}{'\u00A0'}18</td>
          <td>{'\u00A0'}{'\u00A0'}19</td>
          <td>{'\u00A0'}{'\u00A0'}20</td>
          <td>{'\u00A0'}{'\u00A0'}21</td>
          <td>{'\u00A0'}{'\u00A0'}22</td>
          <td>{'\u00A0'}{'\u00A0'}23</td>

        </tr>

        <tr> <td><Button variant="outline-dark" onClick={() => {

          Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 0, 24, function (error, result) { })

          this.setState({
            scheduleAll: !this.state.scheduleAll,
          })


        }}  >Toggle</Button>Sun </td> {row1}  </tr>
        <tr> <td><Button variant="outline-dark" onClick={() => {

          Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 24, 48, function (error, result) { })

          this.setState({
            scheduleAll: !this.state.scheduleAll,
          })


        }}  >Toggle</Button>Mon</td> {row2}  </tr>
        <tr> <td><Button variant="outline-dark" onClick={() => {

          Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 48, 72, function (error, result) { })

          this.setState({
            scheduleAll: !this.state.scheduleAll,
          })


        }}  >Toggle</Button>Tue</td> {row3}  </tr>
        <tr> <td><Button variant="outline-dark" onClick={() => {

          Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 72, 96, function (error, result) { })

          this.setState({
            scheduleAll: !this.state.scheduleAll,
          })


        }}  >Toggle</Button>Wed</td> {row4}  </tr>
        <tr> <td><Button variant="outline-dark" onClick={() => {

          Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 96, 120, function (error, result) { })

          this.setState({
            scheduleAll: !this.state.scheduleAll,
          })


        }}  >Toggle</Button>Thur</td> {row5}  </tr>
        <tr> <td><Button variant="outline-dark" onClick={() => {
          Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 120, 144, function (error, result) { })
          this.setState({
            scheduleAll: !this.state.scheduleAll,
          })


        }}  >Toggle</Button>Fri</td> {row6}  </tr>
        <tr> <td><Button variant="outline-dark" onClick={() => {
          Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 144, 168, function (error, result) { })
          this.setState({ scheduleAll: !this.state.scheduleAll, })
        }}  >Toggle</Button>Sat</td> {row7}  </tr>


      </tbody>
    </table>
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



    Meteor.call('scanFiles', this.props.libraryItem._id, this.props.libraryItem.folder, 1, mode, "Not attempted", "Not attempted", function (error, result) {
      Meteor.call('consolelog', result);

    });



  }

  resetAllStatus(mode) {

    if (confirm('Are you want reset all files ' + mode + ' status to "Not attempted"?')) {

      Meteor.call('resetAllStatus', mode, function (error, result) { })

    }


  }




  addPlugin(event) {

    event.preventDefault();



    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.addPluginText).value.trim();
    //using this to validate user
    Meteor.call('addPluginInclude', this.props.libraryItem._id, text, function (error, result) { });


    ReactDOM.findDOMNode(this.refs.addPluginText).value = '';
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

    if (confirm('Are you sure you want to delete this library? Your files will not be affected.')) {

      SettingsDB.remove(this.props.libraryItem._id);

      Meteor.call('removelibrary', this.props.libraryItem._id, function (error, result) { });

      Meteor.call('toggleFolderWatch', this.props.libraryItem.folder, this.props.libraryItem._id, false, function (error, result) { })

    }

  }




  render() {

    var backgroundColour = {
      backgroundColor: this.props.backgroundColour,
    }

    return (
      <span>

        <div className="libraryContainer" style={{ backgroundColor: this.props.backgroundColour }}>

          <div className="libraryContainerItems">
            <center>


              {/* UpdateMigration */}
              <input type="text" className="libraryTitle" name="name" defaultValue={this.props.libraryItem.name !== undefined ? this.props.libraryItem.name : "Library Title"} onChange={this.handleChange}></input>

              <br />
              <br />


              <Dropdown>
                <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                  Options
  </Dropdown.Toggle>

                <Dropdown.Menu>

                  <div className={this.props.libraryItem.scanButtons ? '' : 'hidden'} style={libButtonStyle}>
                    <Dropdown.Item style={{ color: 'green' }} onClick={() => this.scanFiles(0)} >Scan (Find new)</Dropdown.Item>
                    <Dropdown.Item style={{ color: 'green' }} onClick={() => this.scanFiles(1)} >Scan (Fresh)</Dropdown.Item>


                    <Dropdown.Item onClick={() => this.resetAllStatus('TranscodeDecisionMaker')}>Reset all transcode status</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.resetAllStatus('HealthCheck')}>Reset all health check status</Dropdown.Item>



                    <Dropdown.Item style={{ color: 'red' }} onClick={() => {

                      if (confirm('Are you sure you want to clear this library? Your files will not be affected.')) {
                        this.removeLibrary(this.props.libraryItem._id)
                      }
                    }

                    }>Clear library</Dropdown.Item>


                    <Dropdown.Item style={{ color: 'red' }} onClick={this.deleteThisLibrary.bind(this)}>Delete library</Dropdown.Item>


                  </div>


                </Dropdown.Menu>
              </Dropdown>



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





            </center>


            {/* <span > <strong>{this.props.libraryItem.folder}</strong>  </span> */}


            <p> </p>
            <center>
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



                {'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}Process Library:
                <div style={libButtonStyle}>
                  <ToggleButton


                    value={this.props.libraryItem.processLibrary === undefined ? true : !!this.props.libraryItem.processLibrary}
                    onToggle={() => {

                      console.log("here")
                      console.log(this.props.libraryItem._id)

                      console.log(this.props.libraryItem.processLibrary)

                      SettingsDB.upsert(

                        this.props.libraryItem._id,
                        {
                          $set: {
                            processLibrary: !this.props.libraryItem.processLibrary,
                          }
                        }
                      );
                    }

                    }
                  />
                </div>













              </div>

            </center>


            <input type="text" className="folderPaths" ref={this.props.libraryItem._id + 'f'} name="folder" defaultValue={this.props.libraryItem.folder} onChange={this.handleChange}></input>




            <div className={this.props.libraryItem.folderValid ? 'hidden' : ''}>
              <span className="invalidFolder" ><center> Invalid folder </center></span>
            </div>

            <div className="folderResults">

              <Button variant="outline-dark" onClick={() => {

                this.setState({
                  folderBrowser: !this.state.folderBrowser,
                })


              }} >{this.state.folderBrowser ? 'Hide' : 'Show'} browser</Button>

            </div>

            <div className={this.state.folderBrowser ? '' : 'hidden'}>
              <div id={this.props.libraryItem._id + 'fResults'} className="folderResults"></div>
            </div>



            <div id="folderList">

            </div>


            <p></p>
            <center>  <Button variant="outline-info" onClick={this.showHideSettings} >{this.props.libraryItem.expanded ? 'Hide' : 'Show'} settings</Button> </center>

            <div className={this.props.libraryItem.expanded ? '' : 'hidden'}>

              <p></p>
              <p></p>

              <center>  <p> Transcode cache folder:</p>  </center>

              <input type="text" className="folderPaths" ref={this.props.libraryItem._id + 'c'} name="cache" defaultValue={this.props.libraryItem.cache} onChange={this.handleChange}></input>

              <div className={this.props.libraryItem.cacheValid ? 'hidden' : ''}>

                <span className="invalidFolder" ><center> Invalid folder </center></span>

              </div>



              <div className="folderResults">

                <Button variant="outline-dark" onClick={() => {

                  this.setState({
                    cacheBrowser: !this.state.cacheBrowser,
                  })


                }} >{this.state.cacheBrowser ? 'Hide' : 'Show'} browser</Button>

              </div>

              <div className={this.state.cacheBrowser ? '' : 'hidden'}>

                <div id={this.props.libraryItem._id + 'cResults'} className="folderResults"></div>
              </div>

              <p></p>
              <p></p>

              <center>  <p>Container types to scan for:</p>  </center>

              <input type="text" className="folderPaths" name="containerFilter" defaultValue={this.props.libraryItem.containerFilter} onChange={this.handleChange}></input>



              <p></p>
              <p></p>

              <center> <p>Transcode Decision Maker</p>  </center>


              <center>

                Plugin: <div style={libButtonStyle}><ToggleButton

                  value={!!this.props.libraryItem.decisionMaker.pluginFilter}
                  onToggle={() => {

                    if (!this.props.libraryItem.decisionMaker.pluginFilter == true) {


                      SettingsDB.upsert(
                        this.props.libraryItem._id,
                        {
                          $set: {
                            "decisionMaker.pluginFilter": !this.props.libraryItem.decisionMaker.pluginFilter,
                            "decisionMaker.videoFilter": !!this.props.libraryItem.decisionMaker.pluginFilter,
                            "decisionMaker.audioFilter": !!this.props.libraryItem.decisionMaker.pluginFilter,
                          }
                        }
                      );


                    } else {

                      SettingsDB.upsert(
                        this.props.libraryItem._id,
                        {
                          $set: {
                            "decisionMaker.pluginFilter": !this.props.libraryItem.decisionMaker.pluginFilter,
                          }
                        }
                      );


                    }


                  }

                  }
                /></div>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}

                Video library: <div style={libButtonStyle}><ToggleButton

                  value={!!this.props.libraryItem.decisionMaker.videoFilter}
                  onToggle={() => {

                    if (!this.props.libraryItem.decisionMaker.videoFilter == true) {

                      SettingsDB.upsert(
                        this.props.libraryItem._id,
                        {
                          $set: {
                            "decisionMaker.videoFilter": !this.props.libraryItem.decisionMaker.videoFilter,
                            "decisionMaker.pluginFilter": !!this.props.libraryItem.decisionMaker.videoFilter,
                            "decisionMaker.audioFilter": !!this.props.libraryItem.decisionMaker.videoFilter,
                          }
                        }
                      );

                    } else {
                      SettingsDB.upsert(
                        this.props.libraryItem._id,
                        {
                          $set: {
                            "decisionMaker.videoFilter": !this.props.libraryItem.decisionMaker.videoFilter,
                          }
                        }
                      );


                    }
                  }

                  }
                /></div>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}


                Audio library:
<div style={libButtonStyle}> <ToggleButton

                  value={!!this.props.libraryItem.decisionMaker.audioFilter}
                  onToggle={() => {

                    if (!this.props.libraryItem.decisionMaker.audioFilter == true) {

                      SettingsDB.upsert(

                        this.props.libraryItem._id,
                        {
                          $set: {
                            "decisionMaker.audioFilter": !this.props.libraryItem.decisionMaker.audioFilter,
                            "decisionMaker.pluginFilter": !!this.props.libraryItem.decisionMaker.audioFilter,
                            "decisionMaker.videoFilter": !!this.props.libraryItem.decisionMaker.audioFilter,
                          }
                        }
                      );

                    } else {

                      SettingsDB.upsert(

                        this.props.libraryItem._id,
                        {
                          $set: {
                            "decisionMaker.audioFilter": !this.props.libraryItem.decisionMaker.audioFilter,
                          }
                        }
                      );



                    }
                  }

                  }
                /></div>

              </center>

              <div className={!!this.props.libraryItem.decisionMaker.pluginFilter ? '' : 'hidden'}>

                <center>
                  <p>Community:
<Checkbox name="community" checked={!!this.props.libraryItem.pluginCommunity} onChange={this.handleChangeChkBx} />
                    Local:
<Checkbox name="local" checked={!this.props.libraryItem.pluginCommunity} onChange={this.handleChangeChkBx} />
                  </p>
                </center>

                <center>
                  <p>Plugin ID:</p>
                </center>



                <form onSubmit={this.addPlugin.bind(this)} >
                  <input
                    type="text"
                    ref="addPluginText"
                    placeholder="Add Plugin IDs(use Enter↵)"
                    className="folderPaths"
                    name="pluginID"
                    onChange={this.handleChange}
                  />
                </form>

                <div className={this.props.libraryItem.pluginValid ? 'hidden' : ''}>
                  <div className={this.props.libraryItem.pluginID == '' ? 'hidden' : ''}>
                    <span className="invalidFolder" ><center> Invalid plugin </center></span>
                  </div>
                </div>

                <p></p>
                <p></p>

                <center><p>Plugin Stack:</p>  </center>
                <center>

                  <table><tbody>
                    {this.renderPlugins()}
                  </tbody>
                  </table>

                </center>




                {/* <input type="text" className="folderPaths" name="pluginID" defaultValue={this.props.libraryItem.pluginID} onChange={this.handleChange}></input> */}




              </div>

              <div className={!!this.props.libraryItem.decisionMaker.pluginFilter ? 'hidden' : !!this.props.libraryItem.decisionMaker.videoFilter ? '' : !!this.props.libraryItem.decisionMaker.audioFilter ? '' : 'hidden'}>

                <center><p>Output file container: </p>  </center>

                <input type="text" name="container" className="folderPaths" defaultValue={this.props.libraryItem.container} onChange={this.handleChange}></input>



                <center><p>HandBrake:
<Checkbox name="handbrake" checked={!!this.props.libraryItem.handbrake} onChange={this.handleChangeChkBx} />
                  FFmpeg:
<Checkbox name="ffmpeg" checked={!!this.props.libraryItem.ffmpeg} onChange={this.handleChangeChkBx} />
                </p>  </center>

                <center><p>CLI arguments/preset: </p>  </center>
                <input type="text" name="preset" className="folderPaths" defaultValue={this.props.libraryItem.preset} onChange={this.handleChange}></input>






              </div>

              <div className={!!this.props.libraryItem.decisionMaker.audioFilter ? 'hidden' : ''}>


                <p></p>
                <p></p>


                <center><p>Health check type:</p>
                  <p>Quick:
        <Checkbox name="handbrakescan" checked={!!this.props.libraryItem.handbrakescan} onChange={this.handleChangeChkBx} />
                    Thorough:
        <Checkbox name="ffmpegscan" checked={!!this.props.libraryItem.ffmpegscan} onChange={this.handleChangeChkBx} />
                  </p>  </center>

              </div>
              <div className={!!this.props.libraryItem.decisionMaker.videoFilter ? '' : 'hidden'}>


                <p></p>
                <p></p>
                <center>  <p>Don't transcode videos already in these codecs:</p>  </center>


                <form onSubmit={this.addVideoCodecExclude.bind(this)} >
                  <input
                    type="text"
                    ref="addVideoCodecExcludeText"
                    placeholder="Add new video codecs...(use Enter↵)"
                    className="folderPaths"
                  />
                </form>

                <center>

                  <table><tbody>
                    {this.renderVideoCodecsExclude()}
                  </tbody>
                  </table>


                </center>

                <center> <p>Video size range (MB)</p>  </center>

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



                <center><p>Video resolution height range (px)</p>  </center>

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




                <center> <p>Video resolution width range (px)</p>  </center>

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





              <div className={!!this.props.libraryItem.decisionMaker.audioFilter ? '' : 'hidden'}>
                <p></p>
                <p></p>
                <center> <p>Don't transcode audio already in these codecs:</p>  </center>

                <form onSubmit={this.addAudioCodecExclude.bind(this)} >
                  <input
                    type="text"
                    ref="addAudioCodecExcludeText"
                    placeholder="Add new audio codecs...(use Enter↵)"
                    className="folderPaths"
                  />
                </form>


                <center>

                  <table><tbody>
                    {this.renderAudioCodecsExclude()}
                  </tbody>
                  </table>


                </center>

                <center><p>Audio size range (MB)</p>  </center>


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


              <center><p>Schedule:  <Button variant="outline-dark" onClick={() => {

                Meteor.call('toggleSchedule', this.props.libraryItem._id, this.state.scheduleAll, 0, 168, function (error, result) { })

                this.setState({
                  scheduleAll: !this.state.scheduleAll,
                })



              }}  >Toggle all</Button></p>  </center>
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


