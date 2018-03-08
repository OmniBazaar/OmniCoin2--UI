import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal, Tab, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import UserIcon from '../../images/th-user-white.svg';
import OmniIcon from '../../images/th-omnicoin.svg';
import CheckNormal from '../../images/ch-box-0-norm.svg';
import CheckPreNom from '../../images/ch-box-1-norm.svg';

import { getCurrentUser } from '../../../../services/blockchain/auth/authActions';
import {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
} from '../../../../services/accountSettings/accountActions';
import './settings.scss';

const iconSize = 20;

class Settings extends Component {
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

  publicData() {
    const { props } = this;
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
          <Button content="UPDATE" onClick={this.updatePublicData} className='button--green-bg' />
          <div className="labels">
            <span>Update data transaction fee: </span>
            <span className="amount">5 XOM</span>
          </div>
        </div>
      </div>
    );
  }

  _privateData() {
    return (
      <div>Private Data</div>
    );
  }

  _recentTransactions() {
    return (
      <div>Recent Transactions</div>
    );
  }

  _keys() {
    return (
      <div>Keys</div>
    );
  }

  _vote() {
    return (
      <div>Vote</div>
    );
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  _sideMenu() {
    return (
      <div>
        <div className="info">
          <Image src={UserIcon} width={iconSize} height={iconSize} />
          <div className="top-detail">
            <div className="title">
              <span>Account</span>
              <div className="badge-tag">REGISTERED</div>
            </div>
            <span className="username">username</span>
            <span className="accountId">Account ID: 234234</span>
          </div>
        </div>
        <div className="info">
          <Image src={OmniIcon} width={iconSize} height={iconSize} />
          <div className="top-detail">
            <div className="title">
              <span>Current Balance</span>
            </div>
            <span className="balance">658,482.55 XOM</span>
          </div>
        </div>
      </div>
    );
  }

  renderModal() {
    const { props } = this;

    return (
      <Modal size="large" open={props.menu.showSettings} onClose={this.close}>
        <Modal.Content>
          <div className="modal-container">
            <div className="sidebar settings visible">{this._sideMenu()}</div>
            <div className="modal-content">
              <Tab
                className="tabs"
                menu={{ secondary: true, pointing: true }}
                panes={[
                 {
                   menuItem: 'Public Data',
                   render: () => <Tab.Pane>{this.publicData()}</Tab.Pane>,
                 },
                 {
                   menuItem: 'Private Data',
                   render: () => <Tab.Pane>{this._privateData()}</Tab.Pane>,
                 },
                 {
                   menuItem: 'Recent Transactions',
                   render: () => <Tab.Pane>{this._recentTransactions()}</Tab.Pane>,
                 },
                 {
                   menuItem: 'Keys',
                   render: () => <Tab.Pane>{this._keys()}</Tab.Pane>,
                 },
                 {
                   menuItem: 'Vote',
                   render: () => <Tab.Pane>{this._vote()}</Tab.Pane>,
                 },
                ]}
              />
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    return this.renderModal();
  }
}

Settings.propTypes = {
  onClose: PropTypes.func,
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

Settings.defaultProps = {
  onClose: () => {},
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
)(Settings);
