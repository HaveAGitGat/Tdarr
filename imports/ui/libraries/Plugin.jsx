import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Button} from 'react-bootstrap';
import Modal from "reactjs-popup";

import { SettingsDB} from '../../api/tasks.js';


export default class Plugin extends Component {

    constructor(props) {
        super(props);

        this.toggleChecked = this.toggleChecked.bind(this);
        this.deleteThisPlugin = this.deleteThisPlugin.bind(this);
    
    
      }

    toggleChecked(event) {


            Meteor.call('updatePluginInclude',this.props.DB_id, this.props.pluginItem._id,event.target.checked,function (error, result) { });


    }

    deleteThisPlugin(){

      var thisLibraryPlugins = SettingsDB.find({ _id: this.props.DB_id }, { sort: { createdAt: 1 } }).fetch()[0].pluginIDs


      for (var i = 0; i < thisLibraryPlugins.length; i++) {

        if (thisLibraryPlugins[i].priority > this.props.pluginItem.priority) {

          thisLibraryPlugins[i].priority = thisLibraryPlugins[i].priority - 1
    
        }
      }

      SettingsDB.upsert(
        this.props.DB_id,
        {
          $set: {
            pluginIDs: thisLibraryPlugins,
          }
        }
      );


        Meteor.call('removePluginInclude',this.props.DB_id, this.props.pluginItem._id,function (error, result) { });

    }


    renderInputs = (inputs) => {

      var desc = inputs.map(row => <p><Modal
        trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
        modal
        closeOnDocumentClick
      >
        <div className="modalContainer">
          <div className="frame">
            <div className="scroll">

              <div className="modalText">
                <p>Tip:</p>
                <p></p>
                <p></p>
                <p>{row.tooltip}</p>

              </div>

            </div>
          </div>
        </div>
      </Modal><span>{row.name}:<input type="text" defaultValue={this.props.pluginItem.InputsDB && this.props.pluginItem.InputsDB[row.name] != undefined  ? this.props.pluginItem.InputsDB[row.name] : ''} name={row.name} onChange={this.saveInput}></input></span></p>)

      return desc


    }

  saveInput = (event) => {

    const { name, value } = event.target;

    var thisLibraryPlugins = SettingsDB.find({ _id: this.props.DB_id }, { sort: { createdAt: 1 } }).fetch()[0].pluginIDs

    if(thisLibraryPlugins[this.props.pluginItem.priority].InputsDB == undefined){

      thisLibraryPlugins[this.props.pluginItem.priority].InputsDB = {}


    }
    thisLibraryPlugins[this.props.pluginItem.priority].InputsDB[name] = value

    SettingsDB.upsert(
      this.props.DB_id,
      {
        $set: {
          pluginIDs: thisLibraryPlugins,
        }
      }
    );


  }



    render() {
      return (
      
        <tr key={this.props.key}>

          <td>
          <span className="buttonTextSize">{this.props.pluginItem.source != undefined ? this.props.pluginItem.source : "-"}</span>
          </td>


          <td>
            <Checkbox checked={!!this.props.pluginItem.checked} onChange={this.toggleChecked} />
          </td>

          <td>
            <span className="buttonTextSize">{this.props.pluginItem._id}</span>
          </td>

          
          <td>
            <span className="buttonTextSize">{this.props.pluginItem.Type}</span>
          </td>


          <td>
            <span className="buttonTextSize">{this.props.pluginItem.Operation != undefined ? this.props.pluginItem.Operation : "-"}</span>
          </td>

          <td>
            <span className="buttonTextSize">{this.props.pluginItem.Name != undefined ? this.props.pluginItem.Name : "-"}</span>
          </td>

          <td>
            <span className="buttonTextSize">{this.props.pluginItem.Description != undefined ? this.props.pluginItem.Description : "-"}</span>
          </td>

          <td>
            <span className="buttonTextSize">{this.props.pluginItem.Inputs != undefined ? this.renderInputs(this.props.pluginItem.Inputs) : "-"}</span>
          </td>



          <td>
            <span className="buttonTextSize">


<Button variant="outline-light" onClick={() => {




  var thisLibraryPlugins = SettingsDB.find({ _id: this.props.DB_id }, { sort: { createdAt: 1 } }).fetch()[0].pluginIDs

  if (this.props.pluginItem.priority == 0) {


  } else {

    var thisPlugin = thisLibraryPlugins[this.props.pluginItem.priority]
    thisPlugin.priority  = thisPlugin.priority - 1
    var pluginBelow = thisLibraryPlugins[this.props.pluginItem.priority - 1]
    pluginBelow.priority  = pluginBelow.priority + 1

    thisLibraryPlugins.splice(this.props.pluginItem.priority - 1,2,thisPlugin,pluginBelow)

    SettingsDB.upsert(
      this.props.DB_id,
      {
        $set: {
          pluginIDs: thisLibraryPlugins,
        }
      }
    );
  }


}} ><span className="buttonTextSize">↑</span></Button>

{'\u00A0'}{'\u00A0'}{this.props.pluginItem.priority != undefined ? this.props.pluginItem.priority+1 : "-"} {'\u00A0'}{'\u00A0'}

 <Button variant="outline-light" onClick={() => {



  var thisLibraryPlugins = SettingsDB.find({ _id: this.props.DB_id }, { sort: { createdAt: 1 } }).fetch()[0].pluginIDs

  if (this.props.pluginItem.priority == thisLibraryPlugins.length - 1) {


  } else {

    var thisPlugin = thisLibraryPlugins[this.props.pluginItem.priority]
    thisPlugin.priority  = thisPlugin.priority + 1
    var pluginAbove = thisLibraryPlugins[this.props.pluginItem.priority + 1]
    pluginAbove.priority  = pluginAbove.priority - 1

    thisLibraryPlugins.splice(this.props.pluginItem.priority,2,pluginAbove,thisPlugin)

    SettingsDB.upsert(
      this.props.DB_id,
      {
        $set: {
          pluginIDs: thisLibraryPlugins,
        }
      }
    );
  }


}} ><span className="buttonTextSize">↓</span></Button>
</span>

          </td>


          <td>

            <button className="deleteCodecButton" onClick={this.deleteThisPlugin.bind(this)}>

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