import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import { currencyConverter } from '../../../../../../services/utils';
import messages from '../../messages';

const ethToXom = currencyConverter(1, 'ETHEREUM', 'OMNICOIN');
const btcToXom = currencyConverter(1, 'BITCOIN', 'OMNICOIN');

class ExchangeRatesTable extends Component {
	render() {
		const { formatMessage } = this.props.intl;
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
		        	{btcToXom} XOM
		        </Table.Cell>
		      </Table.Row>
		      <Table.Row>
		        <Table.Cell>
		          1 ETH
		        </Table.Cell>
		        <Table.Cell>
		        	{ethToXom} XOM
		        </Table.Cell>
		      </Table.Row>
		    </Table.Body>
		  </Table>
		);
	}
}

export default injectIntl(ExchangeRatesTable);