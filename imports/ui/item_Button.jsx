import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';

import {FileDB} from '../api/tasks.js';


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = { isShowState: true }
     
      }

      triggerAddTripState = () => {

        console.log("Here")
        this.setState({
          ...this.state,
          isShowState: false,
          isLoadState: true
        })

        setTimeout(this.reset, 1000);
      }

      reset = () => {
        this.setState({
          ...this.state,
          isShowState: true,
          isLoadState: false
        })

      }




    render() {
      return (

        <div>
        {this.state.isShowState &&  <Button variant="dark" onClick={() => {

          console.log("here1")

         this.triggerAddTripState();

  FileDB.upsert(this.props.file,
    {
      $set: {
        createdAt: new Date(),
      }
    });


}}>↑</Button>}

{this.state.isLoadState &&   <ClipLoader
      
  sizeUnit={"px"}
  size={25}
  color={'#000000'}
  loading={true}
/>}



  
 
      </div>

      )

    }
  }

  
