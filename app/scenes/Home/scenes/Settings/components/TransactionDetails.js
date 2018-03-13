import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const messages = defineMessages({
  close: {
    id: 'Settings.close',
    defaultMessage: 'CLOSE'
  },
});

class TransactionDetails extends Component {
  constructor(props) {
    super(props);

    this.closeDetails = this.closeDetails.bind(this);
  }

  closeDetails() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { props } = this;
    const { formatMessage } = props.intl;
    const containerClass = classNames({
      'compose-container': true,
      visible: props.account.showDetails,
    });

    return (
      <div className={containerClass}>
        <div className="top-detail">
          <span>Transaction Details</span>
          <Button content={formatMessage(messages.close)} onClick={this.closeDetails} className="button--transparent" />
        </div>
        <div>Details</div>
      </div>
    );
  }
}
export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({ }, dispatch),
  }),
)(injectIntl(TransactionDetails));
