
import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {withRouter} from 'react-router-dom';

import TabStatistics from '../ui/tab_Statistics.jsx';

import TabLog from '../ui/tab_Log.jsx';
import TabSettings from '../ui/tab_Settings.jsx';
import TabTranscoding from '../ui/tab_Transcoding.jsx';
import TabHelp from '../ui/tab_Help.jsx';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import ReactLoading from 'react-loading';



function deActive() {

  // ReactDOM.findDOMNode(this.refs.textInput).setState({ active: false });



}

function Transcoding() {
  return  <TabTranscoding />;
}

function Search() {
  return  <p>Search!</p>;
}

function Stats() {
  //ReactDOM.findDOMNode(this.refs.System).setState({ active: false });
  return <TabStatistics />;
}



function Settings(obj) {

  // obj.state = {active: false};
  // const currentState = obj.state.active;
  // obj.setState({ active: !currentState });



  return  <TabSettings/>;
}

function Log() {
  // return <TabLog />;

  return <p>Coming soon</p>
}

function Help() {
  return  <TabHelp/>;
}


var divStyle = {
  opacity : 1,
};



class Nav extends Component {


  constructor(props) {
    super(props)
    this.state = {
      tabs: [
        {tab: { active: false, path: "/tdarr/", text: "Tdarr" }},
        { tab: {active: false, path: "/search", text: "Search"} },
        { tab: {active: false, path: "/", text: "Stats"} },
        { tab: { active: false, path: "/settings/", text: "Libraries" } },
        { tab: { active: false, path: "/log/", text: "Log" } },
        { tab: { active: false, path: "/help/", text: "Help" } },
      ],

     
    }
    this.tabToggle = this.tabToggle.bind(this)

    this.componentDidMount = this.componentDidMount.bind(this)
   
  }

  componentDidMount() {

  }



  tabToggle(tabIndex) {



    let tabs = this.state.tabs

    console.log("loc:"+this.props.location)



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

      
     {/* <div className={"wheel"} refs="wheel" style={divStyle}> */}
        {/* <ReactLoading type={"spin"} color={"#66ccff"} height={'100%'} width={'100%'} /> */}
        {/* </div> */}







        <div>
          <div className="topnav">

            {
              this.state.tabs.map((tab, index) => {
             return <Link key={tab.tab.path} to={tab.tab.path}  className={  tab.tab.active ? 'active' : ''} onClick={() => this.tabToggle(index)} >{tab.tab.text}</Link>

            }
              )
            }
          </div>

           {/* <p><ShowTheLocationWithRouter/></p> */}

           <Route path="/tdarr/" component={Transcoding} />

           <Route path="/" exact component={Stats} />
           <Route path="/search" exact component={Search} />
         
          <Route path="/settings/" component={Settings} />
          <Route path="/log/" component={Log} />
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






