import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Checkbox from '@material-ui/core/Checkbox';


import FilterByCodec from './Filter/FilterByCodec.jsx';
import FilterByMedium from './Filter/FilterByMedium.jsx';
import FilterByAge from './Filter/FilterByAge.jsx';
import FilterByResolution from './Filter/FilterByResolution.jsx';
import FilterBySize from './Filter/FilterBySize.jsx';


import CustomTranscode from './Action/CustomTranscode.jsx';

import RemuxContainer from './Action/RemuxContainer.jsx';




var ButtonStyle = {
  display: 'inline-block',
}



export default class App extends Component {

  constructor(props) {
    super(props);

    // this.pushConditional = this.pushConditional.bind(this)

    this.state = {
      selectedDropdown:'',
      selectedFilter: 'filterByCodec',
      selectedAction: 'customTranscode',

      details:{
        Name:'',
        Type:'Video',
        Operation:'Transcode',
        Description:'',
        
      },
      action: {
        name:'Custom transcode',
        description:'Files will be transcoded using custom arguments',



        preset: `'-Z "Very Fast 1080p30"'`,
        container: '"." + file.container',
        handBrakeMode: true,
        FFmpegMode: false,
        processFile: true,
         infoLog:'""',

      },
      conditionals: [
        // {
        //   name: 'Filter by codec',
        // //  filter: 'library.filters.filterByCodec',
        // filter: 'library.filters.filterByCodec(file,"include","h264,vp8")',
        // //  arguments: ['file', '"include"', '"h264,vp8"'],
        //   description: 'The following will be included for processing: h264,vp8'
        // }

      ],

    };
  }


  componentDidMount() {

  }




  setShownFilter = () => {


    var selectedFilter = ReactDOM.findDOMNode(this.refs.filterDropdown).value

    this.setState({
      selectedFilter: selectedFilter,
    })



  }

  pushConditional = (obj) => {

    var conditionals = this.state.conditionals

    conditionals.push(obj)

    this.setState({
      conditionals: conditionals,
    })

  }

  renderConditionals = () => {

    var conditionals = this.state.conditionals

    conditionals = conditionals.map((row, index) => {

      var col1 = (index == 0 ? <div></div> : <div><p>AND</p></div>)

      var col2  =  <div><p>{row.name}</p></div>     
      var col3  =  <div><p>{row.description}</p></div>
      var col4  =  <div> <Button
            variant="outline-light"
            onClick={() => {

              var conditionals = this.state.conditionals

              conditionals.splice(index,1)

              this.setState({
                  conditionals: conditionals,
              })


            }}
            block
          >X</Button></div>



      return [col1,col2,col3,col4]
    })


    return   <div className="pluginSummaryDetailsGrid2">
              {conditionals}

            </div>


  }


  setShownAction = () => {

    var selectedAction = ReactDOM.findDOMNode(this.refs.actionDropdown).value

    this.setState({
      selectedAction: selectedAction,
    })



  }

  setAction = (obj) => {

    this.setState({
      action: obj,
    })


  }

handleDetailsChange = (event) => {

  event.preventDefault();

  var details = this.state.details

  details[event.target.name] =  event.target.value

   this.setState({
      details: details,
    })


}

  renderAction = () => {

    // name:'Custom transcode',
    // description:'Files will be transcoded using the following transcode settings: -Z "Very Fast 1080p30"',



    // preset: `'-Z "Very Fast 1080p30"'`,
    // container: '"." + file.container',
    // handBrakeMode: false,
    // FFmpegMode: true,
    // processFile: true,

    var action = this.state.action

    var container
    

    if(action.container.includes('file.container')){
      
      container = 'Same as source'

    }else{
      container = action.container

      container = container.split("'").join('')
    }

    var CLI 

    if(action.handBrakeMode == true){

      CLI = 'HandBrake'

    }else if(action.FFmpegMode == true){

      CLI = 'FFmpeg'

    }else{

      CLI = 'None'

    }

    var preset = action.preset
    preset = preset.split("'").join('')


    return <div className="pluginSummaryDetailsGrid">

<div><p>Name</p></div><div><p>{action.name}</p></div>
<div><p>Description</p> </div><div><p>{action.description}</p></div>
<div>  <p>Arguments</p>  </div><div> <p>{preset}</p></div>
<div><p>Container</p> </div><div> <p>{container}</p></div>
<div>  <p>CLI</p> </div><div><p>{CLI}</p></div>

</div>

  
        

       
   
      
     

 
  }


  createPlugin = () => {

    var details = this.state.details

    var conditionalsString = 'true'
    var conditionalNotes = '""'

    var conditionals = this.state.conditionals

   

    for (var i = 0; i < conditionals.length; i++) {

      conditionalsString += ' &&' + conditionals[i].filter + '.outcome === true'
      conditionalNotes += ' + ' + conditionals[i].filter + '.note'

    }


    var action = this.state.action



    Meteor.call('createPlugin', details, conditionalsString, conditionalNotes, action, function (error, result) { })

    alert('Local plugin created! It can be viewed on the Local plugins tab')

  }



