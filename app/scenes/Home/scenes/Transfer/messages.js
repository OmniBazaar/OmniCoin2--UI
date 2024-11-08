import { defineMessages } from 'react-intl';

export default defineMessages({
  accountDoNotExist: {
    id: 'Transfer.accountDoNotExist',
    defaultMessage: 'Account doesn\'t exist.'
  },
  transfer: {
    id: 'Transfer.transfer',
    defaultMessage: 'Transfer'
  },
  from: {
    id: 'Transfer.from',
    defaultMessage: 'From'
  },
  to: {
    id: 'Transfer.to',
    defaultMessage: 'To'
  },
  TRANSFER: {
    id: 'Transfer.TRANSFER',
    defaultMessage: 'TRANSFER'
  },
  fieldRequired: {
    id: 'Transfer.fieldRequired',
    defaultMessage: 'This field is required.'
  },
  accountName: {
    id: 'Transfer.accountName',
    defaultMessage: 'Account Name'
  },
  bitcoinAddress: {
    id: 'Transfer.bitcoinAddress',
    defaultMessage: 'Bitcoin address'
  },
  ethereumAddress: {
    id: 'Transfer.ethereumAddress',
    defaultMessage: 'Ether address'
  },
  pleaseEnter: {
    id: 'Transfer.pleaseEnter',
    defaultMessage: 'Please enter'
  },
  amount: {
    id: 'Transfer.amount',
    defaultMessage: 'Amount'
  },
  reputation: {
    id: 'Transfer.reputation',
    defaultMessage: 'Rate your transaction.'
  },
  memo: {
    id: 'Transfer.memo',
    defaultMessage: 'Memo'
  },
  transferSecurity: {
    id: 'Transfer.transferSecurity',
    defaultMessage: 'SecureSend Payment Protection'
  },
  useEscrowService: {
    id: 'Transfer.useEscrowService',
    defaultMessage: 'SecureSend (Payment Protection Service).'
  },
  secureTransferNote: {
    id: 'Transfer.secureTransferNote',
    defaultMessage: '(Highly recommended if you do not know the seller)'
  },
  successTransfer: {
    id: 'Transfer.successUpdate',
    defaultMessage: 'Transfer successful.'
  },
  failedTransfer: {
    id: 'Transfer.failedUpdate',
    defaultMessage: 'Transfer\'s not success, it may be cryptocurrency network problem or not enough funds to pay transaction amount and fees, please try again'
  },
  insufficientFunds: {
    id: 'Transfer.insufficientFunds',
    defaultMessage: 'Insufficient funds'
  },
  selectEscrow: {
    id: 'Transfer.selectEscrow',
    defaultMessage: 'Select escrow'
  },
  transferToEscrow: {
    id: 'Transfer.transferToEscrow',
    defaultMessage: 'Transfer to escrow'
  },
  expirationTime: {
    id: 'Transfer.expirationTime',
    defaultMessage: 'Expiration time'
  },
  oneDay: {
    id: 'Transfer.oneDay',
    defaultMessage: '1 day'
  },
  threeDays: {
    id: 'Transfer.threeDays',
    defaultMessage: '3 days'
  },
  oneWeek: {
    id: 'Transfer.oneWeek',
    defaultMessage: '1 week'
  },
  twoWeeks: {
    id: 'Transfer.twoWeeks',
    defaultMessage: '2 weeks'
  },
  oneMonth: {
    id: 'Transfer.oneMonth',
    defaultMessage: '1 month'
  },
  threeMonths: {
    id: 'Transfer.threeMonths',
    defaultMessage: '3 months'
  },
  escrowFee: {
    id: 'Transfer.escrowFee',
    defaultMessage: 'Escrow Fee: 1%({xomAmount} XOM)'
  },
  transferToEscrowLabel: {
    id: 'Transfer.transferToEscrowLabel',
    defaultMessage: 'Funds will be kept in an escrow account.'
  },
  warning: {
    id: 'Transfer.warning',
    defaultMessage: 'Warning'
  },
  escrowsNotFound: {
    id: 'Transfer.escrowNotFound',
    defaultMessage: 'You don\'t any have any approved escrow agents in common with the specified account. Go to the "Escrow" tab and approve some additional escrow agents.'
  },
  numberRequired: {
    id: 'Transfer.numberRequired',
    defaultMessage: 'Number required'
  },
  numberExceedsDecimalsLimit: {
    id: 'Transfer.numberExceedsDecimalsLimit',
    defaultMessage: 'Amount cannot have more than {limit} numbers after decimal'
  },
  numberCannotBeNegative: {
    id: 'Transfer.numberCannotBeNegative',
    defaultMessage: 'Amount cannot be a negative value'
  },
  currency: {
    id: 'Transfer.currency',
    defaultMessage: 'Select Currency'
  },
  selectWallet: {
    id: 'Transfer.selectWallet',
    defaultMessage: 'Select Wallet'
  },
  transactionID: {
    id: 'Transfer.transactionID',
    defaultMessage: 'Transaction ID'
  },
  maxLength: {
    id: 'Transfer.maxLength',
    defaultMessage: 'Memo must be less than 150 characters.'
  },
  defaultWalletLabel: {
    id: 'Transfer.defaultWalletLabel',
    defaultMessage: 'Wallet'
  },
  confirmEthereumCurrency: {
    id: 'Transfer.confirmEthereumCurrency',
    defaultMessage: 'Are you sure you want to pay in Ethereum?'
  },
  shipping: {
    id: 'Transfer.shipping',
    defaultMessage: 'Shipping'
  },
  shippingCost: {
    id: 'Transfer.shippingCost',
    defaultMessage: 'Shipping cost'
  },
  shippingCostIsIncluded: {
    id: 'Transfer.shippingCostIsIncluded',
    defaultMessage: 'Shipping cost is included in listing price'
  },
  contactSellerForShippingCosts: {
    id: 'Transfer.contactSellerForShippingCosts',
    defaultMessage: 'Contact seller for shipping costs'
  },
  enterBitcoinAddress: {
    id: 'Transfer.enterBitcoinAddress',
    defaultMessage: 'Please enter Bitcoin address'
  },
  manualEnterAddress: {
    id: 'Transfer.manualEnter',
    defaultMessage: 'Enter address manually'
  },
  privateKey: {
    id: 'Transfer.privateKey',
    defaultMessage: 'Private key WIF'
  },
  enterPrivateKey: {
    id: 'Transfer.enterPrivateKey',
    defaultMessage: 'Please enter private key'
  },
  maximumAmountAvailable: {
    id: 'Transfer.maximumAmountAvailable',
    defaultMessage: 'Maximum amount available is {amount}'
  },
  fee: {
    id: 'Transfer.fee',
    defaultMessage: 'Fee'
  },
  secureTransferExplain: {
    id: 'Transfer.secureTransferExplain',
    defaultMessage: 'Explainer video '
  }
});
