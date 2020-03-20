import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';




export default class App extends Component {

  constructor(props) {
    super(props);

  }






  render() {



    return (




      <div>

          <p> Beta v1.106 release [20th March 2020]:
            
            <br />Changes:

            <br />-[New] Option to copy community plugins to local
            <br />-[New] Option to edit source code of local plugins
            <br />-[New] A simple daily scan will occur if 'Scan on start' is enabled for library (prevents some disk IO issues some people have with the folder watcher)
            <br />-[New] Option on 'Options' tab to change resolution boundaries
            <br />-[New] Option to reset all stats or individual library stats

            <br />-[Improvement] Tab state no longer saved for plugin, library and library sub-section tabs

            <br />-[Fix] Text breaking in worker UI
            <br />-[Fix] Small CPU spikes when idle
            <br />-[Fix] Button error if restoring from backup
            <br />-[Fix] Delete local plugin button restored
            <br />
            <br />

            </p>


      </div>

    );
  }
}

