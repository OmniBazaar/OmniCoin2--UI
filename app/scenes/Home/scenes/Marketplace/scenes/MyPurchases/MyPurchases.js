import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {defineMessages, injectIntl} from 'react-intl';
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
import {debounce} from 'lodash';

import Menu from '../../scenes/Menu/Menu';
import Pagination from '../../../../../../components/Pagination/Pagination';
import {
  getMyPurchases,
  setPagination,
  setActivePage,
  sortData,
  filterData
} from "../../../../../../services/marketplace/myPurchases/myPurchesesActions";

import './my-purchases.scss';

const iconSize = 15;
const iconToSize = 12;
const iconSizeToHeight = 16;


const messages = defineMessages({
  id: {
    id: 'MyPurchases.id',
    defaultMessage: 'ID'
  },
  count: {
    id: 'MyPurchases.count',
    defaultMessage: 'Count'
  },
  expirationTime: {
    id: 'MyPurchases.expirationTime',
    defaultMessage: 'Exp. time'
  },
  price: {
    id: 'MyPurchases.price',
    defaultMessage: 'Price'
  },
  publisher: {
    id: 'MyPurchases.publisher',
    defaultMessage: 'Publisher'
  },
  seller: {
    id: 'MyPurchases.seller',
    defaultMessage: 'Seller'
  },
  date: {
    id: 'MyPurchases.date',
    defaultMessage: 'Date'
  }
});


class MyPurchases extends Component {
  constructor(props) {
    super(props);

    this.handleFilterChange = debounce(this.handleFilterChange.bind(this), 200);
  }

  componentWillMount() {
    this.props.myPurchasesActions.getMyPurchases();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.myPurchases.loading && !nextProps.myPurchases.loading) {
      this.props.myPurchasesActions.setPagination(this.props.rowsPerPage);
    }
  }

  handleFilterChange(e, data) {
    this.props.myPurchasesActions.filterData(data.value);
  }

  sortData = (clickedColumn) => () => {
    this.props.myPurchasesActions.sortData(clickedColumn);
  };

  handlePaginationChange = (e, {activePage}) => {
    this.props.myPurchasesActions.setActivePage(activePage);
  };


  render() {
    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      myPurchasesFiltered,
      loading
    } = this.props.myPurchases;
    const {formatMessage} = this.props.intl;

    return (
      <div className="marketplace-container category-listing recent-searches">
        <div className="header">
          <Menu/>
        </div>
        <div className="my-purchases">
          <div className="data-table">
            <div className="top-detail">
              <Input
                icon={<Icon name="filter"/>}
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
              {loading ? <Loader active inline="centered"/> :
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
                        key="id"
                        sorted={sortColumn === 'date' ? sortDirection : null}
                        onClick={this.sortData('date')}
                      >
                        {formatMessage(messages.date)}
                      </TableHeaderCell>
                      <TableHeaderCell
                        key="expiration_time"
                        sorted={sortColumn === 'expiration_time' ? sortDirection : null}
                        onClick={this.sortData('expiration_time')}
                      >
                        {formatMessage(messages.expirationTime)}
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
                      <TableHeaderCell
                        key="seller"
                        sorted={sortColumn === 'seller' ? sortDirection : null}
                        onClick={this.sortData('seller')}
                      >
                        {formatMessage(messages.seller)}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!!myPurchasesFiltered && myPurchasesFiltered.map(row =>
                      (
                        <TableRow key={hash(row)}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{dateformat(row.date, '	yyyy-mm-dd HH:MM:ss')}</TableCell>
                          <TableCell>{dateformat(row.expiration_time, '	yyyy-mm-dd HH:MM:ss')}</TableCell>
                          <TableCell>{row.count}</TableCell>
                          <TableCell>{row.price} XOM</TableCell>
                          <TableCell>{row.publisher}</TableCell>
                          <TableCell>{row.seller}</TableCell>
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
      </div>
    );
  }
}

MyPurchases.propTypes = {
  rowsPerPage: PropTypes.number,
  tableProps: PropTypes.shape({})
};

MyPurchases.defaultProps = {
  rowsPerPage: 10,
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
      setPagination,
      setActivePage,
      sortData,
      filterData
    }, dispatch)
  })
)(injectIntl(MyPurchases));
