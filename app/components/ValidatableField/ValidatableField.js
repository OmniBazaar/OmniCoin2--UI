import React from 'react';
import { injectIntl } from 'react-intl';

const Field = ({
  input, placeholder, type, meta: {
    touched, error
  }, intl
}) => {
  const errorMessage = error && error.id ? intl.formatMessage(error) : error;
  return [
    <div>
      {touched && ((error && <span className="error">{errorMessage}</span>))}
    </div>,
    <input {...input} placeholder={placeholder} type={type} />
  ];
};

export default injectIntl(Field);
