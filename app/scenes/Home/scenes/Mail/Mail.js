import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import hash from 'object-hash';
import { injectIntl } from 'react-intl';

import { Button, Image } from 'semantic-ui-react';
import classNames from 'classnames';
import SplitPane from 'react-split-pane';
import Compose from './Compose';

import InboxIcon from './images/folder-inbox.svg';
import OutboxIcon from './images/folder-outbox.svg';
import SentIcon from './images/folder-sent.svg';
import DeletedIcon from './images/folder-deleted.svg';
import MailTypes from '../../../../services/mail/mailTypes';

import {
  showComposeModal,
  setActiveFolder,
  deleteMail,
  loadFolder,
  mailSetRead,
  allMailsSetRead,
  setActiveMessage,
  showReplyModal
} from '../../../../services/mail/mailActions';
import Header from '../../../../components/Header';

import './mail.scss';
import { getBodyFromMessage, getSubjectFromMessage } from './utils';
import messages from "./messages";

let folders = null;

const iconSize = 20;

class Mail extends Component {
  static renderFolderIcon(folderType) {
    let icon;
    switch (folderType) {
      case MailTypes.INBOX:
        icon = InboxIcon;
        break;
      case MailTypes.OUTBOX:
        icon = OutboxIcon;
        break;
      case MailTypes.SENT:
        icon = SentIcon;
        break;
      case MailTypes.DELETED:
        icon = DeletedIcon;
        break;
      default:
        icon = InboxIcon;
    }

    return (
      <Image src={icon} width={iconSize} height={iconSize} />
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
    };

    this.onClickCompose = this.onClickCompose.bind(this);
    this.onCloseCompose = this.onCloseCompose.bind(this);
    this.onClickReply = this.onClickReply.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);

