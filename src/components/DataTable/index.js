import React, { Component } from 'react';
import * as hash from 'object-hash';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Pagination,
} from 'semantic-ui-react';
import './datatable.scss';

export default class DataTable extends Component {

  constructor(props) {
    super(props);

    const rowsPerPage = props.rowsPerPage || 5;
    const numberOfPages = Math.ceil(props.data.length / rowsPerPage);
    const columns = props.columnHeader || Object.keys(props.data[0] || []);
    const columnHeader = props.columnHeader || [];
    const activePage = 1;

    this.state = {
      activePage,
      rowsPerPage,
      numberOfPages,
      columns,
      column: null,
      direction: null,
      data: [],
      currentData: [],
      columnHeader,
    };
  }

  componentWillReceiveProps(nextProps) {
    const rowsPerPage = nextProps.rowsPerPage || 5;
    const numberOfPages = Math.ceil(nextProps.data.length / rowsPerPage);
    const data = nextProps.data;
    const activePage = 1;
    const currentData = this.handleSlice(data, activePage, rowsPerPage);

    this.setState({
      activePage,
      rowsPerPage,
      data,
      currentData,
      numberOfPages,
      column: null,
    });
  }

  handleSlice(data, activePage, rowsPerPage) {
    //slice current data set (more filters could be added, and also sorting)
    return data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
  }

  handlePaginationChange = (e, { activePage }) => {
    const { rowsPerPage, data, column } = this.state;
    const currentData = this.handleSlice(data, activePage, rowsPerPage);

    this.setState({
      currentData,
      activePage
    }, function () {
      if (column)
        this.sortData(column, true);
    });
  };

  sortData(clickedColumn, keepDirection) {
    const { column, currentData, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        currentData: _.sortBy(currentData, [clickedColumn]).reverse(),
        direction: 'ascending',
      });

      return;
    }

    let sortCurrentData = _.sortBy(currentData, [clickedColumn]);
    let newDirection = null;
    if (keepDirection === true) {
      newDirection = direction;
    } else {
      newDirection = direction === 'ascending' ? 'descending' : 'ascending'
    }

    this.setState({
      currentData: newDirection === 'ascending' ? sortCurrentData.reverse() : sortCurrentData,
      direction: newDirection,
    });
  }

  handleSort = (clickedColumn, keepDirection) => () => {
    this.sortData(clickedColumn, keepDirection);
  };

  render() {
    const { activePage, numberOfPages, columns, currentData, columnHeader } = this.state;
    const { column, direction } = this.state;

    let showEllipsis = true;
    let showFirstAndLastNav = true;
    let showPreviousAndNextNav = true;

    return (
      <div>
        <Pagination
          activePage={activePage}
          boundaryRange={3}
          onPageChange={this.handlePaginationChange}
          size='mini'
          siblingRange={1}
          totalPages={numberOfPages}
          // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
          ellipsisItem={showEllipsis ? undefined : null}
          firstItem={showFirstAndLastNav ? undefined : null}
          lastItem={showFirstAndLastNav ? undefined : null}
          prevItem={showPreviousAndNextNav ? undefined : null}
          nextItem={showPreviousAndNextNav ? undefined : null}
        />
        <Table {...this.props.tableProps}>
          {this.props.header &&
          <TableHeader>
            <TableRow>
              {columnHeader.map(object => {
                let key = Object.keys(object)[0];
                let value = Object.values(object)[0];
                return (
                  <TableHeaderCell key={key} sorted={column === key ? direction : null} onClick={this.handleSort(key, false)}>
                    {value}
                  </TableHeaderCell>
                );
              }
              )}
            </TableRow>
          </TableHeader>
          }
          <TableBody>
            {currentData.map(row =>
              <TableRow key={hash(row)}>
                {columns.map((object) => {
                  let key = Object.keys(object)[0];
                  return (
                    <TableCell
                      key={hash({ ...row, key })}
                      content={row[key]}
                    />
                  );}
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

DataTable.propTypes = {
  tableProps: PropTypes.object,
  columnHeader: PropTypes.array,
  columnHeaderLabel: PropTypes.array,
};
