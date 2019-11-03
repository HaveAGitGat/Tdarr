import Checkbox from '@material-ui/core/Checkbox';
import React, {Component} from 'react';

export default class VideoCodec extends Component {
  constructor(props) {
    super(props);

    this.toggleChecked = this.toggleChecked.bind(this);
    this.deleteThisCodec = this.deleteThisCodec.bind(this);
  }

  toggleChecked(event) {
    Meteor.call(
      'updateVideoCodecExclude',
      this.props.DB_id,
      this.props.videocodec.codec,
      event.target.checked
    );
  }

  deleteThisCodec() {
    Meteor.call(
      'removeVideoCodecExclude',
      this.props.DB_id,
      this.props.videocodec.codec,
      event.target.checked
    );
  }

  render() {
    return (
      <tr>
        <td>
          <Checkbox
            checked={!!this.props.videocodec.checked}
            onChange={this.toggleChecked}
          />
        </td>

        <td>
          <p> {this.props.videocodec.codec}</p>
        </td>

        <td>
          <button
            className="deleteCodecButton"
            onClick={this.deleteThisCodec.bind(this)}
          >
            &times;
          </button>
        </td>
      </tr>
    );
  }
}
