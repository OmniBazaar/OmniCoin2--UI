import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon } from 'semantic-ui-react';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import TabsData from '../../../../components/TabsData/TabsData';
import { getFavorites } from '../../../../../../../../services/listing/listingActions';

import './favorite-listings.scss';
import '../../../../../Marketplace/marketplace.scss';
import '../../../../../Marketplace/scenes/CategoryListing/listings.scss';

const iconSize = 42;

const messages = defineMessages({
  byDate: {
    id: 'FavoriteListings.byDate',
    defaultMessage: 'By Date'
  },
  lowestPrice: {
    id: 'FavoriteListings.lowestPrice',
    defaultMessage: 'Lowest Price'
  },
  highestPrice: {
    id: 'FavoriteListings.highestPrice',
    defaultMessage: 'Highest Price'
  },
  marketplace: {
    id: 'FavoriteListings.marketplace',
    defaultMessage: 'Marketplace'
  },
  favoriteListings: {
    id: 'FavoriteListings.favoriteListings',
    defaultMessage: 'Favorite Listings'
  },
});

class FavoriteListings extends Component {
  componentDidMount() {
    this.props.listingActions.getFavorites();
  }

  renderFavoriteListings() {
    const { formatMessage } = this.props.intl;
    const { favoriteListings } = this.props.listing;

    return (
      <div className="list-container my-listings">
        <TabsData
          data={favoriteListings}
          showActions={false}
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
                <span className="child">{formatMessage(messages.favoriteListings)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            {this.renderFavoriteListings()}
          </div>
        </div>
      </div>
    );
  }
}

FavoriteListings.propTypes = {
  listingActions: PropTypes.shape({
    getFavorites: PropTypes.func,
  }),
  listing: PropTypes.shape({
    favoriteListings: PropTypes.array,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

FavoriteListings.defaultProps = {
  listingActions: {},
  listing: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      getFavorites
    }, dispatch),
  }),
)(injectIntl(FavoriteListings));
