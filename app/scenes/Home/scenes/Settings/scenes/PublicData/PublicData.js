import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Image, Input } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import ip from 'ip';
import { debounce } from 'lodash';
import cn from 'classnames';

import IpInput from './components/IpInput';
import CheckNormal from '../../../../images/ch-box-0-norm.svg';
import CheckPreNom from '../../../../images/ch-box-1-norm.svg';
import ConfirmationModal from '../../../../../../components/ConfirmationModal/ConfirmationModal';
import Checkbox from '../../../../../../components/Checkbox/Checkbox';

import { getCurrentUser, getAccount } from '../../../../../../services/blockchain/auth/authActions';
import { getAccountBalance } from '../../../../../../services/blockchain/wallet/walletActions';

import {
  setReferrer,
  setPublisher,
  setTransactionProcessor,
  setEscrow,
  updatePublicData,
  changeIpAddress,
  setBtcAddress,
} from '../../../../../../services/accountSettings/accountActions';
import '../../settings.scss';
import './public.scss';

const iconSize = 20;
const messages = defineMessages({
  referrerTitle: {
    id: 'Setting.referrerTitle',
    defaultMessage: 'I\'d like to refer my friends to OmniBazaar.'
  },
  referrerBody: {
    id: 'Setting.referrerBody',
    defaultMessage: 'REFERRER: During the initial phase of the OmniBazaar marketplace, you will receive a Referral Bonus of OmniCoins each time you refer a new user. You will also receive a referral fee (some OmniCoins) each time a user you referred buys or sells something in the OmniBazaar marketplace. Please provide the Bitcoin and Ether addresses where you wish to receive these referral fees.'
  },
  btcAddressTitle: {
    id: 'Setting.btcAddressTitle',
    defaultMessage: 'Bitcoin address'
  },
  ethAddressTitle: {
    id: 'Setting.ethAddressTitle',
    defaultMessage: 'Ethereum address'
  },
  publisherTitle: {
    id: 'Setting.publisherTitle',
    defaultMessage: 'I would like to run a "shop" and publish listings for other users.'
  },
  publisherBody: {
    id: 'Setting.publisherBody',
    defaultMessage: 'PUBLISHER: As a Publisher you receive OmniCoins for each new user listing published on your server but you must keep your server continuously running and available on the Internet. Check this box only if you have installed and configured the OmniBazaar Publisher Module (database) on this computer. You must also have either a static IP address or a DNS redirect service, such as'
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
    defaultMessage: 'TRANSACTION PROCESSOR: Transaction Processors are paid OmniCoins for processing the transactions of the other user in the marketplace. Because this is a well-paid and highly-responsible position, Transaction Processor are selected only from the most active participants in the marketplace. Referring new users, publishing listings for others, being known and trusted by other users, and having a good reputation in the marketplace all count toward being recognized as an "active participant" and qualifying to be a Transaction Processor.'
  },
  escrowTitle: {
    id: 'Settings.escrowTitle',
    defaultMessage: 'I\'m willing to perform the duties of an Escrow Agent.'
  },
  escrowBody: {
    id: 'Settings.escrowBody',
    defaultMessage: 'ESCROW: Escrow Agents help ensure that marketplace transactions are carried out honestly and fairly. When you choose to become an Escrow Agent, you agree to settle disputes that may arise between buyers and sellers. If you are called upon to settle a dispute, you must review the evidence provided by both sides and make an impartial decision about whether to return funds to the buyer or release them to the seller. You receive a fee (in OmniCoins) from every transaction for which you are chosen as the escrow agent, regardless of whether or not you are called upon to settle a dispute.'
  },
  updateTransactionFee: {
    id: 'Settings.updateTransactionFee',
    defaultMessage: 'Update'
  },
  update: {
    id: 'Settings.update',
    defaultMessage: 'Update'
  },
  successUpdate: {
    id: 'Settings.successUpdate',
    defaultMessage: 'Updated successfully'
  },
  failedUpdate: {
    id: 'Settings.failedUpdate',
    defaultMessage: 'Failed to update account'
  },
  publisherExists: {
    id: 'Settings.publisherExists',
    defaultMessage: 'There is an existing publisher for this PC'
  },
  invalidIp: {
    id: 'Settings.invalidIp',
    defaultMessage: 'IP address is invalid'
  },
  witnessRegisterFee: {
    id: 'Settings.witnessRegisterFee',
    defaultMessage: 'Witness registration fee is 5000 XOM. Are you sure you want to proceed?'
  },
  wantsToVote: {
    id: 'Settings.wantsToVote',
    defaultMessage: 'Vote for yourself'
  },
  customDownloadAddress: {
    id: 'Settings.customDownloadAddress',
    defaultMessage: 'Your custom OmniBazaar download address:'
  }
});

