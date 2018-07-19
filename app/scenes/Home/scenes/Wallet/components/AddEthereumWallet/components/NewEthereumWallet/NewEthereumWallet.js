import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import { required, length } from 'redux-form-validators';
import PropTypes from 'prop-types';

import FormField from '../../../FormField/FormField';
import ModalFooter from '../../../../../../../../components/ModalFooter/ModalFooter';
import {
  toggleEthereumModal,
  createEthereumWallet,
  getEthereumWallets
} from '../../../../../../../../services/blockchain/ethereum/EthereumActions';

import './new-wallet.scss';

const messages = defineMessages({
  createPassword: {
    id: 'NewEthereumWallet.createPassword',
    defaultMessage: 'Create Password for Wallet Access'
  },
  repeatPassword: {
    id: 'NewEthereumWallet.repeatPassword',
    defaultMessage: 'Repeat Password for Wallet Access'
  },
  email: {
    id: 'NewEthereumWallet.email',
    defaultMessage: 'Email for Restore Access'
  },
  message: {
    id: 'NewEthereumWallet.message',
    defaultMessage: 'Providing email is optional, but we strongly recommending to enter it. Otherwise, you will not be able to restore access to wallet in case password loss.'
  },
  createWallet: {
    id: 'NewEthereumWallet.createWallet',
    defaultMessage: 'CREATE WALLET'
  },
  cancel: {
    id: 'NewEthereumWallet.cancel',
    defaultMessage: 'CANCEL'
  },
  pleaseEnter: {
    id: 'NewEthereumWallet.enter',
    defaultMessage: 'Please enter'
  },
  error: {
    id: 'NewEthereumWallet.error',
    defaultMessage: 'Error'
  },
  noMatch: {
    id: 'NewEthereumWallet.noMatch',
    defaultMessage: 'Passwords do not match'
  },
  fieldRequired: {
    id: 'NewEthereumWallet.required',
    defaultMessage: 'This field is required'
  },
  label: {
    id: 'NewEthereumWallet.label',
    defaultMessage: 'Label'
  },
  success: {
    id: 'NewEthereumWallet.success',
    defaultMessage: 'Success'
  },
  rememberGuid: {
    id: 'NewEthereumWallet.rememberGuid',
    defaultMessage: 'Please do not forget to write down or remember your guid'
  },
  minLength: {
    id: 'NewEthereumWallet.minLength',
    defaultMessage: 'This field must be at least 10 characters in length'
  }
});

class NewEthereumWallet extends Component {
  static validate = (values) => {
    const errors = {};
    if (values.password !== values.repeatPassword) {
      errors.repeatPassword = messages.noMatch;
    }
    return errors;
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (!nextProps.ethereum.loading && this.props.ethereum.loading) {
      if (nextProps.ethereum.error) {
        toastr.error(formatMessage(messages.error, nextProps.ethereum.error));
      } else {
        toastr.success(formatMessage(messages.success), formatMessage(messages.rememberGuid));
        this.props.EthereumActions.getEthereumWallets();
        this.props.EthereumActions.toggleEthereumModal();
      }
    }
  }

  handleSubmit(values) {
    this.props.EthereumActions.createEthereumWallet(
      values.password ? values.password : '',
      values.label ? values.label : '',
      values.email ? values.email : ''
    );
  }

  handleCancel() {
    this.props.EthereumActions.toggleEthereumModal();
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, valid } = this.props;
    const { loading } = this.props.ethereum;
    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)} className="add-ethereum-wallet">
        {/* <Field
          name="password"
          placeholder={formatMessage(messages.pleaseEnter)}
          type="password"
          message={formatMessage(messages.createPassword) + '*'}
          validate={[
            required({ message: formatMessage(messages.fieldRequired) }),
            length({ min: 10, message: formatMessage(messages.minLength) })
          ]}
          component={FormField}
        />
        <Field
          name="repeatPassword"
          placeholder={formatMessage(messages.pleaseEnter)}
          type="password"
          message={formatMessage(messages.repeatPassword) + '*'}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
          component={FormField}
        /> */}
        <Field
          name="label"
          placeholder={formatMessage(messages.pleaseEnter)}
          message={formatMessage(messages.label)}
          component={FormField}
        />
        {/* <Field
          name="email"
          placeholder={formatMessage(messages.email)}
          type="email"
          message={formatMessage(messages.email)}
          component={FormField}
        /> */}
        <div className="form-field">
          <div />
          <span className="email-tooltip">{formatMessage(messages.message)}</span>
        </div>
        <ModalFooter
          successContent={formatMessage(messages.createWallet)}
          cancelContent={formatMessage(messages.cancel)}
          handleCancel={this.handleCancel}
          loading={loading}
          disabled={!valid}
        />
      </Form>
    );
  }
}

NewEthereumWallet.propTypes = {
  ethereum: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
    guid: PropTypes.string,
    password: PropTypes.string
  }).isRequired,
  EthereumActions: PropTypes.shape({
    getEthereumWallets: PropTypes.func,
    toggleEthereumModal: PropTypes.func,
    createEthereumWallet: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
};

export default compose(
  connect(
    state => ({ ...state.default }),
    dispatch => ({
      EthereumActions: bindActionCreators({
        toggleEthereumModal,
        createEthereumWallet,
        getEthereumWallets
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'newEthereumWalletForm',
    validate: NewEthereumWallet.validate,
    destroyOnUnmount: true,
  })
)(injectIntl(NewEthereumWallet));
