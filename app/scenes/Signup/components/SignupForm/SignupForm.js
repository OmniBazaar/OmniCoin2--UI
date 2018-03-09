import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Form, Divider, Icon } from 'semantic-ui-react';
import { required } from 'redux-form-validators';
import { toastr } from 'react-redux-toastr';
import cn from 'classnames';
import { key } from "omnibazaarjs/es";
import { withRouter } from 'react-router-dom';
import ClipboardButton from "react-clipboard.js";
import { FetchChain } from "omnibazaarjs/es";


import { signup } from  '../../../../services/blockchain/auth/authActions';

import ValidatableField from '../../../../components/ValidatableField/ValidatableField';
import './signup-form.scss';

class SignupForm extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentWillMount() {
   this.props.initialize({
      password: ("P" + key.get_random_key().toWif()).substr(0, 45)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.error && !this.props.auth.error) {
      toastr.error("Error", nextProps.auth.error);
    }
  }

  static asyncValidate =  async (values, dispatch, props, field) => {
    const previousErrors = props.asyncErrors;
    if (field === "username") {
      try {
        let account = await FetchChain("getAccount", values.username);
      } catch (e) {
        throw previousErrors;
      }
      throw Object.assign({}, previousErrors, {username: "Username already taken"});
    }
    if (field === "referrer") {
      if (!values.referrer) return;
      try {
        let account = await FetchChain("getAccount", values.referrer);
      } catch (e) {
        throw Object.assign({}, previousErrors, {referrer: "Account doesn't exist"});
      }
    }
    if (previousErrors) {
      throw previousErrors;
    }
  };

  static validate = (values) => {
    const errors = {};
    if (!values.agreementTerms) {
      errors.agreementTerms = "This field is required";
    }
    if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation = "Password doesn't match";
    }
    return errors;
  };

  signIn() {
    this.props.history.push('/login');
  }

  submit(values) {
      const {username, password, referrer} = values;
      this.props.authActions.signup(
        username,
        password,
        referrer,
        null,
        null,
      );
  }

  renderPasswordGeneratorField = ({input,  meta: {asyncValidating, touched, error, warning}}) => {
    return (
      <div className="hybrid-input">
        <input
          {...input}
          type="text"
          className="field"
        />
        <ClipboardButton
          className="button"
          data-clipboard-text={input.value}
          data-place="right"
          onClick={() => toastr.success("Copy", "Password copied!")}
        >
          Copy
        </ClipboardButton>
      </div>
    );
  };

  renderReferrerField = ({input,  meta: {asyncValidating, touched, error, warning, active}}) => {
    let show = !error && touched && !asyncValidating && !active;
    let iconClassName = cn("button icon", show ? "" : "hidden");
    let inputClassName = cn(show ? "field" : "");
    return (
      [
        <div>
          {touched && ((error && <span className="error">{error}</span>) || (warning && <span className="warning">{warning}</span>))}
        </div>,
        <div className="hybrid-input">
          <input
            {...input}
            type="text"
            className={inputClassName}
          />
          <Icon
            name="checkmark"
            color="green"
            className={iconClassName}/>
        </div>
      ]
    );
  };
  render() {
    const {handleSubmit, valid, auth, asyncValidating} = this.props;
    let btnClass = cn(auth.loading || !!this.props.asyncValidating ? "ui loading" : "");
    return (
      <Form
        onSubmit={handleSubmit(this.submit)}
        className="signup"
      >
        <Field
          type="text"
          name="username"
          placeholder="Account name"
          component={ValidatableField}
          validate={[required({message: "This field is required"})]}
        />
        <Field
          type="text"
          name="password"
          component={this.renderPasswordGeneratorField}
          validate={[required({message: "This field is required"})]}
        />
        <Field
          type="password"
          placeholder="Confirm password"
          name="passwordConfirmation"
          component={ValidatableField}
          validate={[required({message: "This field is required"})]}
        />
        <Field
          type="text"
          placeholder="Referrer name"
          name="referrer"
          component={this.renderReferrerField}
        />
        <div className="agreement-terms">
          <Field
            type="checkbox"
            name="agreementTerms"
            component="input"
          />
          <span>I agree with </span>
          <a href="#">Terms & Conditions</a>
        </div>
        <Button
          content="Sign up"
          disabled={!valid || auth.loading || !!asyncValidating}
          color="green"
          className={btnClass}
          type="submit"
        />
        <Divider fitted/>
        <div className="question">
          <h3>Already have an account?</h3>
        </div>
        <Button
          content="Sign in"
          disabled={auth.loading}
          color="blue"
          className={btnClass}
          onClick={this.signIn}
        />
      </Form>
    );
  }
}

SignupForm = withRouter(SignupForm);

SignupForm = reduxForm({
  form: 'signupForm',
  validate: SignupForm.validate,
  asyncValidate: SignupForm.asyncValidate,
  asyncBlurFields: ['username', 'referrer'],
  destroyOnUnmount: true,
})(SignupForm);

export default connect(
  (state) => {
    return {...state.default}
  },
  (dispatch) => ({
    authActions: bindActionCreators({signup}, dispatch),
  })
)(SignupForm);
