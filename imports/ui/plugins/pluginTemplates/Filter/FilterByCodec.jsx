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
      excludeCodecSwitch: true,
    };


  }


  addFilter = () => {

    var mode

    if (this.state.excludeCodecSwitch == true) {
      mode = 'exclude'
    } else {

      mode = 'include'
    }

    // arguments: ['file', '"include"', '"h264,vp8"'],

    var obj = {
      name: 'Filter by codec',
      filter: `library.filters.filterByCodec(file,"${mode}","${ReactDOM.findDOMNode(this.refs.codecs).value}")`,
      description: `The following will be ${mode}d for processing: ${ReactDOM.findDOMNode(this.refs.codecs).value}`
    }

    this.props.pushConditional(obj)

  }



  render() {



    return (





      <div >

 
        <br />


        <p>Don't <Checkbox checked={this.state.excludeCodecSwitch} onChange={event => {

          this.setState({
            excludeCodecSwitch: !this.state.excludeCodecSwitch,
          })


        }} />/ Only<Checkbox checked={!this.state.excludeCodecSwitch} onChange={event => {

          this.setState({
            excludeCodecSwitch: !this.state.excludeCodecSwitch,
          })


        }} /> process files in these codecs:</p>

        <br />
        <br />

        <input type="text" className="pluginCreatorInputs" ref="codecs" defaultValue={"hevc,h264"}></input>



        <br/>
         <br/>


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




