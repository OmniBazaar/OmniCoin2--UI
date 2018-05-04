import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import UserIcon from '../../../../images/th-user.svg';
import BitCoinIcon from '../../images/th-bitcoin.svg';
import BitCoinIconLg from '../../images/bg-bitcoin.svg';

import '../../wallet.scss';

const iconSize = 20;
const iconSizeLg = 100;

const messages = defineMessages({
  wallet: {
    id: 'BitcoinWalletDetail.wallet',
    defaultMessage: 'Wallet'
  },
  guid: {
    id: 'BitcoinWalletDetail.guid',
    defaultMessage: 'Wallet GUID: '
  },
  currentBalance: {
    id: 'BitcoinWalletDetail.currentBalance',
    defaultMessage: 'Current Balance'
  }
});

const BitcoinWalletDetail = (props) => {
  const { formatMessage } = props.intl;

  return (
    <div
      key={props.walletKey}
      className="wallet-detail"
      onClick={props.openWalletModal}
      onKeyDown={props.openWalletModal}
      role="link"
      tabIndex={0}
      style={{ backgroundImage: `url("${BitCoinIconLg}")`, backgroundSize: iconSizeLg, width: '300px' }}
    >
      <div className="info">
        <Image src={UserIcon} width={iconSize} height={iconSize} />
        <div className="top-detail">
          <div className="title">
            <span>{props.label || formatMessage(messages.wallet)}</span>
          </div>
          <span className="code">{props.address}</span>
          <span className="accountId">{formatMessage(messages.guid)} {props.guid}</span>
        </div>
      </div>
      <div className="info">
        <Image src={BitCoinIcon} width={iconSize} height={iconSize} />
        <div className="top-detail">
          <div className="title">
            <span>{formatMessage(messages.currentBalance)}</span>
          </div>
          <span className="balance">{props.balance || 0} BTC</span>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(BitcoinWalletDetail);

BitcoinWalletDetail.defaultProps = {
  walletKey: '',
  openWalletModal: null,
  label: '',
};

BitcoinWalletDetail.propTypes = {
  walletKey: PropTypes.string.isRequired,
  openWalletModal: PropTypes.func,
  label: PropTypes.string,
  address: PropTypes.string.isRequired,
  guid: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};