  render() {



    return (



      <div >

        <br />
        <br />
        <br />

        <center><p>Create</p></center>

             <br />
        <br />
        <br />

        <p>Steps:</p>


        <p>1. Fill in plugin details.</p>
        <p>2. Add Filters (if required).</p>
        <p>3. Select and set Action.</p>
        <p>4. Check plugin summary and click Create Plugin.</p>

        <br />
        <br />

         <center><p>Plugin summary:</p></center>

        <br />

        <div className="pluginSummary">

       

         <center><p><b>Details:</b></p></center>

         <div className="pluginSummaryDetailsGrid">

 
  <div><p>Name</p></div><div><p>{ this.state.details.Name}</p></div>
    <div><p>Type</p></div><div><p>{this.state.details.Type}</p></div>
  <div><p>Operation</p></div><div><p>{this.state.details.Operation }</p></div>
        <div><p>Description</p></div><div><p>{this.state.details.Description}</p></div>

        </div>


       <center><p><b>Filters:</b></p></center>

        <br />

        {this.renderConditionals()}

        <br />

        
        <center><p><b>Action:</b></p></center>


         {this.renderAction()} 

          <br />

          </div>

             <br />
        <br />

                  <center>

          <Button variant="outline-light" onClick={this.createPlugin}  >Create Plugin</Button>

        </center>


   
        <br />


       <h3 onClick={() => {
         
         if(this.state.selectedDropdown != "pluginDetails"){

      this.setState({
      selectedDropdown: 'pluginDetails',
      })

         }else{

             this.setState({
      selectedDropdown: '',
      })

         }
    
    }} className={ this.state.selectedDropdown == "pluginDetails" ? 'selectedNav' : 'unselectedNav'}>Edit details</h3>

           <h3 onClick={() => {
              if(this.state.selectedDropdown != "addFilters"){

      this.setState({
      selectedDropdown: 'addFilters',
      })

         }else{

             this.setState({
      selectedDropdown: '',
      })

         }
    }} className={ this.state.selectedDropdown == "addFilters" ? 'selectedNav' : 'unselectedNav'}>Add filters</h3>

           <h3 onClick={() => {

             if(this.state.selectedDropdown != "setAction"){

      this.setState({
      selectedDropdown: 'setAction',
      })

         }else{

             this.setState({
      selectedDropdown: '',
      })

         }
    
     }} className={ this.state.selectedDropdown == "setAction" ? 'selectedNav' : 'unselectedNav'}>Set action</h3>


<br/>




 <div className={ this.state.selectedDropdown == "pluginDetails" ? '' : 'd-none'}>

 <br/>

 <p>These details are purely descriptive. They have no effect on how files are processed.</p>

 <br/>

         <p>Name</p>

        <input type="text" className="pluginCreatorInputs" name="Name" ref="Name" placeholder="Give a name" onChange={this.handleDetailsChange}></input>

        <p>Type</p>

     <select name="Type"  ref="Type" onChange={this.handleDetailsChange}>
          <option value="Video">Video</option>
          <option value="Audio">Audio</option>
        </select>

        <p>Operation</p>


        <select name="Operation" ref="Operation" onChange={this.handleDetailsChange}>
        <option value="Transcode">Transcode</option>
          <option value="Remux">Remux</option>
        </select>

        <p>Description</p>

        <input type="text" className="pluginCreatorInputs" name="Description" ref="Description" placeholder="Give a description" onChange={this.handleDetailsChange}></input>

        <br />
        <br />
        <br />

 </div>

  <div className={ this.state.selectedDropdown == "addFilters" ? '' : 'd-none'}>

  
         <center><p>Filters:</p> </center>

    

       <center>  <select ref="filterDropdown" onChange={this.setShownFilter}>
          <option value="filterByCodec">Filter by codec</option>
          <option value="filterByMedium">Filter by medium</option>
          <option value="filterByAge">Filter by age</option>
          <option value="filterByResolution">Filter by resolution</option>
          <option value="filterBySize">Filter by size</option>

        </select> </center>


        <div className={this.state.selectedFilter == "filterByMedium" ? '' : 'd-none'}>
          <FilterByMedium pushConditional={this.pushConditional} />
        </div>


        <div className={this.state && this.state.selectedFilter == "filterByCodec" ? '' : 'd-none'}>
          <FilterByCodec pushConditional={this.pushConditional} />
        </div>


        <div className={this.state && this.state.selectedFilter == "filterByAge" ? '' : 'd-none'}>
          <FilterByAge pushConditional={this.pushConditional} />
        </div>


        <div className={this.state && this.state.selectedFilter == "filterByResolution" ? '' : 'd-none'}>
          <FilterByResolution pushConditional={this.pushConditional} />
        </div>



        <div className={this.state && this.state.selectedFilter == "filterBySize" ? '' : 'd-none'}>
          <FilterBySize pushConditional={this.pushConditional} />
        </div>



        <br />
        <br />
        <br />

 </div>

  <div className={ this.state.selectedDropdown == "setAction" ? '' : 'd-none'}>

         <center> <p>Actions:</p></center>

       <center>  <select ref="actionDropdown" onChange={this.setShownAction}>

          <option value="customTranscode">Custom transcode arguments</option>
          <option value="remuxContainer">Remux container</option>

        </select> </center>

        <div className={this.state && this.state.selectedAction == "customTranscode" ? '' : 'd-none'}>
          <CustomTranscode setAction={this.setAction} />
        </div>

        
        <div className={this.state && this.state.selectedAction == "remuxContainer" ? '' : 'd-none'}>
          <RemuxContainer setAction={this.setAction} />
        </div>







        <br />
        <br />
        <br />

 </div>


      </div>

    );
  }
}



