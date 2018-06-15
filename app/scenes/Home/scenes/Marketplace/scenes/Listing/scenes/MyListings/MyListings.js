import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { Form, Icon, Button } from 'semantic-ui-react';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import CurrencyDropdown from '../AddListing/components/CurrencyDropdown/CurrencyDropdown';
import TabsData from '../../../../components/TabsData/TabsData';
import CategoryDropdown from '../../../../scenes/Listing/scenes/AddListing/components/CategoryDropdown/CategoryDropdown';

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
  }

  componentDidMount() {
    this.props.listingActions.resetDeleteListing();
    this.props.listingActions.requestMyListings();
    this.props.listingActions.filterMyListings('all', 'all');
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
    this.props.listingActions.filterMyListings(currency, category);
  }

  renderMyListings() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const {
      myListings,
      requestMyListings,
      myListingsFiltered,
      myListingsCurrency,
      myListingsCategory
    } = this.props.listing;

    let data = myListings;
    if ((myListingsCurrency && myListingsCurrency.toLowerCase() !== 'all') ||
        (myListingsCategory && myListingsCategory !== 'all')) {
      data = myListingsFiltered;
    }

    return (
      <div className="list-container my-listings">
        <div className="filters">
          <Form className="search-form" onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              type="text"
              name="search"
              placeholder="Search"
              defaultValue={myListingsCategory}
              dropdownPlaceholder="Categories"
              component={this.renderFilters}
              className="textfield"
              props={{
                value: myListingsCategory
              }}
            />
            <Field
              name="currency"
              component={this.CurrencyDropdown}
              props={{
                value: myListingsCurrency,
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
          showTrailingLoader={requestMyListings.ids.length !== 0}
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
    resetDeleteListing: PropTypes.func,
    filterMyListings: PropTypes.func
  }),
  listing: PropTypes.shape({
    myListings: PropTypes.object,
    myListingsFiltered: PropTypes.array,
    myListingsCurrency: PropTypes.string,
    myListingsCategory: PropTypes.string
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

