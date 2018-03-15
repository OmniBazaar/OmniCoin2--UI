import {put, takeEvery, call, all} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { storeMessage,
         getMessagesFromFolder,
         getMessage,
         deleteMessage,
         generateMailUUID } from './mailStorage';

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
    
    let {  sender,
            recipient,
            subject,
            body,
            mailSentCallback,
            mailDeliveredCallback }  = action.payload;

    let currentTimeMil = (new Date()).getTime();
    let uuid = generateMailUUID(sender, currentTimeMil);
    let currentTimeSec = Math.floor( currentTimeMil / 1000 );

    let mailObject = {
        sender: sender,
        recipient: recipient,
        subject: subject,
        body: body,
        read_status: false,
        creation_time: currentTimeSec,
        uuid: uuid
    }

    /* afterDeliveredCallback happens to be triggered multiple times
    by the backend, so this will ensure that action is handle only once */
    let mailDeliveredOnce = false;

    let afterDeliveredCallback = () => {

        if (!mailDeliveredOnce){
            console.log("Mail is delivered:", mailObject);
            mailObject.read_status = true;
            deleteMessage(mailObject.sender, MailTypes.OUTBOX, mailObject.uuid);
            storeMessage(mailObject, mailObject.sender, MailTypes.SENT);
            mailDeliveredCallback(mailObject);
        }
        mailDeliveredOnce = true;
    };

    Apis.instance().network_api().exec("mail_send", [afterDeliveredCallback, mailObject]).then(() => {
        console.log("Mail is in the outbox:", mailObject);
        storeMessage(mailObject, mailObject.sender, MailTypes.OUTBOX);
        mailSentCallback();
    });    
}

export function* subscribeForMail(action) {

    let { reciever, afterMailStoredCallback} = action.payload;

    let mailReceivedOnce = false;

    let mailReceivedCallback = (recievedMmailObjects) => {
        if (!mailReceivedOnce){
            console.log("Mail recieved: ", recievedMmailObjects);
            recievedMmailObjects.forEach((mailObject) => {
                mailObject.read_status = false;
                storeMessage(mailObject, mailObject.recipient, MailTypes.INBOX);
            })
            afterMailStoredCallback(recievedMmailObjects);
            mailReceivedOnce = true;
        }
    }

    Apis.instance().network_api().exec("mail_subscribe", [mailReceivedCallback, reciever]).then(() => {
        // do nothing special   
    });
}

export function* mailReceived(action){
    Apis.instance().network_api().exec('mail_set_received', [action.payload.uuid]);
}

export function* confirmationRecieved(action){
    Apis.instance().network_api().exec('mail_confirm_received', [action.payload.uuid]);
}

export function* loadFolder(action){

    let { user, messageFolder } = action.payload;

    let emails = getMessagesFromFolder(user, messageFolder);

    yield put({
        type: 'LOAD_FOLDER_UPDATE',
        messages: emails,
        messageFolder: action.payload.messageFolder
    });
}

export function* deleteMail(action){
   
    let { messageObject, messageFolder, user, afterDeletionCallback } = action.payload;

    storeMessage(messageObject, user, MailTypes.DELETED);
    deleteMessage(user, messageFolder, messageObject.uuid);
    afterDeletionCallback();
}

export function* mailSetRead(action) {
    let { user, messageFolder, messageUUID, afterSetCallback } = action.payload;
    let mailObject = getMessage(user, messageFolder, messageUUID);
    mailObject.read_status = true;
    storeMessage(mailObject, user, messageFolder);
    afterSetCallback();
}