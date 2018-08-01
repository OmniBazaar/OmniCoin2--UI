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
  createWallet: {
    id: 'NewEthereumWallet.createWallet',
    defaultMessage: 'CREATE WALLET'
  },
  cancel: {
    id: 'NewEthereumWallet.cancel',
    defaultMessage: 'CANCEL'
  },
  error: {
    id: 'NewEthereumWallet.error',
    defaultMessage: 'Error'
  },
  success: {
    id: 'NewEthereumWallet.success',
    defaultMessage: 'Success'
  },
  successMessage: {
    id: 'NewEthereumWallet.successMessage',
    defaultMessage: 'Wallet added successfully'
  },
  info: {
    id: 'NewEthereumWallet.info',
    defaultMessage: 'Create New ETHEREUM Wallet'
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
        toastr.success(formatMessage(messages.success), formatMessage(messages.successMessage));
        this.props.EthereumActions.getEthereumWallets();
        this.props.EthereumActions.toggleEthereumModal();
      }
    }
  }

  handleSubmit(values) {
    this.props.EthereumActions.createEthereumWallet();
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
        <p>
          {formatMessage(messages.info)}
        </p><br/>
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
