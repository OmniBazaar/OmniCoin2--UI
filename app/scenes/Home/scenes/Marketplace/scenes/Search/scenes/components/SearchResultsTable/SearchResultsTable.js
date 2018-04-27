import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Icon
} from 'semantic-ui-react';
import hash from 'object-hash';

import Pagination from '../../../../../../../../../components/Pagination/Pagination';

import {
  setPaginationSearchResults,
  setActivePageSearchResults,
  sortSearchResultsBy
} from '../../../../../../../../../services/search/searchActions';

import { numberWithCommas } from '../../../../../../../../../utils/numeric';

const iconSizeSmall = 12;

class SearchResultsTable extends Component {
  componentDidMount() {
    this.props.searchActions.sortSearchResultsBy(this.props.sortBy, this.props.sortDirection);
    this.props.searchActions.setPaginationSearchResults(this.props.rowsPerPage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sortBy !== nextProps.sortBy ||
      this.props.sortDirection !== nextProps.sortDirection) {
      this.props.searchActions.sortSearchResultsBy(nextProps.sortBy, nextProps.sortDirection);
      this.props.searchActions.setPaginationSearchResults(this.props.rowsPerPage);
    }
  }

  handlePaginationChange = (e, { activePage }) => {
    this.props.searchActions.setActivePageSearchResults(activePage);
  };

  render() {
    const {
      activePageSearchResults,
      totalPagesSearchResults,
      searchResultsFiltered
    } = this.props.search;
    const rows = _.chunk(searchResultsFiltered, 6);

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
              activePage={activePageSearchResults}
              onPageChange={this.handlePaginationChange}
              totalPages={totalPagesSearchResults}
            />
          </div>
        </div>
      </div>
    );
  }
}

SearchResultsTable.propTypes = {
  searchActions: PropTypes.shape({
    setActivePageSearchResults: PropTypes.func,
    setPaginationSearchResults: PropTypes.func,
    sortSearchResultsBy: PropTypes.func,
  }),
  search: PropTypes.shape({
    activePageSearchResults: PropTypes.number,
    totalPagesSearchResults: PropTypes.number,
    searchResultsFiltered: PropTypes.array,
  }),
  searchResults: PropTypes.arrayOf(PropTypes.object),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    size: PropTypes.string
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  rowsPerPage: PropTypes.number,
};

SearchResultsTable.defaultProps = {
  searchActions: {},
  search: {},
  searchResults: [],
  tableProps: {},
  intl: {},
  sortBy: '',
  sortDirection: '',
  rowsPerPage: 0,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    searchActions: bindActionCreators({
      setActivePageSearchResults,
      setPaginationSearchResults,
      sortSearchResultsBy
    }, dispatch),
  }),
)(injectIntl(SearchResultsTable));
