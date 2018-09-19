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
import { required, numericality, length, addValidator } from 'redux-form-validators';
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  initialize,
} from 'redux-form';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { $ } from 'moneysafe';

import Checkbox from '../../../../components/Checkbox/Checkbox';
import ConfirmationModal from '../../../../components/ConfirmationModal/ConfirmationModal';
import DealRating from '../../../../components/DealRating/DealRating';
import Header from '../../../../components/Header';
import BitcoinWalletDropdown from './component/BitcoinWalletDropdown';
import FormPrompt from '../../../../components/FormPrompt/FormPrompt';
import ShippingRate from './component/ShippingRate/ShippingRate';

import { makeValidatableField } from '../../../../components/ValidatableField/ValidatableField';
import './transfer.scss';
import {
  omnicoinTransfer,
  bitcoinTransfer,
  ethereumTransfer,
  setCurrency,
  getCommonEscrows,
  createEscrowTransaction,
  saleBonus
} from '../../../../services/transfer/transferActions';
import { reputationOptions } from '../../../../services/utils';
import { getEthereumWallets } from '../../../../services/blockchain/ethereum/EthereumActions';
import {
  getShippingRates
} from '../../../../services/shipping/shippingActions';
import CoinTypes from '../Marketplace/scenes/Listing/constants';
import { currencyConverter } from "../../../../services/utils";
import { Prompt } from 'react-router-dom';

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
    key: 'omnicoin',
    value: 'omnicoin',
    text: 'OmniCoin',
    description: 'OmniCoin Currency'
  },
  {
    key: 'bitcoin',
    value: 'bitcoin',
    text: 'BitCoin',
    description: 'BitCoin Currency'
  },
  {
    key: 'ethereum',
    value: 'ethereum',
    text: 'Ethereum',
    description: 'Ethereum Currency'
  }
];

const FEE_PERCENT = 0.01;
const FEE_CONVERSION_FACTOR = 10000;
const XOM_DECIMALS_LIMIT = 5;

const amountDecimalsValidator = addValidator({
  validator(options, value) {
    if (!(/^\d+(\.\d{1,5})*$/).test(value)) {
      return {
        id: 'form.errors.custom',
        defaultMessage: options.message,
      };
    }
  },
});

