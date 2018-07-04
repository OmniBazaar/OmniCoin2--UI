import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import dateformat from 'dateformat';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Input,
  Icon,
  Image,
  Loader
} from 'semantic-ui-react';
import { debounce } from 'lodash';
import { ChainTypes } from 'omnibazaarjs/es';
import cn from 'classnames';

import Pagination from '../../../../../../components/Pagination/Pagination';
import TransactionDetails from './components/TransactionDetails/TransactionDetails';

import {
  getRecentTransactions,
  setActivePage,
  sortData,
  filterData,
  setPagination,
  showDetailsModal,
} from '../../../../../../services/accountSettings/accountActions';

import IncomingIcon from './images/ui-arrow-incoming.svg';
import OutgoingIcon from './images/ui-arrow-aoutgoing.svg';
import './recent.scss';

const iconSize = 15;
const iconToSize = 12;
const iconSizeToHeight = 16;

const messages = defineMessages({
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
  status: {
    id: 'Settings.type',
    defaultMessage: 'Status'
  },
  [ChainTypes.operations.transfer]: {
    id: 'Settings.transfer',
    defaultMessage: 'TRANSFER'
  },
  [ChainTypes.operations.escrow_create_operation]: {
    id: 'Settings.pending',
    defaultMessage: 'PENDING'
  },
  [ChainTypes.operations.escrow_return_operation]: {
    id: 'Settings.return',
    defaultMessage: 'RETURNED'
  },
  [ChainTypes.operations.escrow_release_operation]: {
    id: 'Settings.release',
    defaultMessage: 'RELEASED'
  },
  [ChainTypes.operations.listing_create_operation]: {
    id: 'Settings.createListing',
    defaultMessage: 'LISTING'
  },
  [ChainTypes.operations.listing_update_operation]: {
    id: 'Settings.updateListing',
    defaultMessage: 'LISTING'
  },
  [ChainTypes.operations.listing_delete_operation]: {
    id: 'Settings.deleteListing',
    defaultMessage: 'LISTING'
  },
  [ChainTypes.operations.account_update]: {
    id: 'Settings.updateAccount',
    defaultMessage: 'ACCOUNT'
  },
  [ChainTypes.operations.referral_bonus_operation]: {
    id: 'Settings.referralBonus',
    defaultMessage: 'REFERRAL BONUS'
  },
  [ChainTypes.operations.welcome_bonus_operation]: {
    id: 'Settings.welcomeBonus',
    defaultMessage: 'WELCOME BONUS'
  },
  [ChainTypes.operations.sale_bonus_operation]: {
    id: 'Settings.saleBonus',
    defaultMessage: 'SALE BONUS'
  }
});


