import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FileDB,StatisticsDB,GlobalSettingsDB } from '../api/tasks.js';
import ReactDOM from 'react-dom';
import ClipLoader from 'react-spinners/ClipLoader';


import { PieChart, Pie, Sector, Cell, Tooltip, Label,ResponsiveContainer} from 'recharts';


let renderLabel = function (entry) {
  return entry.name;
}



// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);

    this.state = { listItems: [1, 2] };
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

  renderPie(pie) {



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
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
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
          <center>
      <header>
          <h1>Stats</h1>
      </header>
      </center>

       <center><p><b>Total files in DB</b>: {this.renderStat('totalFileCount')}</p></center> 

       <center><p><b>Total number of transcodes</b>: {this.renderStat('totalTranscodeCount')}</p></center> 
       <center><p><b>Space saved</b>: {this.renderStat('sizeDiff')} GB</p></center> 

       <center><p><b>Total number of health checks</b>: {this.renderStat('totalHealthCheckCount')}</p></center> 



       <div className="videoStatsContainer">

<center><p><b>Tdarr status</b></p></center> 

  <div className="pieaudiogrid-container">

  <div className="pieaudiogrid-item-title">
  <center><b>Transcodes </b>{this.renderStat('tdarrScore')}%</center>
  </div>

  
  <div className="pieaudiogrid-item-title">
  <center><b>Health checks </b>{this.renderStat('healthCheckScore')}%</center>

  </div>







  <div className="pieaudiogrid-item">

 

  {this.renderPie('pie1')}

    </div>



    <div className="pieaudiogrid-item">

    {this.renderPie('pie2')}


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
          
        {this.renderPie('pie3')}

          </div>


          <div className="piegrid-item">
     
          {this.renderPie('pie4')}

          </div>
        

        <div className="piegrid-item">


        {this.renderPie('pie5')}


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
    

  {this.renderPie('pie6')}

    </div>



    <div className="pieaudiogrid-item">

    {this.renderPie('pie7')}


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