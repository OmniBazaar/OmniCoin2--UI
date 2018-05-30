import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Dropdown, Icon, Dimmer, Loader } from 'semantic-ui-react';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import CurrencyDropdown from '../../../../../../components/CurrencyDropdown/CurrencyDropdown';
import TabsData from '../../../../components/TabsData/TabsData';
import {
  requestMyListings,
  resetDeleteListing
} from '../../../../../../../../services/listing/listingActions';

import './my-listings.scss';
import '../../../../../Marketplace/marketplace.scss';
import '../../../../../Marketplace/scenes/CategoryListing/listings.scss';

const iconSize = 42;

const messages = defineMessages({
  byDate: {
    id: 'MyListings.byDate',
    defaultMessage: 'By Date'
  },
  lowestPrice: {
    id: 'MyListings.lowestPrice',
    defaultMessage: 'Lowest Price'
  },
  highestPrice: {
    id: 'MyListings.highestPrice',
    defaultMessage: 'Highest Price'
  },
  allCategories: {
    id: 'MyListings.allCategories',
    defaultMessage: 'All Categories'
  },
  marketplace: {
    id: 'MyListings.marketplace',
    defaultMessage: 'Marketplace'
  },
  myListings: {
    id: 'MyListings.myListings',
    defaultMessage: 'My Listings'
  },
});

const options = [
  { key: 1, text: 'Category 1', value: 'category1' },
  { key: 2, text: 'Category 2', value: 'category2' },
];

class MyListings extends Component {
  componentDidMount() {
    this.props.listingActions.resetDeleteListing();
    this.props.listingActions.requestMyListings();
  }

  renderMyListings() {
    const { formatMessage } = this.props.intl;
    const { myListings } = this.props.listing;

    return (
      <div className="list-container my-listings">
        <div className="filters">
          <Dropdown
            button
            className="categories icon"
            floating
            options={options}
            placeholder={formatMessage(messages.allCategories)}
          />
          <CurrencyDropdown />
        </div>
        <TabsData
          data={ myListings }
          showActions
          tabs={[
            {
              title: formatMessage(messages.byDate),
              sortBy: 'date',
              sortDirection: 'descending'
            },
            {
              title: formatMessage(messages.lowestPrice),
              sortBy: 'price',
              sortDirection: 'ascending'
            },
            {
              title: formatMessage(messages.highestPrice),
              sortBy: 'price',
              sortDirection: 'descending'
            }
          ]}
        />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container category-listing listing container">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                <div className="parent">
                  <span>{formatMessage(messages.marketplace)}</span>
                  <Icon name="long arrow right" width={iconSize} height={iconSize} />
                </div>
                <span className="child">{formatMessage(messages.myListings)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            {this.renderMyListings()}
          </div>
        </div>
      </div>
    );
  }
}

MyListings.propTypes = {
  listingActions: PropTypes.shape({
    requestMyListings: PropTypes.func,
    resetDeleteListing: PropTypes.func
  }),
  listing: PropTypes.shape({
    myListings: PropTypes.object,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

MyListings.defaultProps = {
  listingActions: {},
  listing: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      requestMyListings,
      resetDeleteListing
    }, dispatch),
  }),
)(injectIntl(MyListings));
