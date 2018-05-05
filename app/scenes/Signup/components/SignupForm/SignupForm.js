import React, { Component } from 'react';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
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
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import TagsInput from '../../../../components/TagsInput';

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
  },
  searchPriority: {
    id: 'SignupForm.searchPriority',
    defaultMessage: 'Marketplace Search priority'
  },
  localArea: {
    id: 'SignupForm.localArea',
    defaultMessage: 'Local Area'
  },
  byCategoryType: {
    id: 'SignupForm.byCategoryType',
    defaultMessage: 'By Category/Type'
  },
  country: {
    id: 'SignupForm.country',
    defaultMessage: 'Your Country'
  },
  city: {
    id: 'SignupForm.city',
    defaultMessage: 'Your City'
  },
  keywords: {
    id: 'SignupForm.keywords',
    defaultMessage: 'Keywords for listing your want to see'
  },
  addKeyword: {
    id: 'SignupForm.addKeyword',
    'defaultMessage': 'Add keyword'
  }
});

const PriorityTypes = Object.freeze({
  LOCAL_DATA: 'local',
  BY_CATEGORY: 'category'
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
      password: (`P${key.get_random_key().toWif()}`).substr(0, 45),
      searchPriority: PriorityTypes.LOCAL_DATA
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

  onChangeCountry(country) {
    this.props.formActions.change('country', country);
  }

  onChangeCity(city) {
    this.props.formActions.change('city', city);
  }

  onChangeKeywords(keywords){
    this.props.formActions.change('keywords', keywords);
  }

  signIn() {
    this.props.history.push('/login');
  }

  submit(values) {
    const { username, password, referrer, searchPriority, country, city, keywords } = values;
    this.props.authActions.signup(
      username,
      password,
      referrer,
      {
        priority: searchPriority,
        country,
        city,
        keywords
      },
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


  renderSearchPriority(){
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <div className="search-priority">
          <div>{formatMessage(messages.searchPriority)}</div>
          <div className="radios-container">
            <div className="radio-wrapper">
              <Field
                name='searchPriority'
                component="input"
                type="radio"
                value={PriorityTypes.LOCAL_DATA}
              />
              <span className="checkbox-inline">{formatMessage(messages.localArea)}</span>
            </div>

            <div className="radio-wrapper">
              <Field
                name='searchPriority'
                component="input"
                type="radio"
                value={PriorityTypes.BY_CATEGORY}
              />
              <span className="checkbox-inline">{formatMessage(messages.byCategoryType)}</span>
            </div>
          </div>

          {this.renderSearchPriorityFormFields()}
        </div>
      </div>
    );
  }

  renderSearchPriorityFormFields() {
    const { searchPriority } = this.props.formValues;
    const { formatMessage } = this.props.intl;

    switch (searchPriority) {
      case PriorityTypes.LOCAL_DATA:
        const {country, city} = this.props.formValues;
        return (
          <div className='location-container'>
            <CountryDropdown
                value={country}
                defaultOptionLabel={formatMessage(messages.country)}
                classes="ui dropdown textfield"
                onChange={this.onChangeCountry.bind(this)}
              />
            <RegionDropdown
                country={country}
                value={city}
                defaultOptionLabel={formatMessage(messages.city)}
                blankOptionLabel={formatMessage(messages.city)}
                classes="ui dropdown textfield"
                onChange={this.onChangeCity.bind(this)}
              />
          </div>
        );
      case PriorityTypes.BY_CATEGORY:
        let {keywords} = this.props.formValues;
        if(!keywords) keywords = [];
        return (
          <TagsInput value={keywords}
              inputProps={{
                className: cn('react-tagsinput-input', {empty: keywords.length ? false : true}),
                placeholder: (
                  formatMessage(!keywords.length ? messages.keywords : messages.addKeyword)
                )
              }}
              onChange={this.onChangeKeywords.bind(this)} />
        );
      default:
        return null;
    }
  }

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
        {this.renderSearchPriority()}
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
  asyncValidating: false,
  formValues: {},
  formActions: {}
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
  asyncValidating: PropTypes.string,
  formValues: PropTypes.object,
  formActions: PropTypes.shape({
    change: PropTypes.func
  })
};

SignupForm = withRouter(SignupForm);

SignupForm = reduxForm({
  form: 'signupForm',
  validate: SignupForm.validate,
  asyncValidate: SignupForm.asyncValidate,
  asyncBlurFields: ['username', 'referrer'],
  destroyOnUnmount: true
})(SignupForm);

SignupForm = injectIntl(SignupForm);

export default connect(
  (state) => ({
    ...state.default,
    formValues: getFormValues('signupForm')(state),
  }),
  (dispatch) => ({
    authActions: bindActionCreators({ signup }, dispatch),
    formActions: bindActionCreators({
      change: (field, value)=>change('signupForm', field, value)
    }, dispatch)
  })
)(SignupForm);

