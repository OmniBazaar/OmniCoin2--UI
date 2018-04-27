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

import { sortDataTableBy } from '../../../../../../services/marketplace/marketplaceActions';

const messages = defineMessages({
  default: {
    id: 'DataTable.default',
    defaultMessage: 'Default'
  },
  date: {
    id: 'DataTable.date',
    defaultMessage: 'Date'
  },
  search: {
    id: 'DataTable.search',
    defaultMessage: 'Search'
  },
  parameters: {
    id: 'DataTable.parameters',
    defaultMessage: 'Parameters'
  },
  save: {
    id: 'DataTable.save',
    defaultMessage: 'SAVE'
  },
  delete: {
    id: 'DataTable.delete',
    defaultMessage: 'DELETE'
  },
  view: {
    id: 'DataTable.view',
    defaultMessage: 'VIEW'
  },
});

class DataTable extends Component {
  componentDidMount() {
    this.props.dataTableActions.sortDataTableBy(this.props.data, this.props.sortBy);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data ||
      this.props.sortBy !== nextProps.sortBy ||
      this.props.sortDirection !== nextProps.sortDirection) {
      this.props.dataTableActions.sortDataTableBy(nextProps.data, nextProps.sortBy);
    }
  }

  sortData = (clickedColumn) => () => {
    this.props.dataTableActions.sortDataTableBy(this.props.data, clickedColumn);
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
      showSaveButton,
      showDeleteButton,
      showViewButton
    } = this.props;
    const {
      sortTableBy,
      sortTableDirection,
      dataTableData
    } = this.props.marketplace;

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell key="date" sorted={sortTableBy === 'date' ? sortTableDirection : null} onClick={this.sortData('date')}>
                  {formatMessage(messages.date)}
                </TableHeaderCell>
                <TableHeaderCell key="search" sorted={sortTableBy === 'search' ? sortTableDirection : null} onClick={this.sortData('search')}>
                  {formatMessage(messages.search)}
                </TableHeaderCell>
                <TableHeaderCell key="filters" sorted={sortTableBy === 'filters' ? sortTableDirection : null} onClick={this.sortData('filters')}>
                  {formatMessage(messages.parameters)}
                </TableHeaderCell>
                <TableHeaderCell key="actions" sorted={sortTableBy === 'actions' ? sortTableDirection : null} onClick={this.sortData('actions')} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataTableData.map(row =>
                (
                  <TableRow key={hash(row)}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell><a>{row.search}</a></TableCell>
                    <TableCell>{this.renderFilters(row.filters)}</TableCell>
                    <TableCell className="actions">
                      {
                        showSaveButton ?
                          <Button content={formatMessage(messages.save)} className="button--blue-text save-btn" />
                        : null
                      }
                      {
                        showDeleteButton ?
                          <Button content={formatMessage(messages.delete)} className="button--blue-text save-btn" />
                        : null
                      }
                      {
                        showViewButton ?
                          <Button content={formatMessage(messages.view)} className="button--blue-text view-btn" />
                        : null
                      }
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

DataTable.propTypes = {
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  dataTableActions: PropTypes.shape({
    sortDataTableBy: PropTypes.func,
  }),
  marketplace: PropTypes.shape({
    sortTableBy: PropTypes.string,
    sortTableDirection: PropTypes.string,
    dataTableData: PropTypes.array,
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
  data: PropTypes.arrayOf(PropTypes.object),
};

DataTable.defaultProps = {
  dataTableActions: {},
  marketplace: {},
  tableProps: {},
  intl: {},
  data: [],
  sortBy: '',
  sortDirection: '',
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    dataTableActions: bindActionCreators({
      sortDataTableBy
    }, dispatch)
  })
)(injectIntl(DataTable));
