import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, Divider, Icon } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import { toastr } from 'react-redux-toastr';
import cn from 'classnames';
import { withRouter } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import { defineMessages, injectIntl } from 'react-intl';
import { key, FetchChain } from 'omnibazaarjs/es';
import PropTypes from 'prop-types';

import { signup } from '../../../../services/blockchain/auth/authActions';

import ValidatableField from '../../../../components/ValidatableField/ValidatableField';
import './signup-form.scss';

const messages = defineMessages({
  usernameExists: {
    id: 'SignupForm.usernameExists',
    defaultMessage: 'Username already taken'
  },
  noAccount: {
    id: 'SignupForm.noAccount',
    defaultMessage: 'Account doesn\'t exist'
  },
  fieldRequired: {
    id: 'SignupForm.fieldRequired',
    defaultMessage: 'This field is required'
  },
  passwordDoesntMatch: {
    id: 'SignupForm.passwordDoesntMatch',
    defaultMessage: 'Password doesn\'t match'
  },
  copy: {
    id: 'SignupForm.copy',
    defaultMessage: 'Copy'
  },
  passwordCopied: {
    id: 'SignupForm.passwordCopied',
    defaultMessage: 'Password copied!'
  },
  referrerName: {
    id: 'SignupForm.referrerName',
    defaultMessage: 'Referrer name'
  },
  accountName: {
    id: 'SignupForm.accountName',
    defaultMessage: 'Account name'
  },
  confirmPassword: {
    id: 'SignupForm.confirmPassword',
    defaultMessage: 'Confirm password'
  },
  agree: {
    id: 'SignupForm.agree',
    defaultMessage: 'I agree with'
  },
  termsAndCond: {
    id: 'SignupForm.termsAndCond',
    defaultMessage: 'Terms & Conditions'
  },
  signup: {
    id: 'SignupForm.signup',
    defaultMessage: 'Sign up'
  },
  signin: {
    id: 'SignupForm.signin',
    defaultMessage: 'Sign in'
  },
  haveAccount: {
    id: 'SignupForm.haveAccount',
    defaultMessage: 'Already have an account?'
  },
  error: {
    id: 'SignupForm.error',
    defaultMessage: 'Error'
  }
});

class SignupForm extends Component {
  static asyncValidate = async (values, dispatch, props, field) => {
    const previousErrors = props.asyncErrors;
    if (field === 'username') {
      try {
        const account = await FetchChain('getAccount', values.username);
      } catch (e) {
        throw previousErrors;
      }
      throw Object.assign({}, previousErrors, { username: messages.usernameExists });
    }
    if (field === 'referrer') {
      if (!values.referrer) return;
      try {
        const account = await FetchChain('getAccount', values.referrer);
      } catch (e) {
        throw Object.assign({}, previousErrors, { referrer: messages.noAccount });
      }
    }
    if (previousErrors) {
      throw previousErrors;
    }
  };

  static validate = (values) => {
    const errors = {};
    if (!values.agreementTerms) {
      errors.agreementTerms = messages.fieldRequired;
    }
    if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordDoesntMatch;
    }
    return errors;
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentWillMount() {
    this.props.initialize({
      password: (`P${key.get_random_key().toWif()}`).substr(0, 45)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (nextProps.auth.error && !this.props.auth.error) {
      const content = (
        nextProps.auth.error.id
          ? formatMessage(nextProps.auth.error)
          : nextProps.auth.error
      );
      toastr.error(formatMessage(messages.error), content);
    }
  }

  signIn() {
    this.props.history.push('/login');
  }

  submit(values) {
    const { username, password, referrer } = values;
    this.props.authActions.signup(
      username,
      password,
      referrer,
      null,
      null,
    );
  }

  renderPasswordGeneratorField = ({
    input, meta: {
      asyncValidating, touched, error, warning
    }
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className="hybrid-input">
        <input
          {...input}
          type="text"
          className="field"
        />
        <CopyToClipboard text={input.value}>
          <Button onClick={() =>
            toastr.success(formatMessage(messages.copy), formatMessage(messages.passwordCopied))
          }
          >
            {formatMessage(messages.copy)}
          </Button>
        </CopyToClipboard>
      </div>
    );
  };

  renderReferrerField = ({
    input, meta: {
      asyncValidating, touched, error, warning, active
    }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    const show = !error && touched && !asyncValidating && !active && !!input.value;
    const iconClassName = cn('button icon', show ? '' : 'hidden');
    const inputClassName = cn(show ? 'field' : '');
    return (
      [
        <div>
          {touched && (error && <span className="error">{errorMessage}</span>)}
        </div>,
        <div className="hybrid-input">
          <input
            {...input}
            type="text"
            placeholder={formatMessage(messages.referrerName)}
            className={inputClassName}
          />
          <Icon
            name="checkmark"
            color="green"
            className={iconClassName}
          />
        </div>
      ]
    );
  };
  render() {
    const {
      handleSubmit, valid, auth, asyncValidating
    } = this.props;
    const btnClass = cn(auth.loading || !!this.props.asyncValidating ? 'ui loading' : '');
    const { formatMessage } = this.props.intl;
    return (
      <Form
        onSubmit={handleSubmit(this.submit)}
        className="signup"
      >
        <Field
          type="text"
          name="username"
          placeholder={formatMessage(messages.accountName)}
          component={ValidatableField}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
        />
        <Field
          type="text"
          name="password"
          component={this.renderPasswordGeneratorField}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
        />
        <Field
          type="password"
          placeholder={formatMessage(messages.confirmPassword)}
          name="passwordConfirmation"
          component={ValidatableField}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
        />
        <Field
          type="text"
          name="referrer"
          component={this.renderReferrerField}
        />
        <div className="agreement-terms">
          <Field
            type="checkbox"
            name="agreementTerms"
            component="input"
          />
          <span>{ formatMessage(messages.agree) } </span>
          <a href="#">{ formatMessage(messages.termsAndCond) }</a>
        </div>
        <Button
          content={formatMessage(messages.signup)}
          disabled={!valid || auth.loading || !!asyncValidating}
          color="green"
          className={btnClass}
          type="submit"
        />
        <Divider fitted />
        <div className="question">
          <h3>{ formatMessage(messages.haveAccount) }</h3>
        </div>
        <Button
          content={formatMessage(messages.signin)}
          disabled={auth.loading}
          color="blue"
          className={btnClass}
          onClick={this.signIn}
        />
      </Form>
    );
  }
}

SignupForm.defaultProps = {
  auth: null,
  authActions: null,
  initialize: null,
  intl: {},
  history: {},
  handleSubmit: null,
  valid: false,
  asyncValidating: false
};

SignupForm.propTypes = {
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    error: PropTypes.shape({
      id: PropTypes.string
    }),
    loading: PropTypes.bool
  }),
  authActions: PropTypes.shape({
    signup: PropTypes.func
  }),
  initialize: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  handleSubmit: PropTypes.func,
  valid: PropTypes.bool,
  asyncValidating: PropTypes.bool
};

SignupForm = withRouter(SignupForm);

SignupForm = reduxForm({
  form: 'signupForm',
  validate: SignupForm.validate,
  asyncValidate: SignupForm.asyncValidate,
  asyncBlurFields: ['username', 'referrer'],
  destroyOnUnmount: true,
})(SignupForm);

SignupForm = injectIntl(SignupForm);

export default connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    authActions: bindActionCreators({ signup }, dispatch),
  })
)(SignupForm);

