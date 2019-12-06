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

  }


  addAction = () => {


    var audioEncoder = ReactDOM.findDOMNode(this.refs.audioEncoder).value





    var obj = {
      name: 'Transcode - Standardise audio stream codecs',
      description: `Transcode - Standardise audio stream codecs: ${audioEncoder}`,
      preset: `library.actions.transcodeStandardiseAudioCodecs(file, '${audioEncoder}').preset`,
      container: '"." + file.container',
      handBrakeMode: false,
      FFmpegMode: true,
      processFile: `library.actions.transcodeStandardiseAudioCodecs(file, '${audioEncoder}' ).processFile`,
      infoLog: `library.actions.transcodeStandardiseAudioCodecs(file, '${audioEncoder}').note`

    }
    this.props.setAction(obj)

  }



  render() {



    return (





      <div >

        <br />

        <center><p>Transcode - Standardise audio stream codecs</p> </center>


        <br />

        <p>This action has a built-in filter. Additional filters can be added above.</p>

        <br />


        <p>All audio tracks which are not in the specified codec will be transcoded into the specified codec. Bitrate and channel count are kept the same.</p>

        <br />
        <br />

        <select name='audioEncoder' ref='audioEncoder'>
          <option value='aac'>aac</option>
          <option value='ac3'>ac3</option>
          <option value='eac3'>eac3</option>
          <option value='dca'>dca (DTS)</option>
          <option value='flac'>flac</option>
          <option value='mp2'>mp2</option>
          <option value='libmp3lame'>libmp3lame (mp3)</option>
          <option value='truehd'>truehd</option>
        </select>

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



