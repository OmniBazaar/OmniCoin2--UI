import React, {Component} from 'react';
import classNames from 'classnames';
import Button, {ButtonTypes} from '../../../../components/Button';
import TextField, {TextFieldTypes} from '../../../../components/TextField';

import './mail.scss';

export default class Compose extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showCompose: false
    };

    this.closeCompose = this.closeCompose.bind(this);
  }

  componentDidMount() {
    if (this.state.showCompose !== this.props.showCompose) {
      this.setState({ showCompose: this.state.showCompose });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showCompose !== this.props.showCompose) {
      this.setState({ showCompose: nextProps.showCompose });
    }
  }

  closeCompose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { showCompose } = this.state;
    const containerClass = classNames({
      'compose-container': true,
      'visible': showCompose,
    });

    return (
      <div className={containerClass}>
        <div className='top-detail'>
          <span>Compose</span>
          <Button type={ButtonTypes.TRANSPARENT} onClick={this.closeCompose}>CLOSE</Button>
        </div>
        <div>
          <p className='title'>New Message</p>
          <div>
            <div className='form-fields'>
              <label>Sender</label>
              <TextField type={TextFieldTypes.TEXT} placeholder='Sender here' />
            </div>
            <div className='form-fields'>
              <label>To</label>
              <TextField type={TextFieldTypes.TEXT} placeholder='Start typing' />
              <Button type={ButtonTypes.GREEN}>ADDRESS BOOK</Button>
            </div>
            <div className='form-fields'>
              <label>Subject</label>
              <TextField type={TextFieldTypes.TEXT} placeholder='Enter subject' />
            </div>
            <div className='form-fields'>
              <label>Message</label>
              <TextField type={TextFieldTypes.TEXT} multiline placeholder='Enter message' />
            </div>
            <div>
              <Button type={ButtonTypes.TRANSPARENT}>CANCEL</Button>
              <Button type={ButtonTypes.PRIMARY}>SEND</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
