import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import hash from 'object-hash';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Pagination,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import numberWithCommas from '../../../../../../utils/numeric';

import {
  setActivePageNewArrivals,
  setPaginationNewArrivals,
  getNewArrivalsList,
} from '../../../../../../services/marketplace/newArrivalsActions';

import '../../marketplace.scss';
import '../CategoryListing/listings.scss';

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
});

class NewArrivalsTable extends Component {
  componentDidMount() {
    this.props.marketplaceActions.getNewArrivalsList(this.props.categoryData);
    this.props.marketplaceActions.setPaginationNewArrivals(this.props.rowsPerPage);
  }

  onClickItem() {
    console.log('');
  }

  handlePaginationChange = (e, { activePage }) => {
    this.props.marketplaceActions.setActivePageNewArrivals(activePage);
  };

  render() {
    const { formatMessage } = this.props.intl;
    const {
      activePageNewArrivals,
      totalPagesNewArrivals,
      newArrivalsListFiltered
    } = this.props.newArrivals;
    const rows = _.chunk(newArrivalsListFiltered, 6);

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableBody>
              {rows.map(row =>
                (
                  <TableRow key={hash(row)} className="items">
                    {row.map(item => {
                      const style = { backgroundImage: `url(${item.image})` };
                      let { description } = item;
                      description = description.length > 55 ? `${description.substring(0, 55)}...` : description;
                      return (
                        <TableCell className="item" key={hash(item)}>
                          <div
                            className="img-wrapper"
                            style={style}
                            onClick={this.onClickItem}
                            onKeyDown={this.onClickItem}
                            tabIndex={0}
                            role="link"
                          />
                          <span
                            className="title"
                            onClick={this.onClickItem}
                            role="link"
                            onKeyDown={this.onClickItem}
                            tabIndex={0}
                          >
                            {item.title}
                          </span>
                          <span className="description">{description}</span>
                          <span className="price">$ {numberWithCommas(item.price)}</span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="top-detail bottom">
          <div className="pagination-container">
            <Pagination
              activePage={activePageNewArrivals}
              boundaryRange={1}
              onPageChange={this.handlePaginationChange}
              size="mini"
              siblingRange={1}
              totalPages={totalPagesNewArrivals}
              firstItem={{ ariaLabel: formatMessage(messages.firstItem), content: `<< ${formatMessage(messages.first)}` }}
              lastItem={{ ariaLabel: formatMessage(messages.lastItem), content: `${formatMessage(messages.last)} >>` }}
              prevItem={{ ariaLabel: formatMessage(messages.previousItem), content: `< ${formatMessage(messages.prev)}` }}
              nextItem={{ ariaLabel: formatMessage(messages.nextItem), content: `${formatMessage(messages.next)} >` }}
            />
          </div>
        </div>
      </div>
    );
  }
}

NewArrivalsTable.propTypes = {
  marketplaceActions: PropTypes.shape({
    setActivePageNewArrivals: PropTypes.func,
    getNewArrivalsList: PropTypes.func,
    setPaginationNewArrivals: PropTypes.func,
  }),
  newArrivals: PropTypes.shape({
    activePageNewArrivals: PropTypes.number,
    totalPagesNewArrivals: PropTypes.number,
    newArrivalsListFiltered: PropTypes.array,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  rowsPerPage: PropTypes.number,
};

NewArrivalsTable.defaultProps = {
  marketplaceActions: {},
  marketplace: {},
  intl: {},
  rowsPerPage: 0
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    marketplaceActions: bindActionCreators({
      getNewArrivalsList,
      setActivePageNewArrivals,
      setPaginationNewArrivals,
    }, dispatch),
  }),
)(injectIntl(NewArrivalsTable));
