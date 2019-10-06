import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import ItemButton from './item_Button.jsx'
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

  renderSearchButtons() {





    return this.props.globalSettings.map((item, i) => {

      if (item.propertySearchLoading == true) {

        return <ClipLoader

          sizeUnit={"px"}
          size={25}
          color={'#000000'}
          loading={true}
        />

      } else {

        return <div >

          <Button variant="outline-dark" onClick={this.searchDB}  style={ButtonStyle}>Search</Button>
          <Button variant="outline-dark" onClick={() => {

            render('', document.getElementById('searchResults'));
          }}  style={ButtonStyle}>Clear</Button>
           <Modal
          trigger={<Button variant="outline-dark" >i</Button>}
          modal
          closeOnDocumentClick
        >
          <div className="frame">
            <div className="scroll">

            
             <p>Search for files based on hundreds of properties</p>
              
                <p>Codec suggestions: h264,hevc,mpeg4,mpeg2video,vp9,vp8,theora,aac,ac3,dts</p>
                <p>Other suggestions: subtitle,mp4,mkv,shrek,stereo,1080p</p>

             <p>Search for files with multiple properties by separating search terms with a comma. E.g.:</p>

            <p>shrek,aac,h264,subtitle</p>

            

            </div>
          </div>
        </Modal>

        </div>


      }

    });
  }


  searchDB = (event) => {

    if (event) {
      event.preventDefault();
    }

    GlobalSettingsDB.upsert('globalsettings',
      {
        $set: {
          propertySearchLoading: true,
        }
      }
    );


    Meteor.call('searchDB', ReactDOM.findDOMNode(this.refs.searchString).value.trim(), (error, result) => {



      //console.log(result)

      if (result.length == 0) {

        render(<center>No results</center>, document.getElementById('searchResults'));
      } else {


        var results = result.map((row, i) => (

          <tr>
            <td>{row.file}</td> <td> {this.renderBumpButton(row.file)}</td> <td>{this.renderRedoButton(row.file, 'TranscodeDecisionMaker')}</td> <td>{this.renderRedoButton(row.file, 'HealthCheck')}</td><td>{this.renderInfoButton(row)}</td>
          </tr>

        ));

        render(

          <table className="pluginTable">   <tbody>
            <tr>
              <th>File</th>
              <th>Bump</th>
              <th>Transcode</th>
              <th>Health check</th>
              <th>Info</th>


            </tr>

            {results}

          </tbody></table>


          , document.getElementById('searchResults'));

      }

    })








  }

  renderBumpButton(file) {
    var obj = {
      createdAt: new Date()
    }


    return <ItemButton file={file} obj={obj} symbol={'↑'} />

  }

  renderRedoButton(file, mode) {


    var obj = {
      [mode]: "Not attempted",
      processingStatus: false,
      createdAt: new Date(),
    }


    return <ItemButton file={file} obj={obj} symbol={'↻'} />
  }

  renderIgnoreButton(file, mode) {

    var obj = {
      [mode]: "Ignored",
      processingStatus: false,
      createdAt: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'Ignore'} />


  }

  renderInfoButton(row) {



    var result = []

    eachRecursive(row)


    function eachRecursive(obj) {
      for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
          eachRecursive(obj[k]);
        } else {

          result.push(k + ":" + obj[k])


        }
      }
    }

    // Object.keys(row).forEach(function (key) {

    //   result.push(`${[key]}:${row[key]}`)

    // });

    result = result.map((row, i) => (

      <p>{row}</p>

    ));

    return <Modal
      trigger={<Button variant="outline-dark" >i</Button>}
      modal
      closeOnDocumentClick
    >
      <div className="frame">
        <div className="scroll">
          {result}

        </div>
      </div>
    </Modal>



  }



  render() {
    return (
      <div className="containerGeneral">

        <center>
        <header>
          <h1>Search </h1>       
        </header>
        </center>

        <p></p>

       
        <p></p>
        <form onSubmit={this.searchDB}  >

        <center>

          <input type="text" className="searchBar" ref="searchString" placeholder="Search for files by any property. E.g. h264,aac,test.mp4,mkv" style={ButtonStyle} ></input>

          </center>

          <center>
      
          <p></p>

          {this.renderSearchButtons()}

          </center>


        </form>




        <div id="searchResults" ref="searchResults"></div>


        <p></p>
        <p></p>





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


