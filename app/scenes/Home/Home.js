import React, { Component } from 'react';
import { Image, Icon, Popup } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

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
import SettingsMenu from './components/AccountFooter/components/SettingsMenu/SettingsMenu';
import Support from './scenes/Support/Support';
import Transfer from './scenes/Transfer/Transfer';
import Wallet from './scenes/Wallet/Wallet';
import SocialNetworksFooter from '../../components/SocialNetworksFooter/SocialNetworksFooter';
import ChainFooter from '../../components/ChainFooter/ChainFooter';
import AccountFooter from './components/AccountFooter/AccountFooter';

import './home.scss';
import '../../styles/_modal.scss';

import Burger from './images/hamburger-norm-press.svg';
import BackgroundImage from './images/sidebar-bg@2x.jpg';
import SidebarLogo from './images/logo-sidebar.svg';
import EscrowIcon from './images/sdb-escrow.svg';
import MailIcon from './images/sdb-mail.svg';
import MarketplaceIcon from './images/sdb-markeplace.svg';
import ProcessorsIcon from './images/sdb-processors.svg';
import SupportIcon from './images/sdb-support.svg';
import TransferIcon from './images/sdb-transfer.svg';
import WalletIcon from './images/sdb-wallet.svg';

import { showSettingsModal, showPreferencesModal } from '../../services/menu/menuActions';

const iconSize = 20;


class Home extends Component {
  state = { visible: true };

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

  render() {
    const { visible } = this.state;
    const sideBarClass = cn('sidebar', visible ? 'visible' : '');
    const homeContentClass = cn('home-content', visible ? '' : 'shrink');
    if (!this.props.auth.currentUser) {
      return (<Redirect
        to={{
                  pathname: '/signup',
              }}
      />);
    }
    return (
      <div className="home-container">
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
                    id="Home.wallet"
                    defaultMessage="Wallet"
                  />
                </NavLink>
                <NavLink to="/marketplace" activeClassName="active" className="menu-item">
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
                <NavLink to="/mail" activeClassName="active" className="menu-item">
                  <Image src={MailIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.mail"
                    defaultMessage="Mail"
                  />
                </NavLink>
                <NavLink to="/support" activeClassName="active" className="menu-item">
                  <Image src={SupportIcon} height={iconSize} width={iconSize} />
                  <FormattedMessage
                    id="Home.support"
                    defaultMessage="Support"
                  />
                </NavLink>
                {this.renderAccountSettings()}
                {this.renderPreferences()}
              </div>
            </div>
          </div>
          <div className="bottom">
            <AccountFooter />
            <SocialNetworksFooter />
          </div>
        </div>
        <div className={homeContentClass}>
          <div className="route">
            <Route path="/escrow" render={(props) => <Escrow {...props} />} />
            <Route path="/mail" render={(props) => <Mail {...props} />} />
            <Route path="/marketplace" render={(props) => <Marketplace {...props} />} />
            <Route path="/processors" render={(props) => <Processors {...props} />} />
            <Route path="/settings" render={(props) => <Settings {...props} />} />
            <Route path="/support" render={(props) => <Support {...props} />} />
            <Route path="/transfer" render={(props) => <Transfer {...props} />} />
            <Route path="/wallet" render={(props) => <Wallet {...props} />} />
          </div>
          <ChainFooter />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    menuActions: bindActionCreators({ showSettingsModal, showPreferencesModal }, dispatch),
  })
)(Home);

Home.propTypes = {
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    error: PropTypes.shape({}),
    accountExists: PropTypes.bool,
    loading: PropTypes.bool
  }),
  menuActions: PropTypes.shape({
    showSettingsModal: PropTypes.func,
    showPreferencesModal: PropTypes.func
  })

};

Home.defaultProps = {
  auth: null,
  menuActions: null
};
