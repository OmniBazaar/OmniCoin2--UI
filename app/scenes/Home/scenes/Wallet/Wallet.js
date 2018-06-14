/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Tab, Image } from 'semantic-ui-react';
import hash from 'object-hash';
import { toastr } from 'react-redux-toastr';

import Header from '../../../../components/Header';
import BitcoinWalletDetail from './components/BitcoinWalletDetail/BitcoinWalletDetail';
import AddBitcoinWallet from './components/AddBitcoinWallet/AddBitcoinWallet';
import AddBitcoinAddress from './components/AddBitcoinAddress/AddBitcoinAddress';
import { toggleModal, toggleAddAddressModal } from '../../../../services/blockchain/bitcoin/bitcoinActions';
import {
  getBitcoinWallets,
  getOmniCoinWallets,
} from '../../../../services/wallet/walletActions';
import {
  getWallets
} from '../../../../services/blockchain/bitcoin/bitcoinActions';
import {
  encrypt, decrypt
} from '../../../../services/blockchain/bitcoin/services';
import AddIcon from '../../images/btn-add-image.svg';

import messages from './messages';
import './wallet.scss';
import StartGuide from '../../components/StartGuide/StartGuide';

class Wallet extends Component {
  constructor(props) {
    super(props);

    this.openWalletModal = this.openWalletModal.bind(this);
    this.onClickAddWallet = this.onClickAddWallet.bind(this);
    this.onClickAddAddress = this.onClickAddAddress.bind(this);
  }

  componentWillMount() {
    this.props.bitcoinActions.getWallets();
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (nextProps.bitcoin.error && !this.props.bitcoin.error) {
      toastr.error(formatMessage(messages.error), nextProps.bitcoin.error);
    }
  }

  onClickAddWallet() {
    this.props.bitcoinActions.toggleModal();
  }

  onClickAddAddress() {
    this.props.bitcoinActions.toggleAddAddressModal();
  }

  openWalletModal() {

  }

  getBitcoinContent() {
    const { wallets, guid } = this.props.bitcoin;
    const elements = wallets.map((wallet, index) => (
      <BitcoinWalletDetail
        key={hash(wallet)}
        walletKey={`wallet-${index}`}
        openWalletModal={this.openWalletModal}
        address={wallet.receiveAddress}
        label={wallet.label}
        guid={guid}
        balance={wallet.balance}
      />
    ));
    if (guid) {
      elements.push(<div className="add-icon">
        <Image
          src={AddIcon}
          width={100}
          height={100}
          onClick={this.onClickAddAddress}
        />
                    </div>);
    }
    return elements;
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div ref={container => { this.container = container; }} className="container wallet">
        <Header
          hasButton
          buttonContent={formatMessage(messages.addWallet)}
          className="button--green-bg"
          title="Wallets"
          loading={this.props.bitcoin.loading}
          onClick={this.onClickAddWallet}
        />
        <div className="body">
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
               {
                 menuItem: 'BitCoin',
                 render: () =>
                   (<Tab.Pane>
                     {this.props.bitcoin.wallets.length ?
                       <div className="content">
                         {this.getBitcoinContent()}
                       </div>
                    :
                       <div className="no-wallet-yet">
                         <span>{formatMessage(messages.noWalletYet)}</span>
                       </div>
                   }
                   </Tab.Pane>)
               },
             ]}
          />
          <StartGuide />
        </div>
        <AddBitcoinWallet />
        <AddBitcoinAddress />
      </div>
    );
  }
}

Wallet.propTypes = {
  walletActions: PropTypes.shape({
    getBitcoinWallets: PropTypes.func,
    getOmniCoinWallets: PropTypes.func
  })
};

Wallet.defaultProps = {
  walletActions: {},
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array,
    guid: PropTypes.string,
    loading: PropTypes.bool
  }).isRequired,
  bitcoinActions: PropTypes.shape({
    toggleModal: PropTypes.func,
    toggleAddAddressModal: PropTypes.func,
    getWallets: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    walletActions: bindActionCreators({ getBitcoinWallets, getOmniCoinWallets }, dispatch),
    bitcoinActions: bindActionCreators({
      toggleModal,
      toggleAddAddressModal,
      getWallets
    }, dispatch),
  }),
)(injectIntl(Wallet));
