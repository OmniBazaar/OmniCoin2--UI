import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';


const messages = defineMessages({
  confirmation: {
    id: 'FormPrompt.confirmation',
    defaultMessage: 'If you close this page, the changes you made will not be saved unless you "Update" (save) your changes'
  }
});

class FormPrompt extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <Prompt
        when={this.props.isVisible}
        message={location => formatMessage(messages.confirmation)}
      />
    );
  }
}

FormPrompt.propTypes = {
  isVisible: PropTypes.bool
};

FormPrompt.defaultProps = {
  isVisible: false
};

export default injectIntl(FormPrompt);
