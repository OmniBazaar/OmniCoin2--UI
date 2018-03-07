import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal, Tab, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import UserIcon from '../../images/th-user-white.svg';
import OmniIcon from '../../images/th-omnicoin.svg';
import CheckNorm from '../../images/ch-box-0-norm.svg';

import { getCurrentUser } from '../../../../services/blockchain/auth/authActions';
import './settings.scss';

const iconSize = 20;

const publicDataArr = [
  {
    id: 1,
    title: 'I\'d like to refer my friends to OmniBazaar.',
    description: 'REFERRER: During the initial phase of the OmniBazaar marketplace,\n' +
    '              you will receive a Referral Bonus of OmniCoins each time you refer a new user.\n' +
    '              As a Referrer, you agree to allow the OmniBazaar software to automatically send\n' +
    '              a small number of OmniCoins from your account to the new users you refer, to\n' +
    '              enable those new users to register their user names and get started in OmniBazaar.\n' +
    '              In exchange, you receive a commission (some OmniCoins) each time a user you referred\n' +
    '              buys or sells something in the OmniBazaar marketplace. In order to serve as a\n' +
    '              Referrer, you must keep the OmniBazaar application running on your computer.'
  },
  {
    id: 2,
    title: 'I would like to run a "shop" and publish listings for other users.',
    description: 'PUBLISHER: As a Publisher you receive OmniCoins for each new user listing published on your server ' +
    'but you must keep your server continuously running and available on the Internet. Check this box only if' +
    'you have installed and configured Couchbase Server (database) on this computer. You must also have either a static ' +
    'IP address or a DNS redirect service, such as DynDNS NoIP.'
  },
  {
    id: 3,
    title: 'I would like to apply to be a Transaction Processor.',
    description: 'TRANSACTION PROCESSOR:'
  },
  {
    id: 4,
    title: 'I\'m willing to perform the duties of an Escrow Agent.',
    description: 'ESCROW:'
  },
];

class Settings extends Component {
  static renderOptions() {
    return publicDataArr.map((data) => {
      const key = 'desc-' + data.id;
      return (
        <div key={key} className="description">
          <Image src={CheckNorm} width={iconSize} height={iconSize} />
          <div className="description-text">
            <p className="title">{data.title}</p>
            <div>{data.description}</div>
          </div>
        </div>
      );
    });
  }

  static publicData() {
    return (
      <div className="check-form">
        {Settings.renderOptions()}
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
                   render: () => <Tab.Pane>{Settings.publicData()}</Tab.Pane>,
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
};

Settings.defaultProps = {
  onClose: () => {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    menuActions: bindActionCreators({ getCurrentUser }, dispatch),
  }),
)(Settings);
