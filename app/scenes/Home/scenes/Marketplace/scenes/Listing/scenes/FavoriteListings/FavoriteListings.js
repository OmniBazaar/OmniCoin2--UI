import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon } from 'semantic-ui-react';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import { reduxForm } from 'redux-form';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import TabsData from '../../../../components/TabsData/TabsData';
import SearchFilters from '../../../../../Marketplace/scenes/SearchFilters/SearchFilters';
import { getFavorites, filterFavorites } from '../../../../../../../../services/listing/listingActions';
import { makeValidatableField } from '../../../../../../../../components/ValidatableField/ValidatableField';
import CurrencyDropdown from '../AddListing/components/CurrencyDropdown/CurrencyDropdown';

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
  currency: {
    id: 'FavoriteListings.currency',
    defaultMessage: 'Currency'
  },
});

class FavoriteListings extends Component {
  constructor(props) {
    super(props);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
  }

  componentDidMount() {
    this.props.listingActions.getFavorites();
    this.props.listingActions.filterFavorites('all', 'all');
  }

  handleSubmit(values, searchTerm) {
    const currency = values.currency;
    const searchText = searchTerm || '';
    const category = (values && values.category) ? values.category : null;
    const subcategory = (values && values.subcategory) ? values.subcategory : null;
    this.props.listingActions.filterFavorites(currency, category, subcategory, searchText);
  }
  
  onChangeCurrency(values, currency) {
    const searchText = values.searchTerm || '';
    const category = (values && values.category) ? values.category : null;
    const subcategory = (values && values.subcategory) ? values.subcategory : null;
    this.props.listingActions.filterFavorites(currency, category, subcategory, searchText);
  }

  renderFavoriteListings() {
    const { formatMessage } = this.props.intl;

    const {
      favoriteListings,
      favoriteFiltered,
      favoriteCurrency,
      favoriteCategory,
      favoriteSubCategory,
      favoriteSearchTerm
    } = this.props.listing;

    let data = favoriteListings;
    if ((favoriteCurrency && favoriteCurrency.toLowerCase() !== 'all') ||
        (favoriteCategory && favoriteCategory !== 'all') ||
        (favoriteSubCategory && favoriteSubCategory !== 'all') ||
        (favoriteSearchTerm && favoriteSearchTerm !== '')) {
      data = favoriteFiltered;
    }

    return (
      <div className="list-container my-listings">
        <SearchFilters onSubmit={this.handleSubmit} onChangeCurrency={this.onChangeCurrency} />
        <TabsData
          data={data}
          showActions={false}
          currency={favoriteCurrency}
          tabs={[
            {
              title: formatMessage(messages.byDate),
              sortBy: 'start_date',
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
      <div className="marketplace-container category-listing container">
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
    filterFavorites: PropTypes.func,
  }),
  listing: PropTypes.shape({
    favoriteListings: PropTypes.array,
    favoriteFiltered: PropTypes.array,
    favoriteCurrency: PropTypes.string,
    favoriteCategory: PropTypes.string,
    favoriteSubCategory: PropTypes.string,
    favoriteSearchTerm: PropTypes.string,
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

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      listingActions: bindActionCreators({
        getFavorites,
        filterFavorites
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'favoriteForm',
    destroyOnUnmount: true,
  })
)(injectIntl(FavoriteListings));
