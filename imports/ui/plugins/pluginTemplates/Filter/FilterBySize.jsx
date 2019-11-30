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
  
    };
  }


    addFilter = () => {


      var lowerBound = parseFloat(ReactDOM.findDOMNode(this.refs.lowerBound).value)
      var upperBound = parseFloat(ReactDOM.findDOMNode(this.refs.upperBound).value)

      if( isNaN(lowerBound)){
        lowerBound = 0
      }
      if( isNaN(upperBound)){
        upperBound = 0
      }
  

      var string = lowerBound + "GB-" + upperBound + "GB" 




var obj = {
  name: 'Filter by size',
  filter: `library.filters.filterBySize(file,${lowerBound},${upperBound})`,
  description: `Files in the following size range will be processed: ${string}`
}

this.props.pushConditional(obj)


    }



  render() {



    return (





      <div >

       <br/>

       <center><p>Include files between</p> </center>
       <br/>

       <center><p>
       
       <input type="text" className="filterByDate" ref="lowerBound"  defaultValue={"0"}></input>
       GB and 
       <input type="text" className="filterByDate" ref="upperBound"  defaultValue={"100"}></input>
       GB
      
       </p> </center>


        
          <br/>


      
        <center>

          <Button variant="outline-light" onClick={this.addFilter}  >Add filter</Button>

        </center>

        <br />
        <br />
       <br/>



      </div>

    );
  }
}