import {defineMessages} from "react-intl";

export default defineMessages({
  compose: {
    id: 'Mail.compose',
    defaultMessage: 'Compose'
  },
  close: {
    id: 'Mail.close',
    defaultMessage: 'CLOSE'
  },
  newMessage: {
    id: 'Mail.newMessage',
    defaultMessage: 'New Message'
  },
  to: {
    id: 'Mail.to',
    defaultMessage: 'To'
  },
  subject: {
    id: 'Mail.subject',
    defaultMessage: 'Subject'
  },
  enterSubject: {
    id: 'Mail.enterSubject',
    defaultMessage: 'Enter subject'
  },
  enterUsername: {
    id: 'Mail.enterUsername',
    defaultMessage: 'Enter Username'
  },
  message: {
    id: 'Mail.message',
    defaultMessage: 'Message'
  },
  enterMessage: {
    id: 'Mail.enterMessage',
    defaultMessage: 'Enter message'
  },
  send: {
    id: 'Mail.send',
    defaultMessage: 'SEND'
  },
  cancel: {
    id: 'Mail.cancel',
    defaultMessage: 'CANCEL'
  },
  addressBook: {
    id: 'Mail.addressBook',
    defaultMessage: 'ADDRESS BOOK'
  },
  success: {
    id: 'Mail.success',
    defaultMessage: 'Success'
  },
  mailSent: {
    id: 'Mail.mailSent',
    defaultMessage: 'Mail sent successfully'
  },
  error: {
    id: 'Mail.error',
    defaultMessage: 'Error'
  },
  mailNotSent: {
    id: 'Mail.mailNotSent',
    defaultMessage: 'There was an error while trying to send your mail'
  },
  usernameDoesNotExist: {
    id: 'Mail.usernameDoesNotExist',
    defaultMessage: 'Not found'
  },
  required: {
    id: 'Mail.required',
    defaultMessage: 'Required'
  },
  sellPurchaseSubject: {
    id: 'Mail.sellPurchaseSubject',
    defaultMessage: '{buyer} bought {listing}'
  },
  sellPurchaseBody: {
    id: 'Mail.sellPurchaseBody',
    defaultMessage: '{buyer} bought {number} {listing}\nListing id: {listingId}\nPrice: {price}{currency}'
  },
  buyPurchaseSubject: {
    id: 'Mail.buyPurchaseSubject',
    defaultMessage: 'You bought {listing} from {seller}'
  },
  buyPurchaseBody: {
    id: 'Mail.buyPurchaseBody',
    defaultMessage: 'You bought {number} {listing} from {seller}\nListing id: {listingId}\nPrice: {price}{currency}'
  },
  replyBody: {
    id: 'Mail.replyBody',
    defaultMessage: '\n\nOn {date} <{sender}> wrote:\n\n{body}'
  },
  shipmentAddress: {
    id: 'Mail.shipmentAddress',
    defaultMessage: 'Shipment address:\n  Country: {country}\n  State: {state}\n  City: {city}\n  Address: {address}\n  Postal code: {postalCode}'
  },
  shippingCost: {
    id: 'Mail.shippingCost',
    defaultMessage: 'Shipping cost: {carrier} - {service}    {rate} USD'
  }
});
