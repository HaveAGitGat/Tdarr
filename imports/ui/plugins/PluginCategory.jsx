import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Modal from "reactjs-popup";
import ClipLoader from 'react-spinners/ClipLoader';

// App component - represents the whole app
export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedNav: 'All',
      showPlugin:false,
    };

  }

  

  componentDidMount() {

    setTimeout(this.showPluginCard, 1000);

  }

  showPluginCard = () => {
    this.setState({showPlugin:true,})
  }

  renderPlugins(returnCount, pluginType, cattags) {

    //'h265,hevc'


    var result = this.props.pluginsStoredFiltered

    if (result.length == 0) {

      if (returnCount) {
        return 0
      } else {
        return <p>No plugins</p>
      }




    } else {

      result = this.props.pluginsStoredFiltered.filter(row => {
        if (row.source == pluginType) {
          return true
        }
        return false
      })



      cattags = cattags.split(',')

      result = result.filter(row => {

        //  console.log(row)

        var plugTags = row.Tags

        try {
          plugTags.split(',').map(row => row.toLowerCase())
        } catch (err) {
          plugTags = ['']
        }

        for (var i = 0; i < cattags.length; i++) {
          if (plugTags.includes(cattags[i].toLowerCase()))

            return true

        }

        return false

      })

      if (returnCount) {
        return result.length
      }



      result = result.map(row =>   <div><div className={this.state.showPlugin ? '' : 'd-none'}><div className="pluginCard">

        <center><p>{row.Name}</p></center>

        <br />
        <p>{row.Description}</p>


        <div className="pluginCardBottom">
          <div className="box">
            <CopyToClipboard text={row.id}>
              <Button variant="outline-light" ><span className="buttonTextSize">Copy id</span></Button>
            </CopyToClipboard>{'\u00A0'}
            {row.Inputs ? <Modal
              trigger={<Button variant="outline-light" ><span className="buttonTextSize">Configurable</span></Button>}
              modal
              closeOnDocumentClick
            >
              <div className="modalContainer">
                <div className="frame">
                  <div className="scroll">
                    <div className="modalText">

                      {row.Inputs.map(input => {

                        var tooltip = input.tooltip.split('\\n')



                        for (var i = 0; i < tooltip.length; i++) {

                          var current = i

                          if (tooltip[i].includes('Example:') && i + 1 < tooltip.length) {
                            tooltip[i + 1] = <div className="toolTipHighlight"><p>{tooltip[i + 1]}</p></div>
                            i++
                          }

                          tooltip[current] = <p>{tooltip[current]}</p>
                        }

                        return <div className="pluginModal">

                          <p className="pluginInput">{input.name}</p>

                          {tooltip}

                          <br />
                          <br />



                        </div>


                      })}





                    </div>
                  </div>
                </div>
              </div>
            </Modal> : null}

          <p>Tags:{row.Tags}</p> 

          </div>

          </div>
        </div>
        </div>

        <div className={!this.state.showPlugin ? '' : 'd-none'} >
          <div className="pluginCardLoading">
            <center>
              <ClipLoader

                sizeUnit={"px"}
                size={40}
                color={'white'}
                loading={true}
              />
            </center>
          </div>

        </div>



      </div>)

      return <div className="box">{result}</div>


    }
  }


  render() {
    return (




      <div className="libraryContainer2">


        <div className="pluginTabGrid-container">

          <div className="pluginTabGrid-itemLeft">

            <br />
            <br />
            <br />

            <p onClick={() => {
              this.setState({ selectedNav: 'All' })
            }} className={this.state && this.state.selectedNav == "All" ? 'selectedNav' : 'unselectedNav'}>All ({this.renderPlugins(true, this.props.pluginType, '')})</p>


            <br />
            

            <p onClick={() => {
              this.setState({ selectedNav: 'H265/HEVC' })
            }} className={this.state && this.state.selectedNav == "H265/HEVC" ? 'selectedNav' : 'unselectedNav'}>H265/HEVC ({this.renderPlugins(true, this.props.pluginType, 'h265,hevc')})</p>


            <p onClick={() => {
              this.setState({ selectedNav: 'H264' })
            }} className={this.state && this.state.selectedNav == "H264" ? 'selectedNav' : 'unselectedNav'}>H264 ({this.renderPlugins(true, this.props.pluginType, 'h264')})</p>



            <br />
            



            <p onClick={() => {
              this.setState({ selectedNav: 'NVENC H265' })
            }} className={this.state && this.state.selectedNav == "NVENC H265" ? 'selectedNav' : 'unselectedNav'}>NVENC H265 ({this.renderPlugins(true, this.props.pluginType, 'nvenc h265')})</p>



            <p onClick={() => {
              this.setState({ selectedNav: 'NVENC H264' })
            }} className={this.state && this.state.selectedNav == "NVENC H264" ? 'selectedNav' : 'unselectedNav'}>NVENC H264 ({this.renderPlugins(true, this.props.pluginType, 'nvenc h264')})</p>


            <br />
            


            <p onClick={() => {
              this.setState({ selectedNav: 'Video only' })
            }} className={this.state && this.state.selectedNav == "Video only" ? 'selectedNav' : 'unselectedNav'}>Video only ({this.renderPlugins(true, this.props.pluginType, 'video only')})</p>


            <p onClick={() => {
              this.setState({ selectedNav: 'Audio only' })
            }} className={this.state && this.state.selectedNav == "Audio only" ? 'selectedNav' : 'unselectedNav'}>Audio only ({this.renderPlugins(true, this.props.pluginType, 'audio only')})</p>

            <p onClick={() => {
              this.setState({ selectedNav: 'Subtitle only' })
            }} className={this.state && this.state.selectedNav == "Subtitle only" ? 'selectedNav' : 'unselectedNav'}>Subtitle only ({this.renderPlugins(true, this.props.pluginType, 'subtitle only')})</p>



            <br />
            



            <p onClick={() => {
              this.setState({ selectedNav: 'HandBrake' })
            }} className={this.state && this.state.selectedNav == "HandBrake" ? 'selectedNav' : 'unselectedNav'}>HandBrake ({this.renderPlugins(true, this.props.pluginType, 'handbrake')})</p>



            <p onClick={() => {
              this.setState({ selectedNav: 'FFmpeg' })
            }} className={this.state && this.state.selectedNav == "FFmpeg" ? 'selectedNav' : 'unselectedNav'}>FFmpeg ({this.renderPlugins(true, this.props.pluginType, 'ffmpeg')})</p>


            <br />
            


            <p onClick={() => {
              this.setState({ selectedNav: 'Radarr' })
            }} className={this.state && this.state.selectedNav == "Radarr" ? 'selectedNav' : 'unselectedNav'}>Radarr ({this.renderPlugins(true, this.props.pluginType, 'radarr')})</p>

            <p onClick={() => {
              this.setState({ selectedNav: 'Sonarr' })
            }} className={this.state && this.state.selectedNav == "Sonarr" ? 'selectedNav' : 'unselectedNav'}>Sonarr ({this.renderPlugins(true, this.props.pluginType, 'sonarr')})</p>


            <br />
            


            <p onClick={() => {
              this.setState({ selectedNav: 'Pre-processing' })
            }} className={this.state && this.state.selectedNav == "Pre-processing" ? 'selectedNav' : 'unselectedNav'}>Pre-processing ({this.renderPlugins(true, this.props.pluginType, 'pre-processing')})</p>



            <p onClick={() => {
              this.setState({ selectedNav: 'Post-processing' })
            }} className={this.state && this.state.selectedNav == "Post-processing" ? 'selectedNav' : 'unselectedNav'}>Post-processing ({this.renderPlugins(true, this.props.pluginType, 'post-processing')})</p>


            <br />


            <p onClick={() => {
              this.setState({ selectedNav: 'Configurable' })
            }} className={this.state && this.state.selectedNav == "Configurable" ? 'selectedNav' : 'unselectedNav'}>Configurable ({this.renderPlugins(true, this.props.pluginType, 'configurable')})</p>




            <br />
            <br />
            <br />
            <br />
            <br />
            <br />



          </div>




          <div className="pluginTabGrid-itemRight">

            <div className={this.state && this.state.selectedNav == "All" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, '')}
            </div>


            <div className={this.state && this.state.selectedNav == "H265/HEVC" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'h265,hevc')}
            </div>


            <div className={this.state && this.state.selectedNav == "H264" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'h264')}
            </div>


            <div className={this.state && this.state.selectedNav == "NVENC H265" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'nvenc h265')}
            </div>


            <div className={this.state && this.state.selectedNav == "NVENC H264" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'nvenc h264')}
            </div>


            <div className={this.state && this.state.selectedNav == "Video only" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'video only')}
            </div>

            <div className={this.state && this.state.selectedNav == "Audio only" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'audio only')}
            </div>


            <div className={this.state && this.state.selectedNav == "Subtitle only" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'subtitle only')}
            </div>


            <div className={this.state && this.state.selectedNav == "HandBrake" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'handbrake')}
            </div>


            <div className={this.state && this.state.selectedNav == "FFmpeg" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'ffmpeg')}
            </div>


            <div className={this.state && this.state.selectedNav == "Radarr" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'radarr')}
            </div>


            <div className={this.state && this.state.selectedNav == "Sonarr" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'sonarr')}
            </div>


            <div className={this.state && this.state.selectedNav == "Pre-processing" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'pre-processing')}
            </div>


            <div className={this.state && this.state.selectedNav == "Post-processing" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'post-processing')}
            </div>

            <div className={this.state && this.state.selectedNav == "Configurable" ? '' : 'd-none'}>
              {this.renderPlugins(false, this.props.pluginType, 'configurable')}
            </div>


          </div>


        </div>


      </div>
    );
  }
}



