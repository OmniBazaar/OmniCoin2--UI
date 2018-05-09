import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Image,
} from 'semantic-ui-react';
import hash from 'object-hash';
import PropTypes from 'prop-types';

import VotingToggle from '../../../../../../components/VotingToggle/VotingToggle';

const messages = defineMessages({
  rank: {
    id: 'ProcessorsTable.rank',
    defaultMessage: 'Rank'
  },
  name: {
    id: 'ProcessorsTable.name',
    defaultMessage: 'Name'
  },
  approval: {
    id: 'ProcessorsTable.approval',
    defaultMessage: 'Approval',
  },
  reliability: {
    id: 'ProcessorsTable.reliability',
    defaultMessage: 'Reliability'
  },
  reputation: {
    id: 'ProcessorsTable.reputation',
    defaultMessage: 'Reputation'
  },
  referralScore: {
    id: 'ProcessorsTable.referralScore',
    defaultMessage: 'Referral Score'
  },
  publisherScore: {
    id: 'ProcessorsTable.publisherScore',
    defaultMessage: 'Publisher Score'
  },
  netScore: {
    id: 'ProcessorsTable.netScore',
    defaultMessage: 'Net Score'
  },
  approve: {
    id: 'ProcessorsTable.approve',
    defaultMessage: 'Approve'
  }
});
class ProcessorsTable extends Component {
  render() {
    const {
      sortColumn,
      sortDirection,
      sortData,
      data,
      toggle
    } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="table-container">
        <Table {...this.props.tableProps}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell key="rank" sorted={sortColumn === 'rank' ? sortDirection : null} onClick={sortData('rank')}>
                {formatMessage(messages.rank)}
              </TableHeaderCell>
              <TableHeaderCell key="name" sorted={sortColumn === 'name' ? sortDirection : null} onClick={sortData('name')}>
                {formatMessage(messages.name)}
              </TableHeaderCell>
              <TableHeaderCell key="approval" sorted={sortColumn === 'trust_score' ? sortDirection : null} onClick={sortData('trust_score')}>
                {formatMessage(messages.approval)}
              </TableHeaderCell>
              <TableHeaderCell key="reliability" sorted={sortColumn === 'reliability_score' ? sortDirection : null} onClick={sortData('reliability_score')}>
                {formatMessage(messages.reliability)}
              </TableHeaderCell>
              <TableHeaderCell key="reputation" sorted={sortColumn === 'reputation_score' ? sortDirection : null} onClick={sortData('reputation_score')}>
                {formatMessage(messages.reputation)}
              </TableHeaderCell>
              <TableHeaderCell key="referralScore" sorted={sortColumn === 'referral_score' ? sortDirection : null} onClick={sortData('referral_score')}>
                {formatMessage(messages.referralScore)}
              </TableHeaderCell>
              <TableHeaderCell key="publisherScore" sorted={sortColumn === 'listings_score' ? sortDirection : null} onClick={sortData('listings_score')}>
                {formatMessage(messages.publisherScore)}
              </TableHeaderCell>
              <TableHeaderCell key="netScore" sorted={sortColumn === 'pop_score' ? sortDirection : null} onClick={sortData('pop_score')}>
                {formatMessage(messages.netScore)}
              </TableHeaderCell>
              <TableHeaderCell key="approve" sorted={sortColumn === 'approve' ? sortDirection : null} onClick={sortData('approve')}>
                {formatMessage(messages.approve)}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(row =>
              (
                <TableRow key={hash(row)}>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell><a>{row.witness_account.name}</a></TableCell>
                  <TableCell>{row.trust_score / 100}%</TableCell>
                  <TableCell>{row.reliability_score / 100}%</TableCell>
                  <TableCell>{row.reputation_score / 100}%</TableCell>
                  <TableCell>{row.referral_score / 100}%</TableCell>
                  <TableCell>{row.listings_score / 100}%</TableCell>
                  <TableCell>{row.pop_score / 100}%</TableCell>
                  <TableCell>
                    <VotingToggle
                      type="up"
                      onToggle={() => toggle(row.id)}
                      isToggled={!!row.approve}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

ProcessorsTable.propTypes = {
  tableProps: {
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  },
  data: PropTypes.array,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  toggle: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  })
};

ProcessorsTable.defaultProps = {
  tableProps: {
    sortable: true,
    compact: true,
    basic: 'very',
    striped: true,
    size: 'small'
  },
  data: [],
  sortDirection: 'descending',
  sortColumn: 'rank',
  toggle: () => {}
};

export default injectIntl(ProcessorsTable);
