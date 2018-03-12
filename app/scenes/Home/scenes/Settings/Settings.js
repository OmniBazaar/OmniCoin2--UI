import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import UserIcon from '../../images/th-user-white.svg';
import OmniIcon from '../../images/th-omnicoin.svg';
import PublicData from './components/PublicData';
import PrivateData from './components/PrivateData';
import RecentTransactions from './components/RecentTransactions';

import { getCurrentUser } from '../../../../services/blockchain/auth/authActions';
import './settings.scss';

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
  keys() {
    return (
      <div>Keys</div>
    );
  }

  vote() {
    return (
      <div>Vote</div>
    );
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  sideMenu() {
    const { formatMessage } = this.props.intl;
    const { username } = this.props.auth.currentUser;

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
            <span className="accountId">{formatMessage(messages.accountId)}: 234234</span>
          </div>
        </div>
        <div className="info">
          <Image src={OmniIcon} width={iconSize} height={iconSize} />
          <div className="top-detail">
            <div className="title">
              <span>{formatMessage(messages.currentBalance)}</span>
            </div>
            <span className="balance">658,482.55 {formatMessage(messages.xom)}</span>
          </div>
        </div>
      </div>
    );
  }

  renderModal() {
    const { props } = this;
    const { formatMessage } = this.props.intl;

    return (
      <Modal size="fullscreen" open={props.menu.showSettings} onClose={this.close}>
        <Modal.Content>
          <div className="modal-container">
            <div className="sidebar settings visible">{this.sideMenu()}</div>
            <div className="modal-content">
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
                   render: () => <Tab.Pane>{this.keys()}</Tab.Pane>,
                 },
                 {
                   menuItem: 'Vote',
                   render: () => <Tab.Pane>{this.vote()}</Tab.Pane>,
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
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
    })
  })
};

Settings.defaultProps = {
  onClose: () => {},
  auth: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({ getCurrentUser, }, dispatch),
  }),
)(injectIntl(Settings));
