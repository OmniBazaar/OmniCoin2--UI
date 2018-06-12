import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import PreferencesTab from './PreferencesTab';
import ConsoleTab from './ConsoleTab';
import messages from './messages';

import './preferences.scss';

class Preferences extends Component {
  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { props } = this;
    return (
      <Modal size="large" open={props.menu.showPreferences} onClose={this.close} closeIcon>
        <Modal.Content>
          <div className="modal-container settings-container">
            <div className="modal-content">
              <Tab
                className="tabs"
                menu={{ secondary: true, pointing: true }}
                panes={[
                  {
                    menuItem: formatMessage(messages.preferencesTab),
                    render: () => <Tab.Pane><PreferencesTab /></Tab.Pane>,
                  },
                  {/*{
                    menuItem: formatMessage(messages.consoleTab),
                    render: () => <Tab.Pane className="console-tab"><ConsoleTab /></Tab.Pane>,
                  },*/}
                ]}
              />
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

Preferences.propTypes = {
  onClose: PropTypes.func.isRequired,
  menu: PropTypes.shape({
    showPreferences: PropTypes.bool
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default compose(
  connect(
    state => ({
      menu: state.default.menu
    })
  )
)(injectIntl(Preferences));
