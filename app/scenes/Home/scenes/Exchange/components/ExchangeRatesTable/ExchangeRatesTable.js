import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Loader } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { currencyConverter } from '../../../../../../services/utils';
import Rate from './Rate';
import messages from '../../messages';
import btcIcon from '../../../Wallet/images/th-bitcoin.svg';
import ethIcon from '../../../Wallet/images/eth-small.svg';
import xomIcon from '../../../Wallet/images/omnic.svg';

class ExchangeRatesTable extends Component {
	state = {
		xomToUsd: '--',
		btcToXom: '--',
		ethToXom: '--'
	}

	componentDidMount() {
		this.calculateRates(this.props.sale);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.sale !== this.props.sale || nextProps.currencyRates !== this.props.currencyRates) {
			this.calculateRates(nextProps.sale);
		}
	}

	calculateRates(sale) {
		let xomToUsd = '--';
		let btcToXom = '--';
		let ethToXom = '--';

		if (sale) {
			const { rates } = sale;
			if (rates && rates.OMNICOINtoUSD) {
				xomToUsd = rates.OMNICOINtoUSD;
			}
			btcToXom = currencyConverter(1, 'BITCOIN', 'OMNICOIN', false, rates);
			ethToXom = currencyConverter(1, 'ETHEREUM', 'OMNICOIN', false, rates);
		}

		this.setState({
			xomToUsd,
			btcToXom,
			ethToXom
		});
	}

	render() {
		const { formatMessage } = this.props.intl;

		return (
			<div className='exchange-rates'>
				<div className='title'>{formatMessage(messages.exchangeRate)}</div>
				<Rate icon={xomIcon} fromName='XOM' toName='USD' rate={this.state.xomToUsd} />
				<Rate icon={btcIcon} fromName='BTC' toName='XOM' rate={this.state.btcToXom} />
				<Rate icon={ethIcon} fromName='ETH' toName='XOM' rate={this.state.ethToXom} />
			</div>
		);
	}
}

export default connect(
	state => ({
		sale: state.default.exchange.sale,
		currencyRates: state.default.exchange.sale.rates
	})
)(injectIntl(ExchangeRatesTable));