class PublicData extends Component {
  constructor(props) {
    super(props);

    this.toggleReferrer = this.toggleReferrer.bind(this);
    this.togglePublisher = this.togglePublisher.bind(this);
    this.toggleTransactionProcessor = this.toggleTransactionProcessor.bind(this);
    this.toggleEscrow = this.toggleEscrow.bind(this);
    this.updatePublicData = this.updatePublicData.bind(this);
    this.freezeSettings = this.freezeSettings.bind(this);
    this.onChangeIpAddress = debounce(this.onChangeIpAddress.bind(this), 500);

    this.state = {
      ip: '',
      wantsToVote: false,
      isModalOpen: false
    };
  }

  componentWillMount() {
    const { account } = this.props.auth;
    if (account.is_referrer !== this.props.account.referrer) {
      this.toggleReferrer();
    }
    if (account.is_a_publisher !== this.props.account.publisher) {
      this.togglePublisher();
    }
    if (account.is_an_escrow !== this.props.account.escrow) {
      this.toggleEscrow();
    }
    if (account.publisher_ip) {
      this.props.accountSettingsActions.changeIpAddress(account.publisher_ip);
    }
    if (account.is_a_processor !== this.props.account.transactionProcessor) {
      this.toggleTransactionProcessor();
    }
    // todo referrer
    this.freezeSettings();
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (this.props.account.loading && !nextProps.account.loading) {
      if (nextProps.account.error) {
        if (nextProps.account.error.message.indexOf('is already registered') !== -1) {
          toastr.error(formatMessage(messages.update), formatMessage(messages.publisherExists));
          return;
        }
        toastr.error(formatMessage(messages.update), formatMessage(messages.failedUpdate));
      } else {
        this.updateAccountInfo();
        toastr.success(formatMessage(messages.update), formatMessage(messages.successUpdate));
        this.props.walletActions.getAccountBalance(this.props.auth.account);
        this.freezeSettings();
      }
    }
  }

  updateAccountInfo() {
    this.props.authActions.getAccount(this.props.auth.currentUser.username);
  }

  freezeSettings() {
    const {
      referrer,
      publisher,
      transactionProcessor,
      escrow
    } = this.props.account;

    this.settings = {
      referrer, publisher, transactionProcessor, escrow
    };
  }

  setBtcAddress({ target: { value } }) {
    this.props.accountSettingsActions.setBtcAddress(value);
  }

  updatePublicData() {
    const { formatMessage } = this.props.intl;
    const { ipAddress, publisher } = this.props.account;
    if (publisher && !ip.isPublic(ipAddress)) {
      toastr.error(formatMessage(messages.update), formatMessage(messages.invalidIp));
      return;
    }
    this.props.accountSettingsActions.updatePublicData();
  }

  toggleReferrer() {
    this.props.accountSettingsActions.setReferrer();
  }

  togglePublisher() {
    this.props.accountSettingsActions.setPublisher();
  }

  toggleTransactionProcessor() {
    const { is_a_processor } = this.props.auth.account;
    const { transactionProcessor } = this.props.account;
    if (is_a_processor && !transactionProcessor) {
      this.props.accountSettingsActions.setTransactionProcessor(this.state.wantsToVote);
    } else if (!is_a_processor && !transactionProcessor) {
      this.toggleConfirmationModal();
    } else if (transactionProcessor && !is_a_processor) {
      this.props.accountSettingsActions.setTransactionProcessor(this.state.wantsToVote);
    }
  }


  toggleEscrow() {
    this.props.accountSettingsActions.setEscrow();
  }

  toggleConfirmationModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  confirmTransactionProcessor() {
    this.props.accountSettingsActions.setTransactionProcessor(this.state.wantsToVote);
    this.toggleConfirmationModal();
  }

