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
  sortDataTop,
  filterDataTop,
  setActivePageTop,
  setPaginationTop,
  getTopProcessors,
} from  '../../../../../services/processors/processorsTopActions';

const topProcessors = [
  {
    rank: 1,
    name: 'top-processor-1 test',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: true,
  },
  {
    rank: 2,
    name: 'top-processor-2 test',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: null,
  },
  {
    rank: 3,
    name: 'top-processor-3 test',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 4,
    name: 'top-processor-4',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: null,
  },
  {
    rank: 5,
    name: 'top-processor-5',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
  {
    rank: 6,
    name: 'top-processor-6',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: null,
  },
  {
    rank: 7,
    name: 'top-processor-7',
    approval: '<0.01%',
    reliability: '56.55%',
    reputation: '???',
    referralScore: '???',
    publisherScore: '???',
    netScore: '???',
    approve: '',
  },
];

class TopProcessors extends Component {

  componentDidMount() {
    this.props.processorsTopActions.getTopProcessors(topProcessors);
    this.props.processorsTopActions.setPaginationTop(this.props.rowsPerPage);
  }

  handleFilterChange = (e) => {
    const { value } = e.target;
    this.props.processorsTopActions.filterDataTop(value);
  };

  sortData = (clickedColumn) => () => {
    this.props.processorsTopActions.sortDataTop(clickedColumn);
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.processorsTopActions.setActivePageTop(activePage);
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
    const { activePageTop, sortDirectionTop, totalPagesTop, sortColumnTop, topProcessorsFiltered } = this.props.processorsTop;

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
              activePage={activePageTop}
              boundaryRange={1}
              onPageChange={this.handlePaginationChange}
              size='mini'
              siblingRange={1}
              totalPages={totalPagesTop}
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
                <TableHeaderCell key={'rank'} sorted={sortColumnTop === 'rank' ? sortDirectionTop : null} onClick={this.sortData('rank')}>
                  Rank
                </TableHeaderCell>
                <TableHeaderCell key={'name'} sorted={sortColumnTop === 'name' ? sortDirectionTop : null} onClick={this.sortData('name')}>
                  Name
                </TableHeaderCell>
                <TableHeaderCell key={'approval'} sorted={sortColumnTop === 'approval' ? sortDirectionTop : null} onClick={this.sortData('approval')}>
                  Approval
                </TableHeaderCell>
                <TableHeaderCell key={'reliability'} sorted={sortColumnTop === 'reliability' ? sortDirectionTop : null} onClick={this.sortData('reliability')}>
                  Reliability
                </TableHeaderCell>
                <TableHeaderCell key={'reputation'} sorted={sortColumnTop === 'reputation' ? sortDirectionTop : null} onClick={this.sortData('reputation')}>
                  Reputation
                </TableHeaderCell>
                <TableHeaderCell key={'referralScore'} sorted={sortColumnTop === 'referralScore' ? sortDirectionTop : null} onClick={this.sortData('referralScore')}>
                  Referral Score
                </TableHeaderCell>
                <TableHeaderCell key={'publisherScore'} sorted={sortColumnTop === 'publisherScore' ? sortDirectionTop : null} onClick={this.sortData('publisherScore')}>
                  Publisher Score
                </TableHeaderCell>
                <TableHeaderCell key={'netScore'} sorted={sortColumnTop === 'netScore' ? sortDirectionTop : null} onClick={this.sortData('netScore')}>
                  Net Score
                </TableHeaderCell>
                <TableHeaderCell key={'approve'} sorted={sortColumnTop === 'approve' ? sortDirectionTop : null} onClick={this.sortData('approve')}>
                  Approve
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProcessorsFiltered.map(row =>
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
    processorsTopActions: bindActionCreators({ sortDataTop, filterDataTop, setActivePageTop, setPaginationTop, getTopProcessors }, dispatch),
  }),
)(TopProcessors);
