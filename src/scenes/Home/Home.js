import React, {Component} from 'react';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

import './home.scss';
import Burger from './images/hamburger-hover.svg';
import BackgroundImage from './images/sidebar-bg@2x.jpg';
import SidebarLogo from './images/logo-sidebar.svg';


export default class Home extends Component {
    state = { visible: true };

    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        const { visible } = this.state;
        let sideBarClass = visible ? "sidebar visible" : "sidebar";
        let logoClass = visible ? "" : "hidden";
        return (

            <div className="home-container">
                <div className={sideBarClass} style={{backgroundImage: `url(${BackgroundImage})`}}>
                    <div className="header">
                        <img className={logoClass} src={SidebarLogo} width={200} height={40}/>
                        <img src={Burger} width={20} height={20} onClick={this.toggleVisibility}/>
                    </div>
                </div>
                <div className="home-content">
                </div>
            </div>
        )
    }
}