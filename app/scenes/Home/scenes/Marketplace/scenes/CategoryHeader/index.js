import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  saleCategories,
  servicesCategories,
  jobsCategories,
  cryptoCategories,
  moreCategories,
  aboutCategories,
  mainCategories,
  getSubCategoryTitle
} from '../../categories';

import { CategoriesTypes } from '../../constants';

const iconSizeSmall = 12;

class CategoryHeader extends Component {
  static getValue(category) {
    let categoryName = '';
    if (category) {
      const arr = category.split('.');
      categoryName = category;
      if (arr.length > 1) {
        categoryName = arr[1];
      }
    }

    return categoryName;
  }

  getCategoryName(category, parent) {
    const { formatMessage } = this.props.intl;
    const categoryName = CategoryHeader.getValue(category);

    if (!parent && categoryName) {
      return formatMessage(mainCategories[categoryName]);
    }

    const parentName = CategoryHeader.getValue(parent);

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

  render() {
    const { formatMessage } = this.props.intl;
    const { category, subCategory } = this.props.search;

    const categoryTitle = category && category !== 'All' ? formatMessage(mainCategories[category]) : category || '';
    const subcategory = getSubCategoryTitle(category, subCategory);
    const subCategoryTitle = subcategory !== '' ? formatMessage(subcategory) : '';

    return (
      <div className="category-title">
        {category ?
          <div className="parent">
            <span>{categoryTitle}</span>
            {subCategoryTitle ?
              <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
            : null}
          </div>
          : null}
        <span>{subCategoryTitle}</span>
      </div>
    );
  }
}

CategoryHeader.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  marketplace: PropTypes.shape({
    parentCategory: PropTypes.string,
    activeCategory: PropTypes.string
  })
};

CategoryHeader.defaultProps = {
  intl: {},
  marketplace: {}
};

export default connect(state => ({ ...state.default }))(injectIntl(CategoryHeader));
