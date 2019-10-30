import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import ReactTable from "react-table";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";

import ClipLoader from 'react-spinners/ClipLoader';
import { GlobalSettingsDB } from '../api/tasks.js';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';




var ButtonStyle = {
  display: 'inline-block',
}


// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {

    //this.searchPlugins()

    this.searchPlugins(event,'Community')

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
      setTimeout((event) => this.searchPlugins(event,'Community'), 5000);
    })
  }

  renderSearchButtons(pluginType) {

    return this.props.globalSettings.map((item, i) => {

      if (item.pluginSearchLoading == true) {

        return <ClipLoader

          sizeUnit={"px"}
          size={25}
          color={'#000000'}
          loading={true}
        />

      } else {

        return <div>

          <Button variant="outline-dark" className="addFolderButton" onClick={(event) => this.searchPlugins(event,pluginType)} style={ButtonStyle}>Search</Button>
          <Button variant="outline-dark" className="addFolderButton" onClick={() => {

            render('', document.getElementById('searchResults'+pluginType));
          }}  style={ButtonStyle}>Clear</Button>


        {pluginType =="Community"?<Button variant="outline-dark" className="addFolderButton" onClick={this.updatePlugins} style={ButtonStyle}>Update community plugins</Button>:null}
    
      
      <Button variant="outline-dark" className="addFolderButton" onClick={()=> window.open("https://github.com/HaveAGitGat/Tdarr_Plugins", "_blank")} style={ButtonStyle}>Create a plugin</Button>
          
          
          <Modal
          trigger={<Button variant="outline-dark" >i</Button>}
          modal
          closeOnDocumentClick
        >
          <div className="frame">
            <div className="scroll">

            <div className="modalText">
        <p></p>
        <p>Copy a community plugin id into the 'Plugin ID:' section of one of your libraries. Make sure the 'Community' checkbox is selected.</p>
        <p></p>
        <p></p>

        <p>For information on creating community and local plugins, have a look at:https://github.com/HaveAGitGat/Tdarr_Plugins</p>
        </div>
            </div>
          </div>
        </Modal>
        </div>


      }

    });
  }



  searchPlugins = (event,pluginType) => {

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

    var string = "searchString"+pluginType

    Meteor.call('searchPlugins', ReactDOM.findDOMNode(this.refs[string]).value.trim(),pluginType, (error, result) => {

  

      if (result[0].length == 0) {

        render(<center>No results</center>, document.getElementById('searchResults'+result[1]));
      } else {


        var data = result[0]

        const columns = [{
          Header: 'id',
          accessor: 'id',
          id: 'id',
          width: 70,
          accessor: d => <CopyToClipboard text={d.id}>
            <Button variant="outline-dark" >Copy id</Button>
          </CopyToClipboard>


        }, {

          Header: 'Name',
          accessor: 'Name',
          width: 200,

        }, {

          Header: 'Type',
          accessor: 'Type',
          width: 100,

        }, {

          Header: 'Description',
          accessor: 'Description',
          
          id: 'Description',
        //   accessor: d => {

        //     console.log("d.Description:"+d.Description)
        //       var desc = d.Description.split("\n")
        //         desc = desc.map( row => <p>{row}<br/></p> )

        //         console.dir("desc:"+desc)


        //         return desc

        //   },

        style: { 'white-space': 'unset' },


          getProps: (state, rowInfo, column) => {

            return {
             

              style: {
                background: rowInfo && rowInfo.row.Description.includes("BUG") ? 'red' : null,
              },
            }
          }

        }, {

          Header: 'Version',
          accessor: 'Version',
          width: 100,

        }, {

          Header: 'Stars',
          accessor: 'Stars',
          width: 100,

        }, {

          Header: 'Link',
          accessor: 'Link',
          width: 100,

        }


        ]

        render(<div>
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            pageSizeOptions={[10, 100, 1000]}
          />
        </div>, document.getElementById('searchResults'+result[1]));




      }

    })
  }




  render() {
    return (
      <div className="containerGeneral">


    <Tabs>
    <TabList>
      <Tab>Community</Tab>
      <Tab>Local</Tab>


    </TabList>

    <TabPanel>
      
    <p></p>

    
<form onSubmit={(event) => this.searchPlugins(event,'Community')}  >
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


    </TabPanel>

    <TabPanel>
    <p></p>

    
<form onSubmit={(event) => this.searchPlugins(event,'Local')}  >
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

    </TabPanel>

   
  </Tabs> 





  




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

