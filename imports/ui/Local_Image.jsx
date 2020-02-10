

import React, { Component } from 'react';
import { GlobalSettingsDB } from '../api/tasks.js';

export default LocalImage = (props) => {


  const [link, setLink] = React.useState('');

  React.useEffect(() => {


    Meteor.subscribe('GlobalSettingsDB', () => {


      const basePath = GlobalSettingsDB.find({}).fetch()[0].basePath;

      var updatedLink = basePath + props.link
  
      setLink(updatedLink);

    });

  });

  return (

    <img src={link ? link : null} height={props.height ? props.height : null} width={props.width ? props.width : null} alt={props.alt ? props.alt : null}></img>

  );

}

