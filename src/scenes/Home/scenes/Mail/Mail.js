import React, { Component } from 'react';
import {connect} from 'react-redux';

import { Button, Image } from 'semantic-ui-react'
import classNames from 'classnames';
import SplitPane from 'react-split-pane';
import Compose from './Compose';

import InboxIcon from './images/folder-inbox.svg';
import OutboxIcon from './images/folder-outbox.svg';
import SentIcon from './images/folder-sent.svg';
import DeletedIcon from './images/folder-deleted.svg';

import {
  showComposeModal,
  setActiveFolder,
  setActiveMessage,
  getMessages,
  showReplyModal,
} from  '../../../../services/mail/mailActions';

import './mail.scss';

const MailTypes = Object.freeze({
  INBOX: 'inbox',
  OUTBOX: 'outbox',
  SENT: 'sent',
  DELETED: 'deleted',
});

const messages = [
  {
    id: 1,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: 'Email title',
    body: 'The email body goes over here',
    read: true,
  },
  {
    id: 2,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: 'Hey there',
    body: 'This is a test for emails',
    read: false,
  },
  {
    id: 3,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: 'Yet another email',
    body: 'Testing the emails',
    read: true,
  },
];

const outboxMessages = [
  {
    id: 1,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: '(Outbox) Email title',
    body: 'The email body goes over here',
    read: true,
  },
  {
    id: 2,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: '(Outbox) Hey there',
    body: 'This is a test for emails',
    read: false,
  },
  {
    id: 3,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: '(Outbox) Yet another email',
    body: 'Testing the emails',
    read: true,
  },
];

const sentMessages = [
  {
    id: 1,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: '(Sent) Email title',
    body: 'The email body goes over here',
    read: true,
  },
];

const deletedMessages = [
  {
    id: 1,
    from: 'test@email.com',
    date: '21 JAN 2018, 08:56:15 AM',
    time: '08:56:15 AM',
    title: '(Deleted) Email title',
    body: 'The email body goes over here',
    read: true,
  },
];

const folders = [
  {
    type: MailTypes.INBOX,
    label: 'Inbox',
    newEmails: 1,
  },
  {
    type: MailTypes.OUTBOX,
    label: 'Outbox',
    newEmails: 0,
  },
  {
    type: MailTypes.SENT,
    label: 'Sent',
    newEmails: 0,
  },
  {
    type: MailTypes.DELETED,
    label: 'Deleted',
    newEmails: 0,
  }
];

const iconSize = 20;

