import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import classNames from 'classnames';
import { Button, Form } from 'semantic-ui-react';

import { sendMail } from  '../../../../services/mail/mailActions';

import './mail.scss';

class Compose extends Component {

  static propTypes = {
    showCompose: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.closeCompose = this.closeCompose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (nextProps.mail.reply && (nextProps.mail.reply !== this.props.mail.reply)) {
      const message = this.getMessage(props.mail.activeMessage);
      this.props.change('subject', message.title);
      this.props.change('body', message.body);
    }

    if (!nextProps.mail.reply) {
      this.props.change('subject', '');
      this.props.change('body', '');
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
  onClickAddress() {}

  onSubmit = (values) => {
    const { sender, to, subject, body } = values;
    this.props.mailActions.sendMail(sender, to, subject, body);
  };

  getMessage() {
    const { props } = this;

    return props.mail.messages[props.mail.activeMessage];
  }

  render() {
    const props = this.props;
    const containerClass = classNames({
      'compose-container': true,
      'visible': props.mail.showCompose,
    });

    return (
      <div className={containerClass}>
        <div className='top-detail'>
          <span>Compose</span>
          <Button content='CLOSE' onClick={this.closeCompose} className='button--transparent' />
        </div>
        <div>
          <Form onSubmit={this.onSubmit} className='mail-form-container'>
            <p className='title'>New Message</p>
            <div>
              <div className='form-group'>
                <label>Sender</label>
                <Field
                  type='text'
                  name='sender'
                  placeholder='Sender'
                  component='input'
                  className='textfield'
                />
              </div>
              <div className='form-group address-wrap'>
                <label>To</label>
                <Field
                  type='text'
                  name='to'
                  placeholder='Start typing'
                  component='input'
                  className='textfield'
                />
                <Button content='ADDRESS BOOK' onClick={this.onClickAddress} className='button--green address-button' />
              </div>
              <div className='form-group'>
                <label>Subject</label>
                <Field
                  type='text'
                  name='subject'
                  placeholder='Enter subject'
                  component='input'
                  className='textfield'
                />
              </div>
              <div className='form-group'>
                <label>Message</label>
                <Field
                  type='text'
                  name='body'
                  placeholder='Enter message'
                  component='textarea'
                  className='textfield'
                />
              </div>
              <div className='form-group submit-group'>
                <label />
                <div className='field'>
                  <Button content='CANCEL' onClick={this.closeCompose} className='button--transparent' />
                  <Button type='submit' content='SEND' className='button--primary' />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

Compose = reduxForm({
  form: 'sendMailForm',
  destroyOnUnmount: true,
})(Compose);

export default connect(
  state => {
    return {...state.default}
  },
  (dispatch) => ({
    mailActions: bindActionCreators({ sendMail }, dispatch),
  }),
)(Compose);
