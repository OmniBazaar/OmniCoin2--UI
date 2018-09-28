import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import log from 'electron-log';
import { ipcRenderer } from 'electron';

import Background from '../Background/Background';
import './error-boundary.scss';
import {getStoredCurrentUser} from "../../services/blockchain/auth/services";


const messages = defineMessages({
  errorOccured: {
    id: "ErrorBoundary.errorOccured",
    defaultMessage: "An unexpeceted error occured."
  },
  reload: {
    id: "ErrorBoundary.reload",
    defaultMessage: "RELOAD"
  }
});

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  onClick = () => {
    this.props.history.push('/signup');
  };

  componentDidCatch(error, info) {

    this.setState({ hasError: true });
    const { history } = this.props;
    history.listen((location, action) => {
      if (this.state.hasError) {
        this.setState({
          hasError: false,
        });
      }
    });

    const user = getStoredCurrentUser();
    ipcRenderer.send('report-error', error.stack, user.username);
    log.warn(error, info);
  }

  render() {
    const { formatMessage } = this.props.intl;
    if (this.state.hasError) {
      return (
        <Background>
          <div className="boundary-content">
            <span className="message">
              {formatMessage(messages.errorOccured)}
            </span>
            <Button
               content={formatMessage(messages.reload)}
               className="button--green-bg"
               onClick={this.onClick}
            />
          </div>
        </Background>
      )
    }
    return this.props.children;
  }
}

export default injectIntl(withRouter(ErrorBoundary));
