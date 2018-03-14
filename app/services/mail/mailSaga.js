import {put, takeEvery, call} from 'redux-saga/effects';
import { Apis } from 'omnibazaarjs-ws';
import { storeMessage,
         getMessagesFromFolder,
         getMessage,
         deleteMessage,
         generateMailUUID } from './mailStorage';

import MailTypes from './mailTypes';

export function* sendMailSubscriber() {
    yield takeEvery(
        'SEND_MAIL',
        sendMail
    )
}

export function* subscribeForMailSubscriber(){
    yield takeEvery(
        'SUBSCRIBE_FOR_MAIL',
        subscribeForMail
    )
}

export function* mailReceivedSubscriber() {
    yield takeEvery(
        'MAIL_RECEIVED',
        mailReceived
    )
}

export function* confirmationRecievedSubscriber() {
    yield takeEvery(
        'CONFIRMATION_RECEIVED',
        confirmationRecieved
    )
}

export function* loadFolderSubscriber(){
    yield takeEvery(
        'LOAD_FOLDER',
        loadFolder
    )
}

export function* deleteMailSubscriber(){
    yield takeEvery(
        'DELETE_MAIL',
        deleteMail
    )
}

export function* mailSetReadSubscriber(){
    yield takeEvery(
        'MAIL_SET_READ',
        mailSetRead
    )
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
            deleteMessage(mailObject.uuid, MailTypes.OUTBOX);
            storeMessage(mailObject, MailTypes.SENT);
            mailDeliveredCallback(mailObject);
        }
        mailDeliveredOnce = true;
    };

    Apis.instance().network_api().exec("mail_send", [afterDeliveredCallback, mailObject]).then(() => {
        console.log("Mail is in the outbox:", mailObject);
        storeMessage(mailObject, MailTypes.OUTBOX);
        mailSentCallback();
    });

    
}

export function* subscribeForMail(action) {

    let reciever = action.payload.reciever;
    let afterMailStoredCallback = action.payload.afterMailStoredCallback;

    let mailReceivedCallback = (recievedMmailObjects) => {
        console.log("Mail recieved: ", recievedMmailObjects);
        recievedMmailObjects.forEach((mailObject) => {
            mailObject.read_status = false;
            storeMessage(mailObject, MailTypes.INBOX);
        })
        afterMailStoredCallback(recievedMmailObjects);
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

    let emails = getMessagesFromFolder(action.payload.myUsername, action.payload.messageFolder);

    yield put({
        type: 'LOAD_FOLDER_UPDATE',
        messages: emails,
        messageFolder: action.payload.messageFolder
    });
}

export function* deleteMail(action){
    let messageObject = action.payload.messageObject;
    let messageFolder = action.payload.messageFolder;
    let afterDeletionCallback = action.payload.afterDeletionCallback;

    storeMessage(messageObject, MailTypes.DELETED);
    deleteMessage(messageObject.uuid, messageFolder);
    afterDeletionCallback();
}

export function* mailSetRead(action) {
    let { messageFolder, messageUUID, afterSetCallback } = action.payload;
    let mailObject = getMessage(messageFolder, messageUUID);
    mailObject.read_status = true;
    storeMessage(mailObject, messageFolder);
    afterSetCallback();
}