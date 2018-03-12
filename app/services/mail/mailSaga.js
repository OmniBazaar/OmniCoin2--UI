import {put, takeEvery, call} from 'redux-saga/effects';
import { Apis } from 'bitsharesjs-ws';
import { storeMail , getEmailsFromFolder, deleteMail as deleteMailFromStorage } from './mailStorage';
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

export function* sendMail(action) {
    
    let {  sender,
            recipient,
            subject,
            body,
            mailSentCallback,
            mailDeliveredCallback }  = action.payload;

    let mailObject = {
        sender: sender,
        recipient: recipient,
        subject: subject,
        body: body,
        read_status: false,
        creation_time: (new Date()).getTime(),
        uuid: (new Date()).getTime()
    }

    // this is just for testing
    Promise.resolve().then(() => {
        console.log("Mail is delivered:", mailObject);
        mailObject.read_status = true;
        storeMail(mailObject, MailTypes.SENT);
        mailDeliveredCallback(mailObject);
    });

    /* and this should be real code
    
    // let afterDeliveredCallback = () => {
    //     console.log("Mail is delivered:", mailObject);
    //     deleteMail(mailObject.uuid, MailTypes.OUTBOX);
    //     storeMail(mailObject, MailTypes.SENT);
    //     mailDeliveredCallback(mailObject);
    // };

    // Apis.instance().mail_api().exec("send", [afterDeliveredCallback, mailObject]).then(() => {
    //     console.log("Mail is in the outbox:", mailObject);
    //     storeMail(mailObject, MailTypes.OUTBOX);
    //     mailSentCallback();
    // });

    */
}

export function* subscribeForMail(action) {

    let reciever = action.payload.reciever;
    let afterMailStoredCallback = action.payload.afterMailStoredCallback;

    let mailReceivedCallback = (mailObject) => {
        console.log("Mail recieved: ", mailObject);
        mailObject.read_status = false;
        storeMail(mailObject, mailObject.recipient, MailTypes.INBOX);
        afterMailStoredCallback(mailObject);
    }

    Apis.instance().mail_api.exec("subscribe", [mailReceivedCallback, reciever]).then(() => {
        // do nothing special   
    });
}

export function* mailReceived(action){
    Apis.instance().mail_api.exec('set_received', [action.payload.uuid]);
}

export function* confirmationRecieved(action){
    Apis.instance().mail_api.exec('confirm_received', [action.payload.uuid]);
}

export function* loadFolder(action){

    let emails = getEmailsFromFolder(action.payload.myUsername, action.payload.messageFolder);

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

    storeMail(messageObject, MailTypes.DELETED);
    deleteMailFromStorage(messageObject.uuid, messageFolder);
    afterDeletionCallback();
}