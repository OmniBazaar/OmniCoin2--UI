import { createActions } from 'redux-actions';

const {
  setReferral,
  sendCommand,
} = createActions({
  SET_REFERRAL: () => ({}),
  SEND_COMMAND: (command) => ({ command }),
});

export { setReferral, sendCommand };
