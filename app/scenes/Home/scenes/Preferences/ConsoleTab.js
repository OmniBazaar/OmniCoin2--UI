import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { sendCommand } from '../../../../services/preferencesConsole/preferencesConsoleActions';
import messages from './messages';
import './preferences.scss';

const iconSizeSmall = 12;

class ConsoleTab extends Component {
  state = {
    command: ''
  }

  onCommandInputKeydown(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      this.props.preferencesActions.sendCommand(this.state.command);
      this.setState({
        command: ''
      });
    }
  }

  onCommandChange(command) {
    this.setState({ command });
  }

  renderCommandInput() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="hybrid-input">
        <input
          autoFocus
          type="text"
          className="textfield command-field"
          value={this.state.command}
          onKeyDown={this.onCommandInputKeydown.bind(this)}
          onChange={this.onCommandChange.bind(this)}
        />
        <div className="hint button--gray-text">
          <Icon name="long arrow left" width={iconSizeSmall} height={iconSizeSmall} />
          {formatMessage(messages.commandHint)}
        </div>
      </div>
    );
  }

  renderCommands() {
    const { commands } = this.props.preferencesConsole;
    return (
      commands.map((command) => (
        <p className="command">{`>> ${command}`}</p>
      ))
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="command-container">
        {this.renderCommandInput()}
        <div className="command-result">
          {this.renderCommands()}
          <p className="command">{'>> help clear_console'}</p>
          <p className="command">[command_name] ? (alias for: help [command_name]) about</p>
        </div>
      </div>
    );
  }
}

ConsoleTab.propTypes = {
  preferencesActions: PropTypes.shape({
    sendCommand: PropTypes.func,
  }).isRequired,
  preferencesConsole: PropTypes.shape({
    commands: PropTypes.array,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default compose(connect(
  state => ({
    preferencesConsole: state.default.preferencesConsole
  }),
  (dispatch) => ({
    preferencesActions: bindActionCreators({ sendCommand }, dispatch),
  }),
))(injectIntl(ConsoleTab));
