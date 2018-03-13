import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';

class Vote extends Component {
  render() {
    return (
      <div className="keys-container">
        VOTE
      </div>
    );
  }
}

export default connect(state => ({ ...state.default }))(injectIntl(Vote));
