// @flow

import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import loader from '../../assets/images/loading.gif';
import checkmark from '../../assets/images/checkmark.png';

import './validatable-field.scss';

const Field = ({
  input,
  placeholder,
  type,
  meta: {
    touched, error, asyncValidating, valid, pristine, active
  },
  intl,
  formAsyncErrors,
  isIconVisible
}) => {
  const errorMessage = error && error.id ? intl.formatMessage(error) : error;
  return (
    <React.Fragment>
      <div>
        {touched && (error && <span className="error">{errorMessage}</span>)}
      </div>
      {isIconVisible && asyncValidating && (
        <img src={loader} alt="loader" className="validatable-field-spinner" />
      )}
      {isIconVisible &&
        !pristine &&
        !active &&
        !asyncValidating &&
        valid &&
        !formAsyncErrors[input.name] && (
          <img src={checkmark} alt="checkmark" className="validatable-field-check" />
        )}
      <input {...input} placeholder={placeholder} type={type} />
    </React.Fragment>
  );
};

export default injectIntl(Field);

const makeValidatableField = Component =>
  injectIntl(props => {
    const {
      input,
      meta: { touched, error },
      intl,
      ...params
    } = props;
    const errorMessage = error && error.id ? intl.formatMessage(error) : error;
    return (
      <div style={{ flex: 1, flexDirection: 'column' }}>
        {Component && <Component {...input} input={input} {...params} />}
        {!Component && <input {...input} {...params} />}

        <div>
          {touched && (error && <span className="error">{errorMessage}</span>)}
        </div>
      </div>
    );
  });

const InputField = makeValidatableField();

Field.propTypes = {
  input: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  formAsyncErrors: PropTypes.object,
  isIconVisible: PropTypes.bool
};

Field.defaultProps = {
  input: {},
  placeholder: {},
  type: {},
  meta: {},
  intl: {},
  formAsyncErrors: {},
  isIconVisible: false
};

export { InputField, makeValidatableField };
