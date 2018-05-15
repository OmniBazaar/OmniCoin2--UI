import React, { Component } from 'react';
import {
  Button
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './modal-footer.scss';

class ModalFooter extends Component {
  render() {
    const {
      cancelContent,
      handleCancel,
      successContent,
      handleSuccess,
      disabled,
      loading
    } = this.props;
    return (
      <div className="modal-footer">
        <Button
          className="button--transparent"
          content={cancelContent}
          loading={loading}
          onClick={handleCancel}
        />
        <Button
          className="button--primary"
          disabled={disabled}
          loading={loading}
          content={successContent}
          onClick={handleSuccess}
          type="submit"
        />
      </div>
    );
  }
}

ModalFooter.defaultProps = {
  successContent: 'OK',
  handleSuccess: () => {},
  cancelContent: 'Cancel',
  handleCancel: () => {},
  loading: false,
  disabled: false
};

ModalFooter.propTypes = {
  successContent: PropTypes.string,
  handleSuccess: PropTypes.func,
  cancelContent: PropTypes.string,
  handleCancel: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
};

export default ModalFooter;
