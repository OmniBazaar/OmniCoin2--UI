import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Select } from 'semantic-ui-react';

import { reputationOptions } from '../../../../../../../../services/utils';
import './form-field.scss';

export const options = reputationOptions();
export const defaultOption = 5;

const FormField = ({
  input,
  message,
  intl,
  meta: {
    touched,
    error
  },
}) => {
  const errorMessage = error && error.id ? intl.formatMessage(error) : error;
  return (
    <div className="rate-modal-form-field">
      <div className="message">
        <span>{message}</span>
        {touched && ((error && <span className="error">{errorMessage}</span>))}
      </div>
      <Select
        defaultValue={defaultOption}
        options={options}
        onChange={(param, data) => input.onChange(data.value)}
      />
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
