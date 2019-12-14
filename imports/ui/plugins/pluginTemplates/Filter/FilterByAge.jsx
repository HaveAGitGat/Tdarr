import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Checkbox from '@material-ui/core/Checkbox';
import ReactDOM from 'react-dom';





var ButtonStyle = {
  display: 'inline-block',
}



export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      excludeSwitch:true,
      dateType:'dateCreated'

    };


  }

  addFilter = () => {


    var h = parseInt(ReactDOM.findDOMNode(this.refs.hours).value)
    var m = parseInt(ReactDOM.findDOMNode(this.refs.minutes).value)
    var s = parseInt(ReactDOM.findDOMNode(this.refs.seconds).value)

    if (isNaN(h)) {
      h = 0
    }
    if (isNaN(m)) {
      m = 0
    }
    if (isNaN(s)) {
      s = 0
    }

    var string = h + "h" + m + "m" + s + "s"

    var totalSeconds = (h * 3600) + (m * 60) + (s)

    if(this.state.excludeSwitch === true){

      var mode = 'exclude'

    }else{

      var mode = 'include'

    }


    var obj = {
      name: 'Filter by age',
      filter: `library.filters.filterByAge(file,${totalSeconds},'${mode}','${this.state.dateType}')`,
      description: `Files older than the following will be ${mode}d from processing: ${string}`
    }

    this.props.pushConditional(obj)

  }



  render() {



    return (


      <div >


        <br />


        <center><p>Date created<Checkbox checked={this.state.dateType == 'dateCreated' ? true : false} onChange={event => {

this.setState({
  dateType:'dateCreated'
})


}} />/ Date modified <Checkbox checked={this.state.dateType == 'dateModified' ? true : false} onChange={event => {

this.setState({
  dateType:'dateModified',
})


}} /></p> </center>

<br />


         <center><p>Exclude<Checkbox checked={this.state.excludeSwitch} onChange={event => {

this.setState({
  excludeSwitch: !this.state.excludeSwitch,
})


}} />/ Include <Checkbox checked={!this.state.excludeSwitch} onChange={event => {

this.setState({
  excludeSwitch: !this.state.excludeSwitch,
})


}} /> files older than</p> </center>
        <br />

         <center><p>

          <input type="text" className="filterByDate" ref="hours" defaultValue={"0"}></input>
          H{'\u00A0'}{'\u00A0'}
          <input type="text" className="filterByDate" ref="minutes" defaultValue={"0"}></input>
          M{'\u00A0'}{'\u00A0'}
          <input type="text" className="filterByDate" ref="seconds" defaultValue={"0"}></input>
          S
       </p> </center>


    
        <br />


        <center>

          <Button variant="outline-light" onClick={this.addFilter}  >Add filter</Button>

        </center>

        <br />
        <br />
        <br />



      </div>

    );
  }
}


