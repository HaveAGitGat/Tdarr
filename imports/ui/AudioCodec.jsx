import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

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


        <tr>
        <td>

          <Checkbox checked={!!this.props.audiocodec.checked} onChange={this.toggleChecked} />
          </td>

          <td>
        {this.props.audiocodec.codec}
        </td>

        <td>
         <button className="deleteCodecButton" onClick={this.deleteThisCodec.bind(this)}>
          &times;
        </button>
        </td>

        
        </tr>
      );
    }
  }

  var noBreak = {
    display: 'inline-block',
  }