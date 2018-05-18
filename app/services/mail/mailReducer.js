import { handleActions, combineActions } from 'redux-actions';
import {
  showComposeModal,
  setActiveFolder,
  setActiveMessage,
  showReplyModal,
} from './mailActions';

import MailTypes from './mailTypes';
import { sendMail } from './mailSaga';

const defaultState = {

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
  error: null,
  activeFolder: MailTypes.INBOX,
  activeMessage: 0,
  showCompose: false,
  mailSent: false,
  reply: false
};

const reducer = handleActions({
  [combineActions(showComposeModal)](state) {
    return {
      ...state,
      reply: false,
      mailSent: false,
      error: null,
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
  [combineActions(showReplyModal)](state) {
    return {
      ...state,
      reply: true,
      showCompose: !state.showCompose
    };
  },
  [combineActions(sendMail)](state) {
    return {
      ...state
    };
  },
  LOAD_FOLDER_UPDATE: (state, action) => ({
    ...state,
    messages: {
      ...state.messages,
      [action.messageFolder]: action.messages,
    }
  }),
  EMAIL_SENT_SUCCEEDED: (state, {}) => ({
    ...state,
    mailSent: true,
    error: null,
  }),
  EMAIL_SENT_FAILED: (state, { error }) => ({
    ...state,
    mailSent: false,
    error
  }),
}, defaultState);

export default reducer;
