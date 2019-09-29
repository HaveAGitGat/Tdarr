import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';


export default class VideoCodec extends Component {

  constructor(props) {
    super(props);

    this.toggleChecked = this.toggleChecked.bind(this);
    this.deleteThisCodec = this.deleteThisCodec.bind(this);


  }

  toggleChecked(event) {


    Meteor.call('updateVideoCodecExclude', this.props.DB_id, this.props.videocodec.codec, event.target.checked, function (error, result) { });


  }

  deleteThisCodec() {


    Meteor.call('removeVideoCodecExclude', this.props.DB_id, this.props.videocodec.codec, event.target.checked, function (error, result) { });

  }



  render() {

    return (


      <tr>
        <td>

          <Checkbox checked={!!this.props.videocodec.checked} onChange={this.toggleChecked} />
        </td>

        <td>
          {this.props.videocodec.codec}
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