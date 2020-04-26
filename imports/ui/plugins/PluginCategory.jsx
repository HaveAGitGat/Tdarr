import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "reactjs-popup";
import ClipLoader from "react-spinners/ClipLoader";
import ReactDOM from "react-dom";

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNav: "All",
      showPlugin: false,
      pluginStates: {},
      showEditWindow: false,
      lastReadID: "",
      lastReadText: "",
    };
  }

  componentDidMount() {
    setTimeout(this.showPluginCard, 100);
  }

  showPluginCard = () => {
    var plugins = this.props.pluginsStoredFiltered.filter((row) => {
      if (row.source == this.props.pluginType) {
        return true;
      }
      return false;
    });

    // console.log(plugins)
    if (plugins.length == 0) {
      setTimeout(this.showPluginCard, 100);
    } else {
      var timeout = 200;
      var interval = 2;

      const showP = (id) => {
        var pluginStates = this.state.pluginStates;
        pluginStates[id] = true;
        this.setState({ pluginStates: pluginStates });
      };

      for (var i = 0; i < plugins.length; i++) {
        var id = plugins[i].id;

        setTimeout(showP, timeout, id);
        timeout += 100 - interval;
        interval += 2;
      }
    }
  };

  deletePlugin = (id) => {
    if (confirm("Are you sure you want to delete this local plugin?")) {
      Meteor.call("deletePlugin", id, (error, result) => {
        if (result[0] == true) {
          var pluginStates = this.state.pluginStates;
          pluginStates[result[1]] = false;

          alert("Plugin successfully deleted!");
          this.setState({ pluginStates: pluginStates });
        } else {
          alert("Error: plugin not deleted, please delete manually.");
        }
      });
    }
  };

  copyCommunityToLocal = (id) => {
    Meteor.call("copyCommunityToLocal", id, false, (error, result) => {
      if (result[0] == "exist") {
        if (confirm("Local copy already exists. Overwrite?")) {
          Meteor.call("copyCommunityToLocal", id, true, (error, result) => {
            alertResult(result);
          });
        }
      } else {
        alertResult(result);
      }
    });

    function alertResult(result) {
      if (result[0] == true) {
        alert("Plugin successfully copied!");
        location.reload();
      } else {
        alert("Error: plugin not copied, please copy manually.");
      }
    }
  };

  editPlugin(id) {
    this.setState({ lastReadID: id });

    Meteor.call("readPluginText", id, (error, result) => {
      if (result[0] == true) {
        this.setState({ lastReadText: result[2] });
        this.setState({ showEditWindow: true });
      } else {
        this.setState({ lastReadText: "Reading plugin failed" });
      }
    });
  }

  savePlugin(id) {
    this.setState({ lastReadID: id });

    var text = ReactDOM.findDOMNode(this.refs.editText).value;

    Meteor.call("savePluginText", id, text, (error, result) => {
      if (result[0] == true) {
        alert("Plugin edit saved!");
        this.setState({ showEditWindow: false });
        location.reload();
      } else {
        alert("Error saving edit");
      }
    });
  }

  renderPlugins(returnCount, pluginType, cattags) {
    //'h265,hevc'

    //console.log(returnCount, pluginType, cattags)

    var result = this.props.pluginsStoredFiltered;

    if (result.length == 0) {
      if (returnCount) {
        return 0;
      } else {
        return <p>No plugins</p>;
      }
    } else {
      result = this.props.pluginsStoredFiltered.filter((row) => {
        if (row.source == pluginType) {
          return true;
        }
        return false;
      });

      cattags = cattags.split(",");

      result = result.filter((row) => {
        //  console.log(row)

        var plugTags = row.Tags;

        try {
          plugTags.split(",").map((row) => row.toLowerCase());
        } catch (err) {
          plugTags = [""];
        }

        for (var i = 0; i < cattags.length; i++) {
          if (plugTags.includes(cattags[i].toLowerCase())) return true;
        }

        return false;
      });

      if (returnCount) {
        return result.length;
      }

      result = result.map((row) => (
        <div>
          <div
            className={this.state.pluginStates[row.id] === true ? "" : "d-none"}
          >
            <div className="pluginCard">
              <center>
                <div className="pluginID">
                  <p>{row.id}</p>
                </div>
              </center>
              <center>
                <div className="pluginTitle">
                  <p>{row.Name}</p>
                </div>
              </center>

              <div className="pluginDesc">
                <p>{row.Description}</p>
              </div>

              <div className="pluginCardBottom">
                <center>
                  <CopyToClipboard text={row.id}>
                    <Button variant="outline-light">
                      <span className="buttonTextSize">Copy id</span>
                    </Button>
                  </CopyToClipboard>
                  {"\u00A0"}
                  {row.Inputs ? (
                    <Modal
                      trigger={
                        <Button variant="outline-light">
                          <span className="buttonTextSize">Configurable</span>
                        </Button>
                      }
                      modal
                      closeOnDocumentClick
                    >
                      <div className="modalContainer">
                        <div className="frame">
                          <div className="scroll">
                            <div className="modalText">
                              {row.Inputs.map((input) => {
                                var tooltip = input.tooltip.split("\\n");

                                for (var i = 0; i < tooltip.length; i++) {
                                  var current = i;

                                  if (
                                    tooltip[i].includes("Example:") &&
                                    i + 1 < tooltip.length
                                  ) {
                                    tooltip[i + 1] = (
                                      <div className="toolTipHighlight">
                                        <p>{tooltip[i + 1]}</p>
                                      </div>
                                    );
                                    i++;
                                  }

                                  tooltip[current] = <p>{tooltip[current]}</p>;
                                }

                                return (
                                  <div className="pluginModal">
                                    <p className="pluginInput">{input.name}</p>

                                    {tooltip}

                                    <br />
                                    <br />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                  ) : null}
                  {this.props.pluginType == "Local" ? (
                    <Button
                      variant="outline-light"
                      onClick={() => this.deletePlugin(row.id)}
                    >
                      <span className="buttonTextSize">X</span>
                    </Button>
                  ) : null}
                  {this.props.pluginType == "Local" ? (
                    <Button
                      variant="outline-light"
                      onClick={() => this.editPlugin(row.id)}
                    >
                      <span className="buttonTextSize">Edit</span>
                    </Button>
                  ) : null}
                  {this.props.pluginType == "Community" ? (
                    <Button
                      variant="outline-light"
                      onClick={() => this.copyCommunityToLocal(row.id)}
                    >
                      <span className="buttonTextSize">Copy to Local</span>
                    </Button>
                  ) : null}
                </center>
                <div className="box">
                  <p>Tags:{row.Tags}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              this.state.pluginStates[row.id] === undefined ? "" : "d-none"
            }
          >
            <div className="pluginCardLoading">
              <center>
                <ClipLoader
                  sizeUnit={"px"}
                  size={40}
                  color={"white"}
                  loading={true}
                />
              </center>
            </div>
          </div>
        </div>
      ));

      return <div className="box">{result}</div>;
    }
  }

  render() {
    return (
      <div className="libraryContainer2">
        <div
          className={
            this.state && this.state.showEditWindow == true ? "" : "d-none"
          }
        >
          <div className="editWindow">
            <Button
              variant="outline-light"
              onClick={() => this.setState({ showEditWindow: false })}
            >
              <span className="buttonTextSize">Cancel</span>
            </Button>
            {this.state.lastReadText != "Reading plugin failed" ? (
              <Button
                variant="outline-light"
                onClick={() => this.savePlugin(this.state.lastReadID)}
              >
                <span className="buttonTextSize">Save</span>
              </Button>
            ) : null}

            <br />
            <p>Plugin ID: {this.state.lastReadID}</p>
            <textarea
              id="editText"
              ref="editText"
              className="editTextArea"
              defaultValue={this.state.lastReadText}
            ></textarea>
          </div>
        </div>

        <div className="pluginTabGrid-container">
          <div className="pluginTabGrid-itemLeft">
            <br />
            <br />
            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "All" });
              }}
              className={
                this.state && this.state.selectedNav == "All"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              All ({this.renderPlugins(true, this.props.pluginType, "")})
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "H265/HEVC" });
              }}
              className={
                this.state && this.state.selectedNav == "H265/HEVC"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              H265/HEVC (
              {this.renderPlugins(true, this.props.pluginType, "h265,hevc")})
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "H264" });
              }}
              className={
                this.state && this.state.selectedNav == "H264"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              H264 ({this.renderPlugins(true, this.props.pluginType, "h264")})
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "NVENC H265" });
              }}
              className={
                this.state && this.state.selectedNav == "NVENC H265"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              NVENC H265 (
              {this.renderPlugins(true, this.props.pluginType, "nvenc h265")})
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "NVENC H264" });
              }}
              className={
                this.state && this.state.selectedNav == "NVENC H264"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              NVENC H264 (
              {this.renderPlugins(true, this.props.pluginType, "nvenc h264")})
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "QSV H265" });
              }}
              className={
                this.state && this.state.selectedNav == "QSV H265"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              QSV H265 (
              {this.renderPlugins(true, this.props.pluginType, "qsv h265")})
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "QSV H264" });
              }}
              className={
                this.state && this.state.selectedNav == "QSV H264"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              QSV H264 (
              {this.renderPlugins(true, this.props.pluginType, "qsv h264")})
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "Video only" });
              }}
              className={
                this.state && this.state.selectedNav == "Video only"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              Video only (
              {this.renderPlugins(true, this.props.pluginType, "video only")})
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "Audio only" });
              }}
              className={
                this.state && this.state.selectedNav == "Audio only"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              Audio only (
              {this.renderPlugins(true, this.props.pluginType, "audio only")})
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "Subtitle only" });
              }}
              className={
                this.state && this.state.selectedNav == "Subtitle only"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              Subtitle only (
              {this.renderPlugins(true, this.props.pluginType, "subtitle only")}
              )
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "Filter only" });
              }}
              className={
                this.state && this.state.selectedNav == "Filter only"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              Filter only (
              {this.renderPlugins(true, this.props.pluginType, "filter only")})
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "HandBrake" });
              }}
              className={
                this.state && this.state.selectedNav == "HandBrake"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              HandBrake (
              {this.renderPlugins(true, this.props.pluginType, "handbrake")})
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "FFmpeg" });
              }}
              className={
                this.state && this.state.selectedNav == "FFmpeg"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              FFmpeg (
              {this.renderPlugins(true, this.props.pluginType, "ffmpeg")})
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "3rd Party" });
              }}
              className={
                this.state && this.state.selectedNav == "3rd Party"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              3rd Party (
              {this.renderPlugins(true, this.props.pluginType, "3rd party")})
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "Pre-processing" });
              }}
              className={
                this.state && this.state.selectedNav == "Pre-processing"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              Pre-processing (
              {this.renderPlugins(
                true,
                this.props.pluginType,
                "pre-processing"
              )}
              )
            </p>

            <p
              onClick={() => {
                this.setState({ selectedNav: "Post-processing" });
              }}
              className={
                this.state && this.state.selectedNav == "Post-processing"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              Post-processing (
              {this.renderPlugins(
                true,
                this.props.pluginType,
                "post-processing"
              )}
              )
            </p>

            <br />

            <p
              onClick={() => {
                this.setState({ selectedNav: "Configurable" });
              }}
              className={
                this.state && this.state.selectedNav == "Configurable"
                  ? "selectedNav"
                  : "unselectedNav"
              }
            >
              Configurable (
              {this.renderPlugins(true, this.props.pluginType, "configurable")})
            </p>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>

          <div className="pluginTabGrid-itemRight">
            <div
              className={
                this.state && this.state.selectedNav == "All" ? "" : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "H265/HEVC"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "h265,hevc")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "H264" ? "" : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "h264")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "NVENC H265"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "nvenc h265")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "NVENC H264"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "nvenc h264")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "QSV H265"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "qsv h265")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "QSV H264"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "qsv h264")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "Video only"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "video only")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "Audio only"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "audio only")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "Subtitle only"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(
                false,
                this.props.pluginType,
                "subtitle only"
              )}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "Filter only"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "filter only")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "HandBrake"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "handbrake")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "FFmpeg" ? "" : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "ffmpeg")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "3rd Party"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "3rd party")}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "Pre-processing"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(
                false,
                this.props.pluginType,
                "pre-processing"
              )}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "Post-processing"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(
                false,
                this.props.pluginType,
                "post-processing"
              )}
            </div>

            <div
              className={
                this.state && this.state.selectedNav == "Configurable"
                  ? ""
                  : "d-none"
              }
            >
              {this.renderPlugins(false, this.props.pluginType, "configurable")}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
