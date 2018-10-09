import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  initialize
} from 'redux-form';
import {
  Button,
  Form,
  Select,
} from 'semantic-ui-react';
import {
  required,
  numericality,
  addValidator
} from 'redux-form-validators';
import cn from 'classnames';
import { toastr } from 'react-redux-toastr';
import ethers from 'ethers';

import './exchange.scss';

import messages from '../Exchange/messages';
import { makeValidatableField } from '../../../../components/ValidatableField/ValidatableField';
import BitcoinWalletDropdown from '../../scenes/Transfer/component/BitcoinWalletDropdown';
import FormPrompt from '../../../../components/FormPrompt/FormPrompt';
import { currencyConverter, getMinEthValue } from '../../../../services/utils';
import Header from '../../../../components/Header';
import {
  exchangeBtc,
  exchangeEth
} from '../../../../services/exchange/exchangeActions';
import {
  numericFieldValidator,
  requiredFieldValidator,
  ethereumFieldValidator,
  bitcoinFieldValidator
} from '../Marketplace/scenes/Listing/scenes/AddListing/validators';
import { getWallets } from '../../../../services/blockchain/bitcoin/bitcoinActions';
import { SATOSHI_IN_BTC } from '../../../../utils/constants';
import Checkbox from '../../../../components/Checkbox/Checkbox';

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
    text: 'Ethereum',
    description: 'Ethereum Currency'
  }
];

const minEth = getMinEthValue();

const ethAmountValidator = addValidator({
  validator: (option, value, allValues) => {
    const max = ethers.utils.parseEther(option.max + '');
    const min = ethers.utils.parseEther(minEth);
    let eth;
    try {
      eth = ethers.utils.parseEther(value + '')
    } catch (err) {
      return {
        ...messages.minimumAmount,
        values: {
          amount: minEth
        }
      }
    }

    if (eth.lt(min)) {
      return {
        ...messages.minimumAmount,
        values: {
          amount: minEth
        }
      }
    }
    
    if (eth.gte(max)) {
      return {
        ...messages.maximumAmountAvailable,
        values: {
          amount: option.max
        }
      }
    }
  }
});

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
    const maxValueValidator = numericality({ '<': max, msg: formatMessage(messages.maximumAmountAvailable, {
        amount: max 
    })});
    const maxErr = maxValueValidator(amount);
    if (maxErr) {
      errors.amount = maxErr;
    }
  }

  return errors
}

let wallets = [];
let formatMessage;

class Exchange extends Component {

  state = {
    isPromptVisible: false
  };

  constructor(props) {
    super(props);
    this.BitcoinWalletDropdown = makeValidatableField(BitcoinWalletDropdown);
    this.submitTransfer = this.submitTransfer.bind(this);
  }

  componentDidMount() {
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
        if (nextProps.exchange.error.arg === 'privateKey') {
          toastr.error(formatMessage(messages.error), formatMessage(messages.walletNotConnected));
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

  renderCurrencyField = ({
                           input, options
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
      }}
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
        <Button className={cn('copy-btn button--gray-text address-button', buttonClass)}>
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

  submitTransfer(values) {
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
              />
            </div>
            <div className="col-1" />
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
            />
            <div className="col-1" />
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.willReceive)}</span>
            <span>{!isNaN(amount) ? currencyConverter(amount, 'BITCOIN', 'OMNICOIN') : 0} XOM</span>
            <div className="col-2" />
          </div>
        </div>
      </div>
    );
  }

  renderEthereumForm() {
    const { formatMessage } = this.props.intl;
    const { amount } = this.props.exchangeForm;
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
              validate={[
                requiredFieldValidator,
                numericFieldValidator,
                ethAmountValidator({max: this.props.ethereum.balance})
              ]}
            />
            <div className="col-1" />
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.willReceive)}</span>
            <span>{amount ? currencyConverter(amount, 'ETHEREUM', 'OMNICOIN') : 0} XOM</span>
            <div className="col-2" />
          </div>
        </div>
      </div>
    );
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

  renderOmniCoinWhitePaper = () => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="read-omniCoin-white-paper">
          <Field
            name="omniCoinWhitePaper"
            component={this.renderCheckboxField}
            validate={[requiredFieldValidator]}
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

  renderOmniCoinInformationMemorandum = () => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="read-omniCoin-information-memorandum">
          <Field
            name="omniCoinInformationMemorandum"
            component={this.renderCheckboxField}
            validate={[requiredFieldValidator]}          
          />
          <p>
            {formatMessage(messages.readOmniCoinInformationMemorandumText)}
            <a className="link" href="https://drive.google.com/open?id=1xYj1s_VM4WavRV4Bm-tmNuTBKAop9vUy" target="_blank">
              {formatMessage(messages.readOmniCoinInformationMemorandumLink)}
            </a>
          </p>
        </div>
      </React.Fragment>
    );
  };

  renderOmniCoinTokenPurchaseAgreement = () => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="read-omniCoin-token-purchase-agreement">
          <Field
            name="omniCoinTokenPurchaseAgreement"
            component={this.renderCheckboxField}
            validate={[requiredFieldValidator]}
          />
          <p>
            {formatMessage(messages.readOmniCoinTokenPurchaseAgreementText)}
            <a className="link" href="https://drive.google.com/open?id=1xYj1s_VM4WavRV4Bm-tmNuTBKAop9vUy" target="_blank">
              {formatMessage(messages.readOmniCoinTokenPurchaseAgreementLink)}
            </a>
            {formatMessage(messages.understandOmniCoinTokenPurchaseAgreement)}
          </p>
        </div>
      </React.Fragment>
    );
  };


  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { currency, wallet } = this.props.exchangeForm;
    return (
      <div className="container">
        <Header className="button--green-bg" title={formatMessage(messages.exchange)} />
        <span className="page-description">{formatMessage(messages.pageDescription)}</span>
        <div className="exchange-form">
          <Form
            onChange={() => this.setState({ isPromptVisible: true })}
            onSubmit={handleSubmit(this.submitTransfer)}
            className="exchange-form-container">
            <FormPrompt isVisible={this.state.isPromptVisible}/>
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
                  />
                </div>
                <div className="col-1" />
              </div>
            </div>
            {currency === 'bitcoin' && this.renderBitcoinForm()}
            {currency === 'ethereum' && this.renderEthereumForm()}
            <div className="omnicoin-description-links">
              <Field name="omniCoinWhitePaper" component={this.renderOmniCoinWhitePaper} />
              <Field name="omniCoinInformationMemorandum" component={this.renderOmniCoinInformationMemorandum} />
              <Field name="omniCoinTokenPurchaseAgreement" component={this.renderOmniCoinTokenPurchaseAgreement} />                
            
              <div className="form-group">
                <span />
                <div className="field left floated">
                  <Button
                    type="submit"
                    loading={this.props.exchange.loading}
                    content={formatMessage(messages.exchange)}
                    className="button--green-bg"
                    disabled={this.props.invalid}
                  />
                </div>
                <div className="col-1" />
              </div>
            </div>
          </Form>
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
    exchangeForm: {
      currency: selector(state, 'currency'),
      amount: selector(state, 'amount'),
      wallet: selector(state, 'wallet')
    }
  }),
  (dispatch) => ({
    initialize,
    changeFieldValue: (field, value) => {
      dispatch(change('exchangeForm', field, value));
    },
    exchangeActions: bindActionCreators({
      exchangeEth,
      exchangeBtc
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
  validate: validate,
})
)(injectIntl(Exchange));
