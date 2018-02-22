import React, {Component} from 'react';
import classNames from 'classnames';
import Button, {ButtonTypes} from '../../../../components/Button';
import TextField, {TextFieldTypes} from '../../../../components/TextField';

import './mail.scss';

export default class Compose extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showCompose: false,
    };

    this.closeCompose = this.closeCompose.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickSend = this.onClickSend.bind(this);
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

  /**
   * Todo: to implement
   */
  onClickSend() {}

  /**
   * Todo: to implement
   */
  onClickCancel() {}


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
            <div className='form-group'>
              <label>Sender</label>
              <TextField type={TextFieldTypes.TEXT} placeholder='Sender' />
            </div>
            <div className='form-group address-wrap'>
              <label>To</label>
              <TextField type={TextFieldTypes.TEXT} placeholder='Start typing' />
              <Button type={ButtonTypes.GREEN} className='address-button'>ADDRESS BOOK</Button>
            </div>
            <div className='form-group'>
              <label>Subject</label>
              <TextField
                type={TextFieldTypes.TEXT}
                placeholder='Enter subject'
                value={this.props.subject}
                onChangeText={this.props.onChangeSubject}
              />
            </div>
            <div className='form-group'>
              <label>Message</label>
              <TextField
                type={TextFieldTypes.TEXT}
                multiline
                numberOfLines={15}
                placeholder='Enter message'
                value={this.props.body}
                onChangeText={this.props.onChangeBody}
              />
            </div>
            <div className='form-group submit-group'>
              <label />
              <div className='field'>
                <Button type={ButtonTypes.TRANSPARENT} onClick={this.onClickCancel}>CANCEL</Button>
                <Button type={ButtonTypes.PRIMARY} onClick={this.onClickSend}>SEND</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
