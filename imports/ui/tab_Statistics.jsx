import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FileDB,StatisticsDB,GlobalSettingsDB } from '../api/tasks.js';
import ReactDOM from 'react-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from 'react-bootstrap';
import Modal from "reactjs-popup";
import ItemButton from './item_Button.jsx'
import { render } from 'react-dom';


import { PieChart, Pie, Sector, Cell, Tooltip, Label,ResponsiveContainer} from 'recharts';


let renderLabel = function (entry) {
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
      color={'#000000'}
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


    const COLORS = ['#000000','#7d7d7d','#bdbdbd'];



      return (
        <ResponsiveContainer height='100%' width='99%'>
          <PieChart onMouseEnter={this.onPieEnter}>
            <Pie
              data={data}
          
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey={"value"}
              label={renderLabel}

            >
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}  onClick={() => {
                 
                  
                  if (confirm('Are you sure you want to load all files from this pie segment?')) {

                    

        render(<center><ClipLoader

          sizeUnit={"px"}
          size={25}
          color={'#000000'}
          loading={true}
        /></center>, document.getElementById('searchResults'));


                    Meteor.call('returnPieFiles',property, fileMedium,entry.name, (error, result) => {

                      this.setState({
                        resultsShow: true,
                      })

                      if (result.length == 0) {

                        render(<center>No results</center>, document.getElementById('searchResults'));
                      } else {
                
                
                        var results = result.map((row, i) => (
                
                          <tr>
                            <td>{row.file}</td> <td>{this.renderBumpButton(row.file)}</td> <td>{this.renderRedoButton(row.file, 'TranscodeDecisionMaker')}</td> <td>{this.renderRedoButton(row.file, 'HealthCheck')}</td><td>{this.renderInfoButton(row)}</td>
                          </tr>
                
                        ));
                
                        render(
                          <table className="pluginTable">   <tbody>
                            <tr><th>File</th>
                              <th>Bump</th>
                              <th>Transcode</th>
                              <th>Health check</th>
                              <th>Info</th></tr>
                
                            {results}
                
                          </tbody></table>
                
                
                          , document.getElementById('searchResults'));
                
                      }
          
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

renderBumpButton(file) {
  var obj = {
    createdAt: new Date()
  }


  return <ItemButton file={file} obj={obj} symbol={'↑'} type="updateDBAction" />

}

renderRedoButton(file, mode) {


  var obj = {
    [mode]: "Queued",
    processingStatus: false,
    createdAt: new Date(),
  }


  return <ItemButton file={file} obj={obj} symbol={'↻'}  type="updateDBAction"/>
}

renderIgnoreButton(file, mode) {

  var obj = {
    [mode]: "Ignored",
    processingStatus: false,
    createdAt: new Date(),
  }
  return <ItemButton file={file} obj={obj} symbol={'Ignore'} type="updateDBAction" />


}

renderInfoButton(row) {



  var result = []

  eachRecursive(row)


  function eachRecursive(obj) {
    for (var k in obj) {
      if (typeof obj[k] == "object" && obj[k] !== null) {
        eachRecursive(obj[k]);
      } else {

        result.push(k + ":" + obj[k])


      }
    }
  }

  // Object.keys(row).forEach(function (key) {

  //   result.push(`${[key]}:${row[key]}`)

  // });

  result = result.map((row, i) => (

    <p>{row}</p>

  ));

  return <Modal
    trigger={<Button variant="outline-dark" >i</Button>}
    modal
    closeOnDocumentClick
  >
    <div className="frame">
      <div className="scroll">
        {result}

      </div>
    </div>
  </Modal>



}



  render() {




    return (


      <div className="containerGeneral">
          <center>
      <header>
          <h1>Stats</h1>
      </header>
      </center>

       <center><p><b>Total files in DB</b>: {this.renderStat('totalFileCount')}</p></center> 

       <center><p><b>Total number of transcodes</b>: {this.renderStat('totalTranscodeCount')}</p></center> 
       <center><p><b>Space saved</b>: {this.renderStat('sizeDiff')} GB</p></center> 

       <center><p><b>Total number of health checks</b>: {this.renderStat('totalHealthCheckCount')}</p></center> 

       <div className={this.state.resultsShow ? '' : 'hidden'}>
       <center>
       <Button variant="outline-dark" onClick={() => {
          this.setState({
            resultsShow: false,
          })

          render("", document.getElementById('searchResults'));



       }} >Clear</Button>
   </center>

<div id="searchResults" ref="searchResults"></div>

</div>

<p>Click on pie segments to load respective files</p>



       <div className="videoStatsContainer">

<center><p><b>Tdarr status</b></p></center> 

  <div className="pieaudiogrid-container">

  <div className="pieaudiogrid-item-title">
  <center><b>Transcode</b>{this.renderStat('tdarrScore')}%</center>
  </div>

  
  <div className="pieaudiogrid-item-title">
  <center><b>Health</b>{this.renderStat('healthCheckScore')}%</center>

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
        <center><b>Codecs</b></center>
        </div>

        <div className="piegrid-item-title">
        <center><b>Containers</b></center>

        </div>

        <div className="piegrid-item-title">
        <center><b>Resolutions</b></center>
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
  <center><b>Codecs</b></center>
  </div>

  
  <div className="pieaudiogrid-item-title">
  <center><b>Containers</b></center>

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