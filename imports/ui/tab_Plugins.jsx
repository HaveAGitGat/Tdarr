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




var ButtonStyle = {
  display: 'inline-block',
}


// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {

    this.searchPlugins()

  }


  updatePlugins = () => {

    GlobalSettingsDB.upsert('globalsettings',
      {
        $set: {
          pluginSearchLoading: true,
        }
      }
    );



    Meteor.call('updatePlugins', ReactDOM.findDOMNode(this.refs.searchString).value.trim(), (error, result) => {



      //this.searchPlugins()


      setTimeout(this.searchPlugins, 5000);

    })



  }

  renderSearchButtons() {





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

          <Button variant="outline-dark" className="addFolderButton" onClick={this.searchPlugins} style={ButtonStyle}>Search</Button>
          <Button variant="outline-dark" className="addFolderButton" onClick={() => {

            render('', document.getElementById('searchResults'));
          }}  style={ButtonStyle}>Clear</Button>



      <Button variant="outline-dark" className="addFolderButton" onClick={this.updatePlugins} style={ButtonStyle}>Update community plugins</Button>
      <Button variant="outline-dark" className="addFolderButton" onClick={()=> window.open("https://github.com/HaveAGitGat/Tdarr_Plugins", "_blank")} style={ButtonStyle}>Create a plugin</Button>
          
          
          <Modal
          trigger={<Button variant="outline-dark" >i</Button>}
          modal
          closeOnDocumentClick
        >
          <div className="frame">
            <div className="scroll">

            
        <p></p>
        <p>Copy a community plugin id into the 'Plugin ID:' section of one of your libraries. Make sure the 'Community' checkbox is selected.</p>
        <p></p>
        <p></p>

        <p>For information on creating community and local plugins, have a look at:https://github.com/HaveAGitGat/Tdarr_Plugins</p>

            </div>
          </div>
        </Modal>
        </div>


      }

    });
  }



  searchPlugins = (event) => {

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

    Meteor.call('searchPlugins', ReactDOM.findDOMNode(this.refs.searchString).value.trim(), (error, result) => {

  

      if (result.length == 0) {

        render(<center>No results</center>, document.getElementById('searchResults'));
      } else {


        var data = result




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
        </div>, document.getElementById('searchResults'));




      }

    })








  }




  render() {
    return (
      <div className="containerGeneral">

<center>
        <header>
          <h1>Community Plugins</h1>
        </header>

</center>



       
        <p></p>

      

        <form onSubmit={this.searchPlugins}  >
        <center>


          <input type="text" className="searchBar" ref="searchString" placeholder="Search for plugins by any property. E.g.  h264,mp4"></input>

          </center>

          <p></p>
        
          <center>
          {this.renderSearchButtons()}
          </center>

        </form>





        <p></p>
        <p></p>



        <div id="searchResults">


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

