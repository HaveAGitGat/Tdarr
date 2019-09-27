import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';










export default class App extends Component {

  constructor(props) {
    super(props);

  }

  clearDB = () =>{


    Meteor.call('clearDB', (error, result) => {


      alert('Cleared! Please restart Tdarr.')


    });




  }




  render() {



    return (



      <div className="containerGeneral">
      <header>
          <h1>Welcome to Tdarr Pre-Alpha</h1>
      </header>


      <p>Tdarr is very much still in development. There's chance something may 
        go wrong between version updates due to changing the way features work and how data is stored/manipulated.</p>


        <p>If things aren't working as expected, it may be necessary to clear the database using the following button. Please restart Tdarr after doing so.</p>

      
    <input type="button" onClick={() => this.clearDB()} value={"Clear database"} className="addFolderButton"></input>



      
        </div>

    );
  }
}

