import React, { Component } from 'react';

export default class AudioCodec extends Component {

    constructor(props) {
        super(props);

        this.toggleChecked = this.toggleChecked.bind(this);
        this.deleteThisCodec = this.deleteThisCodec.bind(this);
    
    
      }

    toggleChecked(event) {


            Meteor.call('updateAudioCodecExclude',this.props.DB_id, this.props.audiocodec.codec,event.target.checked,function (error, result) { });


    }

    deleteThisCodec(){


        Meteor.call('removeAudioCodecExclude',this.props.DB_id, this.props.audiocodec.codec,event.target.checked,function (error, result) { });

    }



    render() {
      return (
        <li key={this.props.key} >
          <input type="checkbox" checked={!!this.props.audiocodec.checked} onChange={this.toggleChecked} />

        {this.props.audiocodec.codec}
       
         <div  style={noBreak}>

        
         <button className="deleteCodecButton" onClick={this.deleteThisCodec.bind(this)}>
          &times;
        </button>
    
        </div>
        
        </li>
      );
    }
  }

  var noBreak = {
    display: 'inline-block',
  }