
import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {withRouter} from 'react-router-dom';




import TabTranscoding from '../ui/tab_Transcoding.jsx';
import TabSearch from '../ui/tab_Search.jsx';
import TabStatistics from '../ui/tab_Statistics.jsx';


import TabLibraries from './tab_Libraries.jsx';

import TabPlugins from '../ui/tab_Plugins.jsx';
import TabLog from '../ui/tab_Log.jsx';
import TabHelp from '../ui/tab_Help.jsx';
import TabDev from '../ui/tab_Dev.jsx';


import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import ReactLoading from 'react-loading';






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

  componentDidMount() {

  }



  tabToggle(tabIndex) {



    let tabs = this.state.tabs




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
         Tdarr Alpha 1.003
          </div>
          </div>

           {/* <p><ShowTheLocationWithRouter/></p> */}

           <Route path="/tdarr/" component={Transcoding} />

           <Route path="/stats/" exact component={Stats} />
           <Route path="/search/" exact component={Search} />

            <Route path="/" exact component={Dev} />


          <Route path="/settings/" component={Settings} />
          <Route path="/plugins/" component={Plugins} />
          <Route path="/logs/" component={Logs} />
          <Route path="/help/" component={Help} /> 
         
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






