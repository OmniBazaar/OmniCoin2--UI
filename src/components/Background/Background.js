/**
 * Created by denissamohvalov on 12.02.18.
 */
import React, {Component} from 'react';

import BackgroundImage from '../../assets/images/main-bg.jpg';
import Logo from '../../assets/images/logo.png'
import './background.scss'
export default class Background extends Component {
    render() {
        return (
            <div className="background-container" style={{backgroundImage: `url(${BackgroundImage})`}}>
                <div className="header">
                    <img src={Logo} width={300} height={100}></img>
                    <span>Comunity-Owned Peer-to-Peer Marketplace</span>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
                <div className="footer">
                    <a href="#">Facebook</a>
                    <span>|</span>
                    <a href="#">Twitter</a>
                    <span>|</span>
                    <a href="#">Google+</a>
                    <span>|</span>
                    <a href="#">Linkedin</a>
                </div>
            </div>
        )
    }
}
