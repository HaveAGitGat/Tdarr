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


    createPlugin = () => {


      var lowerBound = parseFloat(ReactDOM.findDOMNode(this.refs.lowerBound).value)
      var upperBound = parseFloat(ReactDOM.findDOMNode(this.refs.upperBound).value)

      if( isNaN(lowerBound)){
        lowerBound = 0
      }
      if( isNaN(upperBound)){
        upperBound = 0
      }
  

      var string = lowerBound + "GB-" + upperBound + "GB" 

Meteor.call('createPluginFilterSize', lowerBound,upperBound, string, function (error, result) { })


    }



  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Filter by size</p> </center>

       <br/>
       <br/>
       <br/>



      <p>Include files between</p>
       <br/>

      <p>
       
       <input type="text" className="filterByDate" ref="lowerBound"  defaultValue={"0"}></input>
       GB and 
       <input type="text" className="filterByDate" ref="upperBound"  defaultValue={"100"}></input>
       GB
      
       </p>


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


