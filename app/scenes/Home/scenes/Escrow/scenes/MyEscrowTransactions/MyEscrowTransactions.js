import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'

import './my-escrow-transactions.scss';

import { loadEscrowTransactions } from '../../../../../../services/escrow/escrowActions';

const messages = defineMessages({
  transactionID: {
    id: 'MyEscrowTransactions.transactionID',
    defaultMessage: 'Transaction ID'
  },
  amount: {
    id: 'MyEscrowTransactions.amount',
    defaultMessage: 'Amount'
  },
  parties: {
    id: 'MyEscrowTransactions.parties',
    defaultMessage: 'Parties'
  }
});

class MyEscrowTransactions extends Component {

  componentDidMount() {

  }

  renderRows() {
    return Object.values(this.props.escrow.transactions).map((escrowObject) => {
      return (
        <Table.Row key={escrowObject.transactionID}>
          <Table.Cell>{escrowObject.transactionID}</Table.Cell>
          <Table.Cell>{escrowObject.amount}</Table.Cell>
          <Table.Cell>{escrowObject.parties}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {

    const { formatMessage } = this.props.intl;

    return <Table striped>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>{formatMessage(messages.transactionID)}</Table.HeaderCell>
        <Table.HeaderCell>{formatMessage(messages.amount)}</Table.HeaderCell>
        <Table.HeaderCell>{formatMessage(messages.parties)}</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {this.renderRows()}
    </Table.Body>

    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan='3'>
          <Menu floated='right' pagination>
            <Menu.Item as='a' icon>
              <Icon name='chevron left' />
            </Menu.Item>
            <Menu.Item as='a'>1</Menu.Item>
            <Menu.Item as='a'>2</Menu.Item>
            <Menu.Item as='a'>3</Menu.Item>
            <Menu.Item as='a'>4</Menu.Item>
            <Menu.Item as='a' icon>
              <Icon name='chevron right' />
            </Menu.Item>
          </Menu>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  </Table>
  }
}

export default connect(
  state => ({ ...state.default })
)(injectIntl(MyEscrowTransactions));
