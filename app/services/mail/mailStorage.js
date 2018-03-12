

export function storeMail({uuid, sender, recipient, subject, body, created_time, read_status }, user, messageFolder) {

    let mailObject = localStorage.getItem('mail');
    if (!mailObject)
        mailObject = {};
    else
        mailObject = JSON.parse(localStorage.getItem('mail'));

    if (!mailObject[sender])
        mailObject[sender] = {};

    if (!mailObject[sender][messageFolder])
        mailObject[sender][messageFolder] = {};

    mailObject[sender][messageFolder][uuid] = {
        uuid: uuid,
        sender: sender,
        recipient: recipient,
        subject: subject,
        body: body,
        created_time: uuid,
        read_status: true
    }

    localStorage.setItem('mail', JSON.stringify(mailObject));
}

export function deleteMail(uuid, user, messageFolder) {

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

export function getEmailsFromFolder( user, messageFolder){

    try {
        let rootMailFolder = JSON.parse(localStorage.getItem('mail'));
        let mailFolder = rootMailFolder[user][messageFolder];
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
        return emails;
    }
    catch(e) {
        return [];
    }
}