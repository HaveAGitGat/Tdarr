
import React, { Component } from 'react';
import ItemButton from './item_Button.jsx'
import Modal from "reactjs-popup";
import ReactTable from "react-table";
import { Button } from 'react-bootstrap';
import { renderToString } from 'react-dom/server'
import { Markup } from 'interweave';


export default class App extends Component{


renderResults(result){

if (result.length == 0) {

    return <center><p>No results</p></center>


  }else{

  var data = result


  function getStreams(file){

    var streams = file.ffProbeData.streams
    streams = streams.map((row) => {
         return <tr>
            <td>{row.index}</td>
            <td>{row.codec_type}</td>
            <td>{row.codec_name}</td>
            <td>{row.bit_rate != undefined ?  parseFloat((row.bit_rate / 1000000).toPrecision(4))+" Mbs" : "-"}</td>
          </tr>

    })

    return <table className="searchResultsTable">
        <tbody>

        {streams}
        </tbody>
      </table>

        
  }

  var getColumnWidth = (rows, accessor, headerText) => {
    var maxWidth = 400
    var magicSpacing = 10
    var cellLength = Math.max(
      ...rows.map(row => (`${row[accessor]}` || '').length),
      headerText.length,
    )
    return Math.min(maxWidth, cellLength * magicSpacing)
  }
  
              var columns = [
                
                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>File</p>
                    </div>
                  ),
                  accessor: 'file',
                  width: getColumnWidth(data, 'file', 'File'),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },

                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Streams</p>
                    </div>
                  ),
                  id: 'streams',
                  accessor: row => {

                    if(row.ffProbeData && row.ffProbeData.streams){
                    var streams = row.ffProbeData.streams
                    streams = streams.map((row) => {
                         return <tr>

<td width="20%"><p>{row.codec_name}</p></td>


<td width="20%"><p>{row.codec_type}</p></td>


                            <td width="20%"><p>{row.bit_rate != undefined ?  parseFloat((row.bit_rate / 1000000).toPrecision(4))+" Mbs" : "-"}</p></td>


                            <td width="20%"><p>{ row.tags != undefined && row.tags.language != undefined ?  row.tags.language : "-"}</p></td>


                            <td width="20%"><p>{ row.tags != undefined && row.tags.title != undefined ?  row.tags.title : "-"}</p></td>
                           
                            
                          </tr>
                    })
            
                    return <table className="streamsTable" minWidth="400">


                        <tbody>

                
{/*                     
                        <col width="20"/>
                <col width="20"/>
                <col width="20"/>
                <col width="20"/>
                <col width="20"/> */}
        

                          {/* <th><p>Codec</p></th>
                          <th><p>Type</p></th>
                          <th><p>Bitrate</p></th>
                          <th><p>Lang</p></th>
                          <th><p>Name</p></th> */}
                        {streams}
                        </tbody>
                      </table>

}else{
return null
}
            
                  },
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                  
                },
                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Codec</p>
                    </div>
                  ),
                  accessor: 'video_codec_name',
                  width: getColumnWidth(data, 'video_codec_name', 'Codec'),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },
                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Resolution</p>
                    </div>
                  ),
                  accessor: 'video_resolution',
                  width: getColumnWidth(data, 'video_resolution', 'Resolution'),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },
                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Size(GB)</p>
                    </div>
                  ),
                  id: 'size',
                  accessor: row => row.file_size != undefined ? parseFloat((row.file_size / 1000).toPrecision(4)) : 0,
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },

                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Bitrate(Mbs)</p>
                    </div>
                  ),
                  id: 'Bitrate',
                  accessor: row => row.bit_rate != undefined ?  parseFloat((row.bit_rate / 1000000).toPrecision(4)) : 0,
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },

                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Duration(s)</p>
                    </div>
                  ),
                  id: 'Duration',
                  accessor: row =>  row.ffProbeData && row.ffProbeData.streams[0]["duration"] ?  parseFloat((row.ffProbeData.streams[0]["duration"])) : 0,
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },


                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Bump</p>
                    </div>
                  ),
                  id: 'Bump',
                  width: 'Bump'.length*10,
                  accessor: row => !(row.bumped instanceof Date) ? this.renderBumpButton(row.file):this.renderCancelBumpButton(row.file),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                  
                },

                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Create sample</p>
                    </div>
                  ),
                  id: 'Create sample',
                  width: 'Create sample'.length*10,
                  accessor: row => this.renderCreateSampleButton(row.file),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                 
                },

                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Transcode</p>
                    </div>
                  ),
                  id: 'Transcode',
                  width: 'Transcode'.length*10,
                  accessor: row => row.TranscodeDecisionMaker == "Queued" ? "Queued("+row.tPosition+")" : this.renderRedoButton(row.file, 'TranscodeDecisionMaker'),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },

                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Health check</p>
                    </div>
                  ),
                  id: 'Health check',
                  width: 'Health check'.length*10,
                  accessor: row => row.HealthCheck == "Queued" ? "Queued("+row.hPosition+")" : this.renderRedoButton(row.file, 'HealthCheck'),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },
                {
                  Header: () => (
                    <div className="pluginTableHeader">  
                    <p>Info</p>
                    </div>
                  ),
                  id: 'Info',
                  width: 'Info'.length*10,
                  accessor: row => this.renderInfoButton(row),
                  getProps: (state, rowInfo, column) => {
                    return {
                      style: {
                        color:"#e1e1e1",
                        fontSize  :"14px",
                      },
                    }
                  }
                },
                {
                    Header: () => (
                      <div className="pluginTableHeader">  
                      <p>History</p>
                      </div>
                    ),
                    id: 'History',
                    width: 'History'.length*10,
                    accessor: row => this.renderHistoryButton(row),
                    getProps: (state, rowInfo, column) => {
                      return {
                        style: {
                          color:"#e1e1e1",
                          fontSize  :"14px",
                        },
                      }
                    }
                  },

       

  
              ]
  
  
              function filterMethod(filter, row){

                try{

               
                if(filter.id == "streams"){

                  var text = renderToString(row[filter.id])

                  
                  if((text).toString().includes(filter.value)){
                    return true
                }


                }else{

                  if((row[filter.id]).toString().includes(filter.value)){
                    return true
                }


                }

              }catch(err){

                return false

              }

              
              }
  
  
              return <div>

                <br/>
               
                  <center><p>Tip: Use the table headers to sort & filter files</p></center>

                  <br/>
             

                  <ReactTable
                      data={data}
                      columns={columns}
                      defaultPageSize={100}
                      pageSizeOptions={[10,100, 1000, 10000]}
                      filterable={true}
                      defaultFilterMethod ={(filter, row) => filterMethod(filter, row)}
                  />
              </div>

}
}


