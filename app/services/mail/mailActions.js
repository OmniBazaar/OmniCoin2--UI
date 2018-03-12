import { createActions } from 'redux-actions';

const {
  showComposeModal,
  subscribeForMail,
  mailReceived,
  confirmationReceived,
  changeFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
  deleteMail
} = createActions({
  SHOW_COMPOSE_MODAL: (showCompose) => ({ showCompose }),
  SUBSCRIBE_FOR_MAIL: (reciever, afterMailStoredCallback) => ({reciever, afterMailStoredCallback}),
  MAIL_RECEIVED: (uuid) => ({uuid}),
  CONFIRMATION_RECEIVED: (uuid) => ({uuid}),
  CHANGE_FOLDER: (myUsername, messageFolder) => ({myUsername, messageFolder}),
  SET_ACTIVE_FOLDER: (activeFolder) => ({ activeFolder }),
  SET_ACTIVE_MESSAGE: (activeMessage) => ({ activeMessage }),
  SHOW_REPLY_MODAL: (reply) => ({ reply }),
  SEND_MAIL: (sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback) => ({sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback}),
  DELETE_MAIL: (messageObject, messageFolder, afterDeletionCallback) => ({messageObject, messageFolder, afterDeletionCallback})
});

export {
  showComposeModal,
  subscribeForMail,
  mailReceived,
  confirmationReceived,
  changeFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
  deleteMail
}
