import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Button
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import { sortRecentSearches } from '../../../../../../../services/search/searchActions';

const messages = defineMessages({
  default: {
    id: 'RecentSearchesTable.default',
    defaultMessage: 'Default'
  },
  date: {
    id: 'RecentSearchesTable.date',
    defaultMessage: 'Date'
  },
  search: {
    id: 'RecentSearchesTable.search',
    defaultMessage: 'Search'
  },
  parameters: {
    id: 'RecentSearchesTable.parameters',
    defaultMessage: 'Parameters'
  },
  save: {
    id: 'RecentSearchesTable.save',
    defaultMessage: 'SAVE'
  },
  view: {
    id: 'RecentSearchesTable.view',
    defaultMessage: 'VIEW'
  },
});

class RecentSearchesTable extends Component {
  sortData = (clickedColumn) => () => {
    this.props.searchActions.sortRecentSearches(clickedColumn);
  };

  renderFilters(filters) {
    const { formatMessage } = this.props.intl;

    if (filters.length === 0) {
      return (
        <span>{formatMessage(messages.default)}</span>
      );
    }

    return (
      filters.map((filter, index) => {
        const comma = filters.length - 1 !== index ? ', ' : '';
        return (
          <span key={hash(filter)}>{`${filter}${comma}`}</span>
        );
      })
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      sortColumnSearch,
      sortDirectionSearch,
      recentSearches
    } = this.props.search;

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell key="date" sorted={sortColumnSearch === 'date' ? sortDirectionSearch : null} onClick={this.sortData('date')}>
                  {formatMessage(messages.date)}
                </TableHeaderCell>
                <TableHeaderCell key="search" sorted={sortColumnSearch === 'search' ? sortDirectionSearch : null} onClick={this.sortData('search')}>
                  {formatMessage(messages.search)}
                </TableHeaderCell>
                <TableHeaderCell key="filters" sorted={sortColumnSearch === 'filters' ? sortDirectionSearch : null} onClick={this.sortData('filters')}>
                  {formatMessage(messages.parameters)}
                </TableHeaderCell>
                <TableHeaderCell key="actions" sorted={sortColumnSearch === 'actions' ? sortDirectionSearch : null} onClick={this.sortData('actions')} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSearches.map(row =>
                (
                  <TableRow key={hash(row)}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell><a>{row.search}</a></TableCell>
                    <TableCell>{this.renderFilters(row.filters)}</TableCell>
                    <TableCell className="actions">
                      <Button content={formatMessage(messages.save)} className="button--blue-text save-btn" />
                      <Button content={formatMessage(messages.view)} className="button--blue-text view-btn" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

RecentSearchesTable.propTypes = {
  searchActions: PropTypes.shape({
    sortRecentSearches: PropTypes.func,
  }),
  search: PropTypes.shape({
    sortColumnSearch: PropTypes.string,
    sortDirectionSearch: PropTypes.string,
    recentSearches: PropTypes.array,
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    size: PropTypes.string
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

RecentSearchesTable.defaultProps = {
  searchActions: {},
  search: {},
  tableProps: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    searchActions: bindActionCreators({
      sortRecentSearches
    }, dispatch)
  })
)(injectIntl(RecentSearchesTable));
