import { defineMessages } from 'react-intl';

export default defineMessages({
  enterPassword: {
    id: 'ExistingWallet.enterPassword',
    defaultMessage: 'Enter Password for Account Access'
  },
  pleaseEnter: {
    id: 'ExistingWallet.pleaseEnter',
    defaultMessage: 'Please Enter'
  },
  walletGuid: {
    id: 'ExistingWallet.walletGuid',
    defaultMessage: 'Wallet GUID'
  },
  cancel: {
    id: 'ExistingWallet.cancel',
    defaultMessage: 'CANCEL'
  },
  connect: {
    id: 'ExistingWallet.connect',
    defaultMessage: 'CONNECT'
  },
  fieldRequired: {
    id: 'NewWallet.required',
    defaultMessage: 'This field is required.'
  },
  connectErrorTitle: {
    id: 'NewWallet.connectErrorTitle',
    defaultMessage: 'Connect error'
  },
  connectErrorMessage: {
    id: 'NewWallet.connectErrorMessage',
    defaultMessage: 'Having error when conneting wallet'
  },
  ipError: {
    id: 'ExistingWallet.ipError',
    defaultMessage: 'This wallet was created on a different ip. Please whitelist {ip} in blockchain.info.'
  }
});
