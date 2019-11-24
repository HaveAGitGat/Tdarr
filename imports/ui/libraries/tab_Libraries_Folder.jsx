import {css} from '@emotion/core';
import Checkbox from '@material-ui/core/Checkbox';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import React, {Component} from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import ReactDOM, {render} from 'react-dom';
import InputRange from 'react-input-range';
import ToggleButton from 'react-toggle-button';

import {GlobalSettingsDB, SettingsDB, StatisticsDB} from '../../api/tasks.js';
import AudioCodec from './AudioCodec.jsx';
import Plugin from './Plugin.jsx';
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
      outputBrowser: false,
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
      ReactDOM.findDOMNode(this.refs[this.props.libraryItem._id + 'f']).value,
      'folder',
      this.props.libraryItem._id + 'f'
    );

    this.verifyFolder(
      ReactDOM.findDOMNode(this.refs[this.props.libraryItem._id + 'f']).value,
      'cache',
      this.props.libraryItem._id + 'c'
    );

    this.verifyFolder(
      ReactDOM.findDOMNode(this.refs[this.props.libraryItem._id + 'o']).value,
      'output',
      this.props.libraryItem._id + 'o'
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
        if (result === undefined) {
          // no-op
        } else if (result.length == 0) {
          render(
            <Button
              variant="outline-light"
              onClick={() => {
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
              <tr key={`${row.fullPath}-${i}`}>
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

                      ReactDOM.findDOMNode(
                        this.refs[refType]
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
    const {name, value} = event.target;
    const {_id} = this.props.libraryItem;

    //turn off folder watcher if folder name change detected
    if (name == 'folder') {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          folderWatching: false,
        },
      });

      this.toggleFolderWatch(value);

      this.verifyFolder(value, 'folder', _id + 'f');
    }

    if (name == 'cache') {
      this.verifyFolder(value, 'cache', _id + 'c');
    }

    if (name == 'output') {
      this.verifyFolder(value, 'output', _id + 'o');
    }

    if (name == 'pluginID') {
      Meteor.call('verifyPlugin', value, _id, pluginCommunity);
    }

    SettingsDB.upsert(_id, {
      $set: {
        [name]: value,
      },
    });
  }

  handleChangeChkBx(event) {
    const {name, checked} = event.target;
    const {_id} = this.props.libraryItem;

    SettingsDB.upsert(_id, {
      $set: {
        [name]: checked,
      },
    });

    if (name == 'handbrake' && checked == true) {
      SettingsDB.upsert(_id, {
        $set: {
          ffmpeg: false,
        },
      });
    }

    if (name == 'ffmpeg' && checked == true) {
      SettingsDB.upsert(_id, {
        $set: {
          handbrake: false,
        },
      });
    }

    if (name == 'handbrakescan' && checked == true) {
      SettingsDB.upsert(_id, {
        $set: {
          ffmpegscan: false,
        },
      });
    }

    if (name == 'ffmpegscan' && checked == true) {
      SettingsDB.upsert(_id, {
        $set: {
          handbrakescan: false,
        },
      });
    }

    if (name == 'community' && checked == true) {
      SettingsDB.upsert(_id, {
        $set: {
          pluginCommunity: true,
        },
      });
    }

    if (name == 'local' && checked == true) {
      SettingsDB.upsert(_id, {
        $set: {
          pluginCommunity: false,
        },
      });
    }
  }

  handleChangeChkBx2 = (event, type) => {
    console.log(event.target.checked, type, event.target.name);
    const key = 'decisionMaker.' + type + 'ExcludeSwitch';
    if (event.target.name == 'ExcludeSwitch' && event.target.checked == true) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          [key]: true,
        },
      });
    } else if (
      event.target.name == 'IncludeSwitch' &&
      event.target.checked == true
    ) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          [key]: false,
        },
      });
    }
  };

  renderPlugins = () => {
    var plugins = this.props.settings;

    plugins = plugins.filter(
      setting => setting._id == this.props.libraryItem._id
    );
    plugins = plugins[0].pluginIDs.sort(function(a, b) {
      return a.priority - b.priority;
    });

    Meteor.call('buildPluginStack', plugins, (error, result) => {
      //console.log(result)

      result = result.sort(function(a, b) {
        return a.priority - b.priority;
      });

      var stack = result.map(pluginItem => {
        return (
          <Plugin
            key={pluginItem._id}
            pluginItem={pluginItem}
            DB_id={this.props.libraryItem._id}
          />
        );
      });

      render(
        <table className="pluginStackTable">
          <tbody>
            <tr>
              <th>
                <center>
                  <p>Source</p>
                </center>
              </th>
              <th>
                <center>
                  <p>Enabled</p>
                </center>
              </th>
              <th>
                <center>
                  <p>id</p>
                </center>
              </th>
              <th>
                <center>
                  <p>Type</p>
                </center>
              </th>
              <th>
                <center>
                  <p>Operation</p>
                </center>
              </th>
              <th>
                <center>
                  <p>Name</p>
                </center>
              </th>
              <th>
                <center>
                  <p>Description</p>
                </center>
              </th>
              <th>
                <center>
                  <p>Priority</p>
                </center>
              </th>
              <th>
                <center>
                  <p>Remove</p>
                </center>
              </th>
            </tr>

            {stack}
          </tbody>
        </table>,

        document.getElementById(this.props.libraryItem._id + 'PluginStack')
      );
    });
  };

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

  isSingleDigit = val => /^\d$/.test(val);
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

  renderScheduleBlocks = () => {
    const hoursInDay = 24;
    const shedule = [];
    const formatHour = hour => (this.isSingleDigit(hour) ? `0${hour}` : hour);
    this.days.forEach(day => {
      for (let hour = 0; hour < hoursInDay; hour++) {
        shedule.push({
          _id: `${day}:${formatHour(hour)}-${formatHour(hour + 1)}`,
          checked: true,
        });
      }
    });

    var blocks = this.props.settings;
    blocks = blocks.filter(
      setting => setting._id == this.props.libraryItem._id
    );
    blocks = blocks[0].schedule;

    //UpdateMigration
    if (blocks.length < 168) {
      SettingsDB.upsert(this.props.libraryItem._id, {
        $set: {
          schedule,
        },
      });
    }

    blocks = blocks.map(item => {
      return (
        <td key={`blk-${item._id}-${this.props.libraryItem._id}`}>
          <ScheduleBlock item={item} DB_id={this.props.libraryItem._id} />
        </td>
      );
    });

    const renderItem = (day, start, fin) => (
      <tr>
        {' '}
        <td>
          <Button
            variant="outline-light"
            onClick={() => this.toggleSchedule(start, fin)}
            block
          >
            <span className="scheduleButton">{day}</span>
          </Button>
        </td>{' '}
        {blocks.slice(start, fin)}{' '}
      </tr>
    );

    let hourZero = 0;
    const items = this.days.map(d => {
      const start = hourZero;
      const fin = (hourZero += 24);

      return renderItem(d, start, fin);
    });

    const renderHour = hour => (
      <td>
        <Button
          variant="outline-light"
          onClick={() => this.toggleSchedule(hour, 24, 'Hour')}
        >
          <span className="scheduleButton">
            {this.isSingleDigit(hour) ? `0${hour}` : hour}
          </span>
        </Button>
      </td>
    );

    return (
      <table className="scheduleTable">
        <tbody>
          <tr>
            <td>
              <span className="scheduleButton">Day</span>
            </td>
            {[...Array(24).keys()].map(hour => renderHour(hour))}
          </tr>

          {items}
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

    const text = ReactDOM.findDOMNode(this.refs.addPluginText).value.trim();

    var thisLibraryPlugins = SettingsDB.find(
      {_id: this.props.libraryItem._id},
      {sort: {createdAt: 1}}
    ).fetch()[0].pluginIDs;

    var arr = thisLibraryPlugins.map(row => row._id);

    if (arr.includes(text)) {
      alert('Plugin is already in stack!');
    } else {
      var source;

      if (this.props.libraryItem.pluginCommunity == true) {
        source = 'Community';
      } else {
        source = 'Local';
      }

      Meteor.call(
        'addPluginInclude',
        this.props.libraryItem._id,
        text,
        source,
        this.props.libraryItem.pluginIDs.length
      );
      ReactDOM.findDOMNode(this.refs.addPluginText).value = '';
    }
  }

  addVideoCodecExclude(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(
      this.refs.addVideoCodecExcludeText
    ).value.trim();

    Meteor.call('addVideoCodecExclude', this.props.libraryItem._id, text);
    ReactDOM.findDOMNode(this.refs.addVideoCodecExcludeText).value = '';
  }

  addAudioCodecExclude(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(
      this.refs.addAudioCodecExcludeText
    ).value.trim();

    Meteor.call('addAudioCodecExclude', this.props.libraryItem._id, text);

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
            <div className="optionsDropdown">
              <div
                className={this.props.libraryItem.scanButtons ? '' : 'd-none'}
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
                  <span className="buttonTextSize">
                    Requeue all items (transcode)
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => this.resetAllStatus('HealthCheck')}
                >
                  <span className="buttonTextSize">
                    Requeue all items (health check)
                  </span>
                </Dropdown.Item>

                <Dropdown.Item
                  style={{color: '#bb86fc', fontSize: '14px'}}
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to reset this library's stats?"
                      )
                    ) {
                      SettingsDB.upsert(this.props.libraryItem._id, {
                        $set: {
                          totalTranscodeCount: 0,
                          sizeDiff: 0,
                          totalHealthCheckCount: 0,
                        }
                      }
                    );

                  }
                }

                }>Reset stats: All</Dropdown.Item>

