import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Icon,
  Button
} from 'semantic-ui-react';
import hash from 'object-hash';

import 'react-image-gallery/styles/scss/image-gallery.scss';
import Pagination from '../../../../../../components/Pagination/Pagination';

import {
  getMyListingsByDate,
  setPaginationMyListingsByDate,
  setActivePageMyListingsByDate
} from '../../../../../../services/listing/listingActions';
import { numberWithCommas } from '../../../../../../utils/numeric';

import '../../../Marketplace/marketplace.scss';
import '../../../Marketplace/scenes/CategoryListing/listings.scss';

const messages = defineMessages({
  firstItem: {
    id: 'Listing.firstItem',
    defaultMessage: 'First item'
  },
  lastItem: {
    id: 'Listing.lastItem',
    defaultMessage: 'Last item'
  },
  previousItem: {
    id: 'Listing.previousItem',
    defaultMessage: 'Previous item'
  },
  nextItem: {
    id: 'Listing.nextItem',
    defaultMessage: 'Next item'
  },
  first: {
    id: 'Listing.first',
    defaultMessage: 'First'
  },
  last: {
    id: 'Listing.last',
    defaultMessage: 'Last'
  },
  prev: {
    id: 'Listing.prev',
    defaultMessage: 'Prev'
  },
  next: {
    id: 'Listing.next',
    defaultMessage: 'Next'
  },
  edit: {
    id: 'Listing.edit',
    defaultMessage: 'EDIT'
  },
  delete: {
    id: 'Listing.delete',
    defaultMessage: 'DELETE'
  },
});

const iconSizeSmall = 12;

class MyListingsDateTable extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.myListings !== nextProps.myListings) {
      this.props.listingActions.getMyListingsByDate(nextProps.myListings);
      this.props.listingActions.setPaginationMyListingsByDate(3 * 6);
    }
  }

  editListing = () => {
  };

  onClickItem = (item) => {
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.listingActions.setActivePageMyListingsByDate(activePage);
  };

  render() {
    const { formatMessage } = this.props.intl;
    const {
      activePageMyListingsByDate,
      totalPagesMyListingsByDate,
      myListingsByDateFiltered
    } = this.props.listing;
    const rows = _.chunk(myListingsByDateFiltered, 6);

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
                            onClick={() => this.onClickItem(item)}
                            onKeyDown={this.onClickItem}
                            tabIndex={0}
                            role="link"
                          />
                          <span
                            className="title"
                            onClick={() => this.onClickItem(item)}
                            role="link"
                            onKeyDown={() => this.onClickItem(item)}
                            tabIndex={0}
                          >
                            {item.title}
                          </span>
                          <span className="subtitle">
                            {item.category}
                            <span>
                              <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                            </span>
                            {item.subCategory}
                          </span>
                          <span className="description">{description}</span>
                          <span className="price">$ {numberWithCommas(item.price)}</span>
                          <div className="actions">
                            <Button content={formatMessage(messages.edit)} className="button--blue" />
                            <Button content={formatMessage(messages.delete)} className="button--gray-text" />
                          </div>
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
              activePage={activePageMyListingsByDate}
              onPageChange={this.handlePaginationChange}
              totalPages={totalPagesMyListingsByDate}
            />
          </div>
        </div>
      </div>
    );
  }
}

MyListingsDateTable.propTypes = {
  listingActions: PropTypes.shape({
    getMyListingsByDate: PropTypes.func,
    setPaginationMyListingsByDate: PropTypes.func,
    setActivePageMyListingsByDate: PropTypes.func,
  }),
  listing: PropTypes.shape({
    activePageMyListingsByDate: PropTypes.number,
    totalPagesMyListingsByDate: PropTypes.number,
    myListingsByDateFiltered: PropTypes.array,
  }),
  myListings: PropTypes.arrayOf(PropTypes.object),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    size: PropTypes.string
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

MyListingsDateTable.defaultProps = {
  listingActions: {},
  listing: {},
  myListings: [],
  tableProps: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      getMyListingsByDate,
      setPaginationMyListingsByDate,
      setActivePageMyListingsByDate
    }, dispatch),
  }),
)(injectIntl(MyListingsDateTable));
