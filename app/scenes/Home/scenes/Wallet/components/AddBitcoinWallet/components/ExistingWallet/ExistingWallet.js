import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import PropTypes from 'prop-types';

import FormField from '../../../FormField/FormField';
import { toggleModal, getWallets } from '../../../../../../../../services/blockchain/bitcoin/bitcoinActions';
import './existing-wallet.scss';

const messages = defineMessages({
  enterPassword: {
    id: 'ExistingWallet.enterPassword',
    defaultMessage: 'Enter Password for Account Access',
  },
  pleaseEnter: {
    id: 'ExistingWallet.pleaseEnter',
    defaultMessage: 'Please Enter'
  },
  walletGuid: {
    id: 'ExistingWallet.walletGuid',
    defaultMessage: 'Wallet GUID'
  },
  cancel: {
    id: 'ExistingWallet.cancel',
    defaultMessage: 'CANCEL'
  },
  connect: {
    id: 'ExistingWallet.connect',
    defaultMessage: 'CONNECT'
  },
  fieldRequired: {
    id: 'NewWallet.required',
    defaultMessage: 'This field is required'
  }
});


class ExistingWallet extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bitcoin.modal.isOpen
          && !nextProps.bitcoin.loading
          && this.props.bitcoin.loading
    ) {
      this.toggleModal();
    }
  }

  toggleModal = () => {
    this.props.bitcoinActions.toggleModal();
  };

  handleSubmit(values) {
    this.props.bitcoinActions.getWallets(
      values.guid,
      values.password
    );
  }

  handleCancel() {
    this.toggleModal();
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, valid } = this.props;
    const { loading } = this.props.bitcoin;
    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)} className="add-bitcoin-wallet">
        <Field
          name="password"
          placeholder={formatMessage(messages.pleaseEnter)}
          type="password"
          message={formatMessage(messages.enterPassword)}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
          component={FormField}
        />
        <Field
          name="guid"
          placeholder={formatMessage(messages.pleaseEnter)}
          message={formatMessage(messages.walletGuid)}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
          component={FormField}
        />
        <div className="footer">
          <Button
            className="button--transparent"
            content={formatMessage(messages.cancel)}
            loading={loading}
            onClick={this.handleCancel}
          />
          <Button
            className="button--primary"
            disabled={!valid}
            loading={loading}
            content={formatMessage(messages.connect)}
            type="submit"
          />
        </div>
      </Form>
    );
  }
}

ExistingWallet.propTypes = {
  bitcoin: PropTypes.shape({
    modal: PropTypes.shape({
      isOpen: PropTypes.bool
    }),
    loading: PropTypes.bool
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
    state => ({ ...state.default }),
    dispatch => ({
      bitcoinActions: bindActionCreators({ toggleModal, getWallets }, dispatch)
    })
  ),
  reduxForm({
    form: 'existingWalletForm',
    destroyOnUnmount: true,
  })
)(injectIntl(ExistingWallet));