class Transfer extends Component {
  static escrowOptions(escrows) {
    return escrows.map(escrow => ({
      key: escrow.id,
      value: escrow.id,
      text: `${escrow.name} (${escrow.escrow_fee / 100}% Fee)`
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
    this.onApprove = this.onApprove.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.BitcoinWalletDropdown = makeValidatableField(BitcoinWalletDropdown);

    this.state = {
      isModalOpen: false,
      isPromptVisible: false
    };
  }

  componentDidMount() {
    const purchaseParams = new URLSearchParams(this.props.location.search);
    const type = purchaseParams.get('type');
    const price = purchaseParams.get('price');
    const number = purchaseParams.get('number');
    const amount = price * number;
    const to = purchaseParams.get('seller_name');
    const bitcoinAddress = purchaseParams.get('bitcoin_address');
    const ethereumAddress = purchaseParams.get('ethereum_address');
    const listingCurrency = purchaseParams.get('currency');
    const convertedAmount = type ? currencyConverter(amount, listingCurrency, type.toUpperCase()) : 0;

    this.initialAmount = parseFloat(convertedAmount);

    this.handleInitialize(convertedAmount);

    if (type === CoinTypes.BIT_COIN) {
      this.props.transferActions.setCurrency('bitcoin');
      this.props.change('currencySelected', 'bitcoin');
      this.props.change('toAddress', bitcoinAddress);
    }
    if (type === CoinTypes.ETHEREUM) {
      this.props.transferActions.setCurrency('ethereum');
      this.props.change('currencySelected', 'ethereum');
      this.props.change('toAddress', ethereumAddress);
    }
    if (type === CoinTypes.OMNI_COIN) {
      this.props.transferActions.setCurrency('omnicoin');
      this.props.change('currencySelected', 'omnicoin');
      this.props.change('toName', to);
    }
  }

  componentWillMount() {
    this.props.ethereumActions.getEthereumWallets();

    this.checkRequestShippingRates();
  }

  componentWillReceiveProps(nextProps) {
    const purchaseParams = new URLSearchParams(this.props.location.search);
    const price = purchaseParams.get('price');
    const currency = purchaseParams.get('currency');
    const { formatMessage } = this.props.intl;
    const { transferCurrency } = this.props.transfer;
    if (this.props.transfer.loading && !nextProps.transfer.loading) {
      if (nextProps.transfer.error) {
        toastr.error(formatMessage(messages.transfer), formatMessage(messages.failedTransfer));
      } else {
        this.props.reset();
        this.handleInitialize(0);
        toastr.success(formatMessage(messages.transfer), formatMessage(messages.successTransfer));
      }
    }

    const useEscrow = !nextProps.transfer.gettingCommonEscrows && nextProps.transferForm.useEscrow;
    if (useEscrow) {
      const { transferForm } = this.props;
      const escrowsWithoutSeller = nextProps.transfer.commonEscrows
        .filter(item => item.name !== transferForm.toName);

      if (!nextProps.transfer.commonEscrows.length || !escrowsWithoutSeller.length) {
        this.hideEscrow();
        toastr.warning(formatMessage(messages.warning), formatMessage(messages.escrowsNotFound));
      } else if (this.props.transfer.gettingCommonEscrows) {
        this.initializeEscrow(escrowsWithoutSeller);
      }
    }
    if (nextProps.bitcoin.wallets !== this.props.bitcoin.wallets) {
      this.props.change('password', nextProps.bitcoin.password);
      this.props.change('guid', nextProps.bitcoin.guid);
    }

    if (nextProps.ethereum.wallets !== this.props.ethereum.wallets) {
      this.props.change('privateKey', nextProps.ethereum.privateKey);
      this.props.change('address', nextProps.bitcoin.address);
    }

    if (transferCurrency !== nextProps.transfer.transferCurrency && !!transferCurrency) {
      const { amount } = this.props.transferForm;
      if (nextProps.transfer.transferCurrency === 'omnicoin') {
        const convertedAmount = currencyConverter(price, currency, 'OMNICOIN');
        this.props.change('amount', convertedAmount);
      }
      if (nextProps.transfer.transferCurrency === 'bitcoin') {
        const convertedAmount = currencyConverter(price, currency, 'BITCOIN');
        this.props.change('amount', convertedAmount);
      }
      if (nextProps.transfer.transferCurrency === 'ethereum') {
        const convertedAmount = currencyConverter(price, currency, 'ETHEREUM');
        this.props.change('amount', convertedAmount);
      }
    }

    if (this.props.shipping.selectedShippingRateIndex !== nextProps.shipping.selectedShippingRateIndex) {
      const rate = nextProps.shipping.shippingRates[nextProps.shipping.selectedShippingRateIndex];
      if (rate) {
        this.onShippingRateChange(rate);
      }
    }
  }

  getListingId() {
    const purchaseParams = new URLSearchParams(this.props.location.search);
    return purchaseParams.get('listing_id');
  }

  checkRequestShippingRates() {
    const listingId = this.getListingId();
    if (listingId) {
      const { listingDetail } = this.props.listing;
      if (listingDetail.shipping_price_included || !listingDetail.weight) {
        return;
      }

      const purchaseParams = new URLSearchParams(this.props.location.search);
      const number = purchaseParams.get('number');

      const listing = {...listingDetail};
      const { buyerAddress } = this.props.transfer;
      this.props.shippingActions.getShippingRates(listing, buyerAddress, number);
    }
  }

  handleInitialize(price) {
    this.props.initialize({
      reputation: 5,
      amount: price || 0.00
    });
  }

  escrowOptions(escrows = []) {
    const { auth: { account }, transferForm: { toName } } = this.props;

    return escrows
      .filter(({ id, name }) => account.id !== id || name !== toName)
      .map(escrow => ({
        key: escrow.id,
        value: escrow.id,
        text: escrow.name
      }));
  }

  initializeEscrow(escrows) {
    const escrowOptions = this.escrowOptions(escrows);
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
        {touched && ((error && <span className="error">{errorMessage}</span>))}
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
        {touched && ((error && <span className="error">{errorMessage}</span>))}
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
        {touched && ((error && <span className="error">{errorMessage}</span>))}
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
    input, options, disabled
  }) => (
      <Select
        className="textfield currency-dropdown-cont"
        value={this.props.transfer.transferCurrency}
        options={options}
        disabled={disabled}
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
      <div className="transfer-input deal">
        {touched && ((error && <span className="error">{errorMessage}</span>))}
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
        {touched && ((error && <span className="error">{errorMessage}</span>))}
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

  onShippingRateChange(shippingRate) {
    const purchaseParams = new URLSearchParams(this.props.location.search);
    const type = purchaseParams.get('type');

    const shippingAmount = currencyConverter(shippingRate.rate, 'USD', type.toUpperCase());
    let newAmount = this.initialAmount + parseFloat(shippingAmount);
    if (type === CoinTypes.BIT_COIN) {
      newAmount = parseFloat(newAmount.toFixed(8));
    } else if (type === CoinTypes.OMNI_COIN) {
      newAmount = parseFloat(newAmount.toFixed(5));
    }
    this.props.change('amount', newAmount);
  }

  renderShippingContent() {
    const { listingDetail } = this.props.listing;
    const { shipping } = this.props;

    if (shipping.loading) {
      return (<div className='transfer-input'><Loader active inline="centered" /></div>);
    }

    const { formatMessage } = this.props.intl;

    if (listingDetail.shipping_price_included) {
      return (<div className='transfer-input'>{formatMessage(messages.shippingCostIsIncluded)}</div>);
    }

    if (!listingDetail.weight || shipping.error || !shipping.shippingRates.length) {
      return (<div className='transfer-input'>{formatMessage(messages.contactSellerForShippingCosts)}</div>);
    }

    return (
      <div className='transfer-input rates'>
        {
          shipping.shippingRates.map((shipRate, index) => {
            return (
              <ShippingRate key={index} index={index} />
            );
          })
        }
      </div>
    );
  }

  renderShipping() {
    const listingId = this.getListingId();
    if (!listingId) {
      return null;
    }

    const { formatMessage } = this.props.intl;

    return (
      <div className="section">
        <p className="title">{formatMessage(messages.shipping)}</p>
        <div className="form-group shipping-cost">
          <span>{formatMessage(messages.shippingCost)}</span>
          { this.renderShippingContent() }
          <div className="col-1" />
        </div>
      </div>
    );
  }

  renderOmniCoinForm() {
    const { formatMessage } = this.props.intl;
    const { transfer, transferForm } = this.props;
    const { gettingCommonEscrows } = this.props.transfer;
    let { commonEscrows } = this.props.transfer;

    const purchaseParams = new URLSearchParams(this.props.location.search);
    const listingId = purchaseParams.get('listing_id');

    commonEscrows = commonEscrows.filter(item => item.name !== transferForm.toName);

    return (
      <div>
        <div className="section">
          <p className="title">{formatMessage(messages.to)}</p>
          <div className="form-group">
            <span>
              {formatMessage(messages.accountName)}*
            </span>
            <Field
              type="text"
              name="toName"
              placeholder={formatMessage(messages.pleaseEnter)}
              component={this.renderAccountNameField}
              className="textfield1"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
              onBlur={() => this.handleEscrowTransactionChecked(true)}
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
                numericality({ '>': 0, message: formatMessage(messages.numberRequired) }),
                amountDecimalsValidator({
                  message: formatMessage(messages.numberExceedsDecimalsLimit, {
                    limit: XOM_DECIMALS_LIMIT
                  }),
                }),
                numericality({ '>=': 0, message: formatMessage(messages.numberCannotBeNegative) })
              ]}
              disabled={!!listingId}
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
                    options={this.escrowOptions(commonEscrows)}
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
        { this.renderShipping() }
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

    const purchaseParams = new URLSearchParams(this.props.location.search);
    const listingId = purchaseParams.get('listing_id');

    return (
      <div>
        <div className="section">
          <p className="title">{formatMessage(messages.from)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.selectWallet)}</span>
            <div className="transfer-input">
              <Field
                name="wallet"
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
            <span>{formatMessage(messages.bitcoinAddress)}*</span>
            <Field
              type="text"
              name="toAddress"
              placeholder={formatMessage(messages.pleaseEnter)}
              component="input"
              className="textfield currency-dropdown-cont"
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
                numericality({ '>': 0, message: formatMessage(messages.numberRequired) }),
                numericality({ '>=': 0, message: formatMessage(messages.numberCannotBeNegative) })
              ]}
              disabled={listingId}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <Field type="text" name="guid" fieldValue={this.props.bitcoin.guid} component={this.renderHiddenField} />
            <Field type="text" name="password" fieldValue={this.props.bitcoin.password} component={this.renderHiddenField} />
            <div className="col-1" />
          </div>
        </div>
        { this.renderShipping() }
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

  renderEthereumForm() {
    const { formatMessage } = this.props.intl;
    const { transfer } = this.props;

    const purchaseParams = new URLSearchParams(this.props.location.search);
    const listingId = purchaseParams.get('listing_id');

    return (
      <div>
        <div className="section">
          <p className="title">{formatMessage(messages.to)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.ethereumAddress)}*</span>
            <Field
              type="text"
              name="toAddress"
              placeholder={formatMessage(messages.pleaseEnter)}
              component="input"
              className="textfield transfer-input-cont"
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
              buttonText="ETH"
              validate={[
                required({ message: formatMessage(messages.fieldRequired) }),
                numericality({ '>': 0, message: formatMessage(messages.numberRequired) }),
                numericality({ '>=': 0, message: formatMessage(messages.numberCannotBeNegative) })
              ]}
              disabled={listingId}
            />
            <Field type="text" name="privateKey" fieldValue={this.props.ethereum.privateKey} component={this.renderHiddenField} />
            <div className="col-1" />
          </div>
        </div>
        { this.renderShipping() }
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
      case 'ethereum':
        return this.renderEthereumForm();
      default:
        return this.renderOmniCoinForm();
    }
  }

