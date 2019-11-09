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


      var h = parseInt(ReactDOM.findDOMNode(this.refs.hours).value)
      var m = parseInt(ReactDOM.findDOMNode(this.refs.minutes).value)
      var s = parseInt(ReactDOM.findDOMNode(this.refs.seconds).value)

      if( isNaN(h)){
        h = 0
      }
      if( isNaN(m)){
        m = 0
      }
      if( isNaN(s)){
        s = 0
      }

      var string = h + "h" + m + "m" + s + "s"

      var totalSeconds = (h*3600) + (m*60) + (s)

      console.log(totalSeconds)


Meteor.call('createPluginFilterDate', totalSeconds, string, function (error, result) { })

alert('Local plugin created! It can be viewed on the Local plugins tab')

    }



  render() {



    return (





      <div >

<br/>
<br/>
<br/>

<center><p>Filter by date</p> </center>

       <br/>
       <br/>
       <br/>



      <p>Exclude files older than</p>
       <br/>

      <p>
       
       <input type="text" className="filterByDate" ref="hours"  defaultValue={"0"}></input>
       H{'\u00A0'}{'\u00A0'}
       <input type="text" className="filterByDate" ref="minutes"  defaultValue={"0"}></input>
       M{'\u00A0'}{'\u00A0'}
       <input type="text" className="filterByDate" ref="seconds"  defaultValue={"0"}></input>
       S
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


