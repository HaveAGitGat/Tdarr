import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Checkbox from '@material-ui/core/Checkbox';





var ButtonStyle = {
  display: 'inline-block',
}



 class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      handBrakeMode:true,
      FFmpegMode:false
  
    };


  }


    createPlugin = () => {


      var preset = ReactDOM.findDOMNode(this.refs.preset).value

      var container = ReactDOM.findDOMNode(this.refs.container).value

      if(container.charAt(0) !== "."){

        container =  "."+ container

      }
   

Meteor.call('createPluginTranscode', preset,container,this.state.handBrakeMode,this.state.FFmpegMode, function (error, result) { })

alert('Local plugin created! It can be viewed on the Local plugins tab')

    }



  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Transcode</p> </center>

       <br/>
       <br/>
       <br/>

     <center>  <p>HandBrake<Checkbox  checked={this.state.handBrakeMode} onChange={ event => {

this.setState({
  handBrakeMode: !this.state.handBrakeMode,
})

if(this.state.FFmpegMode == true){

  this.setState({
    FFmpegMode: false,
  })

}


       }} />FFmpeg<Checkbox checked={this.state.FFmpegMode} onChange={event => {

        this.setState({
          FFmpegMode: !this.state.FFmpegMode,
        })

        if(this.state.handBrakeMode == true){

          this.setState({
            handBrakeMode: false,
          })
        
        }


       }} /></p></center> 

        <br/>
        <br/>
        <br/>



      <p>CLI arguments/preset:</p>
       <br/>

       <input type="text" className="folderPaths" ref="preset"  defaultValue={'-Z "Very Fast 1080p30"'}></input>


          <br/>
          <br/>
          <br/>
          <br/>


          <p>Output container:</p>
       <br/>


       <input type="text" className="folderPaths" ref="container"  defaultValue={"mkv"}></input>

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


