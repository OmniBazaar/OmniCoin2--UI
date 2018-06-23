import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import UserIcon from '../../../../images/th-user.svg';
import OmniCoinBg from '../../images/bg-omnicoin.svg';
import OmniCoinIcon from '../../images/omnic.svg';

import '../../wallet.scss';

const iconSize = 20;
const iconSizeLg = 100;

const messages = defineMessages({
  wallet: {
    id: 'OmnicoinWalletDetail.wallet',
    defaultMessage: 'Wallet'
  },
  currentBalance: {
    id: 'OmnicoinWalletDetail.currentBalance',
    defaultMessage: 'Current Balance'
  }
});

const OmnicoinWalletDetail = (props) => {
  const { formatMessage } = props.intl;

  return (
    <div
      key={props.walletKey}
      className="wallet-detail"
      role="link"
      tabIndex={0}
      style={{ backgroundImage: `url("${OmniCoinBg}")`, backgroundSize: iconSizeLg, width: '520px' }}
    >
      <div className="info">
        <Image src={UserIcon} width={iconSize} height={iconSize} />
        <div className="top-detail">
          <div className="username">
            <span>{props.name}</span>
          </div>
          <span className="accountId">{props.id}</span>
          <span className="key">{props.publicKey}</span>
        </div>
      </div>
      <div className="info">
        <Image src={OmniCoinIcon} width={iconSize} height={iconSize} />
        <div className="top-detail">
          <div className="title">
            <span>{formatMessage(messages.currentBalance)}</span>
          </div>
          <span className="balance">{(props.balance) || 0} XOM</span>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(OmnicoinWalletDetail);

OmnicoinWalletDetail.defaultProps = {
  id: '',
  name: '',
  dateRegistered: '',
  balance: '',
};

OmnicoinWalletDetail.propTypes = {
  id: PropTypes.id,
  name: PropTypes.string,
  dateRegistered: PropTypes.date,
  balance: PropTypes.number.isRequired,
  publicKey: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};
