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
      excludeResolutionSwitch: false,
    };



  }


    createPlugin = () => {


      var resolutions = ReactDOM.findDOMNode(this.refs.resolutions).value

 
      Meteor.call('createPluginFilterResolution', this.state.excludeResolutionSwitch, resolutions, function (error, result) { })

      alert('Local plugin created! It can be viewed on the Local plugins tab')
      
    }



  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Filter by resolution</p> </center>

       <br/>
       <br/>
       <br/>


       <p>Don't <Checkbox  checked={this.state.excludeResolutionSwitch} onChange={ event => {

this.setState({
  excludeResolutionSwitch: !this.state.excludeResolutionSwitch,
})


       }} />/ Only<Checkbox checked={!this.state.excludeResolutionSwitch} onChange={event => {

        this.setState({
          excludeResolutionSwitch: !this.state.excludeResolutionSwitch,
        })


       }} /> transcode files which are already in these resolutions:</p>

       <br/>
       <br/>


 
       <input type="text" className="folderPaths" ref="resolutions"  defaultValue={"480p,576p,720p,1080p,4KUHD,DCI4K,8KUHD,Other"}></input>

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


