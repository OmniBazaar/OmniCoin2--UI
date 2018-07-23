import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import publicIp from 'public-ip';

import FormField from '../../../FormField/FormField';
import ModalFooter from '../../../../../../../../components/ModalFooter/ModalFooter';
import { toggleModal, getWallets, connectWallet } from '../../../../../../../../services/blockchain/bitcoin/bitcoinActions';
import messages from './messages';
import './existing-wallet.scss';
import ip from "ip";

class ExistingWallet extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (!nextProps.bitcoin.connectingWallet
          && this.props.bitcoin.connectingWallet) {
      if (nextProps.bitcoin.modal.isOpen) {
        this.toggleModal();
      }
      if (nextProps.bitcoin.connectWalletError && !this.props.bitcoin.connectWalletError) {
        if (nextProps.bitcoin.connectWalletError.error.indexOf("Wallets that require email authorization are currently not supported in the Wallet API. Please disable this in your wallet settings, or add the IP address of this server to your wallet IP whitelist.") !== -1) {
          publicIp.v4().then(ip => {
            toastr.error(formatMessage(messages.ipError, { ip }));
          })
        } else {
          this.showErrorToast(
            messages.connectErrorTitle,
            messages.connectErrorMessage
          );
        }
      }
    }
  }

  toggleModal = () => {
    this.props.bitcoinActions.toggleModal();
  };

  handleSubmit(values) {
    const { guid, password } = values;
    this.props.bitcoinActions.connectWallet(guid, password);
  }

  handleCancel() {
    this.toggleModal();
  }

  showErrorToast(title, message) {
    const { formatMessage } = this.props.intl;
    toastr.error(formatMessage(title), formatMessage(message));
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, valid } = this.props;
    const { connectingWallet } = this.props.bitcoin;
    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)} className="add-bitcoin-wallet">
        <Field
          name="password"
          placeholder={formatMessage(messages.pleaseEnter)}
          type="password"
          message={`${formatMessage(messages.enterPassword)}*`}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
          component={FormField}
        />
        <Field
          name="guid"
          placeholder={formatMessage(messages.pleaseEnter)}
          message={`${formatMessage(messages.walletGuid)}*`}
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

ExistingWallet.propTypes = {
  bitcoin: PropTypes.shape({
    modal: PropTypes.shape({
      isOpen: PropTypes.bool
    }),
    loading: PropTypes.bool,
    connectWalletError: PropTypes.object,
    connectingWallet: PropTypes.bool
  }).isRequired,
  bitcoinActions: PropTypes.shape({
    toggleModal: PropTypes.func,
    getWallets: PropTypes.func
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
      bitcoin: state.default.bitcoin
    }),
    dispatch => ({
      bitcoinActions: bindActionCreators({ toggleModal, getWallets, connectWallet }, dispatch)
    })
  ),
  reduxForm({
    form: 'existingWalletForm',
    destroyOnUnmount: true,
  })
)(injectIntl(ExistingWallet));
