import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Select, TextArea, Checkbox } from 'semantic-ui-react';
import { required, initialize } from 'redux-form-validators';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Apis, ChainConfig } from 'omnibazaarjs-ws';
import { toastr } from 'react-redux-toastr';
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
  },
  accountNameOrPublicKey: {
    id: 'Transfer.accountNameOrPublicKey',
    defaultMessage: 'Account Name or Public Key'
  },
  pleaseEnter: {
    id: 'Transfer.pleaseEnter',
    defaultMessage: 'Please enter'
  },
  amount: {
    id: 'Transfer.amount',
    defaultMessage: 'Amount'
  },
  reputation: {
    id: 'Transfer.reputation',
    defaultMessage: 'Reputation'
  },
  memo: {
    id: 'Transfer.memo',
    defaultMessage: 'Memo'
  },
  transferSecurity: {
    id: 'Transfer.transferSecurity',
    defaultMessage: 'Transfer Security'
  },
  useEscrowService: {
    id: 'Transfer.useEscrowService',
    defaultMessage: 'Use SecureSend (Escrow Service)'
  },
  successTransfer: {
    id: 'Settings.successUpdate',
    defaultMessage: 'Transferred successfully'
  },
  failedTransfer: {
    id: 'Settings.failedUpdate',
    defaultMessage: 'Failed to transfer'
  },
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

const reputationOptions = () => {
  const options = [];

  for (let index = 0; index < 11; index++) {
    const option = {
      key: index,
      value: index,
      text: index - 5
    };
    options.push(option);
  }

  return options;
};

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
      reputation: 5,
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

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (this.props.transfer.loading && !nextProps.transfer.loading) {
      if (nextProps.transfer.error) {
        toastr.error(formatMessage(messages.transfer), nextProps.transfer.error);
      } else {
        toastr.success(formatMessage(messages.transfer), formatMessage(messages.successTransfer));
      }
    }
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
          options={reputationOptions()}
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
    const { handleSubmit, transfer } = this.props;
    const number = value =>
      (value && isNaN(Number(value)) ? 'Must be a number' : undefined);
    return (
      <div className="transfer-form">
        <Form onSubmit={handleSubmit(this.submitTransfer)} className="transfer-form-container">
          <p className="title">{formatMessage(messages.to)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.accountNameOrPublicKey)}</span>
            <Field
              type="text"
              name="to_name"
              placeholder={formatMessage(messages.pleaseEnter)}
              component={this.renderUnitsField}
              className="textfield1"
              buttonClass="button--green"
              buttonText=""
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
            />
            <div className="col-1" />
          </div>
          <p className="title">{formatMessage(messages.transfer)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.amount)}</span>
            <Field
              type="text"
              name="amount"
              placeholder="0.0"
              sl
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
            <span>{formatMessage(messages.reputation)}</span>
            <Field
              type="text"
              name="reputation"
              placeholder="0"
              component={this.renderSelectField}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.memo)}</span>
            <Field
              type="text"
              name="memo"
              placeholder={formatMessage(messages.pleaseEnter)}
              component={this.renderMemoField}
              validate={[required({ message: formatMessage(messages.fieldRequired) })]}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.transferSecurity)}</span>
            <div className="transfer-input">
              <Field
                name="use_escrow"
                component={this.renderEscrowField}
                label={formatMessage(messages.useEscrowService)}
              />
            </div>
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span />
            <div className="field left floated">
              <Button type="submit" loading={transfer.loading} content={formatMessage(messages.TRANSFER)} className="button--green-bg" />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }
  submitTransfer(values) {
    this.props.transferActions.submitTransfer(values);
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
  handleSubmit: PropTypes.func.isRequired,
  transfer: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string
  })
};

Transfer.defaultProps = {
  transferActions: {},
  intl: {},
  initialize: {},
  transfer: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
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
