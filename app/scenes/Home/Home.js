import React, {Component} from 'react';
import {Sidebar, Segment, Button, Menu, Image, Icon, Header} from 'semantic-ui-react'
import cn from 'classnames';
import { FormattedMessage } from 'react-intl';

import {
    Route,
    NavLink,
    Redirect
} from 'react-router-dom';
import {connect} from 'react-redux';

import Escrow from './scenes/Escrow/Escrow';
import Mail from  './scenes/Mail/Mail';
import Marketplace from './scenes/Marketplace/Marketplace';
import Processors from './scenes/Processors/Processors';
import Settings from './scenes/Settings/Settings';
import Support from './scenes/Support/Support';
import Transfer from './scenes/Transfer/Transfer';
import Wallet from './scenes/Wallet/Wallet';
import SocialNetworksFooter from '../../components/SocialNetworksFooter/SocialNetworksFooter';

import './home.scss';
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

const iconSize = 20;

class Home extends Component {
    state = { visible: true };

    toggleVisibility = () => this.setState({visible: !this.state.visible});

    render() {
        const {visible} = this.state;
        let sideBarClass = cn("sidebar", visible ? "visible" : "");
        let homeContentClass = cn("home-content", visible ? "" : "shrink");
        if (!this.props.auth.currentUser) {
           return <Redirect
                to={{
                    pathname: "/signup",
                }}
            />
        }
        return (
            <div className="home-container">
                <div className={sideBarClass} style={{backgroundImage: `url(${BackgroundImage})`}}>
                    <div className="top">
                        <div className="header">
                            <Image src={SidebarLogo} width={150} height={40}/>
                            <Image
                                src={Burger}
                                height={iconSize}
                                width={iconSize}
                                className="burger"
                                onClick={this.toggleVisibility}/>
                        </div>
                        <div className="menu">
                            <div className="menu">
                                <NavLink to="/wallet" activeClassName='active' className="menu-item">
                                    <Image src={WalletIcon} height={iconSize} width={iconSize}/>
                                    <FormattedMessage
                                      id="Home.wallet"
                                      defaultMessage="Wallet"
                                    />
                                </NavLink>
                                <NavLink to="/marketplace" activeClassName='active' className="menu-item">
                                    <Image src={MarketplaceIcon} height={iconSize} width={iconSize}/>
                                    <FormattedMessage
                                      id="Home.marketplace"
                                      defaultMessage="Marketplace"
                                    />
                                </NavLink>
                                <NavLink to="/transfer" activeClassName='active' className="menu-item">
                                    <Image src={TransferIcon} height={iconSize} width={iconSize}/>
                                    <FormattedMessage
                                      id="Home.transfer"
                                      defaultMessage="Transfer"
                                    />
                                </NavLink>
                                <NavLink to="/escrow" activeClassName='active' className="menu-item">
                                    <Image src={EscrowIcon} height={iconSize} width={iconSize}/>
                                    <FormattedMessage
                                      id="Home.escrow"
                                      defaultMessage="Escrow"
                                    />
                                </NavLink>
                                <NavLink to="/processors" activeClassName='active' className="menu-item">
                                    <Image src={ProcessorsIcon} height={iconSize} width={iconSize}/>
                                    <FormattedMessage
                                      id="Home.processors"
                                      defaultMessage="Processors"
                                    />
                                </NavLink>
                                <NavLink to="/mail" activeClassName='active' className="menu-item">
                                    <Image src={MailIcon} height={iconSize} width={iconSize}/>
                                    <FormattedMessage
                                      id="Home.mail"
                                      defaultMessage="Mail"
                                    />
                                </NavLink>
                                <NavLink to="/support" activeClassName='active' className="menu-item">
                                    <Image src={SupportIcon} height={iconSize} width={iconSize}/>
                                    <FormattedMessage
                                      id="Home.support"
                                      defaultMessage="Support"
                                    />
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <SocialNetworksFooter/>
                    </div>
                </div>
                <div className={homeContentClass}>
                    <Route path="/escrow" render={(props) => <Escrow {...props} />}/>
                    <Route path="/mail" render={(props) => <Mail {...props} />}/>
                    <Route path="/marketplace" render={(props) => <Marketplace {...props} />}/>
                    <Route path="/processors" render={(props) => <Processors {...props} />}/>
                    <Route path="/settings" render={(props) => <Settings {...props} />}/>
                    <Route path="/support" render={(props) => <Support {...props} />}/>
                    <Route path="/transfer" render={(props) => <Transfer {...props} />}/>
                    <Route path="/wallet" render={(props) => <Wallet {...props} />}/>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => {
        return {...state.default}
    }
)(Home);
