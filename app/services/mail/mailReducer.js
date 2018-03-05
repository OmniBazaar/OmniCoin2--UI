import { handleActions, combineActions } from 'redux-actions';
import {
  showComposeModal,
  getMessages,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
  sendMail,
} from './mailActions';

const MailTypes = Object.freeze({
  INBOX: 'inbox',
  OUTBOX: 'outbox',
  SENT: 'sent',
  DELETED: 'deleted',
});

let defaultState = {
  messages: [],
  sender: '',
  to: '',
  subject: '',
  body: '',
  activeFolder: MailTypes.INBOX,
  activeMessage: 0,
  showCompose: false,
  mailSent: false,
  reply: false,
};

const reducer = handleActions({
  [combineActions(showComposeModal)](state, { payload: { showCompose } }) {
    return {
      ...state,
      reply: false,
      showCompose: !state.showCompose
    };
  },
  [combineActions(getMessages)](state, { payload: { messages } }) {
    return {
      ...state,
      messages
    };
  },
  [combineActions(setActiveFolder)](state, { payload: { activeFolder } }) {
    return {
      ...state,
      activeFolder
    };
  },
  [combineActions(setActiveMessage)](state, { payload: { activeMessage } }) {
    return {
      ...state,
      activeMessage
    };
  },
  [combineActions(showReplyModal)](state, { payload: { reply } }) {
    return {
      ...state,
      reply: true,
      showCompose: !state.showCompose
    };
  },
  [combineActions(sendMail)](state, { payload: { mailSent } }) {
    return {
      ...state,
      mailSent
    };
  }
}, defaultState);

export default reducer;
