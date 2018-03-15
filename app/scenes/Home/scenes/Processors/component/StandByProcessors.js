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
  Pagination,
  Input,
  Icon,
  Image,
} from 'semantic-ui-react';

import {
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  getStandbyProcessors,
} from '../../../../../services/processors/processorsStandbyActions';

import DislikeIcon from '../../../images/btn-dislike.svg';
import LikeIcon from '../../../images/btn-like.svg';
import DotsIcon from '../../../images/btn-meehh.svg';

const iconSize = 18;

const standbyProcessors = [
  {
    rank: 2,
    name: 'blockchain2000',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: true,
  },
  {
    rank: 1,
    name: 'mrs_miner',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: false,
  },
  {
    rank: 3,
    name: 'doe.moe',
    approval: '<0.01%',
    reliability: '78.00%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: null,
  },
  {
    rank: 4,
    name: 'john48',
    approval: '<0.01%',
    reliability: '11.20%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 5,
    name: 'alexprocessor',
    approval: '<0.01%',
    reliability: '11.20%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 6,
    name: 'zord-12',
    approval: '<0.01%',
    reliability: '86.01%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 7,
    name: 'cross120',
    approval: '<0.01%',
    reliability: '12.51%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 8,
    name: 'david324',
    approval: '<0.01%',
    reliability: '3.20%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 9,
    name: 'deep-blue',
    approval: '<0.01%',
    reliability: '98.5%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 10,
    name: 'gray-2423',
    approval: '<0.01%',
    reliability: '34.40%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 11,
    name: 'homer34',
    approval: '<0.01%',
    reliability: '28.5%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 12,
    name: 'smith-24',
    approval: '<0.01%',
    reliability: '44.40%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
];

class StandByProcessors extends Component {
  static renderVoteValue(approve) {
    const vote = approve ? LikeIcon : DislikeIcon;
    return (
      <div className="votes voted">
        <span>Voted </span>
        <Image src={vote} width={iconSize} height={iconSize} />
      </div>
    );
  }

  static renderVote() {
    return (
      <div className="votes">
        <Image src={LikeIcon} width={iconSize} height={iconSize} />
        <Image src={DotsIcon} width={iconSize} height={iconSize} />
        <Image src={DislikeIcon} width={iconSize} height={iconSize} />
      </div>
    );
  }

  static renderApprove(approve) {
    if (approve !== null && approve !== '') {
      return StandByProcessors.renderVoteValue(approve);
    }
    return StandByProcessors.renderVote();
  }

  componentDidMount() {
    this.props.processorsStandbyActions.getStandbyProcessors(standbyProcessors);
    this.props.processorsStandbyActions.setPaginationStandBy(this.props.rowsPerPage);
  }

  handleFilterChange = (e) => {
    const { value } = e.target;
    this.props.processorsStandbyActions.filterDataStandBy(value);
  };

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
      standbyProcessorsFiltered
    } = this.props.processorsStandby;

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
              activePage={activePageStandBy}
              boundaryRange={1}
              onPageChange={this.handlePaginationChange}
              size="mini"
              siblingRange={1}
              totalPages={totalPagesStandBy}
              // Heads up! All items are powered by shorthands,
              // if you want to hide one of them, just pass `null` as value
              firstItem={{ ariaLabel: 'First item', content: '<< First' }}
              lastItem={{ ariaLabel: 'Last item', content: 'Last >>' }}
              prevItem={{ ariaLabel: 'Previous item', content: '< Prev' }}
              nextItem={{ ariaLabel: 'Next item', content: 'Next >' }}
            />
          </div>
        </div>
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell key="rank" sorted={sortColumnStandBy === 'rank' ? sortDirectionStandBy : null} onClick={this.sortData('rank')}>
                  Rank
                </TableHeaderCell>
                <TableHeaderCell key="name" sorted={sortColumnStandBy === 'name' ? sortDirectionStandBy : null} onClick={this.sortData('name')}>
                  Name
                </TableHeaderCell>
                <TableHeaderCell key="approval" sorted={sortColumnStandBy === 'approval' ? sortDirectionStandBy : null} onClick={this.sortData('approval')}>
                  Approval
                </TableHeaderCell>
                <TableHeaderCell key="reliability" sorted={sortColumnStandBy === 'reliability' ? sortDirectionStandBy : null} onClick={this.sortData('reliability')}>
                  Reliability
                </TableHeaderCell>
                <TableHeaderCell key="reputation" sorted={sortColumnStandBy === 'reputation' ? sortDirectionStandBy : null} onClick={this.sortData('reputation')}>
                  Reputation
                </TableHeaderCell>
                <TableHeaderCell key="referralScore" sorted={sortColumnStandBy === 'referralScore' ? sortDirectionStandBy : null} onClick={this.sortData('referralScore')}>
                  Referral Score
                </TableHeaderCell>
                <TableHeaderCell key="publisherScore" sorted={sortColumnStandBy === 'publisherScore' ? sortDirectionStandBy : null} onClick={this.sortData('publisherScore')}>
                  Publisher Score
                </TableHeaderCell>
                <TableHeaderCell key="netScore" sorted={sortColumnStandBy === 'netScore' ? sortDirectionStandBy : null} onClick={this.sortData('netScore')}>
                  Net Score
                </TableHeaderCell>
                <TableHeaderCell key="approve" sorted={sortColumnStandBy === 'approve' ? sortDirectionStandBy : null} onClick={this.sortData('approve')}>
                  Approve
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standbyProcessorsFiltered.map(row =>
                (
                  <TableRow key={hash(row)}>
                    <TableCell>{row.rank}</TableCell>
                    <TableCell><a>{row.name}</a></TableCell>
                    <TableCell>{row.approval}</TableCell>
                    <TableCell>{row.reliability}</TableCell>
                    <TableCell>{row.reputation}</TableCell>
                    <TableCell>{row.referralScore}</TableCell>
                    <TableCell>{row.publisherScore}</TableCell>
                    <TableCell>{row.netScore}</TableCell>
                    <TableCell>
                      {StandByProcessors.renderApprove(row.approve)}
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

StandByProcessors.propTypes = {
  processorsStandbyActions: PropTypes.shape({
    getStandbyProcessors: PropTypes.func,
    setActivePageStandBy: PropTypes.func,
    setPaginationStandBy: PropTypes.func,
    filterDataStandBy: PropTypes.func,
    sortDataStandBy: PropTypes.func,
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  }),
  processorsStandby: PropTypes.shape({
    activePageStandBy: 1,
    standbyProcessorsFiltered: [],
    sortDirectionStandBy: 'descending',
    sortColumnStandBy: 'rank',
    totalPagesStandBy: 1,
    rowsPerPageStandBy: 10,
  }),
  rowsPerPage: PropTypes.number,
};

StandByProcessors.defaultProps = {
  processorsStandbyActions: {},
  processorsStandby: {},
  tableProps: {},
  rowsPerPage: 5,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    processorsStandbyActions: bindActionCreators({
      sortDataStandBy,
      filterDataStandBy,
      setActivePageStandBy,
      setPaginationStandBy,
      getStandbyProcessors
    }, dispatch),
  }),
)(StandByProcessors);
