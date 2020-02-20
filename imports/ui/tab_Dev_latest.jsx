import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';




export default class App extends Component {

  constructor(props) {
    super(props);

  }






  render() {



    return (




      <div >

<p>Beta v1.105 release [20th Feb 2020]:
            
            <br />Changes:

            <br />-[New] Categorised plugin browser
            <br />-[New] Set backup limit (Options tab - default 30)
            <br />-[New] Alert on Tdarr tab if libraries unchecked/out of schedule 


            <br />-[Improvement] Git not required on host OS
            <br />-[Improvement] File scanner fails more rarely
            <br />-[Improvement] Snappier plugin stack UI
            <br />-[Improvement] Numerous other UI changes (workers, schedule, plugin stack, search results, backups etc)

            <br />-[Fix] Local images show when using base path



            <br />
            <br />

            </p>


      </div>

    );
  }
}

