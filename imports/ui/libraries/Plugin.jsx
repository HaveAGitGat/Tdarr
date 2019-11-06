import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';


export default class Plugin extends Component {

    constructor(props) {
        super(props);

        this.toggleChecked = this.toggleChecked.bind(this);
        this.deleteThisCodec = this.deleteThisCodec.bind(this);
    
    
      }

    toggleChecked(event) {


            Meteor.call('updatePluginInclude',this.props.DB_id, this.props.pluginItem._id,event.target.checked,function (error, result) { });


    }

    deleteThisCodec(){


        Meteor.call('removePluginInclude',this.props.DB_id, this.props.pluginItem._id,event.target.checked,function (error, result) { });

    }



    render() {
      return (
      
<tr>
<td>
         <Checkbox checked={!!this.props.pluginItem.checked} onChange={this.toggleChecked} />
         </td>

         <td>
         <span className="buttonTextSize">{this.props.pluginItem._id}</span>
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