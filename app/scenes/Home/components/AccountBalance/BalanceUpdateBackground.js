import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAccountBalance } from '../../../../services/blockchain/wallet/walletActions';

const updateInterval = 10000;

class BalanceUpdateBackground extends Component {
  componentWillMount() {
    this.schedule(this.props.account);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.blockchainWallet.loading && !nextProps.blockchainWallet.loading) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.schedule(nextProps.auth.account);
    }
  }

  requestBalance(account) {
    this.props.walletActions.getAccountBalance(account);
  }

  schedule(account) {
    this.timer = setTimeout(() => {
      this.requestBalance(account);
    }, updateInterval);
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
  }).isRequired
}

export default connect(
  state => ({
    auth: state.default.auth,
    blockchainWallet: state.default.blockchainWallet
  }),
  (dispatch) => ({
    walletActions: bindActionCreators({
      getAccountBalance
    }, dispatch)
  })
)(BalanceUpdateBackground);
