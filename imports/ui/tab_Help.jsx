import React, { Component } from 'react';

import { Meteor } from 'meteor/meteor';

import { Button } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


import { render } from 'react-dom';
import ReactDOM from 'react-dom'












export default class App extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {



    this.interval = setInterval(() => this.loadText(), 1000);


  }



  loadText = () => {


    Meteor.call('readHelpCommandText', function (error, result) {

      var ffmpegText = result[0].split("\n").map(row => <span><p>{row}</p><br /></span>)
      var handbrakeText = result[1].split("\n").map(row => <span><p>{row}</p><br /></span>)

      try {
        render(ffmpegText, document.getElementById('FFmpegHelp'));
      } catch (err) { }

      try {
        render(handbrakeText, document.getElementById('HandBrakeHelp'));
      } catch (err) { }

    })




  }



  runHelpCommand = (mode, input ) => {

    var text = ReactDOM.findDOMNode(this.refs[input]).value.trim()


    Meteor.call('runHelpCommand', mode, text, function (error, result) { })


  }

  render() {



    return (



      <div className="containerGeneral">
        <center>
          <header>
            <h1>Help</h1>
          </header>
        </center>

        <br></br>
        <br></br>

        <center>


          <p>Join us!</p>

          </center>

          <center>


            <table>

            <tbody>
      <tr>
        <td><div className="iconContainer">
            <img src={"/images/icons/D.svg"} onClick={() => window.open("https://discord.gg/GF8X8cq", "_blank")} alt='icon' height="60" width="60" />
          </div></td>
        <td><div className="iconContainer">
            <img src={"/images/icons/G.png"} onClick={() => window.open("https://github.com/HaveAGitGat/Tdarr/wiki", "_blank")} alt='icon' height="60" width="60" />
          </div>

</td>
        <td>       <div className="iconContainer">
            <img src={"/images/icons/R.png"} onClick={() => window.open("https://www.reddit.com/r/Tdarr", "_blank")} alt='icon' height="60" width="60" />
          </div></td>
      </tr>

            </tbody>
            </table>


          </center>


          <br></br>
          <br></br>








       

        <br />

        <div className="tabWrap" >

<p>Terminal:</p>
        <Tabs>
          <TabList>
            <Tab><p>FFmpeg</p></Tab>
            <Tab><p>HandBrake</p></Tab>
          </TabList>

          <TabPanel><div className="tabContainer" >





            <form onSubmit={(event) => {
                
              event.preventDefault();
              this.runHelpCommand("ffmpeg", "ffmpegCommand")}}  >

              <center>

              <p>FFmpeg</p><input type="text" className="folderPaths" ref="ffmpegCommand" defaultValue={"--help"}></input>
                <p></p>
                <Button variant="outline-light" onClick={() => this.runHelpCommand("ffmpeg", "ffmpegCommand")} ><span className="buttonTextSize">Run</span></Button>
              </center>



            </form>


            <div id="FFmpegHelp"></div>
         </div> </TabPanel>
          <TabPanel><div className="tabContainer" >


            <form onSubmit={() => {
              event.preventDefault();
              this.runHelpCommand("handbrake", "handbrakeCommand")}}  >

              <center>
              <p>HandBrakeCLI</p><input type="text" className="folderPaths" ref="handbrakeCommand" defaultValue={"--help"}></input>
                <p></p>
                <Button variant="outline-light" onClick={() => this.runHelpCommand("handbrake", "handbrakeCommand")} ><span className="buttonTextSize">Run</span></Button>

              </center>

            </form>

            <div id="HandBrakeHelp"></div>

         </div> </TabPanel>
        </Tabs>
        </div>




      </div>

    );
  }
}
