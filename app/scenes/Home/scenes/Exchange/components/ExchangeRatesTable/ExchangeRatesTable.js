import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Loader } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { exchangeXOM } from '../../../../../../services/utils';
import { exchangeRequestRates } from '../../../../../../services/exchange/exchangeActions';
import Rate from './Rate';
import messages from '../../messages';
import btcIcon from '../../../Wallet/images/th-bitcoin.svg';
import ethIcon from '../../../Wallet/images/eth-small.svg';
import xomIcon from '../../../Wallet/images/omnic.svg';

class ExchangeRatesTable extends Component {
	componentDidMount() {
		this.props.exchangeActions.exchangeRequestRates();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.exchange.requestingRates && !nextProps.exchange.requestingRates) {
			if (nextProps.exchange.requestRatesError) {
				const { formatMessage } = this.props.intl;
				toastr.error(formatMessage(messages.error), formatMessage(messages.requestExchangeRateFail));
			}
		}
	}

	render() {
		const { formatMessage } = this.props.intl;
		const { requestingRates, rates } = this.props.exchange;

		return (
			<div className='exchange-rates'>
				<div className='title'>{formatMessage(messages.exchangeRate)}</div>
				<Rate icon={xomIcon} fromName='XOM' toName='USD' rate={rates ? rates.xomToUsd : 0} />
				<Rate icon={btcIcon} fromName='BTC' toName='XOM' rate={rates ? exchangeXOM(1, rates.btcToXom) : 0} />
				<Rate icon={ethIcon} fromName='ETH' toName='XOM' rate={rates ? exchangeXOM(1, rates.ethToXom) : 0} />
			</div>
		);
	}
}

export default connect(
	state => ({
		exchange: state.default.exchange
	}),
	dispatch => ({
		exchangeActions: bindActionCreators({
			exchangeRequestRates
		}, dispatch)
	})
)(injectIntl(ExchangeRatesTable));