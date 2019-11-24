import React, { Component } from 'react';
import { render } from 'react-dom';
import { Button } from 'react-bootstrap';


export default class App extends Component {

  constructor(props) {
    super(props);


    this.state = { backupStatus: false }


  }

  componentDidMount() {

    this.renderBackups(event)
    this.interval = setInterval(() => this.getBackupStatus(), 500);

  }



  getBackupStatus = () => {


    Meteor.call('getBackupStatus', (error, result) => {

      if(result === false){
        this.setState({
          backupStatus: result,
        });

      }

      try {

        result = result.map(row => {

          return <tr><td><p>{row.name}</p></td><td><p>{row.status}</p></td></tr>
        })


        result = <table><tbody>
          <tr>
            <th><p></p></th>
            <th><p>Status</p></th>

          </tr>
          {result}
        </tbody></table>

        this.setState({
          backupStatus: result,
        });

      } catch (err) { }

    })

  }



  renderBackups = () => {

    Meteor.call('getBackups', (error, result) => {


      var backups = result.map(item => {



        return <tr><td><p>{item.name}</p></td><td><p>{item.size} MB</p></td><td> <Button
          variant="outline-light"
          onClick={() => {

            Meteor.call('restoreBackup', item.name, (error, result) => { })
            window.scrollTo(0, 0)


          }}
        >Restore</Button></td><td> <Button
          variant="outline-light"
          onClick={() => {

            if (confirm('Are you sure you want to delete this backup?')) {

              Meteor.call('deleteBackup', item.name, (error, result) => { 
                if(result == true){

                  alert('Backup deleted!')

                }else{
                  alert('Could not delete backup!')

                }
              })
            }

            



          }}
        >X</Button></td></tr>

      });



      render(
        <table className="itemTable"><tbody>
          <tr>
            <th><p>Date</p></th>
            <th><p>Size</p></th>
            <th><p>Restore</p></th>
            <th><p>Remove</p></th>

          </tr>
          {backups}
        </tbody></table>
        ,

        document.getElementById("backupTable")
      );

    })

  }




  render() {
    return (

      <div className="containerGeneral">
        <div className="tabWrap" >

          <center>
            <header>
              <h1>Backups</h1>
            </header>
          </center>

          <br/>
          <br/>


          <div className={this.state.backupStatus !== false ? '' : 'hidden'}>

            <center> <p>{this.state.backupStatus}</p>

            <Button
          variant="outline-light"
          onClick={() => {
            Meteor.call('resetBackupStatus', (error, result) => { })
          }}
        >Clear</Button>

            </center>

          </div>

          <br/>
          <br/>


          <center><Button
          variant="outline-light"
          onClick={() => {
            Meteor.call('createBackup', (error, result) => { })
          }}
        >Create backup</Button></center>


        <br/>
          <br/>
       

            <center><div id="backupTable"></div></center>


        </div>
      </div>
    );
  }
}
