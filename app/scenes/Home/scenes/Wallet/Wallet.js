/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Tab, Image } from 'semantic-ui-react';
import hash from 'object-hash';
import PropTypes from 'prop-types';
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
import AddIcon from '../../images/btn-add-image.svg';

import './wallet.scss';


const messages = defineMessages({
  quickStart: {
    id: 'Wallet.quickStart',
    defaultMessage: 'Quick-start Guide! (Please read...)'
  },
  welcome: {
    id: 'Wallet.welcome',
    defaultMessage: 'Welcome to OmniBazaar!'
  },
  launch: {
    id: 'Wallet.launch',
    defaultMessage: 'If this is the first time you have reached this screen, the OmniBazaar marketplace is currently being launched, configured and populated in the background. This process will take a few minutes ~ about the same amount of time it will take you to read this orientation page.'
  },
  addWallet: {
    id: 'Wallet.addWallet',
    defaultMessage: 'ADD WALLET'
  },
  noWalletYet: {
    id: 'Wallet.noWalletYet',
    defaultMessage: 'You haven\'t added a wallet yet'
  },
  error: {
    id: 'Wallet.error',
    defaultMessage: 'Error'
  }
});


class Wallet extends Component {
  constructor(props) {
    super(props);

    this.openWalletModal = this.openWalletModal.bind(this);
    this.onClickAddWallet = this.onClickAddWallet.bind(this);
    this.onClickAddAddress = this.onClickAddAddress.bind(this);
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
          <div className="quick-start">
            <h1>{formatMessage(messages.quickStart)}</h1>
            <h3>{formatMessage(messages.welcome)}</h3>
            <p>{formatMessage(messages.launch)}</p>
          </div>
        </div>
        <AddBitcoinWallet />
        <AddBitcoinAddress />
      </div>
    );
  }
}

Wallet.propTypes = {
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array,
    guid: PropTypes.string,
    loading: PropTypes.bool
  }).isRequired,
  bitcoinActions: PropTypes.shape({
    toggleModal: PropTypes.func,
    toggleAddAddressModal: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    walletActions: bindActionCreators({ getBitcoinWallets, getOmniCoinWallets }, dispatch),
    bitcoinActions: bindActionCreators({ toggleModal, toggleAddAddressModal }, dispatch),
  }),
)(injectIntl(Wallet));
