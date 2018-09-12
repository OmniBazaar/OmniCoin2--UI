import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import log from 'electron-log';

import Background from '../Background/Background';
import './error-boundary.scss';


const messages = defineMessages({
  errorOccured: {
    id: "ErrorBoundary.errorOccured",
    defaultMessage: "An unexpeceted error occured."
  }
});

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    log.warn(error, info);
  }

  render() {
    const { formatMessage } = this.props.intl;
    if (this.state.hasError) {
      return (
        <Background>
          <span className="error-boundary">
            {formatMessage(messages.errorOccured)}
          </span>
        </Background>
      )
    }
    return this.props.children;
  }
}

export default injectIntl(ErrorBoundary);
