import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Form, Select, TextArea, Checkbox } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Apis, ChainConfig } from 'omnibazaarjs-ws';
import { ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder } from 'omnibazaarjs/es';

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

function generateKeyFromPassword(accountName, role, password) {
  const seed = accountName + role + password;
  const privKey = PrivateKey.fromSeed(seed);
  const pubKey = privKey.toPublicKey().toString();
  return { privKey, pubKey };
}

class Transfer extends Component {
  static asyncValidate = async (values) => {
    try {
      const account = await FetchChain('getAccount', values.to_name);
    } catch (e) {
      console.log('ERR', e);
      throw { to_name: messages.accountDoNotExist };
    }
  };

  constructor(props) {
    super(props);
    this.submitTransfer = this.submitTransfer.bind(this);
    this.state = this.getInitialState();
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
          value={input.value}
          type="text"
          className="textfield"
          placeholder={placeholder}
          options={reputationOptions}
          defaultValue="5"
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
  submitTransfer(values) {
    const sender_name = this.props.auth.currentUser.username;
    const {
      to_name, amount, memo, reputation
    } = values;
    ChainConfig.address_prefix = 'BTS';
    Promise.all([
      FetchChain('getAccount', sender_name),
      FetchChain('getAccount', to_name),
    ]).then(result => {
      try {
        const [sender_name, to_name] = result;
        const key1 = generateKeyFromPassword(sender_name, 'active', this.props.auth.currentUser.password);
        const tr = new TransactionBuilder();
        const memoFromKey = sender_name.getIn(['options', 'memo_key']);
        const memoToKey = to_name.getIn(['options', 'memo_key']);
        const nonce = TransactionHelper.unique_nonce_uint64();

        const memo_object = {
          from: memoFromKey,
          to: memoToKey,
          nonce,
          message: Aes.encrypt_with_checksum(
            key1.privKey,
            memoToKey,
            nonce,
            memo
          )
        };
        tr.add_type_operation('transfer', {
          from: sender_name.get('id'),
          to: to_name.get('id'),
          reputation_vote: reputation,
          memo: memo_object,
          amount: {
            asset_id: '1.3.0',
            amount
          },
        });
        Promise.all([
          tr.set_required_fees(),
          tr.update_head_block()
        ]).then(() => {
          tr.add_signer(key1.privKey, key1.privKey.toPublicKey().toPublicKeyString('BTS'));
          tr.broadcast();
        });
        console.log('done');
      } catch (e) {
        console.log(e);
      }
    });
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
  }),
  handleSubmit: PropTypes.func.isRequired
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
