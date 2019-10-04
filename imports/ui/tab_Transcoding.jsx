import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import ToggleButton from 'react-toggle-button'
import Modal from "reactjs-popup";

import { render } from 'react-dom';

import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';


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

    this.state = { value: true, lowCPU: true, x: 1, }



  }





  alterWorkerLimit(process,workerType){



    var globsettings = this.props.globalSettings[0]
    globsettings= globsettings

    if(process == "increase"){


      GlobalSettingsDB.update("globalsettings",
          {
            $inc: { [workerType]: 1 }
          }
        );

    }else if(process == "decrease"){

      if(globsettings[workerType] > 0){

        GlobalSettingsDB.update("globalsettings",
        {
          $inc: { [workerType]: -1 }
        }
      );

      }
    }
  }


  renderSlider(slider,sliderColour,sliderColour2) {

    if(slider == 'generalWorkerLimit'){

      var title = 'General'

    }else if(slider == 'transcodeWorkerLimit'){

      var title = 'Transcode'


    }else if(slider == 'healthcheckWorkerLimit'){

      var title = 'Health check'

    }
    

    return this.props.globalSettings.map((item, i) => (

      <span className="sliderWidth">


        <center> {title}({item[slider]})</center>
      
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

          styles={{
            track: {
              width:'100%',
              opacity: 1,
              backgroundColor: sliderColour2,
            },
            active: {
              opacity: 1,
              backgroundColor: sliderColour,
             
            },
            thumb: {
              width: 25,
              height: 25
            },
            disabled: {
              opacity: 0.5
            }
          }}
        />
      </span>

    ));


  }

  renderStat(stat) {


    var statistics = this.props.statistics


    if (statistics.length == 0) {


      var statDat = <center><ClipLoader

        sizeUnit={"px"}
        size={10}
        color={'#000000'}
        loading={true}
      /></center>

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

;


    

    });
  }


  renderTable(table, type, mode) {



    var tables = this.props.clientDB



    if (tables.length == 0) {


      var data = [{ _id: 1, file: "Loading...", value: 1 }]

      return data.map((row, i) => (


        <tr align="center">
          <td ><ClipLoader

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

          <tr key={row._id}>
            <td>{i + 1}</td><td>{row.file}</td><td>{row.TranscodeDecisionMaker}</td><td>{this.renderRedoButton(row.file, mode)}</td><td>{this.renderInfoButton(row.cliLog)}</td>
          </tr>


        ));

      } else {

        return data.map((row, i) => (



          <tr key={row._id}>
            <td>{i + 1}</td><td>{row.file}</td><td>{this.renderRedoButton(row.file, mode)}</td><td>{this.renderInfoButton(row.cliLog)}</td>
          </tr>



        ));

      }
    }

    if (type == "error") {

      return data.map((row, i) => (

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

    try{

    cliLog = cliLog.split("\n")

    cliLog = cliLog.map( row => <p>{row}</p> )

    return <Modal
      trigger={<Button variant="outline-dark" >i</Button>}
      modal
      closeOnDocumentClick
    >
       <div className="frame">
    <div className="scroll"> 
   {cliLog}
      
    </div>
  </div>
    </Modal>

    }catch(err){

      return null

    }

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



<center><Modal
      trigger={<Button variant="outline-dark" >i</Button>}
      modal
      closeOnDocumentClick
    >
       <div className="frame">
    <div className="scroll"> 
 
    <p>Use the sliders to tell Tdarr to start up and maintain the specified number of workers. </p>
    <p>Workers which are toggled 'Off' will finish their current item before closing down.</p>
    <p>If you cancel an item, the worker will move onto the next item in the queue.</p>

    <p></p>
    <p>Workers process newest items first and cycle between your libraries.</p>

    <p>General workers process both transcode and health check items. They prioritise health check </p>
    <p></p>
    <p></p>
    <p></p>

    <p>Important: Workers will not process items unless they are within the scheduled times set in the library settings.</p>

      
    </div>
  </div>
    </Modal></center>

        <center>Workers:</center>








<div className="sliderGrid-container">

<div className="sliderGrid-item2">
<Button   variant="outline-dark" onClick={() => this.alterWorkerLimit("decrease","generalWorkerLimit")} >-</Button>
</div>

<div className="sliderGrid-item">
{this.renderSlider('generalWorkerLimit','black','#808080')}
</div>
<div className="sliderGrid-item3">
<Button   variant="outline-dark" onClick={() => this.alterWorkerLimit("increase","generalWorkerLimit")} >+</Button>
</div>


<div className="sliderGrid-item2">
<Button   variant="outline-dark" onClick={() => this.alterWorkerLimit("decrease","transcodeWorkerLimit")} >-</Button>
</div>

<div className="sliderGrid-item">
{this.renderSlider('transcodeWorkerLimit','#66ccff','#B3E6FF')}
</div>

<div className="sliderGrid-item3">
<Button   variant="outline-dark" onClick={() => this.alterWorkerLimit("increase","transcodeWorkerLimit")} >+</Button>
</div>


<div className="sliderGrid-item2">
<Button   variant="outline-dark" onClick={() => this.alterWorkerLimit("decrease","healthcheckWorkerLimit")} >-</Button>
</div>

<div className="sliderGrid-item">
{this.renderSlider('healthcheckWorkerLimit','#4CAF50','#A6D7A8')}
</div>

<div className="sliderGrid-item3">
<Button   variant="outline-dark" onClick={() => this.alterWorkerLimit("increase","healthcheckWorkerLimit")} >+</Button>
</div>


</div>



          <p></p>


          
          

          <center>

          <div style={ButtonStyle} className="workerButtoncontainer">






            <Button variant="outline-danger" onClick={() => {

              if (confirm('Are you sure you want to cancel all workers?')) {


                Meteor.call('getWorkers', function (error, result) {

                  var workers = result

                  for (var i = 0; i < workers.length; i++) {

                    Meteor.call('killWorker', workers[i]._id, function (error, result) { })
                  }

                });


              }
            }
            } >Cancel all workers</Button>

{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}

            <div style={ButtonStyle}>
              <span >Low CPU priority:<div style={ButtonStyle}>

                {this.renderLowCPUButton()}


              </div>
              </span>
            </div>

          </div>
          </center>


          <p></p>
          <br/>
          <br/>
          <br/>

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
