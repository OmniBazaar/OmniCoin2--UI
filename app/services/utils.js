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
      } catch (err) {
        console.error(`Error parsing : ${err.data}`);
      }
    };
    return () => {
      console.log('Socket off');
    };
  });
}


function reputationOptions(from = 0, to = 10) {
  const options = [];

  for (let index = from; index < to + 1; index += 1) {
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
  USDtoETHEREUM: 0.002118,
  USDtoOMNICOIN: 300.03,
  USDtoGBP: 0.75,
  USDtoCAD: 0.76,
  USDtoSEK: 8.89,
  USDtoAUD: 0.75,
  USDtoJPY: 108.5
};
const MINIMUN_AMOUNT = 0;

const getAllowedAmount = (amount, noFixedValue) => {
  if (amount >= MINIMUN_AMOUNT) {
    return noFixedValue ? amount : amount.toFixed(5);
  }

  return MINIMUN_AMOUNT;
};

Object.keys(coefficients).forEach(key => {
  const units = key.split('to');
  coefficients[`${units[1]}to${units[0]}`] = 1 / coefficients[key];
});

const currencyConverter = (amount, fromCur, toCur, noFixedValue) => {
  if (fromCur === toCur) {
    return amount;
  }

  const d = `${fromCur}to${toCur}`;
  if (coefficients[d]) {
    return getAllowedAmount(amount * coefficients[d], noFixedValue);
  }

  const inverD = `${toCur}to${fromCur}`;
  if (coefficients[inverD]) {
    coefficients[d] = 1/coefficients[inverD];
    return getAllowedAmount(amount * coefficients[d], noFixedValue);
  }

  const toUSD = `${fromCur}toUSD`;
  const fromUSD = `USDto${toCur}`;
  if (!coefficients[toUSD] || !coefficients[fromUSD]) {
    return amount;
  }

  coefficients[d] = coefficients[toUSD] * coefficients[fromUSD];
  return getAllowedAmount(amount * coefficients[d], noFixedValue);
}


let minEthValues = {};
const getMinEthValue = (ethToXomRate) => {
  const key = (typeof ethToXomRate !== 'undefined') ? 'undefined' : (ethToXomRate + '');
  if (minEthValues[key]) {
    return minEthValues[key];
  }

  let minEth;
  if (typeof ethToXomRate !== 'undefined') {
    minEth = 0.00001 / parseFloat(ethToXomRate);
    minEth = minEth.toFixed(18);
  } else {
    minEth = currencyConverter(0.00001, 'OMNICOIN', 'ETHEREUM', true).toFixed(18);
  }
  
  let min = '';
  for (let i = 0; i < minEth.length; i++) {
    const c = minEth.charAt(i);
    if (c === '0' || c === '.') {
      min += c;
    } else {
      const v = parseInt(c) + 1;
      if (v < 10) {
        min += v;
      } else {
        min = v.substring(0, v.length - 1);
        min += '1';
      }

      minEthValues[key] = min;
      break;
    }
  }

  return minEthValues[key];
}

const exchangeXOM = (amount, rate) => {
  return getAllowedAmount(amount * parseFloat(rate));
}
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
  currencyConverter,
  getMinEthValue,
  exchangeXOM
};
