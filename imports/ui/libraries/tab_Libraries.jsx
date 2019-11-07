import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';


import { SettingsDB ,GlobalSettingsDB} from '../../api/tasks.js';

import Folder from './tab_Libraries_Folder.jsx';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';







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
      Meteor.call('remove', function (error, result) { });

      GlobalSettingsDB.upsert('globalsettings',
        {
          $set: {
            selectedLibrary: 0,
          }
        }
      );

    }

  }



  addFolder = () => {

    var count = this.props.libraries.length


    SettingsDB.insert({
      name:"Library Name",
      priority:count,
      folder:"Path to your media files. Input a base folder and the folder browser below will show subfolders to navigate.",
      folderValid:true,
      cache:"Path to your transcode cache. Input a base folder and the folder browser below will show subfolders to navigate.",
      cacheValid:true,
      output:"Path to your transcode cache. Input a base folder and the folder browser below will show subfolders to navigate.",
      outputValid:true,
      folderToFolderConversion:false,
      container:".mkv",
      containerFilter:"mkv,mp4,mov,m4v,mpg,mpeg,avi,flv,webm,wmv,vob,evo,iso",
      createdAt: new Date(),
      folderWatching:false,
      processLibrary:true,
      scanOnStart:true,
      scanButtons:true,
      scanFound:0,
      expanded:true,
      navItemSelected:"navSourceFolder",
      pluginID:'',
      pluginIDs:[],
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
        videoExcludeSwitch:true,
        video_codec_names_exclude:[
          {codec:"hevc",
          checked:false
          
        },
          {codec:"h264",
          checked:true
        
        }
        ],
        video_size_range_include:{min:0,max:100000},
        video_height_range_include:{min:0,max:3000},
        video_width_range_include:{min:0,max:4000},

        audioFilter:false,
        audioExcludeSwitch:true,
        
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

        {_id:"Sun:00-01",
        checked:true
        },
        {_id:"Sun:01-02",
        checked:true
        },
        {_id:"Sun:02-03",
        checked:true
        },
        {_id:"Sun:03-04",
        checked:true
        },
        {_id:"Sun:04-05",
        checked:true
        },
        {_id:"Sun:05-06",
        checked:true
        },
        {_id:"Sun:06-07",
        checked:true
        },
        {_id:"Sun:07-08",
        checked:true
        },
        {_id:"Sun:08-09",
        checked:true
        },
        {_id:"Sun:09-10",
        checked:true
        },
        {_id:"Sun:10-11",
        checked:true
        },
        {_id:"Sun:11-12",
        checked:true
        },
        {_id:"Sun:12-13",
        checked:true
        },
        {_id:"Sun:13-14",
        checked:true
        },
        {_id:"Sun:14-15",
        checked:true
        },
        {_id:"Sun:15-16",
        checked:true
        },
        {_id:"Sun:16-17",
        checked:true
        },
        {_id:"Sun:17-18",
        checked:true
        },
        {_id:"Sun:18-19",
        checked:true
        },
        {_id:"Sun:19-20",
        checked:true
        },
        {_id:"Sun:20-21",
        checked:true
        },
        {_id:"Sun:21-22",
        checked:true
        },
        {_id:"Sun:22-23",
        checked:true
        },
        {_id:"Sun:23-00",
        checked:true
        },


        {_id:"Mon:00-01",
        checked:true
        },
        {_id:"Mon:01-02",
        checked:true
        },
        {_id:"Mon:02-03",
        checked:true
        },
        {_id:"Mon:03-04",
        checked:true
        },
        {_id:"Mon:04-05",
        checked:true
        },
        {_id:"Mon:05-06",
        checked:true
        },
        {_id:"Mon:06-07",
        checked:true
        },
        {_id:"Mon:07-08",
        checked:true
        },
        {_id:"Mon:08-09",
        checked:true
        },
        {_id:"Mon:09-10",
        checked:true
        },
        {_id:"Mon:10-11",
        checked:true
        },
        {_id:"Mon:11-12",
        checked:true
        },
        {_id:"Mon:12-13",
        checked:true
        },
        {_id:"Mon:13-14",
        checked:true
        },
        {_id:"Mon:14-15",
        checked:true
        },
        {_id:"Mon:15-16",
        checked:true
        },
        {_id:"Mon:16-17",
        checked:true
        },
        {_id:"Mon:17-18",
        checked:true
        },
        {_id:"Mon:18-19",
        checked:true
        },
        {_id:"Mon:19-20",
        checked:true
        },
        {_id:"Mon:20-21",
        checked:true
        },
        {_id:"Mon:21-22",
        checked:true
        },
        {_id:"Mon:22-23",
        checked:true
        },
        {_id:"Mon:23-00",
        checked:true
        },

        {_id:"Tue:00-01",
        checked:true
        },
        {_id:"Tue:01-02",
        checked:true
        },
        {_id:"Tue:02-03",
        checked:true
        },
        {_id:"Tue:03-04",
        checked:true
        },
        {_id:"Tue:04-05",
        checked:true
        },
        {_id:"Tue:05-06",
        checked:true
        },
        {_id:"Tue:06-07",
        checked:true
        },
        {_id:"Tue:07-08",
        checked:true
        },
        {_id:"Tue:08-09",
        checked:true
        },
        {_id:"Tue:09-10",
        checked:true
        },
        {_id:"Tue:10-11",
        checked:true
        },
        {_id:"Tue:11-12",
        checked:true
        },
        {_id:"Tue:12-13",
        checked:true
        },
        {_id:"Tue:13-14",
        checked:true
        },
        {_id:"Tue:14-15",
        checked:true
        },
        {_id:"Tue:15-16",
        checked:true
        },
        {_id:"Tue:16-17",
        checked:true
        },

        {_id:"Tue:17-18",
        checked:true
        },
        {_id:"Tue:18-19",
        checked:true
        },
        {_id:"Tue:19-20",
        checked:true
        },
        {_id:"Tue:20-21",
        checked:true
        },
        {_id:"Tue:21-22",
        checked:true
        },
        {_id:"Tue:22-23",
        checked:true
        },
        {_id:"Tue:23-00",
        checked:true
        },

        {_id:"Wed:00-01",
        checked:true
        },
        {_id:"Wed:01-02",
        checked:true
        },
        {_id:"Wed:02-03",
        checked:true
        },
        {_id:"Wed:03-04",
        checked:true
        },
        {_id:"Wed:04-05",
        checked:true
        },
        {_id:"Wed:05-06",
        checked:true
        },
        {_id:"Wed:06-07",
        checked:true
        },
        {_id:"Wed:07-08",
        checked:true
        },
        {_id:"Wed:08-09",
        checked:true
        },
        {_id:"Wed:09-10",
        checked:true
        },
        {_id:"Wed:10-11",
        checked:true
        },
        {_id:"Wed:11-12",
        checked:true
        },
        {_id:"Wed:12-13",
        checked:true
        },
        {_id:"Wed:13-14",
        checked:true
        },
        {_id:"Wed:14-15",
        checked:true
        },
        {_id:"Wed:15-16",
        checked:true
        },
        {_id:"Wed:16-17",
        checked:true
        },
        {_id:"Wed:17-18",
        checked:true
        },
        {_id:"Wed:18-19",
        checked:true
        },
        {_id:"Wed:19-20",
        checked:true
        },
        {_id:"Wed:20-21",
        checked:true
        },
        {_id:"Wed:21-22",
        checked:true
        },
        {_id:"Wed:22-23",
        checked:true
        },
        {_id:"Wed:23-00",
        checked:true
        },

        {_id:"Thur:00-01",
        checked:true
        },
        {_id:"Thur:01-02",
        checked:true
        },
        {_id:"Thur:02-03",
        checked:true
        },
        {_id:"Thur:03-04",
        checked:true
        },
        {_id:"Thur:04-05",
        checked:true
        },
        {_id:"Thur:05-06",
        checked:true
        },
        {_id:"Thur:06-07",
        checked:true
        },
        {_id:"Thur:07-08",
        checked:true
        },
        {_id:"Thur:08-09",
        checked:true
        },
        {_id:"Thur:09-10",
        checked:true
        },
        {_id:"Thur:10-11",
        checked:true
        },
        {_id:"Thur:11-12",
        checked:true
        },
        {_id:"Thur:12-13",
        checked:true
        },
        {_id:"Thur:13-14",
        checked:true
        },
        {_id:"Thur:14-15",
        checked:true
        },
        {_id:"Thur:15-16",
        checked:true
        },
        {_id:"Thur:16-17",
        checked:true
        },
        {_id:"Thur:17-18",
        checked:true
        },
        {_id:"Thur:18-19",
        checked:true
        },
        {_id:"Thur:19-20",
        checked:true
        },
        {_id:"Thur:20-21",
        checked:true
        },
        {_id:"Thur:21-22",
        checked:true
        },
        {_id:"Thur:22-23",
        checked:true
        },
        {_id:"Thur:23-00",
        checked:true
        },

        {_id:"Fri:00-01",
        checked:true
        },
        {_id:"Fri:01-02",
        checked:true
        },
        {_id:"Fri:02-03",
        checked:true
        },
        {_id:"Fri:03-04",
        checked:true
        },
        {_id:"Fri:04-05",
        checked:true
        },
        {_id:"Fri:05-06",
        checked:true
        },
        {_id:"Fri:06-07",
        checked:true
        },
        {_id:"Fri:07-08",
        checked:true
        },
        {_id:"Fri:08-09",
        checked:true
        },
        {_id:"Fri:09-10",
        checked:true
        },
        {_id:"Fri:10-11",
        checked:true
        },
        {_id:"Fri:11-12",
        checked:true
        },
        {_id:"Fri:12-13",
        checked:true
        },
        {_id:"Fri:13-14",
        checked:true
        },
        {_id:"Fri:14-15",
        checked:true
        },
        {_id:"Fri:15-16",
        checked:true
        },
        {_id:"Fri:16-17",
        checked:true
        },
        {_id:"Fri:17-18",
        checked:true
        },
        {_id:"Fri:18-19",
        checked:true
        },
        {_id:"Fri:19-20",
        checked:true
        },
        {_id:"Fri:20-21",
        checked:true
        },
        {_id:"Fri:21-22",
        checked:true
        },
        {_id:"Fri:22-23",
        checked:true
        },
        {_id:"Fri:23-00",
        checked:true
        },

        {_id:"Sat:00-01",
        checked:true
        },
        {_id:"Sat:01-02",
        checked:true
        },
        {_id:"Sat:02-03",
        checked:true
        },
        {_id:"Sat:03-04",
        checked:true
        },
        {_id:"Sat:04-05",
        checked:true
        },
        {_id:"Sat:05-06",
        checked:true
        },
        {_id:"Sat:06-07",
        checked:true
        },
        {_id:"Sat:07-08",
        checked:true
        },
        {_id:"Sat:08-09",
        checked:true
        },
        {_id:"Sat:09-10",
        checked:true
        },
        {_id:"Sat:10-11",
        checked:true
        },
        {_id:"Sat:11-12",
        checked:true
        },
        {_id:"Sat:12-13",
        checked:true
        },
        {_id:"Sat:13-14",
        checked:true
        },
        {_id:"Sat:14-15",
        checked:true
        },
        {_id:"Sat:15-16",
        checked:true
        },
        {_id:"Sat:16-17",
        checked:true
        },
        {_id:"Sat:17-18",
        checked:true
        },
        {_id:"Sat:18-19",
        checked:true
        },
        {_id:"Sat:19-20",
        checked:true
        },
        {_id:"Sat:20-21",
        checked:true
        },
        {_id:"Sat:21-22",
        checked:true
        },
        {_id:"Sat:22-23",
        checked:true
        },
        {_id:"Sat:23-00",
        checked:true
        },

      ]
    });

    GlobalSettingsDB.upsert('globalsettings',
    {
      $set: {
        selectedLibrary: count,
      }
    }
  );



  }



  componentDidMount = () => {

    render(<center><ClipLoader

      sizeUnit={"px"}
      size={25}
      color={'white'}
      loading={true}
  /></center>, document.getElementById('status'));


    Meteor.subscribe('SettingsDB', function(){


      var res = SettingsDB.find({}).fetch()

      if(res.length == 0){
  
  
        render(<center><p>No libraries</p></center>, document.getElementById('status'));
        
  
    
      }else{
      render('', document.getElementById('status'));
      }


   });

   //

   Meteor.subscribe('SettingsDB', function(){


    var res = SettingsDB.find({}).fetch()

    if(res.length == 0){


      render(<center><p>No libraries</p></center>, document.getElementById('status'));
      

  
    }else{
    render('', document.getElementById('status'));
    }


 });


   

  }







  renderLibraries= () => {

  
    try{

      if(this.props.libraries.length == 0){


      }else{

        const COLORS = ['white','white'];
  
      var tabTitles = this.props.libraries.map((item, i) => (

        <Tab><p>{item.name}</p></Tab>
      
        ));

        var tabPanels = this.props.libraries.map((item, i) => (

          <TabPanel><div className="tabContainer" >
          <Folder
            key={item._id}
            libraryItem={item}
            backgroundColour={COLORS[(i+1) % 2]}         
          />
           </div></TabPanel>
         
  
        
          ));

        
    return  <div className="tabWrap" > <Tabs selectedIndex={ this.props.globalSettings[0].selectedLibrary != undefined ? this.props.globalSettings[0].selectedLibrary : 0} onSelect={tabIndex => {

      GlobalSettingsDB.upsert('globalsettings',
      {
        $set: {
          selectedLibrary: tabIndex,
        }
      }
    );
    }}>
    <TabList>

    {tabTitles}
    </TabList>

 
    {tabPanels}

  </Tabs> </div>

      }

    }catch(err){}
  }

  render() {
    return (


      <div className="containerGeneral">
        <center>
      <header>
          <h1>Libraries</h1>
      </header>
      </center>
      
      <center>

        <Button variant="outline-light"  onClick={this.addFolder} ><span className="buttonTextSize">Library +</span></Button>{'\u00A0'}
        <Button variant="outline-danger"  onClick={this.clearFiles} ><span className="buttonTextSize">Delete all libraries</span></Button>{'\u00A0'}
        <Modal
          trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
          modal
          closeOnDocumentClick
        >
           <div className="modalContainer">
          <div className="frame">
            <div className="scroll">

            <div className="modalText">
            <p>Tdarr is designed to automatically manage transcoding and health checking of your media libraries. If you've used HBBatchBeast, a lot of the settings will look familiar.</p>


<p>When you're first getting started, add a new library on the 'Libraries' tab and specify a source folder, select the container types you'd like to scan for and then click then click 'Scan (Fresh)' on the Options dropdown. This will do a fresh scan of the library and extract property data from files which fit your specified container settings. The data will then be saved in the database.</p>

<p>Provide a base folder path and the folder browser will show subfolders which you can navigate to using the buttons.</p>

<img src="https://i.imgur.com/vyp7fle.png"/>

<p>'Scan (Find new)' does 2 things - it removes files from the database which don't exist anymore, and adds newly detected files. Turn on 'Folder watch' to automate this process. New files will be scanned for every 30 seconds or so.</p>
<p>All new files will be added to both the transcode queues and the health check queues. If you're not interested in using one or the other, then just make sure not to fire up any workers for that respective queue.</p>

<p></p>
<p></p>
<p></p>
<p>In the library transcode settings, you can either use plugins or manually set either video file or audio file transcode settings.</p>

<p>You can stack plugins but this will increase the number of transcode/remux passes on a file. It's best to use/create a plugin which can do what you need all at once.</p>
<img src="https://i.imgur.com/yGmb9Rn.png"/>


<p>See the plugins tab for plugins info on creating a plugin.</p>

<p></p>
<p></p>
<p></p>
<p>In the manual settings, if using FFmpeg, you need to separate the input and output parameters with a comma. Such as:  '-r 1,-r 24'. Here are some HandBrake preset examples:</p>
<p>-e x264 -q 20 -B</p>
<p>-Z "Very Fast 1080p30"</p>
<p>-Z "Very Fast 480p30"</p>
<p>--preset-import-file "C:\Users\HaveAGitGat\Desktop\testpreset.json" -Z "My Preset"</p>


<p>You can learn more about HandBrake presets here:</p>

<p><a href="" onClick={(e) => { window.open("https://handbrake.fr/docs/en/latest/technical/official-presets.html", "_blank")}}>HandBrake presets</a></p>

<p>Please see the following tools for help with creating FFmpeg commands:</p>

<p><a href="" onClick={(e) => { window.open("http://rodrigopolo.com/ffmpeg/", "_blank")}}>http://rodrigopolo.com/ffmpeg/</a></p>
<p><a href="" onClick={(e) => { window.open("http://www.mackinger.at/ffmpeg/", "_blank")}}>http://www.mackinger.at/ffmpeg/</a></p>
<p><a href="" onClick={(e) => { window.open("https://axiomui.github.io/", "_blank")}}>Axiom</a></p>

<p>If you're having trouble with custom HandBrake json presets, it may be due to a known bug with the HandBrakeCLI (will be fixed in next HandBrakeCLI release).<a href="" onClick={(e) => { window.open("https://github.com/HandBrake/HandBrake/issues/2047", "_blank")}}>Please see this for a temporary solution.</a></p>
<p></p>
<p>Regarding the transcode filter settings, these are applied when the items are being processed in the transcode queue. If files do not meet the transcode requirements then they will be marked as 'Transcode:Not required'.</p>

<p></p>

<p>Quick health checks are done using HandBrake's --scan feature which checks file header for errors. Thorough health checks are done using FFmpeg to go through all frames in a video file.</p>

<p></p>

<p>Watch out for the schedule settings. If scheduled blocks are ticked, and worker limits are set at the top of the 'Tdarr' tab, then workers will be fired up even if you keep closing them down. It's also important to note that workers won't process items for the respective library outside the selected time blocks.</p>


</div>  

            </div>
          </div>
          </div>
        </Modal>
        </center>
        <p></p>
        <p></p>

  
      <div id="status"></div>

        
          {this.renderLibraries()}
        
      </div>
    );
  }
}

 export default withTracker(() => {
  Meteor.subscribe('GlobalSettingsDB');
  Meteor.subscribe('SettingsDB');
  
  
  return {
      
    
    globalSettings: GlobalSettingsDB.find({}, {}).fetch(),
    libraries: SettingsDB.find({}, { sort: { priority: 1 } }).fetch(),


  };
})(App);