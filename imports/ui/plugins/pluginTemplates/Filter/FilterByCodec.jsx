import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button} from 'react-bootstrap';
import Checkbox from '@material-ui/core/Checkbox';
import ReactDOM from 'react-dom';





var ButtonStyle = {
  display: 'inline-block',
}



 class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      excludeCodecSwitch: true,
    };


  }


    createPlugin = () => {

var codecs = ReactDOM.findDOMNode(this.refs.codecs).value

console.log(codecs)


Meteor.call('createPluginFilterCodec', this.state.excludeCodecSwitch, codecs, function (error, result) { })


      alert('Local plugin created! It can be viewed on the Local plugins tab')


    }



  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Filter by codec</p> </center>

       <br/>
       <br/>
       <br/>


       <p>Don't <Checkbox  checked={this.state.excludeCodecSwitch} onChange={ event => {

this.setState({
  excludeCodecSwitch: !this.state.excludeCodecSwitch,
})


       }} />/ Only<Checkbox checked={!this.state.excludeCodecSwitch} onChange={event => {

        this.setState({
          excludeCodecSwitch: !this.state.excludeCodecSwitch,
        })


       }} /> transcode files in these codecs:</p>

       <br/>
       <br/>

       <input type="text" className="folderPaths" ref="codecs" name="codecs" defaultValue={"hevc,h264"}></input>


          <br/>
          <br/>
          <br/>
          <br/>


        <center>

       <Button variant="outline-light" onClick={this.createPlugin}  >Create Plugin</Button>

       </center>

       <br/>
       <br/>
       <br/>



      </div>

    );
  }
}

export default withTracker(() => {

  


return {
 


};
})(App);


