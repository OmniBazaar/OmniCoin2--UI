import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import {
  Modal,
  Select
} from 'semantic-ui-react';
import { Field, Form, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import ModalFooter from '../../../../../../../../components/ModalFooter/ModalFooter';
import FormField, { defaultOption, options } from '../FormField/FormField';
import './rate-modal.scss';

const messages = defineMessages({
  ok: {
    id: 'RateModal.ok',
    defaultMessage: 'OK'
  },
  cancel: {
    id: 'RateModal.cancel',
    defaultMessage: 'Cancel',
  }
});

class RateModal extends Component {
  handleSubmit = (values) => {
    const {
      name1,
      name2,
      onSubmit
    } = this.props;
    if (!values[name1]) {
      values[name1] = options[defaultOption].value;
    }
    if (!values[name2]) {
      values[name2] = options[defaultOption].value;
    }
    onSubmit(values);
  };

  render() {
    const {
      name1,
      name2,
      label1,
      label2,
      isOpen,
      onCancel,
      loading
    } = this.props;
    const { handleSubmit } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Modal size="tiny" open={isOpen}>
        <Modal.Content>
          <Form onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              name={name1}
              message={label1}
              component={FormField}
            />
            <Field
              name={name2}
              message={label2}
              component={FormField}
            />
            <ModalFooter
              successContent={formatMessage(messages.ok)}
              cancelContent={formatMessage(messages.cancel)}
              handleCancel={onCancel}
              loading={loading}
            />
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

RateModal.defaultProps = {
  onSubmit: () => {},
  isOpen: false,
  onCancel: () => {},
  loading: false
};

RateModal.propTypes = {
  onSubmit: PropTypes.func,
  name1: PropTypes.string.isRequired,
  name2: PropTypes.string.isRequired,
  label1: PropTypes.string.isRequired,
  label2: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
};

export default reduxForm({
  form: 'RateModalForm',
  destroyOnUnmount: true
})(injectIntl(RateModal));
