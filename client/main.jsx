import {Meteor} from 'meteor/meteor';
import React from 'react';
import {render} from 'react-dom';

import Notification from '../imports/ui/ANotification.jsx';
import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
  render(<><Notification/><App /></>, document.getElementById('react-target'));
});