    const { formatMessage } = props.intl;
    folders = [
      {
        type: MailTypes.INBOX,
        label: formatMessage(messages.inboxFolder),
        newEmails: 1,
      },
      {
        type: MailTypes.OUTBOX,
        label: formatMessage(messages.sentFolder),
        newEmails: 0,
      },
      {
        type: MailTypes.SENT,
        label: formatMessage(messages.deliveredFolder),
        newEmails: 0,
      },
      {
        type: MailTypes.DELETED,
        label: formatMessage(messages.deletedFolder),
        newEmails: 0,
      }
    ];
  }

  componentWillMount() {
    const { username } = this.props.history.location;
    if (username) {
      this.props.mailActions.showComposeModal(null, username);
    }
  }

  componentDidMount() {
    const { username } = this.props.auth.currentUser;
    this.props.mailActions.loadFolder(username, MailTypes.INBOX);
    this.props.mailActions.loadFolder(username, MailTypes.OUTBOX);
    this.props.mailActions.loadFolder(username, MailTypes.SENT);
    this.props.mailActions.loadFolder(username, MailTypes.DELETED);
    this.props.mailActions.allMailsSetRead(
      this.props.auth.currentUser.username,
      MailTypes.INBOX
    );
    this.changeFolder(MailTypes.INBOX);
  }


  changeFolder(activeFolder) {
    const { username } = this.props.auth.currentUser;
    this.props.mailActions.loadFolder(username, activeFolder);
    this.props.mailActions.setActiveFolder(activeFolder);
    this.props.mailActions.setActiveMessage(0);
    this.setState({
      width: this.container.offsetWidth,
    });
  }

  /**
   * Renders folders for mail: inbox, outbox, sent, etc
   */
  renderItems() {
    const { props } = this;
    const self = this;

    return folders.map((folder, index) => {
      const containerClass = classNames({
        item: true,
        active: props.mail.activeFolder === folder.type,
        'last-item': index === folders.length - 1,
      });

      // calculate is there some new emails
      const sumReducer = (accumulator, currentMessage) => (
        accumulator + (currentMessage.read_status ? 0 : 1)
      );
      const numberOfUnreadMessagesInFolder = props.mail.messages[folder.type].reduce(sumReducer, 0);

      return (
        <div key={`folder-${index}`} className={containerClass} onClick={() => self.changeFolder(folder.type)}>
          {Mail.renderFolderIcon(folder.type)}
          <span>{folder.label}</span>
          <span className="amount">{numberOfUnreadMessagesInFolder > 0 ? numberOfUnreadMessagesInFolder : ''}</span>
        </div>
      );
    });
  }

  clickedEmail(message, index) {
    this.props.mailActions.setActiveMessage(index);

    const currentMessageObject = this.props.mail.messages[this.props.mail.activeFolder][index];
    if (currentMessageObject.read_status === false) {
      this.props.mailActions.mailSetRead(
        this.props.auth.currentUser.username,
        this.props.mail.activeFolder, message.uuid, () => {
          this.props.mailActions.loadFolder(
            this.props.auth.currentUser.username,
            this.props.mail.activeFolder
          );
        }
      );
    }
  }

  /**
   * Renders the list of emails
   */
  renderMessages() {
    const { props } = this;
    const self = this;
    const emailData = props.mail.messages[props.mail.activeFolder];
    const { formatMessage } = this.props.intl;

    if (emailData.length > 0) {
      return emailData.map((message, index) => {
        const containerClass = classNames({
          'mail-summary': true,
          active: props.mail.activeMessage === index,
          new: !message.read_status,
        });

        const creationTime = new Date(message.creation_time * 1000).toLocaleString();

        return (
          <div
            key={hash(message)}
            className={containerClass}
            onClick={() => self.clickedEmail(message, index)}
            onKeyDown={() => self.clickedEmail(message, index)}
            tabIndex={0}
            role="link"
          >
            <div className="top-detail">
              <div className="from">{message.user}</div>
              <div className="date">{creationTime}</div>
            </div>
            <div className="title">
              {getSubjectFromMessage(message, formatMessage)}
            </div>
          </div>
        );
      });
    }
  }

  getMessage() {
    const { props } = this;
    const emailData = props.mail.messages[props.mail.activeFolder];

    if (emailData.length > 0) {
      return emailData[props.mail.activeMessage];
    }
  }

  renderMessage() {
    const message = this.getMessage();
    const { formatMessage } = this.props.intl;

    if (!message) {
      return <div />;
    }

    const creationTime = new Date(message.creation_time * 1000).toLocaleString();

    return (
      <div className="mail-message">
        <div className="message-header">
          <div className="top-detail">
            <div className="from">{message.user}</div>
            <div className="date">{creationTime}</div>
          </div>
          <div className="mail-title">
            <div className="title">
              {getSubjectFromMessage(message, formatMessage)}
            </div>
            <div>
              { this.props.mail.activeFolder === MailTypes.INBOX &&
              <Button content="REPLY" onClick={this.onClickReply} className="button--transparent" />
              }
              <Button content="DELETE" onClick={this.onClickDelete} className="button--transparent" />
            </div>
          </div>
        </div>
        <div className="message-body">
          {getBodyFromMessage(message, formatMessage)}
        </div>
      </div>
    );
  }

  onClickReply() {
    this.props.mailActions.showReplyModal();
  }

  onClickDelete() {
    if (this.props.mail.activeMessage >= 0) {
      const messageObjToDelete =
        this.props.mail.messages[this.props.mail.activeFolder][this.props.mail.activeMessage];
      this.props.mailActions.deleteMail(
        this.props.auth.currentUser.username,
        this.props.mail.activeFolder,
        messageObjToDelete,
        () => {
          this.props.mailActions.loadFolder(
            this.props.auth.currentUser.username,
            this.props.mail.activeFolder
          );
        }
      );
    }
  }

  onClickCompose() {
    this.props.mailActions.showComposeModal();
  }

  onCloseCompose() {
    this.props.mailActions.showComposeModal();
  }

  render() {
    const { props } = this;
    const { width } = this.state;

    const containerClass = classNames({
      overlay: true,
      'composer-visible': props.mail.showCompose,
    });
    const defaultSize = width / 5;

    return (
      <div ref={container => { this.container = container; }} className="container">
        <div className={containerClass} onClick={this.onCloseCompose} />
        <Header hasButton buttonContent="COMPOSE" title="Mail" className="button--primary" onClick={this.onClickCompose} />
        <div className="body">
          <SplitPane split="vertical" minSize={50} defaultSize={defaultSize} style={{ position: 'relative' }}>
            <div className="mail-items">
              {this.renderItems()}
            </div>
            <SplitPane split="vertical" minSize={50} defaultSize={defaultSize} style={{ position: 'relative' }} className="second-split-pane">
              <div className="mail-messages">
                {this.renderMessages()}
              </div>
              {this.renderMessage()}
            </SplitPane>
          </SplitPane>
        </div>
        {props.mail.showCompose &&
          <Compose
            onClose={this.onCloseCompose}
          />
        }
      </div>
    );
  }
}

Mail.propTypes = {
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string
    })
  }),
  mailActions: PropTypes.shape({
    showComposeModal: PropTypes.func,
    deleteMail: PropTypes.func,
    loadFolder: PropTypes.func,
    mailSetRead: PropTypes.func,
    allMailsSetRead: PropTypes.func,
    setActiveFolder: PropTypes.func,
    setActiveMessage: PropTypes.func,
    showReplyModal: PropTypes.func
  }),
  mail: PropTypes.shape({
    messages: PropTypes.object,
    activeFolder: PropTypes.string,
    activeMessage: PropTypes.string
  })
};

Mail.defaultProps = {
  auth: {},
  mailActions: {},
  mail: {}
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    mailActions: bindActionCreators({
      showComposeModal,
      deleteMail,
      loadFolder,
      mailSetRead,
      allMailsSetRead,
      setActiveFolder,
      setActiveMessage,
      showReplyModal,
    }, dispatch),
  }),
)(injectIntl(Mail));
