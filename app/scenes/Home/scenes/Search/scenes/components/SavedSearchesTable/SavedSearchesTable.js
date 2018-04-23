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

import { sortSavedSearches } from '../../../../../../../services/search/searchActions';

const messages = defineMessages({
  default: {
    id: 'SavedSearchesTable.default',
    defaultMessage: 'Default'
  },
  date: {
    id: 'SavedSearchesTable.date',
    defaultMessage: 'Date'
  },
  search: {
    id: 'SavedSearchesTable.search',
    defaultMessage: 'Search'
  },
  parameters: {
    id: 'SavedSearchesTable.parameters',
    defaultMessage: 'Parameters'
  },
  delete: {
    id: 'SavedSearchesTable.delete',
    defaultMessage: 'DELETE'
  },
  view: {
    id: 'SavedSearchesTable.view',
    defaultMessage: 'VIEW'
  },
});

class SavedSearchesTable extends Component {
  sortData = (clickedColumn) => () => {
    this.props.searchActions.sortSavedSearches(clickedColumn);
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
      sortColumnSaved,
      sortDirectionSaved,
      savedSearches
    } = this.props.search;

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell key="date" sorted={sortColumnSaved === 'date' ? sortDirectionSaved : null} onClick={this.sortData('date')}>
                  {formatMessage(messages.date)}
                </TableHeaderCell>
                <TableHeaderCell key="search" sorted={sortColumnSaved === 'search' ? sortDirectionSaved : null} onClick={this.sortData('search')}>
                  {formatMessage(messages.search)}
                </TableHeaderCell>
                <TableHeaderCell key="filters" sorted={sortColumnSaved === 'filters' ? sortDirectionSaved : null} onClick={this.sortData('filters')}>
                  {formatMessage(messages.parameters)}
                </TableHeaderCell>
                <TableHeaderCell key="actions" sorted={sortColumnSaved === 'actions' ? sortDirectionSaved : null} onClick={this.sortData('actions')} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedSearches.map(row =>
                (
                  <TableRow key={hash(row)}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell><a>{row.search}</a></TableCell>
                    <TableCell>{this.renderFilters(row.filters)}</TableCell>
                    <TableCell className="actions">
                      <Button content={formatMessage(messages.delete)} className="button--blue-text save-btn" />
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

SavedSearchesTable.propTypes = {
  searchActions: PropTypes.shape({
    sortSavedSearches: PropTypes.func,
  }),
  search: PropTypes.shape({
    sortColumnSaved: PropTypes.string,
    sortDirectionSaved: PropTypes.string,
    savedSearches: PropTypes.array,
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

SavedSearchesTable.defaultProps = {
  searchActions: {},
  search: {},
  tableProps: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    searchActions: bindActionCreators({
      sortSavedSearches
    }, dispatch)
  })
)(injectIntl(SavedSearchesTable));
