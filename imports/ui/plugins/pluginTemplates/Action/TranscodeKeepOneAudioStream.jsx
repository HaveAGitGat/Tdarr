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

    var langTag = ReactDOM.findDOMNode(this.refs.langTag).value

    var channelCount = ReactDOM.findDOMNode(this.refs.channels).value





    var obj = {
      name: 'Transcode - Keep one audio stream',
      description: `Transcode - Keep one audio stream: ${audioEncoder}, ${langTag}, ${channelCount}`,
      preset: `library.actions.transcodeKeepOneAudioStream(file, '${audioEncoder}', '${langTag}', ${channelCount}).preset`,
      container: '"." + file.container',
      handBrakeMode: false,
      FFmpegMode: true,
      processFile: `library.actions.transcodeKeepOneAudioStream(file, '${audioEncoder}', '${langTag}', ${channelCount}).processFile`,
      infoLog: `library.actions.transcodeKeepOneAudioStream(file, '${audioEncoder}', '${langTag}', ${channelCount}).note`

    }
    this.props.setAction(obj)

  }



  render() {



    return (





      <div >

        <br />

        <center><p>Transcode - Keep one audio stream</p> </center>


        <br />

        <p>This action has a built-in filter. Additional filters can be added above.</p>

        <br />


        <p>Tdarr will try to keep the best audio track possible given the requirements specified below.</p>

        <p>If the specified stream does not exist, Tdarr will try to create it using the best stream available.</p>
        <p>If no specified language track exists, the best untagged/undefined stream will be used/kept.</p>

        <br />
        <br />

        <p>Audio codec</p>

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

        <p>Language</p>

        <p>Tdarr will check to see if the stream language tag includes the tag you specify. Case-insensitive. One tag only.</p>

        <input type="text" className="pluginCreatorInputs" ref="langTag" defaultValue={"en"}></input>



        <br />
        <br />

        <p>Channels</p>

        <select name='channels' ref='channels'>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='6'>5.1</option>
          <option value='8'>7.1</option>
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



