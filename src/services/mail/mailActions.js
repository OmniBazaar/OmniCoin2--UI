import { createActions } from 'redux-actions';

const {
  showComposeModal,
  fetchMessagesForFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
} = createActions({
  SHOW_COMPOSE_MODAL: (showCompose) => ({ showCompose }),
  FETCH_MESSAGES_FOR_FOLDER: (messageFolder) => {
   
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
      return { messages: emails, messageFolder };
    }
    catch(e){
      return {messages: []};
    }
  },
  SET_ACTIVE_FOLDER: (activeFolder) => ({ activeFolder }),
  SET_ACTIVE_MESSAGE: (activeMessage) => ({ activeMessage }),
  SHOW_REPLY_MODAL: (reply) => ({ reply }),
  SEND_MAIL: (sender, to, subject, body) => {

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
        recipient: to,
        subject: subject,
        body: body,
        created_time: currentTime,
        read_status: true
      }

      localStorage.setItem('mail', JSON.stringify(mailObject));

      console.log("CURRENT LOCAL STORAGE:", JSON.parse(localStorage.getItem('mail')));

      return ({ mailSent: true });
  },
});

export {
  showComposeModal,
  fetchMessagesForFolder,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
}
