import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import UserIcon from '../../images/th-user-white.svg';
import OmniIcon from '../../images/th-omnicoin.svg';
import PublicData from './scenes/PublicData/PublicData';
import PrivateData from './scenes/PrivateData/PrivateData';
import RecentTransactions from './scenes/RecentTransactions/RecentTransactions';
import TransactionDetails from './scenes/RecentTransactions/components/TransactionDetails';
import Keys from './scenes/Keys/Keys';
import Vote from './scenes/Vote/Vote';
import './settings.scss';

import { getCurrentUser } from '../../../../services/blockchain/auth/authActions';
import {
  showDetailsModal,
  getPrivateData,
  getPublisherData
} from '../../../../services/accountSettings/accountActions';
import { getAccountBalance } from '../../../../services/blockchain/wallet/walletActions';


const iconSize = 20;

const messages = defineMessages({
  account: {
    id: 'Settings.account',
    defaultMessage: 'Account'
  },
  registered: {
    id: 'Settings.registered',
    defaultMessage: 'REGISTERED'
  },
  xom: {
    id: 'Settings.xom',
    defaultMessage: 'XOM'
  },
  accountId: {
    id: 'Settings.accountId',
    defaultMessage: 'Account ID'
  },
  currentBalance: {
    id: 'Settings.currentBalance',
    defaultMessage: 'Current Balance'
  },
  publicData: {
    id: 'Settings.publicData',
    defaultMessage: 'Public Data'
  },
  privateData: {
    id: 'Settings.privateData',
    defaultMessage: 'Private Data'
  },
  recentTransactions: {
    id: 'Settings.recentTransactions',
    defaultMessage: 'Recent Transactions'
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);

    this.onCloseDetails = this.onCloseDetails.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }

  componentWillMount() {
    this.props.accountSettingsActions.getPrivateData();
    this.props.accountSettingsActions.getPublisherData();
  }

  componentDidMount() {
    this.props.walletActions.getAccountBalance(this.props.auth.account);
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onCloseDetails() {
    this.props.accountSettingsActions.showDetailsModal();
  }

  getBalance() {
    const { balance } = this.props.blockchainWallet;
    if (balance && balance.balance) {
      return balance.balance / 100000;
    }
    return 0;
  }

  sideMenu() {
    const { formatMessage } = this.props.intl;
    const { username } = this.props.auth.currentUser;
    const { account } = this.props.auth;
    return (
      <div>
        <div className="info">
          <Image src={UserIcon} width={iconSize} height={iconSize} />
          <div className="top-detail">
            <div className="title">
              <span>{formatMessage(messages.account)}</span>
              <div className="badge-tag">{formatMessage(messages.registered)}</div>
            </div>
            <span className="username">{username || 'Username'}</span>
            <span className="accountId">{formatMessage(messages.accountId)}: {account['id']}</span>
          </div>
        </div>
        <div className="info">
          <Image src={OmniIcon} width={iconSize} height={iconSize} />
          <div className="top-detail">
            <div className="title">
              <span>{formatMessage(messages.currentBalance)}</span>
            </div>
            <span className="balance">
              {this.getBalance()} {formatMessage(messages.xom)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { props } = this;
    const { formatMessage } = this.props.intl;
    const containerClass = classNames({
      overlay: true,
      'details-visible': props.account.showDetails,
    });

    return (
      <Modal size="fullscreen" open={props.menu.showSettings} onClose={this.close}>
        <Modal.Content>
          <div className="modal-container settings-container">
            <div className="sidebar settings visible">{this.sideMenu()}</div>
            <div className="modal-content side-menu">
              <Tab
                className="tabs"
                menu={{ secondary: true, pointing: true }}
                panes={[
                 {
                   menuItem: formatMessage(messages.publicData),
                   render: () => <Tab.Pane><PublicData /></Tab.Pane>,
                 },
                 {
                   menuItem: formatMessage(messages.privateData),
                   render: () => <Tab.Pane><PrivateData /></Tab.Pane>,
                 },
                 {
                   menuItem: formatMessage(messages.recentTransactions),
                   render: () => (
                     <Tab.Pane>
                       <RecentTransactions
                         rowsPerPage={5}
                         tableProps={{
                           sortable: true,
                           compact: true,
                           basic: 'very',
                           striped: true,
                           size: 'small'
                         }}
                       />
                     </Tab.Pane>),
                 },
                 {
                   menuItem: 'Keys',
                   render: () => <Tab.Pane className="keys-tab"><Keys /></Tab.Pane>,
                 },
                 {
                   menuItem: 'Vote',
                   render: () => (
                     <Tab.Pane>
                       <Vote
                         rowsPerPage={5}
                         tableProps={{
                           sortable: true,
                           compact: true,
                           basic: 'very',
                           striped: true,
                           size: 'small'
                         }}
                       />
                     </Tab.Pane>
                   ),
                 },
                ]}
              />
              <div
                className={containerClass}
                onClick={this.onCloseDetails}
                onKeyDown={this.onCloseDetails}
                role="link"
                tabIndex={0}
              />
              {props.account.showDetails &&
                <TransactionDetails
                  showCompose={props.account.showDetails}
                  onClose={this.onCloseDetails}
                />
              }
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

Settings.propTypes = {
  accountSettingsActions: PropTypes.shape({
    showDetailsModal: PropTypes.func,
    getPrivateData: PropTypes.func,
    getPublisherData: PropTypes.func,
    getCurrentUser: PropTypes.func
  }),
  walletActions: PropTypes.shape({
    getAccountBalance: PropTypes.func
  }),
  onClose: PropTypes.func,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
    }),
    account: PropTypes.shape({})
  }),
  blockchainWallet: PropTypes.shape({
    balance: PropTypes.shape({})
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Settings.defaultProps = {
  accountSettingsActions: {},
  onClose: () => {},
  auth: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      getCurrentUser,
      showDetailsModal,
      getPrivateData,
      getPublisherData
    }, dispatch),
    walletActions: bindActionCreators({
      getAccountBalance
    }, dispatch),
  }),
)(injectIntl(Settings));