class Mail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
    };

    this.onClickCompose = this.onClickCompose.bind(this);
    this.onCloseCompose = this.onCloseCompose.bind(this);
    this.onClickReply = this.onClickReply.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount () {
    this.fetchMessages(this.props.activeFolder);
  }

  /*
   * Todo: this method needs to be changed to fetch the messages
   * when backend is implemented.
   */
  fetchMessages(activeFolder) {
    let emails = messages;

    switch (activeFolder) {
      case MailTypes.INBOX:
        emails = messages;
        break;
      case MailTypes.OUTBOX:
        emails = outboxMessages;
        break;
      case MailTypes.SENT:
        emails = sentMessages;
        break;
      case MailTypes.DELETED:
        emails = deletedMessages;
        break;
      default:
        emails = messages;
    }

    this.props.getMessages(emails);

    this.setState({
      width: this.container.offsetWidth,
    });
  }

  changeFolder(activeFolder) {
    this.fetchMessages(activeFolder);
    this.props.setActiveFolder(activeFolder);
    this.props.setActiveMessage(0);
  }

  _renderFolderIcon(folderType) {
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
      <Image src={icon} width={iconSize} height={iconSize}/>
    );
  }

  /**
   * Renders folders for mail: inbox, outbox, sent, etc
   */
  _renderItems() {
    const { props } = this;
    let self = this;

    return folders.map(function (folder, index) {
      const containerClass = classNames({
        'item': true,
        'active': props.activeFolder === folder.type,
        'last-item': index === folders.length - 1,
      });

      return (
        <div key={'folder-' + index} className={containerClass} onClick={() => self.changeFolder(folder.type)}>
          {self._renderFolderIcon(folder.type)}
          <span>{folder.label}</span>
          <span className='amount'>{folder.newEmails > 0 ? folder.newEmails : ''}</span>
        </div>
      );
    })
  }

  clickedEmail(activeMessage) {
    this.props.setActiveMessage(activeMessage);
  }

  /**
   * Renders the list of emails
   */
  _renderMessages() {
    const { props } = this;
    let self = this;

    return props.messages.map(function (message, index) {
      const containerClass = classNames({
        'mail-summary': true,
        'active': props.activeMessage === index,
        'new': !message.read,
      });

      return (
        <div key={'item-' + index} className={containerClass} onClick={() => self.clickedEmail(index)}>
          <div className='top-detail'>
            <div className='from'>{message.from}</div>
            <div className='date'>{message.time}</div>
          </div>
          <div className='title'>
            {message.title}
          </div>
        </div>
      )
    })
  }

  getMessage() {
    const { props } = this;

    return props.messages[props.activeMessage];
  }

  _renderMessage() {
    let message = this.getMessage();

    if (!message) {
      return <div/>;
    }

    return (
      <div className='mail-message'>
        <div className='message-header'>
          <div className='top-detail'>
            <div className='from'>{message.from}</div>
            <div className='date'>{message.date}</div>
          </div>
          <div className='mail-title'>
            <div className='title'>
              {message.title}
            </div>
            <div>
              <Button content='REPLY' onClick={this.onClickReply} className='button--transparent' />
              <Button content='DELETE' onClick={this.onClickDelete} className='button--transparent' />
            </div>
          </div>
        </div>
        <div className='message-body'>
          {message.body}
        </div>
      </div>
    );
  }

  onClickReply() {
    this.props.showReplyModal();
  }

  /**
   * Todo: to implement
   */
  onClickDelete() {}

  onClickCompose() {
    this.props.showComposeModal();
  }

  onCloseCompose() {
    this.props.showComposeModal();
  }

  render() {
    const { props } = this;
    let { width } = this.state;

    const containerClass = classNames({
      'overlay': true,
      'composer-visible': props.showCompose,
    });
    let defaultSize = width / 5;

    return (
      <div ref={container => {this.container = container}} className='container'>
        <div className={containerClass} onClick={this.onCloseCompose} />
        <div className='header'>
          <span className='title'>Mail</span>
          <Button content='COMPOSE' onClick={this.onClickCompose} className='button--primary' />
        </div>
        <div className='body'>
          <SplitPane split="vertical" minSize={50} defaultSize={defaultSize} style={{position: 'relative'}}>
            <div className='mail-items'>
              {this._renderItems()}
            </div>
            <SplitPane split="vertical" minSize={50} defaultSize={defaultSize} style={{position: 'relative'}}>
              <div className='mail-messages'>
                {this._renderMessages()}
              </div>
              {this._renderMessage()}
            </SplitPane>
          </SplitPane>
        </div>
        <Compose
          showCompose={props.showCompose}
          onClose={this.onCloseCompose} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  showCompose: state.default.mail.showCompose,
  activeFolder: state.default.mail.activeFolder,
  activeMessage: state.default.mail.activeMessage,
  messages: state.default.mail.messages,
  reply: state.default.mail.reply,
});

const mapDispatchToProps = dispatch => ({
  showComposeModal: showCompose => dispatch(showComposeModal(showCompose)),
  setActiveFolder: activeFolder => dispatch(setActiveFolder(activeFolder)),
  setActiveMessage: activeMessage => dispatch(setActiveMessage(activeMessage)),
  getMessages: messages => dispatch(getMessages(messages)),
  showReplyModal: () => dispatch(showReplyModal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Mail);
