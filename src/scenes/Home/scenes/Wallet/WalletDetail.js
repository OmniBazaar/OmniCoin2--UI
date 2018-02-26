import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import UserIcon from './images/th-user.svg';

import './wallet.scss';

const iconSize = 20;

export const WalletDetail = (props) => {
  return (
    <div key={props.walletKey} className='wallet-detail'>
      <div className='info'>
        <Image src={UserIcon} width={iconSize} height={iconSize}/>
        <div className='top-detail'>
          <div className='title'>
            <span>Wallet</span>
            <div className='badge'>REGISTERED: {props.wallet.date}</div>
          </div>
          <span className='code'>{props.wallet.code}</span>
          <span className='accountId'>Account ID: {props.wallet.accountId}</span>
        </div>
      </div>
      <div className='balance'>
        Current Balance
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
};
