import { getCurrencyAbbreviation } from "../../../../utils/listings";
import {purchaseInfoSubject} from "../../../../services/mail/mailSaga";
import mailMessages from "./messages";
import { getStoredCurrentUser } from "../../../../services/blockchain/auth/services";

export function getSubjectFromMessage(message, formatMessage) {
  const { username } = getStoredCurrentUser();
  if (message.subject === purchaseInfoSubject) {
    const body = JSON.parse(message.body);
    if (username === message.sender) {
      return formatMessage(mailMessages.buyPurchaseSubject, {
        seller: body.seller,
        listing: body.listingTitle
      })
    } else {
      return formatMessage(mailMessages.sellPurchaseSubject, {
        buyer: body.buyer,
        listing: body.listingTitle
      });
    }
  } else {
    return message.subject;
  }
}

export function getBodyFromMessage(message, formatMessage) {
  const { username } = getStoredCurrentUser();
  if (message.subject === purchaseInfoSubject) {
    const body = JSON.parse(message.body);
    let result;
    if (username === message.sender) {
      result = formatMessage(mailMessages.buyPurchaseBody, {
        seller: body.seller,
        number: body.listingCount,
        listing: body.listingTitle,
        listingId: body.listingId,
        price: body.amount,
        currency: getCurrencyAbbreviation(body.currency)
      });
    } else {
      result = formatMessage(mailMessages.sellPurchaseBody, {
        buyer: message.user,
        number: body.listingCount,
        listing: body.listingTitle,
        listingId: body.listingId,
        price: body.amount,
        currency: getCurrencyAbbreviation(body.currency)
      });
    }
    if (body.shipment) {
      if (body.shipment.buyerAddress) {
        result += '\n' + formatMessage(mailMessages.shipmentAddress, body.shipment.buyerAddress);
      }
      
      if (body.shipment.shippingCost) {
        console.log({cost: body.shipment.shippingCost})
        result += '\n' + formatMessage(mailMessages.shippingCost, body.shipment.shippingCost);
      }
    }

    return result;
  } else {
    return message.body;
  }
}
