import { getCurrencyAbbreviation } from "../../../../utils/listings";
import {purchaseInfoSubject} from "../../../../services/mail/mailSaga";
import mailMessages from "./messages";
import listingFormMessages from '../Marketplace/scenes/Listing/scenes/AddListing/messages';
import { getStoredCurrentUser } from "../../../../services/blockchain/auth/services";
import { getWeightUnit, getSizeUnit } from '../Marketplace/scenes/Listing/utils';

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
        result += '\n' + formatMessage(mailMessages.shippingCost, body.shipment.shippingCost);
      }
    }

    if (body.weightAndSize) {
      result += `\n${formatMessage(listingFormMessages.weightAndSize)}:`;
      if (body.weightAndSize.weight) {
        result += `\n  ${formatMessage(listingFormMessages.weight)}: ${body.weightAndSize.weight} ${formatMessage(getWeightUnit(body.weightAndSize)).toLowerCase()}`;
      }
      if (body.weightAndSize.width) {
        result += `\n  ${formatMessage(listingFormMessages.width)}: ${body.weightAndSize.width} ${formatMessage(getSizeUnit(body.weightAndSize, 'width_unit')).toLowerCase()}`;
      }
      if (body.weightAndSize.height) {
        result += `\n  ${formatMessage(listingFormMessages.height)}: ${body.weightAndSize.height} ${formatMessage(getSizeUnit(body.weightAndSize, 'height_unit')).toLowerCase()}`;
      }
      if (body.weightAndSize.length) {
        result += `\n  ${formatMessage(listingFormMessages.length)}: ${body.weightAndSize.length} ${formatMessage(getSizeUnit(body.weightAndSize, 'length_unit')).toLowerCase()}`;
      }
    }

    return result;
  } else {
    return message.body;
  }
}
