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


 


          <div className="iconContainer">
            <a href={"https://github.com/HaveAGitGat/Tdarr"}><img src={"/images/icons/G.png"} alt='icon' height="50" width="50" /></a>
          </div>

          <br></br>
          <br></br>


          <div className="iconContainer">
            <a href={"https://www.reddit.com/r/Tdarr"}><img src={"/images/icons/R.png"} alt='icon' height="50" width="50" /></a>
          </div>

          <br></br>
          <br></br>



          <div className="iconContainer">
            <a href={"https://discord.gg/GF8X8cq"}><img src={"/images/icons/D.svg"} alt='icon' height="60" width="60" /></a>
          </div>


        </center>



      </div>

    );
  }
}

