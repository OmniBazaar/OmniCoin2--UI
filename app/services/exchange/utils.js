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
    defaultMessage: 'You requested XOM for {cryptoAmount} BTC.\n Transaction id: {txid}'
  },
  exchangeBodyETH: {
    id: 'ExchangeService.exchangeBodyETH',
    defaultMessage: 'You requested XOM for {cryptoAmount} ETH.\n Transaction hash: {txid}'
  }
});

export const sendBTCMail = (btcAmount, txid, formatMessage) => {
  const currentUser = getStoredCurrentUser();
  sendMail(
    currentUser.username,
    currentUser.username,
    formatMessage(messages.exchangeSubject),
    formatMessage(messages.exchangeBodyBTC, {
      cryptoAmount: btcAmount,
      txid
    })
  )
};

export const sendETHMail = (ethAmount, txid, formatMessage) => {
  const currentUser = getStoredCurrentUser();
  sendMail(
    currentUser.username,
    currentUser.username,
    formatMessage(messages.exchangeSubject),
    formatMessage(messages.exchangeBodyETH, {
      cryptoAmount: ethAmount,
      txid
    })
  );
};
