import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { GlobalSettingsDB } from '../api/tasks.js';
import ClipLoader from 'react-spinners/ClipLoader';
import ToggleButton from 'react-toggle-button';
import ReactDOM from 'react-dom';


var ButtonStyle = {
  display: 'inline-block',
}

const borderRadiusStyle = { borderRadius: 2 }

class App extends Component {

  constructor(props) {
    super(props);

  }


  handleChange = (event) => {


    var value = event.target.value

    if (event.target.name == "basePath") {



      if (value.charAt(0) !== "/") {

        value = "/" + value

      }

    }


    GlobalSettingsDB.upsert(

      "globalsettings",
      {
        $set: {
          [event.target.name]: value,
        }
      }
    );


  }


  updateResBoundaries = (event) => {

    var details = (event.target.name).split(",")
    var name = details[0]
    var type = details[1]
    var value = event.target.value

    console.log(name, type, value)



    var resBoundaries = GlobalSettingsDB.find({}, {}).fetch()[0].resBoundaries


    resBoundaries[name][type] = value



    GlobalSettingsDB.upsert(
      "globalsettings",
      {
        $set: {
          resBoundaries: resBoundaries,
        }
      }
    );


  }



  renderOptions = () => {


    var settings = this.props.globalSettings


    if (settings.length == 0) {

      return <center style={ButtonStyle}><ClipLoader

        sizeUnit={"px"}
        size={10}
        color={'white'}
        loading={true}
        style={ButtonStyle}
      /></center>

    } else {

      settings = settings[0]
      return <div>
        <p>Base URL (e.g. /base )</p>
        <input type="text" className="folderPaths" name="basePath" defaultValue={settings != undefined && settings.basePath != undefined ? settings.basePath : ""} onChange={this.handleChange}></input>

        <br />
        <br />
        <br />

        <span className="buttonTextSize mr-2" style={ButtonStyle}>Linux FFmpeg NVENC binary (3.4.5 for unRAID compatibility):</span>

        <div style={ButtonStyle}>
          <ToggleButton
            style={ButtonStyle}
            thumbStyle={borderRadiusStyle}
            trackStyle={borderRadiusStyle}
            value={settings.ffmpegNVENCBinary} onToggle={() => {

              GlobalSettingsDB.upsert('globalsettings',
                {
                  $set: {
                    ffmpegNVENCBinary: !settings.ffmpegNVENCBinary,
                  }
                }
              );
            }
            } />
        </div>

        <br />
        <br />
        <br />

        <span className="buttonTextSize mr-2" style={ButtonStyle}>Auto-cancel stalled workers:</span>

        <div style={ButtonStyle}>
          <ToggleButton
            style={ButtonStyle}
            thumbStyle={borderRadiusStyle}
            trackStyle={borderRadiusStyle}
            value={settings.workerStallDetector} onToggle={() => {

              GlobalSettingsDB.upsert('globalsettings',
                {
                  $set: {
                    workerStallDetector: !settings.workerStallDetector,
                  }
                }
              );
            }
            } />
        </div>

        <br />
        <br />
        <br />
        <p>Backup limit (default 30): </p>

        <input type="text" className="folderPaths" name="backupLimit" defaultValue={settings != undefined && settings.backupLimit != undefined ? settings.backupLimit : "30"} onChange={this.handleChange}></input>

        <br />
        <p>Resolution boundaries: </p>

        <div className="resGrid">

          <div></div>
          <div><p>Width Min</p></div>
          <div><p>Width Max</p></div>
          <div><p>Height Min</p></div>
          <div><p>Height Max</p></div>


          <div><p>480p</p></div>
          <div><input type="text" className="resBounds" name="res480p,widthMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res480p.widthMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res480p,widthMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res480p.widthMax : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res480p,heightMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res480p.heightMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res480p,heightMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res480p.heightMax : ""} onChange={this.updateResBoundaries}></input></div>


          <div><p>576p</p></div>
          <div><input type="text" className="resBounds" name="res576p,widthMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res576p.widthMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res576p,widthMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res576p.widthMax : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res576p,heightMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res576p.heightMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res576p,heightMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res576p.heightMax : ""} onChange={this.updateResBoundaries}></input></div>


          <div><p>720p</p></div>
          <div><input type="text" className="resBounds" name="res720p,widthMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res720p.widthMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res720p,widthMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res720p.widthMax : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res720p,heightMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res720p.heightMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res720p,heightMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res720p.heightMax : ""} onChange={this.updateResBoundaries}></input></div>


          <div><p>1080p</p></div>
          <div><input type="text" className="resBounds" name="res1080p,widthMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res1080p.widthMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res1080p,widthMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res1080p.widthMax : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res1080p,heightMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res1080p.heightMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res1080p,heightMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res1080p.heightMax : ""} onChange={this.updateResBoundaries}></input></div>


          <div><p>4KUHD</p></div>
          <div><input type="text" className="resBounds" name="res4KUHD,widthMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res4KUHD.widthMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res4KUHD,widthMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res4KUHD.widthMax : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res4KUHD,heightMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res4KUHD.heightMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res4KUHD,heightMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res4KUHD.heightMax : ""} onChange={this.updateResBoundaries}></input></div>


          <div><p>DCI4K</p></div>
          <div><input type="text" className="resBounds" name="resDCI4K,widthMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.resDCI4K.widthMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="resDCI4K,widthMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.resDCI4K.widthMax : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="resDCI4K,heightMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.resDCI4K.heightMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="resDCI4K,heightMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.resDCI4K.heightMax : ""} onChange={this.updateResBoundaries}></input></div>

          <div><p>8KUHD</p></div>
          <div><input type="text" className="resBounds" name="res8KUHD,widthMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res8KUHD.widthMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res8KUHD,widthMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res8KUHD.widthMax : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res8KUHD,heightMin" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res8KUHD.heightMin : ""} onChange={this.updateResBoundaries}></input></div>
          <div><input type="text" className="resBounds" name="res8KUHD,heightMax" defaultValue={settings != undefined && settings.resBoundaries != undefined ? settings.resBoundaries.res8KUHD.heightMax : ""} onChange={this.updateResBoundaries}></input></div>


        </div>

      </div>




    }
  }

  render() {



    return (





      <div className="containerGeneral">

        <div className="tabWrap" >


          <center>
            <header>
              <h1>Options</h1>
            </header>
          </center> <br />

          <div className="libraryContainer">

          <div className="optionsDiv">

            {this.renderOptions()}



          </div>
          </div>


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


