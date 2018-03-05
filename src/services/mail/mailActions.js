import { createActions } from 'redux-actions';

const {
  showComposeModal,
  getMessages,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
} = createActions({
  SHOW_COMPOSE_MODAL: (showCompose) => ({ showCompose }),
  GET_MESSAGES: (messages) => ({ messages }),
  SET_ACTIVE_FOLDER: (activeFolder) => ({ activeFolder }),
  SET_ACTIVE_MESSAGE: (activeMessage) => ({ activeMessage }),
  SHOW_REPLY_MODAL: (reply) => ({ reply }),
  SEND_MAIL: (sender, to, subject, body) => {

    let mailObject = localStorage.getItem('mail');
    if (!mailObject)
      mailObject = {};
    else
      mailObject = JSON.parse(localStorage.getItem('mail'));

    if (!mailObject[sender])
      mailObject[sender] = {};

    if (!mailObject[sender]["outbox"])
      mailObject[sender]["outbox"] = {};

    let currentTime = (new Date()).getTime();
    
    mailObject[sender]["outbox"][currentTime] = {
      uuid: currentTime,
      sender: sender,
      recipient: to,
      subject: subject,
      body: body,
      created_time: currentTime,
      read_status: true
    }

    localStorage.setItem('mail', JSON.stringify(mailObject));

    console.log("CURRENT LOCAL STORAGE:", JSON.parse(localStorage.getItem('mail')));

    return ({ mailSent: true });
  },
});

export {
  showComposeModal,
  getMessages,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
}
