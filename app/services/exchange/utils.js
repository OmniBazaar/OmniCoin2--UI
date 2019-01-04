import { sendMail } from "../mail/utils";
import { getStoredCurrentUser } from "../../services/blockchain/auth/services";
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  exchangeSubject: {
    id: 'ExchangeService.exchange',
    defaultMessage: 'Exchange Request'
  },
  exchangeBodyBTC: {
    id: 'ExchangeService.exchangeBodyBTC',
    defaultMessage: 'You requested {xom} XOM for {cryptoAmount} BTC.\nTransaction id: {txid}\nBTC transaction fee: {btcFee} BTC'
  },
  exchangeBodyETH: {
    id: 'ExchangeService.exchangeBodyETH',
    defaultMessage: 'You requested {xom} XOM for {cryptoAmount} ETH.\nTransaction hash: {txid}\nETH transaction estimated fee: {ethEstimatedFee} ETH'
  }
});

export const sendBTCMail = (btcAmount, xom, txid, btcFee, formatMessage) => {
  const currentUser = getStoredCurrentUser();
  sendMail(
    currentUser.username,
    currentUser.username,
    formatMessage(messages.exchangeSubject),
    formatMessage(messages.exchangeBodyBTC, {
      xom,
      cryptoAmount: btcAmount,
      txid,
      btcFee
    })
  )
};

export const sendETHMail = (ethAmount, xom, txid, ethEstimatedFee, formatMessage) => {
  const currentUser = getStoredCurrentUser();
  sendMail(
    currentUser.username,
    currentUser.username,
    formatMessage(messages.exchangeSubject),
    formatMessage(messages.exchangeBodyETH, {
      xom,
      cryptoAmount: ethAmount,
      txid,
      ethEstimatedFee
    })
  );
};
