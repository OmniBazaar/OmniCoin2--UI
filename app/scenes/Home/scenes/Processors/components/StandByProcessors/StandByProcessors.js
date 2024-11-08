import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  Input,
  Icon,
  Loader
} from 'semantic-ui-react';
import { debounce } from 'lodash';

import ProcessorsTable from '../ProcessorsTable/ProcessorsTable';
import Pagination from '../../../../../../components/Pagination/Pagination';
import {
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  getStandbyProcessors,
  toggleProcessorStandBy,
  commitProcessorsStandBy,
  rollbackProcessorsStandBy
} from '../../../../../../services/processors/processorsStandbyActions';
import VoteButtons from '../VoteButtons/VoteButtons';


class StandByProcessors extends Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = debounce(this.handleFilterChange.bind(this), 200);
  }

  componentDidMount() {
    this.props.processorsStandbyActions.getStandbyProcessors();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.processorsStandby.standbyProcessors.length && !this.props.processorsStandby.standbyProcessors.length) {
      this.props.processorsStandbyActions.setPaginationStandBy(this.props.rowsPerPage);
    }
  }

  handleFilterChange(e, data) {
    this.props.processorsStandbyActions.filterDataStandBy(data.value);
  }

  sortData = (clickedColumn) => () => {
    this.props.processorsStandbyActions.sortDataStandBy(clickedColumn);
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.processorsStandbyActions.setActivePageStandBy(activePage);
  };

  render() {
    const {
      activePageStandBy,
      sortDirectionStandBy,
      totalPagesStandBy,
      sortColumnStandBy,
      standbyProcessorsFiltered,
      loading,
      toggledProcessors,
      voting,
    } = this.props.processorsStandby;

    const {
      toggleProcessorStandBy,
      commitProcessorsStandBy,
      rollbackProcessorsStandBy
    } = this.props.processorsStandbyActions;


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
          <Pagination
            activePage={activePageStandBy}
            onPageChange={this.handlePaginationChange}
            totalPages={totalPagesStandBy}
          />
          <VoteButtons
            onCancelClicked={() => rollbackProcessorsStandBy()}
            onVoteClicked={() => commitProcessorsStandBy()}
            disabled={!toggledProcessors.length}
            loading={voting}
          />
        </div>
        <div className="table-container">
          {loading ? <Loader active inline="centered" /> :
          <ProcessorsTable
            tableProps={this.props.tableProps}
            sortColumn={sortColumnStandBy}
            sortDirection={sortDirectionStandBy}
            sortData={this.sortData}
            data={standbyProcessorsFiltered}
            toggle={toggleProcessorStandBy}
          />
          }
        </div>
      </div>
    );
  }
}

StandByProcessors.propTypes = {
  processorsStandbyActions: PropTypes.shape({
    getStandbyProcessors: PropTypes.func,
    setActivePageStandBy: PropTypes.func,
    setPaginationStandBy: PropTypes.func,
    filterDataStandBy: PropTypes.func,
    sortDataStandBy: PropTypes.func,
    toggleProcessorStandBy: PropTypes.func,
    commitProcessorsStandBy: PropTypes.func,
    rollbackProcessorsStandBy: PropTypes.func
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  }),
  processorsStandby: PropTypes.shape({
    activePageStandBy: PropTypes.number,
    standbyProcessorsFiltered: PropTypes.array,
    standbyProcessors: PropTypes.array,
    sortDirectionStandBy: PropTypes.string,
    sortColumnStandBy: PropTypes.string,
    totalPagesStandBy: PropTypes.number,
    rowsPerPageStandBy: PropTypes.number,
    loading: PropTypes.bool,
    toggledProcessors: PropTypes.array,
    voting: PropTypes.bool,
  }),
  rowsPerPage: PropTypes.number,
};

StandByProcessors.defaultProps = {
  processorsStandbyActions: {},
  processorsStandby: {
    activePageStandBy: 1,
    standbyProcessorsFiltered: [],
    standbyProcessors: [],
    sortDirectionStandBy: 'descending',
    sortColumnStandBy: 'rank',
    totalPagesStandBy: 1,
    rowsPerPageStandBy: 10,
  },
  tableProps: {
    sortable: true,
    compact: true,
    basic: 'very',
    striped: true,
    size: 'small'
  },
  rowsPerPage: 20,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    processorsStandbyActions: bindActionCreators({
      sortDataStandBy,
      filterDataStandBy,
      setActivePageStandBy,
      setPaginationStandBy,
      getStandbyProcessors,
      toggleProcessorStandBy,
      commitProcessorsStandBy,
      rollbackProcessorsStandBy
    }, dispatch),
  }),
)(StandByProcessors);
