import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import DataTable from '../../../../components/DataTable/DataTable';

import { getRecentSearches } from '../../../../../../../../services/search/searchActions';

import './recent-searches.scss';

const messages = defineMessages({
  recentSearches: {
    id: 'RecentSearches.recentSearches',
    defaultMessage: 'Recent Searches'
  },
});

const recentSearchesList = [
  {
    id: 1,
    date: '2018-04-19',
    search: 'car',
    filters: ['USA', 'Lowest price', 'Newest'],
  },
  {
    id: 2,
    date: '2018-04-19',
    search: 'motorcycles',
    filters: ['USA', 'Lowest price', 'Newest'],
  },
  {
    id: 3,
    date: '2018-04-20',
    search: 'cars',
    filters: ['USA', 'Lowest price'],
  },
  {
    id: 4,
    date: '2018-04-20',
    search: 'jewelry',
    filters: [],
  },
];

class RecentSearches extends Component {
  componentDidMount() {
    this.props.searchActions.getRecentSearches(recentSearchesList);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { recentSearches } = this.props.search;

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
            <DataTable
              data={recentSearches}
              sortBy="date"
              sortDirection="descending"
              tableProps={{
                sortable: true,
                compact: true,
                basic: 'very',
                striped: true,
                size: 'small'
              }}
              showSaveButton
              showViewButton
            />
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

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    searchActions: bindActionCreators({
      getRecentSearches
    }, dispatch)
  })
)(injectIntl(RecentSearches));
