import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import ReactDOM from "react-dom";
import { render } from "react-dom";

import SearchResults from "./searchResults.jsx";

import { Button } from "react-bootstrap";

import Modal from "reactjs-popup";

import ClipLoader from "react-spinners/ClipLoader";

import { GlobalSettingsDB } from "../api/database.js";

var ButtonStyle = {
  display: "inline-block",
};

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
  }

  renderSearchButtons() {
    return this.props.globalSettings.map((item, i) => {
      if (item.propertySearchLoading == true) {
        return (
          <ClipLoader
            sizeUnit={"px"}
            size={25}
            color={"white"}
            loading={true}
          />
        );
      } else {
        return (
          <div>
            <Button
              variant="outline-light"
              onClick={this.searchDB}
              style={ButtonStyle}
            >
              <span className="buttonTextSize">Search</span>
            </Button>
            {"\u00A0"}
            <Button
              variant="outline-light"
              onClick={() => {
                render("", document.getElementById("searchResults"));
              }}
              style={ButtonStyle}
            >
              <span className="buttonTextSize">Clear</span>
            </Button>
            {"\u00A0"}
            <Modal
              trigger={
                <Button variant="outline-light">
                  <span className="buttonTextSize">i</span>
                </Button>
              }
              modal
              closeOnDocumentClick
            >
              <div className="modalContainer">
                <div className="frame">
                  <div className="scroll">
                    <div className="modalText">
                      <p>Search for files based on hundreds of properties</p>

                      <p>
                        Codec suggestions:
                        h264,hevc,mpeg4,mpeg2video,vp9,vp8,theora,aac,ac3,dts
                      </p>
                      <p>
                        Other suggestions: subtitle,mp4,mkv,shrek,stereo,1080p
                      </p>

                      <p>
                        Search for files with multiple properties by separating
                        search terms with a comma. E.g.:
                      </p>

                      <p>shrek,aac,h264,subtitle</p>

                      <p></p>

                      <p>
                        Create a 30 second sample using the '✄' button. The
                        sample will be placed in the 'Samples' folder in the
                        Tdarr documents/data folder with suffix '- TdarrSample'.
                        Use the sample to test plugins/transcode settings and to
                        help when reporting bugs.
                      </p>

                      <p></p>

                      <p>
                        To return a list of all files, leave the search bar
                        empty.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        );
      }
    });
  }

  searchDB = (event) => {
    if (event) {
      event.preventDefault();
    }

    GlobalSettingsDB.upsert("globalsettings", {
      $set: {
        propertySearchLoading: true,
      },
    });

    Meteor.call(
      "searchDB",
      ReactDOM.findDOMNode(this.refs.searchString).value.trim(),
      (error, result) => {
        render(
          <div className="libraryContainer">
            <SearchResults results={result} />
          </div>,
          document.getElementById("searchResults")
        );
      }
    );
  };

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
        <form onSubmit={this.searchDB}>
          <center>
            <input
              type="text"
              className="searchBar"
              ref="searchString"
              placeholder="Search for files by any property. E.g. h264,aac,test.mp4,mkv"
              style={ButtonStyle}
            ></input>
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
  Meteor.subscribe("GlobalSettingsDB");

  return {
    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),
  };
})(App);
