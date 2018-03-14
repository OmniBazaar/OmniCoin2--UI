import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Select,
  Image,
  Button
} from 'semantic-ui-react';
import hash from 'object-hash';

import DislikeIcon from '../../../images/btn-dislike.svg';
import LikeIcon from '../../../images/btn-like.svg';
import DotsIcon from '../../../images/btn-meehh.svg';

import {
  getVotes,
  sortVotesData
} from '../../../../../services/accountSettings/accountActions';

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

const voteOptions = [
  {
    key: 'all',
    value: 'all',
    text: 'All'
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

  static vote() {
    console.log('Vote');
  }

  constructor(props) {
    super(props);

    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    this.props.accountSettingsActions.getVotes(currentVotes);
  }

  sortData = (clickedColumn) => () => {
    this.props.accountSettingsActions.sortVotesData(clickedColumn);
  };

  render() {
    const { formatMessage } = this.props.intl;

    const {
      sortVoteDirection,
      sortVoteColumn,
      votesFiltered
    } = this.props.account;

    return (
      <div className="vote-container">
        <div className="data-table">
          <div className="top-detail">
            <p className="title">{formatMessage(messages.currentVotes)}</p>
            <div>
              <Select
                placeholder="Select"
                options={voteOptions}
                defaultValue="all"
              />
              <Button
                content={formatMessage(messages.vote)}
                className="vote button--primary"
                onClick={Vote.vote}
              />
            </div>
          </div>
          <div className="table-container">
            <Table {...this.props.tableProps}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell key="processor" sorted={sortVoteColumn === 'processor' ? sortVoteDirection : null} onClick={this.sortData('processor')}>
                    {formatMessage(messages.processor)}
                  </TableHeaderCell>
                  <TableHeaderCell key="votes" sorted={sortVoteColumn === 'votes' ? sortVoteDirection : null} onClick={this.sortData('votes')}>
                    {formatMessage(messages.votes)}
                  </TableHeaderCell>
                  <TableHeaderCell key="approve" sorted={sortVoteColumn === 'approve' ? sortVoteDirection : null} onClick={this.sortData('approve')}>
                    {formatMessage(messages.approval)}
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {votesFiltered.map(row =>
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

Vote.propTypes = {
  accountSettingsActions: PropTypes.shape({
    sortVotesData: PropTypes.func,
    getVotes: PropTypes.func,
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  }),
  account: PropTypes.shape({
    votesFiltered: [],
    sortVoteColumn: 'processor',
    sortVoteDirection: 'descending',
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  rowsPerPage: PropTypes.number,
};

Vote.defaultProps = {
  accountSettingsActions: {},
  account: {},
  tableProps: {},
  intl: {},
  rowsPerPage: 5,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      getVotes,
      sortVotesData,
    }, dispatch),
  }),
)(injectIntl(Vote));
