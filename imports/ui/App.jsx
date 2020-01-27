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
import TabBackups from './tab_Backups.jsx';

const tabs = [
  {path: '/tdarr/', text: 'Tdarr', component: TabTranscoding},
  {path: '/search', text: 'Search', component: TabSearch},
  {path: '/stats', text: 'Stats', component: TabStatistics},
  {path: '/settings/', text: 'Libraries', component: TabLibraries},
  {path: '/plugins/', text: 'Plugins', component: TabPlugins},
  {path: '/options/', text: 'Options', component: TabOptions},
  {path: '/logs/', text: 'Logs', component: TabLog},
  {path: '/help/', text: 'Help', component: TabHelp},
  {path: '/backups/', text: 'Backups', component: TabBackups},
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

      var newVersion = 1.103

      setVersion(newVersion)

      if(version != newVersion){

        alert(`

        Beta v1.103 release [27th Jan 2020]:
        Changes:
        -[New] Option to set folder watch scan interval (default 30 secs)
        -[New] Button to skip all for transcode and health check queues
        -[New] Option on 'Options' tab to toggle worker stall detector
        -[New] Basic output file size estimation shown on workers
        -[Re-Fix] Prevent too many workers being started
        -[Fix] Links open correctly when using context menu
        -[Fix] Images stored locally

        Beta v1.102 release [18th Jan 2020]:
        Changes:
        -[New] Plugin creator option (Filter by age) - select 'Date created' or 'Date modified'
        -[New] Plugin creator option (Filter by age) - include files OLDER than specified time
        -[New] Options to sort queue by date (Scanned, Created, Modified)
        -[Fix] Audio file codec not showing in search results
        -[Fix] MJPEG video incorrectly tagged as audio file
        -[Fix] Default plugin priority
        -[Fix] 'Too many packets buffered for output stream' when health checking
        -[Fix] Folder path placeholder text

        Beta v1.101 release [06 Dec 19]:
        Changes:
        -[New] Force processing of files
        -[New] Action: HandBrake basic options
        -[New] Action: Add one audio stream
        -[New] Action: Keep one audio stream
        -[New] Action: Standardise audio stream codecs
        -[New] Channel count now shown in streams table
        -[Fix] Rare search result bug (no results shown)
        -[Fix] Audio files with cover art being detected as video

        v1.008 release [1st Dec 19]:
        Changes:
        -[New] Plugin creator UI and groundwork for future Filters and Actions. Filters now encapsulate Action taken. No separate Filter needed
        -[New] Re-order streams plugin added by default for new libraries
        -[New] Backup and restore feature (scheduled midnight backup)
        -[New] Toggle copying to output folder if file already meets conditions
        -[Improvement] Change to how plugins are imported. Built-in NodeJS modules can now be used when creating plugins. (Can use e.g. require('fs') etc)
        -[Improvement] Idle CPU usage drastically reduced
        -[Improvement] Various stability fixes
        -[Improvement] Confirmation needed when restoring from backup
        -[Fix] Video resolution boundaries improved
        -[Fix] Non existent files + junk removed when running Find-New scan
        -[Fix] Corrected error when creating remux container plugin
        -[Fix] If one plugin has an error, the rest will still load
        -[Fix] Auto cache cleaner disabled due to issues on some systems
        -[Fix] Move item to Transcode:Error instead of Transcode:Not required if error with plugin



        v1.007 release [22nd Nov 19]:
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
        -[New] Auto clean cache folder + preventing non-Tdarr cache files being deleted in case of incorrect mapping.
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
            <p>Beta {currentVersion}</p>
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