renderBumpButton(file) {
    var obj = {
      bumped: new Date(),
    }
    return <ItemButton file={file} obj={obj} symbol={'↑'} type="updateDBAction" />

  }

  renderCancelBumpButton(file) {
    var obj = {
      bumped: false,
    }
    return <ItemButton file={file} obj={obj} symbol={'X'} type="updateDBAction" />
  }

  renderCreateSampleButton(file){


    return <ItemButton file={file} symbol={'✄'} type="createSample" />

  }

  renderRedoButton(file, mode) {


    var obj = {
      [mode]: "Queued",
      processingStatus: false,
      createdAt: new Date(),
    }


    return <ItemButton file={file} obj={obj} symbol={'↻'} type="updateDBAction" />
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

    result = result.map((row, i) => (

      <p>{row}</p>

    ));

    return <Modal
      trigger={<Button variant="outline-light" ><span className="buttonTextSize">i</span></Button>}
      modal
      closeOnDocumentClick
    >
      <div className="modalContainer">
      <div className="frame">
        <div className="scroll">
        <div className="modalText">
          {result}

          </div>
        </div>
      </div>
      </div>
    </Modal>



  }


  renderHistoryButton(row) {


    if(row.history == undefined){
      result =""
      
    }else{

      var result = row.history
      result = result.split("\n")
       result = result.map((row, i) => (
   
           <Markup content={row} />
         ));
    }


    return <Modal
      trigger={<Button variant="outline-light" ><span className="buttonTextSize">H</span></Button>}
      modal
      closeOnDocumentClick
    >
      <div className="modalContainer">
      <div className="frame">
        <div className="scroll">
        <div className="modalText">
          {result}

          </div>
        </div>
      </div>
      </div>
    </Modal>
  }




render() {
    return (

        <div>

        {this.renderResults(this.props.results)}

        </div>

    )}








}