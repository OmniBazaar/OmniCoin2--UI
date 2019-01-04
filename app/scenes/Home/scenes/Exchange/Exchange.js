import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  initialize,
  getFormSyncErrors
} from 'redux-form';
import {
  Button,
  Form,
  Select,
  Loader
} from 'semantic-ui-react';
import {
  required,
  numericality
} from 'redux-form-validators';
import cn from 'classnames';
import { toastr } from 'react-redux-toastr';
import ethers from 'ethers';
import { ipcRenderer } from 'electron';


import './exchange.scss';
import messages from '../Exchange/messages';
import { makeValidatableField } from '../../../../components/ValidatableField/ValidatableField';
import BitcoinWalletDropdown from '../../scenes/Transfer/component/BitcoinWalletDropdown';
import FormPrompt from '../../../../components/FormPrompt/FormPrompt';
import { exchangeXOM, getMinEthValue, currencyConverter } from '../../../../services/utils';
import Header from '../../../../components/Header';
import {
  exchangeBtc,
  exchangeEth,
  getBtcTransactionFee,
  resetTransactionFees,
  getEthTransactionFee
} from '../../../../services/exchange/exchangeActions';
import {
  numericFieldValidator,
  requiredFieldValidator,
  bitcoinFieldValidator,
  ethAmountValidator
} from '../Marketplace/scenes/Listing/scenes/AddListing/validators';
import { getWallets } from '../../../../services/blockchain/bitcoin/bitcoinActions';
import { SATOSHI_IN_BTC } from '../../../../utils/constants';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import ExchangeRatesTable from './components/ExchangeRatesTable/ExchangeRatesTable';
import Sale from './components/Sale/Sale';

const currencyOptions = [
  {
    key: 'bitcoin',
    value: 'bitcoin',
    text: 'BitCoin',
    description: 'BitCoin Currency'
  },
  {
    key: 'ethereum',
    value: 'ethereum',
    text: 'Ether',
    description: 'Ether Currency'
  }
];

const validate = values => {
  const { currency, wallet, amount } = values;
  const errors = {};

  if (currency === 'bitcoin') {
    const validators = [
      requiredFieldValidator,
      numericFieldValidator,
      bitcoinFieldValidator
    ];

    for (let i = 0; i < validators.length; i++) {
      const err = validators[i](amount);
      if (err) {
        errors.amount = err;
        return errors;
      }
    }

    if (typeof wallet === 'undefined' || wallet === null || wallet < 0) {
      return;
    }

    const walletData = wallets.filter(w => w.index === wallet)[0];
    if (!walletData) {
      return;
    }

    const max = walletData.balance / SATOSHI_IN_BTC;
    const maxValueValidator = numericality({
      '<': max,
      msg: formatMessage(messages.maximumAmountAvailable, {
        amount: max
      })
    });
    const maxErr = maxValueValidator(amount);
    if (maxErr) {
      errors.amount = maxErr;
    }
  }

  return errors;
};

let wallets = [];
let formatMessage;

class Exchange extends Component {
  canDoSale = true;

  state = {
    isPromptVisible: false
  };

  constructor(props) {
    super(props);
    this.BitcoinWalletDropdown = makeValidatableField(BitcoinWalletDropdown);
    this.submitTransfer = this.submitTransfer.bind(this);
  }

  componentDidMount() {
    this.props.exchangeActions.resetTransactionFees();

    this.props.initialize({
      currency: currencyOptions[0].value,
      amount: 0
    });
    wallets = this.props.bitcoin.wallets;
    formatMessage = this.props.intl.formatMessage;
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (this.props.exchange.loading && !nextProps.exchange.loading) {
      this.props.bitcoinActions.getWallets();
      if (nextProps.exchange.error) {
        if (nextProps.exchange.error === 'eth_transaction_not_valid') {
          toastr.error(formatMessage(messages.error), formatMessage(messages.ethTransactionNotValid), {timeOut: 10000});
        } else if (nextProps.exchange.error === 'not_verified') {
          toastr.error(formatMessage(messages.error), formatMessage(messages.accountNotVerified));
        } else if (nextProps.exchange.error.arg === 'privateKey') {
          toastr.error(formatMessage(messages.error), formatMessage(messages.walletNotConnected));
        } else if (nextProps.exchange.error === 'invalid_omnicoin_btc_address') {
          toastr.error(formatMessage(messages.error), formatMessage(messages.omnicoinBtcAddressEmpty));
        } else if (nextProps.exchange.error === 'invalid_omnicoin_eth_address') {
          toastr.error(formatMessage(messages.error), formatMessage(messages.omnicoinEthAddressEmpty));
        } else {
          toastr.error(formatMessage(messages.error), formatMessage(messages.errorExchange));
        }
      } else {
        toastr.success(formatMessage(messages.success), formatMessage(messages.successExchange));
      }
      this.setState({ isPromptVisible: false });
      this.props.reset();
    }

    if (nextProps.bitcoin.wallets !== wallets) {
      wallets = nextProps.bitcoin.wallets;
    }
  }

