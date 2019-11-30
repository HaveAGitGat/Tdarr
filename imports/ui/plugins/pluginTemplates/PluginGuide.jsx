import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';





var ButtonStyle = {
  display: 'inline-block',
}



 class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
  
    };


  }






  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Guide</p> </center>


                    <br/>
                    <br/>
                    <br/>


<p>Each of your libraries can have its own plugin stack. Use both community and local plugins to create a stack which processes your files to your requirements.</p>

<p>Plugins created in the plugin creator will be saved locally in 'Tdarr/Plugins/Local' and can be viewed on the 'Local' plugins tab to the upper left.</p>

<br/>
<br/>

<p>Some action types have no built in filter and rely on the filters you set.</p>


<br/>
<br/>
<p>When using Tdarr it's important that you implement conditions to prevent your files from going through an infinite transcode/remux cycle. For example, if you're transcoding into hevc then add a filter to prevent hevc being transcoded. That way your new files (in hevc), won't be re-transcoded.</p>
<br/>
<br/>




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


