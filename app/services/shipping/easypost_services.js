import Easypost from '@easypost/api';
import countryRegionData from 'country-region-data/data';
import { easypostApiKey } from '../../config/config';

const countries = {};
countryRegionData.forEach(c => countries[c.countryName] = c);

const api = new Easypost(easypostApiKey);

const findCountryCode = (country) => {
  const countryData = countries[country];
  if (!countryData) {
    throw new Error('Not valid country');
  }

  return countryData.countryShortCode;
}

export const getShippingRates = async (fromAddress, toAddress, parcel, quantity) => {
  const fromAddr = new api.Address({
    street1: fromAddress.address ? fromAddress.address : fromAddress.city,
    city: fromAddress.city,
    state: fromAddress.state,
    zip: fromAddress.postalCode,
    country: findCountryCode(fromAddress.country),
    verify: ['delivery']
  });

  const toAddr = new api.Address({
    street1: toAddress.address ? toAddress.address : toAddress.city,
    city: toAddress.city,
    state: toAddress.state,
    zip: toAddress.postalCode,
    country: findCountryCode(toAddress.country),
    verify: ['delivery']
  });

  const parcelObject = new api.Parcel(parcel);

  const customsInfo = new api.CustomsInfo({ 
    eel_pfc: 'NOEEI 30.37(a)',
    customs_certify: false,
    contents_type: 'merchandise',
    contents_explanation: '',
    restriction_type: 'none',
    non_delivery_option: 'abandon',
    customs_items: [
      new api.CustomsItem({
        description: '',
        quantity: 1,
        weight: parcel.weight,
        value: 100,
        origin_country: findCountryCode(fromAddress.country)
      })
    ]
  });

  const shipments = [];
  const p = 1;
  if (quantity > 100) {
    p = quantity / 100.0;
    quantity = 100;
  }

  for (let i = 0; i < quantity; i++) {
    shipments.push(
      new api.Shipment({
        parcel: parcelObject,
        customs_info: customsInfo
      })
    );
  }

  const order = new api.Order({
    to_address: toAddr,
    from_address: fromAddr,
    shipments
  });

  const shipData = await order.save();

  if (!shipData.rates || !shipData.rates.length) {
    throw new Error(shipData.messages[0].message);
  }

  return shipData.rates.map(r => ({
    service: r.service,
    carrier: r.carrier,
    rate: parseFloat((parseFloat(r.rate) * p).toFixed(2)),
    currency: r.currency
  })).sort((a, b) => {
    if (a.rate < b.rate) {
      return -1;
    } else if (a.rate > b.rate) {
      return 1;
    }
    return 0;
  });
}