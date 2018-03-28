import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tab, Dropdown, Input } from 'semantic-ui-react';
import Menu from '../Menu/Menu';
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

  getCategoryData() {
    const {
      parentCategory,
      activeCategory,
      forSaleList,
      servicesList,
      jobsList,
      cryptoBazaarList
    } = this.props.marketplace;
    let category = CategoryListing.getValue(activeCategory);

    if (parentCategory) {
      category = CategoryListing.getValue(parentCategory);
    }

    switch (category) {
      case CategoriesTypes.FOR_SALE:
        return forSaleList;
      case CategoriesTypes.SERVICES:
        return servicesList;
      case CategoriesTypes.JOBS:
        return jobsList;
      case CategoriesTypes.CRYPTO_BAZAAR:
        return cryptoBazaarList;
      default:
        return forSaleList;
    }
  }

  getListing(type) {
    const categoryList = this.getCategoryData();

    return (
      <div className="items">
        {categoryList.map((item) => {
          const style = { backgroundImage: `url(${item.image})` };
          let { description } = item;
          description = description.length > 55 ? `${description.substring(0, 55)}...` : description;

          return (
            <div key={`fl-item-${item.id}`} className="item">
              <div
                className="img-wrapper"
                style={style}
                onClick={this.onClickItem}
                onKeyDown={this.onClickItem}
                tabIndex={0}
                role="link"
              />
              <span
                className="title"
                onClick={this.onClickItem}
                role="link"
                onKeyDown={this.onClickItem}
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
            </div>
          );
        })}
      </div>
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
              render: () => <Tab.Pane>{this.getListing('featured')}</Tab.Pane>,
            },
            {
              menuItem: 'New Arrivals',
              render: () => <Tab.Pane>{this.getListing('new')}</Tab.Pane>,
            },
            {
              menuItem: 'Lowest Price',
              render: () => <Tab.Pane>{this.getListing('lowest')}</Tab.Pane>,
            },
            {
              menuItem: 'Highest Price',
              render: () => <Tab.Pane>{this.getListing('highest')}</Tab.Pane>,
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
