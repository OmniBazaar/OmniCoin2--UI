import { eventChannel } from 'redux-saga';

function wrapRequest(func) {
  return async (...args) => {
    const res = await func(...args);
    if (res.status !== 200) {
      throw res;
    } else {
      return res.json();
    }
  };
}

function reputationOptions(from = 0, to = 10) {
  const options = [];

  for (let index = from; index < to + 1; index++) {
    const option = {
      key: index,
      value: index,
      text: index - 5
    };
    options.push(option);
  }

  return options;
}

function wsWatcher(socket, messageTypes) {
  return eventChannel(emitter => {
    socket.onopen = () => {
      console.log('Connection opened');
    };
    socket.onerror = (error) => {
      console.log(`WebSocket error ${error}`);
    };
    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg) {
          console.log('MSG ', msg);
        }
        const messageType = messageTypes.find(el => el.type === msg.type);
        return emitter({ type: messageType.action, data: msg });
      } catch (e) {
        console.error(`Error parsing : ${e.data}`);
      }
    };
    return () => {
      console.log('Socket off');
    };
  });
}
export {
  wrapRequest,
  wsWatcher,
  reputationOptions
};
