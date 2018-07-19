import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { startCase } from 'lodash';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import DataTable from '../../../../components/DataTable/DataTable';

import {
  getRecentSearches,
  sortRecentSearches,
  saveSearch,
  searchListings
} from '../../../../../../../../services/search/searchActions';

import { getPublisherData } from '../../../../../../../../services/accountSettings/accountActions';


import './recent-searches.scss';

const messages = defineMessages({
  recentSearches: {
    id: 'RecentSearches.recentSearches',
    defaultMessage: 'Recent Searches'
  },
});


class RecentSearches extends Component {
  constructor(props) {
    super(props);
    this.handleView = this.handleView.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const { currentUser } = this.props.auth;
    this.props.publisherActions.getPublisherData();
    this.props.searchActions.getRecentSearches(currentUser.username);
  }

  handleView(search) {
    this.props.history.push('/search-results');
    const { country, state, city } = this.props.account.publisherData;
    this.props.searchActions.searchListings(search.searchTerm, search.category, country, state, city);
  }

  handleSave(search) {
    this.props.searchActions.saveSearch(search);
  }

  handleSearch(searchTerm, category) {
    this.props.history.push('/search-results');
    const { country, state, city } = this.props.account.publisherData;
    this.props.searchActions.searchListings(searchTerm, category, country, state, city, false);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      recentSearches,
      recentSortOptions,
      loading,
      saving
    } = this.props.search;

    const searches = recentSearches
      .map(search => ({
        ...search,
        categoryToRead: startCase(search.category),
        subCategoryToRead: startCase(search.subCategory),
      }));

    return (
      <div className="marketplace-container category-listing recent-searches">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                {formatMessage(messages.recentSearches)}
              </div>
            </div>
          </div>
          <div className="list-container">
            {loading
              ?
                <div style={{ flex: 'display', justifyContent: 'center' }}>
                  <Loader active />
                </div>
              :
                <DataTable
                  data={searches}
                  sortBy={recentSortOptions.by}
                  sortDirection={recentSortOptions.direction}
                  sort={this.props.searchActions.sortRecentSearches}
                  showSaveButton
                  showViewButton
                  onSave={this.handleSave}
                  onView={this.handleView}
                  onSearch={this.handleSearch}
                  saving={saving}
                />
            }
          </div>
        </div>
      </div>
    );
  }
}

RecentSearches.propTypes = {
  searchActions: PropTypes.shape({
    getRecentSearches: PropTypes.func,
  }),
  search: PropTypes.shape({
    recentSearches: PropTypes.array
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

RecentSearches.defaultProps = {
  search: {},
  searchActions: {},
  intl: {},
};

RecentSearches = withRouter(RecentSearches);

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    searchActions: bindActionCreators({
      getRecentSearches,
      sortRecentSearches,
      saveSearch,
      searchListings
    }, dispatch),
    publisherActions: bindActionCreators({
      getPublisherData
    }, dispatch)
  })
)(injectIntl(RecentSearches));
