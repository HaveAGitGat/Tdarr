import React from 'react';
import {Nav, Navbar} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
} from 'react-router-dom';

import {GlobalSettingsDB} from '../api/tasks.js';
import TabDev from '../ui/tab_Dev.jsx';
import TabHelp from '../ui/tab_Help.jsx';
import TabLog from '../ui/tab_Log.jsx';
import TabOptions from '../ui/tab_Options.jsx';
import TabStatistics from '../ui/tab_Statistics.jsx';
import {ErrorBoundary} from './ErrorBoundary.jsx';
import TabLibraries from './libraries/tab_Libraries.jsx';
import TabPlugins from './plugins/tab_Plugins.jsx';
import TabSearch from './tab_Search.jsx';
import TabTranscoding from './transcoding/tab_Transcoding.jsx';

const tabs = [
  {path: '/tdarr/', text: 'Tdarr', component: TabTranscoding},
  {path: '/search', text: 'Search', component: TabSearch},
  {path: '/stats', text: 'Stats', component: TabStatistics},
  {path: '/settings/', text: 'Libraries', component: TabLibraries},
  {path: '/plugins/', text: 'Plugins', component: TabPlugins},
  {path: '/options/', text: 'Options', component: TabOptions},
  {path: '/logs/', text: 'Logs', component: TabLog},
  {path: '/help/', text: 'Help', component: TabHelp},
  {path: '/', text: 'Dev', component: TabDev},
];

const AppRouter = () => {
  const [basePath, setBasePath] = React.useState('');

  React.useEffect(() => {
    Meteor.subscribe('GlobalSettingsDB', () => {
      const updatedBasePath = GlobalSettingsDB.find({}).fetch()[0].basePath;

      setBasePath(updatedBasePath);
    });
  });

  return (
    <Router>
      <Navbar
        className="mb-0 rounded-0 d-flex justify-content-between"
        collapseOnSelect
        expand="md"
        bg="dark"
        variant="dark"
      >
        <Navbar.Brand className="p-2" href={`${basePath}/tdarr`}>
          <img className="h-100" src="https://i.imgur.com/s8ZbOsT.png" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav ">
          <Nav style={{fontSize: '1.5em'}}>
            {tabs.map(t => (
              <NavLink
                key={`nav-item-${t.path}`}
                className="ml-4 nav-link"
                to={`${basePath}${t.path}`}
                exact={t.path === '/'}
              >
                {t.text}
              </NavLink>
            ))}
          </Nav>
        </Navbar.Collapse>
        <div className="versionNumber">
          <p>v1.0062</p>
        </div>
      </Navbar>

      <link rel="icon" sizes="16x16 32x32" href="/favicon.png?v=2" />
      <ErrorBoundary>
        <Switch>
          {tabs.map(t => (
            <Route
              key={`nav-route-${t.path}`}
              path={`${basePath}${t.path}`}
              component={t.component}
            />
          ))}
        </Switch>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRouter;
