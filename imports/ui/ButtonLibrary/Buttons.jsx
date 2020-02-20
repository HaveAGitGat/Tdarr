
import React, { Component } from 'react';
import ItemButton from '../item_Button.jsx'


export class BumpButton extends Component {
    
    render() {
    var obj = {
        bumped: new Date(),
      }
      return <ItemButton file={this.props.file} obj={obj} symbol={'↑'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />

    }
}



export class SkipButton extends Component {
    render() {

        var obj = {
            TranscodeDecisionMaker:"Transcode success",
            lastTranscodeDate: new Date(),
          }
          return <ItemButton file={this.props.file} obj={obj} symbol={'⤳'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />

    }
}


export class  SkipHealthCheckButton extends Component {
    render() {

        var obj = {
            HealthCheck: "Success",
            lastHealthCheckDate: new Date(),
          }
          return <ItemButton file={this.props.file} obj={obj} symbol={'⤳'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />

    }
}


export class  CancelBumpButton extends Component {
    render() {

        var obj = {
            bumped: false,
          }
          return <ItemButton file={this.props.file} obj={obj} symbol={'X'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />

    }
}




export class  RedoButton extends Component {

    render() {

        var obj = {
            [this.props.mode]: "Queued",
            processingStatus: false,
            createdAt: new Date(),
          }
      
      
          return <ItemButton file={this.props.file} obj={obj} symbol={'↻'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />
    }
}

export class ForceProcessingButton extends Component {

    render() {
        var obj = {
            forceProcessing: true,
          }
          return <ItemButton file={this.props.file} obj={obj} symbol={'No'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />
    }
}

export class CancelForceProcessingButton extends Component {

    render() {
        var obj = {
            forceProcessing: false,
          }
          return <ItemButton file={this.props.file} obj={obj} symbol={'Yes'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />
    }
}



export class IgnoreButton extends Component {

    render() {
        var obj = {
            [this.props.mode]: "Ignored",
            processingStatus: false,
            createdAt: new Date(),
          }
          return <ItemButton file={this.props.file} obj={obj} symbol={'Ignore'} type="updateDBAction" time={this.props.lastQueueUpdateTime} />
    }
}





export class  CreateSampleButton extends Component {
    render() {

        return <ItemButton file={this.props.file} symbol={'✄'} type="createSample" time={this.props.lastQueueUpdateTime} />
    }
}

