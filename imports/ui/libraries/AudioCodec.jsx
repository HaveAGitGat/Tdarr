import Checkbox from '@material-ui/core/Checkbox';
import React, {Component} from 'react';

export default class AudioCodec extends Component {
  constructor(props) {
    super(props);

    this.toggleChecked = this.toggleChecked.bind(this);
    this.deleteThisCodec = this.deleteThisCodec.bind(this);
  }

  toggleChecked(event) {
    Meteor.call(
      'updateAudioCodecExclude',
      this.props.DB_id,
      this.props.audiocodec.codec,
      event.target.checked
    );
  }

  deleteThisCodec() {
    Meteor.call(
      'removeAudioCodecExclude',
      this.props.DB_id,
      this.props.audiocodec.codec,
      event.target.checked
    );
  }

  render() {
    return (
      <tr>
        <td>
          <Checkbox
            checked={!!this.props.audiocodec.checked}
            onChange={this.toggleChecked}
          />
        </td>

        <td>
          <p>{this.props.audiocodec.codec}</p>
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
