import { createActions } from 'redux-actions';

const {
  sendCommand,
} = createActions({
  SEND_COMMAND: (command) => ({ command }),
});

export {
	sendCommand
};
