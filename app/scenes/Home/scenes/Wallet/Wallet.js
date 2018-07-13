/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Tab, Image, Loader } from 'semantic-ui-react';
import hash from 'object-hash';
import { toastr } from 'react-redux-toastr';

import Header from '../../../../components/Header';
import BitcoinWalletDetail from './components/BitcoinWalletDetail/BitcoinWalletDetail';
import OmnicoinWalletDetail from './components/OmnicoinWalletDetail/OmnicoinWalletDetail';
import AddBitcoinWallet from './components/AddBitcoinWallet/AddBitcoinWallet';
import AddBitcoinAddress from './components/AddBitcoinAddress/AddBitcoinAddress';

import EthereumWalletDetail from './components/EthereumWalletDetail/EthereumWalletDetail';
import AddEthereumWallet from './components/AddEthereumWallet/AddEthereumWallet';
import AddEthereumAddress from './components/AddEthereumAddress/AddEthereumAddress';
import { toggleModalEthereum, toggleAddAddressEthereumModal } from '../../../../services/blockchain/ethereum/ethereumActions';

import { toggleModal, toggleAddAddressModal, getWallets } from '../../../../services/blockchain/bitcoin/bitcoinActions';
import {
  getBitcoinWallets,
  getEthereumWallets,
  getOmniCoinWallets
} from '../../../../services/wallet/walletActions';
import { getAccountBalance } from '../../../../services/blockchain/wallet/walletActions';

import AddIcon from '../../images/btn-add-image.svg';

import messages from './messages';
import settingsMessages from '../Settings/messages';
import Settings from '../Settings/Settings';
import './wallet.scss';
import { CoinTypes } from "./constants";
import { TOKENS_IN_XOM } from "../../../../utils/constants";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
    this.openWalletModal = this.openWalletModal.bind(this);
    this.onClickAddWallet = this.onClickAddWallet.bind(this);
    this.onClickAddAddress = this.onClickAddAddress.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  componentWillMount() {
    this.props.bitcoinActions.getWallets();
    this.requestBalance();
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (nextProps.bitcoin.error && !this.props.bitcoin.error) {
      toastr.error(formatMessage(messages.error), nextProps.bitcoin.error);
    }
  }

  requestBalance() {
    this.props.walletActions.getAccountBalance(this.props.auth.account);
  }

  getBalance() {
    const { balance } = this.props.blockchainWallet;
    if (balance && balance.balance) {
      return balance.balance / TOKENS_IN_XOM;
    }
    return 0.00;
  }

  getCoinType(activeTab) {
    switch (activeTab) {
      case 0:
        return CoinTypes.OMNI_COIN;
      case 1:
        return CoinTypes.BIT_COIN;
      case 2:
        return CoinTypes.ETHERERUM;
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

  onTabChange(e, data) {
    this.setState({
      activeTab: data.activeIndex
    })
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

  
  getBitcoinContent() {
    const { wallets, guid } = this.props.ethereum;
    const elements = wallets.map((wallet, index) => (
      <EthereumWalletDetail
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
    const { account } = this.props.auth;
    const {
      addAddressModal,
      modal
    } = this.props.bitcoin;

    
    const {
      addAddressEthereumModal,
      modalEthereum
    } = this.props.ethereum;

    return (
      <div ref={container => { this.container = container; }} className="container wallet">
        <Header
          hasButton={this.state.activeTab}
          buttonContent={formatMessage(messages.addWallet)}
          className="button--green-bg"
          title="Wallets"
          loading={this.props.bitcoin.loading || this.props.ethereum.loading}
          onClick={this.onClickAddWallet}
        />
        <div className="body">
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            onTabChange={this.onTabChange}
            panes={[
              {
                menuItem: 'OmniCoin',
                render: () => (
                  <Tab.Pane>
                    <div className="content">
                      <OmnicoinWalletDetail
                        id={account.id}
                        name={account.name}
                        publicKey={account.active.key_auths[0][0]}
                        balance={this.getBalance()}
                      />
                    </div>
                  </Tab.Pane>
                )
              },
              {
                menuItem: 'BitCoin',
                render: () =>
                  (<Tab.Pane>
                    {this.props.bitcoin.wallets.length ?
                      <div className="content">
                        {
                          this.props.bitcoin.isGettingWallets ?
                            <div className='load-container'><Loader inline active /></div> :
                            this.getBitcoinContent()
                        }
                      </div>
                      :
                      <div className="no-wallet-yet">
                        <span>{formatMessage(messages.noWalletYet)}</span>
                      </div>
                    }
                  </Tab.Pane>)
              },
              {
                menuItem: 'Ethereum',
                render: () =>
                  (<Tab.Pane>
                    {this.props.ethereum.wallets.length ?
                      <div className="content">
                        {
                          this.props.ethereum.isGettingWallets ?
                            <div className='load-container'><Loader inline active /></div> :
                            this.getBitcoinContent()
                        }
                      </div>
                      :
                      <div className="no-wallet-yet">
                        <span>{formatMessage(messages.noWalletYet)}</span>
                      </div>
                    }
                  </Tab.Pane>)
              }
            ]}
          />
          <div className="content">
            <Settings
              coinType={this.getCoinType(this.state.activeTab)}
            />
          </div>
        </div>
        {modal.isOpen && <AddBitcoinWallet />}
        {addAddressModal.isOpen && <AddBitcoinAddress />}
      </div>
    );
  }
}

Wallet.propTypes = {
  walletActions: PropTypes.shape({
    getBitcoinWallets: PropTypes.func,
    getOmniCoinWallets: PropTypes.func
  }),
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array,
    guid: PropTypes.string,
    loading: PropTypes.bool,
    isGettingWallets: PropTypes.bool
  }).isRequired,
  bitcoinActions: PropTypes.shape({
    toggleModal: PropTypes.func,
    toggleAddAddressModal: PropTypes.func,
    getWallets: PropTypes.func
  }).isRequired,
  ethereum: PropTypes.shape({
    wallets: PropTypes.array,
    guid: PropTypes.string,
    loading: PropTypes.bool,
    isGettingWallets: PropTypes.bool
  }).isRequired,
  ethereumActions: PropTypes.shape({
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
    walletActions: bindActionCreators({ getBitcoinWallets, getOmniCoinWallets, getAccountBalance }, dispatch),
    bitcoinActions: bindActionCreators({
      toggleModal,
      toggleAddAddressModal,
      getWallets
    }, dispatch),
    ethereumActions: bindActionCreators({
      toggleEthereumModal,
      toggleAddAddressEthereumModal,
      getWallets
    }, dispatch),
  }),
)(injectIntl(Wallet));
