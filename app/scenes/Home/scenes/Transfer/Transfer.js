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
import { required, numericality } from 'redux-form-validators';
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  initialize
} from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { toastr } from 'react-redux-toastr';
import { FetchChain } from 'omnibazaarjs/es';

import Checkbox from '../../../../components/Checkbox/Checkbox';
import DealRating from '../../../../components/DealRating/DealRating';
import Header from '../../../../components/Header';
import './transfer.scss';
import {
  submitTransfer,
  getCommonEscrows,
  createEscrowTransaction
} from '../../../../services/transfer/transferActions';
import { reputationOptions } from '../../../../services/utils';


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
    id: 'Transfer.successUpdate',
    defaultMessage: 'Transferred successfully'
  },
  failedTransfer: {
    id: 'Transfer.failedUpdate',
    defaultMessage: 'Failed to transfer'
  },
  selectEscrow: {
    id: 'Transfer.selectEscrow',
    defaultMessage: 'Select escrow'
  },
  transferToEscrow: {
    id: 'Transfer.transferToEscrow',
    defaultMessage: 'Transfer to escrow'
  },
  expirationTime: {
    id: 'Transfer.expirationTime',
    defaultMessage: 'Expiration time'
  },
  oneDay: {
    id: 'Transfer.oneDay',
    defaultMessage: '1 day'
  },
  threeDays: {
    id: 'Transfer.threeDays',
    defaultMessage: '3 days'
  },
  oneWeek: {
    id: 'Transfer.oneWeek',
    defaultMessage: '1 week'
  },
  twoWeeks: {
    id: 'Transfer.twoWeeks',
    defaultMessage: '2 weeks'
  },
  oneMonth: {
    id: 'Transfer.oneMonth',
    defaultMessage: '1 month'
  },
  threeMonths: {
    id: 'Transfer.threeMonths',
    defaultMessage: '3 months'
  },
  escrowFee: {
    id: 'Transfer.escrowFee',
    defaultMessage: 'Escrow Fee: 0.1%(0,00 XOM)'
  },
  transferToEscrowLabel: {
    id: 'Transfer.transferToEscrowLabel',
    defaultMessage: 'Funds will be kept on escrow account'
  },
  warning: {
    id: 'Transfer.warning',
    defaultMessage: 'Warning'
  },
  escrowsNotFound: {
    id: 'Transfer.escrowNotFound',
    defaultMessage: 'Unfortunately you don\'t any have any common escrows with the specified account',
  },
  numberRequired: {
    id: 'Transfer.numberRequired',
    defaultMessage: 'Number required'
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
  }

  handleInitialize() {
    this.props.initialize({
      reputation: 5,
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
    input, options, meta: { touched, error }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div className="transfer-input">
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
        <Select
          className="textfield"
          defaultValue={options[0].value}
          options={options}
          onChange={(param, data) => input.onChange(data.value)}
        />
      </div>
    );
  };

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
      this.props.transferActions.getCommonEscrows(this.props.transferForm.toName, currentUser.username);
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

  transferForm() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, transfer } = this.props;
    const {
      gettingCommonEscrows,
      commonEscrows
    } = this.props.transfer;
    return (
      <div className="transfer-form">
        <Form onSubmit={handleSubmit(this.submitTransfer)} className="transfer-form-container">
          <p className="title">{formatMessage(messages.to)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.accountNameOrPublicKey)}</span>
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
          <p className="title">{formatMessage(messages.transfer)}</p>
          <div className="form-group">
            <span>{formatMessage(messages.amount)}</span>
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
                label={formatMessage(messages.escrowFee)}
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
        </Form>
      </div>
    );
  }
  submitTransfer(paramValues) {
    const values = {
      ...paramValues,
      memo: paramValues.memo ? paramValues.memo : ''
    };

    if (values.useEscrow) {
      const { currentUser } = this.props.auth;
      this.props.transferActions.createEscrowTransaction(
        values.expirationTime,
        currentUser.username,
        values.toName,
        values.escrow,
        values.amount,
        values.transferToEscrow,
        values.memo
      );
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
  transferActions: PropTypes.shape({
    submitTransfer: PropTypes.func,
    getCommonEscrows: PropTypes.func,
    createEscrowTransaction: PropTypes.func
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  initialize: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  transfer: PropTypes.shape({
    loading: PropTypes.bool,
    gettingCommonEscrows: PropTypes.bool,
    error: PropTypes.string,
    commonEscrows: PropTypes.shape([])
  }),
  transferForm: PropTypes.shape({
    toName: PropTypes.string,
    useEscrow: PropTypes.bool
  }),
  changeFieldValue: PropTypes.func,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    })
  })
};

Transfer.defaultProps = {
  transferActions: {},
  intl: {},
  initialize: {},
  transfer: {},
  transferForm: {},
  changeFieldValue: () => {},
  auth: {}
};

const selector = formValueSelector('transferForm');

export default compose(
  connect(
    state => ({
      ...state.default,
      transferForm: {
        toName: selector(state, 'toName'),
        useEscrow: selector(state, 'useEscrow')
      }
    }),
    (dispatch) => ({
      transferActions: bindActionCreators({
        submitTransfer,
        getCommonEscrows,
        createEscrowTransaction
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
    fields: ['toName', 'useEscrow'],
    asyncValidate: Transfer.asyncValidate,
    asyncBlurFields: ['toName'],
    destroyOnUnmount: true,
  })
)(injectIntl(Transfer));
