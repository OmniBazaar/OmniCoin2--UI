import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Pagination,
  Input,
  Icon,
} from 'semantic-ui-react';

import {
  getRecentTransactions,
  setActivePage,
  sortData,
  filterData,
  setPagination,
} from '../../../../../services/accountSettings/accountActions';

const iconSize = 20;
const messages = defineMessages({
  firstItem: {
    id: 'Settings.firstItem',
    defaultMessage: 'First item'
  },
  lastItem: {
    id: 'Settings.lastItem',
    defaultMessage: 'Last item'
  },
  previousItem: {
    id: 'Settings.previousItem',
    defaultMessage: 'Previous item'
  },
  nextItem: {
    id: 'Settings.nextItem',
    defaultMessage: 'Next item'
  },
  first: {
    id: 'Settings.first',
    defaultMessage: 'First'
  },
  last: {
    id: 'Settings.last',
    defaultMessage: 'Last'
  },
  prev: {
    id: 'Settings.prev',
    defaultMessage: 'Prev'
  },
  next: {
    id: 'Settings.next',
    defaultMessage: 'Next'
  },
  date: {
    id: 'Settings.date',
    defaultMessage: 'Date'
  },
  memo: {
    id: 'Settings.memo',
    defaultMessage: 'Memo'
  },
  amount: {
    id: 'Settings.amount',
    defaultMessage: 'Amount'
  },
  fee: {
    id: 'Settings.fee',
    defaultMessage: 'Fee'
  },
  balance: {
    id: 'Settings.balance',
    defaultMessage: 'Balance'
  },
  details: {
    id: 'Settings.details',
    defaultMessage: 'DETAILS'
  },
});

const recentTransactions = [
  {
    id: 1,
    date: '2018-03-12',
    from: 'Unknown',
    to: '',
    memo: 'Welcome bonus',
    amount: 1.50,
    fee: 0,
    Balance: 10500.50
  },
  {
    id: 2,
    date: '2018-01-12',
    from: '',
    to: 'Eugen L',
    memo: '',
    amount: 10.50,
    fee: 5.0,
    Balance: 10500.50
  },
  {
    id: 3,
    date: '2018-09-12',
    from: 'Unknown',
    to: '',
    memo: '',
    amount: 10.50,
    fee: 0,
    Balance: 10500.50
  },
  {
    id: 4,
    date: '2018-09-15',
    from: '',
    to: 'Emma',
    memo: '',
    amount: 10.50,
    fee: 0,
    Balance: 10500.50
  },
  {
    id: 5,
    date: '2018-09-15',
    from: '',
    to: 'Jessica',
    memo: '',
    amount: 10.50,
    fee: 5.0,
    Balance: 10500.50
  },
  {
    id: 6,
    date: '2018-09-15',
    from: '',
    to: 'to',
    memo: '',
    amount: 10.50,
    fee: 0,
    Balance: 10500.50
  },
  {
    id: 7,
    date: '2018-09-15',
    from: 'Stella',
    to: '',
    memo: '',
    amount: 10.50,
    fee: 0,
    Balance: 10500.50
  },
  {
    id: 8,
    date: '2018-09-15',
    from: 'Stella',
    to: 'Unknown',
    memo: '',
    amount: 10.50,
    fee: 0,
    Balance: 10500.50
  },
];

class RecentTransactions extends Component {
  componentDidMount() {
    this.props.accountSettingsActions.getRecentTransactions(recentTransactions);
    this.props.accountSettingsActions.setPagination(this.props.rowsPerPage);
  }

  handleFilterChange = (e) => {
    const { value } = e.target;
    this.props.accountSettingsActions.filterData(value);
  };

  sortData = (clickedColumn) => () => {
    this.props.accountSettingsActions.sortData(clickedColumn);
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.accountSettingsActions.setActivePage(activePage);
  };

  render() {
    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      recentTransactionsFiltered
    } = this.props.account;
    const { formatMessage } = this.props.intl;

