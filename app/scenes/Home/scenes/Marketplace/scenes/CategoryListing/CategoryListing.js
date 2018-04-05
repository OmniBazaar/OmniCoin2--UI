import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Tab, Dropdown } from 'semantic-ui-react';
import Menu from '../Menu/Menu';
import FeatureTable from '../FeatureTable/FeatureTable';
import NewArrivalsTable from '../NewArrivalsTable/NewArrivalsTable';
import LowestPriceTable from '../LowestPriceTable/LowestPriceTable';
import HighestPriceTable from '../HighestPriceTable/HighestPriceTable';
import CategoryHeader from '../CategoryHeader';

import { CategoriesTypes } from '../../constants';

import './listings.scss';

const messages = defineMessages({
  featured: {
    id: 'Marketplace.featured',
    defaultMessage: 'Featured'
  },
  newArrivals: {
    id: 'Marketplace.newArrivals',
    defaultMessage: 'New Arrivals'
  },
  lowestPrice: {
    id: 'Marketplace.lowestPrice',
    defaultMessage: 'Lowest Price'
  },
  highestPrice: {
    id: 'Marketplace.highestPrice',
    defaultMessage: 'Highest Price'
  },
});

class CategoryListing extends Component {
  static getValue(category) {
    const arr = category.split('.');
    let categoryName = category;
    if (arr.length > 1) {
      categoryName = arr[1];
    }

    return categoryName;
  }

  renderCategoryHeader() {
    const options = [
      { key: 1, text: 'USD', value: 'usd' },
      { key: 2, text: 'EURO', value: 'euro' },
      { key: 3, text: 'POUND', value: 'pound' },
    ];

    return (
      <div className="top-header">
        <div className="content">
          <CategoryHeader />
          <div className="currency">
            <Dropdown
              button
              className="icon"
              floating
              labeled
              icon="dollar"
              options={options}
              placeholder="CURRENCY"
            />
          </div>
        </div>
      </div>
    );
  }

  getCategoryData() {
    const {
      parentCategory,
      activeCategory,
      featureList,
      forSaleList,
      servicesList,
      jobsList,
      cryptoBazaarList
    } = this.props.marketplace;
    let category = CategoryListing.getValue(activeCategory);

    if (parentCategory) {
      category = CategoryListing.getValue(parentCategory);
    }

    let listData = forSaleList;
    switch (category) {
      case CategoriesTypes.FEATURED:
        listData = featureList;
        break;
      case CategoriesTypes.FOR_SALE:
        listData = forSaleList;
        break;
      case CategoriesTypes.SERVICES:
        listData = servicesList;
        break;
      case CategoriesTypes.JOBS:
        listData = jobsList;
        break;
      case CategoriesTypes.CRYPTO_BAZAAR:
        listData = cryptoBazaarList;
        break;
      default:
        listData = forSaleList;
        break;
    }

    return listData;
  }

  renderListing() {
    const { formatMessage } = this.props.intl;
    const categoryList = this.getCategoryData();

    return (
      <div className="list-container">
        <Tab
          className="tabs"
          menu={{ secondary: true, pointing: true }}
          panes={[
            {
              menuItem: formatMessage(messages.featured),
              render: () => (
                <Tab.Pane>
                  <FeatureTable
                    categoryData={categoryList}
                    rowsPerPage={3 * 6}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              )
            },
            {
              menuItem: formatMessage(messages.newArrivals),
              render: () => (
                <Tab.Pane>
                  <NewArrivalsTable
                    categoryData={categoryList}
                    rowsPerPage={3 * 6}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              )
            },
            {
              menuItem: formatMessage(messages.lowestPrice),
              render: () => (
                <Tab.Pane>
                  <LowestPriceTable
                    categoryData={categoryList}
                    rowsPerPage={3 * 6}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              ),
            },
            {
              menuItem: formatMessage(messages.highestPrice),
              render: () => (
                <Tab.Pane>
                  <HighestPriceTable
                    categoryData={categoryList}
                    rowsPerPage={3 * 6}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              ),
            },
          ]}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="marketplace-container category-listing">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          {this.renderCategoryHeader()}
          {this.renderListing()}
        </div>
      </div>
    );
  }
}

CategoryListing.propTypes = {
  marketplace: PropTypes.shape({
    parentCategory: PropTypes.string,
    activeCategory: PropTypes.string,
    featureList: PropTypes.string,
    forSaleList: PropTypes.array,
    servicesList: PropTypes.array,
    jobsList: PropTypes.array,
    cryptoBazaarList: PropTypes.array,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

CategoryListing.defaultProps = {
  marketplace: {},
  intl: {},
};

export default connect(state => ({ ...state.default }))(injectIntl(CategoryListing));
