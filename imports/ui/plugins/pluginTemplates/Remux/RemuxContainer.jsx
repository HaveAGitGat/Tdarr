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



      var container = ReactDOM.findDOMNode(this.refs.container).value

      if(container.charAt(0) !== "."){

        container =  "."+ container

      }
   

Meteor.call('createPluginRemuxContainer', container, function (error, result) { })

alert('Local plugin created! It can be viewed on the Local plugins tab')

    }



  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Remux container</p> </center>



          <p>If not in the following, files will be remuxed into:</p>
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


