import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

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
});

class SettingsMenu extends Component {
  constructor(props) {
    super(props);

    this.toggleAccount = this.toggleAccount.bind(this);
    this.togglePreferences = this.togglePreferences.bind(this);
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

export default connect(state => ({ ...state.default }))(injectIntl(SettingsMenu));
