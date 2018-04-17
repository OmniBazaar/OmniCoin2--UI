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
  setPaginationMyListings,
  setActivePageMyListings,
  sortMyListingsBy
} from '../../../../../../services/listing/listingActions';
import { numberWithCommas } from '../../../../../../utils/numeric';

import '../../../Marketplace/marketplace.scss';
import '../../../Marketplace/scenes/CategoryListing/listings.scss';
import './my-listings-table.scss';

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

class MyListingsTable extends Component {
  componentDidMount() {
    this.props.listingActions.sortMyListingsBy(this.props.sortBy, this.props.sortDirection);
    this.props.listingActions.setPaginationMyListings(this.props.rowsPerPage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sortBy !== nextProps.sortBy ||
        this.props.sortDirection !== nextProps.sortDirection) {
      this.props.listingActions.sortMyListingsBy(nextProps.sortBy, nextProps.sortDirection);
      this.props.listingActions.setPaginationMyListings(this.props.rowsPerPage);
    }
  }

  editListing = () => {
  };

  onClickItem = (item) => {
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.listingActions.setActivePageMyListings(activePage);
  };

  render() {
    const { formatMessage } = this.props.intl;
    const {
      activePageMyListings,
      totalPagesMyListings,
      myListingsFiltered
    } = this.props.listing;
    const rows = _.chunk(myListingsFiltered, 6);

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
              activePage={activePageMyListings}
              onPageChange={this.handlePaginationChange}
              totalPages={totalPagesMyListings}
            />
          </div>
        </div>
      </div>
    );
  }
}

MyListingsTable.propTypes = {
  listingActions: PropTypes.shape({
    setPaginationMyListings: PropTypes.func,
    setActivePageMyListings: PropTypes.func,
    sortMyListingsBy: PropTypes.func,
  }),
  listing: PropTypes.shape({
    activePageMyListings: PropTypes.number,
    totalPagesMyListings: PropTypes.number,
    myListingsFiltered: PropTypes.array,
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
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  rowsPerPage: PropTypes.number,
};

MyListingsTable.defaultProps = {
  listingActions: {},
  listing: {},
  myListings: [],
  tableProps: {},
  intl: {},
  sortBy: '',
  sortDirection: '',
  rowsPerPage: 0,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      setActivePageMyListings,
      setPaginationMyListings,
      sortMyListingsBy
    }, dispatch),
  }),
)(injectIntl(MyListingsTable));
