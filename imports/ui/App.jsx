import "./styles/main.scss";
import LatestDevNotes from "./tab_Dev_latest.jsx";
import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
} from "react-router-dom";

import { GlobalSettingsDB } from "../api/database.js";
import TabDev from "../ui/tab_Dev.jsx";
import TabHelp from "../ui/tab_Help.jsx";
import TabLog from "../ui/tab_Log.jsx";
import TabOptions from "../ui/tab_Options.jsx";
import TabStatistics from "../ui/tab_Statistics.jsx";
import { ErrorBoundary } from "./ErrorBoundary.jsx";
import TabLibraries from "./libraries/tab_Libraries.jsx";
import TabPlugins from "./plugins/tab_Plugins.jsx";
import TabSearch from "./tab_Search.jsx";
import TabTranscoding from "./transcoding/tab_Transcoding.jsx";
import TabBackups from "./tab_Backups.jsx";

const tabs = [
  { path: "/tdarr/", text: "Tdarr", component: TabTranscoding },
  { path: "/search", text: "Search", component: TabSearch },
  { path: "/stats", text: "Stats", component: TabStatistics },
  { path: "/settings/", text: "Libraries", component: TabLibraries },
  { path: "/plugins/", text: "Plugins", component: TabPlugins },
  { path: "/options/", text: "Options", component: TabOptions },
  { path: "/logs/", text: "Logs", component: TabLog },
  { path: "/help/", text: "Help", component: TabHelp },
  { path: "/backups/", text: "Backups", component: TabBackups },
  { path: "/", text: "Dev", component: TabDev },
];

export default AppRouter = () => {
  const [basePath, setBasePath] = React.useState("");
  const [currentVersion, setVersion] = React.useState("");
  const [newVersion, setNewVersion] = React.useState(1.1092);
  const [showUpdateScreen, setShowUpdateScreen] = React.useState(false);

  toggleConsole = () => {
    GlobalSettingsDB.upsert("globalsettings", {
      $set: {
        version: newVersion,
      },
    });
    setShowUpdateScreen(false);
  };

  React.useEffect(() => {
    Meteor.subscribe("GlobalSettingsDB", () => {
      const updatedBasePath = GlobalSettingsDB.find({}).fetch()[0].basePath;
      setBasePath(updatedBasePath);
      var version = GlobalSettingsDB.find({}).fetch()[0].version;
      setVersion(newVersion);
      if (version != newVersion) {
        setShowUpdateScreen(true);
      }
    });
  });

  return (
    <Router>
      <div className={showUpdateScreen ? "" : "d-none"}>
        <div id="consoleBar" className="consoleBarClass">
          <a
            href="javascript:void(0)"
            className="closebtn"
            onClick={this.toggleConsole}
          >
            X
          </a>
          <p> </p>
          <div id="consoleDiv" className="consoleDivClass">
            <div className="updateScreen">
              <h1>Change log</h1>
              <LatestDevNotes />
            </div>
          </div>
        </div>
      </div>

      <Navbar
        className="mb-0 rounded-0 d-flex justify-content-between"
        collapseOnSelect
        expand="md"
        bg="dark"
        variant="dark"
      >
        <Navbar.Brand className="p-2" href={`${basePath}/tdarr`}>
          <img
            style={{ height: "50px" }}
            src="https://i.imgur.com/s8ZbOsT.png"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav ">
          <Nav>
            {tabs.map((t) => (
              <NavLink
                key={`nav-item-${t.path}`}
                className="ml-4 nav-link"
                to={`${basePath}${t.path}`}
                exact={t.path === "/"}
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
          {tabs.map((t) => (
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
