import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
  Image,
} from 'semantic-ui-react';

import {
  getRecentTransactions,
} from '../../../../../services/accountSettings/accountActions';

const recentTransactions = [
  {
    id: 1,
    date: '2018-03-12',
    from: '',
    to: '',
    memo: '',
    amount: 1.50,
    fee: 0,
    Balance: 10500.50
  }
];

class RecentTransactions extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.accountSettingsActions.getRecentTransactions(recentTransactions);
    /* this.props.accountSettingsActions.setPaginationTop(this.props.rowsPerPage); */
  }

  handleFilterChange = (e) => {
    const { value } = e.target;
    this.props.accountSettingsActions.filterDataTop(value);
  };

  sortData = (clickedColumn) => () => {
    this.props.accountSettingsActions.sortDataTop(clickedColumn);
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.accountSettingsActions.setActivePageTop(activePage);
  };

  render() {
    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      recentTransactionsFiltered
    } = this.props.account;

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
                firstItem={{ ariaLabel: 'First item', content: '<< First' }}
                lastItem={{ ariaLabel: 'Last item', content: 'Last >>' }}
                prevItem={{ ariaLabel: 'Previous item', content: '< Prev' }}
                nextItem={{ ariaLabel: 'Next item', content: 'Next >' }}
              />
            </div>
          </div>
          <div className="table-container">
            <Table {...this.props.tableProps}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell key="date" sorted={sortColumn === 'date' ? sortDirection : null} onClick={this.sortData('date')}>
                    Date
                  </TableHeaderCell>
                  <TableHeaderCell key="fromto" sorted={sortColumn === 'fromto' ? sortDirection : null} onClick={this.sortData('fromto')}>
                    From To
                  </TableHeaderCell>
                  <TableHeaderCell key="memo" sorted={sortColumn === 'memo' ? sortDirection : null} onClick={this.sortData('memo')}>
                    Memo
                  </TableHeaderCell>
                  <TableHeaderCell key="amount" sorted={sortColumn === 'amount' ? sortDirection : null} onClick={this.sortData('amount')}>
                    Amount
                  </TableHeaderCell>
                  <TableHeaderCell key="fee" sorted={sortColumn === 'fee' ? sortDirection : null} onClick={this.sortData('fee')}>
                    Fee
                  </TableHeaderCell>
                  <TableHeaderCell key="balance" sorted={sortColumn === 'balance' ? sortDirection : null} onClick={this.sortData('balance')}>
                    Balance
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
                      <TableCell>{row.balance} <a>DETAILS</a></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
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
    accountSettingsActions: bindActionCreators({ getRecentTransactions, }, dispatch),
  }),
)(RecentTransactions);

