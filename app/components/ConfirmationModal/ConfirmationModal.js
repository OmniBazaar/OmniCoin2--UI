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
      onCancel,
      onApprove,
      cancelText,
      approveText,
      loading,
      title
    } = this.props;
    const { formatMessage } = this.props.intl;
    const customApproveText = approveText && approveText.id ? formatMessage(approveText) : approveText;
    const customTitle = title && title.id ? formatMessage(title) : title;
    return (
      <Modal size="tiny" open={isOpen} onClose={onCancel} className="confirmation-modal" closeIcon>
        <Modal.Header>
          {customTitle || formatMessage(messages.confirmation)}
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
            content={customApproveText || formatMessage(messages.approve)}
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
  approveText: '',
  cancelText: '',
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onApprove: PropTypes.func,
  approveText: PropTypes.string || PropTypes.object,
  cancelText: PropTypes.string
};

export default injectIntl(ConfirmationModal);

