import React, { Component } from 'react';

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

import hash from 'object-hash';
import PropTypes from 'prop-types';

import DislikeIcon from '../../../../images/btn-dislike.svg';
import LikeIcon from '../../../../images/btn-like.svg';
import DotsIcon from '../../../../images/btn-meehh.svg';


const iconSize = 18;

class ProcessorsTable extends Component {

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
      return ProcessorsTable.renderVoteValue(approve);
    }
    return ProcessorsTable.renderVote();
  }

  render() {
    const {
      sortColumn,
      sortDirection,
      sortData,
      data
    } = this.props;
    return (
      <div className="table-container">
        <Table {...this.props.tableProps}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell key="rank" sorted={sortColumn === 'rank' ? sortDirection : null} onClick={sortData('rank')}>
                Rank
              </TableHeaderCell>
              <TableHeaderCell key="name" sorted={sortColumn === 'name' ? sortDirection : null} onClick={sortData('name')}>
                Name
              </TableHeaderCell>
              <TableHeaderCell key="approval" sorted={sortColumn === 'trust_score' ? sortDirection : null} onClick={sortData('trust_score')}>
                Approval
              </TableHeaderCell>
              <TableHeaderCell key="reliability" sorted={sortColumn === 'reliability_score' ? sortDirection : null} onClick={sortData('reliability_score')}>
                Reliability
              </TableHeaderCell>
              <TableHeaderCell key="reputation" sorted={sortColumn === 'reputation_score' ? sortDirection : null} onClick={sortData('reputation_score')}>
                Reputation
              </TableHeaderCell>
              <TableHeaderCell key="referralScore" sorted={sortColumn === 'referral_score' ? sortDirection : null} onClick={sortData('referral_score')}>
                Referral Score
              </TableHeaderCell>
              <TableHeaderCell key="publisherScore" sorted={sortColumn === 'listings_score' ? sortDirection : null} onClick={sortData('listings_score')}>
                Publisher Score
              </TableHeaderCell>
              <TableHeaderCell key="netScore" sorted={sortColumn === 'pop_score' ? sortDirection : null} onClick={sortData('pop_score')}>
                Net Score
              </TableHeaderCell>
              <TableHeaderCell key="approve" sorted={sortColumn === 'approve' ? sortDirection : null} onClick={sortData('approve')}>
                Approve
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(row =>
              (
                <TableRow key={hash(row)}>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell><a>{row.witness_account['name']}</a></TableCell>
                  <TableCell>{row.trust_score / 100}%</TableCell>
                  <TableCell>{row.reliability_score / 100}%</TableCell>
                  <TableCell>{row.reputation_score / 100}%</TableCell>
                  <TableCell>{row.referral_score / 100}%</TableCell>
                  <TableCell>{row.listings_score / 100}%</TableCell>
                  <TableCell>{row.pop_score / 100}%</TableCell>
                  <TableCell>
                    {ProcessorsTable.renderApprove(row.approve)}
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
  sortDirection: PropTypes.string
};

PropTypes.defaultProps = {
  tableProps: {
    sortable: true,
    compact: true,
    basic: 'very',
    striped: true,
    size: 'small'
  },
  data: []
};

export default ProcessorsTable;
