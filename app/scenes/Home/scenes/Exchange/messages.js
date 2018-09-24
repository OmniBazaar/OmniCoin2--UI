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
    defaultMessage: "Exchange"
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
  exchangeError: {
    id: 'Exchange.exchangeError',
    defaultMessage: 'Having error when exchange'
  }
});

export default messages;
