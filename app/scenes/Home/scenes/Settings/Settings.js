import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import UserIcon from '../../images/th-user-white.svg';
import PublicData from './scenes/PublicData/PublicData';
import PrivateData from './scenes/PrivateData/PrivateData';
import RecentTransactions from './scenes/RecentTransactions/RecentTransactions';
import TransactionDetails from './scenes/RecentTransactions/components/TransactionDetails';
import AccountBalance from '../../components/AccountBalance/AccountBalance';
import './settings.scss';

import { getCurrentUser } from '../../../../services/blockchain/auth/authActions';
import {
  showDetailsModal,
  getPrivateData,
  getPublisherData
} from '../../../../services/accountSettings/accountActions';
import messages from './messages';


const iconSize = 20;

class Settings extends Component {
  constructor(props) {
    super(props);

    this.onCloseDetails = this.onCloseDetails.bind(this);
  }

  componentWillMount() {
    this.props.accountSettingsActions.getPrivateData();
    this.props.accountSettingsActions.getPublisherData();
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onCloseDetails() {
    this.props.accountSettingsActions.showDetailsModal();
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
            <span className="accountId">{formatMessage(messages.accountId)}: {account.id}</span>
          </div>
        </div>
        <AccountBalance />
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
      <Modal size="fullscreen" open={props.menu.showSettings} onClose={this.close} closeIcon>
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
  onClose: PropTypes.func,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
    }),
    account: PropTypes.shape({})
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Settings.defaultProps = {
  accountSettingsActions: {},
  onClose: () => {},
  auth: {},
  intl: {}
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      getCurrentUser,
      showDetailsModal,
      getPrivateData,
      getPublisherData
    }, dispatch)
  }),
)(injectIntl(Settings));
