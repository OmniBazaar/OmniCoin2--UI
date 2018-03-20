import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Icon, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import { generateKeyFromPassword } from '../../../../services/blockchain/utils/wallet';

import UserIcon from './images/th-user-white.svg';
import LockIcon from './images/btn-lock-hover.svg';
import './account-footer.scss';

const iconSize = 20;
const iconLockSize = 25;

class AccountFooter extends Component {
  getPubKey() {
    const { username, password } = this.props.auth.currentUser;
    const key = generateKeyFromPassword(username, 'active', password);
    return key.privKey.toPublicKey().toPublicKeyString('BTS');
  }

  renderTrigger() {
    return (
      <div className="menu-item account">
        <Image src={UserIcon} width={iconSize} height={iconSize} />
        <div>
          <span>{this.props.auth.currentUser.username}</span>
          <div className="code">
            <span className="bold">{this.getPubKey()}</span>
            <Icon name="caret down" width={iconSize} height={iconSize} />
          </div>
        </div>
        <Image src={LockIcon} width={iconLockSize} height={iconLockSize} />
      </div>
    );
  }

  render() {
    return (
      <Popup
        trigger={this.renderTrigger()}
        flowing
        hoverable
        position="top center"
      >
        <SettingsMenu />
      </Popup>
    );
  }
}
export default connect(state => ({ ...state.default }), )(AccountFooter);
