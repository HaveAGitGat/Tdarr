import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FileDB,StatisticsDB,GlobalSettingsDB } from '../api/tasks.js';
import ReactDOM from 'react-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";
import ItemButton from './item_Button.jsx'
import { render } from 'react-dom';
import SearchResults from './searchResults.jsx'



import { PieChart, Pie, Sector, Cell, Tooltip, Label,ResponsiveContainer} from 'recharts';



var renderLabel = function (entry) {


return entry.name;


}




// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);

    this.state = { listItems: [1, 2],resultsShow:false };
  }



  renderStat(stat){

    var statistics = this.props.statistics


    if(statistics.length == 0){


      var statDat = <ClipLoader

      sizeUnit={"px"}
      size={15}
      color={'white'}
      loading={true}
  />

    }else {
      var statDat = statistics[0][stat]

      if(stat == "sizeDiff"){
try{
        statDat = parseFloat(statDat.toPrecision(4))

}catch(err){}
        
      }

    }


    return statDat



  }

  renderPie(pie,property, fileMedium) {



    var statistics = this.props.statistics


    if(statistics.length == 0){


      var data = [{name:"Loading...",value:1}]

    }else {
      var data = statistics[0][pie]

    }


    const COLORS = ['#bb86fc','#04dac5','#bdbdbd'];



      return (
        <ResponsiveContainer height='100%' width='99%'>
          <PieChart onMouseEnter={this.onPieEnter}>
            <Pie
              data={data}
              stroke="none"
              innerRadius={60}
              outerRadius={80}
             
              paddingAngle={5}
             
              label={renderLabel}
              
            >
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} 
                onClick={() => {
                 
                  
                  if (confirm('Are you sure you want to load all files from this pie segment?')) {

                    

        render(<center><ClipLoader

          sizeUnit={"px"}
          size={25}
          color={'white'}
          loading={true}
        /></center>, document.getElementById('searchResults'));


                    Meteor.call('returnPieFiles',property, fileMedium,entry.name, (error, result) => {


                     


                      this.setState({
                        resultsShow: true,
                      })


                
                        render(<SearchResults results={result}  />, document.getElementById('searchResults'));
                
                      
          
                     });

              
                  }

                }}    />)
              }
            </Pie>

            <Tooltip />
          </PieChart>
          </ResponsiveContainer>
      );




}





  render() {
    return (


      <div className="containerGeneral">

<div className="statsContainer">
          <center>
      <header>
          <h1>Stats</h1>
      </header>
      </center>


      <center>
      <table>

      <tbody>

      <tr><td><p><b>Total files in DB</b></p></td><td><p>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{this.renderStat('totalFileCount')}</p></td></tr>

      <tr><td><p><b>Total number of transcodes</b></p></td><td><p>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{this.renderStat('totalTranscodeCount')}</p></td></tr>
      <tr><td><p><b>Space saved</b></p></td><td><p>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{this.renderStat('sizeDiff')} GB</p></td></tr>
      <tr><td><p><b>Total number of health checks</b></p></td><td> <p>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{this.renderStat('totalHealthCheckCount')}</p></td></tr>

      <tr></tr>

      <tr></tr>


      </tbody>


      </table>
      </center>


       </div>

       <div className={this.state.resultsShow ? '' : 'hidden'}>
       <center>
       <Button variant="outline-light" onClick={() => {
          this.setState({
            resultsShow: false,
          })

          render("", document.getElementById('searchResults'));



       }} ><span className="buttonTextSize">Clear</span></Button>
   </center>

   <div className="libraryContainer" >
<div id="searchResults" ref="searchResults"></div>
</div>

</div>

<center><p>Click on pie segments to load respective files</p></center>



       <div className="videoStatsContainer">

<center><p><b>Tdarr status</b></p></center> 

  <div className="pieaudiogrid-container">

  <div className="pieaudiogrid-item-title">
  <center><p><b>Transcode </b>{this.renderStat('tdarrScore')}%</p></center>
  </div>

  
  <div className="pieaudiogrid-item-title">
  <center><p><b>Health </b>{this.renderStat('healthCheckScore')}%</p></center>

  </div>







  <div className="pieaudiogrid-item">

 

  {this.renderPie('pie1',"TranscodeDecisionMaker", '')}

    </div>



    <div className="pieaudiogrid-item">

    {this.renderPie('pie2','HealthCheck', '')}


</div>

</div>
</div>

       


      <div className="videoStatsContainer">

      <center><p><b>Video files</b></p></center> 

        <div className="piegrid-container">

        <div className="piegrid-item-title">
        <center><p><b>Codecs</b></p></center>
        </div>

        <div className="piegrid-item-title">
        <center><p><b>Containers</b></p></center>

        </div>

        <div className="piegrid-item-title">
        <center><p><b>Resolutions</b></p></center>
        </div>
        








        <div className="piegrid-item">
          
        {this.renderPie('pie3',"video_codec_name","video")}

          </div>


          <div className="piegrid-item">
     
          {this.renderPie('pie4',"container","video")}

          </div>
        

        <div className="piegrid-item">


        {this.renderPie('pie5',"video_resolution","video")}


          </div>





</div>
</div>
   



<div className="videoStatsContainer">

<center><p><b>Audio files</b></p></center> 

  <div className="pieaudiogrid-container">

  <div className="pieaudiogrid-item-title">
  <center><p><b>Codecs</b></p></center>
  </div>

  
  <div className="pieaudiogrid-item-title">
  <center><p><b>Containers</b></p></center>

  </div>







  <div className="pieaudiogrid-item">
    

  {this.renderPie('pie6','audio_codec_name', 'audio')}

    </div>



    <div className="pieaudiogrid-item">

    {this.renderPie('pie7','container', 'audio')}


</div>

</div>
</div>









      </div>
    );
  }
}

export default withTracker(() => {


  Meteor.subscribe('StatisticsDB');

  return {

    statistics:StatisticsDB.find({}).fetch(),









  };
})(App);