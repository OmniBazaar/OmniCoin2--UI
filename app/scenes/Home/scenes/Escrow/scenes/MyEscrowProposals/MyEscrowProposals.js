import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import { injectIntl } from 'react-intl';
import { Loader } from 'semantic-ui-react';
import moment from 'moment';

const { shell } = require('electron');

import './my-escrow-proposals.scss';
import messages from './messages';
import {
  getEscrowProposals,
  approveEscrowExtendProposal
} from "../../../../../../services/escrow/escrowActions";

class MyEscrowProposals extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchProposals();
  }

  fetchProposals() {
    const { currentUser } = this.props.auth;
    this.props.escrowActions.getEscrowProposals(currentUser.username);
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (this.props.escrow.activeEscrowProposals.loading && !nextProps.escrow.activeEscrowProposals.loading) {
      if (nextProps.escrow.activeEscrowProposals.error) {
        this.showError(nextProps.escrow.activeEscrowProposals.error);
      }
    }
    if (this.props.escrow.activeEscrowProposals.proposalApprove.loading
      && !nextProps.escrow.activeEscrowProposals.proposalApprove.loading) {
      if (nextProps.escrow.activeEscrowProposals.proposalApprove.error) {
        this.showError(nextProps.escrow.activeEscrowProposals.proposalApprove.error);
      } else {
        this.fetchProposals();
        this.showSuccess(formatMessage(messages.proposalApproveSuccess));
      }
    }
  }

  showSuccess(message) {
    const { formatMessage } = this.props.intl;
    toastr.success(formatMessage(messages.success), message);
  }

  showError(message) {
    const { formatMessage } = this.props.intl;
    toastr.error(formatMessage(messages.error), message)
  }

  openLink(e, path) {
    e.preventDefault();
    shell.openExternal(path);
  }

  approve(e, proposal) {
    e.preventDefault();
    this.props.escrowActions.approveEscrowExtendProposal(proposal.id);
  }

  renderProposal(proposal) {
    const { formatMessage } = this.props.intl;
    const { currentUser } = this.props.auth;
    const { loading, proposalId } = this.props.escrow.activeEscrowProposals.proposalApprove;
    const idPath = `http://35.171.116.3:8080//#/objects/${proposal.id}`;
    const escrowPath = `http://35.171.116.3:8080//#/objects/${proposal.escrow}`;
    console.log(idPath, escrowPath);
    return (
      <span className="proposal">
        <a href={idPath} onClick={(e) => this.openLink(e, idPath)}>
          {proposal.id}
        </a><span>:&nbsp;</span>
        <span>
          {formatMessage(messages.proposalText, {
            initiator: currentUser.username === proposal.feePayingAccount['name'] ? formatMessage(messages.you) : proposal.feePayingAccount['name'],
          })}
        </span>
        <span>&nbsp;</span>
        <a href={escrowPath} onClick={(e) => this.openLink(e, escrowPath)}>
          {proposal.escrow}
        </a>
          <span>&nbsp;</span>
        <span>
          {formatMessage(messages.proposalExpirationTime, {
            proposedTime: moment(new Date(proposal.proposedTime)).format('YYYY-MM-DD HH:mm')
          })}
        </span>
        <span>&nbsp;</span>
        {loading && proposalId === proposal.id
          ? <Loader
              active
              inline
              size="mini"
            />
          :
          <a href="#" onClick={(e) => this.approve(e, proposal)}>
            {formatMessage(messages.approve)}
          </a>
        }
      </span>
    );
  }

  render() {
    const {
      proposals,
      loading
    } = this.props.escrow.activeEscrowProposals;
    return (
      <div className="proposals">
        {loading
          ? <Loader active inline className="loading"/>
          : proposals.map(proposal => this.renderProposal(proposal))
        }
      </div>
    )
  }
}


export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    escrowActions: bindActionCreators({
      getEscrowProposals,
      approveEscrowExtendProposal
    }, dispatch),
  }),
)(injectIntl(MyEscrowProposals));
