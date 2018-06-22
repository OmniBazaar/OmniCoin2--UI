import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators, compose } from 'redux';
import { FetchChain } from 'omnibazaarjs';
import { required } from 'redux-form-validators';
import dateformat from 'dateformat';

import classNames from 'classnames';
import { Button, Form } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import { setActiveFolder, sendMail, confirmationReceived, loadFolder } from '../../../../services/mail/mailActions';
import MailTypes from '../../../../services/mail/mailTypes';

import './mail.scss';

const mailMessages = defineMessages({
  compose: {
    id: 'Mail.compose',
    defaultMessage: 'Compose'
  },
  close: {
    id: 'Mail.close',
    defaultMessage: 'CLOSE'
  },
  newMessage: {
    id: 'Mail.newMessage',
    defaultMessage: 'New Message'
  },
  to: {
    id: 'Mail.to',
    defaultMessage: 'To'
  },
  subject: {
    id: 'Mail.subject',
    defaultMessage: 'Subject'
  },
  enterSubject: {
    id: 'Mail.enterSubject',
    defaultMessage: 'Enter subject'
  },
  startTyping: {
    id: 'Mail.startTyping',
    defaultMessage: 'Start typing'
  },
  message: {
    id: 'Mail.message',
    defaultMessage: 'Message'
  },
  enterMessage: {
    id: 'Mail.enterMessage',
    defaultMessage: 'Enter message'
  },
  send: {
    id: 'Mail.send',
    defaultMessage: 'SEND'
  },
  cancel: {
    id: 'Mail.cancel',
    defaultMessage: 'CANCEL'
  },
  addressBook: {
    id: 'Mail.addressBook',
    defaultMessage: 'ADDRESS BOOK'
  },
  success: {
    id: 'Mail.success',
    defaultMessage: 'Success'
  },
  mailSent: {
    id: 'Mail.mailSent',
    defaultMessage: 'Mail sent successfully'
  },
  error: {
    id: 'Mail.error',
    defaultMessage: 'Error'
  },
  mailNotSent: {
    id: 'Mail.mailNotSent',
    defaultMessage: 'There was an error while trying to send your mail'
  },
  usernameDoesNotExist: {
    id: 'Mail.usernameDoesNotExist',
    defaultMessage: 'Not found'
  },
  required: {
    id: 'Mail.required',
    defaultMessage: 'Required'
  }
});

class Compose extends Component {

  static asyncValidate = async (values, dispatch, props, field) => {
    const previousErrors = props.asyncErrors;
    if (field === 'recipient') {
      try {
        const account = await FetchChain('getAccount', values.recipient);
      } catch (e) {
        throw  {
          ...previousErrors,
          recipient: mailMessages.usernameDoesNotExist
        }
      }
    }
    if (previousErrors) {
      throw previousErrors;
    }
  };

  constructor(props) {
    super(props);

    this.closeCompose = this.closeCompose.bind(this);
  }

  componentWillMount() {
    if (this.props.mail.reply) {
      const message = this.getActiveMessage();
      const creationTime = new Date(message.creation_time * 1000).toLocaleString();
      const date = dateformat(creationTime, 'dddd, mmmm dS, yyyy "at" h:MM:ss TT');

      this.props.initialize({
        recipient: message.sender,
        subject: `RE: ${message.subject}`,
        body: `\n\nOn ${date} <${message.sender}> wrote:\n\n${message.body}`,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mailSent, error } = this.props.mail;
    const { formatMessage } = this.props.intl;

    if (mailSent !== nextProps.mail.mailSent) {
      if (nextProps.mail.mailSent) {
        this.closeCompose();
        toastr.success(formatMessage(mailMessages.success), formatMessage(mailMessages.mailSent));
      }
    }

    if (error !== nextProps.mail.error) {
      if (nextProps.mail.error) {
        this.closeCompose();
        toastr.error(formatMessage(mailMessages.error), formatMessage(mailMessages.mailNotSent));
      }
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

  renderRecipientField = ({
                           input, disabled, loading, meta: { touched, error, warning }
                         }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
        <div className="form-group address-wrap">
          <label>
            {formatMessage(mailMessages.to)}*
            <br/>
            {touched && ((error && <span className="error">{errorMessage}</span>))}
          </label>
          <input
            {...input}
            type="text"
            className="textfield"
            placeholder={formatMessage(mailMessages.startTyping)}
          />
          {/*<Button type="button" content={formatMessage(mailMessages.addressBook)} onClick={this.onClickAddress} className="button--green address-button" />*/}
        </div>
    );
  };

  render() {
    const containerClass = classNames({
      visible: true,
      'compose-container': true
    });

    const {
      loading
    } = this.props.mail;

    const {
      handleSubmit,
      asyncValidating,
      invalid
    } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className={containerClass}>
        <div className="top-detail">
          <span>{formatMessage(mailMessages.compose)}</span>
          <Button content={formatMessage(mailMessages.close)} onClick={this.closeCompose} className="button--transparent" />
        </div>
        <div>
          <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="mail-form-container">
            <p className="title">{formatMessage(mailMessages.newMessage)}</p>
            <div>
              <Field
                name="recipient"
                component={this.renderRecipientField}
                validate={required({ message: formatMessage(mailMessages.required) })}
                autoFocus
              />
              <div className="form-group">
                <label>{formatMessage(mailMessages.subject)}</label>
                <Field
                  type="text"
                  name="subject"
                  placeholder={formatMessage(mailMessages.enterSubject)}
                  component="input"
                  className="textfield"
                />
              </div>
              <div className="form-group">
                <label>{formatMessage(mailMessages.message)}</label>
                <Field
                  type="text"
                  name="body"
                  placeholder={formatMessage(mailMessages.enterMessage)}
                  component="textarea"
                  className="textfield"
                />
              </div>
              <div className="form-group submit-group">
                <label />
                <div className="field">
                  <Button
                    type="button"
                    content={formatMessage(mailMessages.cancel)}
                    onClick={this.closeCompose}
                    loading={loading}
                    className="button--transparent"
                  />
                  <Button
                    type="submit"
                    content={formatMessage(mailMessages.send)}
                    className="button--primary"
                    loading={loading}
                    disabled={invalid || asyncValidating}
                  />
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
    reply: PropTypes.bool,
    mailSent: PropTypes.bool,
    error: PropTypes.string
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
  handleSubmit: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Compose.defaultProps = {
  mail: {},
  initialize: null,
  onClose: null,
  auth: {},
  mailActions: {},
  handleSubmit: null,
  intl: {}
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      mailActions: bindActionCreators({
        setActiveFolder, sendMail, confirmationReceived, loadFolder
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'sendMailForm',
    asyncValidate: Compose.asyncValidate,
    asyncBlurFields: ['recipient'],
    destroyOnUnmount: true,
  }),
)(injectIntl(Compose));
