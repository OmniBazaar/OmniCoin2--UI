import MailTypes from './mailTypes';

export function storeMessage(mailObject, user, messageFolder) {
  let mailFolder = localStorage.getItem('mail');
  if (!mailFolder) { mailFolder = {}; } else { mailFolder = JSON.parse(localStorage.getItem('mail')); }

  if (!mailFolder[user]) { mailFolder[user] = {}; }

  if (!mailFolder[user][messageFolder]) { mailFolder[user][messageFolder] = {}; }

  const { uuid } = mailObject;
  mailFolder[user][messageFolder][uuid] = { ...mailObject };

  localStorage.setItem('mail', JSON.stringify(mailFolder));
}

export function updateMessageFolder(user, messageFolder, emails) {
  let mailFolder = localStorage.getItem('mail');
  if (!mailFolder) { mailFolder = {}; } else { mailFolder = JSON.parse(localStorage.getItem('mail')); }

  if (!mailFolder[user]) { mailFolder[user] = {}; }
  mailFolder[user][messageFolder] = emails.reduce((total, email) => ({ ...total, [email.uuid]: email }), {});
  localStorage.setItem('mail', JSON.stringify(mailFolder));
}

export function getMessage(user, messageFolder, uuid) {
  const mailObject = JSON.parse(localStorage.getItem('mail'));
  try {
    return mailObject[user][messageFolder][uuid];
  } catch (err) {
    return null;
  }
}

export function deleteMessage(user, messageFolder, uuid) {
  try {
    const rootMailFolder = JSON.parse(localStorage.getItem('mail'));
    const mailFolder = rootMailFolder[user][messageFolder];
    delete mailFolder[uuid];
    localStorage.setItem('mail', JSON.stringify(rootMailFolder));
  } catch (e) {
    // do nothing
  }
}

export function getMessagesFromFolder(user, messageFolder) {
  try {
    const rootMailFolder = JSON.parse(localStorage.getItem('mail'));
    const mailFolder = rootMailFolder[user][messageFolder];
    const emails = Object.keys(mailFolder).map((mailUUID) => {
      const email = mailFolder[mailUUID];
      switch (messageFolder) {
        case MailTypes.INBOX: email.user = email.sender; break;
        case MailTypes.OUTBOX: email.user = email.recipient; break;
        case MailTypes.SENT: email.user = email.recipient; break;
        case MailTypes.DELETED:
          email.user = (email.sender === user ? email.recipient : email.sender);
          break;
        default: break;
      }
      return email;
    });
    return emails;
  } catch (e) {
    return [];
  }
}

export function generateMailUUID(user, mailCreatedTime) {
  return user + mailCreatedTime;
}
