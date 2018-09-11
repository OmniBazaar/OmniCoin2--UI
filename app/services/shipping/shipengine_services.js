import request from 'request-promise-native';
import countryRegionData from 'country-region-data/data';
import { shipEngineApiKey } from '../../config/config';

const shipEngineBaseApi = 'https://api.shipengine.com/v1';

const countries = {};
countryRegionData.forEach(c => countries[c.countryName] = c);

const makeRequest = async (api, options) => {
	options = options || {};
	const opts = {
    uri: `${shipEngineBaseApi}/${api}`,
    ...options,
    headers: {
    	'api-key': shipEngineApiKey,
    	'Content-type': 'application/json',
      ...options.headers,
    }
  };
  const response = await request(opts);
  return JSON.parse(response);
}

const getCarriers = async () => {
	const response = await makeRequest('carriers', { method: 'GET' });

	console.log({carriers: response})

	if (!response.carriers) {
		return [];
	}

	return response.carriers.map(ca => ca.carrier_id);
}

const findCountryStateCode = (shipAddress) => {
	const country = shipAddress.country;
	const state = shipAddress.state;

	const countryData = countries[country];
	if (!countryData) {
		throw new Error('Not valid country');
	}

	const countryCode = countryData.countryShortCode;
	for (let i = 0; i < countryData.regions; i++) {
		if (countryData.regions[i].name === state) {
			return {
				countryCode,
				stateCode: countryData.regions[i].shortCode
			};
		}
	}

	return {
		countryCode,
		stateCode: ''
	};
}

export const getShippingRates = async (shipFrom, shipTo, packageData) => {
	const carriers = await getCarriers();
	if (carriers.length === 0) {
		return [];
	}

	const shipFromCountryState = findCountryStateCode(shipFrom);
	const shipToCountryState = findCountryStateCode(shipTo);

	const shipFromData = {
		name: shipFrom.name,
		phone: '11111111',
    address_line1: shipFrom.address ? shipFrom.address : shipFrom.city,
    city_locality: shipFrom.city,
    state_province: shipFrom.state,//shipFromCountryState.stateCode,
    postal_code: shipFrom.postalCode,
    country_code: shipFromCountryState.countryCode
	};

	const shipToData = {
		name: shipTo.name,
		phone: '11111111',
    address_line1: shipTo.address ? shipTo.address : shipTo.city,
    city_locality: shipTo.city,
    state_province: shipToCountryState.stateCode,
    postal_code: shipTo.postalCode,
    country_code: shipToCountryState.countryCode
	};

	const data = {
		shipment: {
			validate_address: 'no_validation',
			ship_to: shipToData,
			ship_from: shipFromData,
			packages: [
				{ ...packageData }
			],
			customs: {
	      contents: "merchandise",
	      customs_items: [
	        {
          	description: "merchandise",
	          quantity: 1,
	          value: 1.0,
	          country_of_origin: shipFromCountryState.countryCode
	        }
	      ],
	      non_delivery: "treat_as_abandoned"
	    }
		},
		rate_options: {
			carrier_ids: carriers
		}
	};

	console.log({data})

	const response = await makeRequest('rates', {
		method: 'POST',
		json: data
	});

	console.log(response);

	if(response.errors) {
		throw new Error(response.errors[0].message);
	}

	if (!response.rate_response || !response.rate_response.rates) {
		throw new Error('Cannot found shipping rates');
	}

	const carrierRates = {};
	response.rate_response.rates.forEach(rate => {
		if (!carrierRates[rate.carrier_id]) {
			carrierRates[rate.carrier_id] = {
				id: rate.carrier_id,
				name: rate.carrier_friendly_name, 
				rates: []
			};
		}
		carrierRates[rate.carrier_id].rates.push(rate);
	});

	return Object.keys(carrierRates).map(carrierId => {
		const carrier = carrierRates[carrierId];
		const price = carrier.rates.reduce((price, rate) => price + rate.shipping_amount.amount, 0);

		return {
			id: carrier.id,
			name: carrier.name,
			price: Math.round(price / carrier.rates.length * 100) / 100
		}
	});
}