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
import { CoinTypes } from '../../../Wallet/constants';

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
    id: 'RecentTransactions.date',
    defaultMessage: 'Date'
  },
  memo: {
    id: 'RecentTransactions.memo',
    defaultMessage: 'Memo'
  },
  amount: {
    id: 'RecentTransactions.amount',
    defaultMessage: 'Amount'
  },
  fee: {
    id: 'RecentTransactions.fee',
    defaultMessage: 'Fee'
  },
  balance: {
    id: 'RecentTransactions.balance',
    defaultMessage: 'Balance'
  },
  details: {
    id: 'RecentTransactions.details',
    defaultMessage: 'DETAILS'
  },
  status: {
    id: 'RecentTransactions.type',
    defaultMessage: 'Status'
  },
  [ChainTypes.operations.transfer]: {
    id: 'RecentTransactions.transfer',
    defaultMessage: 'TRANSFER'
  },
  [ChainTypes.operations.escrow_create_operation]: {
    id: 'RecentTransactions.pending',
    defaultMessage: 'PENDING'
  },
  [ChainTypes.operations.escrow_return_operation]: {
    id: 'RecentTransactions.return',
    defaultMessage: 'RETURNED'
  },
  [ChainTypes.operations.escrow_release_operation]: {
    id: 'RecentTransactions.release',
    defaultMessage: 'RELEASED'
  },
  [ChainTypes.operations.listing_create_operation]: {
    id: 'RecentTransactions.createListing',
    defaultMessage: 'LISTING'
  },
  [ChainTypes.operations.listing_update_operation]: {
    id: 'RecentTransactions.updateListing',
    defaultMessage: 'LISTING'
  },
  [ChainTypes.operations.listing_delete_operation]: {
    id: 'RecentTransactions.deleteListing',
    defaultMessage: 'LISTING'
  },
  [ChainTypes.operations.account_update]: {
    id: 'RecentTransactions.updateAccount',
    defaultMessage: 'ACCOUNT'
  },
  [ChainTypes.operations.referral_bonus_operation]: {
    id: 'RecentTransactions.referralBonus',
    defaultMessage: 'REFERRAL BONUS'
  },
  [ChainTypes.operations.welcome_bonus_operation]: {
    id: 'RecentTransactions.welcomeBonus',
    defaultMessage: 'WELCOME BONUS'
  },
  [ChainTypes.operations.sale_bonus_operation]: {
    id: 'RecentTransactions.saleBonus',
    defaultMessage: 'SALE BONUS'
  },
  [ChainTypes.operations.witness_bonus_operation]: {
    id: 'RecentTransactions.witnessBonus',
    defaultMessage: 'PROCESSOR BONUS'
  },
  [ChainTypes.operations.founder_bonus_operation]: {
    id: 'RecentTransactions.developerBonus',
    defaultMessage: 'DEVELOPER BONUS'
  },
  [ChainTypes.operations.vesting_balance_withdraw]: {
    id: 'RecentTransaction.vestingWithdraw',
    defaultMessage: 'VESTING WITHDRAW'
  }
});


class RecentTransactions extends Component {
  constructor(props) {
    super(props);

    this.onCloseDetails = this.onCloseDetails.bind(this);
    this.handleFilterChange = debounce(this.handleFilterChange.bind(this), 200);
  }

  componentWillMount() {
    this.fetchTransactions(this.props.coinType);
  }

  componentWillUnmount() {
    if (this.props.account.showDetails) {
      this.props.accountSettingsActions.showDetailsModal();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.account.loadingRecentTransactions && !nextProps.account.loadingRecentTransactions) {
      this.props.accountSettingsActions.sortData('date', 'descending');
      this.props.accountSettingsActions.setPagination(this.props.rowsPerPage);
    }
    if (this.props.coinType !== nextProps.coinType) {
      this.fetchTransactions(nextProps.coinType);
    }
  }

  fetchTransactions(coinType) {
    this.props.accountSettingsActions.getRecentTransactions(coinType);
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

  render() {
    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      recentTransactionsVisible,
      loadingRecentTransactions,
      showDetails,
      detailSelected
    } = this.props.account;
    const { coinType } = this.props;
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
            {loadingRecentTransactions || coinType !== this.props.account.coinType ? <Loader active inline="centered" /> :
            <Table {...this.props.tableProps}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell
                    key="date"
                    sorted={sortColumn === 'date' ? sortDirection : null}
                    onClick={this.sortData('date')}
                  >
                    {formatMessage(messages.date)}
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
                  {coinType === CoinTypes.OMNI_COIN &&
                    <TableHeaderCell
                      key="memo"
                      sorted={sortColumn === 'memo' ? sortDirection : null}
                      onClick={this.sortData('memo')}
                    >
                      {formatMessage(messages.memo)}
                    </TableHeaderCell>
                  }
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
                  {coinType === CoinTypes.OMNI_COIN &&
                    <TableHeaderCell
                      key="type"
                      sorted={sortColumn === 'type' ? sortDirection : null}
                      onClick={this.sortData('statusText')}
                    >
                      {formatMessage(messages.status)}
                    </TableHeaderCell>
                  }
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
                          {coinType === CoinTypes.OMNI_COIN &&
                            <TableCell>{row.memo}</TableCell>
                          }
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.fee}</TableCell>
                          {coinType === CoinTypes.OMNI_COIN &&
                            <TableCell>
                              <div className={cn('badge-tag', row.statusText)}>
                                {formatMessage(messages[row.type])}
                              </div>
                            </TableCell>
                          }
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
        {showDetails && detailSelected &&
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
  coinType: CoinTypes.OMNI_COIN,
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
    loadingRecentTransactions: PropTypes.bool
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  rowsPerPage: PropTypes.number,
};

RecentTransactions.defaultProps = {
  coinType: CoinTypes.OMNI_COIN,
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
