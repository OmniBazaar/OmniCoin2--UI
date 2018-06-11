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
import { NavLink } from 'react-router-dom';
import CurrencyDropdown from '../../../../../../components/CurrencyDropdown/CurrencyDropdown';
import TabsData from '../../../../components/TabsData/TabsData';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';

import { filterSearchResults, searchListings } from '../../../../../../../../services/search/searchActions';
import { setActiveCategory } from '../../../../../../../../services/marketplace/marketplaceActions';

import {
  mainCategories,
  getSubCategoryTitle
} from '../../../../categories';

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
});

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { searchTerm } = this.props.search;

    if (searchTerm !== nextProps.search.searchTerm) {
      if (nextProps.search.searchTerm) {
        this.props.change('search', nextProps.search.searchTerm);
      }
    }
  }

  onSearch = () => {
    this.props.searchActions.filterSearchResults(this.searchInput.value);
  };

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
      <div className="search-actions">
        <Button
          content={<Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />}
          className="button--primary search-btn"
          onClick={this.onSearch}
        />
      </div>
    </div>
  );

  renderSearchResults() {
    const { formatMessage } = this.props.intl;
    const {
      searchResults,
      searchResultsFiltered
    } = this.props.search;

    return (
      <div className="list-container search-filters">
        <div className="filters">
          <CurrencyDropdown />
        </div>
        <TabsData
          data={searchResultsFiltered || searchResults}
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

  handleSubmit(values) {
    const { search } = values;
    const { category, subCategory } = this.props.search;
    const { country, city } = this.props.account.publisherData;
    this.props.searchActions.searchListings(search, category || 'All', country, city, true, subCategory);
  }

  viewCategory = (category, subCategory) => {
    const { country, city } = this.props.account.publisherData;
    this.props.searchActions.searchListings(null, category || 'All', country, city, true, subCategory);
  };

  setActiveCategory = () => {
    if (this.props.searchActions.setActiveCategory) {
      this.props.searchActions.setActiveCategory('Marketplace.home');
    }
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { searchTerm, category, subCategory } = this.props.search;
    const categoryTitle = category && category !== 'All' ? formatMessage(mainCategories[category]) : category || '';
    const subcategory = getSubCategoryTitle(category, subCategory);
    const subCategoryTitle = subcategory !== '' ? formatMessage(subcategory) : '';

    return (
      <div className="marketplace-container category-listing search-results">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                <div className="parent">
                  <NavLink to="/marketplace" activeClassName="active" className="menu-item" onClick={() => this.setActiveCategory()}>
                    <span className="link">
                      {formatMessage(messages.marketplace)}
                    </span>
                  </NavLink>
                  {category ?
                    <div>
                      <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                      <span
                        className="link"
                        onClick={() => this.viewCategory(category, null)}
                        onKeyDown={() => this.viewCategory(category, null)}
                        tabIndex={0}
                        role="link"
                      >
                        {categoryTitle || ''}
                      </span>
                    </div>
                  : null}
                  {subCategory ?
                    <div>
                      <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                      <span className="link child">
                        {subCategoryTitle || ''}
                      </span>
                    </div>
                  : null}
                </div>
              </div>
              {searchTerm && searchTerm !== '' ?
                <div className="search-container">
                  <Form className="search-form" onSubmit={handleSubmit(this.handleSubmit)}>
                    <Field
                      type="text"
                      name="search"
                      placeholder={formatMessage(messages.search)}
                      component={this.renderButtonField}
                      className="textfield"
                    />
                  </Form>
                </div>
              : null}
            </div>
          </div>
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
        setActiveCategory
      }, dispatch),
    })
  ),
  reduxForm({
    form: 'searchForm',
    destroyOnUnmount: true,
  })
)(injectIntl(SearchResults));
