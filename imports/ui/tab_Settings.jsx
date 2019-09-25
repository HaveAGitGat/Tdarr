import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';


import { SettingsDB } from '../api/tasks.js';

import Folder from '../ui/tab_Settings_Folder.jsx';
import ClipLoader from 'react-spinners/ClipLoader';






// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
    this.clearFiles = this.clearFiles.bind(this);

    this.state = { listItems: [1, 2],
      ready: false
    
    };
  }

  clearFiles() {
    //use {} to remove all docs, else none will be removed

    if (confirm('Are you sure you want to delete all libraries?')) {
    Meteor.call('remove', function (error, result) {});

    }

  }



  addFolder(){

    SettingsDB.insert({
      folder:"C:/MySourceFolder",
      folderValid:true,
      cache:"C:/MyTranscodeCache",
      cacheValid:true,
      container:".mkv",
      containerFilter:"mkv,mp4,mov,m4v,mpg,mpeg,avi,flv,webm,wmv,vob,evo,iso,",
      createdAt: new Date(),
      folderWatching:false,
      scanButtons:true,
      scanFound:0,
      expanded:true,
      pluginID:'',
      pluginValid:false,
      pluginCommunity:true,
      handbrake:true,
      ffmpeg:false,
      handbrakescan:true,
      ffmpegscan:false,
      preset:'-Z "Very Fast 1080p30"',
      decisionMaker:{
        pluginFilter:true,
        videoFilter:false,
        video_codec_names_exclude:[
          {codec:"hevc",
          checked:true
          
        },
          {codec:"h264",
          checked:false
        
        }
        ],
        video_size_range_include:{min:0,max:100000},
        video_height_range_include:{min:0,max:3000},
        video_width_range_include:{min:0,max:4000},

        audioFilter:false,
        audio_codec_names_exclude:[
          {codec:"mp3",
          checked:true
        },{
          codec:'aac',
          checked:false,
          
        }
        ],
        audio_size_range_include:{min:0,max:10},


      },
      schedule:[
        {_id:"00-01",
        checked:true
        },
        {_id:"01-02",
        checked:true
        },
        {_id:"02-03",
        checked:true
        },
        {_id:"03-04",
        checked:true
        },
        {_id:"04-05",
        checked:true
        },
        {_id:"05-06",
        checked:true
        },
        {_id:"06-07",
        checked:true
        },
        {_id:"07-08",
        checked:true
        },
        {_id:"08-09",
        checked:true
        },
        {_id:"09-10",
        checked:true
        },
        {_id:"10-11",
        checked:true
        },
        {_id:"11-12",
        checked:true
        },
        {_id:"12-13",
        checked:true
        },
        {_id:"13-14",
        checked:true
        },
        {_id:"14-15",
        checked:true
        },
        {_id:"15-16",
        checked:true
        },
        {_id:"16-17",
        checked:true
        },
        {_id:"17-18",
        checked:true
        },
        {_id:"18-19",
        checked:true
        },
        {_id:"19-20",
        checked:true
        },
        {_id:"20-21",
        checked:true
        },
        {_id:"21-22",
        checked:true
        },
        {_id:"22-23",
        checked:true
        },
        {_id:"23-00",
        checked:true
        },

      ]

    });


  }



  componentDidMount = () => {

    render(<ClipLoader

      sizeUnit={"px"}
      size={25}
      color={'#000000'}
      loading={true}
  />, document.getElementById('status'));


    Meteor.subscribe('SettingsDB', function(){


      var res = SettingsDB.find({}).fetch()

      if(res.length == 0){
  
  
        render(<p>No libraries</p>, document.getElementById('status'));
        
  
    
      }else{
      render('', document.getElementById('status'));
      }


   });


  }







  renderLibraries() {


      if(this.props.libraries.length == 0){


      }else{
  
      return this.props.libraries.map((item, i) => (

        <Folder
          key={item._id}
          libraryItem={item}         
        />
       

      
        ));

      }

  }

  render() {
    return (


      <div className="containerGeneral">
      <header>
          <h1>Libraries</h1>
      </header>
        <input type="button" className="addFolderButton" onClick={this.addFolder} value="Library +"/>
        <input type="button" className="cancelAllWorkersButton" onClick={this.clearFiles} value="Delete all libraries"/>
        <p></p>
        <p></p>

  
      <div id="status"></div>

        <ul>
          {this.renderLibraries()}
        </ul>
      </div>
    );
  }
}

 export default withTracker(() => {
  Meteor.subscribe('SettingsDB');
  return {
      
    libraries: SettingsDB.find({}, { sort: { createdAt: 1 } }).fetch(),


  };
})(App);