<Dropdown.Item style={{ color: 'white', fontSize: '14px' }} onClick={() => {

var priority = SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch().length
var thisLibrary = (SettingsDB.find({ _id: this.props.libraryItem._id }, { sort: { createdAt: 1 } }).fetch())[0]

thisLibrary.name = thisLibrary.name +" (Duplicate)"
thisLibrary.priority = priority

delete thisLibrary._id;
SettingsDB.insert(thisLibrary)


}

}>Duplicate library</Dropdown.Item>



                <Dropdown.Item style={{ color: '#bb86fc', fontSize: '14px' }} onClick={() => {

                  if (confirm('Are you sure you want to clear this library? Your files will not be affected.')) {
                    this.removeLibrary(this.props.libraryItem._id)
                  }
                }

                }>Clear library</Dropdown.Item>


                <Dropdown.Item style={{ color: '#bb86fc', fontSize: '14px' }} onClick={this.deleteThisLibrary.bind(this)}>Delete library</Dropdown.Item>


              </div>
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

                if (this.props.libraryItem.priority == 0) {
                  // no-op
                } else {
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

                if (this.props.libraryItem.priority == libraries.length - 1) {
                  // no-op
                } else {
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
            className={this.props.libraryItem.scanButtons ? 'd-none' : ''}
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
                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    navItemSelected: 'navSourceFolder',
                  },
                });
              }}
              style={{cursor: 'pointer'}}
              className={
                this.props.libraryItem.navItemSelected == 'navSourceFolder'
                  ? 'selectedNav'
                  : 'unselectedNav'
              }
            >
              Source
            </p>
            <p
              onClick={() => {
                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    navItemSelected: 'navCacheFolder',
                  },
                });
              }}
              style={{cursor: 'pointer'}}
              className={
                this.props.libraryItem.navItemSelected == 'navCacheFolder'
                  ? 'selectedNav'
                  : 'unselectedNav'
              }
            >
              Transcode cache
            </p>
            <p
              onClick={() => {
                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    navItemSelected: 'navOutputFolder',
                  },
                });
              }}
              style={{cursor: 'pointer'}}
              className={
                this.props.libraryItem.navItemSelected == 'navOutputFolder'
                  ? 'selectedNav'
                  : 'unselectedNav'
              }
            >
              Output Folder
            </p>
            <p
              onClick={() => {
                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    navItemSelected: 'navContainers',
                  },
                });
              }}
              style={{cursor: 'pointer'}}
              className={
                this.props.libraryItem.navItemSelected == 'navContainers'
                  ? 'selectedNav'
                  : 'unselectedNav'
              }
            >
              Containers
            </p>
            <p
              onClick={() => {
                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    navItemSelected: 'navTranscode',
                  },
                });
              }}
              style={{cursor: 'pointer'}}
              className={
                this.props.libraryItem.navItemSelected == 'navTranscode'
                  ? 'selectedNav'
                  : 'unselectedNav'
              }
            >
              Transcode
            </p>
            <p
              onClick={() => {
                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    navItemSelected: 'navHealthCheck',
                  },
                });
              }}
              style={{cursor: 'pointer'}}
              className={
                this.props.libraryItem.navItemSelected == 'navHealthCheck'
                  ? 'selectedNav'
                  : 'unselectedNav'
              }
            >
              Health check
            </p>
            <p
              onClick={() => {
                SettingsDB.upsert(this.props.libraryItem._id, {
                  $set: {
                    navItemSelected: 'navSchedule',
                  },
                });
              }}
              style={{cursor: 'pointer'}}
              className={
                this.props.libraryItem.navItemSelected == 'navSchedule'
                  ? 'selectedNav'
                  : 'unselectedNav'
              }
            >
              Schedule
            </p>
          </div>

          <div className="libraryGrid-itemRight">
            <div
              className={
                this.props.libraryItem.navItemSelected == 'navSourceFolder'
                  ? ''
                  : 'hidden'
              }
            >
              <div
                className="d-flex justify-content-around"
                style={libButtonStyle}
              >
                <div>
                  <span className="buttonTextSize mr-2">Folder watch:</span>
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
                </div>

                <div>
                  <span className="buttonTextSize mr-2">Process Library:</span>
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
                </div>

                <div>
                  <span className="buttonTextSize mr-2">Scan on start:</span>
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

                <div>
                  <span className="buttonTextSize mr-2">
                    Closed caption scan (much slower -linux/tdarr_aio/win):
                  </span>
                  <div style={libButtonStyle}>
                    <ToggleButton
                      thumbStyle={borderRadiusStyle}
                      trackStyle={borderRadiusStyle}
                      value={
                        this.props.libraryItem.closedCaptionScan === undefined
                          ? false
                          : !!this.props.libraryItem.closedCaptionScan
                      }
                      onToggle={() => {
                        SettingsDB.upsert(this.props.libraryItem._id, {
                          $set: {
                            closedCaptionScan: !this.props.libraryItem
                              .closedCaptionScan,
                          },
                        });
                      }}
                    />
                  </div>
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

              <p>Sub-folders to ignore (e.g.: .grab,.index,User/AppData):</p>
              <input
                type="text"
                className="folderPaths"
                name="foldersToIgnore"
                defaultValue={this.props.libraryItem.foldersToIgnore}
                onChange={this.handleChange}
              ></input>



            </div>

            <div
              className={
                this.props.libraryItem.navItemSelected == 'navCacheFolder'
                  ? ''
                  : 'hidden'
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
                this.props.libraryItem.navItemSelected == 'navOutputFolder'
                  ? ''
                  : 'hidden'
              }
            >
              <p>
                Under normal operation Tdarr is designed to work directly on
                your library, replacing original files. You can enable folder to folder conversion below however 
                this doesn't fit in with how Tdarr operates. Please test before using. {' '}
              </p>

              <p>For example, without plugins, the transcode process will be:</p>
              <p>Source ---> Cache ---> Output</p>

              <p>With plugins:</p>
              <p>Plugin 1: Source ---> Cache ---> Output</p>
              <p>Plugin 2: Output ---> Cache ---> Output</p>
              <p>Plugin 3: Output ---> Cache ---> Output</p>
              <p>etc</p>

              <p>


              <span className="buttonTextSize mr-2">Output Folder:</span>
                  <div style={libButtonStyle}>
             
               
                <ToggleButton
                  thumbStyle={borderRadiusStyle}
                  trackStyle={borderRadiusStyle}
                  value={
                    this.props.libraryItem.folderToFolderConversion ===
                    undefined
                      ? false
                      : !!this.props.libraryItem.folderToFolderConversion
                  }
                  onToggle={() => {
                    SettingsDB.upsert(this.props.libraryItem._id, {
                      $set: {
                        folderToFolderConversion: !this.props.libraryItem
                          .folderToFolderConversion,
                      },
                    });
                  }}
                />


