import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Icon,
  Button
} from 'semantic-ui-react';
import hash from 'object-hash';

import Pagination from '../../../../../../components/Pagination/Pagination';

import {
  setPaginationGridTable,
  setActivePageGridTable,
  sortGridTableBy
} from '../../../../../../services/marketplace/marketplaceActions';

import { numberWithCommas } from '../../../../../../utils/numeric';

const iconSizeSmall = 12;

const messages = defineMessages({
  edit: {
    id: 'GridTable.edit',
    defaultMessage: 'EDIT'
  },
  delete: {
    id: 'GridTable.delete',
    defaultMessage: 'DELETE'
  },
});


class GridTable extends Component {
  componentDidMount() {
    this.props.gridTableActions.sortGridTableBy(
      this.props.data,
      this.props.sortBy,
      this.props.sortDirection
    );
    this.props.gridTableActions.setPaginationGridTable(this.props.rowsPerPage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data ||
        this.props.sortBy !== nextProps.sortBy ||
        this.props.sortDirection !== nextProps.sortDirection) {
      this.props.gridTableActions.sortGridTableBy(
        nextProps.data,
        nextProps.sortBy,
        nextProps.sortDirection
      );
      this.props.gridTableActions.setPaginationGridTable(this.props.rowsPerPage);
    }
  }

  onClickItem = () => {
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.gridTableActions.setActivePageGridTable(activePage);
  };

  render() {
    const {
      activePageGridTable,
      totalPagesGridTable,
      gridTableDataFiltered
    } = this.props.marketplace;
    const rows = _.chunk(gridTableDataFiltered, 6);
    const { formatMessage } = this.props.intl;

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableBody>
              {rows.map(row =>
                (
                  <TableRow key={hash(row)} className="items">
                    {row.map(item => {
                      const style = { backgroundImage: `url(${item.image})` };
                      let { description } = item;
                      description = description.length > 55 ? `${description.substring(0, 55)}...` : description;
                      return (
                        <TableCell className="item" key={hash(item)}>
                          <div
                            className="img-wrapper"
                            style={style}
                            onClick={() => this.onClickItem(item)}
                            onKeyDown={this.onClickItem}
                            tabIndex={0}
                            role="link"
                          />
                          <span
                            className="title"
                            onClick={() => this.onClickItem(item)}
                            role="link"
                            onKeyDown={() => this.onClickItem(item)}
                            tabIndex={0}
                          >
                            {item.title}
                          </span>
                          <span className="subtitle">
                            {item.category}
                            <span>
                              <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                            </span>
                            {item.subCategory}
                          </span>
                          <span className="description">{description}</span>
                          <span className="price">$ {numberWithCommas(item.price)}</span>
                          {this.props.showActions ?
                            <div className="actions">
                              <Button content={formatMessage(messages.edit)} className="button--blue" />
                              <Button content={formatMessage(messages.delete)} className="button--gray-text" />
                            </div>
                            : null
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="top-detail bottom">
          <div className="pagination-container">
            <Pagination
              activePage={activePageGridTable}
              onPageChange={this.handlePaginationChange}
              totalPages={totalPagesGridTable}
            />
          </div>
        </div>
      </div>
    );
  }
}

GridTable.propTypes = {
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  rowsPerPage: PropTypes.number,
  showActions: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.object),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    size: PropTypes.string
  }),
  marketplace: PropTypes.shape({
    activePageGridTable: PropTypes.number,
    totalPagesGridTable: PropTypes.number,
    gridTableDataFiltered: PropTypes.array
  }),
  gridTableActions: PropTypes.shape({
    setPaginationGridTable: PropTypes.func,
    setActivePageGridTable: PropTypes.func,
    sortGridTableBy: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

GridTable.defaultProps = {
  intl: {},
  marketplace: {},
  tableProps: {},
  data: [],
  rowsPerPage: 3 * 6,
  showActions: false,
  sortBy: '',
  sortDirection: '',
  gridTableActions: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    gridTableActions: bindActionCreators({
      setPaginationGridTable,
      setActivePageGridTable,
      sortGridTableBy
    }, dispatch),
  }),
)(injectIntl(GridTable));
