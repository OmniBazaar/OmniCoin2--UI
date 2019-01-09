import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAccountBalance } from '../../../../services/blockchain/wallet/walletActions';
import { getBitcoinBalance } from '../../../../services/blockchain/bitcoin/bitcoinActions';
import { getEthereumBalance } from '../../../../services/blockchain/ethereum/EthereumActions';

const updateInterval = 10000;
const btcUpdateInterval = 20000;
const ethUpdateInterval = 20000;

class BalanceUpdateBackground extends Component {
  componentWillMount() {
    this.schedule(this.props.account);
    this.scheduleBtc();
    this.scheduleEth();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.blockchainWallet.loading && !nextProps.blockchainWallet.loading) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.schedule(nextProps.auth.account);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (btcTimer) {
      clearInterval(this.btcTimer);
    }
    if (ethTimer) {
      clearInterval(this.ethTimer);
    }
  }

  requestBalance(account) {
    this.props.walletActions.getAccountBalance(account);
  }

  updateBtcBalance = () => {
    this.props.bitcoinActions.getBitcoinBalance();
  }

  updateEthBalance = () => {
    const { address, privateKey } = this.props.ethereum;
    if (address && privateKey) {
      this.props.ethereumActions.getEthereumBalance(address, privateKey, true);
    }
  }

  schedule(account) {
    this.timer = setTimeout(() => {
      this.requestBalance(account);
    }, updateInterval);
  }

  scheduleBtc() {
    this.btcTimer = setInterval(this.updateBtcBalance, btcUpdateInterval);
  }

  scheduleEth() {
    this.ethTimer = setInterval(this.updateEthBalance, ethUpdateInterval);
  }

  render() {
    return null;
  }
}

BalanceUpdateBackground.propTypes = {
  auth: PropTypes.shape({
    account: PropTypes.object
  }).isRequired,
  blockchainWallet: PropTypes.shape({
    balance: PropTypes.object
  }).isRequired,
  walletActions: PropTypes.shape({
    getAccountBalance: PropTypes.func
  }).isRequired,
  bitcoinActions: PropTypes.shape({
    getWallets: PropTypes.func
  }).isRequired,
  ethereumActions: PropTypes.shape({
    getEthereumBalance: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({
    auth: state.default.auth,
    blockchainWallet: state.default.blockchainWallet,
    ethereum: state.default.ethereum
  }),
  (dispatch) => ({
    walletActions: bindActionCreators({
      getAccountBalance
    }, dispatch),
    bitcoinActions: bindActionCreators({
      getBitcoinBalance
    }, dispatch),
    ethereumActions: bindActionCreators({
      getEthereumBalance
    }, dispatch)
  })
)(BalanceUpdateBackground);
