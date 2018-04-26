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
  Input,
  Icon,
  Image,
  Loader
} from 'semantic-ui-react';
import { debounce } from 'lodash';

import Pagination from '../../../../../../components/Pagination/Pagination';
import ProcessorsTable from '../ProcessorsTable/ProcessorsTable';
import {
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop,
  getTopProcessors,
} from '../../../../../../services/processors/processorsTopActions';


class TopProcessors extends Component {

  constructor(props) {
    super(props);
    this.handleFilterChange = debounce(this.handleFilterChange.bind(this), 200);
  }

  componentDidMount() {
    this.props.processorsTopActions.getTopProcessors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processorsTop.topProcessors.length && !this.props.processorsTop.topProcessors.length) {
      this.props.processorsTopActions.setPaginationTop(this.props.rowsPerPage);
    }
  }

  handleFilterChange(e, data) {
    this.props.processorsTopActions.filterDataTop(data.value);
  };

  sortData = (clickedColumn) => () => {
    this.props.processorsTopActions.sortDataTop(clickedColumn);
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.processorsTopActions.setActivePageTop(activePage);
  };

  render() {
    const {
      activePageTop,
      sortDirectionTop,
      totalPagesTop,
      sortColumnTop,
      topProcessorsFiltered,
      loading
    } = this.props.processorsTop;

    return (
      <div className="data-table">
        <div className="top-detail">
          <Input
            icon={<Icon name="filter" />}
            iconPosition="left"
            placeholder="Filter"
            className="filter-input"
            onChange={this.handleFilterChange}
          />
          <div className="pagination-container">
            <Pagination
              activePage={activePageTop}
              onPageChange={this.handlePaginationChange}
              totalPages={totalPagesTop}
            />
          </div>
        </div>
        <div className="table-container">
          {loading ? <Loader active inline="centered"/> :
            <ProcessorsTable
              tableProps={this.props.tableProps}
              sortColumn={sortColumnTop}
              sortDirection={sortDirectionTop}
              sortData={this.sortData}
              data={topProcessorsFiltered}
            />
          }
        </div>
      </div>
    );
  }
}

TopProcessors.propTypes = {
  processorsTopActions: PropTypes.shape({
    sortDataTop: PropTypes.func,
    filterDataTop: PropTypes.func,
    setActivePageTop: PropTypes.func,
    setPaginationTop: PropTypes.func,
    getTopProcessors: PropTypes.func,
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  }),
  processorsTop: PropTypes.shape({
    activePageTop: PropTypes.number,
    topProcessorsFiltered: PropTypes.array,
    topProcessors: PropTypes.array,
    sortColumnTop: PropTypes.string,
    sortDirectionTop: PropTypes.string,
    totalPagesTop: PropTypes.number,
  }),
  rowsPerPage: PropTypes.number,
};

TopProcessors.defaultProps = {
  processorsTopActions: {},
  processorsTop: {
    activePageTop: 1,
    topProcessorsFiltered: [],
    topProcessors: [],
    sortColumnTop: 'rank',
    sortDirectionTop: 'descending',
    totalPagesTop: 1,
  },
  tableProps: {},
  rowsPerPage: 5,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    processorsTopActions: bindActionCreators({
      sortDataTop,
      filterDataTop,
      setActivePageTop,
      setPaginationTop,
      getTopProcessors
    }, dispatch),
  }),
)(TopProcessors);
