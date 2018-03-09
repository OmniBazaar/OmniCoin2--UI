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
  FETCH_MESSAGES_FROM_FOLDER: (currentUser, messageFolder) => ({currentUser, messageFolder}),
  SET_ACTIVE_FOLDER: (activeFolder) => ({ activeFolder }),
  SET_ACTIVE_MESSAGE: (activeMessage) => ({ activeMessage }),
  SHOW_REPLY_MODAL: (reply) => ({ reply }),
  SEND_MAIL: (sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback) => ({sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback}),
});

export {
  showComposeModal,
  fetchMessagesFromFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
}
