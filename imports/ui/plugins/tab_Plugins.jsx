import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import ReactTable from "react-table";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";

import ClipLoader from 'react-spinners/ClipLoader';
import { GlobalSettingsDB } from '../../api/tasks.js';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';





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
        pluginsStored: arr
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
          <Button variant="outline-light" onClick={() => {

            render('', document.getElementById('searchResults' + pluginType));
          }} style={ButtonStyle}><span className="buttonTextSize">Clear</span></Button>{'\u00A0'}


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

    try {

      if (event) {
        event.preventDefault();
      }


      GlobalSettingsDB.upsert('globalsettings',
        {
          $set: {
            pluginSearchLoading: true,
          }
        }
      );


      var string = "searchString" + pluginType
      var searchTerm = ReactDOM.findDOMNode(this.refs[string]).value.trim()

      var result = this.state.pluginsStored.filter(row => {

        var string = JSON.stringify(row).toLocaleLowerCase()


        if (row.source == pluginType && string.includes(searchTerm.toLocaleLowerCase())) {

          return true
        }

        return false

      })



      if (result.length == 0) {

        render(<center><p>No results</p></center>, document.getElementById('searchResults' + pluginType));
      } else {


        var data = result
        var pluginType = pluginType

        const columns = [{
          Header: () => (
            <div className="pluginTableHeader">
              <p>id</p>
            </div>
          ),
          id: 'id',
          width: 80,
          accessor: d => <CopyToClipboard text={d.id}>
            <Button variant="outline-light" ><span className="buttonTextSize">Copy id</span></Button>
          </CopyToClipboard>,


        }, {

          Header: () => (
            <div className="pluginTableHeader">
              <p>Stage</p>
            </div>
          ),
          accessor: 'Stage',
          width: 100,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            }
          }

        }, {

          Header: () => (
            <div className="pluginTableHeader">
              <p>Type</p>
            </div>
          ),
          accessor: 'Type',
          width: 100,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            }
          }

        }, {

          Header: () => (
            <div className="pluginTableHeader">
              <p>Operation</p>
            </div>
          ),
          accessor: 'Operation',
          width: 100,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            }
          }

        }, {

          Header: () => (
            <div className="pluginTableHeader">
              <p>Name</p>
            </div>
          ),
          accessor: 'Name',
          width: 200,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            }
          }

        },

        {

          Header: () => (
            <div className="pluginTableHeader">
              <p>Description</p>
            </div>
          ),
          accessor: 'Description',

          id: 'Description',
          style: { 'white-space': 'unset' },


          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
                background: rowInfo && rowInfo.row.Description.includes("BUG") ? '#c72c53' : rowInfo && rowInfo.row.Description.includes("TESTING") ? '#ffa500' : null,
              },
            }
          }

        },
        {
          Header: () => (
            <div className="pluginTableHeader">
              <p>Inputs</p>
            </div>
          ),
          id: 'Inputs',
          width: 80,
          accessor: row => {

            if (row.Inputs == undefined) {
              return <p></p>
            }

            var variableArray = row.Inputs


            var desc = variableArray.map(row => {

              var tooltip = row.tooltip.split('\\n')



              for (var i = 0; i < tooltip.length; i++) {

                var current = i

                if (tooltip[i].includes('Example:') && i + 1 < tooltip.length) {
                  tooltip[i + 1] = <div className="toolTipHighlight"><p>{tooltip[i + 1]}</p></div>
                  i++
                }

                tooltip[current] = <p>{tooltip[current]}</p>
              }

              return <div><Modal
                trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
                modal
                closeOnDocumentClick
              >
                <div className="modalContainer">
                  <div className="frame">
                    <div className="scroll">

                      <div className="modalText">
                        <p>Usage:</p>
                        <p></p>
                        <p></p>
                        {tooltip}


                      </div>
                    </div>
                  </div>
                </div>
              </Modal><span><p>{row.name}</p></span></div>
            })

            return desc

          },
          style: { 'whiteSpace': 'unset' }
        },
        {

          Header: () => (
            <div className="pluginTableHeader">
              <p>Version</p>
            </div>
          ),
          accessor: 'Version',
          width: 100,

          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            }
          }

        }, {
          show: pluginType == "Local" ? true : false,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Delete</p>
            </div>
          ),
          accessor: '',
          id: 'Delete',
          width: 70,
          accessor: d => <Button variant="outline-light" onClick={() => {

          

            var arr = this.state.pluginsStored

            var idx = arr.findIndex(row => row.id == d.id)

            if(idx != -1){

               arr.splice(idx,1)

            }
           
            this.setState({
              pluginsStored: arr
            });


            Meteor.call('deletePlugin', d.id, (error, result) => {
              if (result === true) {

                alert('Plugin deleted successfully!')

              } else {

                alert('Error deleting plugin. Please delete manually.')

              }

              this.searchPlugins(event, 'Local')

            })
          }} ><span className="buttonTextSize">X</span></Button>,


        }, {

          show: pluginType == "Community" ? true : false,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Stars</p>
            </div>
          ),
          accessor: 'Stars',
          width: 100,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            }
          }

        }, {
          show: pluginType == "Community" ? true : false,
          Header: () => (
            <div className="pluginTableHeader">
              <p>Link</p>
            </div>
          ),
          id: 'Link',
          accessor: row => <p><a href={row.Link} onClick={(e) => {
            e.preventDefault();
            window.open(row.Link, "_blank")
          }}>{row.Link}</a></p>,
          width: 100,
          getProps: (state, rowInfo, column) => {
            return {
              style: {
                color: "#e1e1e1",
                fontSize: "14px",
              },
            }
          }

        }


        ]

        render(<div className="libraryContainer" >
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={100}
            pageSizeOptions={[10, 100, 1000]}
          />
        </div>, document.getElementById('searchResults' + pluginType));






      }

      GlobalSettingsDB.upsert('globalsettings',
      {
        $set: {
          pluginSearchLoading: false,
        }
      }
    );

    } catch (err) {
      GlobalSettingsDB.upsert('globalsettings',
        {
          $set: {
            pluginSearchLoading: false,
          }
        }
      );
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



              <div id="searchResultsCommunity">

              </div>

            </div></TabPanel>

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



              <div id="searchResultsLocal">
              </div>



            </div></TabPanel>


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








                    {/* 
                    <div className={this.props.globalSettings != undefined && this.props.globalSettings[0] != undefined && this.props.globalSettings[0].navSelectedPluginCreatorItem == "navTranscode" ? '' : 'd-none'}>
                      <Transcode />
                    </div>


                    <div className={this.props.globalSettings != undefined && this.props.globalSettings[0] != undefined && this.props.globalSettings[0].navSelectedPluginCreatorItem == "navRemuxContainer" ? '' : 'd-none'}>
                      <RemuxContainer />
                    </div> */}







                  </div>


                </div>


















              </div>
            </div></TabPanel>






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

