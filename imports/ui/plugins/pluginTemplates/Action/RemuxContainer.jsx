import React, { Component } from 'react';
import { Button} from 'react-bootstrap';
import ReactDOM from 'react-dom';





var ButtonStyle = {
  display: 'inline-block',
}



 export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      handBrakeMode:true,
      FFmpegMode:false
  
    };


  }


    addAction = () => {



      var container = ReactDOM.findDOMNode(this.refs.container).value


      if(container.charAt(0) !== "."){

        container =  "."+ container

      }

      var containerNoDot = container.split('.').join('')
  

var obj = {
  name:'Remux container',
  description:`Files which aren't in ${containerNoDot} will be remuxed into ${containerNoDot}`,

  preset: `', -map 0 -c copy'`,
  container: `'${container}'`,
  handBrakeMode: false,
  FFmpegMode: true,
  processFile: `library.actions.remuxContainer(file, '${containerNoDot}').processFile`,
  infoLog:`library.actions.remuxContainer(file, '${containerNoDot}').note`

}


this.props.setAction(obj)




    }



  render() {



    return (





      <div >

<br/>

<center><p>Remux container</p> </center>

<br/>

<p>This action has a built-in filter. Additional filters can be added above.</p>

<br/>
          <p>If not in the following, files will be remuxed into:</p>
       <br/>


       <input type="text" className="pluginCreatorInputs" ref="container"  defaultValue={"mkv"}></input>

          <br/>
          <br/>
          <br/>
          <br/>


        <center>

        <Button variant="outline-light" onClick={this.addAction}  >Set action</Button>

       </center>

       <br/>
       <br/>
       <br/>



      </div>

    );
  }
}
