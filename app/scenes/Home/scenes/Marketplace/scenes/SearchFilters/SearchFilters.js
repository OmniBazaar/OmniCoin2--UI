import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import {
  Icon,
  Button,
  Form
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import _ from 'lodash';

import CurrencyDropdown from '../Listing/scenes/AddListing/components/CurrencyDropdown/CurrencyDropdown';
import CategoryDropdown from '../../scenes/Listing/scenes/AddListing/components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from '../../scenes/Listing/scenes/AddListing/components/SubCategoryDropdown/SubCategoryDropdown';

import { makeValidatableField } from '../../../../../../components/ValidatableField/ValidatableField';

import './search-filters.scss';

const iconSizeSmall = 12;

const messages = defineMessages({
  search: {
    id: 'SearchFilters.search',
    defaultMessage: 'Search'
  },
  currency: {
    id: 'SearchFilters.currency',
    defaultMessage: 'Currency'
  },
  category: {
    id: 'SearchFilters.category',
    defaultMessage: 'Category'
  },
  subCategory: {
    id: 'SearchFilters.subCategory',
    defaultMessage: 'Sub-category'
  },
});

class SearchFilters extends Component {
  constructor(props) {
    super(props);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.CategoryDropdown = makeValidatableField(CategoryDropdown);
    this.SubCategoryDropdown = makeValidatableField(SubCategoryDropdown);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let {
      searchTerm, category, subCategory, currency
    } = this.props.search;

    const { location } = this.props;
    const query = queryString.parse(location.search);
    
    searchTerm = query.searchTerm ? query.searchTerm : searchTerm;
    category = query.category ? query.category : category;
    subCategory = query.subcategory ? query.subcategory : subCategory;
    currency = query.currency ? query.currency : currency;

    this.updateLocation({
      searchTerm,
      category,
      subcategory: subCategory,
      currency
    });

    this.props.initialize({
      searchTerm,
      category,
      subcategory: subCategory,
      currency
    });
  }

  componentWillReceiveProps(nextProps) {
    const { searchTerm, category, subCategory } = this.props.search;

    if (searchTerm !== nextProps.search.searchTerm) {
      if (nextProps.search.searchTerm) {
        this.props.change('searchTerm', nextProps.search.searchTerm);
      }
    }

    if (category !== nextProps.search.category) {
      const categoryName = nextProps.search.category;
      const searchCategory = categoryName && categoryName === 'All' ? categoryName.toLowerCase() : categoryName;
      this.props.change('category', searchCategory);
    }

    if (subCategory !== nextProps.search.subCategory) {
      const subCategoryName = nextProps.search.subCategory;
      const searchSubCategory = subCategoryName && subCategoryName === 'All' ? subCategoryName.toLowerCase() : subCategoryName;
      this.props.change('subcategory', searchSubCategory);
    }

    if (this.props.dht.isLoading !== nextProps.dht.isLoading) {
      if (!nextProps.dht.isLoading) {
        const subCategoryName = nextProps.search.subCategory;
        const searchSubCategory = subCategoryName && subCategoryName === 'All' ? subCategoryName.toLowerCase() : subCategoryName;
        this.props.change('subcategory', searchSubCategory);
      }
    }
  }

  renderButtonField = ({
    input, placeholder
  }) => (
    <div className="hybrid-input">
      <input
        {...input}
        ref={searchInput => { this.searchInput = searchInput; }}
        type="text"
        className="textfield"
        placeholder={placeholder}
      />
    </div>
  );

  updateLocation = (formValues) => {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    Object.keys(formValues).forEach(key => {
      if (formValues[key]) {
        query[key] = formValues[key];
      } else {
        delete query[key];
      }
    });

    const strs = Object.keys(query).map(key => `${key}=${query[key]}`);
    this.props.history.push({
      pathname: location.pathname,
      search: `?${strs.join('&')}`
    });
  }

  changeCurrency(currency) {
    const searchTerm = (this.searchInput && this.searchInput.value) || '';
    const values = {
      ...this.props.formValues,
      searchTerm
    };
    this.updateLocation({ ...values, currency });
    this.props.onChangeCurrency(values, currency);
  }

  handleSubmit(values) {
    const searchTerm = (this.searchInput && this.searchInput.value) || '';
    this.updateLocation({ ...values, searchTerm });
    this.props.onSubmit(values, searchTerm);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { subCategory } = this.props.search;
    const { category } = this.props.formValues ? this.props.formValues : {};

    return (
      <Form className="filter search-form" onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="content">
          <div className="search-container">
            <Field
              type="text"
              name="searchTerm"
              placeholder={formatMessage(messages.search)}
              component={this.renderButtonField}
              className="textfield"
            />
            <div className="search-filters">
              <Field
                name="category"
                component={this.CategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.category)
                }}
              />
              <Field
                name="subcategory"
                component={this.SubCategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.subCategory),
                  parentCategory: category
                }}
              />
              <Button
                content={<Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />}
                className="button--primary search-btn"
                type="submit"
              />

              <Field
                name="currency"
                component={this.CurrencyDropdown}
                props={{
                  placeholder: formatMessage(messages.currency),
                  onChange: this.changeCurrency.bind(this)
                }}
              />
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default compose(
  reduxForm({
    form: 'searchForm',
    destroyOnUnmount: true,
  }),
  connect((state) => ({
    ...state.default,
    formValues: getFormValues('searchForm')(state)
  }))
)(injectIntl(withRouter(SearchFilters)));
