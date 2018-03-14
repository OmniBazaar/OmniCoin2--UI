import MailTypes from './mailTypes';

export function storeMessage(mailObject, messageFolder) {

    let mailFolder = localStorage.getItem('mail');
    if (!mailFolder)
        mailFolder = {};
    else
        mailFolder = JSON.parse(localStorage.getItem('mail'));

    if (!mailFolder[messageFolder])
        mailFolder[messageFolder] = {};

    let uuid = mailObject.uuid;
    mailFolder[messageFolder][uuid] = {...mailObject};

    localStorage.setItem('mail', JSON.stringify(mailFolder));
}

export function getMessage(messageFolder, uuid) {
    let mailObject = JSON.parse(localStorage.getItem('mail'));
    return mailObject[messageFolder][uuid];
}

export function deleteMessage(uuid, messageFolder) {

    try {
        let rootMailFolder = JSON.parse(localStorage.getItem('mail'));
        let mailFolder = rootMailFolder[messageFolder];
        delete mailFolder[uuid];
        localStorage.setItem('mail', JSON.stringify(rootMailFolder));
    }
    catch (e) {
        // do nothing
    }
}

export function getMessagesFromFolder(myUsername, messageFolder){

    try {
        let rootMailFolder = JSON.parse(localStorage.getItem('mail'));
        let mailFolder = rootMailFolder[messageFolder];
        let emails = Object.keys(mailFolder).map((mailUUID) => {
          let email = mailFolder[mailUUID];
          switch(messageFolder){
            case MailTypes.INBOX: email.user = email.sender; break;
            case MailTypes.OUTBOX: email.user = email.recipient; break;
            case MailTypes.SENT: email.user = email.recipient; break;
            case MailTypes.DELETED: email.user = (email.sender == myUsername ? email.recipient: email.sender); break;
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

export function generateMailUUID(mailSender, mailCreatedTime) {
    return mailSender + mailCreatedTime;
}