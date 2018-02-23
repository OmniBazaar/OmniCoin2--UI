import {
  SEND_MAIL,
  SHOW_COMPOSE,
  SET_ACTIVE_FOLDER,
  SET_ACTIVE_MESSAGE,
  GET_MESSAGES,
  SHOW_REPLY,
} from './mailActions';

const MailTypes = Object.freeze({
  INBOX: 'inbox',
  OUTBOX: 'outbox',
  SENT: 'sent',
  DELETED: 'deleted',
});

const initialState = {
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

const reducer = (state = initialState, action) => {
  if (!state._hydrated) {
    state = { ...initialState, ...state, _hydrated: true };
  }

  switch (action.type) {
    case SEND_MAIL:
      return {
        ...state,
        payload: {
          mailSent: action.payload,
        }
      };
    case SHOW_COMPOSE:
      return {
        ...state,
        reply: false,
        showCompose: !state.showCompose
      };
    case SHOW_REPLY:
      return {
        ...state,
        reply: true,
        showCompose: !state.showCompose
      };
    case SET_ACTIVE_FOLDER:
      return {
        ...state,
        activeFolder: action.payload
      };
    case SET_ACTIVE_MESSAGE:
      return {
        ...state,
        activeMessage: action.payload
      };
    case GET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
