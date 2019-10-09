import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';









export default class App extends Component {

  constructor(props) {
    super(props);

  }

  clearDB = () => {


    if (confirm('Are you sure you want to delete the Tdarr database? Your files will not be affected.')) {

      Meteor.call('clearDB', (error, result) => {



        alert('Cleared! Please restart Tdarr.')


      });


    }
  }




  render() {



    return (



      <div className="containerGeneral">

        <center>

          <p align="center">
            <img src="https://i.imgur.com/M0ikBYL.png" />
          </p>

          <header>
            <h1>Welcome to Tdarr Alpha</h1>
          </header>

        </center>

        <p></p>
        <p></p>
        <p></p>


        <center>




          <div className="introText">
            <p>Make sure to use the <Button variant="outline-dark">i</Button> buttons on each tab to learn more about how Tdarr operates.</p>
          </div>

          <p></p>
          <p></p>
          <p></p>

          <p align="center">
            <img src="https://i.imgur.com/wRV6tBJ.png" height="300" />
          </p>

          <p></p>
          <p></p>
          <p></p>

          <div className="introText">
            <p>Tdarr is very much still in development. There's chance something may
        go wrong between version updates due to changing the way features work and how data is stored/manipulated.</p>




            <p>If things aren't working as expected, it may be necessary to clear the database using the following button. Your files will not be affected. Please restart Tdarr after doing so.</p>

            <center>
            <Button variant="outline-danger" onClick={() => this.clearDB()} >Clear database</Button>
            </center>
            <p></p>
            <p></p>
            <p></p>
            <p>Credits:</p>

            <p></p>
            <p>@Roxedus for a slimline container.</p>
            <p></p>
            <p>@GilbN and @Drawmonster for support and debugging.</p>



          </div>


        </center>







      </div>

    );
  }
}

