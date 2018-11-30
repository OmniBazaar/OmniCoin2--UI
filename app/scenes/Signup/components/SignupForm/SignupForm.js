import React, { Component } from "react";
import { Field, reduxForm, getFormValues, change } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Form, Divider, Icon, Modal } from "semantic-ui-react";
import { required } from "redux-form-validators";
import { toastr } from "react-redux-toastr";
import cn from "classnames";
import { withRouter } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import { defineMessages, injectIntl } from "react-intl";
import { key } from "omnibazaarjs/es";
import { Apis } from "omnibazaarjs-ws";
import PropTypes from "prop-types";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import Radio from "../../../../components/Radio/Radio";
import Checkbox from "../../../../components/Checkbox/Checkbox";
import TagsInput from "../../../../components/TagsInput";
import PriorityTypes from "../../../../common/SearchPriorityType";
import TermsAndConditions from "../TermsAndConditions/TermsAndConditions";

import {
  signup,
  showTermsModal
} from "../../../../services/blockchain/auth/authActions";

import ValidatableField from "../../../../components/ValidatableField/ValidatableField";
import "./signup-form.scss";

const inputCustomSize = 15;

const messages = defineMessages({
  usernameExists: {
    id: "SignupForm.usernameExists",
    defaultMessage: "That username is already taken."
  },
  noAccount: {
    id: "SignupForm.noAccount",
    defaultMessage: "Account doesn't exist"
  },
  fieldRequired: {
    id: "SignupForm.fieldRequired",
    defaultMessage: "This field is required."
  },
  passwordDoesntMatch: {
    id: "SignupForm.passwordDoesntMatch",
    defaultMessage: "Passwords don't match."
  },
  copy: {
    id: "SignupForm.copy",
    defaultMessage: "Copy password"
  },
  passwordCopied: {
    id: "SignupForm.passwordCopied",
    defaultMessage: "Password copied!"
  },
  referrerName: {
    id: "SignupForm.referrerName",
    defaultMessage: "Who referred you?"
  },
  accountName: {
    id: "SignupForm.accountName",
    defaultMessage: "Choose an account name"
  },
  confirmPassword: {
    id: "SignupForm.confirmPassword",
    defaultMessage: "Confirm password"
  },
  agree: {
    id: "SignupForm.agree",
    defaultMessage: "I agree with the OmniBazaar"
  },
  termsAndCond: {
    id: "SignupForm.termsAndCond",
    defaultMessage: "Terms & Conditions"
  },
  signup: {
    id: "SignupForm.signup",
    defaultMessage: "Sign up"
  },
  signin: {
    id: "SignupForm.signin",
    defaultMessage: "Sign in"
  },
  haveAccount: {
    id: "SignupForm.haveAccount",
    defaultMessage: "Already have an account?"
  },
  error: {
    id: "SignupForm.error",
    defaultMessage: "Error"
  },
  searchPriority: {
    id: "SignupForm.searchPriority",
    defaultMessage: "Marketplace Search priority"
  },
  specificLocation: {
    id: "SignupForm.specificLocation",
    defaultMessage: "Specific Location"
  },
  anywhere: {
    id: "SignupForm.anywhere",
    defaultMessage: "Anywhere"
  },
  country: {
    id: "SignupForm.country",
    defaultMessage: "Your Country"
  },
  state: {
    id: "SignupForm.state",
    defaultMessage: "Your State"
  },
  city: {
    id: "SignupForm.city",
    defaultMessage: "Your City"
  },
  keywords: {
    id: "SignupForm.keywords",
    defaultMessage: "Provide keywords for listing you want to see"
  },
  addKeyword: {
    id: "SignupForm.addKeyword",
    defaultMessage: "Add keyword"
  },
  done: {
    id: "SignupForm.done",
    defaultMessage: "Done"
  },
  savePassword1: {
    id: "SignupForm.savePassword1",
    defaultMessage:
      "IMPORTANT: This username/password combination is the ONLY key to your OmniCoin wallet. Do not give it to anyone."
  },
  savePassword2: {
    id: "SignupForm.savePassword2",
    defaultMessage:
      "COPY and PASTE both parts to a safe place. If lost, your password CANNOT BE RECOVERED."
  }
});

