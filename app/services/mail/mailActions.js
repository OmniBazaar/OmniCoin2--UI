import { createActions } from 'redux-actions';

const {
  showComposeModal,
  subscribeForMail,
  mailReceived,
  confirmationReceived,
  loadFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
  deleteMail,
  mailSetRead
} = createActions({
  SHOW_COMPOSE_MODAL: (showCompose) => ({ showCompose }),
  SUBSCRIBE_FOR_MAIL: (reciever, afterMailStoredCallback) => ({
    reciever, afterMailStoredCallback
  }),
  MAIL_RECEIVED: (uuid) => ({ uuid }),
  CONFIRMATION_RECEIVED: (uuid) => ({ uuid }),
  LOAD_FOLDER: (user, messageFolder) => ({ user, messageFolder }),
  SET_ACTIVE_FOLDER: (activeFolder) => ({ activeFolder }),
  SET_ACTIVE_MESSAGE: (activeMessage) => ({ activeMessage }),
  SHOW_REPLY_MODAL: (reply) => ({ reply }),
  SEND_MAIL: (sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback) => ({
    sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback
  }),
  DELETE_MAIL: (user, messageFolder, messageObject, afterDeletionCallback) => ({
    user, messageFolder, messageObject, afterDeletionCallback
  }),
  MAIL_SET_READ: (user, messageFolder, messageUUID, afterSetCallback) => ({
    user, messageFolder, messageUUID, afterSetCallback
  })
});

export {
  showComposeModal,
  subscribeForMail,
  mailReceived,
  confirmationReceived,
  loadFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
  deleteMail,
  mailSetRead
};
