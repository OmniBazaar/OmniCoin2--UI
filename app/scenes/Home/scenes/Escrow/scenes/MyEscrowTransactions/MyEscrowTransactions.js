import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { 
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader, } from 'semantic-ui-react'

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

  constructor(props){
    super(props);

    this.state = {
      transactions: props.escrow.transactions,
      sortAsc: {
          transactionID: false,
          amount: false,
          parties: false
      },
      lastHeaderClicked: 'transactionID'
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps){
   
    let headerName  = this.state.lastHeaderClicked;
    let asc = this.state.sortAsc[headerName];

    this.setState({
      transactions: nextProps.escrow.transactions.slice().sort((transA, transB) => {
          return (transA[headerName].localeCompare(transB[headerName])) * (asc ? 1 : -1);
      })
    });
  }

  sortColumn(headerName, asc){
    this.setState({
      ...this.state,
      sortAsc: {
        ...this.state.sortAsc,
        [headerName]: asc
      },
      transactions: this.state.transactions.slice().sort((transA, transB) => {
          return (transA[headerName].localeCompare(transB[headerName])) * (asc ? 1 : -1);
      })
    });
  }

  handleHeaderClick(headerName) {
    let newHeaderSortAsc = !this.state.sortAsc[headerName];
    this.setState({
      ...this.state,
      sortAsc: {
        ...this.state.sortAsc,
        [headerName]: newHeaderSortAsc
      },
      transactions: this.state.transactions.slice().sort((transA, transB) => {
          return (transA[headerName].localeCompare(transB[headerName])) * (newHeaderSortAsc ? 1 : -1);
      }),
      lastHeaderClicked: headerName
    });
  }

  renderRows() {
    return this.state.transactions.map((escrowObject) => {
      return (
        <TableRow key={escrowObject.transactionID}>
          <TableCell>{escrowObject.transactionID}</TableCell>
          <TableCell>{escrowObject.amount}</TableCell>
          <TableCell>{escrowObject.parties}</TableCell>
        </TableRow>
      );
    });
  }

  render() {

    const { formatMessage } = this.props.intl;

    return (<div className="table-container">
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
            onClick={this.handleHeaderClick.bind(this, 'transactionID')}>
            {formatMessage(messages.transactionID)}
        </TableHeaderCell>
        
        <TableHeaderCell sorted={this.state.sortAsc.amount ? 'ascending' : 'descending'}
            sorted={this.state.sortAsc.amount ? 'ascending' : 'descending'}
            onClick={this.handleHeaderClick.bind(this, 'amount')}>
            {formatMessage(messages.amount)}
        </TableHeaderCell>

        <TableHeaderCell sorted={this.state.sortAsc.parties ? 'ascending' : 'descending'}
             sorted={this.state.sortAsc.parties ? 'ascending' : 'descending'}
             onClick={this.handleHeaderClick.bind(this, 'parties')}>
             {formatMessage(messages.parties)}
        </TableHeaderCell>

      </TableRow>
    </TableHeader>

    <TableBody>
      {this.renderRows()}
    </TableBody>

    
  </Table>
  </div>);
  }
}

export default connect(
  state => ({ ...state.default })
)(injectIntl(MyEscrowTransactions));
