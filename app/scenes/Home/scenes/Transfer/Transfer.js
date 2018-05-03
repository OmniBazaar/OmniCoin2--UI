import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Select, TextArea, Checkbox } from 'semantic-ui-react';
import { required, initialize } from 'redux-form-validators';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Apis, ChainConfig } from 'omnibazaarjs-ws';
import { ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder } from 'omnibazaarjs/es';

import Header from '../../../../components/Header';
import './transfer.scss';
import { submitTransfer } from '../../../../services/transfer/transferActions';

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
    value: '0',
    text: '-5',
  },
  {
    key: '2',
    value: '1',
    text: '-4',
  },
  {
    key: '3',
    value: '2',
    text: '-3',
  },
  {
    key: '4',
    value: '3',
    text: '-2',
  },
  {
    key: '5',
    value: '4',
    text: '-1',
  },
  {
    key: '6',
    value: '5',
    text: '0',
  },
  {
    key: '7',
    value: '6',
    text: '1',
  },
  {
    key: '8',
    value: '7',
    text: '2',
  },
  {
    key: '9',
    value: '8',
    text: '3',
  },
  {
    key: '10',
    value: '9',
    text: '4',
  },
  {
    key: '11',
    value: '10',
    text: '5',
  }
];


class Transfer extends Component {
  static asyncValidate = async (values) => {
    try {
      const account = await FetchChain('getAccount', values.to_name);
    } catch (e) {
      console.log('ERR', e);
      throw { to_name: messages.accountDoNotExist };
    }
  };
  handleInitialize() {
    const initData = {
      'reputation': '5',
    };

    this.props.initialize(initData);
  }

  constructor(props) {
    super(props);
    this.submitTransfer = this.submitTransfer.bind(this);
  }

  componentDidMount() {
    this.handleInitialize();
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
          value={input.value}
          type="text"
          className="textfield"
          placeholder={placeholder}
          options={reputationOptions}
          onChange={(param, data) => input.onChange(data.value)}
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
    const { handleSubmit } = this.props;
    const number = value =>
      (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
    return (
      <div className="transfer-form">
        <Form onSubmit={handleSubmit(this.submitTransfer)} className="transfer-form-container">
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
              placeholder="0"
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
  submitTransfer() {
    this.props.transferActions.submitTransfer();
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
  transferActions: PropTypes.shape({
    submitTransfer: PropTypes.func
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  initialize: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired
};

Transfer.defaultProps = {
  intl: {}
};

export default compose(
  connect(null,
    (dispatch) => ({
      transferActions: bindActionCreators({
        submitTransfer
      }, dispatch),
      initialize
    })
  ),
  reduxForm({
    form: 'transferForm',
    asyncValidate: Transfer.asyncValidate,
    asyncBlurFields: ['to_name'],
    destroyOnUnmount: true,
  })
)(injectIntl(Transfer));
