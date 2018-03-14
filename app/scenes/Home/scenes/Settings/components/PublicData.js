import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
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
const messages = defineMessages({
  referrerTitle: {
    id: 'Setting.referrerTitle',
    defaultMessage: 'I\'d like to refer my friends to OmniBazaar.'
  },
  referrerBody: {
    id: 'Setting.referrerBody',
    defaultMessage: 'REFERRER: During the initial phase of the OmniBazaar marketplace\n' +
    ' you will receive a Referral Bonus of OmniCoins each time you refer a new user.\n' +
    ' a small number of OmniCoins from your account to the new users you refer, to\n' +
    ' enable those new users to register their user names and get started in OmniBazaar.\n' +
    ' In exchange, you receive a commission (some OmniCoins) each time a user you referred\n' +
    ' buys or sells something in the OmniBazaar marketplace. In order to serve as a\n' +
    ' Referrer, you must keep the OmniBazaar application running on your computer.'
  },
  publisherTitle: {
    id: 'Setting.publisherTitle',
    defaultMessage: 'I would like to run a "shop" and publish listings for other users.'
  },
  publisherBody: {
    id: 'Setting.publisherBody',
    defaultMessage: 'PUBLISHER: As a Publisher you receive OmniCoins for each new user listing published\n' +
    ' on your server but you must keep your server continuously running and available on the Internet.' +
    ' Check this box only if you have installed and configured Couchbase Server (database) on this computer.' +
    ' You must also have either a static IP address or a DNS redirect service, such as '
  },
  or: {
    id: 'Settings.or',
    defaultMessage: 'or'
  },
  processorTitle: {
    id: 'Settings.processorTitle',
    defaultMessage: 'I would like to apply to be a Transaction Processor.'
  },
  processorBody: {
    id: 'Settings.processorBody',
    defaultMessage: 'TRANSACTION PROCESSOR: Transaction Processors are paid OmniCoins for processing the\n' +
    ' transactions of the other user in the marketplace. Because this is a well-paid and\n' +
    ' highly-responsible position, Transaction Processor are selected only from the most\n' +
    ' active participants in the marketplace. Referring new users, publishing listings for\n' +
    ' others, being known and trusted by other users, and having a good reputation in the\n' +
    ' marketplace all count toward being recognized as an "active participant" and\n' +
    ' qualifying to be a Transaction Processor.'
  },
  escrowTitle: {
    id: 'Settings.escrowTitle',
    defaultMessage: 'I\'m willing to perform the duties of an Escrow Agent.'
  },
  escrowBody: {
    id: 'Settings.escrowBody',
    defaultMessage: 'ESCROW: Escrow Agents help ensure that marketplace transactions are carried out\n' +
    ' honestly and fairly. When you choose to become an Escrow Agent, you agree to settle\n' +
    ' disputes that may arise between buyers and sellers. If you are called upon to settle a\n' +
    ' dispute, you must review the evidence provided by both sides and make an impartial\n' +
    ' decision about whether to return funds to the buyer or release them to the seller. You\n' +
    ' receive a fee (in OmniCoins) from every transaction for which you are chosen as the\n' +
    ' escrow agent, regardless of whether or not you are called upon to settle a dispute.'
  },
  updateTransactionFee: {
    id: 'Settings.updateTransactionFee',
    defaultMessage: 'Update data transaction fee: '
  },
  xom: {
    id: 'Settings.xom',
    defaultMessage: 'XOM'
  },
});

class PublicData extends Component {
  static updatePublicData() {
    console.log('Update data');
  }

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

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="check-form">
        <div className="description">
          <div className="check-container">
            <Image src={this.getReferrerIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleReferrer} />
          </div>
          <div className="description-text">
            <p className="title">{formatMessage(messages.referrerTitle)}</p>
            <div>
              {formatMessage(messages.referrerBody)}
            </div>
          </div>
        </div>
        <div className="description">
          <div className="check-container">
            <Image src={this.getPublisherIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.togglePublisher} />
          </div>
          <div className="description-text">
            <p className="title">{formatMessage(messages.publisherTitle)}</p>
            <div>
              {formatMessage(messages.publisherBody)}
              <a>DynDNS</a> {formatMessage(messages.or)} <a>NoIP</a>.
            </div>
          </div>
        </div>
        <div className="description">
          <div className="check-container">
            <Image src={this.getTransactionIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleTransactionProcessor} />
          </div>
          <div className="description-text">
            <p className="title">{formatMessage(messages.processorTitle)}</p>
            <div>
              {formatMessage(messages.processorBody)}
            </div>
          </div>
        </div>
        <div className="description">
          <div className="check-container">
            <Image src={this.getEscrowIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleEscrow} />
          </div>
          <div className="description-text">
            <p className="title">{formatMessage(messages.escrowTitle)}</p>
            <div>
              {formatMessage(messages.escrowBody)}
            </div>
          </div>
        </div>
        <div className="bottom-detail">
          <Button content="UPDATE" onClick={PublicData.updatePublicData} className="button--green-bg" />
          <div className="labels">
            <span>{formatMessage(messages.updateTransactionFee)}</span>
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
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

PublicData.defaultProps = {
  accountSettingsActions: {},
  account: {},
  intl: {},
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
)(injectIntl(PublicData));
