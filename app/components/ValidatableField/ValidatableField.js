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

const makeValidatableField = (Component) => {
  return injectIntl(
    (props) => {
      const {
        input,
        meta: {
          touched, error
        },
        intl,
        ...params
      } = props;
      const errorMessage = error && error.id ? intl.formatMessage(error) : error;
      return (
        <div style={{flex: 1, flexDirection: 'column'}}>
          {
            Component 
            && <Component {...input} input={input} {...params} />
          }
          {
            !Component
            && <input {...input} {...params} /> 
          }
          <div>
            {touched && ((error && <span className="error">{errorMessage}</span>))}
          </div>
        </div>
      );
    }
  );
}

const InputField = makeValidatableField();

export {
  InputField,
  makeValidatableField
}