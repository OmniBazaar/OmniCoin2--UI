import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Form, Button, Select, Image, Icon } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import './preferences.scss';
import { setReferral, sendCommand } from '../../../../services/preferences/preferencesActions';

import CheckNormal from '../../images/ch-box-0-norm.svg';
import CheckPreNom from '../../images/ch-box-1-norm.svg';

const iconSize = 20;
const iconSizeSmall = 12;

const messages = defineMessages({
  preferencesTab: {
    id: 'Preferences.preferencesTab',
    defaultMessage: 'Preferences'
  },
  consoleTab: {
    id: 'Preferences.consoleTab',
    defaultMessage: 'Console'
  },
  seconds: {
    id: 'Preferences.seconds',
    defaultMessage: 'SECONDS'
  },
  xomUnit: {
    id: 'Preferences.xomUnit',
    defaultMessage: 'XOM'
  },
  logoutTimeout: {
    id: 'Preferences.logoutTimeout',
    defaultMessage: 'LogOut Timeout'
  },
  transactionFee: {
    id: 'Preferences.transactionFee',
    defaultMessage: 'Transaction Fee'
  },
  byDefaultVote: {
    id: 'Preferences.byDefaultVote',
    defaultMessage: 'By Default Vote for'
  },
  referralProgram: {
    id: 'Preferences.referralProgram',
    defaultMessage: 'Participate in Referral Program'
  },
  referralProgramTitle: {
    id: 'Preferences.referralProgramTitle',
    defaultMessage: 'I\'d like to refer my friends to OmniBazaar'
  },
  referralProgramText: {
    id: 'Preferences.referralProgramText',
    defaultMessage: 'REFERRER: During the initial phase of the OmniBazaar marketplace, you will receive a Referral Bonus of OmniCoins each time you refer a new user. As a Referrer, you agree to follow the OmniBazaar software to automatically send a small number of OmniCoins from your account to the new users you refer, to enable those new users to register their user names and get started in OmniBazaar. In exchange you receive a commission (some OmniCoins) each time a user you referred buys or sells something in the OmniBazaar marketplace. In order to serve as a Referrer, you must keep the OmniBazaar application running on your computer.'
  },
  priorityForListing: {
    id: 'Preferences.priorityForListing',
    defaultMessage: 'Priority for Listings You Create'
  },
  publisherFee: {
    id: 'Preferences.publisherFee',
    defaultMessage: 'Publisher Fee You Receive'
  },
  chargeFee: {
    id: 'Preferences.chargeFee',
    defaultMessage: 'Fee You Charge to Publish Listings'
  },
  update: {
    id: 'Preferences.update',
    defaultMessage: 'UPDATE'
  },
  commandHint: {
    id: 'Preferences.commandHint',
    defaultMessage: 'Type command and hit enter'
  },
});

const voteOptions = [
  {
    key: 'all',
    value: 'all',
    text: 'All (You are voting for all processors, independently from C...'
  },
];

const priorityOptions = [
  {
    key: 'highest',
    value: 'highest',
    text: 'Highest (2% Fee)'
  },
];

const languageOptions = [
  {
    key: 'eng',
    value: 'eng',
    text: 'English'
  },
  {
    key: 'spa',
    value: 'spa',
    text: 'Spanish'
  },
  {
    key: 'rus',
    value: 'rus',
    text: 'Russian'
  },
];

class Preferences extends Component {
  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  toggleReferrer = () => this.props.preferencesActions.setReferral();

  renderUnitsField = ({
    input, placeholder, buttonText
  }) => (
    <div className="hybrid-input">
      <input
        {...input}
        type="text"
        className="textfield"
        placeholder={placeholder}
      />
      <Button className="copy-btn button--gray-text address-button">
        {buttonText}
      </Button>
    </div>
  );

  renderHintField = ({
    input, placeholder, hint, onKeyDown
  }) => (
    <div className="hybrid-input">
      <input
        {...input}
        autoFocus
        type="text"
        className="textfield command-field"
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
      <div className="hint button--gray-text">
        <Icon name="long arrow left" width={iconSizeSmall} height={iconSizeSmall} />
        {hint}
      </div>
    </div>
  );

  getReferrerIcon() {
    return this.props.preferences.referral ? CheckPreNom : CheckNormal;
  }

