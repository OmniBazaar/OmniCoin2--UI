/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Tab, Image, Loader, Button } from 'semantic-ui-react';
import hash from 'object-hash';
import { toastr } from 'react-redux-toastr';
const { shell } = require('electron');

import Header from '../../../../components/Header';
import BitcoinWalletDetail from './components/BitcoinWalletDetail/BitcoinWalletDetail';
import OmnicoinWalletDetail from './components/OmnicoinWalletDetail/OmnicoinWalletDetail';
import AddBitcoinWallet from './components/AddBitcoinWallet/AddBitcoinWallet';
import AddBitcoinAddress from './components/AddBitcoinAddress/AddBitcoinAddress';

import EthereumWalletDetail from './components/EthereumWalletDetail/EthereumWalletDetail';
import AddEthereumWallet from './components/AddEthereumWallet/AddEthereumWallet';
import AddEthereumAddress from './components/AddEthereumAddress/AddEthereumAddress';
import { toggleEthereumModal, toggleAddAddressEthereumModal, getEthereumWallets } from '../../../../services/blockchain/ethereum/EthereumActions';

import { toggleModal, toggleAddAddressModal } from '../../../../services/blockchain/bitcoin/bitcoinActions';
import {
  getBitcoinWallets,
  getEtherWallets,
  getOmniCoinWallets
} from '../../../../services/wallet/walletActions';

import { getAccountBalance } from '../../../../services/blockchain/wallet/walletActions';
import { getWallets } from '../../../../services/blockchain/bitcoin/bitcoinActions';

import AddIcon from '../../images/btn-add-image.svg';

import messages from './messages';
import settingsMessages from '../Settings/messages';
import Settings from '../Settings/Settings';
import './wallet.scss';
import { CoinTypes } from './constants';
import { TOKENS_IN_XOM } from '../../../../utils/constants';
import publicIp from "public-ip";

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
    this.openWalletModal = this.openWalletModal.bind(this);
    this.onClickAddWallet = this.onClickAddWallet.bind(this);
    this.onClickAddAddress = this.onClickAddAddress.bind(this);

    this.onClickAddEthereumWallet = this.onClickAddEthereumWallet.bind(this);
    this.onClickAddEthereumAddress = this.onClickAddEthereumAddress.bind(this);

    this.onTabChange = this.onTabChange.bind(this);
    this.onClickRefreshWallets = this.onClickRefreshWallets.bind(this);
  }

  componentWillMount() {
    this.props.bitcoinActions.getWallets();
    this.props.ethereumActions.getEthereumWallets();
    this.requestBalance();
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (nextProps.bitcoin.error && !this.props.bitcoin.error) {
      if (nextProps.bitcoin.error.toString().indexOf("Wallets that require email authorization are currently not supported in the Wallet API. Please disable this in your wallet settings, or add the IP address of this server to your wallet IP whitelist.") !== -1) {
        publicIp.v4().then(ip => {
          toastr.error(
            formatMessage(messages.error),
            formatMessage(messages.ipError, { ip }),
            {
              timeOut: 0
            }
          );
        });
      } else {
        toastr.error(formatMessage(messages.error), nextProps.bitcoin.error);
      }
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
        return CoinTypes.ETHEREUM;
    }
  }

  onClickAddWallet() {
    this.props.bitcoinActions.toggleModal();
  }

  onClickAddAddress() {
    this.props.bitcoinActions.toggleAddAddressModal();
  }

  onClickAddEthereumWallet() {
    this.props.ethereumActions.toggleEthereumModal();
  }

  onClickAddEthereumAddress() {
    this.props.bitcoinActions.toggleAddAddressEthereumModal();
  }

  onClickRefreshWallets() {
    this.state.activeTab == 1 ? this.props.bitcoinActions.getWallets() : this.props.ethereumActions.getEthereumWallets();
  }

  openLink(e, path) {
    e.preventDefault();
    shell.openExternal(path);
  }


  openWalletModal() {

  }

  onTabChange(e, data) {
    this.setState({
      activeTab: data.activeIndex
    });
  }

  getBitcoinContent() {
    const { wallets, guid } = this.props.bitcoin;
    const { formatMessage } = this.props.intl;
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
    if (this.props.bitcoin.isGettingWallets) {
      return (
        <div className="content">
          <div className="load-container"><Loader inline active /></div>
        </div>
      );
    }
    return (
      <div className="bitcoin-addresses">
        <div className="content">
          {elements}
        </div>
        <div className="note">
          <span>
            {formatMessage(messages.bitcoinNote)}{" "}
            <a href="https://login.blockchain.com/" onClick={(e) => this.openLink(e, "https://login.blockchain.com/")}>
              login.blockchain.com
            </a>
          </span><br />
          {formatMessage(messages.instructions)}<br />
          {formatMessage(messages.step1)}<br />
          {formatMessage(messages.step2)}<br />
          {formatMessage(messages.step3)}<br />
          {formatMessage(messages.step4)}<br />
        </div>
      </div>
    );
  }


  getEthereumContent() {
    const { address, balance, brainKey } = this.props.ethereum;
    const wallet = [
      <EthereumWalletDetail
        openWalletModal={this.openWalletModal}
        address={address}
        balance={balance}
        brainKey={brainKey}
      />
    ];
    if (brainKey) {
      wallet.push(<Button
        content="Export key"
        className="button--primary"
        onClick={() => this.downloadBrainKeyFile(brainKey)}
      />)
    }
    return wallet
  }

  downloadBrainKeyFile(brainKey) {
    var element = document.createElement("a");
    var file = new Blob([brainKey], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "wallet-brain-key.txt";
    element.click();
  }


  render() {
    const { formatMessage } = this.props.intl;
    const account = this.props.auth.account || {};
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
          loading={this.state.activeTab == 1 ? this.props.bitcoin.loading : this.props.ethereum.loading}
          onClick={this.state.activeTab == 1 ? this.onClickAddWallet : this.onClickAddEthereumWallet}
          refreshButton={this.state.activeTab}
          refreshButtonContent={formatMessage(messages.refreshWallet)}
          onRefresh={this.onClickRefreshWallets}
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
                        publicKey={account.active && account.active.key_auths[0][0]}
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
                            <div className="load-container"><Loader inline active /></div> :
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
                    {this.props.ethereum.address ?
                      <div className="content">
                        {
                          this.props.ethereum.isGettingWallets ?
                            <div className='load-container'><Loader inline active /></div> :
                            this.getEthereumContent()
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


        {modalEthereum.isOpen && <AddEthereumWallet />}
        {addAddressEthereumModal.isOpen && <AddEthereumAddress />}

      </div>
    );
  }
}

Wallet.propTypes = {
  walletActions: PropTypes.shape({
    getBitcoinWallets: PropTypes.func,
    getEtherWallets: PropTypes.func,
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
    address: PropTypes.string,
    loading: PropTypes.bool,
    balance: PropTypes.number,
    isGettingWallets: PropTypes.bool
  }).isRequired,
  ethereumActions: PropTypes.shape({
    toggleEthereumModal: PropTypes.func,
    toggleAddAddressEthereumModal: PropTypes.func,
    getEthereumWallets: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    walletActions: bindActionCreators({ getBitcoinWallets, getEtherWallets, getOmniCoinWallets, getAccountBalance }, dispatch),
    bitcoinActions: bindActionCreators({
      toggleModal,
      toggleAddAddressModal,
      getWallets
    }, dispatch),
    ethereumActions: bindActionCreators({
      toggleEthereumModal,
      toggleAddAddressEthereumModal,
      getEthereumWallets
    }, dispatch),
  }),
)(injectIntl(Wallet));
