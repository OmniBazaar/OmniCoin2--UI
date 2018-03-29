import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tab, Dropdown, Input } from 'semantic-ui-react';
import Menu from '../Menu/Menu';
import CategoryTable from '../CategoryTable/CategoryTable';
import FeatureTable from '../FeatureTable/FeatureTable';
import NewArrivalsTable from '../NewArrivalsTable/NewArrivalsTable';
import {
  saleCategories,
  servicesCategories,
  jobsCategories,
  cryptoCategories,
  moreCategories,
  aboutCategories,
  mainCategories
} from '../../categories';

import { CategoriesTypes } from '../../constants';

import './listings.scss';

const iconSizeSmall = 12;

class CategoryListing extends Component {
  static getValue(category) {
    const arr = category.split('.');
    let categoryName = category;
    if (arr.length > 1) {
      categoryName = arr[1];
    }

    return categoryName;
  }

  getCategoryName(category, parent) {
    const { formatMessage } = this.props.intl;
    const categoryName = CategoryListing.getValue(category);

    if (!parent) {
      return formatMessage(mainCategories[categoryName]);
    }

    const parentName = CategoryListing.getValue(parent);

    switch (parentName) {
      case CategoriesTypes.FOR_SALE:
        return formatMessage(saleCategories[categoryName]);
      case CategoriesTypes.SERVICES:
        return formatMessage(servicesCategories[categoryName]);
      case CategoriesTypes.JOBS:
        return formatMessage(jobsCategories[categoryName]);
      case CategoriesTypes.CRYPTO_BAZAAR:
        return formatMessage(cryptoCategories[categoryName]);
      case CategoriesTypes.MORE:
        return formatMessage(moreCategories[categoryName]);
      case CategoriesTypes.ABOUT:
        return formatMessage(aboutCategories[categoryName]);
      default:
        return categoryName;
    }
  }

  renderCategoryHeader() {
    const { parentCategory, activeCategory } = this.props.marketplace;

    const options = [
      { key: 1, text: 'USD', value: 'usd' },
      { key: 2, text: 'EURO', value: 'euro' },
      { key: 3, text: 'POUND', value: 'pound' },
    ];

    return (
      <div className="top-header">
        <div className="content">
          <div className="category-title">
            {parentCategory ?
              <div className="parent">
                <span>{this.getCategoryName(parentCategory)}</span>
                <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
              </div>
              : null}
            <span>{this.getCategoryName(activeCategory, parentCategory)}</span>
          </div>
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

  filterList(listData, selectedTab) {
    let result = listData;
    switch (selectedTab) {
      case CategoriesTypes.NEW_ARRIVALS:
        result = listData.sort((a, b) => {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });
        break;
      default:
        result = listData;
    }

    console.log(result);

    return result;
  }

  getCategoryData() {
    const {
      parentCategory,
      activeCategory,
      featureListFiltered,
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
        listData = featureListFiltered;
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

    // return this.filterList(listData, selectedTab);
    return listData;
  }

  getListingTable(selectedTab) {
    const categoryList = this.getCategoryData(selectedTab);
    const rowsPerPage = 3;
    const columns = 6;

    return (
      <CategoryTable
        categoryData={categoryList}
        rowsPerPage={rowsPerPage * columns}
        tableProps={{
          sortable: true,
          compact: true,
          basic: 'very',
          size: 'small'
        }}
      />
    );
  }

  renderListing() {
    return (
      <div className="list-container">
        <Tab
          className="tabs"
          menu={{ secondary: true, pointing: true }}
          panes={[
            {
              menuItem: 'Featured',
              render: () => {
                const categoryList = this.getCategoryData();
                return (
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
                );
              }
            },
            {
              menuItem: 'New Arrivals',
              render: () => {
                const categoryList = this.getCategoryData();
                return (
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
                );
              }
            },
            {
              menuItem: 'Lowest Price',
              render: () => <Tab.Pane>{this.getListingTable('lowest')}</Tab.Pane>,
            },
            {
              menuItem: 'Highest Price',
              render: () => <Tab.Pane>{this.getListingTable('highest')}</Tab.Pane>,
            },
          ]}
        />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

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
