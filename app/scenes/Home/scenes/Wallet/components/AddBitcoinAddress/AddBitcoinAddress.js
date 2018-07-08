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
import { toggleAddAddressModal, addAddress } from '../../../../../../services/blockchain/bitcoin/bitcoinActions';
import './add-bitcoin-address.scss';

const messages = defineMessages({
  label: {
    id: 'AddBitcoinAddress.label',
    defaultMessage: 'Label (optional)'
  },
  add: {
    id: 'AddBitcoinAddress.createWallet',
    defaultMessage: 'ADD'
  },
  cancel: {
    id: 'AddBitcoinAddress.cancel',
    defaultMessage: 'CANCEL'
  },
  pleaseEnter: {
    id: 'AddBitcoinAddress.pleaseEnter',
    defaultMessage: 'Please enter'
  }
});

class AddBitcoinAddress extends Component {
  constructor(props) {
    super(props);
    this.state={
      value: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bitcoin.addAddressModal.isOpen
          && !nextProps.bitcoin.loading
          && this.props.bitcoin.loading
    ) {
      this.toggleModal();
    }
  }

  handleSubmit(values) {
    const {
      guid,
      password
    } = this.props.bitcoin;
    this.props.bitcoinActions.addAddress(guid, password, values.label ? values.label : '');
  }

  handleCancel() {
    this.toggleModal();
  }

  toggleModal = () => {
    this.props.bitcoinActions.toggleAddAddressModal();
    this.setState({
      value: ''
    })
  };
  
  onChange = (e) => {
    this.setState({
      value: e.target.value
    })
  };

  render() {
    const { isOpen } = this.props.bitcoin.addAddressModal;
    const { loading } = this.props.bitcoin;
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    return (
      <Modal size="tiny" open={isOpen} onClose={this.toggleModal} closeIcon>
        <Modal.Content>
          <Form className="add-bitcoin-address" onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              name="label"
              placeholder={formatMessage(messages.pleaseEnter)}
              message={formatMessage(messages.label)}
              component={FormField}
              input={{
                value: this.state.value,
                onChange: this.onChange
              }}
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

AddBitcoinAddress.propTypes = {
  bitcoin: PropTypes.shape({
    addAddressModal: PropTypes.shape({
      isOpen: PropTypes.bool
    }),
    loading: PropTypes.bool,
    guid: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
  bitcoinActions: PropTypes.shape({
    addAddress: PropTypes.func,
    toggleAddAddressModal: PropTypes.func
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
      bitcoinActions: bindActionCreators({ toggleAddAddressModal, addAddress }, dispatch),
    })
  ),
  reduxForm({
    form: 'addBitcoinAddressForm',
    destroyOnUnmount: true,
  })
)(injectIntl(AddBitcoinAddress));
