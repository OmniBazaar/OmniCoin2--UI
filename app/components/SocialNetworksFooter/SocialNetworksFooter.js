import React, {Component} from 'react';
import './social-networks-footer.scss';

export default class SocialNetworksFooter extends Component {
    render() {
        return (
            <div className="footer">
                <a href="#">Facebook</a>
                <span>|</span>
                <a href="#">Twitter</a>
                <span>|</span>
                <a href="#">Google+</a>
                <span>|</span>
                <a href="#">Linkedin</a>
            </div>
        );
    }
}
