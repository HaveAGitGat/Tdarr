import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { LogDB } from '../api/tasks.js';

import ReactTable from "react-table";
import "react-table/react-table.css";



class App extends Component {

    constructor(props) {
        super(props);

    }











    renderLogDB() {




        const data = this.props.log


       // console.log(data)

        const columns = [{
            id: 'createdAt',
            Header: 'Date',
            accessor: d => d.createdAt.toISOString()
        }, {
            Header: 'Log',
            accessor: 'text',
            getProps: (state, rowInfo, column) => {
                return {
                    style: {
                        background: rowInfo && rowInfo.row.text.includes("Error") ? 'red' : null,
                    },
                }
            }
        }
        ]

        // const columns = [{
        //     Header: 'Name',
        //     accessor: 'name'
        //   },{
        //     Header: 'Age',
        //     accessor: 'age'
        //   }]

        return (
            <div>
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={50}
                    pageSizeOptions={[,50,100, 500]}
                />
            </div>
        )


    }

    render() {
        return (


            <div className="container">
                <header>
                    <h1>Log</h1>
                </header>


                {this.renderLogDB()}

            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('LogDB');
    return {
        log: LogDB.find({}, { sort: { createdAt: -1 } , limit : 10} ).fetch(),
    };
})(App);