import React, { Component } from 'react';

import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";
import { render } from 'react-dom';


import ToggleButton from 'react-toggle-button'

var path = require('path')

var ButtonStyle = {
  display: 'inline-block',
}

const borderRadiusStyle = { borderRadius: 2 }


export default class Worker extends Component {

  constructor(props) {
    super(props);
    this.state = { infoHidden: true,oldProgress:"Calculating..." }
  }

  componentDidMount() {

    // this.interval = setInterval(() => this.ETA(), 5000);
    // render("Calculating...", document.getElementById('ETA'));

  }




  toTime = (d) => {

    var h = (d.getHours() < 10 ? '0' : '') + d.getHours();
    var m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    var timenow = h + ':' + m + ':' + s;

    return timenow

  }

  duration = (start) => {

    var timeNow = new Date()
    var secsSinceStart = Math.round((timeNow - start) / 1000)



    return this.fancyTimeFormat(secsSinceStart)
  }

  transcodeReason(info){

    info = info.split("\n")

    info = info.map( row =><span>{row}<br/></span> )

    return info

  }

  fancyTimeFormat(time) {

    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    var ret = "";
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }



  render() {



    return (
      <div className="workerContainer">
        <div className={this.props.worker.modeType == 'transcode' ? "borderStyleTranscode" : this.props.worker.modeType == 'healthcheck' ? "borderStyleHealthCheck" : "borderStyleGeneral"}>



          <div className="workerContainerItems">


            <p></p>

            <div className="workerItemsGrid">

              <div className="grid-item" style={ButtonStyle} >
                <div style={ButtonStyle} className="toggleWorkerButton">
                  <ToggleButton
      thumbStyle={borderRadiusStyle}
      trackStyle={borderRadiusStyle}

                    value={!this.props.worker.idle || false}
                    onToggle={() => {
                      Meteor.call('upsertWorkers', this.props.worker._id, {
                        idle: !this.props.worker.idle,
                      }, function (error, result) { });
                    }

                    }
                  />
                </div>
              </div>

              <div className="grid-item" style={ButtonStyle}>
                <div style={ButtonStyle}>

                  <p>{this.props.worker.mode == 'transcode' ? "Transcode" : this.props.worker.mode == 'healthcheck' ? "Heath check" : "General(" + workerModes[this.props.worker.modeType] + ")"}</p>

                </div>
              </div>


              <div className="grid-item" style={ButtonStyle}>

              <p>ETA{'\u00A0'}{'\u00A0'}{this.props.worker.percentage <= 100 ? this.props.worker.ETA : ''}</p>

              </div>





            </div>

            <p>{path.basename(this.props.worker.file)}</p>




            <style type="text/css">
              {`

`}


            </style>




            <div className={this.props.worker.percentage <= 100 ? '' : 'd-none'}>
              <Progress percent={parseInt(this.props.worker.percentage)} status="default"

                theme={
                  {
                    default: {
                      symbol: <p>{this.props.worker.percentage + '%'}</p>,
                      trailColor: '#373737',
                      color: '#04dac5'
                    },
                  }
                }
              />

            </div>


            <div className={this.props.worker.percentage > 100 ? '' : 'd-none'}>

              <Progress percent={100} status="default"

                theme={
                  {
                    default: {
                      symbol: <p>{'-'}</p>,
                      trailColor: '#373737',
                      color: '#04dac5'
                    },
                  }
                }
              />
              <center >
              <p> Frame: {this.props.worker.percentage / 100}</p>
              </center>

            </div>

<center>
            <Button variant="outline-light" onClick={() =>  this.setState({
          infoHidden: !this.state.infoHidden,
        })} ><span className="buttonTextSize">{this.state.infoHidden ? 'i' : 'i'}</span></Button>

</center>

            <div className={this.state.infoHidden ? 'd-none' : ''}>

          




            <table className="workerDetailTable">
              <tbody>

              <tr><td><p>Path:</p></td><td><p>{this.props.worker.file}</p></td></tr>
                <tr><td><p>CLI:</p></td><td><p>{this.props.worker.CLIType}</p></td></tr>

                <tr><td><p>Preset:</p></td><td><p>{this.props.worker.preset}</p></td></tr>


                <tr><td><p>Process reasons:</p></td><td><p>{this.transcodeReason(this.props.worker.cliLogAdd)}</p></td></tr>

                <tr><td><p>Start time:</p></td><td><p>{this.toTime(this.props.worker.startTime)}</p></td></tr>

                <tr><td><p>Duration:</p></td><td><p>{this.duration(this.props.worker.startTime)}</p></td></tr>

                <tr><td><p>Original size</p></td><td><p> {this.props.worker.sourcefileSizeInGbytes < 1 ? parseFloat((this.props.worker.sourcefileSizeInGbytes * 1000).toPrecision(4)) +" MB" : parseFloat((this.props.worker.sourcefileSizeInGbytes).toPrecision(4)) + " GB"}</p></td></tr>
                <tr><td><p>Output file</p></td><td><p>{this.props.worker.outputFileSizeInGbytes < 1 ? parseFloat((this.props.worker.outputFileSizeInGbytes * 1000).toPrecision(4)) +" MB" : parseFloat((this.props.worker.outputFileSizeInGbytes).toPrecision(4)) + " GB"}</p></td></tr>
                <tr><td><p>Est size</p></td><td><p>{this.props.worker.estSize < 1 ? parseFloat((this.props.worker.estSize * 1000).toPrecision(4)) +" MB" : parseFloat((this.props.worker.estSize).toPrecision(4)) + " GB"}</p></td></tr>

               
                
                </tbody>


            </table>

            <center>         
            <Button variant="outline-danger" style={ButtonStyle} onClick={() => {


Meteor.call('cancelWorkerItem', this.props.worker._id, function (error, result) { })


}} ><span className="buttonTextSize">Cancel item</span></Button>{'\u00A0'}

<Button variant="outline-danger" style={ButtonStyle} onClick={() => {


Meteor.call('killWorker', this.props.worker._id, this.props.worker.file, this.props.worker.mode, function (error, result) { })


}} ><span className="buttonTextSize">Shutdown worker</span></Button>

</center>



            </div>

          </div>
        </div>
      </div>
    );
  }
}

var workerModes = {
  healthcheck: "Health",
  transcode: "Transcode"
}

