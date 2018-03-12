import {put, takeEvery, call} from 'redux-saga/effects';
import { Apis } from 'bitsharesjs-ws';
import { storeMail, getEmailsFromFolder, deleteMail } from './mailStorage';

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

export function* changeFolderSubscriber(){
    yield takeEvery(
        'CHANGE_FOLDER',
        changeFolder
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
        storeMail(mailObject, sender, 'sent');
        mailDeliveredCallback(mailObject);
    });

    /* and this should be real code
    
    // let afterDeliveredCallback = () => {
    //     console.log("Mail is delivered:", mailObject);
    //     deleteMail(mailObject.uuid, sender, 'outbox');
    //     storeMail(mailObject, sender, 'sent');
    //     mailDeliveredCallback(mailObject);
    // };

    // Apis.instance().mail_api().exec("send", [afterDeliveredCallback, mailObject]).then(() => {
    //     console.log("Mail is in the outbox:", mailObject);
    //     storeMail(mailObject, sender, 'outbox');
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
        storeMail(mailObject, mailObject.recipient, 'inbox');
        afterMailStoredCallback(mailObject);
    }

    Apis.instance().mail_api.exec("subscribe", [mailReceivedCallback, reciever]).then(() => {
        // do nothing special   
    });
}

export function* mailReceived(action){

    Apis.instance().mail_api.exec('set_received', [action.payload.uuid]).then(() => {
        
    });
}

export function* confirmationRecieved(action){

    console.log("AAA");
    Apis.instance().mail_api.exec('set_received', [action.payload.uuid]).then(() => {
       
    });
}

export function* changeFolder(action){

    let emails = getEmailsFromFolder(action.payload.currentUser, action.payload.messageFolder);

    yield put({
        type: 'FETCHED_FOLDER_MESSAGES',
        messages: emails,
        messageFolder: action.payload.messageFolder
    });
}
