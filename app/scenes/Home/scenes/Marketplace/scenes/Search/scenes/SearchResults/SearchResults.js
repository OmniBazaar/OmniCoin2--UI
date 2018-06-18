import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import {
  Icon,
  Button,
  Form,
  Loader
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import { makeValidatableField } from '../../../../../../../../components/ValidatableField/ValidatableField';
import CurrencyDropdown from '../../../Listing/scenes/AddListing/components/CurrencyDropdown/CurrencyDropdown';
import CategoryDropdown from '../../../../scenes/Listing/scenes/AddListing/components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from '../../../../scenes/Listing/scenes/AddListing/components/SubCategoryDropdown/SubCategoryDropdown';
import TabsData from '../../../../components/TabsData/TabsData';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import Breadcrumb from '../../../../../Marketplace/scenes/Breadcrumb/Breadcrumb';

import { filterSearchResults, searchListings } from '../../../../../../../../services/search/searchActions';
import { setActiveCategory } from '../../../../../../../../services/marketplace/marketplaceActions';

import './search-results.scss';

const iconSizeSmall = 12;

const messages = defineMessages({
  marketplace: {
    id: 'SearchResults.marketplace',
    defaultMessage: 'Marketplace'
  },
  search: {
    id: 'SearchResults.search',
    defaultMessage: 'Search'
  },
  featured: {
    id: 'SearchResults.featured',
    defaultMessage: 'Featured'
  },
  newArrivals: {
    id: 'SearchResults.newArrivals',
    defaultMessage: 'New Arrivals'
  },
  lowestPrice: {
    id: 'SearchResults.lowestPrice',
    defaultMessage: 'Lowest Price'
  },
  highestPrice: {
    id: 'SearchResults.highestPrice',
    defaultMessage: 'Highest Price'
  },
  allCategories: {
    id: 'SearchResults.allCategories',
    defaultMessage: 'All Categories'
  },
  searchResults: {
    id: 'SearchResults.searchResults',
    defaultMessage: 'Search results'
  },
  searchingForPublishers: {
    id: 'SearchResults.searchingForPublishers',
    defaultMessage: 'Searching for publishers'
  },
  loadingListings: {
    id: 'SearchMenu.loadingListings',
    defaultMessage: 'Loading listings'
  },
  currency: {
    id: 'SearchMenu.currency',
    defaultMessage: 'Currency'
  },
  category: {
    id: 'AddListing.category',
    defaultMessage: 'Category'
  },
  subCategory: {
    id: 'SearchMenu.subCategory',
    defaultMessage: 'Sub-category'
  },
});

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.CategoryDropdown = makeValidatableField(CategoryDropdown);
    this.SubCategoryDropdown = makeValidatableField(SubCategoryDropdown);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { searchTerm, category, subCategory, currency } = this.props.search;
    this.props.initialize({
      searchTerm,
      category,
      subCategory,
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

  changeCurrency(currency) {
    const { filterSearchResults } = this.props.searchActions;
    const { searchTerm, category, subCategory } = this.props.search;
    filterSearchResults(searchTerm, currency, category, subCategory);
  }

  handleSubmit(values) {
    const currency = values.currency;
    const searchTerm = (this.searchInput && this.searchInput.value) || '';
    const category = (values && values.category) ? values.category : null;
    const subcategory = (values && values.subcategory) ? values.subcategory : null;
    this.props.searchActions.filterSearchResults(searchTerm, currency, category, subcategory);
  }

  renderSearchResults() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    
    const { searchResultsFiltered, subCategory, currency } = this.props.search;
    const { category } = this.props.formValues ? this.props.formValues : {};


    return (
      <div className="list-container search-filters">
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
                  value={subCategory}
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
        <TabsData
          data={searchResultsFiltered}
          currency={currency}
          tabs={[
            {
              title: formatMessage(messages.featured),
              sortBy: 'date',
              sortDirection: 'ascending'
            },
            {
              title: formatMessage(messages.newArrivals),
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

  setActiveCategory = () => {
    if (this.props.searchActions.setActiveCategory) {
      this.props.searchActions.setActiveCategory('Marketplace.home');
    }
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { category, subCategory } = this.props.search;

    return (
      <div className="marketplace-container category-listing search-results">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <Breadcrumb category={category} subCategory={subCategory} />
          {(this.props.dht.isLoading || this.props.search.searching)
            ?
              <Loader
                content={
                  this.props.dht.isLoading
                    ? formatMessage(messages.searchingForPublishers)
                    : formatMessage(messages.loadingListings)
                }
                inline
                active
              />
            :
            this.renderSearchResults()
          }
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  account: PropTypes.shape({
    publisherData: PropTypes.object
  }),
  search: PropTypes.shape({
    searchResults: PropTypes.array,
    recentSearches: PropTypes.array,
    searchResultsFiltered: PropTypes.array,
    searchTerm: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    searching: PropTypes.bool,
  }),
  searchActions: PropTypes.shape({
    dhtGetPeersFor: PropTypes.func,
    filterSearchResults: PropTypes.func,
    searchListings: PropTypes.func,
    setActiveCategory: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  handleSubmit: PropTypes.func
};

SearchResults.defaultProps = {
  intl: {},
  search: {},
  account: {},
  searchActions: {},
  handleSubmit: () => {},
};

export default compose(
  reduxForm({
    form: 'searchForm',
    destroyOnUnmount: true,
  }),
  connect(
    (state) => ({
      ...state.default,
      formValues: getFormValues('searchForm')(state)
    }),
    (dispatch) => ({
      searchActions: bindActionCreators({
        filterSearchResults,
        searchListings,
        setActiveCategory,
      }, dispatch),
    })
  )
)(injectIntl(SearchResults));
