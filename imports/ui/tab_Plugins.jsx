import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import ReactTable from "react-table";

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

  componentDidMount(){

    this.searchPlugins()

  }


  updatePlugins = () => {

    GlobalSettingsDB.upsert('globalsettings',
    {
      $set: {
        pluginSearchLoading:true,
      }
    }
    );
  


    Meteor.call('updatePlugins', ReactDOM.findDOMNode(this.refs.searchString).value.trim(), (error, result) => {})
  
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

        return <div style={ButtonStyle}>

<input type="button" className="addFolderButton" onClick={this.searchPlugins} value={"Search"} style={ButtonStyle}></input>
          <input type="button" className="addFolderButton" onClick={() => {

            render('', document.getElementById('searchResults'));
          }} value={"Clear"} style={ButtonStyle}></input>
             <input type="button" className="addFolderButton" onClick={this.updatePlugins} value={"Update community plugins"} style={ButtonStyle}></input>

        </div>


      }

    });
  }



  searchPlugins = (event) => {

    if(event){
    event.preventDefault();
  }

  GlobalSettingsDB.upsert('globalsettings',
  {
    $set: {
      pluginSearchLoading:true,
    }
  }
  );

    Meteor.call('searchPlugins', ReactDOM.findDOMNode(this.refs.searchString).value.trim(), (error, result) => {

      //console.log(result)

      if (result.length == 0) {

        render("No results", document.getElementById('searchResults'));
      } else {


        var data = result


            
        const columns = [{
            Header: 'id',
            accessor: 'id',
            width: 200,
      


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
      <header>
          <h1>Community Plugins</h1>
      </header>
      
        <p></p>
        <p>Copy a community plugin id into the 'Plugin ID:' section of one of your libraries. Make sure the 'Community' checkbox is selected.</p>
        <p></p>
        <p></p>

        <p>For information on creating community and local plugins, have a look at:https://github.com/HaveAGitGat/Tdarr_Plugins</p>
     
        <p></p>



        <form onSubmit={this.searchPlugins}  >
          <input type="text" className="searchBar" ref="searchString" placeholder="Search for plugins by any property. E.g.  h264,mp4" style={ButtonStyle} ></input>

          {this.renderSearchButtons()}

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

