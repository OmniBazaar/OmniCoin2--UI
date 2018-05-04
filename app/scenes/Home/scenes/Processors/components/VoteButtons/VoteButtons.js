import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import './vote-buttons.scss';

const messages = defineMessages({
  vote: {
    id: 'VoteButtons.vote',
    defaultMessage: 'Vote'
  },
  cancel: {
    id: 'VoteButtons.cancel',
    defaultMessage: 'Cancel'
  }
});

class VoteButtons extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="vote-buttons">
        <Button
          onClick={this.props.onCancelClicked}
          disabled={this.props.disabled}
          loading={this.props.loading}
          content={formatMessage(messages.cancel)}
        />
        <Button
          className="button--green-bg"
          onClick={this.props.onVoteClicked}
          disabled={this.props.disabled}
          loading={this.props.loading}
          content={formatMessage(messages.vote)}
        />
      </div>
    );
  }
}

VoteButtons.defaultProps = {
  onVoteClicked: () => {},
  onCancelClicked: () => {},
  disabled: false,
  loading: false
};

VoteButtons.propTypes = {
  onVoteClicked: PropTypes.func,
  onCancelClicked: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default injectIntl(VoteButtons);
