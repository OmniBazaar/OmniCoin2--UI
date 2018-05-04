import React from 'react';
import { injectIntl } from 'react-intl';
import './form-field.scss';
import PropTypes from 'prop-types';

const FormField = ({
  input, placeholder, type, message, meta: { touched, error }, intl
}) => {
  const errorMessage = error && error.id ? intl.formatMessage(error) : error;
  return (
    <div className="form-field">
      <div className="message">
        <span>{message}</span>
        {touched && ((error && <span className="error">{errorMessage}</span>))}
      </div>
      <input {...input} placeholder={placeholder} type={type} />
    </div>
  );
};

FormField.defaultProps = {
  placeholder: '',
  type: 'text',
  message: '',
  meta: {},
};

FormField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  message: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  intl: PropTypes.shape({
    formatMessagee: PropTypes.func
  }).isRequired
};

export default injectIntl(FormField);