class SignupForm extends Component {
  static validate = values => {
    const errors = {};
    if (!values.username) {
      errors.username = messages.fieldRequired;
    }
    if (!values.agreementTerms) {
      errors.agreementTerms = messages.fieldRequired;
    }
    if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation = messages.passwordDoesntMatch;
    }
    if (!values.country) {
      errors.country = messages.fieldRequired;
    }
    if (!values.state) {
      errors.state = messages.fieldRequired;
    }
    return errors;
  };

  static asyncValidate = async values => {
    const { referrer } = values;

    if (referrer) {
      const referrerAccount = await Apis.instance()
        .db_api()
        .exec("get_account_by_name", [referrer]);
      if (referrerAccount == null || !referrerAccount.is_referrer) {
        throw { referrer: "Referrer account not found" };
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      keywordsTouched: false,
      showPassword: false
    };
    this.defaultReferrer = localStorage.getItem("referrer");
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
    this.submit = this.submit.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentWillMount() {
    this.props.initialize({
      password: `P${key.get_random_key().toWif()}`.substr(0, 45),
      // searchPriority: PriorityTypes.LOCAL_DATA,
      referrer: this.props.auth.defaultReferrer
    });
  }

  componentDidMount() {
    if (this.props.auth.defaultReferrer) {
      this.props.formActions.change(
        "referrer",
        this.props.auth.defaultReferrer
      );
      this.referrerInput.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.props.intl;

    if (nextProps.auth.defaultReferrer !== this.props.auth.defaultReferrer) {
      this.props.formActions.change("referrer", nextProps.auth.defaultReferrer);
    }

    if (nextProps.auth.error && !this.props.auth.error) {
      const content = nextProps.auth.error.id
        ? formatMessage(nextProps.auth.error)
        : nextProps.auth.error;
      toastr.error(formatMessage(messages.error), content);
    }
  }

  onChangeCountry(country) {
    this.props.formActions.change("country", country);
    if (!country) {
      this.props.formActions.change("state", "");
    }
  }

  onChangeState(state) {
    this.props.formActions.change("state", state);
  }

  onChangeCity(city) {
    this.props.formActions.change("city", city);
  }

  onChangeKeywords(keywords) {
    this.props.formActions.change("keywords", keywords);
  }

  onChangeKeywordsInput(value) {
    if (!this.state.keywordsTouched) this.setState({ keywordsTouched: true });
    this.props.formActions.change("keywordsStr", value);
  }

  onTermAndConditionCheck(isChecked) {
    this.props.formActions.change("agreementTerms", isChecked);
  }

  onChangeSearchPriority(priority) {
    this.props.formActions.change("searchPriority", priority);
  }

  signIn() {
    this.props.history.push("/login");
  }

  togglePasswordVisibility() {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  }

  submit(values) {
    const {
      username,
      password,
      referrer
      // searchPriority, country, state, city, keywords
    } = values;

    this.props.authActions.signup(
      username,
      password,
      referrer,
      // {
      //   priority: searchPriority,
      //   country,
      //   state,
      //   city,
      //   keywords
      // },
      null,
      null
    );
  }

  showSuccessCopy(e) {
    const { formatMessage } = this.props.intl;
    toastr.success(
      formatMessage(messages.copy),
      formatMessage(messages.passwordCopied)
    );
    e.preventDefault();
  }

  renderPasswordGeneratorField = ({
    input,
    meta: { asyncValidating, touched, error, warning }
  }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div className="hybrid-input">
        <input {...input} type="text" className="field" />
        <CopyToClipboard text={input.value}>
          <Button onClick={this.showSuccessCopy.bind(this)}>
            {formatMessage(messages.copy)}
          </Button>
        </CopyToClipboard>
      </div>
    );
  };

  renderReferrerField = ({
    input,
    meta: { asyncValidating, touched, error, active }
  }) => {
    const { formatMessage } = this.props.intl;
    const errorMessage = error && error.id ? formatMessage(error) : error;
    const show =
      !error && touched && !asyncValidating && !active && !!input.value;
    const iconClassName = cn("button icon", show ? "" : "hidden");
    const inputClassName = cn(show ? "field" : "");
    return [
      <div>
        {touched && (error && <span className="error">{errorMessage}</span>)}
      </div>,
      <div className="hybrid-input">
        <input
          {...input}
          type="text"
          placeholder={formatMessage(messages.referrerName)}
          ref={input => {
            this.referrerInput = input;
          }}
          className={inputClassName}
        />
        <Icon name="checkmark" color="green" className={iconClassName} />
      </div>
    ];
  };

  renderCountryField = ({ input, meta: { touched, error, placeholder } }) => {
    const { formatMessage } = this.props.intl;
    const { country } = this.props.formValues;
    const errorMessage = error && error.id ? formatMessage(error) : error;

    return [
      <div>
        {touched && (error && <span className="error">{errorMessage}</span>)}
      </div>,
      <CountryDropdown
        {...input}
        value={country}
        defaultOptionLabel={formatMessage(messages.country)}
        placeholder={placeholder}
        classes="ui dropdown textfield"
        onChange={this.onChangeCountry.bind(this)}
      />
    ];
  };

  renderStateField = ({ input, meta: { touched, error } }) => {
    const { formatMessage } = this.props.intl;
    const { country, state } = this.props.formValues;
    const errorMessage = error && error.id ? formatMessage(error) : error;

    return [
      <div>
        {touched && (error && <span className="error">{errorMessage}</span>)}
      </div>,
      <RegionDropdown
        {...input}
        country={country}
        value={state}
        defaultOptionLabel={formatMessage(messages.state)}
        blankOptionLabel={formatMessage(messages.state)}
        classes="ui dropdown textfield"
        onChange={this.onChangeState.bind(this)}
      />
    ];
  };

  renderTerms() {
    const { props } = this;
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(messages.termsAndCond);

    if (props.auth.showTermsModal) {
      return (
        <Modal
          size="normal"
          open={props.auth.showTermsModal}
          className="terms-modal"
          closeIcon
          onClose={this.toggleTermsModal}
        >
          <Modal.Header>{categoryTitle}</Modal.Header>
          <Modal.Content scrolling>
            <div className="modal-container terms-container">
              <div className="body">
                <TermsAndConditions />
              </div>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              className="button--primary"
              content={formatMessage(messages.done)}
              onClick={this.toggleTermsModal}
            />
          </Modal.Actions>
        </Modal>
      );
    }
  }

  toggleTermsModal = () => this.props.authActions.showTermsModal();

  renderTermField = () => {
    const { formatMessage } = this.props.intl;
    return [
      <div className="agreement-terms">
        <Checkbox
          width={inputCustomSize}
          height={inputCustomSize}
          onChecked={this.onTermAndConditionCheck.bind(this)}
        />
        <span>{formatMessage(messages.agree)}</span>
        <span className="link" onClick={this.toggleTermsModal}>
          {formatMessage(messages.termsAndCond)}
        </span>
      </div>
    ];
  };

  renderSearchPriority() {
    const { formatMessage } = this.props.intl;
    const { searchPriority } = this.props.formValues;

    return (
      <div>
        <div className="search-priority">
          <div>{formatMessage(messages.searchPriority)}</div>
          <div className="radios-container">
            <div className="radio-wrapper">
              <Radio
                width={20}
                height={20}
                value={PriorityTypes.LOCAL_DATA}
                checked={searchPriority === PriorityTypes.LOCAL_DATA}
                onChecked={this.onChangeSearchPriority.bind(this)}
              />
              <span className="checkbox-inline">
                {formatMessage(messages.specificLocation)}
              </span>
            </div>

            <div className="radio-wrapper">
              <Radio
                width={20}
                height={20}
                value={PriorityTypes.BY_CATEGORY}
                checked={searchPriority === PriorityTypes.BY_CATEGORY}
                onChecked={this.onChangeSearchPriority.bind(this)}
              />
              <span className="checkbox-inline">
                {formatMessage(messages.anywhere)}
              </span>
            </div>
          </div>

          {this.renderSearchPriorityFormFields()}
        </div>
      </div>
    );
  }

  renderSearchPriorityFormFields() {
    let { searchPriority } = this.props.formValues;
    const { formatMessage } = this.props.intl;

    if (!searchPriority) {
      searchPriority = PriorityTypes.LOCAL_DATA;
      this.props.formActions.change("searchPriority", searchPriority);
    }

    switch (searchPriority) {
      case PriorityTypes.LOCAL_DATA:
        const { country, state } = this.props.formValues;
        return (
          <div className="location-container">
            <Field
              name="country"
              country={country}
              placeholder={formatMessage(messages.country)}
              component={this.renderCountryField}
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
            />
            <Field
              name="state"
              country={country}
              state={state}
              component={this.renderStateField}
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
            />
            <Field
              type="text"
              name="city"
              placeholder={formatMessage(messages.city)}
              component={ValidatableField}
            />
          </div>
        );
      case PriorityTypes.BY_CATEGORY:
        let { keywords, keywordsStr } = this.props.formValues;
        const touched = this.state.keywordsTouched;
        if (!keywords) keywords = [];
        if (!keywordsStr) keywordsStr = "";
        const error = keywords.length === 0 && keywordsStr === "";

        return (
          <div>
            <div>
              {touched &&
                (error && (
                  <span className="error">
                    {formatMessage(messages.fieldRequired)}
                  </span>
                ))}
            </div>
            <TagsInput
              name="keywords"
              preventSubmit={false}
              value={keywords}
              inputValue={keywordsStr}
              addOnBlur
              inputProps={{
                className: cn("react-tagsinput-input", {
                  empty: !keywords.length
                }),
                placeholder: formatMessage(
                  !keywords.length ? messages.keywords : messages.addKeyword
                )
              }}
              onChange={this.onChangeKeywords.bind(this)}
              onChangeInput={this.onChangeKeywordsInput.bind(this)}
            />
          </div>
        );
      default:
        return null;
    }
  }

  keywordVal() {
    const { searchPriority } = this.props.formValues;
    let { keywords } = this.props.formValues;
    if (!keywords) keywords = [];
    let disabled = false;

    if (searchPriority === PriorityTypes.BY_CATEGORY) {
      disabled = keywords.length === 0;
    }

    return disabled;
  }

  render() {
    const {
      handleSubmit,
      valid,
      auth,
      asyncValidating,
      formSyncErrors,
      formValues,
      dht
    } = this.props;
    const agreementTerms = { formValues };
    const btnClass = cn(
      auth.loading || !!this.props.asyncValidating ? "ui loading" : ""
    );
    const { formatMessage } = this.props.intl;
    const { showPassword } = this.state;
    return (
      <Form onSubmit={handleSubmit(this.submit)} className="signup">
        <Field
          type="text"
          name="username"
          placeholder={formatMessage(messages.accountName)}
          component={ValidatableField}
          validate={[
            required({ message: formatMessage(messages.fieldRequired) })
          ]}
        />
        <Field
          type="text"
          name="password"
          component={this.renderPasswordGeneratorField}
          validate={[
            required({ message: formatMessage(messages.fieldRequired) })
          ]}
        />
        <div className="save-password-text">
          {formatMessage(messages.savePassword1)}
        </div>
        <div className="save-password-text">
          {formatMessage(messages.savePassword2)}
        </div>
        <div className="password-input-container">
          <div>
            <Field
              type={`${showPassword ? 'text' : 'password'}`}
              placeholder={formatMessage(messages.confirmPassword)}
              name="passwordConfirmation"
              component={ValidatableField}
              validate={[
                required({ message: formatMessage(messages.fieldRequired) })
              ]}
            />
          </div>
          <i
            onClick={this.togglePasswordVisibility}
            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
          />
        </div>
        <Field
          type="text"
          name="referrer"
          component={this.renderReferrerField}
        />
        {/* {this.renderSearchPriority()} */}
        <div className="menu-item">
          <Field name="agreementTerms" component={this.renderTermField} />
        </div>
        {this.renderTerms()}
        <Button
          content={formatMessage(messages.signup)}
          disabled={
            !agreementTerms || !valid || auth.loading || !!asyncValidating
          }
          color="green"
          className={btnClass}
          loading={auth.loading || dht.isConnecting}
          type="submit"
        />
        <Divider fitted />
        <div className="question">
          <h3>{formatMessage(messages.haveAccount)}</h3>
        </div>
        <Button
          content={formatMessage(messages.signin)}
          disabled={auth.loading}
          color="blue"
          className={btnClass + " transparent"}
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
  asyncValidating: false,
  formValues: {},
  formActions: {}
};

SignupForm.propTypes = {
  auth: PropTypes.shape({
    defaultReferrer: PropTypes.string,
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
    signup: PropTypes.func,
    showTermsModal: PropTypes.func
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
  formValues: PropTypes.object,
  formActions: PropTypes.shape({
    change: PropTypes.func
  })
};

SignupForm = withRouter(SignupForm);

SignupForm = reduxForm({
  form: "signupForm",
  validate: SignupForm.validate,
  asyncValidate: SignupForm.asyncValidate,
  asyncBlurFields: ["referrer"],
  destroyOnUnmount: true
})(SignupForm);

SignupForm = injectIntl(SignupForm);

export default connect(
  state => ({
    ...state.default,
    formValues: getFormValues("signupForm")(state)
  }),
  dispatch => ({
    authActions: bindActionCreators({ signup, showTermsModal }, dispatch),
    formActions: bindActionCreators(
      {
        change: (field, value) => change("signupForm", field, value)
      },
      dispatch
    )
  })
)(SignupForm);
