import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
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
      video: true,
      audio: false,
    };


  }


  addFilter = () => {


    var type

    if (this.state.audio == true) {
      type = 'audio'
    } else {
      type = 'video'
    }

    var obj = {
      name: 'Filter by medium',
      filter: `library.filters.filterByMedium(file,"${type}")`,
      description:`The following file type will be included for processing: ${type}`
    }

    this.props.pushConditional(obj)

  }



  render() {



    return (

      <div >


        <br />

         <center><p>Process:</p> </center>
         <center><p>Video files <Checkbox checked={this.state.video} onChange={event => {

          this.setState({
            video: true,
            audio: false
          })

        }} /></p> </center>

         <center><p>Audio files <Checkbox checked={this.state.audio} onChange={event => {

          this.setState({
            audio: true,
            video: false
          })

        }} /></p> </center>



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


