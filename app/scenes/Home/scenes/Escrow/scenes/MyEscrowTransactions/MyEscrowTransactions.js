import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
  Loader,
  Button
} from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import dateformat from 'dateformat';

import {
  releaseEscrowTransaction,
  returnEscrowTransaction,
  setActivePageMyEscrow,
  setPaginationMyEscrow,
  createEscrowExtendProposal,
  getEscrowProposals
} from '../../../../../../services/escrow/escrowActions';
import RateModal from './components/RateModal/RateModal';
import VotingToggle from '../../../../../../components/VotingToggle/VotingToggle';
import Pagination from '../../../../../../components/Pagination/Pagination';
import ConfirmationModal from '../../../../../../components/ConfirmationModal/ConfirmationModal';

import './my-escrow-transactions.scss';

const messages = defineMessages({
  transactionID: {
    id: 'MyEscrowTransactions.transactionID',
    defaultMessage: 'Transaction ID'
  },
  amount: {
    id: 'MyEscrowTransactions.amount',
    defaultMessage: 'Amount'
  },
  parties: {
    id: 'MyEscrowTransactions.parties',
    defaultMessage: 'Parties'
  },
  expirationTime: {
    id: 'MyEscrowTransactions.expirationTime',
    defaultMessage: 'Expiration time'
  },
  finalize: {
    id: 'MyEscrowTransactions.finalize',
    defaultMessage: 'Finalize'
  },
  askRelease: {
    id: 'MyEscrowTransactions.askRelease',
    defaultMessage: 'Are you sure you want to release money to {username}?'
  },
  askReturn: {
    id: 'MyEscrowTransactions.askReturn',
    defaultMessage: 'Are you sure you want to return money to {username}?'
  },
  success: {
    id: 'MyEscrowTransactions.success',
    defaultMessage: 'Success'
  },
  error: {
    id: 'MyEscrowTransactions.error',
    defaultMessage: 'Error'
  },
  successRelease: {
    id: 'MyEscrowTransactions.successRelease',
    defaultMessage: '{amount} XOM were successfully released to {username}!'
  },
  successReturn: {
    id: 'MyEscrowTransactions.successReturn',
    defaultMessage: '{amount} XOM were successfully returned to {username}!'
  },
  noTransactions: {
    id: 'MyEscrowTransactions.noTransactions',
    defaultMessage: 'You don\'t have any pending escrow transactions.'
  },
  rateSomeone: {
    id: 'MyEscrowTransaction.rateSomeone',
    defaultMessage: 'Rate {username} ({type})'
  },
  escrow: {
    id: 'MyEscrowTransactions.escrow',
    defaultMessage: 'escrow'
  },
  buyer: {
    id: 'MyEscrowTransactions.buyer',
    defaultMessage: 'buyer'
  },
  seller: {
    id: 'MyEscrowTransactions.seller',
    defaultMessage: 'seller'
  },
  voteUpTooltip: {
    id: 'MyEscrowTransactions.voteUpTooltip',
    defaultMessage: 'Click here when you are satisfied with the seller\'s product or performance. This will release to the seller the funds held in escrow.'
  },
  voteDownTooltip: {
    id: 'MyEscrowTransactions.voteDownTooltip',
    defaultMessage: 'Click here if you need or want to reject or terminate this escrow transaction. This will return to the buyer the funds held in escrow.'
  },
  proposal: {
    id: 'MyEscrowTransactions.proposal',
    defaultMessage: 'Proposal'
  },
  extendTime: {
    id: 'MyEscrowTransactions.extendTime',
    defaultMessage: 'EXTEND TIME'
  },
  proposalConfirmation: {
    id: 'MyEscrowTransaction.proposalConfirmation',
    defaultMessage: 'Are you sure you want to propose other party to extend expiration time to {time}?'
  },
  proposalCreateSuccess: {
    id: 'MyEscrowTransaction.proposalSuccess',
    defaultMessage: 'Proposal was created successfully'
  },
});

const comparator = (transA, transB, headerName, asc) => {
  const compA = transA[headerName].toString();
  const compB = transB[headerName].toString();
  return compA.localeCompare(compB) * (asc ? 1 : -1);
};

