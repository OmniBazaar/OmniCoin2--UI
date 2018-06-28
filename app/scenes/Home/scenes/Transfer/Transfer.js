import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Select,
  TextArea,
  Loader
} from 'semantic-ui-react';
import { required, numericality, length } from 'redux-form-validators';
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  initialize,
} from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { FetchChain } from 'omnibazaarjs/es';
import { $ } from 'moneysafe';

import Checkbox from '../../../../components/Checkbox/Checkbox';
import DealRating from '../../../../components/DealRating/DealRating';
import Header from '../../../../components/Header';
import BitcoinWalletDropdown from './component/BitcoinWalletDropdown';
import {
  makeValidatableField
} from '../../../../components/ValidatableField/ValidatableField';
import './transfer.scss';
import {
  setCurrency,
  submitTransfer,
  getCommonEscrows,
  createEscrowTransaction,
  saleBonus
} from '../../../../services/transfer/transferActions';
import { reputationOptions } from '../../../../services/utils';
import { makePayment } from '../../../../services/blockchain/bitcoin/bitcoinActions';
import CoinTypes from '../Marketplace/scenes/Listing/constants';

import messages from './messages';

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

const currencyOptions = [
  {
    key: 'bitcoin',
    value: 'bitcoin',
    text: 'BitCoin',
    description: 'BitCoin Currency'
  },
  {
    key: 'omnicoin',
    value: 'omnicoin',
    text: 'OmniCoin',
    description: 'OmniCoin Currency'
  }
];

const FEE_PERCENT = 0.01;
const FEE_CONVERSION_FACTOR = 10000;

const initialState = {
  bitcoinWallets: [],
  wallets: [],
  listingId: null,
  number: null,
  price: 0.00,
};

class Transfer extends Component {
  static asyncValidate = async (values) => {
    try {
      await FetchChain('getAccount', values.toName);
    } catch (e) {
      console.log('ERR', e);
      throw { toName: messages.accountDoNotExist };
    }
  };

  static escrowOptions(escrows) {
    return escrows.map(escrow => ({
      key: escrow.id,
      value: escrow.id,
      text: escrow.name
    }));
  }

  static expirationTimeOptions(formatMessage) {
    return [
      {
        key: 0,
        value: 60 * 60 * 24,
        text: formatMessage(messages.oneDay)
      },
      {
        key: 1,
        value: 60 * 60 * 24 * 3,
        text: formatMessage(messages.threeDays)
      },
      {
        key: 2,
        value: 60 * 60 * 24 * 7,
        text: formatMessage(messages.oneWeek)
      },
      {
        key: 3,
        value: 60 * 60 * 24 * 14,
        text: formatMessage(messages.twoWeeks)
      },
      {
        key: 4,
        value: 60 * 60 * 24 * 30,
        text: formatMessage(messages.oneMonth)
      },
      {
        key: 5,
        value: 60 * 60 * 24 * 90 - 1,
        text: formatMessage(messages.threeMonths)
      }
    ];
  }

  constructor(props) {
    super(props);
    this.submitTransfer = this.submitTransfer.bind(this);
    this.handleEscrowTransactionChecked = this.handleEscrowTransactionChecked.bind(this);
    this.hideEscrow = this.hideEscrow.bind(this);

    this.BitcoinWalletDropdown = makeValidatableField(BitcoinWalletDropdown);

    this.state = {
      ...initialState,
    };
  }

  state = {
    type: CoinTypes.OMNI_COIN,
    listingId: null,
    number: 0,
    price: 0.00,
  };

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const type = params.get('type');
    const listingId = params.get('listing_id');
    const price = params.get('price');
    const to = params.get('to');
    const number = params.get('number');
    this.setState({ listingId, price, number });
    this.handleInitialize(price * number, to);
    if (type === CoinTypes.BIT_COIN) {
      this.props.transferActions.setCurrency('bitcoin');
      this.props.change('currencySelected', 'bitcoin');
    } else {
      this.props.transferActions.setCurrency('omnicoin');
      this.props.change('currencySelected', 'omnicoin');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;

    if (this.props.transfer.loading && !nextProps.transfer.loading) {
      if (nextProps.transfer.error) {
        toastr.error(formatMessage(messages.transfer), formatMessage(messages.failedTransfer));
      } else {
        this.props.reset();
        this.setState({ listingId: null, price: 0, number: 0 });
        this.handleInitialize(0, '');
        toastr.success(formatMessage(messages.transfer), formatMessage(messages.successTransfer));
      }
    }
    if (!nextProps.transfer.gettingCommonEscrows
        && nextProps.transferForm.useEscrow
        && nextProps.transfer.commonEscrows.length === 0
    ) {
      this.hideEscrow();
      toastr.warning(formatMessage(messages.warning), formatMessage(messages.escrowsNotFound));
    } else if (this.props.transfer.gettingCommonEscrows
                && !nextProps.transfer.gettingCommonEscrows
                && nextProps.transferForm.useEscrow) {
      this.initializeEscrow(nextProps.transfer.commonEscrows);
    }

    if (nextProps.bitcoin.wallets !== this.state.bitcoinWallets) {
      this.props.change('password', this.props.bitcoin.password);
      this.props.change('guid', this.props.bitcoin.guid);
    }
  }