class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.onCloseDetails = this.onCloseDetails.bind(this);
    this.handleFilterChange = debounce(this.handleFilterChange.bind(this), 200);
  }

  componentWillMount() {
    this.props.accountSettingsActions.getRecentTransactions();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.account.loading && !nextProps.account.loading) {
      this.props.accountSettingsActions.sortData('date', 'descending');
      this.props.accountSettingsActions.setPagination(this.props.rowsPerPage);
    }
  }

  handleFilterChange(e, data) {
    this.props.accountSettingsActions.filterData(data.value);
  }

  sortData = (clickedColumn) => () => {
    this.props.accountSettingsActions.sortData(clickedColumn);
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.accountSettingsActions.setActivePage(activePage);
  };

  onClickDetails = (detailId) => {
    const { recentTransactions } = this.props.account;
    const transaction = recentTransactions.find(el => el.id === detailId);
    this.props.accountSettingsActions.showDetailsModal(transaction);
  };

  onCloseDetails() {
    this.props.accountSettingsActions.showDetailsModal();
  }

  getBadgeClass(type) {
    switch (type) {
      case ChainTypes.operations.escrow_create_operation:
        return 'pending';
      case ChainTypes.operations.transfer:
        return 'transfer';
      case ChainTypes.operations.escrow_release_operation:
        return 'released';
      case ChainTypes.operations.escrow_return_operation:
        return 'returned';
      case ChainTypes.operations.listing_delete_operation:
        return 'listing';
      case ChainTypes.operations.listing_update_operation:
        return 'listing';
      case ChainTypes.operations.listing_create_operation:
        return 'listing';
      case ChainTypes.operations.account_update:
        return 'account';
      case ChainTypes.operations.witness_create:
        return 'account';
      case ChainTypes.operations.welcome_bonus_operation:
        return 'bonus';
      case ChainTypes.operations.referral_bonus_operation:
        return 'bonus';
      case ChainTypes.operations.sale_bonus_operation:
        return 'bonus';
    }
  }

  render() {
    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      recentTransactionsVisible,
      loading,
      showDetails
    } = this.props.account;
    const { formatMessage } = this.props.intl;

    return (
      <div className="recent-transactions">
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
                onPageChange={this.handlePaginationChange}
                totalPages={totalPages}
              />
            </div>
          </div>
          <div className="table-container">
            {loading ? <Loader active inline="centered" /> :
            <Table {...this.props.tableProps}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell
                    key="date"
                    sorted={sortColumn === 'date' ? sortDirection : null}
                    onClick={this.sortData('date')}
                  >
                    {formatMessage(messages.date)} (GMT+2)
                  </TableHeaderCell>
                  <TableHeaderCell
                    key="fromto"
                    className="from-to"
                    sorted={sortColumn === 'fromTo' ? sortDirection : null}
                    onClick={this.sortData('fromTo')}
                  >
                    <Image src={IncomingIcon} width={iconSize} height={iconSize} className="from-icon" />From
                    <Image src={OutgoingIcon} width={iconToSize} height={iconSizeToHeight} className="to-icon" />To
                  </TableHeaderCell>
                  <TableHeaderCell
                    key="memo"
                    sorted={sortColumn === 'memo' ? sortDirection : null}
                    onClick={this.sortData('memo')}
                  >
                    {formatMessage(messages.memo)}
                  </TableHeaderCell>
                  <TableHeaderCell
                    key="amount"
                    sorted={sortColumn === 'amount' ? sortDirection : null}
                    onClick={this.sortData('amount')}
                  >
                    {formatMessage(messages.amount)}
                  </TableHeaderCell>
                  <TableHeaderCell
                    key="fee"
                    sorted={sortColumn === 'fee' ? sortDirection : null}
                    onClick={this.sortData('fee')}
                  >
                    {formatMessage(messages.fee)}
                  </TableHeaderCell>
                  <TableHeaderCell
                    key="fee"
                    sorted={sortColumn === 'type' ? sortDirection : null}
                    onClick={this.sortData('type')}
                  >
                    {formatMessage(messages.status)}
                  </TableHeaderCell>
                  {/* <TableHeaderCell */}
                  {/* key="balance" */}
                  {/* sorted={sortColumn === 'balance' ? sortDirection : null} */}
                  {/* onClick={this.sortData('balance')} */}
                  {/* > */}
                  {/* {formatMessage(messages.balance)} */}
                  {/* </TableHeaderCell> */}
                  <TableHeaderCell />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactionsVisible && recentTransactionsVisible.map(row =>
                      (
                        <TableRow key={hash(row)}>
                          <TableCell>{dateformat(row.date, 'yyyy-mm-dd HH:MM:ss')}</TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <Image
                                src={row.isIncoming ? IncomingIcon : OutgoingIcon}
                                width={iconSize}
                                height={iconSize}
                                className="from-icon"
                              />
                              <span> {row.fromTo} </span>
                            </div>
                          </TableCell>
                          <TableCell>{row.memo}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.isIncoming ? 0 : row.fee}</TableCell>
                          <TableCell>
                            <div className={cn('badge-tag', this.getBadgeClass(row.type))}>
                              {formatMessage(messages[row.type])}
                            </div>
                          </TableCell>
                          {/* <TableCell className="balance"> */}
                          {/* {row.balance} */}
                          {/* </TableCell> */}
                          <TableCell>
                            <span
                              className="link"
                              onClick={() => this.onClickDetails(row.id)}
                              onKeyDown={() => this.onClickDetails(row.id)}
                              role="link"
                              tabIndex={0}
                            >
                              {formatMessage(messages.details)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    }
              </TableBody>
            </Table>
              }
          </div>

          <div className="top-detail bottom">
            <div className="pagination-container">
              <Pagination
                activePage={activePage}
                onPageChange={this.handlePaginationChange}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
        {showDetails &&
          <TransactionDetails
            showCompose={showDetails}
            onClose={this.onCloseDetails}
          />
        }
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
    loading: PropTypes.bool
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  rowsPerPage: PropTypes.number,
};

RecentTransactions.defaultProps = {
  accountSettingsActions: {},
  account: {},
  tableProps: {},
  rowsPerPage: 20,
  intl: {},
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
