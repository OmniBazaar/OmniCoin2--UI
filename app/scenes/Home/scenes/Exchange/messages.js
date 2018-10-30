import { defineMessages } from "react-intl";

const messages = defineMessages({
  currency: {
    id: "Exchange.currency",
    defaultMessage: "Currency"
  },
  amount: {
    id: "Exchange.amount",
    defaultMessage: "Amount"
  },
  numberRequired: {
    id: "Exchange.numberRequired",
    defaultMessage: "Number required"
  },
  numberExceedsDecimalsLimit: {
    id: "Exchange.numberExceedsDecimalsLimit",
    defaultMessage: "Amount cannot have more than {limit} numbers after decimal"
  },
  numberCannotBeNegative: {
    id: "Exchange.numberCannotBeNegative",
    defaultMessage: "Amount cannot be a negative value"
  },
  willReceive: {
    id: "Exchange.youWillReceive",
    defaultMessage: "You will receive"
  },
  selectWallet: {
    id: "Exchange.selectWallet",
    defaultMessage:"Select wallet"
  },
  exchange: {
    id: "Exchange.exchange",
    defaultMessage: "Purchase OmniCoins"
  },
  from: {
    id: "Exchange.from",
    defaultMessage: "From"
  },
  fieldRequired: {
    id: "Exchange.fieldRequired",
    defaultMessage: "This field is required."
  },
  error: {
    id: "Exchange.error",
    defaultMessage: "Error"
  },
  success: {
    id: "Exchange.success",
    defaultMessage: "Success"
  },
  successExchange: {
    id: "Exchange.successExchange",
    defaultMessage: "You will receive funds as soon as the payment will be confirmed by the network"
  },
  errorExchange: {
    id: 'Exchange.errorExchange',
    defaultMessage: 'Not enough funds'
  },
  walletNotConnected: {
    id: 'Exchange.walletNotConnected',
    defaultMessage: 'You haven\'t connected a wallet yet'
  },
  maximumAmountAvailable: {
    id: 'Exchange.maximumAmountAvailable',
    defaultMessage: 'Maximum amount available is {amount}'
  },
  minimumAmount: {
    id: 'Exchange.minimumAmount',
    defaultMessage: 'Minimum amount is {amount}'
  },
  warning: {
    id: 'Exchange.warning',
    defaultMessage: 'Warning'
  },
  pageDescription: {
    id: 'Exchange.pageDescription',
    defaultMessage: 'This page will allow you to purchase OmniCoins using funds contained in your Bitcoin and Ether wallets in this OmniBazaar application. If you have not already done so, you must first transfer some bitcoins or ether into your OmniBazaar wallets.'
  },
  readOmniCoinWhitePaperText: {
    id: 'Exchange.readOmniCoinWhitePaperText',
    defaultMessage: 'I have read and understand the '
  },
  readOmniCoinWhitePaperLink: {
    id: 'Exchange.readOmniCoinWhitePaperLink',
    defaultMessage: 'OmniBazaar/OmniCoin White Paper'
  },
  readOmniCoinInformationMemorandumText: {
    id: 'Exchange.readOmniCoinInformationMemorandumText',
    defaultMessage: 'I have read and understand the disclosures and warnings contained in the'
  },
  readOmniCoinInformationMemorandumLink: {
    id: 'Exchange.readOmniCoinInformationMemorandumLink',
    defaultMessage: 'OmniCoin Information Memorandum'
  },
  readOmniCoinTokenPurchaseAgreementText: {
    id: 'Exchange.readOmniCoinTokenPurchaseAgreementText',
    defaultMessage: 'I have read, understand, and agree with the terms of the'
  },
  readOmniCoinTokenPurchaseAgreementLink: {
    id: 'Exchange.readOmniCoinTokenPurchaseAgreementLink',
    defaultMessage: 'OmniCoin General Terms of Service.'
  },
  understandOmniCoinTokenPurchaseAgreement: {
    id: 'Exchange.understandOmniCoinTokenPurchaseAgreement',
    defaultMessage: ' I understand that I am buying tokens for use in the OmniBazaar marketplace, and that those tokens do not represent any ownership, interest, dividends, control or other rights in OmniBazaar Inc., OmniCoin Foundation Company, or any other business entity. I understand the that the value of the tokens may go up or down in relation to products in the marketplace, other cryptocurrency tokens and my local currency.'
  },
  exchangeRate: {
    id: 'Exchange.exchangeRate',
    defaultMessage: 'Exchange rate'
  },
  accountNotVerified: {
    id: 'Exchange.accountNotVerified',
    defaultMessage: "Your account's not verified to do exchange"
  },
  omniCoinsAppearNotification: {
    id: 'Exchange.omniCoinsAppearNotification',
    defaultMessage: 'Purchased OmniCoins will appear in your XOM wallet after 2 BTC or 11 ETH blockchain confirmations.'
  },
  requestExchangeRateFail: {
    id: 'Exchange.requestExchangeRateFail',
    defaultMessage: 'Get exchange rates fail'
  },
  ethTransactionNotValid: {
    id: 'Exchange.ethTransactionNotValid',
    defaultMessage: 'Unfortunately the Ethereum transaction was not created successfully and coin will be returned back to your wallet, please try again'
  }
});

export default messages;
