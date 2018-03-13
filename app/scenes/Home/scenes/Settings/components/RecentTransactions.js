import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import _ from 'lodash';
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
  Image,
} from 'semantic-ui-react';

import {
  getRecentTransactions,
  setActivePage,
  sortData,
  filterData,
  setPagination,
  showDetailsModal,
} from '../../../../../services/accountSettings/accountActions';

import IncomingIcon from '../images/ui-arrow-incoming.svg';
import OutgoingIcon from '../images/ui-arrow-aoutgoing.svg';

const iconSize = 15;
const iconToSize = 12;
const iconSizeToHeight = 16;

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

const recentTransactionsData = [
  {
    id: 'b4f24567',
    date: 'Nov 15, 2017, 9:28 PM',
    from: 'Unknown',
    to: '',
    memo: 'Welcome bonus',
    amount: 1.50,
    fee: 0,
    balance: 10500.50,
    operations: [
      {
        id: 1,
        type: 'deposit',
        amount: 16.00
      },
      {
        id: 2,
        type: 'deposit',
        amount: 16.00
      },
      {
        id: 3,
        type: 'deposit',
        amount: 16.00
      },
      {
        id: 4,
        type: 'deposit',
        amount: 16.00
      },
      {
        id: 5,
        type: 'withdraw',
        amount: 2000.00
      }
    ]
  },
  {
    id: 'f5f24567',
    date: 'Dec 1, 2017, 7:04 PM',
    from: '',
    to: 'Eugen L',
    memo: '',
    amount: 10.50,
    fee: 5.0,
    balance: 10500.50,
    operations: [
      {
        id: 1,
        type: 'deposit',
        amount: 16.00
      },
      {
        id: 2,
        type: 'deposit',
        amount: 16.00
      },
      {
        id: 3,
        type: 'deposit',
        amount: 16.00
      },
      {
        id: 4,
        type: 'withdraw',
        amount: 2000.00
      }
    ]
  },
  {
    id: 'g6g35678',
    date: 'Dec 5, 2017, 5:11 PM',
    from: 'Unknown',
    to: '',
    memo: '',
    amount: 10.50,
    fee: 0,
    balance: 10500.50,
    operations: []
  },
  {
    id: 'a1f01567',
    date: 'Dec 6, 2017, 8:01 AM',
    from: '',
    to: 'Emma',
    memo: '',
    amount: 10.50,
    fee: 0,
    balance: 10500.50,
    operations: []
  },
  {
    id: 'za1f2456',
    date: 'Dec 8, 2017, 8:01 AM',
    from: '',
    to: 'Jessica',
    memo: '',
    amount: 10.50,
    fee: 5.0,
    balance: 10500.50,
    operations: []
  },
  {
    id: 'h7f2453r',
    date: 'Dec 10, 2017, 10:16 AM',
    from: '',
    to: 'to',
    memo: '',
    amount: 10.50,
    fee: 0,
    balance: 10500.50,
    operations: []
  },
  {
    id: 'n3o84256',
    date: 'Dec 10, 2017, 11:33 AM',
    from: 'Stella',
    to: '',
    memo: '',
    amount: 10.50,
    fee: 0,
    balance: 10500.50,
    operations: []
  },
  {
    id: 'y9q98467',
    date: 'Dec 12, 2017, 09:33 AM',
    from: 'Stella',
    to: 'Unknown',
    memo: '',
    amount: 10.50,
    fee: 0,
    balance: 10500.50,
    operations: []
  },
];

class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.onCloseDetails = this.onCloseDetails.bind(this);
  }

  componentDidMount() {
    this.props.accountSettingsActions.getRecentTransactions(recentTransactionsData);
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

  onClickDetails = (detailId) => {
    const { recentTransactions } = this.props.account;
    const filteredData = _.map(recentTransactions, (o) => {
      if (o.id === detailId) return o;
    });
    const result = _.without(filteredData, undefined)[0];
    this.props.accountSettingsActions.showDetailsModal(result);
  };

  onCloseDetails() {
    this.props.accountSettingsActions.showDetailsModal();
  }

  render() {
    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      recentTransactionsFiltered
    } = this.props.account;
    const { formatMessage } = this.props.intl;
    const { props } = this;

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
                  <TableHeaderCell key="fromto" className="from-to" sorted={sortColumn === 'fromto' ? sortDirection : null} onClick={this.sortData('fromto')}>
                    <Image src={IncomingIcon} width={iconSize} height={iconSize} className="from-icon" />From
                    <Image src={OutgoingIcon} width={iconToSize} height={iconSizeToHeight} className="to-icon" />To
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
                      <TableCell className="balance">
                        {row.balance}
                        <span className="link" onClick={() => this.onClickDetails(row.id)}>
                          {formatMessage(messages.details)}
                        </span>
                      </TableCell>
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
    showDetailsModal: PropTypes.func,
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  }),
  account: PropTypes.shape({
    recentTransactions: [],
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
      showDetailsModal,
    }, dispatch),
  }),
)(injectIntl(RecentTransactions));
