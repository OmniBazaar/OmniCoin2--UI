import React, {Component} from 'react';
import classNames from 'classnames';
import Button, {ButtonTypes} from '../../../../components/Button';
import SplitPane from 'react-split-pane';

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

export default class Mail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
      messages: [],
      activeMessage: 0,
      activeFolder: MailTypes.INBOX,
    }
  }

  componentDidMount () {
    const { activeFolder } = this.state;
    this.fetchMessages(activeFolder);
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

    this.setState({
      width: this.container.offsetWidth,
      messages: emails,
    });
  }

  changeFolder(activeFolder) {
    this.fetchMessages(activeFolder);
    this.setState({ activeFolder, activeMessage: 0 });
  }

  /**
   * Renders folders for mail: inbox, outbox, sent, etc
   */
  _renderItems() {
    let self = this;
    const { activeFolder } = this.state;

    return folders.map(function (folder, index) {
      const containerClass = classNames({
        'item': true,
        'active': activeFolder === folder.type,
        'last-item': index === folders.length - 1,
      });

      return (
        <div key={'folder-' + index} className={containerClass} onClick={() => self.changeFolder(folder.type)}>
          <span>{folder.label}</span>
          <span className='amount'>{folder.newEmails > 0 ? folder.newEmails : ''}</span>
        </div>
      );
    })
  }

  clickedEmail(activeMessage) {
    this.setState({ activeMessage });
  }

  /**
   * Renders the list of emails
   */
  _renderMessages() {
    let self = this;
    const { messages, activeMessage } = this.state;

    return messages.map(function (message, index) {
      const containerClass = classNames({
        'mail-summary': true,
        'active': activeMessage === index,
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
    const { activeMessage, messages } = this.state;

    return messages[activeMessage];
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
              <Button type={ButtonTypes.GRAY}>REPLY</Button>
              <Button type={ButtonTypes.GRAY}>DELETE</Button>
            </div>
          </div>
        </div>
        <div className='message-body'>
          {message.body}
        </div>
      </div>
    );
  }

  render() {
    let width = this.state.width;
    let defaultSize = width / 5;
    return (
      <div ref={container => {this.container = container}} className='container'>
        <div className='header'>
          <span className='title'>Mail</span>
          <Button type={ButtonTypes.PRIMARY}>COMPOSE</Button>
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
      </div>
    )
  }
}
