import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';


export default class VideoCodec extends Component {

    constructor(props) {
        super(props);

        this.toggleChecked = this.toggleChecked.bind(this);
    
    
      }

    toggleChecked(event) {


            Meteor.call('updateScheduleBlock',this.props.DB_id, this.props.item._id,event.target.checked,function (error, result) { });


    }


    render() {
      return (


        <span className="scheduleContainer-item">
         <input type="checkbox" checked={!!this.props.item.checked} onChange={this.toggleChecked} />
        {/* {this.props.item._id.split(":")[1]} */}
        </span>
        
     
      );
    }
  }

  
var noBreak = {
  display: 'inline-block',
}