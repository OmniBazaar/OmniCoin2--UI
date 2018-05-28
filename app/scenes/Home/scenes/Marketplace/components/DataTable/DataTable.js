import React, { Component } from 'react';
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
import { toastr } from 'react-redux-toastr';
import { defineMessages, injectIntl } from 'react-intl';


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
    id: 'DataTable.category',
    defaultMessage: 'Category'
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
  error: {
    id: 'DataTable.error',
    defaultMessage: 'Error'
  },
  success: {
    id: 'DataTable.success',
    defaultMessage: 'Success'
  },
  successSave: {
    id: 'DataTable.successSave',
    defaultMessage: 'Successfully saved'
  },
  successDelete: {
    id: 'DataTable.successDelete',
    defaultMessage: 'Successfully deleted'
  }
});

class DataTable extends Component {
  state = {
    deletingSearch: null,
    savingSearch: null
  };

  componentDidMount() {
    this.sortData(this.props.sortBy);
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (!nextProps.saving && this.props.saving) {
      if (this.props.error) {
        toastr.error(formatMessage(messages.error), this.props.error);
      } else {
        toastr.success(formatMessage(messages.success), formatMessage(messages.successSave));
      }
      this.setState({
        savingSearch: null
      });
    }
    if (!nextProps.deleting && this.props.deleting) {
      if (this.props.error) {
        toastr.error(formatMessage(messages.error), this.props.error);
      } else {
        toastr.success(formatMessage(messages.success), formatMessage(messages.successDelete));
      }
      this.setState({
        deletingSearch: null
      });
    }
  }

  sortData = (clickedColumn) => () => {
    const { sortDirection } = this.props;
    let direction = 'descending';
    if (sortDirection === 'descending') {
      direction = 'ascending';
    }
    this.props.sort(clickedColumn, direction);
  };

  handleSave = (row) => {
    this.props.onSave(row);
    this.setState({
      savingSearch: row
    });
  };

  handleDelete = (row) => {
    this.props.onDelete(row);
    this.setState({
      deletingSearch: row
    });
  };

  render() {
    const { formatMessage } = this.props.intl;
    const {
      showSaveButton,
      showDeleteButton,
      showViewButton
    } = this.props;

    const {
      sortBy,
      sortDirection,
      data,
      onView,
      onSearch
    } = this.props;


    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell key="date" sorted={sortBy === 'date' ? sortDirection : null} onClick={this.sortData('date')}>
                  {formatMessage(messages.date)}
                </TableHeaderCell>
                <TableHeaderCell key="search" sorted={sortBy === 'searchTerm' ? sortDirection : null} onClick={this.sortData('searchTerm')}>
                  {formatMessage(messages.search)}
                </TableHeaderCell>
                <TableHeaderCell key="filters" sorted={sortBy === 'category' ? sortDirection : null} onClick={this.sortData('category')}>
                  {formatMessage(messages.parameters)}
                </TableHeaderCell>
                <TableHeaderCell key="actions" onClick={this.sortData('actions')} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(row =>
                (
                  <TableRow key={hash(row)}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <a onClick={() => onSearch(row.searchTerm, '')}>
                        {row.searchTerm}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a onClick={() => onSearch('', row.category)}>
                        {row.category}
                      </a>
                    </TableCell>
                    <TableCell className="actions">
                      {
                        showSaveButton &&
                          <Button
                            content={formatMessage(messages.save)}
                            className="button--blue-text save-btn"
                            onClick={() => this.handleSave(row)}
                            loading={this.state.deletingSearch && this.state.deletingSearch.id === row.id}
                            disabled={row.saved}
                          />
                      }
                      {
                        showDeleteButton &&
                          <Button
                            content={formatMessage(messages.delete)}
                            className="button--blue-text save-btn"
                            onClick={() => this.handleDelete(row)}
                            loading={this.state.savingSearch && this.state.savingSearch.id === row.id}
                          />
                      }
                      {
                        showViewButton &&
                          <Button
                            content={formatMessage(messages.view)}
                            className="button--blue-text view-btn"
                            onClick={() => onView(row)}
                          />
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
  sort: PropTypes.func,
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
  showSaveButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  showViewButton: PropTypes.bool,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onSearch: PropTypes.func,
  saving: PropTypes.bool,
  deleting: PropTypes.bool,
};

DataTable.defaultProps = {
  sortBy: '',
  sortDirection: '',
  sort: () => {},
  tableProps: {
    sortable: true,
    compact: true,
    basic: 'very',
    striped: true,
    size: 'small'
  },
  intl: {},
  data: [],
  showSaveButton: false,
  showDeleteButton: false,
  showViewButton: false,
  saving: false,
  deleting: false,
  onSave: () => {},
  onView: () => {},
  onDelete: () => {},
  onSearch: () => {}
};

export default injectIntl(DataTable);
