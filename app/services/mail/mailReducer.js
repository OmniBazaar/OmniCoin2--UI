import { handleActions, combineActions } from 'redux-actions';
import {
  showComposeModal,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
} from './mailActions';

import MailTypes from './mailTypes';
import {sendMail} from './mailSaga';

let defaultState = {

  messages: {
    [MailTypes.INBOX]: [],
    [MailTypes.OUTBOX]: [],
    [MailTypes.SENT]: [],
    [MailTypes.DELETED]: []
  },
  sender: '',
  to: '',
  subject: '',
  body: '',
  activeFolder: MailTypes.INBOX,
  activeMessage: 0,
  showCompose: false,
  mailSent: false,
  reply: false
};

const reducer = handleActions({
  [combineActions(showComposeModal)](state, { payload: { showCompose } }) {
    return {
      ...state,
      reply: false,
      showCompose: !state.showCompose
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
      ...state
    };
  },
  CHANGE_FOLDER_UPDATE: (state = null, action) => {
    return {
      ...state,
      messages: {
        ...state.messages,
        [action.messageFolder]: action.messages,
      },
      activeFolder: action.messageFolder
    };
  }
}, defaultState);

export default reducer;
