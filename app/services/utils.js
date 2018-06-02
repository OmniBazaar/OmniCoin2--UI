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
        const messageType = Object.keys(messageTypes).find(key => messageTypes[key] === msg.type);
        return emitter({ type: messageType, data: msg });
      } catch (e) {
        console.error(`Error parsing : ${e.data}`);
      }
    };
    return () => {
      console.log('Socket off');
    };
  });
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

function currencyConverter(amount, from, to) {
  const usdRates = {
     EUR: 0.86,
     GBP: 0.75,
     CAD: 0.76,
     SEK: 8.89,
     AUD: 0.75,
     JPY: 108.5
   };
  const omcUSD = 0.00333;
  const btcUSD = 7500;
  if (to === 'OMC') {
    return amount  / (omcUSD * (usdRates[from] || 1));
  }
  if (to === 'BTC') {
    return amount  / (btcUSD * (usdRates[from] || 1));
  }
}

export {
  wrapRequest,
  wsWatcher,
  reputationOptions,
  currencyConverter
};