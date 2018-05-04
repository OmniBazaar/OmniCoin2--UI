import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { showSettingsModal, showPreferencesModal } from '../../../../../../services/menu/menuActions';

import { logout } from '../../../../../../services/blockchain/auth/authActions';

import './menu.scss';

const messages = defineMessages({
  accountSettings: {
    id: 'SettingsMenu.accountSettings',
    defaultMessage: 'Account Settings'
  },
  preferences: {
    id: 'SettingsMenu.preferences',
    defaultMessage: 'Preferences'
  },
  logout: {
    id: 'SettingsMenu.logout',
    defaultMessage: 'Logout'
  }
});

class SettingsMenu extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    const { showSettingsModal, showPreferencesModal } = this.props.menuActions;
    const { logout } = this.props.authActions;
    return (
      <Grid centered textAlign="left" divided columns={1}>
        <Grid.Column textAlign="left">
          <div
            className="menu-option"
            onClick={showSettingsModal}
            onKeyDown={showSettingsModal}
            role="link"
            tabIndex={0}
          >
            {formatMessage(messages.accountSettings)}
          </div>
          <div
            className="menu-option"
            onClick={showPreferencesModal}
            onKeyDown={showPreferencesModal}
            role="link"
            tabIndex={0}
          >
            {formatMessage(messages.preferences)}
          </div>
          <div
            className="menu-option"
            onClick={logout}
            onKeyDown={logout}
            role="link"
            tabIndex={0}
          >
            {formatMessage(messages.logout)}
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

SettingsMenu.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  menuActions: PropTypes.shape({
    showSettingsModal: PropTypes.func,
    showPreferencesModal: PropTypes.func
  }),
  authActions: PropTypes.shape({
    logout: PropTypes.func
  })
};

SettingsMenu.defaultProps = {
  intl: {},
  menuActions: {},
  authActions: {}
};

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    authActions: bindActionCreators({ logout }, dispatch),
    menuActions: bindActionCreators({ showSettingsModal, showPreferencesModal }, dispatch),
  })
)(injectIntl(SettingsMenu));
