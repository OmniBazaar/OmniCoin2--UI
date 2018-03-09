import {put, takeEvery, call} from 'redux-saga/effects';
import { Apis } from 'bitsharesjs-ws';
import { storeMail, getEmailsFromFolder, deleteMail } from './mailStorage';

export function* sendMailSubscriber() {
    yield takeEvery(
        'SEND_MAIL',
        sendMail
    )
}

export function* fetchMessagesFromFolderSubscriber(){
    yield takeEvery(
        'FETCH_MESSAGES_FROM_FOLDER',
        fetchMessagesFromFolder
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

    let afterSendCallback = () => {
        console.log("Mail is delivered:", mailObject);
        deleteMail(mailObject.uuid, sender, 'outbox');
        storeMail(mailObject, sender, 'sent');
        mailDeliveredCallback();
    };

    Apis.instance().mail_api().exec("send", [afterSendCallback, mailObject]).then(() => {
        console.log("Mail is in the outbox:", mailObject);
        storeMail(mailObject, sender, 'outbox');
        mailSentCallback();
    });

    // Promise.resolve().then(() => {
    //     console.log("Mail is in the outbox");
    //     storeMail(mailObject, sender, 'outbox');
    //     mailSentCallback();
    // });
}

export function* fetchMessagesFromFolder(action){

    let emails = getEmailsFromFolder(action.payload.currentUser, action.payload.messageFolder);

    yield put({
        type: 'FETCHED_FOLDER_MESSAGES',
        messages: emails
    });

    // let messageFolder = action.payload.messageFolder;
    // let currentUser = action.payload.currentUser;

    // try {
    //     let rootMailFolder = JSON.parse(localStorage.getItem('mail'));
    //     let mailFolder = rootMailFolder[currentUser][messageFolder];
    //     let emails = Object.keys(mailFolder).map((mailUUID) => {
    //       let email = mailFolder[mailUUID];
    //       switch(messageFolder){
    //         case 'inbox': email.user = email.sender; break;
    //         case 'outbox': email.user = email.recipient; break;
    //         case 'sent': email.user = email.recipient; break;
    //         case 'deleted': email.user = (email.sender == 'ME' ? email.recipient: email.sender); break;
    //       }
    //       email.read = email.read_status;
    //       return email;
    //     });

    //     yield put({
    //         type: 'FETCHED_FOLDER_MESSAGES',
    //         messages: emails,
    //         messageFolder: messageFolder
    //     });
    //   }
    //   catch(e) {
    //     yield put({
    //         type: 'FETCHED_FOLDER_MESSAGES',
    //         messages: [],
    //         messageFolder: messageFolder
    //     });
    // }
}
