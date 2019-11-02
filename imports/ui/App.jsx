
import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {withRouter} from 'react-router-dom';

import {GlobalSettingsDB} from '../api/tasks.js';




import TabTranscoding from './transcoding/tab_Transcoding.jsx';
import TabSearch from './plugins/tab_Search.jsx';
import TabStatistics from '../ui/tab_Statistics.jsx';


import TabLibraries from './libraries/tab_Libraries.jsx';

import TabPlugins from './plugins/tab_Plugins.jsx';
import TabLog from '../ui/tab_Log.jsx';
import TabHelp from '../ui/tab_Help.jsx';
import TabDev from '../ui/tab_Dev.jsx';


import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import ReactLoading from 'react-loading';

import { render } from 'react-dom';






function Transcoding() {
  return  <TabTranscoding />;
}

function Search() {
  return   <TabSearch />;
}

function Stats() {
  //ReactDOM.findDOMNode(this.refs.System).setState({ active: false });
  return <TabStatistics />;
}



function Settings(obj) {

  // obj.state = {active: false};
  // const currentState = obj.state.active;
  // obj.setState({ active: !currentState });



  return  <TabLibraries/>;
}


function Plugins() {
  return <TabPlugins/>;

}

function Logs() {
   return <TabLog />;

}

function Help() {
  return  <TabHelp/>;
}

function Dev() {
  return  <TabDev/>;
}


var divStyle = {
  opacity : 1,
};



class Nav extends Component {


  constructor(props) {
    super(props)
    this.state = {
      tabs: [
        { tab: { active: false, path: "/tdarr/", text: "Tdarr" }},
        { tab: {active: false, path: "/search", text: "Search"} },
        { tab: {active: false, path: "/stats", text: "Stats"} },
        { tab: { active: false, path: "/settings/", text: "Libraries" } },
        { tab: { active: false, path: "/plugins/", text: "Plugins" } },
        { tab: { active: false, path: "/logs/", text: "Logs" } },
        { tab: { active: false, path: "/help/", text: "Help" } },

        { tab: {active: false, path: "/", text: "Dev"} },
      ],

     
    }
    this.tabToggle = this.tabToggle.bind(this)

    this.componentDidMount = this.componentDidMount.bind(this)
   
  }

  componentDidMount = () => {

    
   Meteor.subscribe('GlobalSettingsDB', () => {


    var res = GlobalSettingsDB.find({}).fetch()
    var basePath =res[0].basePath

    this.setState({

     tabs: [
      { tab: { active: false, path: basePath+"/tdarr/", text: "Tdarr" }},
      { tab: {active: false, path: basePath+"/search", text: "Search"} },
      { tab: {active: false, path: basePath+"/stats", text: "Stats"} },
      { tab: { active: false, path: basePath+"/settings/", text: "Libraries" } },
      { tab: { active: false, path: basePath+"/plugins/", text: "Plugins" } },
      { tab: { active: false, path: basePath+"/logs/", text: "Logs" } },
      { tab: { active: false, path: basePath+"/help/", text: "Help" } },
      { tab: {active: false, path: basePath+"/", text: "Dev"} },
    ],
    })


         


 });


  }



  tabToggle(tabIndex) {



    var tabs = this.state.tabs

    tabs.map((tab, index) => {
      if (index !== tabIndex) {



        tab.tab.active = false

      }
    })
    tabs[tabIndex].tab.active = true


    this.setState(tabs)
  }



  render() {



    return (

      

      <Router>
        {}

        <link rel="icon" sizes="16x16 32x32" href="/favicon.png?v=2"/>
      
     {/* <div className={"wheel"} refs="wheel" style={divStyle}> */}
        {}







        <div>
          <div className="topnav">

            {
              this.state.tabs.map((tab, index) => {
             return <Link key={tab.tab.path} to={tab.tab.path}  className={  tab.tab.active ? 'active' : ''} onClick={() => this.tabToggle(index)} >{tab.tab.text}</Link>

            }
              )
            }

 <div className="versionInfo">
         Tdarr Alpha 1.0053
          </div>
          </div>


            <Route path={this.state.tabs[0].tab.path} component={Transcoding} />
            <Route path={this.state.tabs[1].tab.path} exact component={Search} />
            <Route path={this.state.tabs[2].tab.path} exact component={Stats} />
            <Route path={this.state.tabs[3].tab.path} component={Settings} />
            <Route path={this.state.tabs[4].tab.path} component={Plugins} />
           <Route path={this.state.tabs[5].tab.path} component={Logs} />
           <Route path={this.state.tabs[6].tab.path} component={Help} /> 
           <Route path={this.state.tabs[7].tab.path} exact component={Dev} />
         
        </div>


       </Router>

  
    );
  }
}


export default function AppRouter() {



  return (


    <Nav/>

  );
}






