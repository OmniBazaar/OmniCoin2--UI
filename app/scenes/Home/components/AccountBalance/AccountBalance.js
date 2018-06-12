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

const iconSize = 20;

class AccountBalance extends Component {
  componentWillMount() {
    const { account } = this.props.auth;
    if (account) {
      this.props.walletActions.getAccountBalance(this.props.auth.account);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.account !== this.props.auth.account && nextProps.auth.account) {
      this.props.walletActions.getAccountBalance(nextProps.auth.account);
    }
  }

  getBalance() {
    const { balance } = this.props.blockchainWallet;
    if (balance && balance.balance) {
      return balance.balance / 100000;
    }
    return 0;
  }

	render() {
    const { formatMessage } = this.props.intl;
		return (
			<div className="account-balance">
        <Image src={OmniIcon} width={iconSize} height={iconSize} />
        <div className="balance-info">
          <div className="title">
            <span>{formatMessage(messages.currentBalance)}</span>
          </div>
          <span className="balance">
            {this.getBalance()} {formatMessage(messages.xom)}
          </span>
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
)(injectIntl(AccountBalance));