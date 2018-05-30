import { put, takeEvery, all } from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import _ from 'lodash';
import {
  storeMessage,
  getMessagesFromFolder,
  getMessage,
  deleteMessage,
  generateMailUUID
} from './mailStorage';

import MailTypes from './mailTypes';


export function* mailSubscriber() {
  yield all([
    takeEvery('SEND_MAIL', sendMail),
    takeEvery('SUBSCRIBE_FOR_MAIL', subscribeForMail),
    takeEvery('MAIL_RECEIVED', mailReceived),
    takeEvery('CONFIRMATION_RECEIVED', confirmationRecieved),
    takeEvery('LOAD_FOLDER', loadFolder),
    takeEvery('DELETE_MAIL', deleteMail),
    takeEvery('MAIL_SET_READ', mailSetRead)
  ]);
}


export function* sendMail(action) {
  const {
    sender,
    recipient,
    subject,
    body,
    mailSentCallback,
    mailDeliveredCallback
  } = action.payload;

  const currentTimeMil = (new Date()).getTime();
  const uuid = generateMailUUID(sender, currentTimeMil);
  const currentTimeSec = Math.floor(currentTimeMil / 1000);

  const mailObject = {
    sender,
    recipient,
    subject,
    body,
    read_status: false,
    creation_time: currentTimeSec,
    uuid
  };

  /* afterDeliveredCallback happens to be triggered multiple times
    by the backend, so this will ensure that action is handle only once */
  let mailDeliveredOnce = false;

  const afterDeliveredCallback = () => {
    if (!mailDeliveredOnce) {
      console.log('Mail is delivered:', mailObject);
      mailObject.read_status = true;
      deleteMessage(mailObject.sender, MailTypes.OUTBOX, mailObject.uuid);
      storeMessage(mailObject, mailObject.sender, MailTypes.SENT);
      mailDeliveredCallback(mailObject);
    }
    mailDeliveredOnce = true;
  };

  try {
    yield (Apis.instance().network_api().exec('mail_send', [afterDeliveredCallback, mailObject]).then(() => {
      console.log('Mail is in the outbox:', mailObject);
      storeMessage(mailObject, mailObject.sender, MailTypes.OUTBOX);
      mailSentCallback();
    }));
    yield put({ type: 'EMAIL_SENT_SUCCEEDED' });
  } catch (error) {
    yield put({ type: 'EMAIL_SENT_FAILED', error });
  }
}

export function* subscribeForMail(action) {
  const { reciever, afterMailStoredCallback } = action.payload;

  /* this callback can be triggered by the server multiple times
  for one batch of emails, until the server receives mailReceived signals,
  so before storing the messages, check if they exist */
  const mailReceivedCallback = (recievedMailObjects) => {
    // store just the really-new-received mails here
    const mailsToSetRead = [];

    console.log('Mail recieved: ', recievedMailObjects);
    recievedMailObjects.forEach((mailObject) => {
      if (!getMessage(reciever, MailTypes.INBOX, mailObject.uuid)) {
        mailObject.read_status = false;
        storeMessage(mailObject, mailObject.recipient, MailTypes.INBOX);
        mailsToSetRead.push(mailObject);
      }
    });
    afterMailStoredCallback(mailsToSetRead);
  };

  try {
    yield (Apis.instance().network_api().exec('mail_subscribe', [mailReceivedCallback, reciever]));
  } catch (err) {
    console.log('subscribeForMail error:', err);
  }
}

export function* mailReceived(action) {
  try {
    yield (Apis.instance().network_api().exec('mail_set_received', [action.payload.uuid]));
  } catch (err) {
    console.log('mailReceived error: ', err);
  }
}

export function* confirmationRecieved(action) {
  try {
    yield (Apis.instance().network_api().exec('mail_confirm_received', [action.payload.uuid]));
  } catch (err) {
    console.log('confirmationRecieved: ', err);
  }
}

export function* loadFolder(action) {
  const { user, messageFolder } = action.payload;

  const emails = getMessagesFromFolder(user, messageFolder);
  const sortedEmails = _.sortBy(emails, ['creation_time']).reverse();

  yield put({
    type: 'LOAD_FOLDER_UPDATE',
    messages: sortedEmails,
    messageFolder: action.payload.messageFolder
  });
}

export function* deleteMail(action) {
  const {
    messageObject, messageFolder, user, afterDeletionCallback
  } = action.payload;

  storeMessage(messageObject, user, MailTypes.DELETED);
  deleteMessage(user, messageFolder, messageObject.uuid);
  afterDeletionCallback();
}

export function* mailSetRead(action) {
  const {
    user, messageFolder, messageUUID, afterSetCallback
  } = action.payload;
  const mailObject = getMessage(user, messageFolder, messageUUID);

  if (mailObject) {
    mailObject.read_status = true;
    storeMessage(mailObject, user, messageFolder);
  }

  afterSetCallback();
}
