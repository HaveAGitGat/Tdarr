import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { FileDB, StatisticsDB, GlobalSettingsDB } from "../api/database.js";
import ReactDOM from "react-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "react-bootstrap";
import { render } from "react-dom";
import SearchResults from "./searchResults.jsx";

import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

var renderLabel = function (entry) {
  return entry.name;
};

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = { listItems: [1, 2], resultsShow: false };
  }

  renderStat(stat) {
    var statistics = this.props.statistics;

    if (statistics.length == 0) {
      var statDat = (
        <ClipLoader sizeUnit={"px"} size={15} color={"white"} loading={true} />
      );
    } else {
      var statDat = statistics[0][stat];

      if (stat == "sizeDiff") {
        try {
          statDat = parseFloat(statDat.toPrecision(4));
        } catch (err) {}
      }
    }

    return statDat;
  }

  renderPie(index, item, property, fileMedium, DB_id) {
    var statistics = this.props.statistics;

    if (statistics.length == 0) {
      var data = [{ name: "Loading...", value: 1 }];
    } else {
      //var data = statistics[0][pie]

      var data = statistics[0].pies[index][item];
    }

    const COLORS = ["#bb86fc", "#04dac5", "#bdbdbd"];

    return (
      <ResponsiveContainer height="100%" width="99%">
        <PieChart onMouseEnter={this.onPieEnter}>
          <Pie
            dataKey="value"
            data={data}
            stroke="none"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            label={renderLabel}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to load all files from this pie segment?"
                    )
                  ) {
                    render(
                      <center>
                        <ClipLoader
                          sizeUnit={"px"}
                          size={25}
                          color={"white"}
                          loading={true}
                        />
                      </center>,
                      document.getElementById("searchResults")
                    );

                    Meteor.call(
                      "returnPieFiles",
                      property,
                      fileMedium,
                      entry.name,
                      DB_id,
                      (error, result) => {
                        this.setState({
                          resultsShow: true,
                        });

                        render(
                          <SearchResults results={result} />,
                          document.getElementById("searchResults")
                        );
                      }
                    );
                  }
                }}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  renderStats = () => {
    // this.props.statistics.pies.map(row =>

    try {
      if (this.props.statistics.length == 0) {
      } else {
        var tabTitles = this.props.statistics[0].pies.map((item, i) => {
          return (
            <Tab>
              <p>{item[0]}</p>
            </Tab>
          );
        });

        var tabPanels = this.props.statistics[0].pies.map((item, i) => (
          <TabPanel>
            <div className="tabContainerStat">
              <br />
              <br />

              <div className="videoStatsContainer">
                <center>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p>
                            <b>Files</b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {item[2]}
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <p>
                            <b>Number of transcodes</b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {item[3]}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <b>Space saved</b>
                          </p>
                        </td>
                        <td>
                          <p>
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {item[4] != undefined
                              ? parseFloat(item[4].toPrecision(4))
                              : 0}{" "}
                            GB
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <b>Number of health checks</b>
                          </p>
                        </td>
                        <td>
                          {" "}
                          <p>
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {"\u00A0"}
                            {item[5]}
                          </p>
                        </td>
                      </tr>

                      <tr></tr>

                      <tr></tr>
                    </tbody>
                  </table>
                </center>
              </div>
              <br />
              <br />

              <div className="videoStatsContainer">
                <center>
                  <p>
                    <b>Tdarr status</b>
                  </p>
                </center>

                <div className="pieaudiogrid-container">
                  <div className="pieaudiogrid-item-title">
                    <center>
                      <p>
                        <b>Transcode </b>
                      </p>
                    </center>
                    {/* {this.renderStat('tdarrScore')}% */}
                  </div>

                  <div className="pieaudiogrid-item-title">
                    <center>
                      <p>
                        <b>Health </b>
                      </p>
                    </center>
                    {/* {this.renderStat('healthCheckScore')}% */}
                  </div>

                  <div className="pieaudiogrid-item">
                    {this.renderPie(
                      i,
                      6,
                      "TranscodeDecisionMaker",
                      "",
                      item[1]
                    )}
                  </div>

                  <div className="pieaudiogrid-item">
                    {this.renderPie(i, 7, "HealthCheck", "", item[1])}
                  </div>
                </div>
              </div>

              <br />
              <br />

              <div className="videoStatsContainer">
                <center>
                  <p>
                    <b>Video files</b>
                  </p>
                </center>

                <div className="piegrid-container">
                  <div className="piegrid-item-title">
                    <center>
                      <p>
                        <b>Codecs</b>
                      </p>
                    </center>
                  </div>

                  <div className="piegrid-item-title">
                    <center>
                      <p>
                        <b>Containers</b>
                      </p>
                    </center>
                  </div>

                  <div className="piegrid-item-title">
                    <center>
                      <p>
                        <b>Resolutions</b>
                      </p>
                    </center>
                  </div>

                  <div className="piegrid-item">
                    {this.renderPie(i, 8, "video_codec_name", "video", item[1])}
                  </div>

                  <div className="piegrid-item">
                    {this.renderPie(i, 9, "container", "video", item[1])}
                  </div>

                  <div className="piegrid-item">
                    {this.renderPie(
                      i,
                      10,
                      "video_resolution",
                      "video",
                      item[1]
                    )}
                  </div>
                </div>
              </div>

              <br />
              <br />

              <div className="videoStatsContainer">
                <center>
                  <p>
                    <b>Audio files</b>
                  </p>
                </center>

                <div className="pieaudiogrid-container">
                  <div className="pieaudiogrid-item-title">
                    <center>
                      <p>
                        <b>Codecs</b>
                      </p>
                    </center>
                  </div>

                  <div className="pieaudiogrid-item-title">
                    <center>
                      <p>
                        <b>Containers</b>
                      </p>
                    </center>
                  </div>

                  <div className="pieaudiogrid-item">
                    {this.renderPie(
                      i,
                      11,
                      "audio_codec_name",
                      "audio",
                      item[1]
                    )}
                  </div>

                  <div className="pieaudiogrid-item">
                    {this.renderPie(i, 12, "container", "audio", item[1])}
                  </div>
                </div>
              </div>

              <br />
              <br />
            </div>
          </TabPanel>
        ));

        return (
          <div className="tabWrapLib">
            {" "}
            <Tabs
              selectedIndex={
                this.props.globalSettings[0].selectedStatTab != undefined
                  ? this.props.globalSettings[0].selectedStatTab
                  : 0
              }
              onSelect={(tabIndex) => {
                GlobalSettingsDB.upsert("globalsettings", {
                  $set: {
                    selectedStatTab: tabIndex,
                  },
                });
              }}
            >
              <TabList>{tabTitles}</TabList>

              {tabPanels}
            </Tabs>{" "}
          </div>
        );
      }
    } catch (err) {}
  };

  render() {
    return (
      <div className="tabWrap">
        <center>
          <header>
            <h1>Stats</h1>
          </header>
        </center>

        <div className={this.state.resultsShow ? "" : "d-none"}>
          <center>
            <Button
              variant="outline-light"
              onClick={() => {
                this.setState({
                  resultsShow: false,
                });

                render("", document.getElementById("searchResults"));
              }}
            >
              <span className="buttonTextSize">Clear</span>
            </Button>
          </center>

          <div className="libraryContainer">
            <div id="searchResults" ref="searchResults"></div>
          </div>
        </div>

        <center>
          <p>Click on pie segments to load respective files</p>
        </center>

        {this.renderStats()}
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("GlobalSettingsDB");
  Meteor.subscribe("StatisticsDB");

  return {
    statistics: StatisticsDB.find({}).fetch(),
    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),
  };
})(App);
