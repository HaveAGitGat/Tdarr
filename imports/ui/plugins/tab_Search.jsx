import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import SearchResults from '../searchResults.jsx'
import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";
import ClipLoader from 'react-spinners/ClipLoader';
import { GlobalSettingsDB } from '../../api/tasks.js';
import classnames from 'classnames';

class App extends Component {

  constructor(props) {
    super(props);

  }

  renderSearchButtons = () => {
    return <>
      <Button variant="secondary" onClick={this.searchDB}><span className="buttonTextSize">Search</span></Button>{'\u00A0'}
      <Button variant="secondary" onClick={() => {

        render('', document.getElementById('searchResults'));
      }}><span className="buttonTextSize">Clear</span></Button>{'\u00A0'}
      <Modal
        trigger={<Button variant="secondary" ><span className="buttonTextSize">i</span></Button>}
        modal
        closeOnDocumentClick
      >

        <div className="modalContainer">
          <div className="frame">
            <div className="scroll">


              <div className="modalText">
                <p>Search for files based on hundreds of properties</p>

                <p>Codec suggestions: h264,hevc,mpeg4,mpeg2video,vp9,vp8,theora,aac,ac3,dts</p>
                <p>Other suggestions: subtitle,mp4,mkv,shrek,stereo,1080p</p>

                <p>Search for files with multiple properties by separating search terms with a comma. E.g.:</p>

                <p>shrek,aac,h264,subtitle</p>

                <p>Create a 30 second sample using the '✄' button. The sample will be placed in the 'Samples' folder in the Tdarr documents/data folder with suffix '- TdarrSample'. Use the sample to test plugins/transcode settings and to help when reporting bugs.</p>

                <p>Tip: Use the table headers to sort & filter files</p>

                <p>To return a list of all files, leave the search bar empty.</p>

              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
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
      render(<SearchResults results={result} />, document.getElementById('searchResults'));
    })
  }
  

  render() {
    const isLoading = this.props.globalSettings.find(gs => gs.propertySearchLoading);

    return (
      <div className="bg-dark pb-5">
        <form onSubmit={this.searchDB} className="container py-5" >
          <center>
            <div className="input-group px-3">
              <input type="text" className="form-control rounded-0" ref="searchString" placeholder="Search for files by any property. E.g. h264,aac,test.mp4,mkv"></input>
              <div className="input-group-append">
                {this.renderSearchButtons()}
              </div>
            </div>

          </center>
        </form>

        {isLoading && (
          <center className="pt-5">
            <ClipLoader
              sizeUnit={"px"}
              size={25}
              color={'white'}
              loading={true}
            />
          </center>
        )}

        <div className={classnames({ 'invisible': isLoading })}>
          <div className="" id="searchResults" ref="searchResults"></div>
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


