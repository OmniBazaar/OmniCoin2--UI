import React, { Component } from 'react';
import {
  Modal,
  Tab
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { toggleModal } from '../../../../../../services/blockchain/ethereum/EthereumActions';
import NewWallet from './components/NewWallet/NewWallet';
import ExistingWallet from './components/ExistingWallet/ExistingWallet';

const messages = defineMessages({
  existingWallet: {
    id: 'AddEthereumWallet.existingWallet',
    defaultMessage: 'Existing Wallet'
  },
  newWallet: {
    id: 'AddEthereumWallet.newWallet',
    defaultMessage: 'New Wallet'
  }
});

class AddEthereumWallet extends Component {
  toggleModal = () => {
    this.props.addEthereumWalletActions.toggleModal();
  };

  render() {
    const { isOpen } = this.props.ethereum.modal;
    const { formatMessage } = this.props.intl;
    return (
      <Modal size="small" open={isOpen} onClose={this.toggleModal} closeIcon>
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

AddEthereumWallet.propTypes = {
  addEthereumWalletActions: PropTypes.shape({
    toggleModal: PropTypes.func
  }).isRequired,
  ethereum: PropTypes.shape({
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
    addEthereumWalletActions: bindActionCreators({ toggleModal }, dispatch),
  }),
)(injectIntl(AddEthereumWallet));

