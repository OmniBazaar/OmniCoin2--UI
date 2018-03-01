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
      columnHeader,
    };
  }

  componentWillReceiveProps(nextProps) {
    const rowsPerPage = nextProps.rowsPerPage || 5;
    const numberOfPages = Math.ceil(nextProps.data.length / rowsPerPage);
    const data = nextProps.data;

    this.setState({
      activePage: 1,
      rowsPerPage,
      data,
      numberOfPages
    });
  }

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  render() {
    const { activePage, rowsPerPage, numberOfPages, columns, data, columnHeader } = this.state;
    const { column, direction } = this.state;

    //slice current data set (more filters could be added, and also sorting)
    const currentData = data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);

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
                  <TableHeaderCell key={key} sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
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
