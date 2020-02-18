import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";

import ClipLoader from 'react-spinners/ClipLoader';
import { GlobalSettingsDB } from '../../api/tasks.js';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import PluginCategory from './PluginCategory.jsx'





import General from './pluginTemplates/General.jsx';



import PluginGuide from './pluginTemplates/PluginGuide.jsx';




var ButtonStyle = {
  display: 'inline-block',
}


// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pluginsStored: [],
      pluginsStoredFiltered:[],
    };

  }

  componentDidMount() {

    this.loadPlugins()

  }

  loadPlugins = () => {

    Meteor.call('searchPlugins', '', 'Local', (error, result) => {
      this.setState({
        pluginsStored: result[0]
      });

    })

    Meteor.call('searchPlugins', '', 'Community', (error, result) => {

      var arr = this.state.pluginsStored
      arr = arr.concat(result[0])
      this.setState({
        pluginsStored: arr,
        pluginsStoredFiltered: arr
      });

    })

  }


  updatePlugins = () => {

    GlobalSettingsDB.upsert('globalsettings',
      {
        $set: {
          pluginSearchLoading: true,
        }
      }
    );



    Meteor.call('updatePlugins', ReactDOM.findDOMNode(this.refs.searchStringCommunity).value.trim(), (error, result) => {
      //setTimeout((event) => this.searchPlugins(event, 'Community'), 5000);
    })
  }

  renderSearchButtons(pluginType) {

    return this.props.globalSettings.map((item, i) => {

      if (item.pluginSearchLoading == true) {

        return <ClipLoader

          sizeUnit={"px"}
          size={25}
          color={'white'}
          loading={true}
        />

      } else {

        return <div>


          <Button variant="outline-light" onClick={(event) => this.searchPlugins(event, pluginType)} style={ButtonStyle}><span className="buttonTextSize">Search</span></Button>{'\u00A0'}



          {pluginType == "Community" ? <Button variant="outline-light" onClick={this.updatePlugins} style={ButtonStyle}><span className="buttonTextSize">Update community plugins</span></Button> : null}


          {'\u00A0'}<Button variant="outline-light" onClick={() => window.open("https://github.com/HaveAGitGat/Tdarr_Plugins", "_blank")} style={ButtonStyle}><span className="buttonTextSize">Create a plugin</span></Button>


          {'\u00A0'}<Modal
            trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
            modal
            closeOnDocumentClick
          >
            <div className="modalContainer">
              <div className="frame">
                <div className="scroll">


                  <div className="modalText">
                    <p></p>
                    <p>Copy a community plugin id into the 'Plugin ID:' section of one of your libraries. Make sure the 'Community' checkbox is selected.</p>
                    <p></p>
                    <p></p>

                    <p>For information on creating community and local plugins, have a look at:https://github.com/HaveAGitGat/Tdarr_Plugins</p>

                    <p>Community plugins are stored in 'Tdarr\Plugins\Community'. Any modifications will be overwritten when the plugins are updated.</p>
                    <p>Local plugins are stored in 'Tdarr\Plugins\Local'.</p>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>


      }

    });
  }



  searchPlugins = (event, pluginType) => {


    console.log('here')

    try {

      if (event) {
        event.preventDefault();
      }


      // GlobalSettingsDB.upsert('globalsettings',
      //   {
      //     $set: {
      //       pluginSearchLoading: true,
      //     }
      //   }
      // );


      var string = "searchString" + pluginType
      var searchTerm = ReactDOM.findDOMNode(this.refs[string]).value.trim()

  
      var result = this.state.pluginsStored.filter(row => {
        var string = JSON.stringify(row).toLowerCase()
        if (string.includes(searchTerm.toLowerCase())) {
          return true
        }
        return false
      })




      this.setState({
        pluginsStoredFiltered:result
      })




      // GlobalSettingsDB.upsert('globalsettings',
      //   {
      //     $set: {
      //       pluginSearchLoading: false,
      //     }
      //   }
      // );


      

    } catch (err) {
      console.log(err)
      // GlobalSettingsDB.upsert('globalsettings',
      //   {
      //     $set: {
      //       pluginSearchLoading: false,
      //     }
      //   }
      // );

     
    }

    
  }




  render() {
    return (

      <div className="containerGeneral">
        <div className="tabWrap" >


          <Tabs selectedIndex={this.props.globalSettings != undefined && this.props.globalSettings[0] != undefined && this.props.globalSettings[0].selectedPluginTab != undefined ? this.props.globalSettings[0].selectedPluginTab : 0} onSelect={tabIndex => {

            GlobalSettingsDB.upsert('globalsettings',
              {
                $set: {
                  selectedPluginTab: tabIndex,
                }
              }
            );
          }}>
            <TabList>
              <Tab ><p>Community</p></Tab>
              <Tab ><p>Local</p></Tab>
              <Tab><p>Plugin Creator</p></Tab>


            </TabList>

            <TabPanel><div className="tabContainer" >

              <br />
              <br />


              <form onSubmit={(event) => this.searchPlugins(event, 'Community')}  >
                <center>


                  <input type="text" className="searchBar" ref="searchStringCommunity" placeholder="Search for plugins by any property. E.g.  h264,mp4"></input>

                </center>

                <p></p>

                <center>
                  {this.renderSearchButtons('Community')}
                </center>

              </form>

              <p></p>
              <p></p>

              <PluginCategory pluginType={'Community'} pluginsStoredFiltered={this.state.pluginsStoredFiltered}/>


            </div>
            </TabPanel>

            <TabPanel><div className="tabContainer" >
              <br />
              <br />


              <form onSubmit={(event) => this.searchPlugins(event, 'Local')}  >
                <center>


                  <input type="text" className="searchBar" ref="searchStringLocal" placeholder="Search for plugins by any property. E.g.  h264,mp4"></input>

                </center>

                <p></p>

                <center>
                  {this.renderSearchButtons('Local')}
                </center>

              </form>

              <p></p>
              <p></p>


              <PluginCategory pluginType={'Local'} pluginsStoredFiltered={this.state.pluginsStoredFiltered}/>


            </div>


            </TabPanel>


            <TabPanel><div className="tabContainer" >


              <div className="libraryContainer2">


                <div className="pluginTabGrid-container">

                  <div className="pluginTabGrid-itemLeft">

                    <br />
                    <br />
                    <br />

                    <p onClick={() => {
                      GlobalSettingsDB.upsert(
                        "globalsettings",
                        {
                          $set: {
                            navSelectedPluginCreatorItem: "navPluginGuide",
                          }
                        }
                      );
                    }} className={this.props.globalSettings != undefined && this.props.globalSettings[0] != undefined && this.props.globalSettings[0].navSelectedPluginCreatorItem == "navPluginGuide" ? 'selectedNav' : 'unselectedNav'}>Guide</p>


                    <br />

                    <p onClick={() => {
                      GlobalSettingsDB.upsert(
                        "globalsettings",
                        {
                          $set: {
                            navSelectedPluginCreatorItem: "navGeneral",
                          }
                        }
                      );
                    }} className={this.props.globalSettings != undefined && this.props.globalSettings[0] != undefined && this.props.globalSettings[0].navSelectedPluginCreatorItem == "navGeneral" ? 'selectedNav' : 'unselectedNav'}>Create</p>







                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />



                  </div>




                  <div className="pluginTabGrid-itemRight">

                    <div className={this.props.globalSettings != undefined && this.props.globalSettings[0] != undefined && this.props.globalSettings[0].navSelectedPluginCreatorItem == "navPluginGuide" ? '' : 'd-none'}>
                      <PluginGuide />
                    </div>





                    <div className={this.props.globalSettings != undefined && this.props.globalSettings[0] != undefined && this.props.globalSettings[0].navSelectedPluginCreatorItem == "navGeneral" ? '' : 'd-none'}>
                      <General />
                    </div>



                  </div>


                </div>


              </div>
            </div>
            </TabPanel>






          </Tabs>




        </div>
      </div>
    );
  }
}

export default withTracker(() => {

  Meteor.subscribe('GlobalSettingsDB');


  return {

    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),

  };
})(App);

