import './styles/main.scss';

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

  const [currentVersion, setVersion] = React.useState('');

  

  React.useEffect(() => {
    Meteor.subscribe('GlobalSettingsDB', () => {
      const updatedBasePath = GlobalSettingsDB.find({}).fetch()[0].basePath;
      setBasePath(updatedBasePath);

      var version =  GlobalSettingsDB.find({}).fetch()[0].version;

      var newVersion = 1.007

      setVersion(newVersion)

      if(version != newVersion){

        alert(`

v1.007 release [22nd Nov 19]:
No breaking changes.
Changes:
-[New] Option to enable Linux FFmpeg NVENC binary (3.4.5 for unRAID compatibility)
-[New] Option to ignore source sub-folders
-[New] Skip health check button
-[New] Option to change visible queue length
-[New] Option to duplicate library
-[New] Customise search result columns
-[New] UI improvements (@jono)
-[New] Option to delete source file when using folder to folder conversion.
-[New] Community plugins (Remove commentary tracks etc)
-[New] Option to delete local plugins
-[New] Auto clean cache folder + preventing none Tdarr cache files being deleted in case of incorrect mapping.
-[Fix] Reset processing status of all files on startup so no files stuck in limbo
-[Fix] Transcode pie showing incorrect data
-[Fix] Folder watcher will now wait longer to detect if a new file has finished copying
-[Fix] Folder to folder conversion: Files which already meet requirements will be copied to output folder
-[Fix] Folder to folder conversion: Cache/Output folder bug
-[Fix] Default containers to scan for now include ts/m2ts
-[Fix] Keep all stream types when using remux plugin creator
-[Fix] Prevent too many workers occassionally starting
-[Fix] Newly transcoded files will be bumped correctly to top of queue when sorting by size
-[Fix] Closed caption scanning now much faster & accurate (even on empty captions)
-[Fix] Plugin creator plugin path error
-[Fix] Health check error when using FFmpeg hardware transcoding
        
    
        
        
        `)

        GlobalSettingsDB.upsert(
          "globalsettings",
          {
            $set: {
              version: newVersion,
            }
          }
        );
      }
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
          <img style={{height: '50px'}} src="https://i.imgur.com/s8ZbOsT.png" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav ">
          <Nav>
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
            <p>Alpha {currentVersion}</p>
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
