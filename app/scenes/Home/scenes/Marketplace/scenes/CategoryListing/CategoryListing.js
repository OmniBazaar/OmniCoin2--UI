import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import Menu from '../Menu/Menu';
import CategoryHeader from '../CategoryHeader';
import CurrencyDropdown from '../../../../components/CurrencyDropdown/CurrencyDropdown';
import TabsData from '../../components/TabsData/TabsData';

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

  static renderCategoryHeader() {
    return (
      <div className="top-header">
        <div className="content">
          <CategoryHeader />
          <CurrencyDropdown />
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
        <TabsData
          data={categoryList}
          tabs={[
            {
              title: formatMessage(messages.featured),
              sortBy: 'start_date',
              sortDirection: 'ascending'
            },
            {
              title: formatMessage(messages.newArrivals),
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
    return (
      <div className="marketplace-container category-listing">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          {CategoryListing.renderCategoryHeader()}
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
    featureList: PropTypes.array,
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
