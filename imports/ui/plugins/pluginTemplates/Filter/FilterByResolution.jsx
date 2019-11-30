import React, { Component } from 'react';
import { Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Checkbox from '@material-ui/core/Checkbox';





var ButtonStyle = {
  display: 'inline-block',
}



 export default class App extends Component {

  constructor(props) {
    super(props);

    
    this.state = {
      excludeResolutionSwitch: false,
    };



  }


  addFilter = () => {


    var mode

    if (this.state.excludeResolutionSwitch == true) {
      mode = 'exclude'
    } else {

      mode = 'include'

    }


    var obj = {
      name: 'Filter by resolution',
      filter: `library.filters.filterByResolution(file,"${mode}","${ReactDOM.findDOMNode(this.refs.resolutions).value}")`,
      description: `The following will be ${mode}d for processing: ${ReactDOM.findDOMNode(this.refs.resolutions).value}`
    }

    this.props.pushConditional(obj)
      
    }



  render() {



    return (





      <div >

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


 
       <input type="text" className="pluginCreatorInputs" ref="resolutions"  defaultValue={"480p,576p,720p,1080p,4KUHD,DCI4K,8KUHD,Other"}></input>

          <br/>
          <br/>


          <center>

<Button variant="outline-light" onClick={this.addFilter}  >Add filter</Button>

</center>

       <br/>
       <br/>
       <br/>



      </div>

    );
  }
}



