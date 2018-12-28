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
    defaultMessage: 'Update OmniBazaar'
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

const defaultQuestion = 'Are you sure?';

class ConfirmationModal extends Component {
  render() {
    const {
      isOpen,
      question,
      onCancel,
      onApprove,
      cancelText,
      approveText,
      loading
    } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Modal size="tiny" open={isOpen} onClose={onCancel} className="confirmation-modal" closeIcon>
        <Modal.Header>
          {this.props.title || formatMessage(messages.confirmation)}
        </Modal.Header>
        <Modal.Content>
          <p>
            {this.props.children || defaultQuestion}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            className="button--transparent"
            content={cancelText || formatMessage(messages.cancel)}
            loading={loading}
            onClick={onCancel}
          />
          <Button
            className="button--primary"
            loading={loading}
            content={approveText || formatMessage(messages.approve)}
            onClick={onApprove}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

ConfirmationModal.defaultProps = {
  isOpen: false,
  loading: false,
  onCancel: () => {},
  onApprove: () => {},
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onApprove: PropTypes.func,
  approveText: PropTypes.string,
  cancelText: PropTypes.string
};

export default injectIntl(ConfirmationModal);

