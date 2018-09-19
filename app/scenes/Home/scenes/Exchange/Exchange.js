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
} from 'redux-form';
import {
  Button,
  Form,
  Select
} from 'semantic-ui-react';
import {
  required,
  numericality
} from 'redux-form-validators';
import cn from 'classnames';
import { toastr } from 'react-redux-toastr';

import './exchange.scss';

import messages from "../Exchange/messages";
import {makeValidatableField} from "../../../../components/ValidatableField/ValidatableField";
import BitcoinWalletDropdown from '../../scenes/Transfer/component/BitcoinWalletDropdown';
import FormPrompt from '../../../../components/FormPrompt/FormPrompt';
import {currencyConverter} from "../../../../services/utils";
import Header from '../../../../components/Header';
import {
  exchangeBtc,
  exchangeEth
} from "../../../../services/exchange/exchangeActions";
import {getEthereumWallets} from "../../../../services/blockchain/ethereum/EthereumActions";


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
    })
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (this.props.exchange.loading && !nextProps.exchange.loading) {
      if (nextProps.exchange.error) {
        toastr.error(formatMessage(messages.error), nextProps.exchange.error);
      } else {
        toastr.success(formatMessage(messages.success), nextProps.exchange.successExchange);
      }
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
    if (currency === 'bitcoin') {
      const { guid, password } = this.props.bitcoin;
      this.props.exchangeActions.exchangeBtc(guid, password, values.wallet, values.amount);
    } else {
      const { privateKey } = this.props.ethereum;
      this.props.exchangeActions.exchangeEth(privateKey, values.amount);
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
                  required({ message: formatMessage(messages.fieldRequired) })
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
              validate={[
                required({ message: formatMessage(messages.fieldRequired) }),
                numericality({ '>': 0, message: formatMessage(messages.numberRequired) }),
                numericality({ '>=': 0, message: formatMessage(messages.numberCannotBeNegative) })
              ]}
            />
            <div className="col-1" />
          </div>
        </div>
        <div className="section">
          <div className="form-group">
            <span>{formatMessage(messages.willReceive)}</span>
            <span>{amount ? currencyConverter(amount, 'BITCOIN', 'OMNICOIN') : 0} XOM</span>
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
                required({ message: formatMessage(messages.fieldRequired) }),
                numericality({ '>': 0, message: formatMessage(messages.numberRequired) }),
                numericality({ '>=': 0, message: formatMessage(messages.numberCannotBeNegative) })
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


  render() {
      const { formatMessage } = this.props.intl;
      const { handleSubmit } = this.props;
      const { currency } = this.props.exchangeForm;
      return (
        <div className="container">
          <Header className="button--green-bg" title={formatMessage(messages.exchange)} />
          <div className="exchange-form">
            <Form
              onChange={() => this.setState({ isPromptVisible: true })}
              onSubmit={handleSubmit(this.submitTransfer)}
              className="exchange-form-container">
              <FormPrompt isVisible={this.state.isPromptVisible}/>
              <div className="section">
                <div className="form-group">
                  <span>{formatMessage(messages.currency)}</span>
                  <Field
                    type="text"
                    name="currency"
                    options={currencyOptions}
                    component={this.renderCurrencyField}
                  />
                  <div className="col-1" />
                </div>
              </div>
              {currency === 'bitcoin' && this.renderBitcoinForm()}
              {currency === 'ethereum' && this.renderEthereumForm()}
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
        amount: selector(state, 'amount')
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
    })
  ),
  reduxForm({
    form: 'exchangeForm',
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    destroyOnUnmount: true,
  })
)(injectIntl(Exchange));
