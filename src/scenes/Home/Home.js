import React, {Component} from 'react';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'

import './home.scss';
import Burger from './images/hamburger-hover.svg';


export default class Home extends Component {
    state = { visible: false };

    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        const { visible } = this.state;
        let className = visible ? "show-sidebar" : "hide-sidebar";
        return (
            <div className="home-container">
                <button onClick={this.toggleVisibility}>Test</button>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar  as={Menu} animation='push' width='thin' visible={visible} icon='labeled' vertical inverted>
                        <Menu.Item name='home'>
                            <Icon name='home' />
                            Home
                        </Menu.Item>
                        <Menu.Item name='gamepad'>
                            <Icon name='gamepad' />
                            Games
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Segment basic>

                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}