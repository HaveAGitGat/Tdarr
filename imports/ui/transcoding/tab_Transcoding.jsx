import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import ToggleButton from 'react-toggle-button'
import Modal from "reactjs-popup";

import { render } from 'react-dom';

import { Button } from 'react-bootstrap';


import { StatisticsDB, FileDB, GlobalSettingsDB, ClientDB } from '../../api/tasks.js';

import Workers from './tab_Transcoding_Worker.jsx';
import ReactTable from "react-table";

import Slider from 'react-input-slider';

import ItemButton from '../item_Button.jsx'

import ClipLoader from 'react-spinners/ClipLoader';
import Checkbox from '@material-ui/core/Checkbox';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Markup } from 'interweave';





var ButtonStyle = {
  display: 'inline-block',
}



const borderRadiusStyle = { borderRadius: 2 }


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


        {/* <center> <p>{title}({item[slider]})</p></center> */}
      
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


      var statDat = <center style={ButtonStyle}><ClipLoader

        sizeUnit={"px"}
        size={10}
        color={'white'}
        loading={true}
        style={ButtonStyle}
      /></center>

    } else {
      var statDat = statistics[0][stat]



    }


    return statDat

  }


  renderLowCPUButton() {

   
    return this.props.globalSettings.map((item, i) => (

      <ToggleButton
      thumbStyle={borderRadiusStyle}
      trackStyle={borderRadiusStyle}
      
      value={item.lowCPUPriority} onToggle={() => {

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

  renderSortBox(type){

    return this.props.globalSettings.map((item, i) => (

      <Checkbox name={type} checked={item.queueSortType == type ? true : false} onChange={this.setSort} />

    ));

  }

  setSort(event) {

    if (event.target.checked == true) {

      GlobalSettingsDB.upsert(
        "globalsettings",
        {
          $set: {
            queueSortType: event.target.name,
          }
        }
      );


    }
  }

  renderCheckBox = (type) => {



    return this.props.globalSettings.map((item, i) => (

      <Checkbox name={type} checked={item[type]} onChange={(event) => {

        if(type == `alternateLibraries` && event.target.checked){

          GlobalSettingsDB.upsert(
            "globalsettings",
            {
              $set: {
                prioritiseLibraries: false,
              }
            }
          );
        }
    
        if(type == `prioritiseLibraries` && event.target.checked){
    
          GlobalSettingsDB.upsert(
            "globalsettings",
            {
              $set: {
               alternateLibraries: false,
              }
            }
          );
        }

        GlobalSettingsDB.upsert(
          "globalsettings",
          {
            $set: {
              [type]: event.target.checked,
            }
          }
        );

      }} />

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
            color={'white'}
            loading={true}
          /></td>
        </tr>


      ));

    } else {

      var data = tables[0][table]

    }

    if (type == "queue") {


      if (mode == "TranscodeDecisionMaker") {


   
       

      return data.map((row, i) => {

        if(row.file_size != undefined){
          var file_size =  parseFloat((row.file_size/1000).toPrecision(4))
        }else{
          var file_size = "-"
        }

        // <td>{row.bumped ? row.bumped.toISOString() : "-"}</td>

   

        

       return <tr key={row._id}>
          <td><p>{i + 1}</p></td><td><p>{row.file}</p></td><td><p>{row.video_codec_name}</p></td><td><p>{row.video_resolution}</p></td><td><p>{file_size}</p></td><td><p>{ !(row.bumped instanceof Date) ? this.renderBumpButton(row.file):this.renderCancelBumpButton(row.file) }</p></td><td><p>{this.renderSkipButton(row.file)}</p></td>
          </tr>

      }
      );




    }else{

      return data.map((row, i) => {

       return <tr key={row._id}>
          <td><p>{i + 1}</p></td><td><p>{row.file}</p></td><td><p>{!(row.bumped instanceof Date) ? this.renderBumpButton(row.file):this.renderCancelBumpButton(row.file) }</p></td><td><p>{this.renderSkipHealthCheckButton(row.file)}</p></td>
          </tr>




      }
      );

    }
    }

    if (type == "success") {

      if (mode == "TranscodeDecisionMaker") {



        return data.map((row, i) => {

          if(row.lastTranscodeDate != undefined){
            var lastTranscodeDate = this.toTime(row.lastTranscodeDate)
          }else{
            var lastTranscodeDate = "-"
          }

          if(row.oldSize != undefined){
            var oldSize =  parseFloat((row.oldSize).toPrecision(4))
          }else{
            var oldSize = "-"
          }

          if(row.newSize != undefined){
            var newSize  =  parseFloat((row.newSize).toPrecision(4))
          }else{
            var newSize = "-"
          }



   

         return <tr key={row._id}>
            <td><p>{i + 1}</p></td><td><p>{lastTranscodeDate}</p></td><td><p>{row.file}</p></td><td><p>{row.video_codec_name}</p></td><td><p>{row.video_resolution}</p></td><td><p>{row.TranscodeDecisionMaker}</p></td><td><p>{oldSize}</p></td><td><p>{newSize}</p></td><td><p>{this.renderRedoButton(row.file, mode)}</p></td><td><p>{this.renderInfoButton(row.cliLog)}</p></td><td><p>{this.renderHistoryButton(row)}</p></td>
          </tr>


        });

      } else {

        return data.map((row, i) => {

          if(row.lastHealthCheckDate != undefined){
            var lastHealthCheckDate = this.toTime(row.lastHealthCheckDate)
          }else{
            var lastHealthCheckDate = "-"
          }
  
         return <tr key={row._id}>
            <td><p>{i + 1}</p></td><td><p>{lastHealthCheckDate}</p></td><td><p>{row.file}</p></td><td><p>{this.renderRedoButton(row.file, mode)}</p></td><td><p>{this.renderInfoButton(row.cliLog)}</p></td>
          </tr>



        });

      }
    }

    if (type == "error") {

      if (mode == "TranscodeDecisionMaker") {

      return data.map((row, i) => {

        if(row.lastTranscodeDate != undefined){
          var lastTranscodeDate = this.toTime(row.lastTranscodeDate)
        }else{
          var lastTranscodeDate = "-"
        }


       return <tr key={row._id}>
          <td><p>{i + 1}</p></td><td><p>{lastTranscodeDate}</p></td><td><p>{row.file}</p></td><td><p>{this.renderRedoButton(row.file, mode)}</p></td><td><p>{this.renderIgnoreButton(row.file, mode)}</p></td><td><p>{this.renderInfoButton(row.cliLog)}</p></td>
        </tr>


      });

      }else{

        return data.map((row, i) => {

          
        if(row.lastHealthCheckDate != undefined){
          var lastHealthCheckDate = this.toTime(row.lastHealthCheckDate)
        }else{
          var lastHealthCheckDate = "-"
        }

         return <tr key={row._id}>
            <td><p>{i + 1}</p></td><td><p>{lastHealthCheckDate}</p></td><td><p>{row.file}</p></td><td><p>{this.renderRedoButton(row.file, mode)}</p></td><td><p>{this.renderIgnoreButton(row.file, mode)}</p></td><td><p>{this.renderInfoButton(row.cliLog)}</p></td>
          </tr>
  
  
      });



      }
    }



  }

  toTime = (d) => {

    var h = (d.getHours() < 10 ? '0' : '') + d.getHours();
    var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    var timenow = h + ':' + m + ':' + s;

    return timenow

  }


  renderBumpButton(file) {
    var obj = {
      bumped: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'↑'} type="updateDBAction" />
  }

  renderSkipButton(file) {
    var obj = {
      TranscodeDecisionMaker:"Transcode success",
      lastTranscodeDate: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'⤳'} type="updateDBAction" />
  }

  renderSkipHealthCheckButton(file) {
    var obj = {
      HealthCheck: "Success",
      lastHealthCheckDate: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'⤳'} type="updateDBAction" />
  }

  renderCancelBumpButton(file) {
    var obj = {
      bumped: false,
    }
    return <ItemButton file={file} obj={obj} symbol={'X'} type="updateDBAction" />
  }

  renderRedoButton(file, mode) {


    var obj = {
      [mode]: "Queued",
      processingStatus: false,
      createdAt: new Date(),
    }


    return <ItemButton file={file} obj={obj} symbol={'↻'} type="updateDBAction" />
  }

  renderIgnoreButton(file, mode) {

    var obj = {
      [mode]: "Ignored",
      processingStatus: false,
      createdAt: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'Ignore'} type="updateDBAction" />


  }

  renderInfoButton(cliLog) {

    try{

    cliLog = cliLog.split("\n")

    cliLog = cliLog.map( row => <p>{row}</p> )

    return <Modal
      trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
      modal
      closeOnDocumentClick
    >
       <div className="modalContainer">
       <div className="frame">
    <div className="scroll"> 
    <div className="modalText">
   {cliLog}
      
    </div>
  </div>
  </div>
  </div>
    </Modal>

    }catch(err){

      return null

    }

  }

  renderHistoryButton(row) {


    if(row.history == undefined){
      result =""
      
    }else{

      var result = row.history
      result = result.split("\n")
       result = result.map((row, i) => (
   
           <Markup content={row} />
         ));
   


    } 


    return <Modal
      trigger={<Button variant="outline-light" ><span className="buttonTextSize">H</span></Button>}
      modal
      closeOnDocumentClick
    >
      <div className="modalContainer">
      <div className="frame">
        <div className="scroll">
        <div className="modalText">
          {result}

          </div>
        </div>
      </div>
      </div>
    </Modal>
  }





  resetAllStatus(mode,table) {

    if (confirm('Are you sure you want to re-queue all files?')) {
      Meteor.call('resetAllStatus', 'all', mode,table, function (error, result) { })

    }
  }




  render() {



    return (


      <div className="containerGeneral">
        {/* <h1>Td</h1> */}



        <div className="dbStatusContainer">
          <table>
            <tbody>
              <tr>

                <td><p><b>DB</b></p></td>
                <td><p><b>Poll period</b>:{this.renderStat('DBPollPeriod')}</p></td>
                <td><p><b>Fetch time</b>: {this.renderStat('DBFetchTime')}</p></td>
                <td><p><b>Total</b>: {this.renderStat('DBTotalTime')}</p></td>
                <td><p><b>Backlog</b>: {this.renderStat('DBQueue')}</p></td>
                <td><p><b>Load</b>: {this.renderStat('DBLoadStatus')}</p></td>

              </tr>


            </tbody>
          </table>
        </div>


        <p></p>

        <div className="container">


        <div className="libraryContainer" >
        <br/>
        
<center><Modal
      trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
      modal
      closeOnDocumentClick
    >
       <div className="modalContainer">
       <div className="frame">
    <div className="scroll"> 

    <div className="modalText">
 
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
  </div>
  </div>

    </Modal></center>

        <center><p>Workers:</p></center>


        

<div className="sliderGrid-container">

<div className="sliderGrid-item1">
<p>General</p>
</div>


<div className="sliderGrid-item1">
<p>({this.props.globalSettings && this.props.globalSettings[0] && this.props.globalSettings[0].generalWorkerLimit ? this.props.globalSettings[0].generalWorkerLimit : 0})</p>
</div>




<div className="sliderGrid-item">
{this.renderSlider('generalWorkerLimit','black','#808080')}
</div>

<div className="sliderGrid-item2">
<Button   variant="outline-light" onClick={() => this.alterWorkerLimit("decrease","generalWorkerLimit")} ><span className="buttonTextSize">-</span></Button>
<Button   variant="outline-light" onClick={() => this.alterWorkerLimit("increase","generalWorkerLimit")} ><span className="buttonTextSize">+</span></Button>
</div>





<div className="sliderGrid-item1">
<p>Transcode</p>
</div>

<div className="sliderGrid-item1">
<p>({this.props.globalSettings && this.props.globalSettings[0] && this.props.globalSettings[0].transcodeWorkerLimit ? this.props.globalSettings[0].transcodeWorkerLimit : 0})</p>
</div>




<div className="sliderGrid-item">
{this.renderSlider('transcodeWorkerLimit','#66ccff','#B3E6FF')}
</div>

<div className="sliderGrid-item2">
<Button   variant="outline-light" onClick={() => this.alterWorkerLimit("decrease","transcodeWorkerLimit")} ><span className="buttonTextSize">-</span></Button>
<Button   variant="outline-light" onClick={() => this.alterWorkerLimit("increase","transcodeWorkerLimit")} ><span className="buttonTextSize">+</span></Button>
</div>





<div className="sliderGrid-item1">
<p>Health Check</p>
</div>

<div className="sliderGrid-item1">
<p>({this.props.globalSettings && this.props.globalSettings[0] && this.props.globalSettings[0].healthcheckWorkerLimit ? this.props.globalSettings[0].healthcheckWorkerLimit : 0})</p>
</div>



<div className="sliderGrid-item">
{this.renderSlider('healthcheckWorkerLimit','#4CAF50','#A6D7A8')}
</div>

<div className="sliderGrid-item2">
<Button   variant="outline-light" onClick={() => this.alterWorkerLimit("decrease","healthcheckWorkerLimit")} ><span className="buttonTextSize">-</span></Button>
<Button   variant="outline-light" onClick={() => this.alterWorkerLimit("increase","healthcheckWorkerLimit")} ><span className="buttonTextSize">+</span></Button>
</div>

</div>



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
            } ><span className="buttonTextSize">Cancel all workers</span></Button>

{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}

            <div style={ButtonStyle}>
            <span className="buttonTextSize">Low CPU priority:<div style={ButtonStyle}>

                {this.renderLowCPUButton()}


              </div>
              </span>
            </div>

          </div>
          </center>

          </div>

          <p></p>
          <br/>
          <br/>
          <br/>

          <div className="allWorkersContainer" id="allWorkersContainerID">


          </div>

        </div>
        <p></p>
    <p></p>
    <p></p>

    <div className="tabWrap" >     

        <Modal
      trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
      modal
      closeOnDocumentClick
    >
       <div className="modalContainer">
       <div className="frame">
    <div className="scroll"> 

    <div className="modalText">
 
    <p>All newly scanned files will be placed in the transcode and health check queues.</p>
    
    <p>Files in the queues will be sent to available workers.</p>

    <p>For transcodes, if files already meet the codec (etc) requirements they will be marked as 'Not required' in 'Transcode: Success/Not required' tab.</p>
    
    
    <p>If files don't meet the requirements they will be transcoded. If transcoding is successful files will be marked as 'Transcode success' in the  'Transcode: Success/Not required' tab.</p>
    <p></p>

    
    <p>If transcoding fails or is cancelled then files will be marked accordingly in the 'Transcode: Error/Cancelled' tab.</p>


    <p></p>
    <p></p>


    <p><b>The end goal of Tdarr is to be able to run it on your library and all items come out as 'Transcode:Not required', meaning nothing needed to be transcoded/remuxed etc.</b></p>


    </div>
      
    </div>
  </div>
  </div>
    </Modal>




<p>Sort queue by: </p>
                  <p>Oldest:
{this.renderSortBox('sortDateOldest')}
                    Newest:
{this.renderSortBox('sortDateNewest')}
              
                Smallest:
{this.renderSortBox('sortSizeSmallest')}
                    Largest:
{this.renderSortBox('sortSizeLargest')}
                  </p>


<p>Library alternation: {this.renderCheckBox('alternateLibraries')}</p>
 <p>Library prioritisation: {this.renderCheckBox('prioritiseLibraries')}</p>

<p>Items: <input type="text" className="tableSize"  defaultValue={this.props.globalSettings && this.props.globalSettings[0] && this.props.globalSettings[0].tableSize ? this.props.globalSettings[0].tableSize : "" } onChange={(event) => {
  GlobalSettingsDB.upsert(
    "globalsettings",
    {
      $set: {
        tableSize: event.target.value,
      }
    }
  );
}}></input></p>


            

               
        <Tabs>
    <TabList>
      <Tab><p>Transcode queue ({this.renderStat('table1Count')})</p></Tab>
      <Tab><p>Transcode: Success/Not required ({this.renderStat('table2Count')})</p></Tab>
      <Tab><p>Transcode: Error/Cancelled ({this.renderStat('table3Count')})</p></Tab>



      <Tab><p>Health check queue ({this.renderStat('table4Count')})</p></Tab>
      <Tab><p>Health check: Healthy ({this.renderStat('table5Count')})</p></Tab>
      <Tab><p>Health check: Error/Cancelled ({this.renderStat('table6Count')})</p></Tab>

    </TabList>

    <TabPanel> <div className="tabContainer" >
  
    <table className="itemTable">   <tbody>
              <tr>
                <th><p>No.</p></th>
                <th><p>File</p></th>
                <th><p>Codec</p></th>
                <th><p>Resolution</p></th>
                <th><p>Size (GB)</p></th>
                <th><p>Bump</p></th>
                <th><p>Skip</p></th>

              </tr>
              {this.renderTable('table1', 'queue','TranscodeDecisionMaker')}
            </tbody></table>
   



    </div></TabPanel>
    <TabPanel> <div className="tabContainer" >
    <table className="itemTable"><tbody>
              <tr>
                <th><p>No.</p></th>
                <th><p>Time</p></th>
                <th><p>File</p></th>
                <th><p>Codec</p></th>
                <th><p>Resolution</p></th>
                <th><p>Transcode</p></th>
                <th><p>Old size (GB)</p></th>
                <th><p>New size (GB)</p></th>
                <th><p><Button variant="outline-light" onClick={() => this.resetAllStatus('TranscodeDecisionMaker','table2')} ><span className="buttonTextSize">Re-queue</span></Button></p></th>
                <th><p>Info</p></th>
                <th><p>History</p></th>


              </tr>
              {this.renderTable('table2', 'success', 'TranscodeDecisionMaker')}

            </tbody></table>
    </div></TabPanel>

    <TabPanel> <div className="tabContainer" >

    <table className="itemTable">   <tbody>
              <tr>
                <th><p>No.</p></th>
                <th><p>Time</p></th>
                <th><p>File</p></th>
                <th><p><Button variant="outline-light" onClick={() => this.resetAllStatus('TranscodeDecisionMaker','table3')} ><span className="buttonTextSize">Re-queue</span></Button></p></th>
                <th><p>Ignore</p></th>
                <th><p>Info</p></th>


              </tr>


              {this.renderTable('table3', 'error', 'TranscodeDecisionMaker')}


            </tbody></table>


    </div></TabPanel>

    <TabPanel> <div className="tabContainer" >

    <table className="itemTable">   <tbody>
              <tr>
                <th><p>No.</p></th>
                <th><p>File</p></th>
                <th><p>Bump</p></th>
                <th><p>Skip</p></th>


              </tr>
              {this.renderTable('table4', 'queue','HealthCheck')}

            </tbody></table>


    </div></TabPanel>

    <TabPanel> <div className="tabContainer" >

    <table className="itemTable">   <tbody>
              <tr>
                <th><p>No.</p></th>
                <th><p>Time</p></th>
                <th><p>File</p></th>
                <th><p><Button   variant="outline-light" onClick={() => this.resetAllStatus('HealthCheck','table5')} ><span className="buttonTextSize">Re-queue</span></Button></p></th>
                <th><p>Info</p></th>
              </tr>



              {this.renderTable('table5', 'success', 'HealthCheck')}


            </tbody></table>


    </div></TabPanel>

    <TabPanel> <div className="tabContainer" >
    <table className="itemTable">   <tbody>
              <tr>
                <th><p>No.</p></th>
                <th><p>Time</p></th>
                <th><p>File</p></th>
                <th><p><Button   variant="outline-light" onClick={() => this.resetAllStatus('HealthCheck','table6')} ><span className="buttonTextSize">Re-queue</span></Button></p></th>
                <th><p>Ignore</p></th>
                <th><p>Info</p></th>


              </tr>

            


              {this.renderTable('table6', 'error', 'HealthCheck')}

            </tbody></table>

    </div></TabPanel>
  </Tabs> 
  </div>
  </div>

    );
  }
}

export default withTracker(() => {

  Meteor.subscribe('GlobalSettingsDB');
  Meteor.subscribe('SettingsDB');
  Meteor.subscribe('ClientDB');
  Meteor.subscribe('StatisticsDB');


  return {


    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),
    settingsDB:GlobalSettingsDB.find({}, {}).fetch(),

    clientDB: ClientDB.find({}).fetch(),
    statistics: StatisticsDB.find({}).fetch(),


  };
})(App);
