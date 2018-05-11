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
  Loader
} from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';

import {
  releaseEscrowTransaction,
  returnEscrowTransaction,
  setActivePageMyEscrow
} from '../../../../../../services/escrow/escrowActions';
import ConfirmationModal from '../../../../../../components/ConfirmationModal/ConfirmationModal';
import VotingToggle from '../../../../../../components/VotingToggle/VotingToggle';
import Pagination from '../../../../../../components/Pagination/Pagination';
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
    defaultMessage: 'Error',
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
  }
});

const comparator = (transA, transB, headerName, asc) => {
  const compA = transA[headerName].toString();
  const compB = transB[headerName].toString();
  return compA.localeCompare(compB) * (asc ? 1 : -1);
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
      confirmationModal: {
        isOpen: false,
        question: '',
        onApprove: null,
      }
    };
    this.handleRelease = this.handleRelease.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    const headerName = this.state.lastHeaderClicked;
    const asc = this.state.sortAsc[headerName];
    this.setState({
      transactions: nextProps.escrow.transactionsFiltered.slice().sort(
        (transA, transB) => comparator(transA, transB, headerName, asc)
      ),
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
  }

  closeModal = () => {
    this.setState({
      confirmationModal: {
        isOpen: false,
        question: '',
        onApprove: null,
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
      transactions: this.state.transactions.slice().sort(
        (transA, transB) => comparator(transA, transB, headerName, asc)
      ),
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
      transactions: this.state.transactions.slice().sort(
        (transA, transB) => comparator(transA, transB, headerName, newHeaderSortAsc)
      ),
      lastHeaderClicked: headerName
    });
  }

  handleRelease(escrowObject) {
    const { formatMessage } = this.props.intl;
    this.setState({
      confirmationModal: {
        isOpen: true,
        question: formatMessage(messages.askRelease, {
          username: escrowObject.seller.name
        }),
        onApprove: () => this.props.escrowActions.releaseEscrowTransaction(escrowObject),
      }
    });
  }

  handleReturn(escrowObject) {
    const { formatMessage } = this.props.intl;
    this.setState({
      confirmationModal: {
        isOpen: true,
        question: formatMessage(messages.askReturn, { username: escrowObject.buyer.name }),
        onApprove: () => this.props.escrowActions.returnEscrowTransaction(escrowObject),
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

  renderRows() {
    const { username } = this.props.auth.currentUser;
    return this.state.transactions.map((escrowObject) => (
      <TableRow key={escrowObject.transactionID}>
        <TableCell>{escrowObject.transactionID}</TableCell>
        <TableCell>{escrowObject.amount} XOM</TableCell>
        <TableCell>{escrowObject.parties}</TableCell>
        <TableCell>{escrowObject.expirationTime}</TableCell>
        <TableCell>
          {escrowObject.escrow.name === username ?
            <div className="finalize">
              <VotingToggle
                type="up"
                onToggle={() => this.handleRelease(escrowObject)}
              />
              <VotingToggle
                type="down"
                onToggle={() => this.handleReturn(escrowObject)}
              />
            </div>
            :
            <div className="finalize">
              {escrowObject.seller.name === username ?
                <VotingToggle
                  type="down"
                  onToggle={() => this.handleReturn(escrowObject)}
                />
                :
                <VotingToggle
                  type="up"
                  onToggle={() => this.handleRelease(escrowObject)}
                />
              }
            </div>
          }
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
              : <Table
                sortable="true"
                compact="true"
                basic="very"
                striped="true"
                size="small"
              >
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {this.renderRows()}
                </TableBody>
              </Table>
          }
        </div>
        <ConfirmationModal
          isOpen={this.state.confirmationModal.isOpen}
          question={this.state.confirmationModal.question}
          onApprove={this.state.confirmationModal.onApprove}
          onCancel={this.closeModal}
          loading={finalizing}
        />
      </div>
    );
  }
}

MyEscrowTransactions.defaultProps = {
  escrow: {},
  intl: {},
  escrowActions: {},
  auth: {}
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
    setActivePageMyEscrow: PropTypes.func
  }),
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    })
  })
};

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    escrowActions: bindActionCreators({
      returnEscrowTransaction,
      releaseEscrowTransaction,
      setActivePageMyEscrow
    }, dispatch),
  })
)(injectIntl(MyEscrowTransactions));