</div>

<span className="buttonTextSize mr-2">Delete source file:</span>
<div style={libButtonStyle}>
         
                <ToggleButton
                  thumbStyle={borderRadiusStyle}
                  trackStyle={borderRadiusStyle}
                  value={
                    this.props.libraryItem.folderToFolderConversionDeleteSource ===
                    undefined
                      ? false
                      : !!this.props.libraryItem.folderToFolderConversionDeleteSource
                  }
                  onToggle={() => {
                    SettingsDB.upsert(this.props.libraryItem._id, {
                      $set: {
                        folderToFolderConversionDeleteSource: !this.props.libraryItem
                          .folderToFolderConversionDeleteSource,
                      },
                    });
                  }}
                />
                </div>
              </p>

              <input
                type="text"
                className="folderPaths"
                ref={this.props.libraryItem._id + 'o'}
                name="output"
                defaultValue={this.props.libraryItem.output}
                onChange={this.handleChange}
              ></input>

              <div
                className={this.props.libraryItem.outputValid ? 'hidden' : ''}
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
                      outputBrowser: !this.state.outputBrowser,
                    });
                  }}
                >
                  <span className="buttonTextSize">
                    {this.state.outputBrowser ? 'Hide' : 'Show'} browser
                  </span>
                </Button>

                <br />
                <br />
              </div>

              <div className={this.state.outputBrowser ? '' : 'hidden'}>
                <div
                  id={this.props.libraryItem._id + 'oResults'}
                  className="folderResults"
                ></div>
              </div>
            </div>

            <div
              className={
                this.props.libraryItem.navItemSelected == 'navContainers'
                  ? ''
                  : 'hidden'
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
                this.props.libraryItem.navItemSelected == 'navTranscode'
                  ? ''
                  : 'hidden'
              }
            >
              <p>Transcode Decision Maker</p>

              <center>
                <span className="buttonTextSize">Plugin Stack:</span>{' '}
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
                <span className="buttonTextSize">Video:</span>{' '}
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
                <span className="buttonTextSize">Audio:</span>
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
                <br />
                <br />
                <br />
                <br />

                <p>
                  Plugin ID: {'\u00A0'}
                  {'\u00A0'}
                  {'\u00A0'}
                  {'\u00A0'}
                  {'\u00A0'}
                  {'\u00A0'}
                  {'\u00A0'}
                  {'\u00A0'}Source:{'\u00A0'}
                  {'\u00A0'} Community
                  <Checkbox
                    name="community"
                    checked={!!this.props.libraryItem.pluginCommunity}
                    onChange={this.handleChangeChkBx}
                  />
                  {'\u00A0'}
                  {'\u00A0'}Local
                  <Checkbox
                    name="local"
                    checked={!this.props.libraryItem.pluginCommunity}
                    onChange={this.handleChangeChkBx}
                  />
                </p>

                <form onSubmit={this.addPlugin.bind(this)}>
                  <input
                    type="text"
                    ref="addPluginText"
                    placeholder="Add Plugin ID (use Enter↵)"
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

                <p></p>
                <p></p>

                <center>
                  <p>
                    See the 'Plugins' tab for help on creating a stack. Make
                    sure to put 'Filter' plugins at top of stack
                  </p>
                </center>

                <p></p>
                <p></p>

                <center>
                  {this.renderPlugins()}
                  <div id={this.props.libraryItem._id + 'PluginStack'}></div>
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
                <p>
                  Don't{' '}
                  <Checkbox
                    name="ExcludeSwitch"
                    checked={
                      this.props.libraryItem.decisionMaker.videoExcludeSwitch !=
                      undefined
                        ? this.props.libraryItem.decisionMaker
                            .videoExcludeSwitch
                        : true
                    }
                    onChange={event => this.handleChangeChkBx2(event, 'video')}
                  />
                  / Only
                  <Checkbox
                    name="IncludeSwitch"
                    checked={
                      this.props.libraryItem.decisionMaker.videoExcludeSwitch !=
                      undefined
                        ? !this.props.libraryItem.decisionMaker
                            .videoExcludeSwitch
                        : false
                    }
                    onChange={event => this.handleChangeChkBx2(event, 'video')}
                  />{' '}
                  transcode videos in these codecs:
                </p>

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
                <p>
                  Don't{' '}
                  <Checkbox
                    name="ExcludeSwitch"
                    checked={
                      this.props.libraryItem.decisionMaker.audioExcludeSwitch !=
                      undefined
                        ? this.props.libraryItem.decisionMaker
                            .audioExcludeSwitch
                        : true
                    }
                    onChange={event => this.handleChangeChkBx2(event, 'audio')}
                  />
                  / Only
                  <Checkbox
                    name="IncludeSwitch"
                    checked={
                      this.props.libraryItem.decisionMaker.audioExcludeSwitch !=
                      undefined
                        ? !this.props.libraryItem.decisionMaker
                            .audioExcludeSwitch
                        : false
                    }
                    onChange={event => this.handleChangeChkBx2(event, 'audio')}
                  />{' '}
                  transcode audio in these codecs:
                </p>

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
                this.props.libraryItem.navItemSelected == 'navHealthCheck'
                  ? ''
                  : 'hidden'
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
                this.props.libraryItem.navItemSelected == 'navSchedule'
                  ? ''
                  : 'hidden'
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
