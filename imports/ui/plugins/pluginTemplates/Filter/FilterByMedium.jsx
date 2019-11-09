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
      video: true,
      audio: false,
    };


  }


    createPlugin = () => {


var type 

if(this.state.audio == true){
  type = "audio"
}else{
  type = "video"
}

Meteor.call('createPluginFilterMedium', type, function (error, result) { })

alert('Local plugin created! It can be viewed on the Local plugins tab')

    }



  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Filter by medium</p> </center>

       <br/>
       <br/>
       <br/>

<p>Transcode:</p>
<p>Video files <Checkbox  checked={this.state.video} onChange={ event => {

this.setState({
  video: true,
  audio: false
})

 }} /></p>

<p>Audio files <Checkbox  checked={this.state.audio} onChange={ event => {

this.setState({
  audio: true,
  video: false
})

 }} /></p>

       <br/>
       <br/>

      


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


