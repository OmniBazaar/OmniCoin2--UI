import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Select, TextArea, Checkbox } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { FetchChain } from 'omnibazaarjs/es';

import Header from '../../../../components/Header';
import './transfer.scss';

const messages = defineMessages({
  accountDoNotExist: {
    id: 'Transfer.accountDoNotExist',
    defaultMessage: 'Account doesn\'t exist'
  },
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
  },
  fieldRequired: {
    id: 'Transfer.fieldRequired',
    defaultMessage: 'This field is required'
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

const reputationOptions = [
  {
    key: '1',
    value: '1',
    text: 'All text',
    description: 'Description'
  },
];
class Transfer extends Component {
  static asyncValidate = async (values) => {
    try {
      const account = await FetchChain('getAccount', values.to_name);
      console.log(account);
    } catch (e) {
      console.log('ERR', e);
      throw { to_name: messages.accountDoNotExist };
    }
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = this.getInitialState(props);
  }

  getInitialState() {
    return {
      from_name: '',
      to_name: '',
      from_account: null,
      to_account: null,
      orig_account: null,
      amount: '',
      asset_id: null,
      asset: null,
      memo: '',
      error: null,
      propose: false,
      propose_account: '',
      feeAsset: null,
      fee_asset_id: '1.3.0',
      feeAmount: 0,
      feeStatus: {},
      maxAmount: false,
      hidden: false
    };
  }

  renderDropdownUnitsField = ({
    input, placeholder, buttonText
  }) => {
    let xomAmount = null;
    return (
      <div className="transfer-input">
        <Select
          {...input}
          value={input.value}
          onChange={function (param, data) {
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
    input, placeholder, buttonText, buttonClass, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div className="transfer-input">
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
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
  };

  renderSelectField = ({
    input, placeholder, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div className="transfer-input">
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
        <Select
          {...input}
          type="text"
          className="textfield"
          placeholder={placeholder}
          options={reputationOptions}
        />
      </div>
    );
  };

  renderMemoField = ({
    input, placeholder, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div className="transfer-input">
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
        <TextArea
          {...input}
          autoHeight={false}
          className="text-area"
          placeholder={placeholder}
        />
      </div>
    );
  };
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
    const number = value =>
      (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
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
              name="to_name"
              placeholder="Press enter"
              component={this.renderUnitsField}
              className="textfield1"
              buttonClass="button--green"
              buttonText="ADDRESS BOOK"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
            />
            <div className="col-1" />
          </div>
          <p className="title">{formatMessage(messages.transfer)}</p>
          <div className="form-group">
            <span>Amount</span>
            <Field
              type="text"
              name="amount"
              placeholder="0.0"
              component={this.renderUnitsField}
              className="textfield1"
              buttonText="XOM"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) }),
                number
              ]}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>Reputation</span>
            <Field
              type="text"
              name="reputation"
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
              validate={[required({ message: formatMessage(messages.fieldRequired) })]}
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
  submit(values) {
    const { to_name, reputation, memo } = values;
    console.log(to_name);
    console.log(reputation);
    console.log(memo);
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
  form: 'transferForm',
  asyncValidate: Transfer.asyncValidate,
  asyncBlurFields: ['to_name'],
  destroyOnUnmount: true,
}))(injectIntl(Transfer));
