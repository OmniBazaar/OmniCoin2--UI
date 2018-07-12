import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button } from 'semantic-ui-react';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import SearchFilters from '../../../../../Marketplace/scenes/SearchFilters/SearchFilters';
import CurrencyDropdown from '../AddListing/components/CurrencyDropdown/CurrencyDropdown';
import TabsData from '../../../../components/TabsData/TabsData';
import CategoryDropdown from '../../../../scenes/Listing/scenes/AddListing/components/CategoryDropdown/CategoryDropdown';
import { NavLink } from 'react-router-dom';

import {
  requestMyListings,
  resetDeleteListing,
  filterMyListings
} from '../../../../../../../../services/listing/listingActions';

import './my-listings.scss';
import '../../../../../Marketplace/marketplace.scss';
import '../../../../../Marketplace/scenes/CategoryListing/listings.scss';

import { makeValidatableField } from '../../../../../../../../components/ValidatableField/ValidatableField';

const iconSize = 42;
const iconSizeSmall = 12;

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
  currency: {
    id: 'MyListings.currency',
    defaultMessage: 'Currency'
  },
});

class MyListings extends Component {
  constructor(props) {
    super(props);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
  }

  componentDidMount() {
    this.props.listingActions.resetDeleteListing();
    if (!this.props.listing.saveListing.saving) {
      this.props.listingActions.requestMyListings();
    }
    this.props.listingActions.filterMyListings('all', 'all');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listing.saveListing.saving && !nextProps.listing.saveListing.saving) {
      this.props.listingActions.requestMyListings();
    }
  }

  handleSubmit(values, searchTerm) {
    const currency = values.currency;
    const searchText = searchTerm || '';
    const category = (values && values.category) ? values.category : null;
    const subcategory = (values && values.subcategory) ? values.subcategory : null;
    this.props.listingActions.filterMyListings(currency, category, subcategory, searchText);
  }

  onChangeCurrency(values, currency) {
    const searchText = values.searchTerm || '';
    const category = (values && values.category) ? values.category : null;
    const subcategory = (values && values.subcategory) ? values.subcategory : null;
    this.props.listingActions.filterMyListings(currency, category, subcategory, searchText);
  }

  renderMyListings() {
    const { formatMessage } = this.props.intl;
    const {
      myListings,
      requestMyListings,
      myListingsFiltered,
      myListingsCurrency,
      myListingsCategory,
      myListingsSubCategory,
      myListingsSearchTerm,
      saveListing
    } = this.props.listing;

    let data = myListings;
    if ((myListingsCurrency && myListingsCurrency.toLowerCase() !== 'all') ||
        (myListingsCategory && myListingsCategory !== 'all') ||
        (myListingsSubCategory && myListingsSubCategory !== 'all') ||
        (myListingsSearchTerm && myListingsSearchTerm !== '')) {
      data = myListingsFiltered;
    }
    
    return (
      <div className="list-container my-listings">
        <SearchFilters onSubmit={this.handleSubmit} onChangeCurrency={this.onChangeCurrency} />
        <TabsData
          data={data}
          showTrailingLoader={requestMyListings.ids.length !== 0}
          loading={saveListing.saving}
          currency={myListingsCurrency}
          showActions
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
                  <NavLink to="/marketplace" activeClassName="active" className="menu-item">
                    <span className="link">
                      <span>{formatMessage(messages.marketplace)}</span>
                    </span>
                  </NavLink>
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
    resetDeleteListing: PropTypes.func,
    filterMyListings: PropTypes.func
  }),
  listing: PropTypes.shape({
    myListings: PropTypes.object,
    myListingsFiltered: PropTypes.array,
    myListingsCurrency: PropTypes.string,
    myListingsCategory: PropTypes.string,
    saveListing: PropTypes.shape({
      saving: PropTypes.bool
    })
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  handleSubmit: PropTypes.func,
};

MyListings.defaultProps = {
  listingActions: {},
  handleSubmit: {},
  listing: {},
  intl: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      listingActions: bindActionCreators({
        requestMyListings,
        resetDeleteListing,
        filterMyListings
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'myListingsForm',
    destroyOnUnmount: true,
  })
)(injectIntl(MyListings));

