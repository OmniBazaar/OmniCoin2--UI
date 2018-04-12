import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import { defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';

import Checkbox from '../../../../../../components/Checkbox/Checkbox';
import './my-escrow-settings.scss';
import { updateEscrowSettings } from '../../../../../../services/escrow/escrowActions';

const messages = defineMessages({
  title: {
    id: 'MyEscrowSettings.title',
    defaultMessage: 'I approve the following categories of users to be escrow agents for my transactions:'
  },
  firstCategory: {
    id: 'MyEscrowSettings.firstCategory',
    defaultMessage: 'Any user I give a positive rating'
  },
  secondCategory: {
    id: 'MyEscrowSettings.secondCategory',
    defaultMessage: 'Any user I vote for as Transaction Processor'
  },
  thirdCategory: {
    id: 'MyEscrowSettings.thirdCategory',
    defaultMessage: 'Any top participant who is an Active Transaction Processor'
  },
  save: {
    id: 'MyEscrowSettings.save',
    defaultMessage: 'SAVE SETTINGS'
  },
  saved: {
    id: 'MyEscrowSettings.saved',
    defaultMessage: 'Successfully saved'
  }
});

class MyEscrowSettings extends Component {
  constructor(props) {
    super(props);
    this.renderMenuItem = this.renderMenuItem.bind(this);
    this.save = this.save.bind(this);
    this.checkboxes = {};
  }

  renderMenuItem(text, id, value) {
    return (
      <div className="menu-item">
        <Checkbox
          ref={(checkbox) => { this.checkboxes[id] = checkbox; }}
          value={value}
        />
        <span>{text}</span>
      </div>
    );
  }

  save() {
    const { formatMessage } = this.props.intl;
    const {
      first,
      second,
      third
    } = this.checkboxes;
    this.props.escrowActions.updateEscrowSettings({
      positiveRating: first.state.isChecked,
      transactionProcessor: second.state.isChecked,
      activeTransactionProcessor: third.state.isChecked
    });
    toastr.success(formatMessage(messages.saved), formatMessage(messages.saved));
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      positiveRating,
      transactionProcessor,
      activeTransactionProcessor
    } = this.props.escrow.settings;
    return (
      <div className="escrow-settings">
        <div className="title">
          <span>{formatMessage(messages.title)}</span>
        </div>
        {this.renderMenuItem(formatMessage(messages.firstCategory), 'first', positiveRating)}
        {this.renderMenuItem(formatMessage(messages.secondCategory), 'second', transactionProcessor)}
        {this.renderMenuItem(formatMessage(messages.thirdCategory), 'third', activeTransactionProcessor)}
        <Button
          content={formatMessage(messages.save)}
          onClick={this.save}
          className="button--primary"
        />
      </div>
    );
  }
}

MyEscrowSettings.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired,
  escrowActions: PropTypes.shape({
    updateEscrowSettings: PropTypes.func,
  }).isRequired,
  escrow: PropTypes.shape({
    settings: PropTypes.shape({
      positiveRating: PropTypes.bool,
      transactionProcessor: PropTypes.bool,
      activeTransactionProcessor: PropTypes.bool
    })
  }).isRequired
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    escrowActions: bindActionCreators({
      updateEscrowSettings
    }, dispatch),
  }),
)(injectIntl(MyEscrowSettings));
