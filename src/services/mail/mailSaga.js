import {put, takeEvery, call} from 'redux-saga/effects';

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
    
    let { uuid,
            sender,
            recipient,
            subject,
            body,
            created_time,
            read_status,
            afterMailSentCallback }  = action.payload;

    let mailObject = localStorage.getItem('mail');
    if (!mailObject)
        mailObject = {};
    else
        mailObject = JSON.parse(localStorage.getItem('mail'));

    if (!mailObject[sender])
        mailObject[sender] = {};

    if (!mailObject[sender]["outbox"])
        mailObject[sender]["outbox"] = {};

    let currentTime = (new Date()).getTime();

    mailObject[sender]["outbox"][currentTime] = {
        uuid: currentTime,
        sender: sender,
        recipient: recipient,
        subject: subject,
        body: body,
        created_time: currentTime,
        read_status: true
    }

    localStorage.setItem('mail', JSON.stringify(mailObject));
    afterMailSentCallback();
}

export function* fetchMessagesFromFolder(action){

    let messageFolder = action.payload.messageFolder;

    try {
        let rootMailFolder = JSON.parse(localStorage.getItem('mail'));
        let mailFolder = rootMailFolder['ME'][messageFolder];
        let emails = Object.keys(mailFolder).map((mailUUID) => {
          let email = mailFolder[mailUUID];
          switch(messageFolder){
            case 'inbox': email.user = email.sender; break;
            case 'outbox': email.user = email.recipient; break;
            case 'sent': email.user = email.recipient; break;
            case 'deleted': email.user = (email.sender == 'ME' ? email.recipient: email.sender); break;
          }
          email.read = email.read_status;
          return email;
        });

        yield put({
            type: 'FETCHED_FOLDER_MESSAGES',
            messages: emails,
            messageFolder: messageFolder
        });
      }
      catch(e) {
        yield put({
            type: 'FETCHED_FOLDER_MESSAGES',
            messages: [],
            messageFolder: messageFolder
        });
      }
    
}