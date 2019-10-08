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

                  {this.props.worker.mode == 'transcode' ? "Transcode" : this.props.worker.mode == 'healthcheck' ? "Heath check" : "General(" + workerModes[this.props.worker.modeType] + ")"}

                </div>
              </div>


              <div className="grid-item" style={ButtonStyle}>

              ETA{'\u00A0'}{'\u00A0'}{this.props.worker.percentage <= 100 ? this.props.worker.ETA : ''}

              </div>





            </div>

            <p>
              {path.basename(this.props.worker.file)}
            </p>




            <style type="text/css">
              {`

`}


            </style>




            <div className={this.props.worker.percentage <= 100 ? '' : 'hidden'}>
              <Progress percent={parseInt(this.props.worker.percentage)} status="default"

                theme={
                  {
                    default: {
                      symbol: this.props.worker.percentage + '%',
                      trailColor: 'white',
                      color: 'black'
                    },
                  }
                }
              />

            </div>


            <div className={this.props.worker.percentage > 100 ? '' : 'hidden'}>

              <Progress percent={100} status="default"

                theme={
                  {
                    default: {
                      symbol: '-',
                      trailColor: 'white',
                      color: 'black'
                    },
                  }
                }
              />
              <center >
                 Frame: {this.props.worker.percentage / 100}
              </center>

            </div>

<center>
            <Button variant="outline-dark" onClick={() =>  this.setState({
          infoHidden: !this.state.infoHidden,
        })} >{this.state.infoHidden ? 'i' : 'i'}</Button>

</center>

            <div className={this.state.infoHidden ? 'hidden' : ''}>

          




            <table className="workerDetailTable">
              <tbody>
                <tr><td>CLI:</td><td>{this.props.worker.CLIType}</td></tr>

                <tr><td>Preset:</td><td>{this.props.worker.preset}</td></tr>


                <tr><td>Process reasons:</td><td>{this.transcodeReason(this.props.worker.cliLogAdd)}</td></tr>

                <tr><td>Start time:</td><td>{this.toTime(this.props.worker.startTime)}</td></tr>

                <tr><td>Duration:</td><td>{this.duration(this.props.worker.startTime)}</td></tr>

                <tr><td>Original size (GB)</td><td>{this.props.worker.sourcefileSizeInGbytes}</td></tr>
                
                </tbody>


            </table>

            <center>         
            <Button variant="outline-danger" style={ButtonStyle} onClick={() => {


Meteor.call('cancelWorkerItem', this.props.worker._id, function (error, result) { })


}} >Cancel item</Button>{'\u00A0'}

<Button variant="outline-danger" style={ButtonStyle} onClick={() => {


Meteor.call('killWorker', this.props.worker._id, this.props.worker.file, this.props.worker.mode, function (error, result) { })


}} >Shutdown worker</Button>

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