  onChangeCurrency = (data) => {
    this.setState({ isPromptVisible: true });
    const { formatMessage } = this.props.intl;
    this.props.transferActions.setCurrency(data.value);
  };

  transferForm() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const purchaseParams = new URLSearchParams(this.props.location.search);
    const listingId = purchaseParams.get('listing_id');
    return (
      <div className="transfer-form">
        <Form onChange={() => this.setState({ isPromptVisible: true })} onSubmit={handleSubmit(this.submitTransfer)} className="transfer-form-container">
          <FormPrompt isVisible={this.state.isPromptVisible}/>
          <div className="form-group">
            <span>{formatMessage(messages.currency)}</span>
            <Field
              type="text"
              name="currencySelected"
              disabled={!!listingId}
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

  submitOmnicoinTransfer({
    toName,
    reputation,
    amount,
    memo,
    useEscrow,
    transferToEscrow,
    escrow,
    expirationTime
  }) {
    const purchaseParams = new URLSearchParams(this.props.location.search);
    if (!useEscrow) {
      this.props.transferActions.omnicoinTransfer(
        toName,
        amount,
        memo,
        reputation,
        purchaseParams.get('listing_id'),
        purchaseParams.get('title'),
        purchaseParams.get('number')
      )
    } else {
      const { currentUser } = this.props.auth;
      this.props.transferActions.createEscrowTransaction(
        currentUser.username,
        toName,
        escrow,
        amount,
        memo,
        transferToEscrow ? transferToEscrow : false,
        expirationTime,
        purchaseParams.get('listing_id'),
        purchaseParams.get('title'),
        purchaseParams.get('number')
      )
    }
  }

  submitBitcoinTransfer({
    toAddress,
    password,
    guid,
    wallet,
    amount
  }) {
    const purchaseParams = new URLSearchParams(this.props.location.search);
    this.props.transferActions.bitcoinTransfer(
      toAddress,
      purchaseParams.get('seller_name'),
      guid,
      password,
      wallet,
      amount,
      purchaseParams.get('listing_id'),
      purchaseParams.get('title'),
      purchaseParams.get('number')
    )
  }

  submitEthereumTransfer({
    toAddress,
    privateKey,
    amount
  }) {
    const purchaseParams = new URLSearchParams(this.props.location.search);
    this.props.transferActions.ethereumTransfer(
      toAddress,
      purchaseParams.get('seller_name'),
      privateKey,
      amount,
      purchaseParams.get('listing_id'),
      purchaseParams.get('title'),
      purchaseParams.get('number')
    )
  }

  submitTransfer(paramValues) {
    const { transferCurrency } = this.props.transfer;
    switch (transferCurrency) {
      case 'omnicoin':
        this.submitOmnicoinTransfer(paramValues);
        break;
      case 'bitcoin':
        this.submitBitcoinTransfer(paramValues);
        break;
      case 'ethereum':
        this.setState({
          isModalOpen: true,
          customParamValues: paramValues
        });
        // this.submitEthereumTransfer(paramValues);
        break;
      default:
        this.submitOmnicoinTransfer(paramValues);
        break;
    }
    this.setState({ isPromptVisible: false });
  }

  onApprove() {
    const { customParamValues } = this.state;
    this.submitEthereumTransfer(customParamValues);
    this.setState({ isModalOpen: false });
  }

  onCancel() {
    this.setState({ isModalOpen: false, customParamValues: {} });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div ref={container => { this.container = container; }} className="container transfer">
        <Header className="button--green-bg" title={formatMessage(messages.transfer)} />
        {this.transferForm()}
        <ConfirmationModal
          onApprove={this.onApprove}
          onCancel={() => this.setState({ isModalOpen: false })}
          isOpen={this.state.isModalOpen}
        >
          {formatMessage(messages.confirmEthereumCurrency)}
        </ConfirmationModal>
      </div>
    );
  }
}

Transfer.propTypes = {
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
  shippingActions: PropTypes.shape({
    getShippingRates: PropTypes.func
  })
};

Transfer.defaultProps = {
  blockchainWallet: {},
  transferActions: {},
  intl: {},
  initialize: {},
  transfer: {},
  transferForm: {},
  changeFieldValue: () => { },
  reset: () => { },
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
      ethereumActions: bindActionCreators({
        getEthereumWallets
      }, dispatch),
      transferActions: bindActionCreators({
        omnicoinTransfer,
        bitcoinTransfer,
        ethereumTransfer,
        setCurrency,
        getCommonEscrows,
        createEscrowTransaction,
        saleBonus
      }, dispatch),
      shippingActions: bindActionCreators({
        getShippingRates
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
    //  asyncValidate: Transfer.asyncValidate,
  })
)(injectIntl(Transfer));
