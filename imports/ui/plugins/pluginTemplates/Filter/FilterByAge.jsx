import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';





var ButtonStyle = {
  display: 'inline-block',
}



export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {

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


    var obj = {
      name: 'Filter by age',
      filter: `library.filters.filterByAge(file,${totalSeconds})`,
      description: `Files older than the following will be excluded from processing: ${string}`
    }

    this.props.pushConditional(obj)





  }



  render() {



    return (


      <div >


        <br />



         <center><p>Exclude files older than</p> </center>
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


