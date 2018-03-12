import { createActions } from 'redux-actions';

const {
  showComposeModal,
  subscribeForMail,
  mailReceived,
  confirmationReceived,
  fetchMessagesFromFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
} = createActions({
  SHOW_COMPOSE_MODAL: (showCompose) => ({ showCompose }),
  SUBSCRIBE_FOR_MAIL: (reciever) => ({reciever}),
  MAIL_RECEIVED: (uuid) => ({uuid}),
  CONFIRMATION_RECEIVED: (uuid) => ({uuid}),
  FETCH_MESSAGES_FROM_FOLDER: (currentUser, messageFolder) => ({currentUser, messageFolder}),
  SET_ACTIVE_FOLDER: (activeFolder) => ({ activeFolder }),
  SET_ACTIVE_MESSAGE: (activeMessage) => ({ activeMessage }),
  SHOW_REPLY_MODAL: (reply) => ({ reply }),
  SEND_MAIL: (sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback) => ({sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback}),
});

export {
  showComposeModal,
  subscribeForMail,
  mailReceived,
  confirmationReceived,
  fetchMessagesFromFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
}
