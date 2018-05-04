import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Select, TextArea, Checkbox } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import Header from '../../../../components/Header';
import './transfer.scss';

const messages = defineMessages({
  transfer: {
    id: 'Transfer.transfer',
    defaultMessage: 'Transfer'
  },
  from: {
    id: 'Transfer.from',
    defaultMessage: 'From'
  },
  to: {
    id: 'Transfer.to',
    defaultMessage: 'To'
  },
  TRANSFER: {
    id: 'Transfer.TRANSFER',
    defaultMessage: 'TRANSFER'
  }
});

const walletOptions = [
  {
    key: 'all',
    value: 'all value',
    text: 'All text',
    description: 'Description'
  },
  {
    key: 'all1',
    value: 'all1 value',
    text: 'All text1',
    description: 'Description1'
  }
];

class Transfer extends Component {
  renderDropdownUnitsField = ({
    input, placeholder, buttonText
  }) => {
    let xomAmount = null;
    return (
      <div className="transfer-input">
        <Select
          {...input}
          value={input.value}
          onChange={(param, data) => {
            const szDescription = data.options.find(o => o.value === data.value);
            xomAmount.ref.innerHTML = szDescription.description;
          }}
          options={walletOptions}
          placeholder={placeholder}
          fluid
        />
        <Button
          className="copy-btn button--gray-text address-button"
          ref={(value) => { xomAmount = value; }}
        >
          {buttonText}
        </Button>
      </div>
    );
  };

  renderUnitsField = ({
    input, placeholder, buttonText, buttonClass
  }) => (
    <div className="transfer-input">
      <input
        {...input}
        type="text"
        className="textfield"
        placeholder={placeholder}
      />
      <Button className={['copy-btn button--gray-text address-button', buttonClass].join(' ')}>
        {buttonText}
      </Button>
    </div>
  );

  renderSelectField = ({
    input, placeholder
  }) => (
    <div className="transfer-input">
      <Select
        {...input}
        type="text"
        className="textfield"
        placeholder={placeholder}
      />
    </div>
  );

  renderMemoField = ({
    input, placeholder
  }) => (
    <div className="transfer-input">
      <TextArea
        {...input}
        autoHeight={false}
        className="text-area"
        placeholder={placeholder}
      />
    </div>
  );
  renderEscrowField = ({
    input, label
  }) => (
    <div className="transfer-input">
      <Checkbox
        {...input}
        label={label}
      />
      <span className="escrow-fee">
        Escrow Fee: 0.1%(0,00 XOM)
      </span>
    </div>
  );

  transferForm() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="transfer-form">
        <Form onSubmit={this.onSubmit} className="transfer-form-container">
          <p className="title">{formatMessage(messages.from)}</p>
          <div className="form-group">
            <span>Select Wallet</span>
            <Field
              type="text"
              name="logout"
              placeholder="placeholder1"
              component={this.renderDropdownUnitsField}
              className="textfield1"
              buttonText="XOM"
            />
            <div className="col-1" />
          </div>
          <p className="title">{formatMessage(messages.to)}</p>
          <div className="form-group">
            <span>Account Name or Public Key</span>
            <Field
              type="text"
              name="logout"
              placeholder="Press enter"
              component={this.renderUnitsField}
              className="textfield1"
              buttonClass="button--green"
              buttonText="ADDRESS BOOK"
            />
            <div className="col-1" />
          </div>
          <p className="title">{formatMessage(messages.transfer)}</p>
          <div className="form-group">
            <span>Amount</span>
            <Field
              type="text"
              name="logout"
              placeholder="0.0"
              component={this.renderUnitsField}
              className="textfield1"
              buttonText="XOM"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>Reputation</span>
            <Field
              type="text"
              name="logout"
              placeholder="0.0"
              component={this.renderSelectField}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>Memo</span>
            <Field
              type="text"
              name="memo"
              placeholder="Please enter"
              component={this.renderMemoField}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>Transfer Security</span>
            <div className="transfer-input">
              <Field
                name="use_escrow"
                component={this.renderEscrowField}
                label="Use SecureSend (Escrow Service)"
              />
            </div>
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span />
            <div className="field left floated">
              <Button type="submit" content={formatMessage(messages.TRANSFER)} className="button--green-bg" />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div ref={container => { this.container = container; }} className="container transfer">
        <Header className="button--green-bg" title={formatMessage(messages.transfer)} />
        {this.transferForm()}
      </div>
    );
  }
}

Transfer.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  })
};

Transfer.defaultProps = {
  intl: {}
};

export default compose(connect(state => ({ ...state.default }), null), reduxForm({
  form: 'preferencesForm',
  destroyOnUnmount: true,
}))(injectIntl(Transfer));
