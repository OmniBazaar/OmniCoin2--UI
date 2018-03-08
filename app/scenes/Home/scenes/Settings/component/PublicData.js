import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CheckNormal from '../../../images/ch-box-0-norm.svg';
import CheckPreNom from '../../../images/ch-box-1-norm.svg';

import { getCurrentUser } from '../../../../../services/blockchain/auth/authActions';
import {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
} from '../../../../../services/accountSettings/accountActions';
import '../settings.scss';

const iconSize = 20;

class PublicData extends Component {
  constructor(props) {
    super(props);

    this.toggleReferrer = this.toggleReferrer.bind(this);
    this.togglePublisher = this.togglePublisher.bind(this);
    this.toggleTransactionProcessor = this.toggleTransactionProcessor.bind(this);
    this.toggleEscrow = this.toggleEscrow.bind(this);
  }

  toggleReferrer() {
    this.props.accountSettingsActions.setReferrer();
  }

  togglePublisher() {
    this.props.accountSettingsActions.setPublisher();
  }

  toggleTransactionProcessor() {
    this.props.accountSettingsActions.setTransactionProcessor();
  }

  toggleEscrow() {
    this.props.accountSettingsActions.setEscrow();
  }

  getReferrerIcon() {
    return this.props.account.referrer ? CheckPreNom : CheckNormal;
  }

  getPublisherIcon() {
    return this.props.account.publisher ? CheckPreNom : CheckNormal;
  }

  getTransactionIcon() {
    return this.props.account.transactionProcessor ? CheckPreNom : CheckNormal;
  }

  getEscrowIcon() {
    return this.props.account.escrow ? CheckPreNom : CheckNormal;
  }

  updatePublicData() {
    console.log('Update data');
  }

  render() {
    return (
      <div className="check-form">
        <div className="description">
          <div className="check-container">
            <Image src={this.getReferrerIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleReferrer} />
          </div>
          <div className="description-text">
            <p className="title">I'd like to refer my friends to OmniBazaar.</p>
            <div>
              REFERRER: During the initial phase of the OmniBazaar marketplace
              you will receive a Referral Bonus of OmniCoins each time you refer a new user.
              a small number of OmniCoins from your account to the new users you refer, to
              enable those new users to register their user names and get started in OmniBazaar.
              In exchange, you receive a commission (some OmniCoins) each time a user you referred
              buys or sells something in the OmniBazaar marketplace. In order to serve as a
              Referrer, you must keep the OmniBazaar application running on your computer.
            </div>
          </div>
        </div>
        <div className="description">
          <div className="check-container">
            <Image src={this.getPublisherIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.togglePublisher} />
          </div>
          <div className="description-text">
            <p className="title">I would like to run a "shop" and publish listings for other users.</p>
            <div>
              PUBLISHER: As a Publisher you receive OmniCoins for each new user listing published
              on your server but you must keep your server continuously running and available
              on the Internet. Check this box only if you have installed and configured Couchbase
              Server (database) on this computer. You must also have either a static IP address
              or a DNS redirect service, such as <a>DynDNS</a> or <a>NoIP</a>.
            </div>
          </div>
        </div>
        <div className="description">
          <div className="check-container">
            <Image src={this.getTransactionIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleTransactionProcessor} />
          </div>
          <div className="description-text">
            <p className="title">I would like to apply to be a Transaction Processor.</p>
            <div>
              TRANSACTION PROCESSOR: Transaction Processors are paid OmniCoins for processing the
              transactions of the other user in the marketplace. Because this is a well-paid and
              highly-responsible position, Transaction Processor are selected only from the most
              active participants in the marketplace. Referring new users, publishing listings for
              others, being known and trusted by other users, and having a good reputation in the
              marketplace all count toward being recognized as an "active participant" and
              qualifying to be a Transaction Processor.
            </div>
          </div>
        </div>
        <div className="description">
          <div className="check-container">
            <Image src={this.getEscrowIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleEscrow} />
          </div>
          <div className="description-text">
            <p className="title">I'm willing to perform the duties of an Escrow Agent.</p>
            <div>
              ESCROW: Escrow Agents help ensure that marketplace transactions are carried out
              honestly and fairly. When you choose to become an Escrow Agent, you agree to settle
              disputes that may arise between buyers and sellers. If you are called upon to settle a
              dispute, you must review the evidence provided by both sides and make an impartial
              decision about whether to return funds to the buyer or release them to the seller. You
              receive a fee (in OmniCoins) from every transaction for which you are chosen as the
              escrow agent, regardless of whether or not you are called upon to settle a dispute.
            </div>
          </div>
        </div>
        <div className="bottom-detail">
          <Button content="UPDATE" onClick={this.updatePublicData} className="button--green-bg" />
          <div className="labels">
            <span>Update data transaction fee: </span>
            <span className="amount">5 XOM</span>
          </div>
        </div>
      </div>
    );
  }
}

PublicData.propTypes = {
  accountSettingsActions: PropTypes.shape({
    setReferrer: PropTypes.func,
    setPublisher: PropTypes.func,
    setTransactionProcessor: PropTypes.func,
    setEscrow: PropTypes.func,
  }),
  account: PropTypes.shape({
    referrer: PropTypes.bool,
    publisher: PropTypes.bool,
    transactionProcessor: PropTypes.bool,
    escrow: PropTypes.bool,
  })
};

PublicData.defaultProps = {
  accountSettingsActions: {},
  account: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      getCurrentUser,
      setReferrer,
      setPublisher,
      setTransactionProcessor,
      setEscrow,
    }, dispatch),
  }),
)(PublicData);