    return (
      <div className="private-data">
        <div className="data-table">
          <div className="top-detail">
            <Input
              icon={<Icon name="filter" />}
              iconPosition="left"
              placeholder="Filter"
              className="filter-input"
              onChange={this.handleFilterChange}
            />
            <div className="pagination-container">
              <Pagination
                activePage={activePage}
                boundaryRange={1}
                onPageChange={this.handlePaginationChange}
                size="mini"
                siblingRange={1}
                totalPages={totalPages}
                firstItem={{ ariaLabel: formatMessage(messages.firstItem), content: `<< ${formatMessage(messages.first)}` }}
                lastItem={{ ariaLabel: formatMessage(messages.lastItem), content: `${formatMessage(messages.last)} >>` }}
                prevItem={{ ariaLabel: formatMessage(messages.previousItem), content: `< ${formatMessage(messages.prev)}` }}
                nextItem={{ ariaLabel: formatMessage(messages.nextItem), content: `${formatMessage(messages.next)} >` }}
              />
            </div>
          </div>
          <div className="table-container">
            <Table {...this.props.tableProps}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell key="date" sorted={sortColumn === 'date' ? sortDirection : null} onClick={this.sortData('date')}>
                    {formatMessage(messages.date)} (GMT+2)
                  </TableHeaderCell>
                  <TableHeaderCell key="fromto" sorted={sortColumn === 'fromto' ? sortDirection : null} onClick={this.sortData('fromto')}>
                    <Icon name="long arrow down" width={iconSize} height={iconSize} className="from-icon" />From
                    <Icon name="long arrow up" width={iconSize} height={iconSize} className="to-icon" />To
                  </TableHeaderCell>
                  <TableHeaderCell key="memo" sorted={sortColumn === 'memo' ? sortDirection : null} onClick={this.sortData('memo')}>
                    {formatMessage(messages.memo)}
                  </TableHeaderCell>
                  <TableHeaderCell key="amount" sorted={sortColumn === 'amount' ? sortDirection : null} onClick={this.sortData('amount')}>
                    {formatMessage(messages.amount)}
                  </TableHeaderCell>
                  <TableHeaderCell key="fee" sorted={sortColumn === 'fee' ? sortDirection : null} onClick={this.sortData('fee')}>
                    {formatMessage(messages.fee)}
                  </TableHeaderCell>
                  <TableHeaderCell key="balance" sorted={sortColumn === 'balance' ? sortDirection : null} onClick={this.sortData('balance')}>
                    {formatMessage(messages.balance)}
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactionsFiltered.map(row =>
                  (
                    <TableRow key={hash(row)}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.from} {row.to}</TableCell>
                      <TableCell>{row.memo}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.fee}</TableCell>
                      <TableCell>{row.balance} <a>{formatMessage(messages.details)}</a></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="top-detail bottom">
            <div className="pagination-container">
              <Pagination
                activePage={activePage}
                boundaryRange={1}
                onPageChange={this.handlePaginationChange}
                size="mini"
                siblingRange={1}
                totalPages={totalPages}
                firstItem={{ ariaLabel: formatMessage(messages.firstItem), content: `<< ${formatMessage(messages.first)}` }}
                lastItem={{ ariaLabel: formatMessage(messages.lastItem), content: `${formatMessage(messages.last)} >>` }}
                prevItem={{ ariaLabel: formatMessage(messages.previousItem), content: `< ${formatMessage(messages.prev)}` }}
                nextItem={{ ariaLabel: formatMessage(messages.nextItem), content: `${formatMessage(messages.next)} >` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecentTransactions.propTypes = {
  accountSettingsActions: PropTypes.shape({
    sortData: PropTypes.func,
    filterData: PropTypes.func,
    setActivePage: PropTypes.func,
    setPagination: PropTypes.func,
    getRecentTransactions: PropTypes.func,
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  }),
  account: PropTypes.shape({
    recentTransactionsFiltered: [],
    activePage: 1,
    totalPages: 1,
    sortColumn: 'date',
    sortDirection: 'descending',
  }),
  rowsPerPage: PropTypes.number,
};

RecentTransactions.defaultProps = {
  accountSettingsActions: {},
  account: {},
  tableProps: {},
  rowsPerPage: 5,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      getRecentTransactions,
      setActivePage,
      sortData,
      filterData,
      setPagination,
    }, dispatch),
  }),
)(injectIntl(RecentTransactions));
