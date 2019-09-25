import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import ToggleButton from 'react-toggle-button'
import Modal from "reactjs-popup";

import { render } from 'react-dom';

import { Button } from 'react-bootstrap';


import { StatisticsDB, FileDB, GlobalSettingsDB, ClientDB } from '../api/tasks.js';

import Workers from '../ui/tab_Transcoding_Worker.jsx';
import ReactTable from "react-table";

import Slider from 'react-input-slider';

import ItemButton from './item_Button.jsx'

import ClipLoader from 'react-spinners/ClipLoader';




var ButtonStyle = {
  display: 'inline-block',
}





// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);

    this.state = { value: true, lowCPU: true, x: 1, workerButtonsLoad: true, }

    this.toggleWorkers = this.toggleWorkers.bind(this);

    this.addWorker = this.addWorker.bind(this);





  }


  addWorker = (workerType) => {

      console.log(this.state.workerButtonsLoad)


      this.setState({
        workerButtonsLoad: false,
      })

      console.log(this.state.workerButtonsLoad)

      setTimeout(this.reset, 1000);
  

    Meteor.call('launchWorker', workerType, 1,  (error, result) => { 



    });

  }

  reset = () => {

    this.setState({
      workerButtonsLoad: true,
    })


    console.log(this.state.workerButtonsLoad)

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



  renderSlider(slider) {

    return this.props.globalSettings.map((item, i) => (

      <span className="sliderWidth">
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

  renderStat(stat) {


    var statistics = this.props.statistics


    if (statistics.length == 0) {


      var statDat = <ClipLoader

        sizeUnit={"px"}
        size={10}
        color={'#000000'}
        loading={true}
      />

    } else {
      var statDat = statistics[0][stat]



    }


    return statDat

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




  componentDidMount() {

    this.interval = setInterval(() => this.renderWorkers(), 500);

    render(<ClipLoader

      sizeUnit={"px"}
      size={25}
      color={'#000000'}
      loading={true}
    />


      , document.getElementById('workerButtons'));


  }


  renderWorkers = () => {



    Meteor.call('getWorkers', (error, result) => {


      var workers = result.map((worker, i) => (

        <Workers
          key={worker._id}
          worker={worker}

        />

      ));

      try {

        render(workers, document.getElementById('allWorkersContainerID'));
      } catch (err) { }

      var generalWorkers = result.filter(row => row.mode == "general");
      var transcodeWorkers = result.filter(row => row.mode == "transcode");
      var healthcheckWorkers = result.filter(row => row.mode == "healthcheck");



if(!!this.state.workerButtonsLoad){

  var workerButtons = <div>

  <div className={!!this.state.workerButtonsLoad ? '' : 'hidden'} style={ButtonStyle}>
    
  
            <input type="button" className="generalWorkerButton" onClick={() => (this.addWorker("general"))} value={"(" + generalWorkers.length + ") General worker +"}></input>
            <input type="button" className="transcodeWorkerButton" onClick={() => this.addWorker("transcode")} value={"(" + transcodeWorkers.length + ") Transcode worker +"}></input>
            <input type="button" className="healthcheckWorkerButton" onClick={() => this.addWorker("healthcheck")} value={"(" + healthcheckWorkers.length + ") Health check worker +"}></input>
  
            </div>
        </div>




}else{

  var workerButtons = <div>
  
          <div className={!this.state.workerButtonsLoad ? '' : 'hidden'} style={ButtonStyle}>
  
          <div className="buttonClipPlaceholder" style={ButtonStyle}>
          <center>
            <ClipLoader
  
              sizeUnit={"px"}
              size={25}
              color={'#000000'}
              loading={true}
            />
            </center>
  
  </div>
  
  <div className="buttonClipPlaceholder" style={ButtonStyle}>
  
  <center>
  
            <ClipLoader
  
              sizeUnit={"px"}
              size={25}
              color={'#000000'}
              loading={true}
            />
            </center>
  
  </div>
  
  <div className="buttonClipPlaceholder" style={ButtonStyle}>
  
  <center>
            <ClipLoader
  
              sizeUnit={"px"}
              size={25}
              color={'#000000'}
              loading={true}
            />
            </center>
  
  
            </div>
  </div>
  
        </div>



}








      try {
        render(workerButtons, document.getElementById('workerButtons'));

      } catch (err) { }

    

    });







  }


  renderTable(table, type, mode) {



    var tables = this.props.clientDB



    if (tables.length == 0) {


      var data = [{ _id: 1, file: "Loading...", value: 1 }]

      return data.map((row, i) => (


        <tr>
          <td><ClipLoader

            sizeUnit={"px"}
            size={25}
            color={'#000000'}
            loading={true}
          /></td>
        </tr>


      ));

    } else {

      var data = tables[0][table]

    }

    if (type == "queue") {

      return data.map((row, i) => (

        // <div className="tableItem">
        //   <li key={row._id}>{i + 1}  {row.file} {this.renderBumpButton(row.file)} </li>



        // </div>


        <tr key={row._id}>
          <td>{i + 1}</td><td>{row.file}</td><td>{this.renderBumpButton(row.file)}</td>
        </tr>






      ));
    }

    if (type == "success") {

      if (mode == "TranscodeDecisionMaker") {

        return data.map((row, i) => (

          // <div className="tableItem">
          //   <li key={row._id}>{i + 1}  {row.file}  {this.renderRedoButton(row.file, mode)} {this.renderInfoButton(row.cliLog)} </li>
          // </div>

          <tr key={row._id}>
            <td>{i + 1}</td><td>{row.file}</td><td>{row.TranscodeDecisionMaker}</td><td>{this.renderRedoButton(row.file, mode)}</td><td>{this.renderInfoButton(row.cliLog)}</td>
          </tr>


        ));

      } else {

        return data.map((row, i) => (

          // <div className="tableItem">
          //   <li key={row._id}>{i + 1}  {row.file}  {this.renderRedoButton(row.file, mode)} {this.renderInfoButton(row.cliLog)} </li>
          // </div>

          <tr key={row._id}>
            <td>{i + 1}</td><td>{row.file}</td><td>{this.renderRedoButton(row.file, mode)}</td><td>{this.renderInfoButton(row.cliLog)}</td>
          </tr>



        ));

      }
    }

    if (type == "error") {

      return data.map((row, i) => (

        // <div className="tableItem">
        //   <li key={row._id}>{i + 1}  {row.file}{this.renderRedoButton(row.file, mode)}{this.renderIgnoreButton(row.file, mode)} {this.renderInfoButton(row.cliLog)}  </li>
        // </div>

        <tr key={row._id}>
          <td>{i + 1}</td><td>{row.file}</td><td>{this.renderRedoButton(row.file, mode)}</td><td>{this.renderIgnoreButton(row.file, mode)}</td><td>{this.renderInfoButton(row.cliLog)}</td>
        </tr>


      ));
    }



  }


  renderBumpButton(file) {
    var obj = {
      createdAt: new Date()
    }


    return <ItemButton file={file} obj={obj} symbol={'↑'} />

  }

  renderRedoButton(file, mode) {


    var obj = {
      [mode]: "Not attempted",
      processingStatus: false,
      createdAt: new Date(),
    }


    return <ItemButton file={file} obj={obj} symbol={'↻'} />
  }

  renderIgnoreButton(file, mode) {

    var obj = {
      [mode]: "Ignored",
      processingStatus: false,
      createdAt: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'Ignore'} />


  }

  renderInfoButton(cliLog) {

    return <Modal
      trigger={<Button variant="dark" >i</Button>}
      modal
      closeOnDocumentClick
    >
       <div className="frame">
    <div className="scroll"> 
   {cliLog}
      
    </div>
  </div>
    </Modal>

  }





  render() {



    return (


      <span >
        {/* <h1>Td</h1> */}


        <div className="dbStatusContainer">
          <table>
            <tbody>
              <tr>

                <td> <p>DB -</p></td>
                <td>{'\u00A0'}<b>Poll period</b>:{this.renderStat('DBPollPeriod')}</td>
                <td>{'\u00A0'}<b>Fetch time</b>: {this.renderStat('DBFetchTime')}</td>
                <td>{'\u00A0'}<b>Total</b>: {this.renderStat('DBTotalTime')}</td>
                <td>{'\u00A0'}<b>Backlog</b>: {this.renderStat('DBQueue')}</td>
                <td>{'\u00A0'}<b>Load</b>: {this.renderStat('DBLoadStatus')}</td>

              </tr>


            </tbody>
          </table>
        </div>





        <p></p>

        <div className="container">




          <center>
            <table>
              <tbody>
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

              </tbody>
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






        <div className="queuegrid-container">

          <div className="queuegrid-item">



            <center><p><b>Transcode queue</b></p></center>

            <table className="itemTable">   <tbody>
              <tr>
                <th>No.</th>
                <th>File</th>
                <th>Bump</th>

              </tr>
              {this.renderTable('table1', 'queue')}
            </tbody></table>



          </div>

          <div className="queuegrid-item">


            <center><p><b>Transcode: Completed or passed</b></p></center>


            <table className="itemTable"><tbody>
              <tr>
                <th>No.</th>
                <th>File</th>
                <th>Status</th>
                <th>Re-queue</th>
                <th>Info</th>


              </tr>
              {this.renderTable('table2', 'success', 'TranscodeDecisionMaker')}

            </tbody></table>

          </div>

          <div className="queuegrid-item">

            <center><p><b>Transcode: Error</b></p></center>


            <table className="itemTable">   <tbody>
              <tr>
                <th>No.</th>
                <th>File</th>
                <th>Status</th>
                <th>Ignore</th>
                <th>Info</th>


              </tr>


              {this.renderTable('table3', 'error', 'TranscodeDecisionMaker')}


            </tbody></table>

          </div>

          <div className="queuegrid-item">

            <center><p><b>Health check queue</b></p></center>


            <table className="itemTable">   <tbody>
              <tr>
                <th>No.</th>
                <th>File</th>
                <th>Bump</th>

              </tr>
              {this.renderTable('table4', 'queue')}

            </tbody></table>

          </div>

          <div className="queuegrid-item">


            <center><p><b>Health check: Healthy</b></p></center>



            <table className="itemTable">   <tbody>
              <tr>
                <th>No.</th>
                <th>File</th>
                <th>Re-queue</th>
                <th>Info</th>
              </tr>



              {this.renderTable('table5', 'success', 'HealthCheck')}


            </tbody></table>
          </div>

          <div className="queuegrid-item">


            <table className="itemTable">   <tbody>
              <tr>
                <th>No.</th>
                <th>File</th>
                <th>Status</th>
                <th>Ignore</th>
                <th>Info</th>


              </tr>

              <center><p><b>Health check: Error</b></p></center>


              {this.renderTable('table6', 'error', 'HealthCheck')}

            </tbody></table>

          </div>


        </div>
      </span>
    );
  }
}

export default withTracker(() => {

  Meteor.subscribe('GlobalSettingsDB');
  Meteor.subscribe('ClientDB');
  Meteor.subscribe('StatisticsDB');


  return {


    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),

    clientDB: ClientDB.find({}).fetch(),
    statistics: StatisticsDB.find({}).fetch(),


  };
})(App);
