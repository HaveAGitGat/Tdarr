import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';










export default class App extends Component {

  constructor(props) {
    super(props);

  }

  render() {



    return (



      <div className="containerGeneral">
        <center>
          <header>
            <h1>Help</h1>
          </header>
        </center>

        <br></br>
        <br></br>

        <center>


        <p>Join us!</p>
 
 
          <div className="iconContainer">
        <img src={"/images/icons/D.svg"}  onClick={()=> window.open("https://discord.gg/GF8X8cq", "_blank")} alt='icon' height="60" width="60" />
          </div>


         

          <br></br>
          <br></br>

    
           
          <div className="iconContainer">
        <img src={"/images/icons/G.png"}  onClick={()=> window.open("https://github.com/HaveAGitGat/Tdarr/wiki", "_blank")} alt='icon' height="60" width="60" />
          </div>

          <br></br>
          <br></br>



           
          <div className="iconContainer">
        <img src={"/images/icons/R.png"}  onClick={()=> window.open("https://www.reddit.com/r/Tdarr", "_blank")} alt='icon' height="60" width="60" />
          </div>

          <br></br>
          <br></br>




        </center>



      </div>

    );
  }
}

