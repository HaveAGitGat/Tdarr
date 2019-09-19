import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import ToggleButton from 'react-toggle-button'

import { render } from 'react-dom';



import { FileDB, GlobalSettingsDB, ClientDB } from '../api/tasks.js';

import Workers from '../ui/tab_Transcoding_Worker.jsx';
import ReactTable from "react-table";

import Slider from 'react-input-slider';




var ButtonStyle = {
  display: 'inline-block',
}


// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);

    this.state = { value: true, lowCPU: true, x: 1, }

    this.toggleWorkers = this.toggleWorkers.bind(this);

    this.addWorker = this.addWorker.bind(this);





  }


  addWorker(workerType) {

    Meteor.call('launchWorker', workerType, 1, function (error, result) { });
  }

  toggleWorkers = () => {



    this.setState({
      value: !this.state.value,
    })


    Meteor.call('getWorkers', (error, result) => {

      var workers = result
      for (var i = 0; i < workers.length; i++) {

        Meteor.call('upsertWorkers', workers[i]._id, {
          idle: !this.state.value,
        }, function (error, result) { });

      }

    });
  }

  renderLowCPUButton() {

    return this.props.globalSettings.map((item, i) => (

      <ToggleButton value={item.lowCPUPriority} onToggle={() => {

        GlobalSettingsDB.upsert('globalsettings',
          {
            $set: {
              lowCPUPriority: !item.lowCPUPriority,
            }
          }

        );

      }
      } />




    ));
  }

  renderSlider(slider) {

    return this.props.globalSettings.map((item, i) => (

      <span>
        {item[slider]}
        <Slider
          axis="x"
          xstep={1}
          xmin={0}
          xmax={20}
          x={item[slider]}
          onChange={({ x }) => {

            GlobalSettingsDB.upsert('globalsettings',
              {
                $set: {
                  [slider]: x,
                }
              }

            );



          }}
        />
      </span>

    ));


  }


  componentDidMount() {

    this.interval = setInterval(() => this.renderWorkers(), 500);


  }


  renderWorkers = () => {



    Meteor.call('getWorkers', (error, result) => {


      var workers = result.map((worker, i) => (

        <Workers
          key={worker._id}
          worker={worker}

        />

      ));

      render(workers, document.getElementById('allWorkersContainerID'));


      var generalWorkers = result.filter(row => row.mode == "general");
      var transcodeWorkers = result.filter(row => row.mode == "transcode");
      var healthcheckWorkers = result.filter(row => row.mode == "healthcheck");

      var workerButtons = <div><input type="button" className="generalWorkerButton" onClick={() => (this.addWorker("general"))} value={"(" + generalWorkers.length + ") General worker +"}></input>
        <input type="button" className="transcodeWorkerButton" onClick={() => this.addWorker("transcode")} value={"(" + transcodeWorkers.length + ") Transcode worker +"}></input>
        <input type="button" className="healthcheckWorkerButton" onClick={() => this.addWorker("healthcheck")} value={"(" + healthcheckWorkers.length + ") Health check worker +"}></input>
      </div>

      render(workerButtons, document.getElementById('workerButtons'));


    });







  }


  renderTable(table, type, mode) {



    var tables = this.props.clientDB



    if (tables.length == 0) {


      var data = [{ _id: 1, file: "Loading...", value: 1 }]

      return data.map((row, i) => (

        <div className="tableItem">
          <li key={row._id}>{row.file}</li>
        </div>

      ));

    } else {

      var data = tables[0][table]

    }

    if (type == "queue") {

      return data.map((row, i) => (

        <div className="tableItem">
          <li key={row._id}>{i + 1}  {row.file} {this.renderBumpButton(row.file)} </li>
        </div>

      ));
    }

    if (type == "success") {

      return data.map((row, i) => (

        <div className="tableItem">
          <li key={row._id}>{i + 1}  {row.file}  {this.renderRedoButton(row.file, mode)} {this.renderInfoButton(row.cliLog)} </li>
        </div>

      ));
    }

    if (type == "error") {

      return data.map((row, i) => (

        <div className="tableItem">
          <li key={row._id}>{i + 1}  {row.file}{this.renderRedoButton(row.file, mode)}{this.renderIgnoreButton(row.file, mode)} {this.renderInfoButton(row.cliLog)}  </li>
        </div>

      ));
    }



  }


  renderBumpButton(file) {

    return <input type="button" onClick={() => {

      FileDB.upsert(file,
        {
          $set: {
            createdAt: new Date(),
          }
        });


    }} value={"↑"}></input>


  }

  renderRedoButton(file, mode) {

    return <input type="button" onClick={() => {

      FileDB.upsert(file,
        {
          $set: {
            [mode]: "Not attempted",
            processingStatus: false,
            createdAt: new Date(),
          }
        });


    }} value={"↻"}></input>


  }

  renderIgnoreButton(file, mode) {

    return <input type="button" onClick={() => {

      FileDB.upsert(file,
        {
          $set: {
            [mode]: "Ignored",
            processingStatus: false,
            createdAt: new Date(),
          }
        });


    }} value={"Ignore"}></input>


  }

  renderInfoButton(cliLog) {

    return <input type="button" onClick={() => {

      alert(cliLog)


    }} value={"i"}></input>

  }

  searchDB =(event) => {

    event.preventDefault();


    Meteor.call('searchDB', ReactDOM.findDOMNode(this.refs.searchString).value.trim(), (error, result) => {

      //console.log(result)

      if (result.length == 0) {

        render("No results", document.getElementById('searchResults'));
      } else {


        var results = result.map((row, i) => (


          <li key={row.key}>{row.file} {this.renderBumpButton(row.file)} Transcode:{this.renderRedoButton(row.file, 'TranscodeDecisionMaker')}Health check:{this.renderRedoButton(row.file, 'HealthCheck')}Info:{this.renderInfoButton(row.cliLog)}</li>


        ));

        render(results, document.getElementById('searchResults'));

      }

    })






  }




  render() {



    return (


      <span >
        {/* <h1>Td</h1> */}

        <p></p>

        <div className="container">

          <center>
            <table>
              <tr>
                <th>Scheduled worker limits</th>
              </tr>
              <tr>
                <td>General:</td>
                <td>{this.renderSlider('generalWorkerLimit')}</td>
              </tr>
              <tr>
                <td>Transcode:</td>
                <td>{this.renderSlider('transcodeWorkerLimit')}</td>

              </tr>
              <tr>
                <td>Health check:</td>
                <td>{this.renderSlider('healthcheckWorkerLimit')}</td>

              </tr>


            </table>
          </center>



          <p></p>

          <div style={ButtonStyle} className="workerButtoncontainer">

            <div id="workerButtons" style={ButtonStyle}></div>




            <div style={ButtonStyle}>
              <span className="toggleAllWorkerButton">Toggle all workers
     <div style={ButtonStyle}>
                  <ToggleButton
                    value={this.state.value}
                    onToggle={this.toggleWorkers}
                  />

                </div>
              </span>
            </div>

            <input type="button" className="cancelAllWorkersButton" onClick={() => {

              if (confirm('Are you sure you want to cancel all workers?')) {


                Meteor.call('getWorkers', function (error, result) {

                  var workers = result

                  for (var i = 0; i < workers.length; i++) {

                    Meteor.call('killWorker', workers[i]._id, function (error, result) { })
                  }

                });


              }
            }
            } value="Cancel all workers"></input>

            <div style={ButtonStyle}>
              <span className="toggleAllWorkerButton">Low CPU priority:<div style={ButtonStyle}>

                {this.renderLowCPUButton()}


              </div>
              </span>
            </div>

          </div>


          <p></p>

          <div className="allWorkersContainer" id="allWorkersContainerID">


          </div>

        </div>

        <form onSubmit={this.searchDB}  >
          <input type="text" className="searchBar" ref="searchString" placeholder="Search for files to bump them up in the queue etc..." style={ButtonStyle} ></input>
       
          <input type="button" onClick={this.searchDB} value={"Search"} style={ButtonStyle}></input>
          <input type="button" onClick={ () => {

        render('', document.getElementById('searchResults'));
          }} value={"Clear"} style={ButtonStyle}></input>
        </form>




        <div id="searchResults" ref="searchResults"></div>





        <div className="queuegrid-container">

          <div className="queuegrid-item">



            <center><p><b>Transcode queue</b></p></center>


            {this.renderTable('table1', 'queue')}



          </div>

          <div className="queuegrid-item">


            <center><p><b>Transcode: Completed or passed</b></p></center>


            {this.renderTable('table2', 'success', 'TranscodeDecisionMaker')}



          </div>

          <div className="queuegrid-item">

            <center><p><b>Transcode: Error</b></p></center>



            {this.renderTable('table3', 'error', 'TranscodeDecisionMaker')}



          </div>

          <div className="queuegrid-item">

            <center><p><b>Health check queue</b></p></center>


            {this.renderTable('table4', 'queue')}



          </div>

          <div className="queuegrid-item">


            <center><p><b>Health check: Healthy</b></p></center>


            {this.renderTable('table5', 'success', 'HealthCheck')}



          </div>

          <div className="queuegrid-item">


            <center><p><b>Health check: Error</b></p></center>


            {this.renderTable('table6', 'error', 'HealthCheck')}



          </div>


        </div>
      </span>
    );
  }
}

export default withTracker(() => {

  Meteor.subscribe('GlobalSettingsDB');
  Meteor.subscribe('ClientDB');


  return {


    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),

    clientDB: ClientDB.find({}).fetch(),


  };
})(App);