  sendCommandEnter = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      this.props.preferencesActions.sendCommand(e.target.value);
      this.props.change('command', '');
    }
  };

  renderCommands() {
    const { sentCommands } = this.props.preferences;
    return (
      sentCommands.map((command) => (
        <p className="command">{`>> ${command}`}</p>
      ))
    );
  }

  consoleTab() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="command-container">
        <Field
          type="text"
          name="command"
          component={this.renderHintField}
          className="textfield"
          onKeyDown={this.sendCommandEnter}
          hint={formatMessage(messages.commandHint)}
        />
        <div className="command-result">
          {this.renderCommands()}
          <p className="command">{'>> help clear_console'}</p>
          <p className="command">[command_name] ? (alias for: help [command_name]) about</p>
        </div>
      </div>
    );
  }

  preferencesTab() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="preferences-form-container">
        <Form onSubmit={this.onSubmit} className="preferences-form">
          <div className="form-group">
            <span>{formatMessage(messages.logoutTimeout)}</span>
            <Field
              type="text"
              name="logout"
              placeholder={formatMessage(messages.logoutTimeout)}
              component={this.renderUnitsField}
              className="textfield"
              buttonText={formatMessage(messages.seconds)}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.transactionFee)}</span>
            <Field
              type="text"
              name={formatMessage(messages.transactionFee)}
              placeholder={formatMessage(messages.transactionFee)}
              component={this.renderUnitsField}
              className="textfield"
              buttonText={formatMessage(messages.xomUnit)}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.byDefaultVote)}</span>
            <Select
              options={voteOptions}
              defaultValue="all"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>Interface Language</span>
            <Select
              options={languageOptions}
              defaultValue="eng"
            />
            <div className="col-1" />
          </div>
          <div className="form-group top">
            <span>{formatMessage(messages.referralProgram)}</span>
            <div className="check-form field">
              <div className="description">
                <div className="check-container">
                  <Image src={this.getReferrerIcon()} width={iconSize} height={iconSize} className="checkbox" onClick={this.toggleReferrer} />
                </div>
                <div className="description-text">
                  <p className="title">{formatMessage(messages.referralProgramTitle)}</p>
                  <div>
                    {formatMessage(messages.referralProgramText)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.priorityForListing)}</span>
            <Select
              placeholder="Select"
              options={priorityOptions}
              defaultValue="highest"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.publisherFee)}</span>
            <Field
              type="text"
              name="publisherFee"
              placeholder={formatMessage(messages.publisherFee)}
              component={this.renderUnitsField}
              className="textfield"
              buttonText={formatMessage(messages.xomUnit)}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.chargeFee)}</span>
            <Field
              type="text"
              name="chargeFee"
              component="input"
              className="textfield"
              placeholder={formatMessage(messages.chargeFee)}
            />
            <div className="col-1" />
          </div>
          <div className="form-group submit-group">
            <span />
            <div className="field">
              <Button type="submit" content={formatMessage(messages.update)} className="button--green-bg" />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { props } = this;
    return (
      <Modal size="normal" open={props.menu.showPreferences} onClose={this.close}>
        <Modal.Content>
          <div className="modal-container settings-container">
            <div className="modal-content">
              <Tab
                className="tabs"
                menu={{ secondary: true, pointing: true }}
                panes={[
                  {
                    menuItem: formatMessage(messages.preferencesTab),
                    render: () => <Tab.Pane>{this.preferencesTab()}</Tab.Pane>,
                  },
                  {
                    menuItem: formatMessage(messages.consoleTab),
                    render: () => <Tab.Pane className="console-tab">{this.consoleTab()}</Tab.Pane>,
                  },
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
  onClose: PropTypes.func,
  change: PropTypes.func,
  preferencesActions: PropTypes.shape({
    setReferral: PropTypes.func,
    sendCommand: PropTypes.func,
  }),
  preferences: PropTypes.shape({
    referral: PropTypes.bool,
    sentCommands: PropTypes.array,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Preferences.defaultProps = {
  onClose: () => {},
  change: () => {},
  preferencesActions: {},
  preferences: {},
  intl: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      preferencesActions: bindActionCreators({ setReferral, sendCommand }, dispatch),
    }),
  ),
  reduxForm({
    form: 'preferencesForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(Preferences));
