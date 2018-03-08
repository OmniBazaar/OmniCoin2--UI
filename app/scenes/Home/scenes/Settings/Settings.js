import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal, Tab, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import UserIcon from '../../images/th-user-white.svg';
import OmniIcon from '../../images/th-omnicoin.svg';
import PublicData from './component/PublicData';
import PrivateData from './component/PrivateData';

import { getCurrentUser } from '../../../../services/blockchain/auth/authActions';
import './settings.scss';

const iconSize = 20;

class Settings extends Component {
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
      <Modal size="fullscreen" open={props.menu.showSettings} onClose={this.close}>
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
                   render: () => <Tab.Pane><PublicData /></Tab.Pane>,
                 },
                 {
                   menuItem: 'Private Data',
                   render: () => <Tab.Pane><PrivateData /></Tab.Pane>,
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
};

Settings.defaultProps = {
  onClose: () => {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({ getCurrentUser, }, dispatch),
  }),
)(Settings);
