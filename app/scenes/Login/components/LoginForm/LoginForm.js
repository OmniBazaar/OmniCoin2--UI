import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, Image, Divider } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import { toastr } from 'react-redux-toastr';
import cn from 'classnames';
import { withRouter } from 'react-router-dom';
import { FetchChain } from 'omnibazaarjs/es';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { login } from '../../../../services/blockchain/auth/authActions';

import './login-form.scss';
import BtnLock from '../../../../assets/images/common/btn-lock-norm+pres.svg';
import ValidatableField from '../../../../components/ValidatableField/ValidatableField';

const messages = defineMessages({
  accountDoesntExist: {
    id: 'LoginForm.accountDoesntExist',
    defaultMessage: 'Account doesn\'t exist'
  },
  enterPassword: {
    id: 'LoginForm.enterPassword',
    defaultMessage: 'Enter password'
  },
  unlock: {
    id: 'LoginForm.unlock',
    defaultMessage: 'Unlock'
  },
  enterUsername: {
    id: 'LoginForm.enterUsername',
    defaultMessage: 'Enter your username'
  },
  fieldRequired: {
    id: 'LoginForm.fieldRequired',
    defaultMessage: 'This field is required'
  },
  noAccount: {
    id: 'LoginForm.noAccount',
    defaultMessage: 'Don\'t have an account yet?'
  },
  signup: {
    id: 'LoginForm.signup',
    defaultMessage: 'Sign up'
  },
  error: {
    id: 'LoginForm.error',
    defaultMessage: 'Error'
  }
});

class LoginForm extends Component {
  static asyncValidate = async (values) => {
    try {
      const account = await FetchChain('getAccount', values.username);
    } catch (e) {
      console.log('ERR', e);
      throw { username: messages.accountDoesntExist };
    }
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  state = {
    showUsernameInput: false,
  };

  componentWillMount() {
    if (!this.props.auth.currentUser) {
      this.setState({
        showUsernameInput: true
      });
    }

    this.props.initialize({ username: this.props.auth.lastLoginUserName });
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;
    if (nextProps.auth.error && !this.props.auth.error) {
      const content = nextProps.auth.error.id ? formatMessage(nextProps.auth.error)
        : nextProps.auth.error;
      toastr.error(formatMessage(messages.error), content);
    }

    if (nextProps.auth.lastLoginUserName !== this.props.auth.lastLoginUserName) {
      this.props.initialize({ username: nextProps.auth.lastLoginUserName });
    }
  }

  signUp() {
    this.props.history.push('/signup');
  }

  submit(values) {
    const { password, username } = values;
    this.props.authActions.login(
      username,
      password,
    );
  }

  renderPasswordField = ({
    input, disabled, loading, meta: { touched, error, warning }
  }) => {
    const { formatMessage } = this.props.intl;
    const btnClass = cn(loading || !!this.props.asyncValidating ? 'ui loading' : '');
    const errorMessage = error && error.id ? formatMessage(error) : error;
    return (
      <div>
        {touched && ((error && <span className="error">{ errorMessage }</span>))}
        <div className="password">
          <input
            {...input}
            type="password"
            placeholder={formatMessage(messages.enterPassword)}
          />
          <Button
            content={formatMessage(messages.unlock)}
            disabled={disabled || this.props.auth.loading || !!this.props.asyncValidating}
            color="green"
            type="submit"
            className={btnClass}
          />
        </div>
      </div>
    );
  };

  render() {
    const {
      handleSubmit,
      valid,
      auth,
      asyncValidating
    } = this.props;
    const { formatMessage } = this.props.intl;
    const { showUsernameInput } = this.state;
    return (
      <Form
        onSubmit={handleSubmit(this.submit)}
        className="login"
      >
        {showUsernameInput ?
          <div className="username">
            <Field
              type="text"
              name="username"
              placeholder={formatMessage(messages.enterUsername)}
              component={ValidatableField}
              validate={[required({ message: formatMessage(messages.fieldRequired) })]}
            />
          </div>
          :
          [
            <Image src={BtnLock} width={50} height={50} />,
            <span>{auth.currentUser.username}</span>
          ]
        }
        <Field
          name="password"
          disabled={!valid}
          loading={auth.loading}
          component={this.renderPasswordField}
          validate={[required({ message: formatMessage(messages.fieldRequired) })]}
        />
        <Divider fitted />
        <div className="question">
          <h3>{ formatMessage(messages.noAccount) }</h3>
        </div>
        <Button
          content={formatMessage(messages.signup)}
          disabled={auth.loading}
          color="blue"
          onClick={this.signUp}
        />
      </Form>
    );
  }
}


LoginForm = withRouter(LoginForm);

LoginForm = reduxForm({
  form: 'loginForm',
  asyncValidate: LoginForm.asyncValidate,
  asyncBlurFields: ['username'],
  destroyOnUnmount: true,
})(LoginForm);

LoginForm = injectIntl(LoginForm);

export default connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    authActions: bindActionCreators({ login }, dispatch),
  })
)(LoginForm);


LoginForm.propTypes = {
  initialize: PropTypes.func,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      password: PropTypes.string
    }),
    lastLoginUserName: PropTypes.string,
    error: PropTypes.shape({
      id: PropTypes.string
    }),
    loading: PropTypes.bool
  }),
  authActions: PropTypes.shape({
    login: PropTypes.func
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  asyncValidating: PropTypes.bool
};

LoginForm.defaultProps = {
  initialize: null,
  auth: null,
  authActions: null,
  intl: {},
  history: {},
  asyncValidating: false
};
