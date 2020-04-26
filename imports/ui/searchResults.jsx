import React, { Component } from "react";
import ItemButton from "./item_Button.jsx";
import Modal from "reactjs-popup";
import ReactTable from "react-table";
import { Button, Dropdown } from "react-bootstrap";
import Checkbox from "@material-ui/core/Checkbox";
import { renderToString } from "react-dom/server";
import { Markup } from "interweave";
import { GlobalSettingsDB } from "../api/database.js";
import { withTracker } from "meteor/react-meteor-data";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

import {
  BumpButton,
  SkipButton,
  SkipHealthCheckButton,
  CancelBumpButton,
  RedoButton,
  ForceProcessingButton,
  CancelForceProcessingButton,
  IgnoreButton,
} from "./ButtonLibrary/Buttons.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastQueueUpdateTime: 1,
    };
  }

  renderResults(result) {
    try {
      const g = GlobalSettingsDB.find({}).fetch()[0];

      if (g.lastQueueUpdateTime != undefined) {
        var a = this.state.lastQueueUpdateTime;
        var b = g.lastQueueUpdateTime;

        if (a != b) {
          this.setState({
            lastQueueUpdateTime: b,
          });
        }
      }
    } catch (err) {}

    if (!result || result.length == 0) {
      return (
        <center>
          <p>No results</p>
        </center>
      );
    } else {
      var data = result;
      var columns = this.props.globalSettings[0].searchResultColumns;

      function getStreams(file) {
        var streams = file.ffProbeData.streams;
        streams = streams.map((row) => {
          return (
            <tr>
              <td>{row.index}</td>
              <td>{row.codec_type}</td>
              <td>{row.codec_name}</td>
              <td>
                {row.bit_rate != undefined
                  ? parseFloat((row.bit_rate / 1000000).toPrecision(4)) + " Mbs"
                  : "-"}
              </td>
            </tr>
          );
        });

        return (
          <table className="searchResultsTable">
            <tbody>{streams}</tbody>
          </table>
        );
      }

      var getColumnWidth = (rows, accessor, headerText) => {
        var maxWidth = 400;
        var magicSpacing = 10;
        var cellLength = Math.max(
          ...rows.map((row) => (`${row[accessor]}` || "").length),
          headerText.length
        );
        return Math.min(maxWidth, cellLength * magicSpacing);
      };

      function fancyTimeFormat(time) {
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;
        var ret = "";
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
      }

      var columns = [
        {
          show: columns.index != undefined ? columns.index : true,
          Header: "",
          id: "row",
          maxWidth: 50,
          filterable: false,
          Cell: (row) => {
            return <p>{row.index + 1}</p>;
          },
        },

        //DROPDOWN CODE
        // {
        //   show: columns.optionsDropdownMenu != undefined ? columns.optionsDropdownMenu : true,
        //   Header: () => (
        //     <div className="pluginTableHeader">
        //       <p>Options</p>
        //     </div>
        //   ),
        //   id: 'Options',
        //   width: 'OptionsOptions'.length * 10,
        //   accessor: row => {

        //     return <Dropdown >
        //       <Dropdown.Toggle variant="outline-light" id="dropdown-basic" >
        //         Options
        //             </Dropdown.Toggle>

        //       <Dropdown.Menu >

        //         <div className="optionsDropdownSR">
        //           <p><div className="resultColumnOptions">Bump:{!(row.bumped instanceof Date) ? <BumpButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} /> : <CancelBumpButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} />}</div></p>
        //           <p><div className="resultColumnOptions">Create sample:{this.renderCreateSampleButton(row.file)}</div></p>

        //           <p><div className="resultColumnOptions">{row.TranscodeDecisionMaker == "Queued" ? <span>Queued({row.tPosition})<SkipButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} /></span> : <RedoButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} mode={'TranscodeDecisionMaker'} />}</div></p>
        //           <p><div className="resultColumnOptions">{row.HealthCheck == "Queued" ? <span>Queued({row.hPosition})<SkipHealthCheckButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} /></span> : <RedoButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} mode={'HealthCheck'} />}</div></p>
        //           <p><div className="resultColumnOptions">{this.renderInfoButton(row)}</div></p>
        //           <p><div className="resultColumnOptions">{this.renderHistoryButton(row)}</div></p>
        //           <p><div className="resultColumnOptions">{this.renderRemoveButton(row)}</div></p>
        //           <p><div className="resultColumnOptions">{row.forceProcessing === true ? <CancelForceProcessingButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} /> : <ForceProcessingButton file={row} lastQueueUpdateTime={this.state.lastQueueUpdateTime} />}</div></p>
        //           <p><div className="resultColumnOptions">{this.renderReScanButton(row)}</div></p>
        //         </div>
        //       </Dropdown.Menu>
        //     </Dropdown>

        //   },
        //   getProps: (state, rowInfo, column) => {
        //     return {
        //       style: {
        //         color: "#e1e1e1",
        //         fontSize: "14px",
        //         overflow: "visible",
        //       },
        //     }
        //   }

        // },

        {
          show: columns.fileName != undefined ? columns.fileName : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>File</p>
            </div>
          ),
          accessor: "file",
          width: getColumnWidth(data, "file", "File"),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.streams != undefined ? columns.streams : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Streams</p>
            </div>
          ),
          id: "streams",
          accessor: (row) => {
            if (row.ffProbeData && row.ffProbeData.streams) {
              var streams = row.ffProbeData.streams;
              streams = streams.map((row) => {
                return (
                  <tr>
                    <td width="20%">
                      <p>{row.codec_name}</p>
                    </td>
                    <td width="20%">
                      <p>{row.codec_type}</p>
                    </td>
                    <td width="20%">
                      <p>
                        {row.bit_rate != undefined
                          ? parseFloat(
                              (row.bit_rate / 1000000).toPrecision(4)
                            ) + " Mbs"
                          : "-"}
                      </p>
                    </td>
                    <td width="20%">
                      <p>
                        {row.tags != undefined && row.tags.language != undefined
                          ? row.tags.language
                          : "-"}
                      </p>
                    </td>
                    <td width="20%">
                      <p>{row.channels != undefined ? row.channels : "-"}</p>
                    </td>
                    <td width="20%">
                      <p>
                        {row.tags != undefined && row.tags.title != undefined
                          ? row.tags.title
                          : "-"}
                      </p>
                    </td>
                  </tr>
                );
              });

              return (
                <table className="streamsTable" minWidth="400">
                  <tbody>{streams}</tbody>
                </table>
              );
            } else {
              return null;
            }
          },
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show:
            columns.closedCaptions != undefined ? columns.closedCaptions : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Closed Captions</p>
            </div>
          ),
          id: "CC",
          accessor: (row) =>
            row.hasClosedCaptions != undefined
              ? row.hasClosedCaptions == true
                ? "yes"
                : "no"
              : "Not checked",
          width: getColumnWidth(data, "hasClosedCaptions", "CC"),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.codec != undefined ? columns.codec : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Codec</p>
            </div>
          ),
          accessor: "ffProbeData.streams[0].codec_name",
          width: getColumnWidth(data, "video_codec_name", "Codec"),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.resolution != undefined ? columns.resolution : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Resolution</p>
            </div>
          ),
          accessor: "video_resolution",
          width: getColumnWidth(data, "video_resolution", "Resolution"),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.size != undefined ? columns.size : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Size(GB)</p>
            </div>
          ),
          id: "size",
          accessor: (row) =>
            row.file_size != undefined
              ? parseFloat((row.file_size / 1000).toPrecision(4))
              : 0,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.bitrate != undefined ? columns.bitrate : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Bitrate(Mbs)</p>
            </div>
          ),
          id: "Bitrate",
          accessor: (row) =>
            row.bit_rate != undefined
              ? parseFloat((row.bit_rate / 1000000).toPrecision(4))
              : 0,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.duration != undefined ? columns.duration : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Duration(s)</p>
            </div>
          ),
          id: "Duration",
          accessor: (row) =>
            row.ffProbeData && row.ffProbeData.streams[0]["duration"]
              ? fancyTimeFormat(
                  parseFloat(row.ffProbeData.streams[0]["duration"])
                )
              : "00:00:00",
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.bump != undefined ? columns.bump : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Bump</p>
            </div>
          ),
          id: "Bump",
          width: "Bump".length * 10,
          accessor: (row) =>
            !(row.bumped instanceof Date) ? (
              <BumpButton
                file={row}
                lastQueueUpdateTime={this.state.lastQueueUpdateTime}
              />
            ) : (
              <CancelBumpButton
                file={row}
                lastQueueUpdateTime={this.state.lastQueueUpdateTime}
              />
            ),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.createSample != undefined ? columns.createSample : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Create sample</p>
            </div>
          ),
          id: "Create sample",
          width: "Create sample".length * 10,
          accessor: (row) => this.renderCreateSampleButton(row),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.transcode != undefined ? columns.transcode : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Transcode</p>
            </div>
          ),
          id: "Transcode",
          width: "Transcode".length * 10,
          accessor: (row) =>
            row.TranscodeDecisionMaker == "Queued" ? (
              <span>
                Queued({row.tPosition})
                <SkipButton
                  file={row}
                  lastQueueUpdateTime={this.state.lastQueueUpdateTime}
                />
              </span>
            ) : (
              <RedoButton
                file={row}
                lastQueueUpdateTime={this.state.lastQueueUpdateTime}
                mode={"TranscodeDecisionMaker"}
              />
            ),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.healthCheck != undefined ? columns.healthCheck : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Health check</p>
            </div>
          ),
          id: "Health check",
          width: "Health check".length * 10,
          accessor: (row) =>
            row.HealthCheck == "Queued" ? (
              <span>
                Queued({row.hPosition})
                <SkipHealthCheckButton
                  file={row}
                  lastQueueUpdateTime={this.state.lastQueueUpdateTime}
                />
              </span>
            ) : (
              <RedoButton
                file={row}
                lastQueueUpdateTime={this.state.lastQueueUpdateTime}
                mode={"HealthCheck"}
              />
            ),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.info != undefined ? columns.info : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Info</p>
            </div>
          ),
          id: "Info",
          width: "Info".length * 10,
          accessor: (row) => this.renderInfoButton(row),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.history != undefined ? columns.history : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>History</p>
            </div>
          ),
          id: "History",
          width: "History".length * 10,
          accessor: (row) => this.renderHistoryButton(row),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.remove != undefined ? columns.remove : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Remove</p>
            </div>
          ),
          id: "Remove",
          width: "Remove".length * 10,
          accessor: (row) => this.renderRemoveButton(row),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show:
            columns.forceProcessing != undefined
              ? columns.forceProcessing
              : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Force processing</p>
            </div>
          ),
          id: "forceProcessing",
          width: "forceProcessing".length * 10,
          accessor: (row) =>
            row.forceProcessing === true ? (
              <CancelForceProcessingButton
                file={row}
                lastQueueUpdateTime={this.state.lastQueueUpdateTime}
              />
            ) : (
              <ForceProcessingButton
                file={row}
                lastQueueUpdateTime={this.state.lastQueueUpdateTime}
              />
            ),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
        {
          show: columns.reScan != undefined ? columns.reScan : true,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Re-scan</p>
            </div>
          ),
          id: "reScan",
          width: "reScan".length * 10,
          accessor: (row) => this.renderReScanButton(row),
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            };
          },
        },
      ];

      function filterMethod(filter, row) {
        try {
          if (filter.id == "streams") {
            var text = renderToString(row[filter.id]);

            if (text.toString().includes(filter.value)) {
              return true;
            }
          } else {
            if (row[filter.id].toString().includes(filter.value)) {
              return true;
            }
          }
        } catch (err) {
          return false;
        }
      }

      return (
        <div className="searchResults">
          <br />
          <center>
            <p>Tip: Use the table headers to sort & filter files</p>
            <p>Count:{data.length}</p>
          </center>
          <center>
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                Columns
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <div className="optionsDropdown">
                  <p>
                    <div className="resultColumnOptions">Index </div>
                    <Checkbox
                      name="index"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.index
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">File </div>
                    <Checkbox
                      name="fileName"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .fileName
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Streams </div>
                    <Checkbox
                      name="streams"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.streams
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Closed Captions </div>
                    <Checkbox
                      name="closedCaptions"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .closedCaptions
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Codec </div>
                    <Checkbox
                      name="codec"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.codec
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Resolution </div>
                    <Checkbox
                      name="resolution"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .resolution
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Size </div>
                    <Checkbox
                      name="size"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.size
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Bitrate </div>
                    <Checkbox
                      name="bitrate"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.bitrate
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Duration </div>
                    <Checkbox
                      name="duration"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .duration
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  {/* <p><div className="resultColumnOptions">Options </div><Checkbox name="optionsDropdownMenu" checked={this.props.globalSettings[0].searchResultColumns.optionsDropdownMenu} onChange={this.handleChange} /></p> */}
                  <p>
                    <div className="resultColumnOptions">Bump </div>
                    <Checkbox
                      name="bump"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.bump
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Create Sample </div>
                    <Checkbox
                      name="createSample"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .createSample
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Transcode </div>
                    <Checkbox
                      name="transcode"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .transcode
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Health Check </div>
                    <Checkbox
                      name="healthCheck"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .healthCheck
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Info </div>
                    <Checkbox
                      name="info"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.info
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">History </div>
                    <Checkbox
                      name="history"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.history
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Remove </div>
                    <Checkbox
                      name="remove"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.remove
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Force Processing </div>
                    <Checkbox
                      name="forceProcessing"
                      checked={
                        this.props.globalSettings[0].searchResultColumns
                          .forceProcessing
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                  <p>
                    <div className="resultColumnOptions">Re-scan</div>
                    <Checkbox
                      name="reScan"
                      checked={
                        this.props.globalSettings[0].searchResultColumns.reScan
                      }
                      onChange={this.handleChange}
                    />
                  </p>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </center>
          <br />
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            pageSizeOptions={[10, 100, 1000, 10000]}
            filterable={true}
            defaultFilterMethod={(filter, row) => filterMethod(filter, row)}
          />
        </div>
      );
    }
  }

  renderCreateSampleButton(file) {
    return (
      <ItemButton
        file={file}
        symbol={"✄"}
        type="createSample"
        time={this.state.lastQueueUpdateTime}
      />
    );
  }

  renderRemoveButton(file) {
    return (
      <ItemButton
        file={file}
        symbol={"X"}
        type="removeFile"
        time={this.state.lastQueueUpdateTime}
      />
    );
  }

  renderReScanButton(file) {
    return (
      <ItemButton
        file={file}
        symbol={"Re-scan"}
        type="reScan"
        time={this.state.lastQueueUpdateTime}
      />
    );
  }

  renderInfoButton(row) {
    var result = [];
    eachRecursive(row);

    function eachRecursive(obj) {
      for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
          eachRecursive(obj[k]);
        } else {
          result.push(k + ":" + obj[k]);
        }
      }
    }

    result = result.map((row, i) => <p>{row}</p>);

    return (
      <Modal
        trigger={
          <Button variant="outline-light">
            <span className="buttonTextSize">i</span>
          </Button>
        }
        modal
        closeOnDocumentClick
      >
        <div className="modalContainer">
          <div className="frame">
            <div className="scroll">
              <div className="modalText">
                {/* {result} */}
                <JSONPretty id="json-pretty" data={row}></JSONPretty>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  renderHistoryButton(row) {
    if (row.history == undefined) {
      result = "";
    } else {
      var result = row.history;
      result = result.split("\n");
      result = result.map((row, i) => <Markup content={row} />);
    }

    return (
      <Modal
        trigger={
          <Button variant="outline-light">
            <span className="buttonTextSize">H</span>
          </Button>
        }
        modal
        closeOnDocumentClick
      >
        <div className="modalContainer">
          <div className="frame">
            <div className="scroll">
              <div className="modalText">{result}</div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  handleChange(event) {
    var key = "searchResultColumns." + event.target.name;
    GlobalSettingsDB.upsert("globalsettings", {
      $set: {
        [key]: event.target.checked,
      },
    });
  }

  render() {
    return <div>{this.renderResults(this.props.results)}</div>;
  }
}

export default withTracker(() => {
  Meteor.subscribe("GlobalSettingsDB");
  return {
    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),
  };
})(App);
