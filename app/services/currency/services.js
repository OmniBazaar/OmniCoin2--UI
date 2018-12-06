import request from 'request-promise-native';

import config from '../../config/config';

export const requestCurrencyRates = async () => {
	const response = await request({
    uri: `${config.exchangeServer}/rate/currencyRates`,
    json: true
  });

  return response.rates;
}