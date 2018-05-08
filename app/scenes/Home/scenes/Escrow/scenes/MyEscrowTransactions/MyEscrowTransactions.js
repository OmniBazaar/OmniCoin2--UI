import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
} from 'semantic-ui-react';

import './my-escrow-transactions.scss';


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

const comparator = (transA, transB, headerName, asc) => {
  let compA = transA[headerName].toString();
  let compB = transB[headerName].toString();
  if (headerName === 'amount') {
    compA = transA[headerName].amount.toString();
    compB = transB[headerName].amount.toString();
  }
  return compA.localeCompare(compB) * (asc ? 1 : -1);
};

class MyEscrowTransactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: props.escrow.transactions,
      sortAsc: {
        transactionID: false,
        amount: false,
        parties: false
      },
      lastHeaderClicked: 'transactionID'
    };
  }


  componentWillReceiveProps(nextProps) {
    const headerName = this.state.lastHeaderClicked;
    const asc = this.state.sortAsc[headerName];

    this.setState({
      transactions: nextProps.escrow.transactions.slice().sort(
        (transA, transB) => comparator(transA, transB, headerName, asc)
      ),
      lastHeaderClicked: headerName
    });
  }

  sortColumn(headerName, asc) {
    this.setState({
      ...this.state,
      sortAsc: {
        ...this.state.sortAsc,
        [headerName]: asc
      },
      transactions: this.state.transactions.slice().sort(
        (transA, transB) => comparator(transA, transB, headerName, asc)
      ),
      lastHeaderClicked: headerName
    })
  }

  handleHeaderClick(headerName) {
    const newHeaderSortAsc = !this.state.sortAsc[headerName];
    this.setState({
      ...this.state,
      sortAsc: {
        ...this.state.sortAsc,
        [headerName]: newHeaderSortAsc
      },
      transactions: this.state.transactions.slice().sort(
        (transA, transB) => comparator(transA, transB, headerName, newHeaderSortAsc)
      ),
      lastHeaderClicked: headerName
    });
  }

  renderRows() {
    return this.state.transactions.map((escrowObject) => (
      <TableRow key={escrowObject.transactionID}>
        <TableCell>{escrowObject.transactionID}</TableCell>
        <TableCell>{escrowObject.amount.amount / 100000} XOM</TableCell>
        <TableCell>{escrowObject.parties}</TableCell>
      </TableRow>
    ));
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="data-table">
        <div className="table-container">
          <Table
            sortable="true"
            compact="true"
            basic="very"
            striped="true"
            size="small"
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell
                  sorted={this.state.sortAsc.transactionID ? 'ascending' : 'descending'}
                  onClick={this.handleHeaderClick.bind(this, 'transactionID')}
                >
                  {formatMessage(messages.transactionID)}
                </TableHeaderCell>
                <TableHeaderCell
                  sorted={this.state.sortAsc.amount ? 'ascending' : 'descending'}
                  onClick={this.handleHeaderClick.bind(this, 'amount')}
                >
                  {formatMessage(messages.amount)}
                </TableHeaderCell>
                <TableHeaderCell
                  sorted={this.state.sortAsc.parties ? 'ascending' : 'descending'}
                  onClick={this.handleHeaderClick.bind(this, 'parties')}
                >
                  {formatMessage(messages.parties)}
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {this.renderRows()}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

MyEscrowTransactions.propTypes = {
  escrow: PropTypes.shape({
    transactions: PropTypes.array
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};

export default connect(state => ({ ...state.default }))(injectIntl(MyEscrowTransactions));
