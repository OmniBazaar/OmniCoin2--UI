import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table, Loader } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { exchangeXOM } from '../../../../../../services/utils';
import { exchangeRequestRates } from '../../../../../../services/exchange/exchangeActions';
import messages from '../../messages';

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
			<Table celled striped>
		    <Table.Header>
		      <Table.Row>
		        <Table.HeaderCell colSpan='2'>{formatMessage(messages.exchangeRate)}</Table.HeaderCell>
		      </Table.Row>
		    </Table.Header>

		    <Table.Body>
		      <Table.Row>
		        <Table.Cell>
		          1 BTC
		        </Table.Cell>
		        <Table.Cell>
		        	{
		        		requestingRates ?
		        		<Loader size='tiny' active inline='centered' /> :
		        		<span>{rates ? exchangeXOM(1, rates.btcToXom) : 0} XOM</span>
		        	}
		        </Table.Cell>
		      </Table.Row>
		      <Table.Row>
		        <Table.Cell>
		          1 ETH
		        </Table.Cell>
		        <Table.Cell>
		        	{
		        		requestingRates ?
		        		<Loader size='tiny' active inline='centered' /> :
		        		<span>{rates ? exchangeXOM(1, rates.ethToXom) : 0} XOM</span>
		        	}
		        </Table.Cell>
		      </Table.Row>
		    </Table.Body>
		  </Table>
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