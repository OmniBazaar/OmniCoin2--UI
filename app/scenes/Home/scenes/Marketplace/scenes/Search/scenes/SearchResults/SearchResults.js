import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import {
  Icon,
  Button,
  Form,
  Dropdown,
  Loader
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import CurrencyDropdown from '../../../../../../components/CurrencyDropdown/CurrencyDropdown';
import TabsData from '../../../../components/TabsData/TabsData';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';

import {
  filterSearchResults
} from '../../../../../../../../services/search/searchActions';

import './search-results.scss';

const iconSizeMedium = 15;
const iconSizeSmall = 12;

const options = [
  { key: 1, text: 'All Categories', value: 'all' },
  { key: 2, text: 'Category 1', value: 'category1' },
  { key: 3, text: 'Category 2', value: 'category2' },
];

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
          <Dropdown
            button
            className="categories icon"
            floating
            options={options}
            defaultValue="all"
            placeholder={formatMessage(messages.allCategories)}
          />
          <CurrencyDropdown />
        </div>
        <TabsData
          data={searchResultsFiltered ? searchResultsFiltered : searchResults}
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

  render() {
    const { formatMessage } = this.props.intl;

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
                  <span>{formatMessage(messages.marketplace)}</span>
                  <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                </div>
                <span className="child">{formatMessage(messages.searchResults)}</span>
              </div>
              <div className="search-container">
                <Form className="search-form">
                  <Field
                    type="text"
                    name="search"
                    placeholder={formatMessage(messages.search)}
                    component={this.renderButtonField}
                    className="textfield"
                  />
                </Form>
              </div>
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
  search: PropTypes.shape({
    recentSearches: PropTypes.array,
    searchResultsFiltered: PropTypes.array
  }),
  searchActions: PropTypes.shape({
    dhtGetPeersFor: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

SearchResults.defaultProps = {
  intl: {},
  search: {},
  searchActions: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      searchActions: bindActionCreators({
        filterSearchResults
      }, dispatch),
    })
  ),
  reduxForm({
    form: 'searchForm',
    destroyOnUnmount: true,
  })
)(injectIntl(SearchResults));
