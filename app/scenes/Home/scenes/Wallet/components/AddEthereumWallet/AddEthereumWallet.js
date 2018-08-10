import React, { Component } from 'react';
import {
  Modal,
  Tab
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { toggleEthereumModal } from '../../../../../../services/blockchain/ethereum/EthereumActions';
import NewEthereumWallet from './components/NewEthereumWallet/NewEthereumWallet';
import ExistingEthereumWallet from './components/ExistingEthereumWallet/ExistingEthereumWallet';

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
  toggleEthereumModal = () => {
    this.props.addEthereumWalletActions.toggleEthereumModal();
  };

  render() {
    const { isOpen } = this.props.ethereum.modalEthereum;
    const { formatMessage } = this.props.intl;
    return (
      <Modal size="small" open={isOpen} onClose={this.toggleEthereumModal} closeIcon>
        <Modal.Content>
          <Tab
            className="tabs"
            menu={{ secondary: true, pointing: true }}
            panes={[
                  {
                    menuItem: formatMessage(messages.newWallet),
                    render: () => <Tab.Pane><NewEthereumWallet /></Tab.Pane>,
                  },
                  {
                    menuItem: formatMessage(messages.existingWallet),
                    render: () => <Tab.Pane><ExistingEthereumWallet /></Tab.Pane>,
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
    toggleEthereumModal: PropTypes.func
  }).isRequired,
  ethereum: PropTypes.shape({
    modalEthereum: PropTypes.shape({
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
    addEthereumWalletActions: bindActionCreators({ toggleEthereumModal }, dispatch),
  }),
)(injectIntl(AddEthereumWallet));

