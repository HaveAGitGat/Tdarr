

import React, { Component } from 'react';
import { GlobalSettingsDB } from '../api/tasks.js';


export default class LocalImage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      link: '',

    }


  }

  componentDidMount() {

    Meteor.subscribe('GlobalSettingsDB', () => {

      this.setImgLink()

    })


  }


  setImgLink = () => {

    var basePath = GlobalSettingsDB.find({}).fetch()[0].basePath;

    if (basePath != undefined) {
      var updatedLink = basePath + this.props.link
    } else {
      var updatedLink = this.props.link
    }


    this.setState({
      link: updatedLink
    })

    console.log(updatedLink)

  }

  render() {

    return <img src={this.state.link ? this.state.link : this.props.link} height={this.props.height ? this.props.height : null} width={this.props.width ? this.props.width : null} alt={this.props.alt ? this.props.alt : null}></img>
  }
}


