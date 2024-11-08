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
  Loader
} from 'semantic-ui-react';
import {
  NavLink
} from 'react-router-dom';

import { debounce } from 'lodash';

import Pagination from '../../../../../../../../components/Pagination/Pagination';
import {
  getMyPurchases,
  getMySellings,
  setPagination,
  setActivePage,
  sortData,
  filterData
} from '../../../../../../../../services/marketplace/myPurchases/myPurchasesActions';
import { getCurrencyAbbreviation } from "../../../../../../../../utils/listings";

import messages from './messages';
import './purchases-table.scss';


class PurchasesTable extends Component {
  constructor(props) {
    super(props);

    this.handleFilterChange = debounce(this.handleFilterChange.bind(this), 200);
  }

  componentWillMount() {
    const { type } = this.props;
    this.fetchData(type);
  }

  componentWillReceiveProps(nextProps) {
    const { type } = nextProps;
    if (type !== this.props.type) {
      this.fetchData(type);
    }
    if (this.props.data.loading && !nextProps.data.loading) {
      this.props.myPurchasesActions.setPagination(this.props.rowsPerPage);
    }
  }

  fetchData(type) {
    if (type === 'buy') {
      this.props.myPurchasesActions.getMyPurchases();
    } else {
      this.props.myPurchasesActions.getMySellings();
    }
  }

  handleFilterChange(e, data) {
    this.props.myPurchasesActions.filterData(data.value);
  }

  sortData = (clickedColumn) => () => {
    this.props.myPurchasesActions.sortData(clickedColumn);
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.myPurchasesActions.setActivePage(activePage);
  };



  render() {
    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      dataFiltered,
      loading
    } = this.props.data;
    const { formatMessage } = this.props.intl;

    return (
      <div className="purchases-table">
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
                      key="id"
                      sorted={sortColumn === 'id' ? sortDirection : null}
                      onClick={this.sortData('id')}
                    >
                      {formatMessage(messages.id)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      key="title"
                      sorted={sortColumn === 'title' ? sortDirection : null}
                      onClick={this.sortData('title')}
                    >
                      {formatMessage(messages.title)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      key="id"
                      sorted={sortColumn === 'date' ? sortDirection : null}
                      onClick={this.sortData('date')}
                    >
                      {formatMessage(messages.date)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      key="count"
                      sorted={sortColumn === 'count' ? sortDirection : null}
                      onClick={this.sortData('count')}
                    >
                      {formatMessage(messages.count)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      key="amount"
                      sorted={sortColumn === 'price' ? sortDirection : null}
                      onClick={this.sortData('price')}
                    >
                      {formatMessage(messages.price)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      key="publisher"
                      sorted={sortColumn === 'publisher' ? sortDirection : null}
                      onClick={this.sortData('publisher')}
                    >
                      {formatMessage(messages.publisher)}
                    </TableHeaderCell>
                    {this.props.type === 'buy' ?
                      <TableHeaderCell
                        key="seller"
                        sorted={sortColumn === 'seller' ? sortDirection : null}
                        onClick={this.sortData('seller')}
                      >
                        {formatMessage(messages.seller)}
                      </TableHeaderCell>
                      :
                      <TableHeaderCell
                        key="buyer"
                        sorted={sortColumn === 'buyer' ? sortDirection : null}
                        onClick={this.sortData('buyer')}
                      >
                        {formatMessage(messages.buyer)}
                      </TableHeaderCell>
                    }
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!!dataFiltered && dataFiltered.map(row =>
                    (
                      <TableRow key={hash(row)}>
                        <TableCell>
                          <NavLink to={`/listing/${row.listingId}`}>
                            {row.listingId}
                          </NavLink>
                        </TableCell>
                        <TableCell>
                          {row.title ? row.title : formatMessage(messages.listingNotAvaiable)}
                        </TableCell>
                        <TableCell>{dateformat(row.date, 'yyyy-mm-dd HH:MM:ss')}</TableCell>
                        <TableCell>{row.count}</TableCell>
                        <TableCell>{row.price} {getCurrencyAbbreviation(row.currency)}</TableCell>
                        <TableCell>{row.publisher}</TableCell>
                        {this.props.type === 'buy' ?
                          <TableCell>{row.seller}</TableCell>
                          :
                          <TableCell>{row.buyer}</TableCell>
                        }
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
      </div>
    );
  }
}

PurchasesTable.propTypes = {
  type: PropTypes.oneOf(['buy', 'sell']),
  rowsPerPage: PropTypes.number,
  tableProps: PropTypes.shape({})
};

PurchasesTable.defaultProps = {
  type: 'buy',
  rowsPerPage: 20,
  tableProps: {
    sortable: true,
    compact: true,
    basic: 'very',
    striped: true,
    size: 'small'
  }
};

export default connect(
  state => ({
    ...state.default
  }),
  (dispatch) => ({
    myPurchasesActions: bindActionCreators({
      getMyPurchases,
      getMySellings,
      setPagination,
      setActivePage,
      sortData,
      filterData
    }, dispatch)
  })
)(injectIntl(PurchasesTable));
