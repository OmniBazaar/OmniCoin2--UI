import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Form, Icon, Button } from 'semantic-ui-react';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import { Field, reduxForm } from 'redux-form';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import TabsData from '../../../../components/TabsData/TabsData';
import { getFavorites, filterFavorites } from '../../../../../../../../services/listing/listingActions';
import { makeValidatableField } from '../../../../../../../../components/ValidatableField/ValidatableField';
import CurrencyDropdown from '../AddListing/components/CurrencyDropdown/CurrencyDropdown';
import CategoryDropdown from '../../../../scenes/Listing/scenes/AddListing/components/CategoryDropdown/CategoryDropdown';

import './favorite-listings.scss';
import '../../../../../Marketplace/marketplace.scss';
import '../../../../../Marketplace/scenes/CategoryListing/listings.scss';

const iconSize = 42;
const iconSizeSmall = 12;

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
  }

  componentDidMount() {
    this.props.listingActions.getFavorites();
    this.props.listingActions.filterFavorites('all', 'all');
  }

  renderFilters = ({
    input, dropdownPlaceholder
  }) => (
    <div className="search-actions">
      <CategoryDropdown
        placeholder={dropdownPlaceholder}
        selection
        input={{
          value: input.category,
          onChange: (value) => {
            input.onChange({
              ...input.value,
              category: value
            });
          }
        }}
      />
    </div>
  );

  handleSubmit(values) {
    const currency = values.currency;
    const category = (values && values.search) ? values.search.category : null;
    this.props.listingActions.filterFavorites(currency, category);
  }

  renderFavoriteListings() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;

    const {
      favoriteListings,
      favoriteFiltered,
      favoriteCurrency,
      favoriteCategory
    } = this.props.listing;

    let data = favoriteListings;
    if ((favoriteCurrency && favoriteCurrency.toLowerCase() !== 'all') ||
      (favoriteCategory && favoriteCategory !== 'all')) {
      data = favoriteFiltered;
    }

    return (
      <div className="list-container my-listings">
        <div className="filters">
          <Form className="favorites-form" onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              type="text"
              name="search"
              placeholder="Search"
              defaultValue={favoriteCategory}
              dropdownPlaceholder="Categories"
              component={this.renderFilters}
              className="textfield"
              props={{
                value: favoriteCategory
              }}
            />
            <Field
              name="currency"
              component={this.CurrencyDropdown}
              props={{
                value: favoriteCurrency,
                placeholder: formatMessage(messages.currency)
              }}
            />
            <Button
              content={<Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />}
              className="button--primary search-btn"
              type="submit"
            />
          </Form>
        </div>
        <TabsData
          data={data}
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
    filterFavorites: PropTypes.func,
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
