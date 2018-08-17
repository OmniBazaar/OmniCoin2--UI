import { deleteMessage, storeMessage, generateMailUUID } from "./mailStorage";
import MailTypes from "./mailTypes";
import { Apis } from "omnibazaarjs-ws";


export const sendMail = (sender, recipient, subject, body, mailSentCallback, mailDeliveredCallback) => {
  const currentTimeMil = (new Date()).getTime();
  const uuid = generateMailUUID(sender, currentTimeMil);
  const currentTimeSec = Math.floor(currentTimeMil / 1000);

  const mailObject = {
    sender,
    recipient,
    subject,
    body,
    read_status: false,
    creation_time: currentTimeSec,
    uuid
  };

  /* afterDeliveredCallback happens to be triggered multiple times
    by the backend, so this will ensure that action is handle only once */
  let mailDeliveredOnce = false;

  const afterDeliveredCallback = () => {
    if (!mailDeliveredOnce) {
      console.log('Mail is delivered:', mailObject);
      mailObject.read_status = true;
      deleteMessage(mailObject.sender, MailTypes.OUTBOX, mailObject.uuid);
      storeMessage(mailObject, mailObject.sender, MailTypes.SENT);
      if (mailDeliveredCallback) {
        mailDeliveredCallback(mailObject);
      }
    }
    mailDeliveredOnce = true;
  };

  Apis.instance().network_api().exec('mail_send', [afterDeliveredCallback, mailObject]).then(() => {
    console.log('Mail is in the outbox:', mailObject);
    storeMessage(mailObject, mailObject.sender, MailTypes.OUTBOX);
    if (mailSentCallback) {
      mailSentCallback();
    }
  });
};
