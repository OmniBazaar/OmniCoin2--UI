import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import './confirmation-modal.scss';

const messages = defineMessages({
  confirmation: {
    id: 'ConfirmationModal.confirmation',
    defaultMessage: 'Confirmation',
  },
  approve: {
    id: 'ConfirmationModal.approve',
    defaultMessage: 'OK'
  },
  cancel: {
    id: 'ConfirmationModal.cancel',
    defaultMessage: 'CANCEL'
  }
});

class ConfirmationModal extends Component {
  render() {
    const {
      isOpen,
      question,
      onCancel,
      onApprove,
      loading
    } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Modal size="tiny" open={isOpen} onClose={onCancel} className="confirmation-modal">
        <Modal.Header>
          {formatMessage(messages.confirmation)}
        </Modal.Header>
        <Modal.Content>
          <p>{question}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            className="button--transparent"
            content={formatMessage(messages.cancel)}
            loading={loading}
            onClick={onCancel}
          />
          <Button
            className="button--primary"
            loading={loading}
            content={formatMessage(messages.approve)}
            onClick={onApprove}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

ConfirmationModal.defaultProps = {
  question: 'Are you sure?',
  isOpen: false,
  loading: false,
  onCancel: () => {},
  onApprove: () => {}
};

ConfirmationModal.propTypes = {
  question: PropTypes.string,
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onApprove: PropTypes.func
};

export default injectIntl(ConfirmationModal);

