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
  SEND_MAIL: (mailSent) => ({ mailSent }),
});

export {
  showComposeModal,
  getMessages,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
};
