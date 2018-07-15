import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

import FormField from '../../../FormField/FormField';
import ModalFooter from '../../../../../../../../components/ModalFooter/ModalFooter';
import { toggleEthereumModal, getEthereumWallets, connectEthereumWallet } from '../../../../../../../../services/blockchain/ethereum/EthereumActions';
import messages from './messages';
import './existing-wallet.scss';

class ExistingEthereumWallet extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.ethereum.connectingWallet
          && this.props.ethereum.connectingWallet) {
      if (nextProps.ethereum.modal.isOpen) {
        this.toggleEthereumModal();
      }
      if (nextProps.ethereum.connectWalletError) {
        this.showErrorToast(
          messages.connectErrorTitle,
          messages.connectErrorMessage
        );
      }
    }
  }

  toggleEthereumModal = () => {
    this.props.EthereumActions.toggleEthereumModal();
  };

  handleSubmit(values) {
    const { guid, password } = values;
    this.props.EthereumActions.connectEthereumWallet(guid, password);
  }

  handleCancel() {
    this.toggleEthereumModal();
  }

  showErrorToast(title, message) {
    const { formatMessage } = this.props.intl;
    toastr.error(formatMessage(title), formatMessage(message));
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, valid } = this.props;
    const { connectingWallet } = this.props.ethereum;
    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)} className="add-ethereum-wallet">
        <Field
          name="password"
          placeholder={formatMessage(messages.pleaseEnter)}
          type="password"
          message={formatMessage(messages.enterPassword) + '*'}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
          component={FormField}
        />
        <Field
          name="guid"
          placeholder={formatMessage(messages.pleaseEnter)}
          message={formatMessage(messages.walletGuid) + '*'}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
          component={FormField}
        />
        <ModalFooter
          successContent={formatMessage(messages.connect)}
          cancelContent={formatMessage(messages.cancel)}
          handleCancel={this.handleCancel}
          loading={connectingWallet}
          disabled={!valid}
        />
      </Form>
    );
  }
}

ExistingEthereumWallet.propTypes = {
  ethereum: PropTypes.shape({
    modal: PropTypes.shape({
      isOpen: PropTypes.bool
    }),
    loading: PropTypes.bool,
    connectWalletError: PropTypes.object,
    connectingWallet: PropTypes.bool
  }).isRequired,
  EthereumActions: PropTypes.shape({
    toggleEthereumModal: PropTypes.func,
    getEthereumWallets: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
};

export default compose(
  connect(
    state => ({
      ethereum: state.default.ethereum
    }),
    dispatch => ({
      EthereumActions: bindActionCreators({ toggleEthereumModal, getEthereumWallets, connectEthereumWallet }, dispatch)
    })
  ),
  reduxForm({
    form: 'existingEthereumWalletForm',
    destroyOnUnmount: true,
  })
)(injectIntl(ExistingEthereumWallet));
