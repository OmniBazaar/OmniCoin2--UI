import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as hash from 'object-hash';
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
} from 'semantic-ui-react';

import {
  sortDataStandBy,
  filterDataStandBy,
  setActivePageStandBy,
  setPaginationStandBy,
  getStandbyProcessors,
} from  '../../../../../services/processors/processorsStandbyActions';

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
    approve: '',
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
    approve: '',
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
    approve: '',
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

  renderApprove(approve) {
    if (approve) {
      if (approve === true)
        return 'Voted true';
      else
        return 'Voted false';
    } else {
      return '...';
    }
  }

  render() {
    const { activePageStandBy, sortDirectionStandBy, totalPagesStandBy, sortColumnStandBy, standbyProcessorsFiltered } = this.props.processorsStandby;

    return (
      <div className='data-table'>
        <div className='top-detail'>
          <Input
            icon={<Icon name='filter' />}
            iconPosition='left'
            placeholder='Filter'
            className='filter-input'
            onChange={this.handleFilterChange}
          />
          <div className='pagination-container'>
            <Pagination
              activePage={activePageStandBy}
              boundaryRange={1}
              onPageChange={this.handlePaginationChange}
              size='mini'
              siblingRange={1}
              totalPages={totalPagesStandBy}
              // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
              firstItem={{ ariaLabel: 'First item', content: '<< First' }}
              lastItem={{ ariaLabel: 'Last item', content: 'Last >>' }}
              prevItem={{ ariaLabel: 'Previous item', content: '< Prev' }}
              nextItem={{ ariaLabel: 'Next item', content: 'Next >' }}
            />
          </div>
        </div>
        <div className='table-container'>
          <Table {...this.props.tableProps}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell key={'rank'} sorted={sortColumnStandBy === 'rank' ? sortDirectionStandBy : null} onClick={this.sortData('rank')}>
                  Rank
                </TableHeaderCell>
                <TableHeaderCell key={'name'} sorted={sortColumnStandBy === 'name' ? sortDirectionStandBy : null} onClick={this.sortData('name')}>
                  Name
                </TableHeaderCell>
                <TableHeaderCell key={'approval'} sorted={sortColumnStandBy === 'approval' ? sortDirectionStandBy : null} onClick={this.sortData('approval')}>
                  Approval
                </TableHeaderCell>
                <TableHeaderCell key={'reliability'} sorted={sortColumnStandBy === 'reliability' ? sortDirectionStandBy : null} onClick={this.sortData('reliability')}>
                  Reliability
                </TableHeaderCell>
                <TableHeaderCell key={'reputation'} sorted={sortColumnStandBy === 'reputation' ? sortDirectionStandBy : null} onClick={this.sortData('reputation')}>
                  Reputation
                </TableHeaderCell>
                <TableHeaderCell key={'referralScore'} sorted={sortColumnStandBy === 'referralScore' ? sortDirectionStandBy : null} onClick={this.sortData('referralScore')}>
                  Referral Score
                </TableHeaderCell>
                <TableHeaderCell key={'publisherScore'} sorted={sortColumnStandBy === 'publisherScore' ? sortDirectionStandBy : null} onClick={this.sortData('publisherScore')}>
                  Publisher Score
                </TableHeaderCell>
                <TableHeaderCell key={'netScore'} sorted={sortColumnStandBy === 'netScore' ? sortDirectionStandBy : null} onClick={this.sortData('netScore')}>
                  Net Score
                </TableHeaderCell>
                <TableHeaderCell key={'approve'} sorted={sortColumnStandBy === 'approve' ? sortDirectionStandBy : null} onClick={this.sortData('approve')}>
                  Approve
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standbyProcessorsFiltered.map(row =>
                <TableRow key={hash(row)}>
                  <TableCell>{row['rank']}</TableCell>
                  <TableCell>{row['name']}</TableCell>
                  <TableCell>{row['approval']}</TableCell>
                  <TableCell>{row['reliability']}</TableCell>
                  <TableCell>{row['reputation']}</TableCell>
                  <TableCell>{row['referralScore']}</TableCell>
                  <TableCell>{row['publisherScore']}</TableCell>
                  <TableCell>{row['netScore']}</TableCell>
                  <TableCell>
                    {this.renderApprove(row['approve'])}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return {...state.default}
  },
  (dispatch) => ({
    processorsStandbyActions: bindActionCreators({ sortDataStandBy, filterDataStandBy, setActivePageStandBy, setPaginationStandBy, getStandbyProcessors }, dispatch),
  }),
)(StandByProcessors);
