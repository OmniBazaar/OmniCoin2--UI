import { eventChannel } from 'redux-saga';
import {
  ob2SocketClosed,
  ob2SocketOpened
} from './marketplace/marketplaceActions';

function wrapRequest(func) {
  return async (...args) => {
    const res = await func(...args);
    if (res.status !== 200) {
      throw await res.json();
    } else {
      return res.json();
    }
  };
}


function wsWatcher(socket, messageTypes) {
  return eventChannel(emitter => {
    socket.onopen = () => {
      console.log('Connection opened');
      emitter(ob2SocketOpened());
    };
    socket.onerror = (error) => {
      console.log(`WebSocket error ${error}`);
      emitter(ob2SocketClosed());
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

const coefficients = {
  USDtoEUR: 0.86,
  USDtoBITCOIN: 0.000133,
  USDtoOMNICOIN: 300.03,
  USDtoGBP: 0.75,
  USDtoCAD: 0.76,
  USDtoSEK: 8.89,
  USDtoAUD: 0.75,
  USDtoJPY: 108.5
};

Object.keys(coefficients).forEach(key => {
  const units = key.split('to');
  coefficients[`${units[1]}to${units[0]}`] = 1 / coefficients[key];
});

const currencyConverter = (amount, fromCur, toCur) => {
  if (fromCur === toCur) {
    return amount;
  }

  const d = `${fromCur}to${toCur}`;
  if (coefficients[d]) {
    return amount * coefficients[d];
  }

  const inverD = `${toCur}to${fromCur}`;
  if (coefficients[inverD]) {
    coefficients[d] = 1 / coefficients[inverD];
    return amount * coefficients[d];
  }

  const toUSD = `${fromCur}toUSD`;
  const fromUSD = `USDto${toCur}`;
  if (!coefficients[toUSD] || !coefficients[fromUSD]) {
    return amount;
  }

  coefficients[d] = coefficients[toUSD] * coefficients[fromUSD];
  return amount * coefficients[d];
};
/*
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
    return (amount  / (omcUSD * (usdRates[from] || 1))).toFixed(2);
  }
  if (to === 'BTC') {
    return (amount  / (btcUSD * (usdRates[from] || 1))).toFixed(8);
  }
} */

export {
  wrapRequest,
  wsWatcher,
  reputationOptions,
  currencyConverter
};
