import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';

import LocalImage from '../../Local_Image.jsx';





var ButtonStyle = {
  display: 'inline-block',
}



class App extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };


  }






  render() {



    return (





      <div >

        <br />
        <br />
        <br />

        <center><p>Guide</p> </center>


        <br />
        <br />
        <br />


        <p>Each of your libraries can have its own plugin stack. Use both community and local plugins to create a stack which processes your files to your requirements.</p>

        <p>Plugins created in the plugin creator will be saved locally in 'Tdarr/Plugins/Local' and can be viewed on the 'Local' plugins tab to the upper left. Plugins are written in JavaScript and are highly configurable. It is encouraged that you open up plugins in a text/code editor and modify them to do exactly what you need. </p>

        <br />
        <br />

        <p>The following illustrates how the plugin stack works.</p>

        <br />

        <center>
          <LocalImage height="500" link="/images/example_plugin_stack_flow.png" />
        </center>


        <br />

        <p>The following is a guideline on how to arrange your plugins to minimise the number of processing cycles:</p>
        <p>Re-order streams</p>
        <p>Video transcode related</p>
        <p>Audio transcode related</p>
        <p>Remux</p>
          
        <br />
        <p>Think logically about how your files will be processed. For example, let's say you have 2 plugins:</p>
        <p>(1) Transcode non hevc files into hevc mkv</p>
        <p>(2) Remux non-mkv files into mkv</p>
        <p>It would not makes sense to put the remux plugin above the transcode plugin. In the above stack if, for example, a h264 MP4 file enters the stack, only the transcode plugin would need to be used. If the remux plugin was above the transcode plugin, 2 plugins would need to be used, resulting in additional processing time and more disk read/writes.</p>
        <p></p>

        <br />
        <p>When using Tdarr <b>it's important that you implement conditions/filters to prevent your files from going through an infinite transcode/remux cycle</b>. For example, if you're transcoding into hevc, then add a filter to prevent hevc being transcoded. That way your new files (in hevc), won't be re-transcoded. You can use the 'Force processing' buttons to force a plugin through your first plugin (applies to plugins created in the plugin creator from 1.101+).</p>

        <p>Some actions/plugins have built-in filters. This means they'll automatically detect if a file needs to be processed or not (such as the remove subtitles community plugin). Additional filters can be added.</p>

        <p>To use plugins, press the 'Copy id' button on one of the plugins on the 'Plugins' tab. Paste the id in the plugin id box in the 'Transcode' section of one of your libraries. Make sure to use the checkboxes to specify whether it's a Community or Local plugin.</p>

        <br />


        <br />
        <br />
        <br />



      </div>

    );
  }
}

export default withTracker(() => {




  return {



  };
})(App);


