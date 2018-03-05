import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import UserIcon from '../images/th-user.svg';
import BitCoinIcon from '../images/th-bitcoin.svg';
import OmniCoinIcon from '../images/th-omnicoin.svg';
import OmniCoinIconLg from '../images/bg-omnicoin.svg';
import BitCoinIconLg from '../images/bg-bitcoin.svg';

import { CoinTypes } from '../constants';

import '../wallet.scss';

const iconSize = 20;
const iconSizeLg = 100;

export const WalletDetail = (props) => {
  const coinIcon = props.type === CoinTypes.OMNI_COIN ? OmniCoinIcon : BitCoinIcon;
  const coinIconLg = props.type === CoinTypes.OMNI_COIN ? OmniCoinIconLg : BitCoinIconLg;
  const currency = props.type === CoinTypes.OMNI_COIN ? 'XOM' : 'BTC';

  return (
    <div key={props.walletKey} className='wallet-detail' onClick={props.openWalletModal}
         style={{ backgroundImage: 'url("' + coinIconLg + '")', backgroundSize: iconSizeLg }}>
      <div className='info'>
        <Image src={UserIcon} width={iconSize} height={iconSize} />
        <div className='top-detail'>
          <div className='title'>
            <span>Wallet</span>
            <div className='badge'>REGISTERED: {props.wallet.date}</div>
          </div>
          <span className='code'>{props.wallet.code}</span>
          <span className='accountId'>Account ID: {props.wallet.accountId}</span>
        </div>
      </div>
      <div className='info'>
        <Image src={coinIcon} width={iconSize} height={iconSize} />
        <div className='top-detail'>
          <div className='title'>
            <span>Current Balance</span>
          </div>
          <span className='balance'>{props.wallet.balance} {currency}</span>
        </div>
      </div>
    </div>
  )
};

WalletDetail.defaultProps = {
  wallet: {},
  className: '',
  walletKey: '',
  type: '',
};

WalletDetail.propTypes = {
  wallet: PropTypes.object,
  className: PropTypes.string,
  walletKey: PropTypes.string,
  type: PropTypes.string,
  openWalletModal: PropTypes.func,
};
