import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';

import ToggleButton from 'react-toggle-button'


import ReactTable from "react-table";
import "react-table/react-table.css";
import { render } from 'react-dom';
import ClipLoader from 'react-spinners/ClipLoader';


import { GlobalSettingsDB } from '../api/tasks.js';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Brush
} from 'recharts';

var dateFormat = require('dateformat');



var ButtonStyle = {
    display: 'inline-block',
  }


class App extends Component {

    constructor(props) {
        super(props);

    }



    

    clearLogDB() {



        if (confirm('Are you sure you want to delete the logs?')) {

            GlobalSettingsDB.upsert('globalsettings',
            {
                $set: {
                    logsLoading: true,
                }
            }
        );

            Meteor.call('clearLogDB', (error, result) => {

            })


        };

    }


    renderRaw() {

        GlobalSettingsDB.upsert('globalsettings',
            {
                $set: {
                    logsLoading: true,
                }
            }
        );

        render('', document.getElementById('logDiv'));
        render('', document.getElementById('memGraphDiv'));
        render('', document.getElementById('sysmemGraphDiv'));
        render('', document.getElementById('syscpuGraphDiv'));




        Meteor.call('getLog', (error, result) => {
            render('Loading...', document.getElementById('rawLog'));

            try{

            result = JSON.stringify(result)
            //console.log(result)
            render(result, document.getElementById('rawLog'));

        }catch(err){}




        })
    }


    renderLogDB() {

        GlobalSettingsDB.upsert('globalsettings',
            {
                $set: {
                    logsLoading: true,
                }
            }
        );

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

            var data = result

try{

            const columns = [{
                id: 'createdAt',
                Header: 'Date',
                width: 200,
                // accessor: d => d.createdAt.toString()
                accessor: d => dateFormat(d.createdAt, "isoDateTime")



            }, {
                //id
                Header: 'Text',
                accessor: 'text',
                //  getProps: (state, rowInfo, column) => {
                //      return {
                //          style: {
                //              background: rowInfo && rowInfo.row.text.includes("Error") ? 'red' : null,
                //          },
                //      }
                //  }
            }
                // , {
                //     id: 'nodeMem1',
                //     Header: 'Core memory rss',
                //     accessor: d => (d.nodeMem.rss / 1000000) + " MB"

                // }, {
                //     id: 'nodeMem2',
                //     Header: 'Core memory heapTotal',
                //     accessor: d => (d.nodeMem.heapTotal / 1000000) + " MB"

                // }, {
                //     id: 'nodeMem3',
                //     Header: 'Core memory heapUsed',
                //     accessor: d => (d.nodeMem.heapUsed / 1000000) + " MB"

                // }, {
                //     Header: 'Total used system memory',
                //     accessor: 'systemUsedMem',
                // },
                // {
                //     Header: 'Total free system memory',
                //     accessor: 'systemFreeMem',
                // },
                // {
                //     Header: 'CPU usage',
                //     accessor: 'systemCPUPercentage',
                // },




            ]




            render(<div>
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={10}
                    pageSizeOptions={[10, 100, 1000]}
                />
            </div>, document.getElementById('logDiv'));


            // const data = [
            //     {
            //       name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
            //     },
            //     {
            //       name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
            //     },

            //   ];

            var data = result.sort(function (a, b) {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });


            while (data.length > 100) {

                data = data.filter((e, i) => i % 2)

            }

            var data1 = data.map((item, i) => (

                {

                    date: dateFormat(item.createdAt, "isoDateTime"),
                    rss: item.nodeMem.rss / 1000000,
                    heapTotal: item.nodeMem.heapTotal / 1000000,
                    heapUsed: item.nodeMem.heapUsed / 1000000
                }

            ));

            //   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

            render(
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data1}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Label />
                        <Legend />
                        <Brush dataKey='date' height={30} stroke="#8884d8" />
                        <Line type="monotone" dataKey="rss" stroke="#8884d8" />
                        <Line type="monotone" dataKey="heapTotal" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="heapUsed" stroke="#00b5c9" />

                    </LineChart></ResponsiveContainer>, document.getElementById('memGraphDiv'));



            var data2 = data.map((item, i) => (

                {
                    date: dateFormat(item.createdAt, "isoDateTime"),
                    systemUsedMem: item.systemUsedMem,
                    systemFreeMem: item.systemFreeMem,

                }

            ));

            //   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

            render(
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data2}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Label />
                        <Legend />
                        <Brush dataKey='date' height={30} stroke="#8884d8" />
                        <Line type="monotone" dataKey="systemUsedMem" stroke="#8884d8" />
                        <Line type="monotone" dataKey="systemFreeMem" stroke="#82ca9d" />


                    </LineChart></ResponsiveContainer>, document.getElementById('sysmemGraphDiv'));


            var data3 = data.map((item, i) => (

                {
                    date: dateFormat(item.createdAt, "isoDateTime"),
                    systemCPUPercentage: item.systemCPUPercentage,

                }

            ));

            //   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

            render(
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data3}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Label />
                        <Legend />
                        <Brush dataKey='date' height={30} stroke="#8884d8" />
                        <Line type="monotone" dataKey="systemCPUPercentage" stroke="#8884d8" />


                    </LineChart></ResponsiveContainer>, document.getElementById('syscpuGraphDiv'));


}catch(err){}





        });

    }

    renderVerboseLogsButton() {


        return this.props.globalSettings.map((item, i) => (

            <ToggleButton value={item.verboseLogs}  style={ButtonStyle} onToggle={() => {

                GlobalSettingsDB.upsert('globalsettings',
                    {
                        $set: {
                            verboseLogs: !item.verboseLogs,
                        }
                    }

                );

            }
            } />
        ));
    }

    renderLogButtons() {

        return this.props.globalSettings.map((item, i) => {

            if (item.logsLoading == true) {

                return <ClipLoader

                    sizeUnit={"px"}
                    size={25}
                    color={'#000000'}
                    loading={true}
                />

            } else {

                return <div>

                    <input type="button" onClick={() => this.renderLogDB()} value={"Load"} className="addFolderButton"></input>
                    <input type="button" onClick={() => this.renderRaw()} value={"RAW"} className="addFolderButton"></input>
                    <input type="button" onClick={() => this.clearLogDB()} value={"Delete"} className="addFolderButton"></input>

                </div>


            }

        }
        );




    }


    render() {
        return (


            <div className="containerGeneral">
                <header>
                    <h1>Logs</h1>
                </header>

                <p></p>
                <p></p>


               <div  style={ButtonStyle}>
               Verbose logs (large size, debug only):

{this.renderVerboseLogsButton()}

               </div>
   
                <p></p>
                <p></p>


                {this.renderLogButtons()}



                <div id="rawLog">
                </div>


                <div id="logDiv">
                </div>

                <div className="memGraph" id="memGraphDiv">
                </div>

                <div className="memGraph" id="sysmemGraphDiv">
                </div>

                <div className="memGraph" id="syscpuGraphDiv">
                </div>
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



