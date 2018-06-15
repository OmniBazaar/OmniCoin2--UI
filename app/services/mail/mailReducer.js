import { handleActions } from 'redux-actions';
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
  loading: false,
  activeFolder: MailTypes.INBOX,
  activeMessage: 0,
  showCompose: false,
  mailSent: false,
  reply: false
};

const reducer = handleActions({
  [showComposeModal](state) {
    return {
      ...state,
      reply: false,
      mailSent: false,
      error: null,
      showCompose: !state.showCompose
    };
  },
  [setActiveFolder](state, { payload: { activeFolder } }) {
    return {
      ...state,
      activeFolder
    };
  },
  [setActiveMessage](state, { payload: { activeMessage } }) {
    return {
      ...state,
      activeMessage
    };
  },
  [showReplyModal](state) {
    return {
      ...state,
      reply: true,
      showCompose: !state.showCompose
    };
  },
  [sendMail](state) {
    return {
      ...state,
      loading: true,
      error: null
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
    loading: false,
    error: null,
  }),
  EMAIL_SENT_FAILED: (state, { error }) => ({
    ...state,
    mailSent: false,
    loading: false,
    error
  }),
}, defaultState);

export default reducer;
