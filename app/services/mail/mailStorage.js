import MailTypes from './mailTypes';

export function storeMessage(mailObject, user, messageFolder) {


    let mailFolder = localStorage.getItem('mail');
    if (!mailFolder)
        mailFolder = {};
    else
        mailFolder = JSON.parse(localStorage.getItem('mail'));

    if (!mailFolder[user])
        mailFolder[user] = {};

    if (!mailFolder[user][messageFolder])
        mailFolder[user][messageFolder] = {};

    let uuid = mailObject.uuid;
    mailFolder[user][messageFolder][uuid] = {...mailObject};

    localStorage.setItem('mail', JSON.stringify(mailFolder));
}

export function getMessage(user, messageFolder, uuid) {
    let mailObject = JSON.parse(localStorage.getItem('mail'));
    return mailObject[user][messageFolder][uuid];
}

export function deleteMessage(user, messageFolder, uuid) {

    try {
        let rootMailFolder = JSON.parse(localStorage.getItem('mail'));
        let mailFolder = rootMailFolder[user][messageFolder];
        delete mailFolder[uuid];
        localStorage.setItem('mail', JSON.stringify(rootMailFolder));
    }
    catch (e) {
        // do nothing
    }
}

export function getMessagesFromFolder(user, messageFolder){

    try {
        let rootMailFolder = JSON.parse(localStorage.getItem('mail'));
        let mailFolder = rootMailFolder[user][messageFolder];
        let emails = Object.keys(mailFolder).map((mailUUID) => {
          let email = mailFolder[mailUUID];
          switch(messageFolder){
            case MailTypes.INBOX: email.user = email.sender; break;
            case MailTypes.OUTBOX: email.user = email.recipient; break;
            case MailTypes.SENT: email.user = email.recipient; break;
            case MailTypes.DELETED: email.user = (email.sender == user ? email.recipient: email.sender); break;
          }
          email.read = email.read_status;
          return email;
        });
        return emails;
    }
    catch(e) {
        return [];
    }
}

export function generateMailUUID(user, mailCreatedTime) {
    return user + mailCreatedTime;
}