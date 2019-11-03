import {css} from '@emotion/core';
import Checkbox from '@material-ui/core/Checkbox';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import React, {Component} from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import ReactDOM, {render} from 'react-dom';
import InputRange from 'react-input-range';
import ToggleButton from 'react-toggle-button';

import {GlobalSettingsDB, SettingsDB} from '../../api/tasks.js';
import Plugin from '../Plugin.jsx';
import AudioCodec from './AudioCodec.jsx';
import ScheduleBlock from './ScheduleBlock.jsx';
import VideoCodec from './VideoCodec.jsx';

const borderRadiusStyle = {borderRadius: 2};

import ScaleLoader from 'react-spinners/ScaleLoader';

var libButtonStyle = {
  display: 'inline-block',
};

const override = css``;

class Folder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scheduleAll: false,
      folderBrowser: false,
      cacheBrowser: false,
      navItemSelected: 'navSourceFolder',
    };

    this.scanFiles = this.scanFiles.bind(this);
    this.toggleFolderWatch = this.toggleFolderWatch.bind(this);

    this.removeLibrary = this.removeLibrary.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeChkBx = this.handleChangeChkBx.bind(this);
    this.showHideSettings = this.showHideSettings.bind(this);
  }

  componentDidMount = () => {
    this.verifyFolder(
      // eslint-disable-next-line
      ReactDOM.findDOMNode(this.refs[this.props.libraryItem._id + 'f']).value,
      'folder',
      this.props.libraryItem._id + 'f'
    );

    this.verifyFolder(
      // eslint-disable-next-line
      ReactDOM.findDOMNode(this.refs[this.props.libraryItem._id + 'f']).value,
      'cache',
      this.props.libraryItem._id + 'c'
    );
  };

  toggleFolderWatch = status => {
    Meteor.call('toggleFolderWatch', status, this.props.libraryItem._id, false);
  };

  verifyFolder = (folderPath, type, refType) => {
    Meteor.call(
      'verifyFolder',
      folderPath,
      this.props.libraryItem._id,
      type + 'Valid',
      (error, result) => {
        if (result !== undefined && result.length == 0) {
          render(
            <Button
              variant="outline-light"
              onClick={() => {
                // eslint-disable-next-line
                var temp = ReactDOM.findDOMNode(this.refs[refType]).value;
                temp = temp.replace(/\\/g, '/');

                temp = temp.split('/');
                var idx = temp.length - 1;
                temp.splice(idx, 1);
                temp = temp.join('/');

                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    [type]: temp,
                  },
                });
                // eslint-disable-next-line
                ReactDOM.findDOMNode(this.refs[refType]).value = temp;
                this.verifyFolder(temp, type, refType);
              }}
            >
              Back
            </Button>,

            document.getElementById(refType + 'Results')
          );
        } else {
          var results = result.map((row, i) => {
            return (
              <tr key={`results-row-${i}`}>
                <td>
                  <p>{row.folder}</p>
                </td>

                <td>
                  {' '}
                  <Button
                    variant="outline-light"
                    onClick={() => {
                      SettingsDB.upsert(this.props.libraryItem._id, {
                        $set: {
                          [type]: row.fullPath.replace(/\\/g, '/'),
                        },
                      });
                      // eslint-disable-next-line
                      ReactDOM.findDOMNode(this.refs[refType]
                      ).value = row.fullPath.replace(/\\/g, '/');

                      this.verifyFolder(
                        row.fullPath.replace(/\\/g, '/'),
                        type,
                        refType
                      );
                    }}
                  >
                    →
                  </Button>
                </td>
              </tr>
            );
          });

          render(
            <div>
              <Button
                variant="outline-light"
                onClick={() => {
                  // eslint-disable-next-line
                  var temp = ReactDOM.findDOMNode(this.refs[refType]).value;
                  temp = temp.replace(/\\/g, '/');

                  temp = temp.split('/');
                  var idx = temp.length - 1;
                  temp.splice(idx, 1);
                  temp = temp.join('/');

                  SettingsDB.upsert(this.props.libraryItem._id, {
                    $set: {
                      [type]: temp,
                    },
                  });
                  // eslint-disable-next-line
                  ReactDOM.findDOMNode(this.refs[refType]).value = temp;
                  this.verifyFolder(temp, type, refType);
                }}
              >
                Back
              </Button>

              <table>
                <tbody>{results}</tbody>
              </table>
            </div>,
            document.getElementById(refType + 'Results')
          );
        }
      }
    );
  };

  handleChange(event) {
    //turn off folder watcher if folder name change detected
    if (event.target.name == 'folder') {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          folderWatching: false,
        },
      });

      //

      this.toggleFolderWatch(event.target.value);

      this.verifyFolder(
        event.target.value,
        'folder',
        this.props.libraryItem._id + 'f'
      );
    }

    if (event.target.name == 'cache') {
      this.verifyFolder(
        event.target.value,
        'cache',
        this.props.libraryItem._id + 'c'
      );
    }

    if (event.target.name == 'pluginID') {
      Meteor.call(
        'verifyPlugin',
        event.target.value,
        this.props.libraryItem._id,
        this.props.libraryItem.pluginCommunity
      );
    }

    //this.setState({folder: event.target.value});

    SettingsDB.upsert(this.props.libraryItem._id, {
      $set: {
        [event.target.name]: event.target.value,
      },
    });
  }

  handleChangeChkBx(event) {
    //this.setState({folder: event.target.value});
    SettingsDB.upsert(this.props.libraryItem._id, {
      $set: {
        [event.target.name]: event.target.checked,
      },
    });

    if (event.target.name == 'handbrake' && event.target.checked == true) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          ffmpeg: false,
        },
      });
    }

    if (event.target.name == 'ffmpeg' && event.target.checked == true) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          handbrake: false,
        },
      });
    }

    if (event.target.name == 'handbrakescan' && event.target.checked == true) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          ffmpegscan: false,
        },
      });
    }

    if (event.target.name == 'ffmpegscan' && event.target.checked == true) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          handbrakescan: false,
        },
      });
    }

    if (event.target.name == 'community' && event.target.checked == true) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          pluginCommunity: true,
        },
      });
    }

    if (event.target.name == 'local' && event.target.checked == true) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          pluginCommunity: false,
        },
      });
    }
  }

  renderPlugins() {
    var plugins = this.props.settings;

    plugins = plugins.filter(
      setting => setting._id == this.props.libraryItem._id
    );
    plugins = plugins[0].pluginIDs;

    return plugins.map(pluginItem => {
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
    var videoCodecsExclude = this.props.settings;

    videoCodecsExclude = videoCodecsExclude.filter(
      setting => setting._id == this.props.libraryItem._id
    );
    videoCodecsExclude =
      videoCodecsExclude[0].decisionMaker.video_codec_names_exclude;

    return videoCodecsExclude.map(videocodec => {
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
    var audioCodecsExclude = this.props.settings;
    audioCodecsExclude = audioCodecsExclude.filter(
      setting => setting._id == this.props.libraryItem._id
    );
    audioCodecsExclude =
      audioCodecsExclude[0].decisionMaker.audio_codec_names_exclude;

    return audioCodecsExclude.map(audiocodec => {
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
    var blocks = this.props.settings;
    blocks = blocks.filter(
      setting => setting._id == this.props.libraryItem._id
    );
    blocks = blocks[0].schedule;

    //UpdateMigration
    if (blocks.length < 168) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          schedule: [
            {
              _id: 'Sun:00-01',
              checked: true,
            },
            {
              _id: 'Sun:01-02',
              checked: true,
            },
            {
              _id: 'Sun:02-03',
              checked: true,
            },
            {
              _id: 'Sun:03-04',
              checked: true,
            },
            {
              _id: 'Sun:04-05',
              checked: true,
            },
            {
              _id: 'Sun:05-06',
              checked: true,
            },
            {
              _id: 'Sun:06-07',
              checked: true,
            },
            {
              _id: 'Sun:07-08',
              checked: true,
            },
            {
              _id: 'Sun:08-09',
              checked: true,
            },
            {
              _id: 'Sun:09-10',
              checked: true,
            },
            {
              _id: 'Sun:10-11',
              checked: true,
            },
            {
              _id: 'Sun:11-12',
              checked: true,
            },
            {
              _id: 'Sun:12-13',
              checked: true,
            },
            {
              _id: 'Sun:13-14',
              checked: true,
            },
            {
              _id: 'Sun:14-15',
              checked: true,
            },
            {
              _id: 'Sun:15-16',
              checked: true,
            },
            {
              _id: 'Sun:16-17',
              checked: true,
            },
            {
              _id: 'Sun:17-18',
              checked: true,
            },
            {
              _id: 'Sun:18-19',
              checked: true,
            },
            {
              _id: 'Sun:19-20',
              checked: true,
            },
            {
              _id: 'Sun:20-21',
              checked: true,
            },
            {
              _id: 'Sun:21-22',
              checked: true,
            },
            {
              _id: 'Sun:22-23',
              checked: true,
            },
            {
              _id: 'Sun:23-00',
              checked: true,
            },

            {
              _id: 'Mon:00-01',
              checked: true,
            },
            {
              _id: 'Mon:01-02',
              checked: true,
            },
            {
              _id: 'Mon:02-03',
              checked: true,
            },
            {
              _id: 'Mon:03-04',
              checked: true,
            },
            {
              _id: 'Mon:04-05',
              checked: true,
            },
            {
              _id: 'Mon:05-06',
              checked: true,
            },
            {
              _id: 'Mon:06-07',
              checked: true,
            },
            {
              _id: 'Mon:07-08',
              checked: true,
            },
            {
              _id: 'Mon:08-09',
              checked: true,
            },
            {
              _id: 'Mon:09-10',
              checked: true,
            },
            {
              _id: 'Mon:10-11',
              checked: true,
            },
            {
              _id: 'Mon:11-12',
              checked: true,
            },
            {
              _id: 'Mon:12-13',
              checked: true,
            },
            {
              _id: 'Mon:13-14',
              checked: true,
            },
            {
              _id: 'Mon:14-15',
              checked: true,
            },
            {
              _id: 'Mon:15-16',
              checked: true,
            },
            {
              _id: 'Mon:16-17',
              checked: true,
            },
            {
              _id: 'Mon:17-18',
              checked: true,
            },
            {
              _id: 'Mon:18-19',
              checked: true,
            },
            {
              _id: 'Mon:19-20',
              checked: true,
            },
            {
              _id: 'Mon:20-21',
              checked: true,
            },
            {
              _id: 'Mon:21-22',
              checked: true,
            },
            {
              _id: 'Mon:22-23',
              checked: true,
            },
            {
              _id: 'Mon:23-00',
              checked: true,
            },

            {
              _id: 'Tue:00-01',
              checked: true,
            },
            {
              _id: 'Tue:01-02',
              checked: true,
            },
            {
              _id: 'Tue:02-03',
              checked: true,
            },
            {
              _id: 'Tue:03-04',
              checked: true,
            },
            {
              _id: 'Tue:04-05',
              checked: true,
            },
            {
              _id: 'Tue:05-06',
              checked: true,
            },
            {
              _id: 'Tue:06-07',
              checked: true,
            },
            {
              _id: 'Tue:07-08',
              checked: true,
            },
            {
              _id: 'Tue:08-09',
              checked: true,
            },
            {
              _id: 'Tue:09-10',
              checked: true,
            },
            {
              _id: 'Tue:10-11',
              checked: true,
            },
            {
              _id: 'Tue:11-12',
              checked: true,
            },
            {
              _id: 'Tue:12-13',
              checked: true,
            },
            {
              _id: 'Tue:13-14',
              checked: true,
            },
            {
              _id: 'Tue:14-15',
              checked: true,
            },
            {
              _id: 'Tue:15-16',
              checked: true,
            },
            {
              _id: 'Tue:16-17',
              checked: true,
            },

            {
              _id: 'Tue:17-18',
              checked: true,
            },
            {
              _id: 'Tue:18-19',
              checked: true,
            },
            {
              _id: 'Tue:19-20',
              checked: true,
            },
            {
              _id: 'Tue:20-21',
              checked: true,
            },
            {
              _id: 'Tue:21-22',
              checked: true,
            },
            {
              _id: 'Tue:22-23',
              checked: true,
            },
            {
              _id: 'Tue:23-00',
              checked: true,
            },

            {
              _id: 'Wed:00-01',
              checked: true,
            },
            {
              _id: 'Wed:01-02',
              checked: true,
            },
            {
              _id: 'Wed:02-03',
              checked: true,
            },
            {
              _id: 'Wed:03-04',
              checked: true,
            },
            {
              _id: 'Wed:04-05',
              checked: true,
            },
            {
              _id: 'Wed:05-06',
              checked: true,
            },
            {
              _id: 'Wed:06-07',
              checked: true,
            },
            {
              _id: 'Wed:07-08',
              checked: true,
            },
            {
              _id: 'Wed:08-09',
              checked: true,
            },
            {
              _id: 'Wed:09-10',
              checked: true,
            },
            {
              _id: 'Wed:10-11',
              checked: true,
            },
            {
              _id: 'Wed:11-12',
              checked: true,
            },
            {
              _id: 'Wed:12-13',
              checked: true,
            },
            {
              _id: 'Wed:13-14',
              checked: true,
            },
            {
              _id: 'Wed:14-15',
              checked: true,
            },
            {
              _id: 'Wed:15-16',
              checked: true,
            },
            {
              _id: 'Wed:16-17',
              checked: true,
            },
            {
              _id: 'Wed:17-18',
              checked: true,
            },
            {
              _id: 'Wed:18-19',
              checked: true,
            },
            {
              _id: 'Wed:19-20',
              checked: true,
            },
            {
              _id: 'Wed:20-21',
              checked: true,
            },
            {
              _id: 'Wed:21-22',
              checked: true,
            },
            {
              _id: 'Wed:22-23',
              checked: true,
            },
            {
              _id: 'Wed:23-00',
              checked: true,
            },

            {
              _id: 'Thur:00-01',
              checked: true,
            },
            {
              _id: 'Thur:01-02',
              checked: true,
            },
            {
              _id: 'Thur:02-03',
              checked: true,
            },
            {
              _id: 'Thur:03-04',
              checked: true,
            },
            {
              _id: 'Thur:04-05',
              checked: true,
            },
            {
              _id: 'Thur:05-06',
              checked: true,
            },
            {
              _id: 'Thur:06-07',
              checked: true,
            },
            {
              _id: 'Thur:07-08',
              checked: true,
            },
            {
              _id: 'Thur:08-09',
              checked: true,
            },
            {
              _id: 'Thur:09-10',
              checked: true,
            },
            {
              _id: 'Thur:10-11',
              checked: true,
            },
            {
              _id: 'Thur:11-12',
              checked: true,
            },
            {
              _id: 'Thur:12-13',
              checked: true,
            },
            {
              _id: 'Thur:13-14',
              checked: true,
            },
            {
              _id: 'Thur:14-15',
              checked: true,
            },
            {
              _id: 'Thur:15-16',
              checked: true,
            },
            {
              _id: 'Thur:16-17',
              checked: true,
            },
            {
              _id: 'Thur:17-18',
              checked: true,
            },
            {
              _id: 'Thur:18-19',
              checked: true,
            },
            {
              _id: 'Thur:19-20',
              checked: true,
            },
            {
              _id: 'Thur:20-21',
              checked: true,
            },
            {
              _id: 'Thur:21-22',
              checked: true,
            },
            {
              _id: 'Thur:22-23',
              checked: true,
            },
            {
              _id: 'Thur:23-00',
              checked: true,
            },

            {
              _id: 'Fri:00-01',
              checked: true,
            },
            {
              _id: 'Fri:01-02',
              checked: true,
            },
            {
              _id: 'Fri:02-03',
              checked: true,
            },
            {
              _id: 'Fri:03-04',
              checked: true,
            },
            {
              _id: 'Fri:04-05',
              checked: true,
            },
            {
              _id: 'Fri:05-06',
              checked: true,
            },
            {
              _id: 'Fri:06-07',
              checked: true,
            },
            {
              _id: 'Fri:07-08',
              checked: true,
            },
            {
              _id: 'Fri:08-09',
              checked: true,
            },
            {
              _id: 'Fri:09-10',
              checked: true,
            },
            {
              _id: 'Fri:10-11',
              checked: true,
            },
            {
              _id: 'Fri:11-12',
              checked: true,
            },
            {
              _id: 'Fri:12-13',
              checked: true,
            },
            {
              _id: 'Fri:13-14',
              checked: true,
            },
            {
              _id: 'Fri:14-15',
              checked: true,
            },
            {
              _id: 'Fri:15-16',
              checked: true,
            },
            {
              _id: 'Fri:16-17',
              checked: true,
            },
            {
              _id: 'Fri:17-18',
              checked: true,
            },
            {
              _id: 'Fri:18-19',
              checked: true,
            },
            {
              _id: 'Fri:19-20',
              checked: true,
            },
            {
              _id: 'Fri:20-21',
              checked: true,
            },
            {
              _id: 'Fri:21-22',
              checked: true,
            },
            {
              _id: 'Fri:22-23',
              checked: true,
            },
            {
              _id: 'Fri:23-00',
              checked: true,
            },

            {
              _id: 'Sat:00-01',
              checked: true,
            },
            {
              _id: 'Sat:01-02',
              checked: true,
            },
            {
              _id: 'Sat:02-03',
              checked: true,
            },
            {
              _id: 'Sat:03-04',
              checked: true,
            },
            {
              _id: 'Sat:04-05',
              checked: true,
            },
            {
              _id: 'Sat:05-06',
              checked: true,
            },
            {
              _id: 'Sat:06-07',
              checked: true,
            },
            {
              _id: 'Sat:07-08',
              checked: true,
            },
            {
              _id: 'Sat:08-09',
              checked: true,
            },
            {
              _id: 'Sat:09-10',
              checked: true,
            },
            {
              _id: 'Sat:10-11',
              checked: true,
            },
            {
              _id: 'Sat:11-12',
              checked: true,
            },
            {
              _id: 'Sat:12-13',
              checked: true,
            },
            {
              _id: 'Sat:13-14',
              checked: true,
            },
            {
              _id: 'Sat:14-15',
              checked: true,
            },
            {
              _id: 'Sat:15-16',
              checked: true,
            },
            {
              _id: 'Sat:16-17',
              checked: true,
            },
            {
              _id: 'Sat:17-18',
              checked: true,
            },
            {
              _id: 'Sat:18-19',
              checked: true,
            },
            {
              _id: 'Sat:19-20',
              checked: true,
            },
            {
              _id: 'Sat:20-21',
              checked: true,
            },
            {
              _id: 'Sat:21-22',
              checked: true,
            },
            {
              _id: 'Sat:22-23',
              checked: true,
            },
            {
              _id: 'Sat:23-00',
              checked: true,
            },
          ],
        },
      });
    }

    blocks = blocks.map((item, i) => {
      return (
        <td key={`block-item-${i}`}>
          <ScheduleBlock
            key={item._id}
            item={item}
            DB_id={this.props.libraryItem._id}
          />
        </td>
      );
    });

    var row1 = blocks.slice(0, 24);
    var row2 = blocks.slice(24, 48);
    var row3 = blocks.slice(48, 72);
    var row4 = blocks.slice(72, 96);
    var row5 = blocks.slice(96, 120);
    var row6 = blocks.slice(120, 144);
    var row7 = blocks.slice(144, 168);

    return (
      <table className="scheduleTable">
        <tbody>
          <tr>
            <td>
              <span className="scheduleButton">Day</span>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(0, 24, 'Hour')}
              >
                <span className="scheduleButton">00</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(1, 24, 'Hour')}
              >
                <span className="scheduleButton">01</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(2, 24, 'Hour')}
              >
                <span className="scheduleButton">02</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(3, 24, 'Hour')}
              >
                <span className="scheduleButton">03</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(4, 24, 'Hour')}
              >
                <span className="scheduleButton">04</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(5, 24, 'Hour')}
              >
                <span className="scheduleButton">05</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(6, 24, 'Hour')}
              >
                <span className="scheduleButton">06</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(7, 24, 'Hour')}
              >
                <span className="scheduleButton">07</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(8, 24, 'Hour')}
              >
                <span className="scheduleButton">08</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(9, 24, 'Hour')}
              >
                <span className="scheduleButton">09</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(10, 24, 'Hour')}
              >
                <span className="scheduleButton">10</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(11, 24, 'Hour')}
              >
                <span className="scheduleButton">11</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(12, 24, 'Hour')}
              >
                <span className="scheduleButton">12</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(13, 24, 'Hour')}
              >
                <span className="scheduleButton">13</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(14, 24, 'Hour')}
              >
                <span className="scheduleButton">14</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(15, 24, 'Hour')}
              >
                <span className="scheduleButton">15</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(16, 24, 'Hour')}
              >
                <span className="scheduleButton">16</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(17, 24, 'Hour')}
              >
                <span className="scheduleButton">17</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(18, 24, 'Hour')}
              >
                <span className="scheduleButton">18</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(19, 24, 'Hour')}
              >
                <span className="scheduleButton">19</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(20, 24, 'Hour')}
              >
                <span className="scheduleButton">20</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(21, 24, 'Hour')}
              >
                <span className="scheduleButton">21</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(22, 24, 'Hour')}
              >
                <span className="scheduleButton">22</span>
              </Button>
            </td>
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(23, 24, 'Hour')}
              >
                <span className="scheduleButton">23</span>
              </Button>
            </td>
          </tr>

          <tr>
            {' '}
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(0, 24)}
                block
              >
                <span className="scheduleButton">Sun</span>
              </Button>
            </td>{' '}
            {row1}{' '}
          </tr>
          <tr>
            {' '}
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(24, 48)}
                block
              >
                <span className="scheduleButton">Mon</span>
              </Button>
            </td>{' '}
            {row2}{' '}
          </tr>
          <tr>
            {' '}
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(48, 72)}
                block
              >
                <span className="scheduleButton">Tue</span>
              </Button>
            </td>{' '}
            {row3}{' '}
          </tr>
          <tr>
            {' '}
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(72, 96)}
                block
              >
                <span className="scheduleButton">Wed</span>
              </Button>
            </td>{' '}
            {row4}{' '}
          </tr>
          <tr>
            {' '}
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(96, 120)}
                block
              >
                <span className="scheduleButton">Thur</span>
              </Button>
            </td>{' '}
            {row5}{' '}
          </tr>
          <tr>
            {' '}
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(120, 144)}
                block
              >
                <span className="scheduleButton">Fri</span>
              </Button>
            </td>{' '}
            {row6}{' '}
          </tr>
          <tr>
            {' '}
            <td>
              <Button
                variant="outline-light"
                onClick={() => this.toggleSchedule(144, 168)}
                block
              >
                <span className="scheduleButton">Sat</span>
              </Button>
            </td>{' '}
            {row7}{' '}
          </tr>
        </tbody>
      </table>
    );
  };

  toggleSchedule(start, end, type) {
    Meteor.call(
      'toggleSchedule',
      this.props.libraryItem._id,
      this.state.scheduleAll,
      start,
      end,
      type
    );

    this.setState({
      scheduleAll: !this.state.scheduleAll,
    });
  }

  showHideSettings() {
    SettingsDB.upsert(this.props.libraryItem._id, {
      $set: {
        expanded: !this.props.libraryItem.expanded,
      },
    });
  }

  removeLibrary() {
    Meteor.call('removelibrary', this.props.libraryItem._id);
  }

  scanFiles = mode => {
    if (mode == 1) {
      if (
        confirm(
          'Are you sure you want to run a fresh scan on all files? All files will be-rescanned and placed into the transcode and health check queues.'
        )
      ) {
        this.scanFilesRun(mode);
      }
    } else {
      this.scanFilesRun(mode);
    }
  };

  scanFilesRun = mode => {
    SettingsDB.upsert(this.props.libraryItem._id, {
      $set: {
        scanButtons: false,
      },
    });

    var obj = {
      HealthCheck: 'Queued',
      TranscodeDecisionMaker: 'Queued',
      cliLog: '',
      bumped: false,
      history: '',
    };

    Meteor.call(
      'scanFiles',
      this.props.libraryItem._id,
      this.props.libraryItem.folder,
      1,
      mode,
      obj
    );
  };

  resetAllStatus(mode) {
    if (confirm('Are you sure you want to re-queue all files?')) {
      Meteor.call('resetAllStatus', this.props.libraryItem._id, mode);
    }
  }

  addPlugin(event) {
    event.preventDefault();

    // eslint-disable-next-line
    const text = ReactDOM.findDOMNode(this.refs.addPluginText).value.trim();
    Meteor.call('addPluginInclude', this.props.libraryItem._id, text);
    // eslint-disable-next-line
    ReactDOM.findDOMNode(this.refs.addPluginText).value = '';
  }

  addVideoCodecExclude(event) {
    event.preventDefault();
    // eslint-disable-next-line
    const text = ReactDOM.findDOMNode(this.refs.addVideoCodecExcludeText
    ).value.trim();

    Meteor.call('addVideoCodecExclude', this.props.libraryItem._id, text);
    // eslint-disable-next-line
    ReactDOM.findDOMNode(this.refs.addVideoCodecExcludeText).value = '';
  }

  addAudioCodecExclude(event) {
    event.preventDefault();
    // eslint-disable-next-line
    const text = ReactDOM.findDOMNode(this.refs.addAudioCodecExcludeText
    ).value.trim();

    Meteor.call('addAudioCodecExclude', this.props.libraryItem._id, text);
    // eslint-disable-next-line
    ReactDOM.findDOMNode(this.refs.addAudioCodecExcludeText).value = '';
  }

  deleteThisLibrary() {
    if (
      confirm(
        'Are you sure you want to delete this library? Your files will not be affected.'
      )
    ) {
      var libraries = this.props.settings;

      for (var i = 0; i < libraries.length; i++) {
        if (libraries[i].priority > this.props.libraryItem.priority) {
          SettingsDB.upsert(libraries[i]._id, {
            $set: {
              priority: libraries[i].priority - 1,
            },
          });
        }
      }

      if (
        this.props.libraryItem.priority == libraries.length - 1 &&
        this.props.libraryItem.priority !== 0
      ) {
        GlobalSettingsDB.upsert('globalsettings', {
          $set: {
            selectedLibrary: this.props.libraryItem.priority - 1,
          },
        });
      }

      SettingsDB.remove(this.props.libraryItem._id);

      Meteor.call('removelibrary', this.props.libraryItem._id);

      Meteor.call(
        'toggleFolderWatch',
        this.props.libraryItem.folder,
        this.props.libraryItem._id,
        false
      );
    }
  }

  render() {
    return (
      <div className="libraryContainer2">
        <br />
        <br />

        <center>
          {/* UpdateMigration */}
          <input
            type="text"
            className="libraryTitle"
            name="name"
            defaultValue={
              this.props.libraryItem.name !== undefined
                ? this.props.libraryItem.name
                : 'Library Title'
            }
            onChange={this.handleChange}
          ></input>

          <br />
          <br />

          <Dropdown>
            <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
              Options
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div
                className={this.props.libraryItem.scanButtons ? '' : 'hidden'}
              >
                <Dropdown.Item
                  style={{color: 'green', fontSize: '14px'}}
                  onClick={() => this.scanFiles(0)}
                >
                  Scan (Find new)
                </Dropdown.Item>
                <Dropdown.Item
                  style={{color: 'green', fontSize: '14px'}}
                  onClick={() => this.scanFiles(1)}
                >
                  Scan (Fresh)
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => this.resetAllStatus('TranscodeDecisionMaker')}
                >
                  <p>Requeue all items (transcode)</p>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.resetAllStatus('HealthCheck')}
                >
                  <p>Requeue all items (health check)</p>
                </Dropdown.Item>

                <Dropdown.Item
                  style={{color: '#bb86fc', fontSize: '14px'}}
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure you want to clear this library? Your files will not be affected.'
                      )
                    ) {
                      this.removeLibrary(this.props.libraryItem._id);
                    }
                  }}
                >
                  Clear library
                </Dropdown.Item>

                <Dropdown.Item
                  style={{color: '#bb86fc', fontSize: '14px'}}
                  onClick={this.deleteThisLibrary.bind(this)}
                >
                  Delete library
                </Dropdown.Item>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <p>
            <br />
            <br />
            <Button
              variant="outline-light"
              onClick={() => {
                var libraries = this.props.settings;

                if (this.props.libraryItem.priority !== 0) {
                  GlobalSettingsDB.upsert('globalsettings', {
                    $set: {
                      selectedLibrary: this.props.libraryItem.priority - 1,
                    },
                  });

                  SettingsDB.upsert(this.props.libraryItem._id, {
                    $set: {
                      priority: this.props.libraryItem.priority - 1,
                    },
                  });

                  SettingsDB.upsert(
                    libraries[this.props.libraryItem.priority - 1]._id,
                    {
                      $set: {
                        priority: this.props.libraryItem.priority,
                      },
                    }
                  );
                }
              }}
            >
              <span className="buttonTextSize">←</span>
            </Button>
            {'\u00A0'}
            {'\u00A0'}Priority:{this.props.libraryItem.priority + 1} {'\u00A0'}
            {'\u00A0'}
            <Button
              variant="outline-light"
              onClick={() => {
                var libraries = this.props.settings;

                if (this.props.libraryItem.priority !== libraries.length - 1) {
                  GlobalSettingsDB.upsert('globalsettings', {
                    $set: {
                      selectedLibrary: this.props.libraryItem.priority + 1,
                    },
                  });

                  SettingsDB.upsert(this.props.libraryItem._id, {
                    $set: {
                      priority: this.props.libraryItem.priority + 1,
                    },
                  });

                  SettingsDB.upsert(
                    libraries[this.props.libraryItem.priority + 1]._id,
                    {
                      $set: {
                        priority: this.props.libraryItem.priority,
                      },
                    }
                  );
                }
              }}
            >
              <span className="buttonTextSize">→</span>
            </Button>
          </p>

          <div
            className={this.props.libraryItem.scanButtons ? 'hidden' : ''}
            style={libButtonStyle}
          >
            <span>
              <p>{this.props.libraryItem.scanFound}</p>
            </span>

            <div className="sweet-loading">
              <ScaleLoader
                css={override}
                sizeUnit={'px'}
                size={15}
                color={'white'}
                loading={true}
              />
            </div>
          </div>
        </center>

        <br />
        <br />
        <br />
        <br />
        <div className="libraryGrid-container">
          <div className="libraryGrid-itemLeft">
            <p
              onClick={() => {
                this.setState({
                  navItemSelected: 'navSourceFolder',
                });
              }}
              className={
                this.state.navItemSelected == 'navSourceFolder'
                  ? 'selectedNav'
                  : ''
              }
            >
              Source
            </p>

            <p
              onClick={() => {
                this.setState({
                  navItemSelected: 'navCacheFolder',
                });
              }}
              className={
                this.state.navItemSelected == 'navCacheFolder'
                  ? 'selectedNav'
                  : ''
              }
            >
              Transcode cache
            </p>

            <p
              onClick={() => {
                this.setState({
                  navItemSelected: 'navContainers',
                });
              }}
              className={
                this.state.navItemSelected == 'navContainers'
                  ? 'selectedNav'
                  : ''
              }
            >
              Containers
            </p>

            <p
              onClick={() => {
                this.setState({
                  navItemSelected: 'navTranscode',
                });
              }}
              className={
                this.state.navItemSelected == 'navTranscode'
                  ? 'selectedNav'
                  : ''
              }
            >
              Transcode
            </p>

            <p
              onClick={() => {
                this.setState({
                  navItemSelected: 'navHealthCheck',
                });
              }}
              className={
                this.state.navItemSelected == 'navHealthCheck'
                  ? 'selectedNav'
                  : ''
              }
            >
              Health check
            </p>

            <p
              onClick={() => {
                this.setState({
                  navItemSelected: 'navSchedule',
                });
              }}
              className={
                this.state.navItemSelected == 'navSchedule' ? 'selectedNav' : ''
              }
            >
              Schedule
            </p>
          </div>

          <div className="libraryGrid-itemRight">
            <div
              className={
                this.state.navItemSelected == 'navSourceFolder' ? '' : 'hidden'
              }
            >
              <div style={libButtonStyle}>
                <span className="buttonTextSize"></span>
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'} <span className="buttonTextSize">Folder watch:</span>
                <div style={libButtonStyle}>
                  <ToggleButton
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    name="folderWatching"
                    value={!!this.props.libraryItem.folderWatching || false}
                    onToggle={() => {
                      SettingsDB.upsert(this.props.libraryItem._id, {
                        $set: {
                          folderWatching: !this.props.libraryItem
                            .folderWatching,
                        },
                      });

                      Meteor.call(
                        'toggleFolderWatch',
                        this.props.libraryItem.folder,
                        this.props.libraryItem._id,
                        !this.props.libraryItem.folderWatching
                      );
                    }}
                  />
                </div>
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                <span className="buttonTextSize">Process Library:</span>
                <div style={libButtonStyle}>
                  <ToggleButton
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    value={
                      this.props.libraryItem.processLibrary === undefined
                        ? true
                        : !!this.props.libraryItem.processLibrary
                    }
                    onToggle={() => {
                      SettingsDB.upsert(this.props.libraryItem._id, {
                        $set: {
                          processLibrary: !this.props.libraryItem
                            .processLibrary,
                        },
                      });
                    }}
                  />
                </div>
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                <span className="buttonTextSize">Scan on start:</span>
                <div style={libButtonStyle}>
                  <ToggleButton
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    value={
                      this.props.libraryItem.scanOnStart === undefined
                        ? true
                        : !!this.props.libraryItem.scanOnStart
                    }
                    onToggle={() => {
                      SettingsDB.upsert(this.props.libraryItem._id, {
                        $set: {
                          scanOnStart: !this.props.libraryItem.scanOnStart,
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <br /> <br /> <br />
              <p>Source:</p>
              <input
                type="text"
                className="folderPaths"
                ref={this.props.libraryItem._id + 'f'}
                name="folder"
                defaultValue={this.props.libraryItem.folder}
                onChange={this.handleChange}
              ></input>
              <div
                className={this.props.libraryItem.folderValid ? 'hidden' : ''}
              >
                <span className="invalidFolder">
                  <center> Invalid folder </center>
                </span>
              </div>
              <br />
              <br />
              <div className="folderResults">
                <Button
                  variant="outline-light"
                  onClick={() => {
                    this.setState({
                      folderBrowser: !this.state.folderBrowser,
                    });
                  }}
                >
                  <span className="buttonTextSize">
                    {this.state.folderBrowser ? 'Hide' : 'Show'} browser
                  </span>
                </Button>

                <br />
                <br />
              </div>
              <div className={this.state.folderBrowser ? '' : 'hidden'}>
                <div
                  id={this.props.libraryItem._id + 'fResults'}
                  className="folderResults"
                ></div>
              </div>
              <div id="folderList"></div>
            </div>

            <div
              className={
                this.state.navItemSelected == 'navCacheFolder' ? '' : 'hidden'
              }
            >
              <p> Transcode cache:</p>

              <input
                type="text"
                className="folderPaths"
                ref={this.props.libraryItem._id + 'c'}
                name="cache"
                defaultValue={this.props.libraryItem.cache}
                onChange={this.handleChange}
              ></input>

              <div
                className={this.props.libraryItem.cacheValid ? 'hidden' : ''}
              >
                <span className="invalidFolder">
                  <center> Invalid folder </center>
                </span>
              </div>

              <br />
              <br />

              <div className="folderResults">
                <Button
                  variant="outline-light"
                  onClick={() => {
                    this.setState({
                      cacheBrowser: !this.state.cacheBrowser,
                    });
                  }}
                >
                  <span className="buttonTextSize">
                    {this.state.cacheBrowser ? 'Hide' : 'Show'} browser
                  </span>
                </Button>

                <br />
                <br />
              </div>

              <div className={this.state.cacheBrowser ? '' : 'hidden'}>
                <div
                  id={this.props.libraryItem._id + 'cResults'}
                  className="folderResults"
                ></div>
              </div>
            </div>

            <div
              className={
                this.state.navItemSelected == 'navContainers' ? '' : 'hidden'
              }
            >
              <p>Container types to scan for:</p>

              <input
                type="text"
                className="folderPaths2"
                name="containerFilter"
                defaultValue={this.props.libraryItem.containerFilter}
                onChange={this.handleChange}
              ></input>
            </div>

            <div
              className={
                this.state.navItemSelected == 'navTranscode' ? '' : 'hidden'
              }
            >
              <p>Transcode Decision Maker</p>

              <center>
                <span className="buttonTextSize">Plugin:</span>{' '}
                <div style={libButtonStyle}>
                  <ToggleButton
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    value={!!this.props.libraryItem.decisionMaker.pluginFilter}
                    onToggle={() => {
                      if (
                        !this.props.libraryItem.decisionMaker.pluginFilter ==
                        true
                      ) {
                        SettingsDB.upsert(this.props.libraryItem._id, {
                          $set: {
                            'decisionMaker.pluginFilter': !this.props
                              .libraryItem.decisionMaker.pluginFilter,
                            'decisionMaker.videoFilter': !!this.props
                              .libraryItem.decisionMaker.pluginFilter,
                            'decisionMaker.audioFilter': !!this.props
                              .libraryItem.decisionMaker.pluginFilter,
                          },
                        });
                      } else {
                        SettingsDB.upsert(this.props.libraryItem._id, {
                          $set: {
                            'decisionMaker.pluginFilter': !this.props
                              .libraryItem.decisionMaker.pluginFilter,
                          },
                        });
                      }
                    }}
                  />
                </div>
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                <span className="buttonTextSize">Video library:</span>{' '}
                <div style={libButtonStyle}>
                  <ToggleButton
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    value={!!this.props.libraryItem.decisionMaker.videoFilter}
                    onToggle={() => {
                      if (
                        !this.props.libraryItem.decisionMaker.videoFilter ==
                        true
                      ) {
                        SettingsDB.upsert(this.props.libraryItem._id, {
                          $set: {
                            'decisionMaker.videoFilter': !this.props.libraryItem
                              .decisionMaker.videoFilter,
                            'decisionMaker.pluginFilter': !!this.props
                              .libraryItem.decisionMaker.videoFilter,
                            'decisionMaker.audioFilter': !!this.props
                              .libraryItem.decisionMaker.videoFilter,
                          },
                        });
                      } else {
                        SettingsDB.upsert(this.props.libraryItem._id, {
                          $set: {
                            'decisionMaker.videoFilter': !this.props.libraryItem
                              .decisionMaker.videoFilter,
                          },
                        });
                      }
                    }}
                  />
                </div>
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                {'\u00A0'}
                <span className="buttonTextSize">Audio library:</span>
                <div style={libButtonStyle}>
                  {' '}
                  <ToggleButton
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    value={!!this.props.libraryItem.decisionMaker.audioFilter}
                    onToggle={() => {
                      if (
                        !this.props.libraryItem.decisionMaker.audioFilter ==
                        true
                      ) {
                        SettingsDB.upsert(this.props.libraryItem._id, {
                          $set: {
                            'decisionMaker.audioFilter': !this.props.libraryItem
                              .decisionMaker.audioFilter,
                            'decisionMaker.pluginFilter': !!this.props
                              .libraryItem.decisionMaker.audioFilter,
                            'decisionMaker.videoFilter': !!this.props
                              .libraryItem.decisionMaker.audioFilter,
                          },
                        });
                      } else {
                        SettingsDB.upsert(this.props.libraryItem._id, {
                          $set: {
                            'decisionMaker.audioFilter': !this.props.libraryItem
                              .decisionMaker.audioFilter,
                          },
                        });
                      }
                    }}
                  />
                </div>
              </center>

              <div
                className={
                  this.props.libraryItem.decisionMaker.pluginFilter
                    ? ''
                    : 'hidden'
                }
              >
                <center>
                  <p>
                    Community:
                    <Checkbox
                      name="community"
                      checked={!!this.props.libraryItem.pluginCommunity}
                      onChange={this.handleChangeChkBx}
                    />
                    Local:
                    <Checkbox
                      name="local"
                      checked={!this.props.libraryItem.pluginCommunity}
                      onChange={this.handleChangeChkBx}
                    />
                  </p>
                </center>

                <p>Plugin ID:</p>

                <form onSubmit={this.addPlugin.bind(this)}>
                  <input
                    type="text"
                    ref="addPluginText"
                    placeholder="Add Plugin IDs(use Enter↵)"
                    className="folderPaths"
                    name="pluginID"
                    onChange={this.handleChange}
                  />
                </form>

                <div
                  className={this.props.libraryItem.pluginValid ? 'hidden' : ''}
                >
                  <div
                    className={
                      this.props.libraryItem.pluginID == '' ? 'hidden' : ''
                    }
                  >
                    <span className="invalidFolder">
                      <center> Invalid plugin </center>
                    </span>
                  </div>
                </div>

                <p></p>
                <p></p>

                <center>
                  <p>Plugin Stack:</p>{' '}
                </center>
                <center>
                  <table>
                    <tbody>{this.renderPlugins()}</tbody>
                  </table>
                </center>

                {/* <input type="text" className="folderPaths" name="pluginID" defaultValue={this.props.libraryItem.pluginID} onChange={this.handleChange}></input> */}
              </div>

              <div
                className={
                  this.props.libraryItem.decisionMaker.pluginFilter
                    ? 'hidden'
                    : this.props.libraryItem.decisionMaker.videoFilter
                    ? ''
                    : this.props.libraryItem.decisionMaker.audioFilter
                    ? ''
                    : 'hidden'
                }
              >
                <br />
                <br />
                <br />
                <br />

                <p>Output file container: </p>

                <input
                  type="text"
                  name="container"
                  className="folderPaths3"
                  defaultValue={this.props.libraryItem.container}
                  onChange={this.handleChange}
                ></input>

                <center>
                  <p>
                    HandBrake:
                    <Checkbox
                      name="handbrake"
                      checked={!!this.props.libraryItem.handbrake}
                      onChange={this.handleChangeChkBx}
                    />
                    FFmpeg:
                    <Checkbox
                      name="ffmpeg"
                      checked={!!this.props.libraryItem.ffmpeg}
                      onChange={this.handleChangeChkBx}
                    />
                  </p>{' '}
                </center>

                <p>CLI arguments/preset: </p>
                <input
                  type="text"
                  name="preset"
                  className="folderPaths"
                  defaultValue={this.props.libraryItem.preset}
                  onChange={this.handleChange}
                ></input>
              </div>

              <div
                className={
                  this.props.libraryItem.decisionMaker.videoFilter
                    ? ''
                    : 'hidden'
                }
              >
                <p></p>
                <p></p>
                <p>Don&apos;t transcode videos already in these codecs:</p>

                <form onSubmit={this.addVideoCodecExclude.bind(this)}>
                  <input
                    type="text"
                    ref="addVideoCodecExcludeText"
                    placeholder="Add new video codecs...(use Enter↵)"
                    className="folderPaths3"
                  />
                </form>

                <center>
                  <table>
                    <tbody>{this.renderVideoCodecsExclude()}</tbody>
                  </table>
                </center>

                <center>
                  {' '}
                  <p>Video size range (MB)</p>{' '}
                </center>

                <InputRange
                  maxValue={200000}
                  minValue={0}
                  value={
                    this.props.libraryItem.decisionMaker
                      .video_size_range_include
                  }
                  onChange={value => {
                    SettingsDB.upsert(this.props.libraryItem._id, {
                      $set: {
                        'decisionMaker.video_size_range_include': value,
                      },
                    });
                  }}
                  step={0.1}
                />

                <center>
                  <p>Video resolution height range (px)</p>{' '}
                </center>

                <InputRange
                  maxValue={5000}
                  minValue={0}
                  value={
                    this.props.libraryItem.decisionMaker
                      .video_height_range_include
                  }
                  onChange={value => {
                    SettingsDB.upsert(this.props.libraryItem._id, {
                      $set: {
                        'decisionMaker.video_height_range_include': value,
                      },
                    });
                  }}
                  step={1}
                />

                <center>
                  {' '}
                  <p>Video resolution width range (px)</p>{' '}
                </center>

                <InputRange
                  maxValue={8000}
                  minValue={0}
                  value={
                    this.props.libraryItem.decisionMaker
                      .video_width_range_include
                  }
                  onChange={value => {
                    SettingsDB.upsert(this.props.libraryItem._id, {
                      $set: {
                        'decisionMaker.video_width_range_include': value,
                      },
                    });
                  }}
                  step={1}
                />
              </div>

              <div
                className={
                  this.props.libraryItem.decisionMaker.audioFilter
                    ? ''
                    : 'hidden'
                }
              >
                <p></p>
                <p></p>
                <p>Don&apos;t transcode audio already in these codecs:</p>

                <form onSubmit={this.addAudioCodecExclude.bind(this)}>
                  <input
                    type="text"
                    ref="addAudioCodecExcludeText"
                    placeholder="Add new audio codecs...(use Enter↵)"
                    className="folderPaths3"
                  />
                </form>

                <center>
                  <table>
                    <tbody>{this.renderAudioCodecsExclude()}</tbody>
                  </table>
                </center>

                <center>
                  <p>Audio size range (MB)</p>{' '}
                </center>

                <InputRange
                  maxValue={1000}
                  minValue={0}
                  value={
                    this.props.libraryItem.decisionMaker
                      .audio_size_range_include
                  }
                  onChange={value => {
                    SettingsDB.upsert(this.props.libraryItem._id, {
                      $set: {
                        'decisionMaker.audio_size_range_include': value,
                      },
                    });
                  }}
                  step={0.1}
                />
              </div>
            </div>

            <div
              className={
                this.state.navItemSelected == 'navHealthCheck' ? '' : 'hidden'
              }
            >
              <p>Health check type:</p>
              <p>
                Quick:
                <Checkbox
                  name="handbrakescan"
                  checked={!!this.props.libraryItem.handbrakescan}
                  onChange={this.handleChangeChkBx}
                />
                Thorough:
                <Checkbox
                  name="ffmpegscan"
                  checked={!!this.props.libraryItem.ffmpegscan}
                  onChange={this.handleChangeChkBx}
                />
              </p>
            </div>

            <div
              className={
                this.state.navItemSelected == 'navSchedule' ? '' : 'hidden'
              }
            >
              <p>Schedule: </p>

              <Button
                variant="outline-light"
                onClick={() => {
                  Meteor.call(
                    'toggleSchedule',
                    this.props.libraryItem._id,
                    this.state.scheduleAll,
                    0,
                    168
                  );

                  this.setState({
                    scheduleAll: !this.state.scheduleAll,
                  });
                }}
              >
                Toggle all
              </Button>

              <br />
              <br />
              <br />

              <div className="scheduleContainer">
                {this.renderScheduleBlocks()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('SettingsDB');

  return {
    settings: SettingsDB.find({}, {sort: {priority: 1}}).fetch(),
  };
})(Folder);