  renderWitnessConfirmation() {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {formatMessage(messages.witnessRegisterFee)} <br />
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5px' }}>
          <Checkbox
            checked={this.state.wantsToVote}
            onChecked={() => this.setState({ wantsToVote: !this.state.wantsToVote })}
          />
          <span style={{ marginLeft: '3px' }}>
            {formatMessage(messages.wantsToVote)}
          </span>
        </div>
      </div>
    );
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

  onChangeIpAddress(ip) {
    this.props.accountSettingsActions.changeIpAddress(ip);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { account, auth, bitcoin: { wallets }, ethereum } = this.props;
    const btcWalletAddress = wallets.length ? wallets[0].receiveAddress : null;
    const ethWalletAddress = ethereum.address

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
        {account.referrer &&
        <div>
          <div className="ref-link-cont">
            <div className="ref-link-label">{formatMessage(messages.customDownloadAddress)}</div>
            <Input className="ref-link-input" value={`http://download.omnibazaar.com/support/download?ref=${auth.currentUser.username}`} />
          </div>
          <div className="ref-link-cont">
            <div className="ref-link-label">{`${formatMessage(messages.btcAddressTitle)}:`}</div>
            <Input
              className="ref-btc-input"
              defaultValue={account.btcAddress || auth.account.btc_address || btcWalletAddress}
              placeholder={formatMessage(messages.btcAddressTitle)}
              onChange={(data) => this.setBtcAddress(data)}
            />
          </div>
        </div>
        }
        <div className="description">
          <div className="check-container">
            <Image src={this.getPublisherIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.togglePublisher} />
          </div>
          <div className="description-text">
            <p className="title">{formatMessage(messages.publisherTitle)}</p>
            <div>
              {`${formatMessage(messages.publisherBody)} `}
              <a href="http://checkip.dyndns.com/" target="_blank">DynDNS</a> {` ${formatMessage(messages.or)} `} <a href="https://www.noip.com/" target="_blank">NoIP</a>.
            </div>
          </div>
        </div>
        {account.publisher &&
          <div className="ip">
            <span>IP: </span>
            <IpInput
              value={this.props.account.ipAddress}
              onChange={this.onChangeIpAddress.bind(this)}
            />
          </div>
        }
        <div className="description">
          <div className="check-container">
            <Image
              src={this.getTransactionIcon()}
              width={iconSize}
              height={iconSize}
              className={cn('checkbox', this.props.auth.account.is_a_processor ? 'disabled' : '')}
              onClick={this.toggleTransactionProcessor}
            />
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
          <Button
            loading={account.loading}
            content={formatMessage(messages.update)}
            onClick={this.updatePublicData}
            className="button--green-bg"
          />
          <div className="labels">
            <span>{formatMessage(messages.updateTransactionFee)}</span>
            <span className="amount">20 XOM</span>
          </div>
        </div>
        <ConfirmationModal
          isOpen={this.state.isModalOpen}
          onApprove={() => this.confirmTransactionProcessor()}
          onCancel={() => this.toggleConfirmationModal()}
        >
          {this.renderWitnessConfirmation()}
        </ConfirmationModal>

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
    updatePublicData: PropTypes.func,
    changeIpAddress: PropTypes.func,
    setBtcAddress: PropTypes.func,
  }),
  authActions: PropTypes.shape({
    getAccount: PropTypes.func
  }).isRequired,
  walletActions: PropTypes.shape({
    getAccountBalance: PropTypes.func
  }).isRequired,
  account: PropTypes.shape({
    referrer: PropTypes.bool,
    publisher: PropTypes.bool,
    transactionProcessor: PropTypes.bool,
    escrow: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.string,
    ipAddress: PropTypes.string
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  auth: PropTypes.shape({
    account: PropTypes.shape({
      ipAddress: PropTypes.string
    }),
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    })
  }).isRequired,
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array,
  }),
  ethereum: PropTypes.shape({
    wallet: PropTypes.object,
  }),
};

PublicData.defaultProps = {
  bitcoin: {},
  ethereum: {},
  accountSettingsActions: {},
  account: {},
  intl: {},
};

export default connect(
  state => ({
    ...state.default,
  }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      getCurrentUser,
      setReferrer,
      setBtcAddress,
      setPublisher,
      setTransactionProcessor,
      setEscrow,
      updatePublicData,
      changeIpAddress
    }, dispatch),
    walletActions: bindActionCreators({
      getAccountBalance
    }, dispatch),
    authActions: bindActionCreators({
      getAccount
    }, dispatch),
  })
)(injectIntl(PublicData));
