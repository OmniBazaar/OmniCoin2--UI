import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import { getAccountBalance } from '../../../../services/blockchain/wallet/walletActions';
import OmniIcon from '../../images/th-omnicoin.svg';
import messages from '../../scenes/Settings/messages';
import './style.scss';
import { TOKENS_IN_XOM, SATOSHI_IN_BTC } from '../../../../utils/constants';

const iconSize = 20;

class AccountBalance extends Component {
  componentWillMount() {
    const { account } = this.props.auth;
    if (account) {
      this.requestBalance(account);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.account !== this.props.auth.account && nextProps.auth.account) {
      this.requestBalance(nextProps.auth.account);
    }
  }

  requestBalance(account) {
    this.props.walletActions.getAccountBalance(account);
  }

  getBalance() {
    const { balance } = this.props.blockchainWallet;
    if (balance && balance.balance) {
      return balance.balance / TOKENS_IN_XOM;
    }
    return 0.00;
  }
  
  getBtcBalance() {
    const { wallets } = this.props.bitcoin;
    let balance = 0.00;
    if (wallets && wallets.length) {
      wallets.forEach(function (item) {
        balance = balance + item.balance
      });
    }
    return balance / SATOSHI_IN_BTC;
  }

  getEthBalance() {
    const { balance } = this.props.ethereum;
    let ethereumBalance = 0;
    if (balance) {
      ethereumBalance = balance
    }
    return ethereumBalance;
  }

  render() {
    const BTC = this.getBtcBalance();
    const ETH = this.getEthBalance();
    const { formatMessage } = this.props.intl;
    return (
      <div className="account-balance">
        <Image src={OmniIcon} width={iconSize} height={iconSize} />
        <div className="balance-info">
          <div className="title">
            <span>{formatMessage(messages.currentBalance)}</span>
          </div>
          <div className="balance">
            {this.getBalance()} {formatMessage(messages.xom)}
          </div>
          {!!BTC &&
            <div className="balance">
              {BTC} {formatMessage(messages.btc)}
            </div>
          }
          {!!ETH &&
            <div className="balance">
              {ETH} {formatMessage(messages.eth)}
            </div>
          }
        </div>
      </div>
    );
  }
}

AccountBalance.propTypes = {
  auth: PropTypes.shape({
    account: PropTypes.object
  }).isRequired,
  blockchainWallet: PropTypes.shape({
    balance: PropTypes.object
  }).isRequired,
  walletActions: PropTypes.shape({
    getAccountBalance: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({
    auth: state.default.auth,
    blockchainWallet: state.default.blockchainWallet,
    bitcoin: state.default.bitcoin,
    ethereum: state.default.ethereum
  }),
  (dispatch) => ({
    walletActions: bindActionCreators({
      getAccountBalance
    }, dispatch)
  })
)(injectIntl(AccountBalance));
