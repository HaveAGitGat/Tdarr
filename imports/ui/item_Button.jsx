import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';



import { FileDB } from '../api/tasks.js';


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = { isShowState: true }

  }

  triggerLoadState = () => {


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

    // var temp ={
    //   createdAt: new Date()

    // }

    if (this.props.type == "updateDBAction") {

      return (

        <div>
          {this.state.isShowState && <Button variant="outline-dark" onClick={() => {


            this.triggerLoadState();

            FileDB.upsert(this.props.file,
              {
                $set: this.props.obj
              });


          }}>{this.props.symbol}</Button>}

          {this.state.isLoadState && <ClipLoader

            sizeUnit={"px"}
            size={25}
            color={'#000000'}
            loading={true}
          />}





        </div>

      )

    }

    if (this.props.type == "createSample") {

      return (

        <div>
          {this.state.isShowState && <Button variant="outline-dark" onClick={() => {


            this.triggerLoadState();

           
             
           Meteor.call('createSample', this.props.file, (error, result) => {})


          }}>{this.props.symbol}</Button>}

          {this.state.isLoadState && <ClipLoader

            sizeUnit={"px"}
            size={25}
            color={'#000000'}
            loading={true}
          />}





        </div>

      )

    }

  }
}


