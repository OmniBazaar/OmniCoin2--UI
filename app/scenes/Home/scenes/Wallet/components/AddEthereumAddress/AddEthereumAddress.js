import React, { Component } from 'react';
import {
  Modal,
  Form,
  Button
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import FormField from '../FormField/FormField';
import ModalFooter from '../../../../../../components/ModalFooter/ModalFooter';
import { toggleAddAddressEthereumModal, addEthereumAddress } from '../../../../../../services/blockchain/ethereum/EthereumActions';
import './add-ethereum-address.scss';

const messages = defineMessages({
  label: {
    id: 'AddEthereumAddress.label',
    defaultMessage: 'Label (optional)'
  },
  add: {
    id: 'AddEthereumAddress.createWallet',
    defaultMessage: 'ADD'
  },
  cancel: {
    id: 'AddEthereumAddress.cancel',
    defaultMessage: 'CANCEL'
  },
  pleaseEnter: {
    id: 'AddEthereumAddress.pleaseEnter',
    defaultMessage: 'Please enter'
  }
});

class AddEthereumAddress extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ethereum.addAddressModal.isOpen
          && !nextProps.ethereum.loading
          && this.props.ethereum.loading
    ) {
      this.toggleEthereumModal();
    }
  }

  handleSubmit(values) {
    const {
      guid,
      password
    } = this.props.ethereum;
    this.props.EthereumActions.addEthereumAddress(guid, password, values.label ? values.label : '');
  }

  handleCancel() {
    this.toggleEthereumModal();
  }

  toggleEthereumModal = () => {
    this.props.EthereumActions.toggleAddAddressEthereumModal();
  };

  render() {
    const { isOpen } = this.props.ethereum.addAddressModal;
    const { loading } = this.props.ethereum;
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    return (
      <Modal size="tiny" open={isOpen} onClose={this.toggleEthereumModal} closeIcon>
        <Modal.Content>
          <Form className="add-ethereum-address" onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              name="label"
              placeholder={formatMessage(messages.pleaseEnter)}
              message={formatMessage(messages.label)}
              component={FormField}
            />
            <ModalFooter
              cancelContent={formatMessage(messages.cancel)}
              handleCancel={this.handleCancel}
              successContent={formatMessage(messages.add)}
              loading={loading}
            />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

AddEthereumAddress.propTypes = {
  ethereum: PropTypes.shape({
    addAddressModal: PropTypes.shape({
      isOpen: PropTypes.bool
    }),
    loading: PropTypes.bool,
    guid: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
  EthereumActions: PropTypes.shape({
    addEthereumAddress: PropTypes.func,
    toggleAddAddressEthereumModal: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      EthereumActions: bindActionCreators({ toggleAddAddressEthereumModal, addEthereumAddress }, dispatch),
    })
  ),
  reduxForm({
    form: 'addEthereumAddressForm',
    destroyOnUnmount: true,
  })
)(injectIntl(AddEthereumAddress));
