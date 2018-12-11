import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { reduxForm, getFormValues } from 'redux-form';
import TabsData from '../../../../components/TabsData/TabsData';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import Breadcrumb from '../../../../../Marketplace/scenes/Breadcrumb/Breadcrumb';
import SearchFilters from '../../../../../Marketplace/scenes/SearchFilters/SearchFilters';

import { filterSearchResults, searchListings } from '../../../../../../../../services/search/searchActions';
import { setActiveCategory } from '../../../../../../../../services/marketplace/marketplaceActions';

import './search-results.scss';

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
    id: 'SearchResults.loadingListings',
    defaultMessage: 'Loading listings'
  },
  currency: {
    id: 'SearchResults.currency',
    defaultMessage: 'Currency'
  },
  category: {
    id: 'SearchResults.category',
    defaultMessage: 'Category'
  },
  subCategory: {
    id: 'SearchResults.subCategory',
    defaultMessage: 'Sub-category'
  },
});

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeCurrency = this.onChangeCurrency.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.listing.saveListing.saving && !nextProps.listing.saveListing.saving) {
      const { searchListingsParams } = nextProps.search;
      const {
        searchTerm, category, country, state, city, historify, subCategory, fromSearchMenu
      } = searchListingsParams;
      this.props.searchActions.searchListings(searchTerm, category, country, state, city, historify, subCategory, fromSearchMenu);
    }
  }

  handleSubmit(values, searchTerm) {
    const currency = values.currency;
    const searchText = searchTerm || '';
    const category = (values && values.category) ? values.category : null;
    const subcategory = (values && values.subcategory) ? values.subcategory : null;
    this.props.searchActions.filterSearchResults(searchText, currency, category, subcategory);
  }

  onChangeCurrency(values, currency) {
    const searchText = values.searchTerm || '';
    const category = (values && values.category) ? values.category : null;
    const subcategory = (values && values.subcategory) ? values.subcategory : null;
    const { filterSearchResults } = this.props.searchActions;
    filterSearchResults(searchText, currency, category, subcategory);
  }

  renderSearchResults() {
    const { formatMessage } = this.props.intl;
    const { searchResultsFiltered, currency } = this.props.search;

    return (
      <div className="list-container search-filters">
        <SearchFilters onSubmit={this.handleSubmit} onChangeCurrency={this.onChangeCurrency} />
        <TabsData
          data={searchResultsFiltered}
          currency={currency}
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
              sortBy: 'convertedPrice',
              sortDirection: 'ascending'
            },
            {
              title: formatMessage(messages.highestPrice),
              sortBy: 'convertedPrice',
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
    const { saveListing } = this.props.listing;

    return (
      <div className="marketplace-container category-listing search-results">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <Breadcrumb category={category} subCategory={subCategory} />
          {
            (!this.props.dht.isLoading && !this.props.search.searching && !saveListing.saving)
            ? this.renderSearchResults()
            :
              <Loader
                content={
                  saveListing.saving || this.props.dht.isLoading
                    ? formatMessage(messages.searchingForPublishers)
                    : formatMessage(messages.loadingListings)
                }
                inline
                active
              />
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
  listing: PropTypes.shape({
    saveListing: PropTypes.shape({
      saving: PropTypes.bool
    })
  }).isRequired,
  search: PropTypes.shape({
    searchResults: PropTypes.array,
    recentSearches: PropTypes.array,
    searchResultsFiltered: PropTypes.array,
    searchTerm: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    searching: PropTypes.bool,
    searchListingsParams: PropTypes.object
  }),
  searchActions: PropTypes.shape({
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
