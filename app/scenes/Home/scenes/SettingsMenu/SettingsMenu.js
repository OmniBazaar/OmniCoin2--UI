import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';

import { logout } from '../../../../services/blockchain/auth/authActions';

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
  constructor(props) {
    super(props);

    this.toggleAccount = this.toggleAccount.bind(this);
    this.togglePreferences = this.togglePreferences.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleAccount() {
    if (this.props.toggleAccount) {
      this.props.toggleAccount();
    }
  }

  togglePreferences() {
    if (this.props.togglePreferences) {
      this.props.togglePreferences();
    }
  }

  logout() {
    this.props.authActions.logout();
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <Grid centered textAlign="left" divided columns={1}>
        <Grid.Column textAlign="left">
          <div
            className="menu-option"
            onClick={this.toggleAccount}
            onKeyDown={this.toggleAccount}
            role="link"
            tabIndex={0}
          >
            {formatMessage(messages.accountSettings)}
          </div>
          <div
            className="menu-option"
            onClick={this.togglePreferences}
            onKeyDown={this.togglePreferences}
            role="link"
            tabIndex={0}
          >
            {formatMessage(messages.preferences)}
          </div>
          <div
            className="menu-option"
            onClick={this.logout}
            onKeyDown={this.logout}
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
  toggleAccount: PropTypes.func,
  togglePreferences: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

SettingsMenu.defaultProps = {
  toggleAccount: () => {},
  togglePreferences: () => {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    authActions: bindActionCreators({ logout }, dispatch)
  })
)(injectIntl(SettingsMenu));
