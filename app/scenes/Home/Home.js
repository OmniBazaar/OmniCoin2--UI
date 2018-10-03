import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Idled from 'react-idled';
import {
  Route,
  NavLink,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';

import Escrow from './scenes/Escrow/Escrow';
import Mail from './scenes/Mail/Mail';
import Marketplace from './scenes/Marketplace/Marketplace';
import Processors from './scenes/Processors/Processors';
import Settings from './scenes/Settings/Settings';
import Preferences from './scenes/Preferences/Preferences';
import Support from './scenes/Support/Support';
import IdentityVerificationForm from './scenes/IdentityVerification/IdentityVerificationForm';
import Transfer from './scenes/Transfer/Transfer';
import Wallet from './scenes/Wallet/Wallet';
import Exchange from './scenes/Exchange/Exchange';
import Listing from './scenes/Marketplace/scenes/Listing/Listing';
import MyListings from './scenes/Marketplace/scenes/Listing/scenes/MyListings/MyListings';
import FavoriteListings from './scenes/Marketplace/scenes/Listing/scenes/FavoriteListings/FavoriteListings';
import AddListing from './scenes/Marketplace/scenes/Listing/scenes/AddListing/AddListing';
import EditListing from './scenes/Marketplace/scenes/Listing/scenes/AddListing/EditListing';
import MyListingsDefaults from './scenes/Marketplace/scenes/Listing/scenes/MyListingsDefaults/MyListingsDefaults';
import ImportListings from './scenes/Marketplace/scenes/Listing/scenes/ImportListings/ImportListings';
import SearchResults from './scenes/Marketplace/scenes/Search/scenes/SearchResults/SearchResults';
import RecentSearches from './scenes/Marketplace/scenes/Search/scenes/RecentSearches/RecentSearches';
import SavedSearches from './scenes/Marketplace/scenes/Search/scenes/SavedSearches/SavedSearches';
import SearchPriority from './scenes/Marketplace/scenes/Search/scenes/SearchPriority/SearchPriority';
import SocialNetworksFooter from '../../components/SocialNetworksFooter/SocialNetworksFooter';
import ChainFooter from '../../components/ChainFooter/ChainFooter';
import AccountFooter from './components/AccountFooter/AccountFooter';
import StartGuide from './components/StartGuide/StartGuide';
import MyPurchases from './scenes/Marketplace/scenes/MyPurchases/MyPurchases';
import AccountBalance from './components/AccountBalance/AccountBalance';
import BalanceUpdateBackground from './components/AccountBalance/BalanceUpdateBackground';
import UpdateNotification from './components/UpdateNotification/UpdateNotification';
import PublisherUpdateNotification from './components/PublisherUpdateNotification/PublisherUpdateNotification';
import AccountSettingsStorage from '../../services/accountSettings/accountStorage';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

import './home.scss';
import '../../styles/_modal.scss';

import Burger from './images/hamburger-norm-press.svg';
import BackgroundImage from './images/sidebar-bg@2x.jpg';
import SidebarLogo from './images/oc-logo-small@2x.png';
import EscrowIcon from './images/sdb-escrow.svg';
import MailIcon from './images/sdb-mail.svg';
import MarketplaceIcon from './images/sdb-markeplace.svg';
import ProcessorsIcon from './images/sdb-processors.svg';
import SupportIcon from './images/sdb-support.svg';
import TransferIcon from './images/sdb-transfer.svg';
import WalletIcon from './images/sdb-wallet.svg';
import UserIcon from './images/th-user-white.svg';

import { showSettingsModal, showPreferencesModal } from '../../services/menu/menuActions';
import { setActiveCategory } from '../../services/marketplace/marketplaceActions';
import {
  getAccount,
  logout,
  requestAppVersion,
  getIdentityVerificationStatus,
  referralBonus
} from '../../services/blockchain/auth/authActions';
import { loadListingDefault } from '../../services/listing/listingDefaultsActions';
import { restartNode } from '../../services/blockchain/connection/connectionActions';
import { loadLocalPreferences } from '../../services/preferences/preferencesActions';
import { dhtReconnect } from '../../services/search/dht/dhtActions';
import { getWallets } from '../../services/blockchain/bitcoin/bitcoinActions';
import { getEthereumWallets } from '../../services/blockchain/ethereum/EthereumActions';
import { checkPublishersAlive } from '../../services/listing/listingActions';
import { subscribeForMail, mailReceived, loadFolder } from '../../services/mail/mailActions';
import MailTypes from '../../services/mail/mailTypes';

const iconSize = 20;


class Home extends Component {
  state = {
    visible: true,
    isSPVisible: false
  };

  componentDidMount() {
    const { currentUser } = this.props.auth;
    if (currentUser) {
      this.setState({
        isSPVisible: AccountSettingsStorage.isPublisherDataEmpty()
      });
      this.init(currentUser);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.connection.node && !this.props.connection.node) {
      this.props.authActions.getAccount(this.props.auth.currentUser.username);
    }
    if (nextProps.auth.currentUser && !this.props.auth.currentUser) {
      this.props.listingActions.checkPublishersAlive();
      this.init(nextProps.auth.currentUser);
    }

    if (nextProps.dht.error) {
      this.props.dhtActions.dhtReconnect();
    }
  }

  init(currentUser) {
    this.props.preferencesActions.loadLocalPreferences();
    this.props.bitcoinActions.getWallets();
    this.props.ethereumActions.getEthereumWallets();
    this.props.listingActions.loadListingDefault();
    this.props.connectionActions.restartNodeIfExists();
    this.props.dhtActions.dhtReconnect();
    this.props.authActions.requestAppVersion();
    this.props.authActions.getIdentityVerificationStatus(currentUser.username);
    this.props.listingActions.checkPublishersAlive();
    this.props.authActions.referralBonus();
    this.props.mailActions.loadFolder(currentUser.username, MailTypes.INBOX);
    this.mailSubscribe(currentUser);
  }

  mailSubscribe(currentUser) {
    const { username } = currentUser;
    this.props.mailActions.subscribeForMail(username, (recievedMailObjects) => {
      recievedMailObjects.forEach((mailObject) => {
        this.props.mailActions.mailReceived(mailObject.uuid);
      });
      this.props.mailActions.loadFolder(username, MailTypes.INBOX);
    });
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  toggleSettingsAccount = () => this.props.menuActions.showSettingsModal();

  togglePreferences = () => this.props.menuActions.showPreferencesModal();

  renderAccountSettings() {
    const { props } = this;

    if (props.menu.showSettings) {
      return (
        <Settings onClose={this.toggleSettingsAccount} />
      );
    }
  }

  renderPreferences() {
    const { props } = this;

    if (props.menu.showPreferences) {
      return (
        <Preferences onClose={this.togglePreferences} />
      );
    }
  }

  setActiveCategory = () => {
    if (this.props.menuActions.setActiveCategory) {
      this.props.menuActions.setActiveCategory('Marketplace.home');
    }
  };

  handleChange = ({ idle }) => {
    const { logoutTimeout } = this.props.preferences.preferences;
    logoutTimeout && idle && this.props.authActions.logout();
  };

  render() {
    const { identityVerificationStatus } = this.props.auth;
    const appVersion = localStorage.getItem('appVersion');
    const { visible } = this.state;
    let { logoutTimeout } = this.props.preferences.preferences;
    logoutTimeout *= 60000;
    const sideBarClass = cn('sidebar', visible ? 'visible' : '');
    const homeContentClass = cn('home-content', visible ? '' : 'shrink');


    if (!this.props.auth.currentUser) {
      if (!this.props.auth.lastLoginUserName) {
        return (<Redirect
          to={{
            pathname: '/signup',
          }}
        />);
      }

      return (<Redirect
        to={{
          pathname: '/login',
        }}
      />);
    }
    if (this.props.location.pathname === '/') {
      return (<Redirect
        to={{
          pathname: '/marketplace',
        }}
      />);
    }

    const { mail: { messages: { inbox } } } = this.props;

    const unreadMessages = (inbox || []).filter(email => !email.read_status);

    return (
      <div className="home-container">
        <ConfirmationModal
          isOpen={this.state.isSPVisible}
          onApprove={() => {
            this.setState({ isSPVisible: false });
            this.props.history.push('/search-priority');
          }}
          onCancel={() => {
            this.setState({ isSPVisible: false });
          }}
        >
          <FormattedMessage
            id="Home.publisherDataIsEmpty"
            defaultMessage="You didn't specify your search priority criteria. Do you wish to specify it now?"
          />
        </ConfirmationModal>
        <div className={sideBarClass} style={{ backgroundImage: `url(${BackgroundImage})` }}>
          <div className="top">
            <div className="header">
              <Image
                src={SidebarLogo}
                className="logo"
                width={150}
                height={40}
              />
              <Image
                src={Burger}
                height={iconSize}
                width={iconSize}
                className="burger"
                onClick={this.toggleVisibility}
              />
            </div>
            <div className="menu">
              <div className="menu">
                <NavLink to="/wallet" activeClassName="active" className="menu-item">
                  <Image src={WalletIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.wallets"
                    defaultMessage="Wallets"
                  />
                </NavLink>
                <NavLink to="/marketplace" activeClassName="active" className="menu-item" onClick={() => this.setActiveCategory()}>
                  <Image src={MarketplaceIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.marketplace"
                    defaultMessage="Marketplace"
                  />
                </NavLink>
                <NavLink to="/transfer" activeClassName="active" className="menu-item">
                  <Image src={TransferIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.transfer"
                    defaultMessage="Transfer"
                  />
                </NavLink>
                {identityVerificationStatus && identityVerificationStatus.verified &&
                  <NavLink to="/exchange" activeClassName="active" className="menu-item">
                    <Image src={TransferIcon} height={iconSize} width={iconSize}/>
                    <FormattedMessage
                      id="Home.exchange"
                      defaultMessage="Exchange"
                    />
                  </NavLink>
                }
                <NavLink to="/escrow" activeClassName="active" className="menu-item">
                  <Image src={EscrowIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.escrow"
                    defaultMessage="Escrow"
                  />
                </NavLink>
                <NavLink to="/processors" activeClassName="active" className="menu-item">
                  <Image src={ProcessorsIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.processors"
                    defaultMessage="Processors"
                  />
                </NavLink>
                <NavLink to="/mail" activeClassName="active" className={`menu-item${unreadMessages.length ? ' has-notifications' : ''}`}>
                  <Image src={MailIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.mail"
                    defaultMessage="Mail"
                  />
                  {unreadMessages.length > 0 && <span className="notifications-counter">{unreadMessages.length}</span>}
                </NavLink>
                <NavLink to="/start-guide" activeClassName="active" className="menu-item">
                  <Image src={UserIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="SettingsMenu.quickStart"
                    defaultMessage="Quick Start"
                  />
                </NavLink>
                <NavLink to="https://omnibazaar.helprace.com/" target="_blank" rel="noopener noreferrer" activeClassName="active" className="menu-item">
                  <Image src={SupportIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.support"
                    defaultMessage="Support"
                  />
                </NavLink>
                <NavLink to="/identity-verification" activeClassName="active" className={cn('menu-item', 'identity-verification')}>
                  <FormattedMessage
                    id="Home.IdentityVerification"
                    defaultMessage="Whitelist for Token Sale"
                  />
                  <span className="identity-verification-status">
                    {identityVerificationStatus && identityVerificationStatus.verified ? 'Verified' : 'Not Verified'}
                    {identityVerificationStatus && identityVerificationStatus.comment && <span className="tooltiptext">{ identityVerificationStatus.comment}</span>}
                  </span>
                </NavLink>
                <UpdateNotification />
                <PublisherUpdateNotification />
                {this.renderAccountSettings()}
                {this.renderPreferences()}
              </div>
            </div>
          </div>
          <div className="bottom">
            <AccountFooter />
            <AccountBalance />
            <SocialNetworksFooter />
            <div className="version">{`Version: ${appVersion}`}</div>
          </div>
        </div>
        <div className={homeContentClass}>
          <div className="route">
            <Route path="/start-guide" render={(props) => <StartGuide {...props} />} />
            <Route path="/escrow" render={(props) => <Escrow {...props} />} />
            <Route path="/mail" render={(props) => <Mail {...props} />} />
            <Route path="/exchange" render={(props) => <Exchange {...props} />} />
            <Route path="/marketplace" render={(props) => <Marketplace {...props} />} />
            <Route path="/processors" render={(props) => <Processors {...props} />} />
            <Route path="/settings" render={(props) => <Settings {...props} />} />
            <Route path="/support" render={(props) => <Support {...props} />} />
            <Route path="/identity-verification" render={(props) => <IdentityVerificationForm {...props} />} />
            <Route path="/transfer" render={(props) => <Transfer {...props} />} />
            <Route path="/wallet" render={(props) => <Wallet {...props} />} />
            <Route path="/listing/:id" render={(props) => <Listing {...props} />} />
            <Route path="/listings" render={(props) => <MyListings {...props} />} />
            <Route path="/my-purchases" render={(props) => <MyPurchases {...props} />} />
            <Route path="/favorite-listings" render={(props) => <FavoriteListings {...props} />} />
            <Route path="/add-listing" render={(props) => <AddListing {...props} />} />
            <Route path="/edit-listing/:id" render={(props) => <EditListing {...props} />} />
            <Route path="/listings-defaults" render={(props) => <MyListingsDefaults {...props} />} />
            <Route path="/import-listings" render={(props) => <ImportListings {...props} />} />
            <Route path="/search-results" render={(props) => <SearchResults {...props} />} />
            <Route path="/recent-searches" render={(props) => <RecentSearches {...props} />} />
            <Route path="/saved-searches" render={(props) => <SavedSearches {...props} />} />
            <Route path="/search-priority" render={(props) => <SearchPriority {...props} />} />
          </div>
          <ChainFooter />
        </div>
        <BalanceUpdateBackground />
        {logoutTimeout &&
          <Idled
            onChange={this.handleChange}
            timeout={logoutTimeout}
          />
        }
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    menuActions: bindActionCreators({
      showSettingsModal,
      showPreferencesModal,
      setActiveCategory
    }, dispatch),
    authActions: bindActionCreators({
      getAccount,
      logout,
      requestAppVersion,
      getIdentityVerificationStatus,
      referralBonus
    }, dispatch),
    listingActions: bindActionCreators({
      loadListingDefault,
      checkPublishersAlive
    }, dispatch),
    connectionActions: bindActionCreators({ restartNodeIfExists: restartNode }, dispatch),
    preferencesActions: bindActionCreators({
      loadLocalPreferences
    }, dispatch),
    dhtActions: bindActionCreators({ dhtReconnect }, dispatch),
    bitcoinActions: bindActionCreators({ getWallets }, dispatch),
    ethereumActions: bindActionCreators({ getEthereumWallets }, dispatch),
    mailActions: bindActionCreators({
      subscribeForMail,
      mailReceived,
      loadFolder
    }, dispatch)
  })
)(Home);

Home.propTypes = {
  connection: PropTypes.shape({
    node: PropTypes.object
  }),
  auth: PropTypes.shape({
    identityVerificationStatus: PropTypes.string,
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    lastLoginUserName: PropTypes.string,
    error: PropTypes.shape({}),
    loading: PropTypes.bool
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  menuActions: PropTypes.shape({
    showSettingsModal: PropTypes.func,
    showPreferencesModal: PropTypes.func,
    setActiveCategory: PropTypes.func
  }),
  authActions: PropTypes.shape({
    getIdentityVerificationStatus: PropTypes.func,
    getAccount: PropTypes.func,
    logout: PropTypes.func,
    requestAppVersion: PropTypes.func,
    referralBonus: PropTypes.func
  }),
  preferencesActions: PropTypes.shape({
    loadLocalPreferences: PropTypes.func
  }).isRequired,
  bitcoinActions: PropTypes.shape({
    getWallets: PropTypes.func
  }).isRequired,
  ethereumActions: PropTypes.shape({
    getEthereumWallets: PropTypes.func
  }).isRequired,
  listingActions: PropTypes.shape({
    loadListingDefault: PropTypes.func
  }).isRequired,
  connectionActions: PropTypes.shape({
    restartNodeIfExists: PropTypes.func
  }).isRequired,
  dhtActions: PropTypes.shape({
    dhtReconnect: PropTypes.func
  }),
  mail: PropTypes.shape({
    messages: PropTypes.shape({
      inbox: PropTypes.array,
    }),
  }).isRequired
};

Home.defaultProps = {
  connection: {},
  auth: null,
  menuActions: null,
  authActions: {},
  history: {},
  dhtActions: {}
};
