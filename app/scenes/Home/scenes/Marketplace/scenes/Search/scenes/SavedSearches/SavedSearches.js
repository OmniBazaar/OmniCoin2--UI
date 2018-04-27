import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import DataTable from '../../../../components/DataTable/DataTable';

import { getSavedSearches } from '../../../../../../../../services/search/searchActions';

import './saved-searches.scss';

const messages = defineMessages({
  mySearches: {
    id: 'SavedSearches.mySearches',
    defaultMessage: 'My Searches'
  },
});

const savedSearchesList = [
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
    search: 'truck',
    filters: ['USA', 'Lowest price'],
  },
  {
    id: 4,
    date: '2018-04-20',
    search: 'jewelry',
    filters: [],
  },
];

class SavedSearches extends Component {
  componentDidMount() {
    this.props.searchActions.getSavedSearches(savedSearchesList);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { savedSearches } = this.props.search;

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
              sortBy="date"
              sortDirection="descending"
              tableProps={{
                sortable: true,
                compact: true,
                basic: 'very',
                striped: true,
                size: 'small'
              }}
              showDeleteButton
              showViewButton
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
      getSavedSearches
    }, dispatch)
  })
)(injectIntl(SavedSearches));
