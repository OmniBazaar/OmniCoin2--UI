import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import DataTable from '../../../../components/DataTable/DataTable';

import {
  getSavedSearches,
  sortSavedSearches,
  searchListings,
  deleteSearch
} from '../../../../../../../../services/search/searchActions';

import {
  getPublisherData
} from "../../../../../../../../services/accountSettings/accountActions";

import './saved-searches.scss';

const messages = defineMessages({
  mySearches: {
    id: 'SavedSearches.mySearches',
    defaultMessage: 'My Searches'
  },
});

class SavedSearches extends Component {
  componentDidMount() {
    const { currentUser } = this.props.auth;
    this.props.searchActions.getSavedSearches(currentUser.username);
    this.props.publisherActions.getPublisherData();
    this.handleView = this.handleView.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleView(search) {
    this.props.history.push('/search-results');
    const { country, state, city } = this.props.account.publisherData;
    this.props.searchActions.searchListings(search.searchTerm, search.category, country, state, city);
  }

  handleDelete(search) {
    this.props.searchActions.deleteSearch(search);
  }

  handleSearch(searchTerm, category) {
    this.props.history.push('/search-results');
    const { country, state, city } = this.props.account.publisherData;
    this.props.searchActions.searchListings(searchTerm, category, country, state, city, false);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      savedSearches,
      savedSortOptions,
      deleting,
      error
    } = this.props.search;

    return (
      <div className="marketplace-container category-listing recent-searches">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                {formatMessage(messages.mySearches)}
              </div>
            </div>
          </div>
          <div className="list-container">
            <DataTable
              data={savedSearches}
              sortBy={savedSortOptions.by}
              sortDirection={savedSortOptions.direction}
              sort={this.props.searchActions.sortSavedSearches}
              showDeleteButton
              showViewButton
              onView={this.handleView}
              onDelete={this.handleDelete}
              onSearch={this.handleSearch}
              deleting={deleting}
              error={error}
            />
          </div>
        </div>
      </div>
    );
  }
}

SavedSearches.propTypes = {
  searchActions: PropTypes.shape({
    getSavedSearches: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  search: PropTypes.shape({
    savedSearches: PropTypes.array
  }),
};

SavedSearches.defaultProps = {
  searchActions: {},
  intl: {},
  search: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    searchActions: bindActionCreators({
      getSavedSearches,
      sortSavedSearches,
      deleteSearch,
      searchListings
    }, dispatch),
    publisherActions: bindActionCreators({
      getPublisherData
    }, dispatch)
  })
)(injectIntl(SavedSearches));
