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

      keepSubs: false,
    };


  }


  addAction = () => {


    var preset = ReactDOM.findDOMNode(this.refs.preset).value


    var videoEncoder
    var selectedVideoEncoder = ReactDOM.findDOMNode(this.refs.videoEncoder).value

    if (selectedVideoEncoder == 'Default') {

      videoEncoder = ''

    } else {

      videoEncoder = `-e ${selectedVideoEncoder}`

    }

    var keepSubs = this.state.keepSubs

    if (keepSubs === true) {

      keepSubs = '--all-subtitles'

    } else {

      keepSubs = ''
    }




    var command = ` -Z "${preset}" ${videoEncoder} ${keepSubs}`


    var container = ReactDOM.findDOMNode(this.refs.container).value

    if (container.charAt(0) !== ".") {

      container = "." + container

    }




    var obj = {
      name: 'Transcode - HandBrake basic options',
      description: `Transcode - HandBrake basic options`,
      preset: `'${command}'`,
      container: `'${container}'`,
      handBrakeMode: true,
      FFmpegMode: false,
      processFile: true,
      infoLog: '"File is being transcoded using HandBrake \\n"',

    }
    this.props.setAction(obj)

  }



  render() {



    return (





      <div >

        <br />

        <center><p>Transcode - HandBrake basic options</p> </center>


        <br />

        <p>This action has no built-in filter. It relies on the filters set above. </p>
        <p>For example, <b>if transcoding into hevc (h265), set a filter to exclude hevc or your files may be infinitely transcoded.</b></p>

        <br />


        <p>You can learn more about HandBrake presets here:</p>

        <p><a href="https://handbrake.fr/docs/en/latest/technical/official-presets.html" onClick={(e) => { e.preventDefault(); window.open("https://handbrake.fr/docs/en/latest/technical/official-presets.html", "_blank") }}>HandBrake presets</a></p>

        <br />
        <br />

      


        <p>HandBrake Preset:</p>
        <br />
        <select name='preset' ref='preset'>
          <option value='Very Fast 1080p30'>Very Fast 1080p30 (h264)</option>
          <option value='Very Fast 720p30'>Very Fast 720p30 (h264)</option>
          <option value='Very Fast 576p25'>Very Fast 576p25 (h264)</option>
          <option value='Very Fast 480p30'>Very Fast 480p30 (h264)</option>
          <option value='Fast 1080p30'>Fast 1080p30 (h264)</option>
          <option value='Fast 720p30'>Fast 720p30 (h264)</option>
          <option value='Fast 576p25'>Fast 576p25 (h264)</option>
          <option value='Fast 480p30'>Fast 480p30 (h264)</option>
          <option value='HQ 1080p30 Surround'>HQ 1080p30 Surround (h264)</option>
          <option value='HQ 720p30 Surround'>HQ 720p30 Surround (h264)</option>
          <option value='HQ 576p25 Surround'>HQ 576p25 Surround (h264)</option>
          <option value='HQ 480p30 Surround'>HQ 480p30 Surround (h264)</option>
          <option value='Super HQ 1080p30 Surround'>Super HQ 1080p30 Surround (h264)</option>
          <option value='Super HQ 720p30 Surround'>Super HQ 720p30 Surround (h264)</option>
          <option value='Super HQ 576p25 Surround'>Super HQ 576p25 Surround (h264)</option>
          <option value='Super HQ 480p30 Surround'>Super HQ 480p30 Surround (h264)</option>
          <option value='Gmail Large 3 Minutes 720p30'>Gmail Large 3 Minutes 720p30 (h264)</option>
          <option value='Gmail Medium 5 Minutes 480p30'>Gmail Medium 5 Minutes 480p30 (h264)</option>
          <option value='Gmail Small 10 Minutes 288p30'>Gmail Small 10 Minutes 288p30 (h264)</option>
          <option value='Vimeo YouTube HQ 2160p60 4K'>Vimeo YouTube HQ 2160p60 4K (h264)</option>
          <option value='>Vimeo YouTube HQ 1440p60 2.5K'>Vimeo YouTube HQ 1440p60 2.5K (h264)</option>
          <option value='Vimeo YouTube HQ 1080p60'>Vimeo YouTube HQ 1080p60 (h264)</option>
          <option value='Vimeo YouTube HQ 720p60'>Vimeo YouTube HQ 720p60 (h264)</option>
          <option value='Vimeo YouTube 720p30'>Vimeo YouTube 720p30 (h264)</option>
          <option value='Android 1080p30'>Android 1080p30 (h264)</option>
          <option value='Android 720p30'>Android 720p30 (h264)</option>
          <option value='Android 576p25'>Android 576p25 (h264)</option>
          <option value='Android 480p30'>Android 480p30 (h264)</option>
          <option value='Apple 2160p60 4K HEVC Surround'>Apple 2160p60 4K HEVC Surround (h265)</option>
          <option value='Apple 1080p60 Surround'>Apple 1080p60 Surround (h264)</option>
          <option value='Apple 1080p30 Surround'>Apple 1080p30 Surround (h264)</option>
          <option value='Apple 720p30 Surround'>Apple 720p30 Surround (h264)</option>
          <option value='Apple 540p30 Surround'>Apple 540p30 Surround (h264)</option>
          <option value='Apple 240p30'>Apple 240p30 (h264)</option>
          <option value='Chromecast 2160p60 4K HEVC Surround'>Chromecast 2160p60 4K HEVC Surround (h264)</option>
          <option value='Chromecast 1080p60 Surround'>Chromecast 1080p60 Surround (h264)</option>
          <option value='Chromecast 1080p30 Surround'>Chromecast 1080p30 Surround (h264)</option>
          <option value='Amazon Fire 2160p60 4K HEVC Surround'>Amazon Fire 2160p60 4K HEVC Surround (h265)</option>
          <option value='Amazon Fire 1080p30 Surround'>Amazon Fire 1080p30 Surround (h264)</option>
          <option value='Amazon Fire 720p30'>Amazon Fire 720p30 (h264)</option>
          <option value='Playstation 1080p30 Surround'>Playstation 1080p30 Surround (h264)</option>
          <option value='Playstation 720p30'>Playstation 720p30 (h264)</option>
          <option value='Playstation 540p30'>Playstation 540p30 (h264)</option>
          <option value='Roku 2160p60 4K HEVC Surround'>Roku 2160p60 4K HEVC Surround (h265)</option>
          <option value='Roku 1080p30 Surround'>Roku 1080p30 Surround (h264)</option>
          <option value='Roku 720p30 Surround'>Roku 720p30 Surround (h264)</option>
          <option value='Roku 576p25'>Roku 576p25 (h264)</option>
          <option value='Roku 480p30'>Roku 480p30 (h264)</option>
          <option value='Windows Mobile 1080p30'>Windows Mobile 1080p30 (h264)</option>
          <option value='Windows Mobile 720p30'>Windows Mobile 720p30 (h264)</option>
          <option value='Windows Mobile 540p30'>Windows Mobile 540p30 (h264)</option>
          <option value='Windows Mobile 480p30'>Windows Mobile 480p30 (h264)</option>
          <option value='Xbox 1080p30 Surround'>Xbox 1080p30 Surround (h264)</option>
          <option value='Xbox Legacy 1080p30 Surround'>Xbox Legacy 1080p30 Surround (h264)</option>
          <option value='H.265 MKV 2160p60'>H.265 MKV 2160p60 (h265)</option>
          <option value='H.265 MKV 1080p30'>H.265 MKV 1080p30 (h265)</option>
          <option value='H.265 MKV 720p30'>H.265 MKV 720p30 (h265)</option>
          <option value='H.265 MKV 576p25'>H.265 MKV 576p25 (h265)</option>
          <option value='H.265 MKV 480p30'>H.265 MKV 480p30 (h265)</option>
          <option value='H.264 MKV 2160p60'>H.264 MKV 2160p60 (h264)</option>
          <option value='H.264 MKV 1080p30'>H.264 MKV 1080p30 (h264)</option>
          <option value='H.264 MKV 720p30'>H.264 MKV 720p30 (h264)</option>
          <option value='H.264 MKV 576p25'>H.264 MKV 576p25 (h264)</option>
          <option value='H.264 MKV 480p30'>H.264 MKV 480p30 (h264)</option>
          <option value='VP9 MKV 2160p60'>VP9 MKV 2160p60 (vp9)</option>
          <option value='VP9 MKV 1080p30'>VP9 MKV 1080p30 (vp9)</option>
          <option value='VP9 MKV 720p30'>VP9 MKV 720p30 (vp9)</option>
          <option value='VP9 MKV 576p25'>VP9 MKV 576p25 (vp9)</option>
          <option value='VP9 MKV 480p30'>VP9 MKV 480p30 (vp9)</option>
          <option value='VP8 MKV 1080p30'>VP8 MKV 1080p30 (vp8)</option>
          <option value='VP8 MKV 720p30'>VP8 MKV 720p30 (vp8)</option>
          <option value='VP8 MKV 576p25'>VP8 MKV 576p25 (vp8)</option>
          <option value='VP8 MKV 480p30'>VP8 MKV 480p30 (vp8)</option>
          <option value='Production Max'>Production Max (h264)</option>
          <option value='Production Standard'>Production Standard (h264)</option>
          <option value='Production Proxy 1080p'>Production Proxy 1080p (h264)</option>
          <option value='Production Proxy 540p'>Production Proxy 540p (h264)</option>



        </select>

        <br />
        <br />
        <p>Encoder:</p>
        <br />

        <select name='videoEncoder' ref='videoEncoder'>
          <option value='Default'>Default</option>
          <option value='x264'>x264</option>
          <option value='x264_10bit'>x264_10bit</option>
          <option value='qsv_h264'>qsv_h264</option>
          <option value='nvenc_h264'>nvenc_h264</option>
          <option value='x265'>x265</option>
          <option value='x265_10bit'>x265_10bit</option>
          <option value='x265_12bit'>x265_12bit</option>
          <option value='qsv_h265'>qsv_h265</option>
          <option value='nvenc_h265'>nvenc_h265</option>
          <option value='mpeg4'>mpeg4</option>
          <option value='mpeg2'>mpeg2</option>
          <option value='VP8'>VP8</option>
          <option value='VP9'>VP9</option>
          <option value='theora'>theora</option>
        </select>


        <br />
        <br />

        <p>Keep subtitles:  <Checkbox ref='keepSubs' checked={this.state.keepSubs} onChange={event => {
          this.setState({
            keepSubs: !this.state.keepSubs,
          })
        }} /></p>




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



