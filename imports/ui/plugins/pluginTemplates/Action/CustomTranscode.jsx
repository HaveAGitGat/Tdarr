import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Checkbox from '@material-ui/core/Checkbox';





var ButtonStyle = {
  display: 'inline-block',
}



export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      handBrakeMode: true,
      FFmpegMode: false

    };


  }


  addAction = () => {


    var preset = ReactDOM.findDOMNode(this.refs.preset).value

    var container = ReactDOM.findDOMNode(this.refs.container).value

    if (container.charAt(0) !== ".") {

      container = "." + container

    }


    var obj = {
      name: 'Custom transcode',
      description: `Files will be transcoded using custom arguments`,
      preset: `'${preset}'`,
      container: `'${container}'`,
      handBrakeMode: this.state.handBrakeMode,
      FFmpegMode: this.state.FFmpegMode,
      processFile: true,
      infoLog:'""',

    }


    this.props.setAction(obj)




  }



  render() {



    return (





      <div >

        <br />

        <center><p>Custom transcode</p> </center>


        <br/>

<p>This action has no built-in filter. It relies on the filters set above.</p>

<br/>


        <center>  <p>HandBrake<Checkbox checked={this.state.handBrakeMode} onChange={event => {

          this.setState({
            handBrakeMode: !this.state.handBrakeMode,
          })

          if (this.state.FFmpegMode == true) {

            this.setState({
              FFmpegMode: false,
            })

          }


        }} />FFmpeg<Checkbox checked={this.state.FFmpegMode} onChange={event => {

          this.setState({
            FFmpegMode: !this.state.FFmpegMode,
          })

          if (this.state.handBrakeMode == true) {

            this.setState({
              handBrakeMode: false,
            })

          }


        }} /></p></center>

        <br />
        <br />
        <br />

        <p>When using FFmpeg, you need to separate the input and output parameters with a comma. FFmpeg Examples:</p>

        <p>-r 1,-r 24</p>
        <p>,-sn -c:v copy -c:a copy</p>
        <p>,-c:v lib265 -crf 23 -ac 6 -c:a aac -preset veryfast</p>
        <p>,-map 0 -c copy -c:v libx265 -c:a aac</p>
        <p>-c:v h264_cuvid,-c:v hevc_nvenc -preset slow -c:a copy</p>

        <p>Please see the following for help with creating FFmpeg commands:</p>

        <p><a href="" onClick={(e) => { e.preventDefault(); window.open("https://opensource.com/article/17/6/ffmpeg-convert-media-file-formats", "_blank"); }}>https://opensource.com/article/17/6/ffmpeg-convert-media-file-formats</a></p>


        <br />
        <br />
        <br />


        <p>HandBrake examples:</p>

        <p>-e x264 -q 20 -B</p>
        <p>-Z "Very Fast 1080p30"</p>
        <p>-Z "Fast 1080p30" -e nvenc_h265 </p>
        <p>-Z "Very Fast 1080p30" --all-subtitles --all-audio</p>
        <p>-Z "Very Fast 480p30"</p>
        <p>--preset-import-file "C:\Users\HaveAGitGat\Desktop\testpreset.json" -Z "My Preset"</p>

        <p>You can learn more about HandBrake presets here:</p>

        <p><a href="" onClick={(e) => { e.preventDefault(); window.open("https://handbrake.fr/docs/en/latest/technical/official-presets.html", "_blank") }}>HandBrake presets</a></p>

        <br />
        <br />
        <br />






        <p>CLI preset/arguments (avoid using ' ):</p>
        <br />

        <input type="text" className="pluginCreatorInputs" ref="preset" defaultValue={'-Z "Very Fast 1080p30"'}></input>


        <br />
        <br />
        <br />
        <br />


        <p>Output container:</p>
        <br />


        <input type="text" className="pluginCreatorInputs" ref="container" defaultValue={"mkv"}></input>

        <br />
        <br />
        <br />
        <br />


        <center>

          <Button variant="outline-light" onClick={this.addAction}  >Set action</Button>

        </center>

        <br />
        <br />
        <br />





      </div>

    );
  }
}



