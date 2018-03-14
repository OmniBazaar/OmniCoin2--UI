import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
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
} from 'semantic-ui-react';
import hash from 'object-hash';
import _ from 'lodash';

import DislikeIcon from '../../../images/btn-dislike.svg';
import LikeIcon from '../../../images/btn-like.svg';
import DotsIcon from '../../../images/btn-meehh.svg';

const iconSize = 18;

const messages = defineMessages({
  currentVotes: {
    id: 'Settings.currentVotes',
    defaultMessage: 'Current Votes'
  },
  vote: {
    id: 'Settings.vote',
    defaultMessage: 'VOTE'
  },
  processor: {
    id: 'Settings.processor',
    defaultMessage: 'Processor'
  },
  votes: {
    id: 'Settings.votes',
    defaultMessage: 'Votes (XOM)'
  },
  approval: {
    id: 'Settings.approval',
    defaultMessage: 'Approval'
  },
  voted: {
    id: 'Settings.voted',
    defaultMessage: 'Voted'
  },
});

const currentVotes = [
  {
    id: 1,
    processor: 'delegate1',
    votes: 15,
    approve: true,
  },
  {
    id: 2,
    processor: 'delegate2',
    votes: 12,
    approve: false,
  },
  {
    id: 3,
    processor: 'delegate3',
    votes: 20,
    approve: null,
  },
];

class Vote extends Component {
  static renderVote() {
    return (
      <div className="votes">
        <Image src={LikeIcon} width={iconSize} height={iconSize} />
        <Image src={DotsIcon} width={iconSize} height={iconSize} />
        <Image src={DislikeIcon} width={iconSize} height={iconSize} />
      </div>
    );
  }

  static renderVoteValue(approve) {
    const vote = approve ? LikeIcon : DislikeIcon;
    return (
      <div className="votes voted">
        <span>Voted </span>
        <Image src={vote} width={iconSize} height={iconSize} />
      </div>
    );
  }

  static renderApprove(approve) {
    if (approve !== null && approve !== '') {
      return Vote.renderVoteValue(approve);
    }
    return Vote.renderVote();
  }

  sortData = (clickedColumn) => () => {
    // this.props.processorsTopActions.sortDataTop(clickedColumn);
  };

  render() {
    const { formatMessage } = this.props.intl;

    const {
      activePage,
      sortDirection,
      totalPages,
      sortColumn,
      recentTransactionsFiltered
    } = this.props.account;

    return (
      <div className="vote-container">
        <p className="title">{formatMessage(messages.currentVotes)}</p>
        <div className="data-table">
          <div className="top-detail">
            <Input
              icon={<Icon name="filter" />}
              iconPosition="left"
              placeholder="Filter"
              className="filter-input"
              onChange={this.handleFilterChange}
            />
          </div>
          <div className="table-container">
            <Table {...this.props.tableProps}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell key="processor" sorted={sortColumn === 'processor' ? sortDirection : null} onClick={this.sortData('processor')}>
                    {formatMessage(messages.processor)}
                  </TableHeaderCell>
                  <TableHeaderCell key="votes" sorted={sortColumn === 'votes' ? sortDirection : null} onClick={this.sortData('votes')}>
                    {formatMessage(messages.votes)}
                  </TableHeaderCell>
                  <TableHeaderCell key="approve" sorted={sortColumn === 'approve' ? sortDirection : null} onClick={this.sortData('approve')}>
                    {formatMessage(messages.approval)}
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentVotes.map(row =>
                  (
                    <TableRow key={hash(row)}>
                      <TableCell>{row.processor}</TableCell>
                      <TableCell>{row.votes}</TableCell>
                      <TableCell>
                        {Vote.renderApprove(row.approve)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ ...state.default }))(injectIntl(Vote));
