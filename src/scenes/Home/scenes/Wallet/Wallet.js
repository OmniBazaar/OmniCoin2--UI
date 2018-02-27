/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Header from '../../../../components/Header';
import { Tabs } from '../../../../components/Tabs/Tabs';
import { Tab } from '../../../../components/Tabs/Tab';
import { WalletDetail } from './WalletDetail';

import { CoinTypes } from './constants';

import {
  getBitcoinWallets,
  getOmniCoinWallets,
} from  '../../../../services/wallet/walletActions';

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

  componentDidMount () {
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
    let self = this;
    const { props } = this;

    return props.wallet.omniCoinWallets.map(function (wallet, index) {
      return (
        <WalletDetail
          key={'wall-' + index}
          type={CoinTypes.OMNI_COIN}
          walletKey={'wallet-' + index}
          wallet={wallet}
          openWalletModal={self.openWalletModal}
        />
      );
    })
  }

  _bitCoinContent() {
    let self = this;
    const { props } = this;

    return props.wallet.bitCoinWallets.map(function (wallet, index) {
      return (
        <WalletDetail
          key={'wall-' + index}
          type={CoinTypes.BIT_COIN}
          walletKey={'wallet-' + index}
          wallet={wallet}
          openWalletModal={self.openWalletModal}
        />
      );
    })
  }

  render() {
    return (
      <div ref={container => {this.container = container}} className='container wallet'>
        <Header hasButton buttonContent='ADD WALLET' className='button--green-bg' title='Wallets' onClick={this.onClickAddWallet} />
          <div className='body'>
            <Tabs>
              <Tab title='OmniCoin'>
                {this._omniCoinContent()}
              </Tab>
              <Tab title='BitCoin'>
                {this._bitCoinContent()}
              </Tab>
            </Tabs>
            <div className='quick-start'>
              <h1>Quick-start Guide! (Please read...)</h1>
              <h3>Welcome to OmniBazaar!</h3>
              <p>If this is the first time you have reached this screen, the OmniBazaar marketplace is currently being launched, configured and populated in the background. This process will take a few minutes ~ about the same amount of time it will take you to read this orientation page.</p>
            </div>
          </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return {...state.default}
  },
  (dispatch) => ({
    walletActions: bindActionCreators({ getBitcoinWallets, getOmniCoinWallets }, dispatch),
  }),
)(Wallet);
