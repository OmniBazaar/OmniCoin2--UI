import React, { Component } from 'react';
import {
  Modal,
  Tab
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { toggleModal } from '../../../../../../services/blockchain/bitcoin/bitcoinActions';
import NewWallet from './components/NewWallet/NewWallet';
import ExistingWallet from './components/ExistingWallet/ExistingWallet';

const messages = defineMessages({
  existingWallet: {
    id: 'AddBitcoinWallet.existingWallet',
    defaultMessage: 'Existing Wallet'
  },
  newWallet: {
    id: 'AddBitcoinWallet.newWallet',
    defaultMessage: 'New Wallet'
  }
});

class AddBitcoinWallet extends Component {
  toggleModal = () => {
    this.props.addBitcoinWalletActions.toggleModal();
  };

  render() {
    const { isOpen } = this.props.bitcoin.modal;
    const { formatMessage } = this.props.intl;
    return (
      <Modal size="small" open={isOpen} onClose={this.toggleModal}>
        <Modal.Content>
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
                  {
                    menuItem: formatMessage(messages.newWallet),
                    render: () => <Tab.Pane><NewWallet /></Tab.Pane>,
                  },
                  {
                    menuItem: formatMessage(messages.existingWallet),
                    render: () => <Tab.Pane><ExistingWallet /></Tab.Pane>,
                  },
                ]}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

AddBitcoinWallet.propTypes = {
  addBitcoinWalletActions: PropTypes.shape({
    toggleModal: PropTypes.func
  }).isRequired,
  bitcoin: PropTypes.shape({
    modal: PropTypes.shape({
      isOpen: PropTypes.bool
    })
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    addBitcoinWalletActions: bindActionCreators({ toggleModal }, dispatch),
  }),
)(injectIntl(AddBitcoinWallet));

