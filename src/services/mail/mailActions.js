import { createActions } from 'redux-actions';

const {
  showComposeModal,
  fetchMessagesFromFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
} = createActions({
  SHOW_COMPOSE_MODAL: (showCompose) => ({ showCompose }),
  FETCH_MESSAGES_FROM_FOLDER: (messageFolder) => ({messageFolder}),
  SET_ACTIVE_FOLDER: (activeFolder) => ({ activeFolder }),
  SET_ACTIVE_MESSAGE: (activeMessage) => ({ activeMessage }),
  SHOW_REPLY_MODAL: (reply) => ({ reply }),
  SEND_MAIL: (sender, to, subject, body, afterMailSentCallback) => ({sender, to, subject, body, afterMailSentCallback})
});

export {
  showComposeModal,
  fetchMessagesFromFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
}