const proposalInitialState = {
  isCalendarOpen: false,
  transactionID: null,
  expirationTime: null,
  minDate: null,
  isConfirmationModalOpen: false
};

class MyEscrowTransactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: props.escrow.transactionsFiltered,
      sortAsc: {
        transactionID: false,
        amount: false,
        parties: false
      },
      lastHeaderClicked: 'transactionID',
      rateModal: {
        isOpen: false,
        name1: null,
        label1: null,
        name2: null,
        label2: null,
        onSubmit: () => {},
      },
      proposal: {
        ...proposalInitialState
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleExtendExpTime = this.handleExtendExpTime.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.submitProposal = this.submitProposal.bind(this);
    this.toggleProposalConfirmationModal = this.toggleProposalConfirmationModal.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    const headerName = this.state.lastHeaderClicked;
    const asc = this.state.sortAsc[headerName];
    this.setState({
      transactions: nextProps.escrow.transactionsFiltered.slice().sort((transA, transB) => comparator(transA, transB, headerName, asc)),
      lastHeaderClicked: headerName
    });

    if (this.props.escrow.finalizing && !nextProps.escrow.finalizing) {
      if (nextProps.escrow.error) {
        toastr.error(formatMessage(messages.error), nextProps.escrow.error);
      } else {
        const {
          releasedTransaction,
          returnedTransaction
        } = nextProps.escrow;
        this.closeModal();
        if (releasedTransaction) {
          toastr.success(
            formatMessage(messages.success),
            formatMessage(messages.successRelease, {
              amount: releasedTransaction.amount,
              username: releasedTransaction.seller.name
            })
          );
        } else if (returnedTransaction) {
          toastr.success(
            formatMessage(messages.success),
            formatMessage(messages.successReturn, {
              amount: returnedTransaction.amount,
              username: returnedTransaction.buyer.name
            })
          );
        }
      }
    }

    if (this.props.escrow.loading !== nextProps.escrow.loading) {
      this.props.escrowActions.setPaginationMyEscrow(this.props.rowsPerPage);
    }

    if (this.props.escrow.escrowExtendProposal.loading && !nextProps.escrow.escrowExtendProposal.loading) {
      this.toggleProposalConfirmationModal();
      if (!nextProps.escrow.escrowExtendProposal.error) {
        toastr.success(formatMessage(messages.success), formatMessage(messages.proposalCreateSuccess));
      } else {
        toastr.error(formatMessage(messages.error), nextProps.escrow.escrowExtendProposal.error);
      }
    }
  }


  closeModal = () => {
    this.setState({
      rateModal: {
        isOpen: false,
        name1: null,
        label1: null,
        name2: null,
        label2: null,
        onSubmit: () => {},
      }
    });
  };

  handlePaginationChange = (e, { activePage }) => {
    this.props.escrowActions.setActivePageMyEscrow(activePage);
  };

  sortColumn(headerName, asc) {
    this.setState({
      ...this.state,
      sortAsc: {
        ...this.state.sortAsc,
        [headerName]: asc
      },
      transactions: this.state.transactions.slice().sort((transA, transB) => comparator(transA, transB, headerName, asc)),
      lastHeaderClicked: headerName
    });
  }

  handleHeaderClick(headerName) {
    const newHeaderSortAsc = !this.state.sortAsc[headerName];
    this.setState({
      ...this.state,
      sortAsc: {
        ...this.state.sortAsc,
        [headerName]: newHeaderSortAsc
      },
      transactions: this.state.transactions.slice().sort((transA, transB) => comparator(transA, transB, headerName, newHeaderSortAsc)),
      lastHeaderClicked: headerName
    });
  }

  getParties(escrowObject) {
    const type = this.getCurrentUserType(escrowObject);
    return ['seller', 'buyer', 'escrow'].filter(el => el != type);
  }

  getCurrentUserType(escrowObject) {
    const { currentUser } = this.props.auth;
    if (escrowObject.seller.name === currentUser.username) {
      return 'seller';
    }
    if (escrowObject.buyer.name === currentUser.username) {
      return 'buyer';
    }
    if (escrowObject.escrow.name === currentUser.username) {
      return 'escrow';
    }
  }

  handleSubmit(type, escrowObject) {
    const { formatMessage } = this.props.intl;
    const parties = this.getParties(escrowObject);
    const currUserType = this.getCurrentUserType(escrowObject);
    this.setState({
      rateModal: {
        isOpen: true,
        name1: parties[0],
        label1: formatMessage(messages.rateSomeone, {
          username: escrowObject[parties[0]].name,
          type: formatMessage(messages[parties[0]])
        }),
        name2: parties[1],
        label2: formatMessage(messages.rateSomeone, {
          username: escrowObject[parties[1]].name,
          type: formatMessage(messages[parties[1]])
        }),
        onSubmit: (votes) =>
          (type === 'release'
            ? this.props.escrowActions.releaseEscrowTransaction(escrowObject, {
              ...votes,
              [currUserType]: 5
            })
            : this.props.escrowActions.returnEscrowTransaction(escrowObject, {
              ...votes,
              [currUserType]: 5
            })),
      }
    });
  }


  renderNoTransactions() {
    const { formatMessage } = this.props.intl;
    return (
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        {formatMessage(messages.noTransactions)}
      </span>
    );
  }

  clearProposalState() {
    this.setState({
      proposal: {
        ...proposalInitialState
      }
    });
  }

  toggleCalendar(callback) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        isCalendarOpen: !this.state.proposal.isCalendarOpen,
      }
    }, callback);
  }

  toggleProposalConfirmationModal() {
    if (this.state.proposal.isConfirmationModalOpen) {
      this.clearProposalState();
    }
    this.setState({
      proposal: {
        ...this.state.proposal,
        isConfirmationModalOpen: !this.state.proposal.isConfirmationModalOpen
      }
    })
  }

  handleCalendarChange(date) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        expirationTime: date
      }
    }, () => {
      this.toggleCalendar(this.toggleProposalConfirmationModal);
    });
  }

  onClickOutside = () => {
    this.toggleCalendar()
  }

  handleExtendExpTime(escrowObject) {
    this.setState({
      proposal: {
        ...this.state.proposal,
        transactionID: escrowObject.transactionID,
        minDate: moment(escrowObject.expirationTime).add(1, 'days'),
      }
    }, () => this.toggleCalendar());
  }

  submitProposal() {
    const {
      transactionID,
      expirationTime
    } = this.state.proposal;
    this.props.escrowActions.createEscrowExtendProposal(transactionID, expirationTime.diff(moment().startOf('day'), 'seconds'));
  }

  renderRows() {
    const { username } = this.props.auth.currentUser;
    const { formatMessage } = this.props.intl;
    return this.state.transactions.map((escrowObject) => (
      <TableRow key={escrowObject.transactionID}>
        <TableCell>{escrowObject.transactionID}</TableCell>
        <TableCell>{escrowObject.amount} XOM</TableCell>
        <TableCell>{escrowObject.parties}</TableCell>
        <TableCell>{dateformat(escrowObject.expirationTime, 'yyyy-mm-dd HH:MM:ss')}</TableCell>
        <TableCell>
          {escrowObject.escrow.name === username ?
            <div className="finalize">
              <VotingToggle
                type="up"
                onToggle={() => this.handleSubmit('release', escrowObject)}
                tooltip={formatMessage(messages.voteUpTooltip)}
              />
              <VotingToggle
                type="down"
                onToggle={() => this.handleSubmit('return', escrowObject)}
                tooltip={formatMessage(messages.voteDownTooltip)}
              />
            </div>
            :
            <div className="finalize">
              {escrowObject.seller.name === username ?
                <VotingToggle
                  type="down"
                  onToggle={() => this.handleSubmit('return', escrowObject)}
                  tooltip={formatMessage(messages.voteDownTooltip)}
                />
                :
                <VotingToggle
                  type="up"
                  onToggle={() => this.handleSubmit('release', escrowObject)}
                  tooltip={formatMessage(messages.voteUpTooltip)}
                />
              }
            </div>
          }
        </TableCell>
        <TableCell>
          <Button
            disabled={escrowObject.escrow.name === username}
            content={formatMessage(messages.extendTime)}
            onClick={() => this.handleExtendExpTime(escrowObject)}
            className="button--blue-text"
          />
        </TableCell>
      </TableRow>
    ));
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      loading,
      finalizing,
      activePageMyEscrow,
      totalPagesMyEscrow
    } = this.props.escrow;

    return (
      <div className="data-table">
        <div className="top-detail">
          <Pagination
            activePage={activePageMyEscrow}
            onPageChange={this.handlePaginationChange}
            totalPages={totalPagesMyEscrow}
          />
        </div>
        <div className="table-container">
          {loading ? <Loader active inline="centered" />
            : this.state.transactions.length === 0
              ? this.renderNoTransactions()
              : <Table {...this.props.tableProps}>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell
                      sorted={this.state.sortAsc.transactionID ? 'ascending' : 'descending'}
                      onClick={this.handleHeaderClick.bind(this, 'transactionID')}
                    >
                      {formatMessage(messages.transactionID)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      sorted={this.state.sortAsc.amount ? 'ascending' : 'descending'}
                      onClick={this.handleHeaderClick.bind(this, 'amount')}
                    >
                      {formatMessage(messages.amount)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      sorted={this.state.sortAsc.parties ? 'ascending' : 'descending'}
                      onClick={this.handleHeaderClick.bind(this, 'parties')}
                    >
                      {formatMessage(messages.parties)}
                    </TableHeaderCell>
                    <TableHeaderCell
                      sorted={this.state.sortAsc.expirationTime ? 'ascending' : 'descending'}
                      onClick={this.handleHeaderClick.bind(this, 'expirationTime')}
                    >
                      {formatMessage(messages.expirationTime)}
                    </TableHeaderCell>
                    <TableHeaderCell className="sorted">
                      {formatMessage(messages.finalize)}
                    </TableHeaderCell>
                    <TableHeaderCell>
                    </TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.renderRows()}
                </TableBody>
              </Table>
          }
        </div>
        {this.state.rateModal.isOpen && <RateModal
          {...this.state.rateModal}
          onCancel={this.closeModal}
          loading={finalizing}
        />}
        {
          this.state.proposal.isCalendarOpen && (
            <DatePicker
              onClickOutside={this.onClickOutside}
              selected={this.state.startDate}
              onChange={this.handleCalendarChange}
              withPortal
              minDate={this.state.proposal.minDate}
              inline />
          )
        }
        <ConfirmationModal
            isOpen={this.state.proposal.isConfirmationModalOpen}
            onApprove={this.submitProposal}
            onCancel={this.toggleProposalConfirmationModal}
            loading={this.props.escrow.escrowExtendProposal.loading}
        >
          {formatMessage(messages.proposalConfirmation, {time: moment(this.state.proposal.expirationTime).format('MMMM Do YYYY')})}
        </ConfirmationModal>
      </div>
    );
  }
}

MyEscrowTransactions.defaultProps = {
  escrow: {},
  intl: {},
  escrowActions: {},
  auth: {},
  rowsPerPage: 20,
  tableProps: {},
};

MyEscrowTransactions.propTypes = {
  escrow: PropTypes.shape({
    transactions: PropTypes.array,
    transactionsFiltered: PropTypes.array,
    finalizing: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.string,
    activePageMyEscrow: PropTypes.number,
    totalPagesMyEscrow: PropTypes.number
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  escrowActions: PropTypes.shape({
    releaseEscrowTransaction: PropTypes.func,
    returnEscrowTransaction: PropTypes.func,
    setActivePageMyEscrow: PropTypes.func,
    setPaginationMyEscrow: PropTypes.func
  }),
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    })
  }),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    striped: PropTypes.bool,
    size: PropTypes.string,
  }),
  rowsPerPage: PropTypes.number,
};

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    escrowActions: bindActionCreators({
      returnEscrowTransaction,
      releaseEscrowTransaction,
      setActivePageMyEscrow,
      setPaginationMyEscrow,
      createEscrowExtendProposal,
      getEscrowProposals
    }, dispatch),
  })
)(injectIntl(MyEscrowTransactions));
