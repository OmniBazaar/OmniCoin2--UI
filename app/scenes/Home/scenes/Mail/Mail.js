import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
  subscribeForMail,
  mailReceived,
  deleteMail,
  changeFolder,
  setActiveMessage,
  showReplyModal,
} from  '../../../../services/mail/mailActions';

import Header from '../../../../components/Header';

import './mail.scss';

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

    this.props.mailActions.subscribeForMail(this.props.auth.currentUser.username, (receivedMailObject) => {
      this.props.mailActions.mailReceived(receivedMailObject.uuid);
    });
  }

  componentDidMount () {
    this.changeFolderAndSetWidth(this.props.activeFolder);
  }

  changeFolderAndSetWidth(activeFolder) {
    this.props.mailActions.changeFolder(this.props.auth.currentUser.username, activeFolder);
    
    this.setState({
      width: this.container.offsetWidth,
    });
  }

  changeFolder(activeFolder) {
    this.changeFolderAndSetWidth(activeFolder);
    this.props.mailActions.setActiveFolder(activeFolder);
    this.props.mailActions.setActiveMessage(0);
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
        'active': props.mail.activeFolder === folder.type,
        'last-item': index === folders.length - 1,
      });

      return (
        <div key={'folder-' + index} className={containerClass} onClick={() => self.changeFolder(folder.type)}>
          {self._renderFolderIcon(folder.type)}
          <span>{folder.label}</span>
          <span className='amount'>1</span>
        </div>
      );
    })
  }

  clickedEmail(activeMessage) {
    this.props.mailActions.setActiveMessage(activeMessage);
  }

  /**
   * Renders the list of emails
   */
  _renderMessages() {
    const { props } = this;
    let self = this;

    if (props.mail.messages[props.mail.activeFolder].length > 0) {
      return props.mail.messages[props.mail.activeFolder].map(function (message, index) {
        const containerClass = classNames({
          'mail-summary': true,
          'active': props.mail.activeMessage === index,
          'new': !message.read,
        });

        let createdTime = new Date(message.created_time);

        return (
          <div key={'item-' + index} className={containerClass} onClick={() => self.clickedEmail(index)}>
            <div className='top-detail'>
              <div className='from'>{message.user}</div>
              <div className='date'>{createdTime.toLocaleString()}</div>
            </div>
            <div className='title'>
              {message.subject}
            </div>
          </div>
        )
      })
    }
  }

  getMessage() {
    const { props } = this;

    if (props.mail.messages[props.mail.activeFolder].length > 0)
      return props.mail.messages[props.mail.activeFolder][props.mail.activeMessage];
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
              { this.props.mail.activeFolder == MailTypes.INBOX &&
                <Button content='REPLY' onClick={this.onClickReply} className='button--transparent' />
              }
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
    this.props.mailActions.showReplyModal();
  }

  onClickDelete() {
      if (this.props.mail.activeMessage >= 0){
        let messageObjToDelete = this.props.mail.messages[this.props.mail.activeFolder][this.props.mail.activeMessage];
        this.props.mailActions.deleteMail(messageObjToDelete,
                                          this.props.mail.activeFolder,
                                          () => {
                                              this.changeFolder(this.props.mail.activeFolder);
                                          });
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
    let { width } = this.state;

    const containerClass = classNames({
      'overlay': true,
      'composer-visible': props.mail.showCompose,
    });
    let defaultSize = width / 5;

    return (
      <div ref={container => {this.container = container}} className='container'>
        <div className={containerClass} onClick={this.onCloseCompose} />
        <Header hasButton buttonContent='COMPOSE' title='Mail' className='button--primary' onClick={this.onClickCompose} />
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
          showCompose={props.mail.showCompose}
          onClose={this.onCloseCompose} />
      </div>
    )
  }
}

export default connect(
  state => {
    return {...state.default}
  },
  (dispatch) => ({
    mailActions: bindActionCreators({ showComposeModal, 
                                      subscribeForMail,
                                      mailReceived,
                                      deleteMail,
                                      changeFolder,
                                      setActiveFolder,
                                      setActiveMessage,
                                      showReplyModal,
                                       }, dispatch),
  }),
)(Mail);
