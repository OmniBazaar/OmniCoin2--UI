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
import { Field, reduxForm } from 'redux-form';
import { makeValidatableField } from '../../../../../../../../components/ValidatableField/ValidatableField';
import CurrencyDropdown from '../../../Listing/scenes/AddListing/components/CurrencyDropdown/CurrencyDropdown';
import CategoryDropdown from '../../../../scenes/Listing/scenes/AddListing/components/CategoryDropdown/CategoryDropdown';
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
});

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.change('search', null);
  }

  componentWillReceiveProps(nextProps) {
    const { searchTerm, category } = this.props.search;

    if (searchTerm !== nextProps.search.searchTerm) {
      if (nextProps.search.searchTerm) {
        this.props.change('searchTerm', nextProps.search.searchTerm);
      }
    }

    if (category !== nextProps.search.category) {
      const categoryName = nextProps.search.category;
      const searchCategory = categoryName && categoryName === 'All' ? categoryName.toLowerCase() : categoryName;
      this.props.change('search', searchCategory);
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

  renderFilters = ({
    input, dropdownPlaceholder, defaultValue
  }) => (
    <CategoryDropdown
      placeholder={dropdownPlaceholder}
      selection
      input={{
        defaultValue,
        value: input.category,
        onChange: (value) => {
          input.onChange({
            ...input.value,
            category: value
          });
        }
      }}
    />
  );

  handleSubmit(values) {
    const currency = values.currency;
    const searchTerm = (this.searchInput && this.searchInput.value) || '';
    const category = (values && values.search) ? values.search.category : null;
    this.props.searchActions.filterSearchResults(searchTerm, currency, category);
  }

  renderSearchResults() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const {
      searchResultsFiltered,
      category,
      currency
    } = this.props.search;
    const searchCategory = category && category === 'All' ? category.toLowerCase() : category;

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
                  type="text"
                  name="search"
                  inputName="search"
                  placeholder="Search"
                  dropdownPlaceholder="Categories"
                  component={this.renderFilters}
                  defaultValue={searchCategory}
                  className="textfield"
                />
                <Field
                  name="currency"
                  component={this.CurrencyDropdown}
                  props={{
                    placeholder: formatMessage(messages.currency)
                  }}
                />
                <Button
                  content={<Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />}
                  className="button--primary search-btn"
                  type="submit"
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
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      searchActions: bindActionCreators({
        filterSearchResults,
        searchListings,
        setActiveCategory,
      }, dispatch),
    })
  ),
  reduxForm({
    form: 'searchForm',
    destroyOnUnmount: true,
  })
)(injectIntl(SearchResults));