  handleInitialize(price, to) {
    this.props.initialize({
      reputation: 5,
      toName: to,
      amount: price
    });
  }

  initializeEscrow(escrows) {
    const escrowOptions = Transfer.escrowOptions(escrows);
    const expirationTimeOptions = Transfer.expirationTimeOptions(this.props.intl.formatMessage);
    this.props.changeFieldValue('escrow', escrowOptions[0].value);
    this.props.changeFieldValue('expirationTime', expirationTimeOptions[0].value);
    this.props.changeFieldValue('transferToEscrow', false);
  }

  hideEscrow() {
    setTimeout(() => this.props.changeFieldValue('useEscrow', false), 200);
  }

  getBalanceFee() {
    const { amount } = this.props.transferForm;

    if (amount) {
      return ($(amount) * $(FEE_PERCENT)) / FEE_CONVERSION_FACTOR;
    }

    return 0.00;
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

  renderAccountNameField = ({
    input, placeholder, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    if (errorMessage && this.props.transferForm.useEscrow) {
      this.hideEscrow();
    }
    return (
      <div className="transfer-input">
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
        <input
          {...input}
          type="text"
          className="textfield"
          placeholder={placeholder}
        />
      </div>
    );
  };

  renderHiddenField = ({
    input
  }) => (
    <input
      {...input}
      type="hidden"
      className="textfield"
    />
  );

  renderUnitsField = ({
    input, placeholder, buttonText, disabled, buttonClass, meta: { touched, error }
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
          disabled={disabled}
        />
        <Button className={['copy-btn button--gray-text address-button', buttonClass].join(' ')}>
          {buttonText}
        </Button>
      </div>
    );
  };

  renderSelectField = ({
    input, options, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div className="transfer-input">
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
        <Select
          className="textfield"
          defaultValue={options[0] ? options[0].value : ''}
          options={options}
          onChange={(param, data) => input.onChange(data.value)}
        />
      </div>
    );
  };

  renderCurrencyField = ({
    input, options
  }) => (
    <Select
      className="textfield"
      value={this.props.transfer.transferCurrency}
      options={options}
      onChange={(param, data) => {
        input.onChange(data.value);
        this.onChangeCurrency(data);
      }}
    />
  );

  renderDealRatingField = ({
    input, options, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div className="transfer-input">
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
        <DealRating
          selectedValue={options[input.value] || options[5]}
          options={options}
          onChange={(data) => input.onChange(data.value)}
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

  handleEscrowTransactionChecked(value) {
    const { currentUser } = this.props.auth;
    if (value) {
      this.props.transferActions
        .getCommonEscrows(this.props.transferForm.toName, currentUser.username);
    }
  }

  renderCheckboxField = ({ input, label, onCheck }) => (
    <div className="transfer-input" style={{ display: 'flex' }}>
      <Checkbox
        value={input.value}
        onChecked={(value) => {
            input.onChange(value);
            if (onCheck) {
              onCheck(value);
            }
          }}
      />
      <span className="label">
        {label}
      </span>
    </div>
  );

  renderOmniCoinForm() {
    const { formatMessage } = this.props.intl;
    const { transfer } = this.props;
    const {
      gettingCommonEscrows,
      commonEscrows
    } = this.props.transfer;

    return (
      <div>
        <div className="section">
          <p className="title">{formatMessage(messages.to)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.accountNameOrPublicKey)}*</span>
            <Field
              type="text"
              name="toName"
              placeholder={formatMessage(messages.pleaseEnter)}
              component={this.renderAccountNameField}
              className="textfield1"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
            />
            <div className="col-1" />
          </div>
        </div>
        <div className="section">
          <p className="title">{formatMessage(messages.transfer)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.amount)}*</span>
            <Field
              type="text"
              name="amount"
              placeholder="0.0"
              component={this.renderUnitsField}
              className="textfield1"
              buttonText="XOM"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) }),
                numericality({ message: formatMessage(messages.numberRequired) })
              ]}
              disabled={!!this.state.listingId}
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
              validate={[
                length({ max: 150, message: formatMessage(messages.maxLength) })
              ]}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.transferSecurity)}</span>
            <div className="transfer-input">
              <Field
                name="useEscrow"
                component={this.renderCheckboxField}
                onCheck={this.handleEscrowTransactionChecked}
                label={formatMessage(messages.escrowFee, {
                  xomAmount: this.getBalanceFee(),
                })}
              />
            </div>
            <div className="col-1" />
          </div>
          {gettingCommonEscrows &&
          <div className="form-group">
            <Loader active inline="centered" />
          </div>
          }
          {commonEscrows.length !== 0 && this.props.transferForm.useEscrow && (
            [
              <div className="form-group">
                <span>{formatMessage(messages.selectEscrow)}</span>
                <div className="transfer-input">
                  <Field
                    type="text"
                    name="escrow"
                    options={Transfer.escrowOptions(commonEscrows)}
                    component={this.renderSelectField}
                  />
                </div>
                <div className="col-1" />
              </div>,
              <div className="form-group">
                <span>{formatMessage(messages.expirationTime)}</span>
                <div className="transfer-input">
                  <Field
                    type="text"
                    name="expirationTime"
                    options={Transfer.expirationTimeOptions(formatMessage)}
                    component={this.renderSelectField}
                  />
                </div>
                <div className="col-1" />
              </div>,
              <div className="form-group">
                <span>{formatMessage(messages.transferToEscrow)}</span>
                <div className="transfer-input">
                  <Field
                    name="transferToEscrow"
                    component={this.renderCheckboxField}
                    label={formatMessage(messages.transferToEscrowLabel)}
                  />
                </div>
                <div className="col-1" />
              </div>
            ]
          )
          }
          {!this.props.transferForm.useEscrow &&
          <div className="form-group" style={{ marginTop: '10px' }}>
            <span style={{ marginBottom: '25px' }}>
              {formatMessage(messages.reputation)}
            </span>
            <Field
              type="text"
              name="reputation"
              options={reputationOptions()}
              component={this.renderDealRatingField}
            />
            <div className="col-1" />
          </div>
          }
        </div>
        <div className="form-group">
          <span />
          <div className="field left floated">
            <Button
              type="submit"
              loading={transfer.loading}
              content={formatMessage(messages.TRANSFER)}
              className="button--green-bg"
              disabled={!!this.props.invalid}
            />
          </div>
          <div className="col-1" />
        </div>
      </div>
    );
  }

  renderBitCoinForm() {
    const { formatMessage } = this.props.intl;
    const { transfer } = this.props;

    return (
      <div>
        <div className="section">
          <p className="title">{formatMessage(messages.from)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.selectWallet)}</span>
            <div className="transfer-input">
              <Field
                name="fromName"
                component={this.BitcoinWalletDropdown}
                validate={[
                  required({ message: formatMessage(messages.fieldRequired) })
                ]}
              />
            </div>
            <div className="col-1" />
          </div>
        </div>
        <div className="section">
          <p className="title">{formatMessage(messages.to)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.accountNameOrPublicKey)}*</span>
            <Field
              type="text"
              name="toName"
              placeholder={formatMessage(messages.pleaseEnter)}
              component="input"
              className="textfield"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
            />
            <div className="col-1" />
          </div>
        </div>
        <div className="section">
          <p className="title">{formatMessage(messages.transfer)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.amount)}*</span>
            <Field
              type="text"
              name="amount"
              placeholder="0.0"
              component={this.renderUnitsField}
              className="textfield1"
              buttonText="BTC"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) }),
                numericality({ message: formatMessage(messages.numberRequired) })
              ]}
              disabled={this.state.listingId}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <Field type="text" name="guid" fieldValue={this.props.bitcoin.guid} component={this.renderHiddenField} />
            <Field type="text" name="password" fieldValue={this.props.bitcoin.password} component={this.renderHiddenField} />
            <div className="col-1" />
          </div>
        </div>
        <div className="form-group">
          <span />
          <div className="field left floated">
            <Button
              type="submit"
              loading={transfer.loading}
              content={formatMessage(messages.TRANSFER)}
              className="button--green-bg"
              disabled={this.props.invalid}
            />
          </div>
          <div className="col-1" />
        </div>
      </div>
    );
  }

  renderForm() {
    const { transferCurrency } = this.props.transfer;

    switch (transferCurrency) {
      case 'omnicoin':
        return this.renderOmniCoinForm();
      case 'bitcoin':
        return this.renderBitCoinForm();
      default:
        return this.renderBitCoinForm();
    }
  }

  onChangeCurrency = (data) => {
    this.props.transferActions.setCurrency(data.value);
  };

  transferForm() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;

    return (
      <div className="transfer-form">
        <Form onSubmit={handleSubmit(this.submitTransfer)} className="transfer-form-container">
          <div className="form-group">
            <span>{formatMessage(messages.currency)}</span>
            <Field
              type="text"
              name="currencySelected"
              options={currencyOptions}
              component={this.renderCurrencyField}
            />
            <div className="col-1" />
          </div>
          {this.renderForm()}
        </Form>
      </div>
    );
  }

  submitTransfer(paramValues) {
    const { transferCurrency } = this.props.transfer;
    const values = {
      ...paramValues
    };

    if (transferCurrency === 'omnicoin') {
      values.memo = paramValues.memo ? paramValues.memo : '';
      values.amount = parseFloat(paramValues.amount).toFixed(2);
    } else {
      values.amount = parseFloat(paramValues.amount).toFixed(8);
    }

    const { currentUser } = this.props.auth;
    if (this.state.listingId) {
      this.props.transferActions.saleBonus(values.toName, currentUser.username);
      values.listingCount = this.state.number;
      values.listingId = this.state.listingId;
    }
    if (values.useEscrow) {
      values.buyer = currentUser.username;
      this.props.transferActions.createEscrowTransaction(values);
    } else {
      this.props.transferActions.submitTransfer(values);
    }
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
  history: PropTypes.shape({
    replace: PropTypes.func,
    location: PropTypes.shape,
  }),
  reset: PropTypes.func,
  transferActions: PropTypes.shape({
    submitTransfer: PropTypes.func,
    getCommonEscrows: PropTypes.func,
    createEscrowTransaction: PropTypes.func,
    setCurrency: PropTypes.func,
    saleBonus: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  initialize: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  transfer: PropTypes.shape({
    loading: PropTypes.bool,
    gettingCommonEscrows: PropTypes.bool,
    transferCurrency: PropTypes.string,
    error: PropTypes.string,
    commonEscrows: PropTypes.shape([])
  }),
  transferForm: PropTypes.shape({
    currencySelected: PropTypes.string,
    fromName: PropTypes.string,
    toName: PropTypes.string,
    useEscrow: PropTypes.bool,
    amount: PropTypes.string,
  }),
  changeFieldValue: PropTypes.func,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    })
  }),
  blockchainWallet: PropTypes.shape({
    balance: PropTypes.shape({
      balance: PropTypes.string,
    }),
  }),
};

Transfer.defaultProps = {
  blockchainWallet: {},
  transferActions: {},
  intl: {},
  initialize: {},
  transfer: {},
  transferForm: {},
  changeFieldValue: () => {},
  reset: () => {},
  history: {},
  auth: {}
};

const selector = formValueSelector('transferForm');

export default compose(
  connect(
    state => ({
      ...state.default,
      transferForm: {
        toName: selector(state, 'toName'),
        fromName: selector(state, 'fromName'),
        useEscrow: selector(state, 'useEscrow'),
        amount: selector(state, 'amount'),
      }
    }),
    (dispatch) => ({
      transferActions: bindActionCreators({
        makePayment,
        setCurrency,
        submitTransfer,
        getCommonEscrows,
        createEscrowTransaction,
        saleBonus
      }, dispatch),
      initialize,
      changeFieldValue: (field, value) => {
        dispatch(change('transferForm', field, value));
      }
    })
  ),
  reduxForm({
    form: 'transferForm',
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    fields: ['toName', 'fromName', 'useEscrow'],
    asyncBlurFields: ['toName'],
    destroyOnUnmount: true,
    asyncValidate: Transfer.asyncValidate,
  })
)(injectIntl(Transfer));
