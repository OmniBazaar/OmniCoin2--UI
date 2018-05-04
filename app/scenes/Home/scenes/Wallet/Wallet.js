/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Header from '../../../../components/Header';
import { WalletDetail } from './component/WalletDetail';
import { CoinTypes } from './constants';

import {
  getBitcoinWallets,
  getOmniCoinWallets,
} from '../../../../services/wallet/walletActions';

import './wallet.scss';

const omniCoinWallets = [
  {
    code: 'gr4dfyu6789hg3vg5mn2',
    accountId: '3345345',
    date: '25 MAR 2018, 9:58PM',
    balance: 658482.55
  },
  {
    code: 'ar6dfyu3396ge0vg1zn7',
    accountId: '3345345',
    date: '25 MAR 2018, 9:58PM',
    balance: 658482.55
  },
  {
    code: 'hg5djuy8467ge5vg0fd3',
    accountId: '3345345',
    date: '25 MAR 2018, 9:58PM',
    balance: 658482.55
  }
];

const bitCoinWallets = [
  {
    code: 'gr4dfyu6789hg3vg5mn2',
    accountId: '3345345',
    date: '25 MAR 2018, 9:58PM',
    balance: 658482.55
  },
  {
    code: 'ar6dfyu3396ge0vg1zn7',
    accountId: '3345345',
    date: '25 MAR 2018, 9:58PM',
    balance: 658482.55
  },
];


class Wallet extends Component {
  constructor(props) {
    super(props);

    this.openWalletModal = this.openWalletModal.bind(this);
  }

  componentDidMount() {
    this.fetchWallets();
  }

  fetchWallets() {
    this.props.walletActions.getBitcoinWallets(bitCoinWallets);
    this.props.walletActions.getOmniCoinWallets(omniCoinWallets);
  }

  onClickAddWallet() {
  }

  openWalletModal() {

  }

  _omniCoinContent() {
    const self = this;
    const { props } = this;

    return props.wallet.omniCoinWallets.map((wallet, index) => (
      <WalletDetail
        key={`wall-${index}`}
        type={CoinTypes.OMNI_COIN}
        walletKey={`wallet-${index}`}
        wallet={wallet}
        openWalletModal={self.openWalletModal}
      />
    ));
  }

  _bitCoinContent() {
    const self = this;
    const { props } = this;

    return props.wallet.bitCoinWallets.map((wallet, index) => (
      <WalletDetail
        key={`wall-${index}`}
        type={CoinTypes.BIT_COIN}
        walletKey={`wallet-${index}`}
        wallet={wallet}
        openWalletModal={self.openWalletModal}
      />
    ));
  }

  render() {
    return (
      <div ref={container => { this.container = container; }} className="container wallet">
        <Header hasButton buttonContent="ADD WALLET" className="button--green-bg" title="Wallets" onClick={this.onClickAddWallet} />
        <div className="body">
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
                   {
                     menuItem: 'OmniCoin',
                     render: () => <Tab.Pane>{this._omniCoinContent()}</Tab.Pane>,
                   },
                   {
                     menuItem: 'BitCoin',
                     render: () => <Tab.Pane>{this._bitCoinContent()}</Tab.Pane>,
                   },
                 ]}
          />
          <div className="quick-start">
            <h1>Quick-start Guide! (Please read...)</h1>
            <h3>Welcome to OmniBazaar!</h3>
            <p>If this is the first time you have reached this screen, the OmniBazaar marketplace is currently being launched, configured and populated in the background. This process will take a few minutes ~ about the same amount of time it will take you to read this orientation page.</p>
          </div>
        </div>
      </div>
    );
  }
}

Wallet.propTypes = {
  walletActions: PropTypes.shape({
    getBitcoinWallets: PropTypes.func,
    getOmniCoinWallets: PropTypes.func
  })
};

Wallet.defaultProps = {
  walletActions: {}
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    walletActions: bindActionCreators({ getBitcoinWallets, getOmniCoinWallets }, dispatch),
  }),
)(Wallet);
