/**
 * Created by denissamohvalov on 12.02.18.
 */
import React, {Component} from 'react';
import { Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import BackgroundImage from '../../assets/images/main-bg.jpg';
import Logo from '../../assets/images/logo.png';
import SocialNetworksFooter from '../SocialNetworksFooter/SocialNetworksFooter';
import './background.scss';

export default class Background extends Component {
    render() {
        return (
            <div className="background-container" style={{backgroundImage: `url(${BackgroundImage})`}}>
                <div className="header">
                    <Image src={Logo} width={300} height={100}/>
                    <FormattedMessage
                      id="Background.header"
                      defaultMessage="Comunity-Owned Peer-to-Peer Marketplace"
                    />
                </div>
                <div className="content">
                    {this.props.children}
                </div>
                <SocialNetworksFooter/>
            </div>
        )
    }
}
