import React, { Component } from 'react';
import { Dropdown, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {  injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getWallets
} from '../../../../../services/blockchain/bitcoin/bitcoinActions';
import messages from '../messages';

class BitcoinWalletDropdown extends Component {

  state = {
    options: [],
    disabled: false
  };

  componentWillMount() {
    this.props.bitcoinActions.getWallets();
  }

  onChange(e, data) {
    const { onChange } = this.props.input || this.props;
    if (onChange) {
      onChange(data.value);
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { value } = this.props.input || this.props;
    const { isGettingWallets, wallets } = this.props.bitcoin;
    const options = wallets.map(wallet => ({
        value: wallet.index,
        text: wallet.label || formatMessage(messages.defaultWalletLabel),
        key: wallet.index,
        description: `${wallet.balance} BTC`
    }));

    return (
      <Dropdown
        className="textfield"
        compact
        selection
        placeholder={this.props.placeholder}
        options={options}
        onChange={this.onChange.bind(this)}
        value={value}
        loading={isGettingWallets}
      />
    );
  }
}

BitcoinWalletDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired,
  bitcoinActions: PropTypes.shape({
    getWallets: PropTypes.func
  }),
  bitcoin: PropTypes.shape({
    isGettingWallets: PropTypes.bool,
    wallets: PropTypes.array
  })
};

export default connect(
  state => ({
    bitcoin: state.default.bitcoin
  }),
  (dispatch) => ({
    bitcoinActions: bindActionCreators({ getWallets }, dispatch)
  })
)(injectIntl(BitcoinWalletDropdown));
