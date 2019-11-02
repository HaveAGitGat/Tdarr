import 'react-table/react-table.css';

import {withTracker} from 'meteor/react-meteor-data';
import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {render} from 'react-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import ReactTable from 'react-table';
import ToggleButton from 'react-toggle-button';
import {
  Brush,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {GlobalSettingsDB} from '../api/tasks.js';

var dateFormat = require('dateformat');

const borderRadiusStyle = {borderRadius: 2};

var ButtonStyle = {
  display: 'inline-block',
};

const filterMethod = (filter, row) => {
  if (row[filter.id].includes(filter.value)) {
    return true;
  }
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  clearLogDB() {
    if (confirm('Are you sure you want to delete the logs?')) {
      GlobalSettingsDB.upsert('globalsettings', {
        $set: {
          logsLoading: true,
        },
      });

      Meteor.call('clearLogDB');
    }
  }

  renderRaw() {
    GlobalSettingsDB.upsert('globalsettings', {
      $set: {
        logsLoading: true,
      },
    });

    render('', document.getElementById('logDiv'));
    render('', document.getElementById('memGraphDiv'));
    render('', document.getElementById('sysmemGraphDiv'));
    render('', document.getElementById('syscpuGraphDiv'));

    Meteor.call('getLog', (error, result) => {
      render('Loading...', document.getElementById('rawLog'));

      try {
        result = JSON.stringify(result);
        //console.log(result)
        render(result, document.getElementById('rawLog'));
      } catch (err) {
        console.log(err);
      }
    });
  }

  renderLogDB() {
    GlobalSettingsDB.upsert('globalsettings', {
      $set: {
        logsLoading: true,
      },
    });

    render('', document.getElementById('rawLog'));

    //LogDB.find({}, { sort: { createdAt: -1 } , limit : 10} ).fetch(),

    Meteor.call('getLog', (error, result) => {
      render('Loading...', document.getElementById('logDiv'));

      //result = result.map(row => JSON.parse(row))

      //   result = []

      //    result = result.map(row => JSON.parse(row))

      // result = result.sort(function (a, b) {
      //     return new Date(b.createdAt) - new Date(a.createdAt);
      // });

      let data = result;

      try {
        const columns = [
          {
            id: 'createdAt',
            Header: () => (
              <div className="pluginTableHeader">
                <p>Date</p>
              </div>
            ),
            width: 200,

            accessor: d => dateFormat(d.createdAt, 'isoDateTime'),
            getProps: () => {
              return {
                style: {
                  color: '#e1e1e1',
                  fontSize: '14px',
                },
              };
            },
          },
          {
            //id
            Header: () => (
              <div className="pluginTableHeader">
                <p>Text</p>
              </div>
            ),
            accessor: 'text',
            getProps: () => {
              return {
                style: {
                  color: '#e1e1e1',
                  fontSize: '14px',
                },
              };
            },
          },
        ];

        render(
          <div>
            <ReactTable
              data={data}
              columns={columns}
              defaultPageSize={1000}
              pageSizeOptions={[100, 1000, 10000]}
              filterable={true}
              defaultFilterMethod={(filter, row) => filterMethod(filter, row)}
            />
          </div>,
          document.getElementById('logDiv')
        );

        // const data = [
        //     {
        //       name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
        //     },
        //     {
        //       name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
        //     },

        //   ];

        //Old graph code

        data = result.sort(function(a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

        while (data.length > 100) {
          data = data.filter((e, i) => i % 2);
        }

        var data1 = data.map(item => ({
          date: dateFormat(item.createdAt, 'isoDateTime'),
          rss: item.nodeMem.rss / 1000000,
          heapTotal: item.nodeMem.heapTotal / 1000000,
          heapUsed: item.nodeMem.heapUsed / 1000000,
        }));

        //   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

        render(
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Label />
              <Legend />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
              <Line type="monotone" dataKey="rss" stroke="#8884d8" />
              <Line type="monotone" dataKey="heapTotal" stroke="#82ca9d" />
              <Line type="monotone" dataKey="heapUsed" stroke="#00b5c9" />
            </LineChart>
          </ResponsiveContainer>,
          document.getElementById('memGraphDiv')
        );

        var data2 = data.map(item => ({
          date: dateFormat(item.createdAt, 'isoDateTime'),
          systemUsedMem: item.systemUsedMem,
          systemFreeMem: item.systemFreeMem,
        }));

        //   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

        render(
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Label />
              <Legend />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
              <Line type="monotone" dataKey="systemUsedMem" stroke="#8884d8" />
              <Line type="monotone" dataKey="systemFreeMem" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>,
          document.getElementById('sysmemGraphDiv')
        );

        var data3 = data.map(item => ({
          date: dateFormat(item.createdAt, 'isoDateTime'),
          systemCPUPercentage: item.systemCPUPercentage,
        }));

        //   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

        render(
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data3}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Label />
              <Legend />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
              <Line
                type="monotone"
                dataKey="systemCPUPercentage"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>,
          document.getElementById('syscpuGraphDiv')
        );
      } catch (err) {
        console.log(err);
      }
    });
  }

  renderVerboseLogsButton() {
    return this.props.globalSettings.map(item => (
      <ToggleButton
        key={`verbose-log-${i}`}
        thumbStyle={borderRadiusStyle}
        trackStyle={borderRadiusStyle}
        value={item.verboseLogs}
        style={ButtonStyle}
        onToggle={() => {
          GlobalSettingsDB.upsert('globalsettings', {
            $set: {
              verboseLogs: !item.verboseLogs,
            },
          });
        }}
      />
    ));
  }

  renderLogButtons() {
    return this.props.globalSettings.map(item => {
      if (item.logsLoading == true) {
        return (
          <ClipLoader
            sizeUnit={'px'}
            size={25}
            color={'white'}
            loading={true}
          />
        );
      } else {
        return (
          <div>
            <Button variant="outline-light" onClick={() => this.renderLogDB()}>
              <span className="buttonTextSize">Load</span>
            </Button>
            {'\u00A0'}
            <Button variant="outline-light" onClick={() => this.renderRaw()}>
              <span className="buttonTextSize">RAW</span>
            </Button>
            {'\u00A0'}
            <Button variant="outline-light" onClick={() => this.clearLogDB()}>
              <span className="buttonTextSize">Delete</span>
            </Button>
          </div>
        );
      }
    });
  }

  render() {
    return (
      <div className="containerGeneral">
        <center>
          <header>
            <h1>Logs</h1>
          </header>
        </center>

        <p></p>
        <p></p>

        <center>
          <div style={ButtonStyle}>
            <p>Verbose logs (large size, debug only):</p>

            {this.renderVerboseLogsButton()}
          </div>
        </center>

        <p></p>
        <p></p>

        <center>{this.renderLogButtons()}</center>

        <div className="libraryContainer">
          <p>
            <div id="rawLog"></div>
          </p>

          <div id="logDiv"></div>
        </div>
        <div className="memGraph" id="memGraphDiv"></div>

        <div className="memGraph" id="sysmemGraphDiv"></div>

        <div className="memGraph" id="syscpuGraphDiv"></div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('GlobalSettingsDB');

  return {
    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),
  };
})(App);
