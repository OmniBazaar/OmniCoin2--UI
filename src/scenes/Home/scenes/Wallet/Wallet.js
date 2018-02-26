/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, { Component } from 'react';
import Header from '../../../../components/Header';
import { Tabs } from '../../../../components/Tabs/Tabs';
import { Tab } from '../../../../components/Tabs/Tab';
import { WalletDetail } from './WalletDetail';

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

export default class Wallet extends Component {
  onClickAddWallet() {
  }

  _omniCoinContent() {
    return omniCoinWallets.map(function (wallet, index) {
      return (
        <WalletDetail type='omniCoin' walletKey={'wallet-' + index} wallet={wallet} />
      );
    })
  }

  _bitCoinContent() {
    return bitCoinWallets.map(function (wallet, index) {
      return (
        <WalletDetail type='bitCoin' walletKey={'wallet-' + index} wallet={wallet} />
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
