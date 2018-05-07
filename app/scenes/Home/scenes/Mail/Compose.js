import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import classNames from 'classnames';
import { Button, Form } from 'semantic-ui-react';

import { setActiveFolder, sendMail, confirmationReceived, loadFolder } from '../../../../services/mail/mailActions';
import MailTypes from '../../../../services/mail/mailTypes';

import './mail.scss';

class Compose extends Component {
  constructor(props) {
    super(props);

    this.closeCompose = this.closeCompose.bind(this);
  }

  componentWillMount() {
    if (this.props.mail.reply) {
      const message = this.getActiveMessage();
      this.props.initialize({
        recipient: message.sender,
        subject: `RE: ${message.subject}`,
      });
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

  onSubmit(values) {
    const {
      recipient, subject, body
    } = values;
    this.props.mailActions.sendMail(
      this.props.auth.currentUser.username,
      recipient,
      subject,
      body,
      () => {
        this.props.mailActions.loadFolder(this.props.auth.currentUser.username, MailTypes.OUTBOX);
      },
      (mailObject) => {
        this.props.mailActions.loadFolder(this.props.auth.currentUser.username, MailTypes.OUTBOX);
        this.props.mailActions.loadFolder(this.props.auth.currentUser.username, MailTypes.SENT);
        this.props.mailActions.confirmationReceived(mailObject.uuid);
      }
    );
  }

  getActiveMessage() {
    const {
      messages,
      activeMessage,
      activeFolder
    } = this.props.mail;
    return messages[activeFolder][activeMessage];
  }

  render() {
    const containerClass = classNames({
      visible: true,
      'compose-container': true
    });

    const { handleSubmit } = this.props;

    return (
      <div className={containerClass}>
        <div className="top-detail">
          <span>Compose</span>
          <Button content="CLOSE" onClick={this.closeCompose} className="button--transparent" />
        </div>
        <div>
          <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="mail-form-container">
            <p className="title">New Message</p>
            <div>
              <div className="form-group address-wrap">
                <label>To</label>
                <Field
                  type="text"
                  name="recipient"
                  placeholder="Start typing"
                  component="input"
                  className="textfield"
                />
                <Button type="button" content="ADDRESS BOOK" onClick={this.onClickAddress} className="button--green address-button" />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <Field
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  component="input"
                  className="textfield"
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <Field
                  type="text"
                  name="body"
                  placeholder="Enter message"
                  component="textarea"
                  className="textfield"
                />
              </div>
              <div className="form-group submit-group">
                <label />
                <div className="field">
                  <Button type="button" content="CANCEL" onClick={this.closeCompose} className="button--transparent" />
                  <Button type="submit" content="SEND" className="button--primary" />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

Compose.propTypes = {
  mail: PropTypes.shape({
    messages: PropTypes.object,
    activeFolder: PropTypes.string,
    activeMessage: PropTypes.string,
    reply: PropTypes.bool
  }),
  initialize: PropTypes.func,
  onClose: PropTypes.func,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string
    })
  }),
  mailActions: PropTypes.shape({
    sendMail: PropTypes.func,
    loadFolder: PropTypes.func,
    confirmationReceived: PropTypes.func
  }),
  handleSubmit: PropTypes.func
};

Compose.defaultProps = {
  mail: {},
  initialize: null,
  onClose: null,
  auth: {},
  mailActions: {},
  handleSubmit: null
};

Compose = reduxForm({
  form: 'sendMailForm',
  destroyOnUnmount: true,
})(Compose);

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    mailActions: bindActionCreators({
      setActiveFolder, sendMail, confirmationReceived, loadFolder
    }, dispatch),
  }),
)(Compose);