  openInformationMemorandumPdf = () => {
    ipcRenderer.send('open-pdf', 'https://omnicoin.net/wp-content/uploads/2018/10/Omnicoin-Information-Memorandum.pdf');
  }

  openGeneralTermsOfServicePdf = () => {
    ipcRenderer.send('open-pdf', 'https://omnicoin.net/wp-content/uploads/2018/10/OmniCoin-General-Terms-of-Service.pdf');
  }

  renderCurrencyField = ({
    input, options, disabled
  }) => (
    <Select
      value={this.props.exchangeForm.currency}
      options={options}
      onChange={(param, data) => {
        input.onChange(data.value);
        if (data.value === 'ethereum') {
          if (!this.props.ethereum.privateKey) {
            const { formatMessage } = this.props.intl;
            toastr.warning(formatMessage(messages.warning), formatMessage(messages.walletNotConnected));
          }
        } else if (this.props.bitcoin.wallets.length === 0) {
            const { formatMessage } = this.props.intl;
            toastr.warning(formatMessage(messages.warning), formatMessage(messages.walletNotConnected));
        }
        if (data.value === 'bitcoin') {
          this.getBtcFee();
        } else {
          this.getEthFee();
        }
      }}
      disabled={disabled}
    />
  );

  renderUnitsField = ({
    input, placeholder, buttonText, disabled, buttonClass, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div className="exchange-input">
        {touched && ((error && <span className="error">{errorMessage}</span>))}
        <input
          {...input}
          type="text"
          className="textfield"
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button type='button' className={cn('copy-btn button--gray-text address-button', buttonClass)}>
          {buttonText}
        </Button>
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

  onBitcoinWalletChange = (e, val) => {
    if (val != this.props.exchangeForm.wallet) {
      this.getBtcFee({
        wallet: val
      });
    }
  }

  onBtcAmountChange = () => {
    this.getBtcFee();
  }

  onEthAmountChange = () => {
    this.getEthFee();
  }

  getBtcFee(data) {
    if (!data) data = {};
    const { guid, password } = this.props.bitcoin;
    let { wallet, amount } = data;
    if (typeof wallet === 'undefined') {
      wallet = this.props.exchangeForm.wallet;
    }
    if (typeof amount === 'undefined') {
      amount = this.props.exchangeForm.amount;
    }

    if (typeof wallet !== 'undefined' && typeof amount !== 'undefined' && amount) {
      if (!this.props.formErrors.amount) {
        this.props.exchangeActions.getBtcTransactionFee(guid, password, wallet, amount);
      } else {
        this.props.exchangeActions.resetTransactionFees();
      }
    }
  }

  getEthFee() {
    const { privateKey } = this.props.ethereum;
    const { amount } = this.props.exchangeForm;
    if (typeof amount !== 'undefined' && amount) {
      if (!this.props.formErrors.amount) {
        this.props.exchangeActions.getEthTransactionFee(privateKey, amount);
      } else {
        this.props.exchangeActions.resetTransactionFees();
      }
    }
  }

  async submitTransfer(values) {
    const { currency } = this.props.exchangeForm;
    const { formatMessage } = this.props.intl;
    if (currency === 'bitcoin') {
      const { guid, password } = this.props.bitcoin;
      this.props.exchangeActions.exchangeBtc(guid, password, values.wallet, values.amount, formatMessage);
    } else {
      const { privateKey } = this.props.ethereum;
      this.props.exchangeActions.exchangeEth(privateKey, values.amount, formatMessage);
    }
  }


  renderBitcoinForm() {
    const { formatMessage } = this.props.intl;
    const { amount } = this.props.exchangeForm;
    const {
      requestRatesError, requestingRates,
      rates, sale, gettingBtcFee, btcFee, getBtcFeeError
    } = this.props.exchange;
    const disabled = requestingRates || requestRatesError || !this.canDoSale;
    return (
      <div>
        <div className="section">
          <p className="title">{formatMessage(messages.from)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.selectWallet)}</span>
            <div className="exchange-input">
              <Field
                name="wallet"
                component={this.BitcoinWalletDropdown}
                validate={[
                  required({ msg: formatMessage(messages.fieldRequired) })
                ]}
                onChange={this.onBitcoinWalletChange}
                disabled={!this.canDoSale}
              />
            </div>
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.amount)}*</span>
            <Field
              type="text"
              name="amount"
              placeholder="0.0"
              component={this.renderUnitsField}
              className="textfield1"
              buttonText="BTC"
              onBlur={this.onBtcAmountChange}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.btcTransactionFee)}</span>
            <span className='amount fee'>
              { gettingBtcFee && <Loader active inline className='fee-loader' /> }
              {
                !gettingBtcFee && getBtcFeeError &&
                formatMessage(messages.btcTransactionFeeFail)
              }
              {
                !gettingBtcFee && !getBtcFeeError &&
                `${btcFee} BTC`
              }
            </span>
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.willReceive)}</span>
            <span className='amount'>{!isNaN(amount) && !disabled ? currencyConverter(amount, 'BITCOIN', 'OMNICOIN', false, this.props.currencyRates) : 0} XOM</span>
          </div>
        </div>
      </div>
    );
  }

  renderEthereumForm() {
    const { formatMessage } = this.props.intl;
    const { amount } = this.props.exchangeForm;
    const {
      requestRatesError, requestingRates,
      rates, sale, gettingEthFee, getEthFeeError,
      ethEstimateFee, ethMaxFee
    } = this.props.exchange;
    const disabled = requestingRates || requestRatesError || !this.canDoSale;
    return (
      <div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.amount)}*</span>
            <Field
              type="text"
              name="amount"
              placeholder="0.0"
              component={this.renderUnitsField}
              className="textfield1"
              buttonText="ETH"
              disabled={disabled}
              validate={[
                requiredFieldValidator,
                numericFieldValidator,
                ethAmountValidator({
                  min: disabled ? 0 : getMinEthValue(),
                  max: this.props.ethereum.balance
                })
              ]}
              onBlur={this.onEthAmountChange}
            />
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span className='label-align-top'>{formatMessage(messages.ethTransactionFee)}</span>
            <span className='amount fee eth'>
              {
                !gettingEthFee && getEthFeeError &&
                formatMessage(messages.ethTransactionFeeFail)
              }
              {
                !getEthFeeError &&
                <div>
                  <div>
                    <span>{formatMessage(messages.ethEstimateTransactionFee)}:</span>
                    <span>
                      { gettingEthFee && <Loader active inline className='fee-loader' /> }
                      {!gettingEthFee && `${ethEstimateFee} ETH`}
                    </span>
                  </div>
                  <div>
                    <span>{formatMessage(messages.ethMaxTransactionFee)}:</span>
                    <span>
                      { gettingEthFee && <Loader active inline className='fee-loader' /> }
                      {!gettingEthFee && `${ethMaxFee} ETH`}
                    </span>
                  </div>
                </div>
              }
            </span>
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.willReceive)}</span>
            <span className='amount'>{!isNaN(amount) && !disabled ? currencyConverter(amount, 'ETHEREUM', 'OMNICOIN', false, this.props.currencyRates) : 0} XOM</span>
          </div>
        </div>
      </div>
    );
  }

  renderCheckboxField = ({ input, label, onCheck, disabled }) => (
    <div className="transfer-input" style={{ display: 'flex' }}>
      <Checkbox
        value={input.value}
        onChecked={(value) => {
          input.onChange(value);
          if (onCheck) {
            onCheck(value);
          }
        }}
        disabled={disabled}
      />
      <span className="label">
        {label}
      </span>
    </div>
  );

  renderOmniCoinWhitePaper = ({ disabled }) => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="read-omniCoin-white-paper">
          <Field
            name="omniCoinWhitePaper"
            component={this.renderCheckboxField}
            validate={[requiredFieldValidator]}
            disabled={disabled}
          />
          <p>
            {formatMessage(messages.readOmniCoinWhitePaperText)}
            <a className="link" href="http://whitepaper.omnibazaar.com" target="_blank">
              {formatMessage(messages.readOmniCoinWhitePaperLink)}
            </a>
          </p>
        </div>
      </React.Fragment>
    );
  };

  renderOmniCoinInformationMemorandum = ({ disabled }) => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="read-omniCoin-information-memorandum">
          <Field
            name="omniCoinInformationMemorandum"
            component={this.renderCheckboxField}
            validate={[requiredFieldValidator]}
            disabled={disabled}
          />
          <p>
            {formatMessage(messages.readOmniCoinInformationMemorandumText)}
            <a className="link" onClick={this.openInformationMemorandumPdf}>
              {formatMessage(messages.readOmniCoinInformationMemorandumLink)}
            </a>
          </p>
        </div>
      </React.Fragment>
    );
  };

  renderOmniCoinTokenPurchaseAgreement = ({ disabled }) => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="read-omniCoin-token-purchase-agreement">
          <Field
            name="omniCoinTokenPurchaseAgreement"
            component={this.renderCheckboxField}
            validate={[requiredFieldValidator]}
            disabled={disabled}
          />
          <p>
            {formatMessage(messages.readOmniCoinTokenPurchaseAgreementText)}
            <a className="link" onClick={this.openGeneralTermsOfServicePdf}>
              {formatMessage(messages.readOmniCoinTokenPurchaseAgreementLink)}
            </a>
            {formatMessage(messages.understandOmniCoinTokenPurchaseAgreement)}
          </p>
        </div>
      </React.Fragment>
    );
  };

  checkCanDoSale() {
    const { inProgressPhase, sale } = this.props.exchange;
    if (!inProgressPhase || !sale.progress) {
      return false;
    }

    if (sale.progress.phase !== inProgressPhase.name) {
      return parseFloat(inProgressPhase.xom) > 0;
    }

    return parseFloat(inProgressPhase.xom) - parseFloat(sale.progress.sold) > 0;
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, exchange } = this.props;
    const { currency, wallet } = this.props.exchangeForm;
    this.canDoSale = this.checkCanDoSale();

    return (
      <div className="container exchange-page">
        <div className='header'>
          <span className='title'>{formatMessage(messages.exchange)}</span>
          <div className="page-description">{formatMessage(messages.pageDescription)}</div>
        </div>
        
        <div className='exchange-container'>
          <Sale />

          <div className='divider' />

          <div className='form-heading'>
            <div className='title'>{formatMessage(messages.buyOmnicoins)}</div>
            <span className="omnicoin-appear-notification">{formatMessage(messages.omniCoinsAppearNotification)}</span>
          </div>

          <div className="exchange-form">
            <Form
              onChange={() => this.setState({ isPromptVisible: true })}
              onSubmit={handleSubmit(this.submitTransfer)}
              className="exchange-form-container"
            >
              <FormPrompt isVisible={this.state.isPromptVisible} />
              <div className="section">
                <div className="form-group">
                  <span>{formatMessage(messages.currency)}</span>
                  <div className="exchange-input currency">
                    <Field
                      type="text"
                      name="currency"
                      className="textfield1"
                      options={currencyOptions}
                      component={this.renderCurrencyField}
                      disabled={!this.canDoSale}
                    />
                  </div>
                </div>
              </div>
              {currency === 'bitcoin' && this.renderBitcoinForm()}
              {currency === 'ethereum' && this.renderEthereumForm()}
              <div className="footer-container">
                <span className='left'/>
                <div className="omnicoin-description-links">
                  <Field
                    name="omniCoinWhitePaper"
                    component={this.renderOmniCoinWhitePaper}
                    disabled={!this.canDoSale}
                  />
                  <Field
                    name="omniCoinInformationMemorandum"
                    component={this.renderOmniCoinInformationMemorandum}
                    disabled={!this.canDoSale}
                  />
                  <Field
                    name="omniCoinTokenPurchaseAgreement"
                    component={this.renderOmniCoinTokenPurchaseAgreement}
                    disabled={!this.canDoSale}
                  />

                  <div className="form-group">
                    <Button
                      type="submit"
                      loading={this.props.exchange.loading}
                      content={formatMessage(messages.exchange)}
                      className="button--green-bg submit-btn"
                      disabled={this.props.invalid || !this.canDoSale}
                    />
                  </div>
                </div>
              </div>
            </Form>

            <div className="exchange-rate-table">
              <ExchangeRatesTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const selector = formValueSelector('exchangeForm');

export default compose(
  connect(
    state => ({
      ...state.default,
      currencyRates: state.default.exchange.sale.rates,
      exchangeForm: {
        currency: selector(state, 'currency'),
        amount: selector(state, 'amount'),
        wallet: selector(state, 'wallet')
      },
      formErrors: getFormSyncErrors('exchangeForm')(state)
    }),
    (dispatch) => ({
      initialize,
      changeFieldValue: (field, value) => {
        dispatch(change('exchangeForm', field, value));
      },
      exchangeActions: bindActionCreators({
        exchangeEth,
        exchangeBtc,
        getBtcTransactionFee,
        resetTransactionFees,
        getEthTransactionFee
      }, dispatch),
      bitcoinActions: bindActionCreators({
        getWallets
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'exchangeForm',
    keepDirtyOnReinitialize: true,
    enableReinitdestroyOnUnmountialize: true,
    destroyOnUnmount: true,
    validate,
  })
)(injectIntl(Exchange));
