import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import UserIcon from '../../../../images/th-user.svg';
import EthereumIcon from '../../images/eth-small.svg';
import EthereumIconLg from '../../images/eth-large.svg';

import '../../wallet.scss';

const iconSize = 20;
const iconSizeLg = 100;

const messages = defineMessages({
  wallet: {
    id: 'EthereumWalletDetail.wallet',
    defaultMessage: 'Wallet'
  },
  currentBalance: {
    id: 'EthereumWalletDetail.currentBalance',
    defaultMessage: 'Current Balance'
  }
});

const EthereumWalletDetail = (props) => {
  const { formatMessage } = props.intl;

  return (
    <div
      className="wallet-detail"
      onClick={props.openWalletModal}
      onKeyDown={props.openWalletModal}
      role="link"
      tabIndex={0}
      style={{ backgroundImage: `url("${EthereumIconLg}")`, backgroundSize: iconSizeLg, marginBottom: '20px' }}
    >
      <div className="info">
        <Image src={UserIcon} width={iconSize} height={iconSize} />
        <div className="top-detail">
          <div className="title">
            <span>{props.label || formatMessage(messages.wallet)}</span>
          </div>
          <span className="code">{props.address}</span>
        </div>
      </div>
      <div className="info">
        <Image src={EthereumIcon} width={iconSize} height={iconSize} />
        <div className="top-detail">
          <div className="title">
            <span>{formatMessage(messages.currentBalance)}</span>
          </div>
          <span className="balance">{parseFloat(props.balance) || 0} ETH</span>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(EthereumWalletDetail);

EthereumWalletDetail.defaultProps = {
  openWalletModal: null,
  label: '',
};

EthereumWalletDetail.propTypes = {
  openWalletModal: PropTypes.func,
  address: PropTypes.string.isRequired,
  brainKey: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};
