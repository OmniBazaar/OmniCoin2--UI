/**
 * created by alaverdyanrafayel on 08/07/18
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, Form, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import { required, email } from 'redux-form-validators';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import { getWelcomeBonusAmount, receiveWelcomeBonus } from '../../../../services/blockchain/auth/authActions';
import ValidatableField from '../../../../components/ValidatableField/ValidatableField';

import './air-drop-form.scss';

const messages = defineMessages({
  receiveOmnicoinsByFollowingActions: {
    id: 'AirDropForm.receiveOmnicoinsByFollowingActions',
    defaultMessage:
      'You can receive {current_bonus_amount} OmniCoins just for doing the following actions'
  },
  joinTelegramChannelSuggestion: {
    id: 'AirDropForm.joinTelegramChannelSuggestion',
    defaultMessage: 'Join our Telegram channel here:'
  },
  telegramLink: {
    id: 'AirDropForm.telegramLink',
    defaultMessage: 'OmniBazaar on Telegram'
  },
  joinTelegramChannelConfirmation: {
    id: 'AirDropForm.joinTelegramChannelConfirmation',
    defaultMessage: 'I joined the OmniBazaar channel. My Telegram phone number is'
  },
  joinTelegramBotSuggestion: {
    id: 'AirDropForm.joinTelegramBotSuggestion',
    defaultMessage: 'Start the Bot here:'
  },
  omnicoinVerificationBotLink: {
    id: 'AirDropForm.omnicoinVerificationBotLink',
    defaultMessage: 'Omnicoin verification bot'
  },
  joinTelegramBotConfirmation: {
    id: 'AirDropForm.joinTelegramBotConfirmation',
    defaultMessage: 'I joined the omnicoin verification bot.'
  },
  telegramPhoneNumber: {
    id: 'AirDropForm.telegramPhoneNumber',
    defaultMessage: 'Phone Number'
  },
  joinTwitterChannelSuggestion: {
    id: 'AirDropForm.joinTwitterChannelSuggestion',
    defaultMessage: 'Join our Twitter channel here:'
  },
  twitterLink: {
    id: 'AirDropForm.twitterLink',
    defaultMessage: 'OmniBazaar on Twitter'
  },
  joinTwitterChannelConfirmation: {
    id: 'AirDropForm.joinTwitterChannelConfirmation',
    defaultMessage: 'I joined the OmniBazaar channel. My Twitter user name is'
  },
  twitterUserName: {
    id: 'AirDropForm.twitterUserName',
    defaultMessage: 'User name'
  },
  joinNewsletterChannelSuggestion: {
    id: 'AirDropForm.joinNewsletterChannelSuggestion',
    defaultMessage: 'Join our Newsletter mailing list here:'
  },
  mailchimpLink: {
    id: 'AirDropForm.mailchimpLink',
    defaultMessage: 'OmniBazaar on MailChimp'
  },
  joinNewsletterChannelConfirmation: {
    id: 'AirDropForm.joinNewsletterChannelConfirmation',
    defaultMessage: 'I joined the OmniBazaar mailing list. My e-mail address is:'
  },
  email: {
    id: 'AirDropForm.email',
    defaultMessage: 'E-mail Address'
  },
  receiveWelcomeBonus: {
    id: 'AirDropForm.receiveWelcomeBonus',
    defaultMessage: 'Receive Welcome Bonus'
  },
  skipFreeCoins: {
    id: 'AirDropForm.skipFreeCoins',
    defaultMessage: 'Skip the free coins'
  },
  fieldRequired: {
    id: 'AirDropForm.fieldRequired',
    defaultMessage: 'This field is required'
  },
  invalidEmail: {
    id: 'AirDropForm.invalidEmail',
    defaultMessage: 'Email is invalid'
  },
  signup: {
    id: 'AirDropForm.signup',
    defaultMessage: 'Sign up'
  },
  getWhiteListedForTokenSale: {
    id: 'AirDropForm.getWhiteListedForTokenSale',
    defaultMessage: 'Get white-listed for our token sale'
  }
});

class AirDropForm extends Component {
  static validate = values => {
    const errors = {};
    if (!values.telegramChannel) {
      errors.telegramChannel = messages.fieldRequired;
    }
    if (!values.telegramBot) {
      errors.telegramBot = messages.fieldRequired;
    }
    if (!values.twitterChannel) {
      errors.twitterChannel = messages.fieldRequired;
    }
    if (!values.mailingList) {
      errors.mailingList = messages.fieldRequired;
    } else if (/^.+@.+$/i.test(values.mailingList)) {
      errors.mailingList = messages.invalidEmail;
    }
    return errors;
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.props.authActions.getWelcomeBonusAmount();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.error && !this.props.auth.error) {
      toastr.error(nextProps.auth.error);
    }
  }

  signUp = () => {
    this.props.history.push('/');
  }

  renderCheckboxField = ({ input, label, onCheck }) => (
    <div className="transfer-input" style={{ display: 'flex' }}>
      <Checkbox
        value={input.value}
        onChecked={(value) => {
            input.onChange(value);
            if (onCheck) {
              onCheck(value);
            }
          }}
      />
      <span className="label">
        {label}
      </span>
    </div>
  );

  renderTelegramChannelField = () => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="channel-link">
          <p>
            {formatMessage(messages.joinTelegramChannelSuggestion)}&nbsp;
            <a className="link" href="https://t.me/Omni_Bazaar" target="_blank">
              {formatMessage(messages.telegramLink)}
            </a>
          </p>
        </div>
        <div className="joined-channel">
          <Field
            name="telegramChannel"
            component={this.renderCheckboxField}
          />
          <p>{formatMessage(messages.joinTelegramChannelConfirmation)} </p>
          <div className="ui form">
            <Field
              type="text"
              name="telegramPhoneNumber"
              placeholder={formatMessage(messages.telegramPhoneNumber)}
              component={ValidatableField}
              validate={this.props.AirDropForm.telegramChannel ? [required({ message: formatMessage(messages.fieldRequired) })] : undefined}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };
  renderTelegramBotField = () => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="channel-link">
          <p>
            {formatMessage(messages.joinTelegramBotSuggestion)}&nbsp;
            <a className="link" href="https://t.me/omnicoin_verification_bot" target="_blank">
              {formatMessage(messages.omnicoinVerificationBotLink)}
            </a>
          </p>
        </div>
        <div className="joined-channel">
          <Field
            name="telegramBot"
            component={this.renderCheckboxField}
          />
          <p>{formatMessage(messages.joinTelegramBotConfirmation)} </p>
        </div>
      </React.Fragment>
    );
  };
  renderTwitterChannelField = () => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="channel-link">
          <p>
            {formatMessage(messages.joinTwitterChannelSuggestion)}&nbsp;
            <a className="link" href="https://twitter.com/omnibazaar" target="_blank">
              {formatMessage(messages.twitterLink)}
            </a>
          </p>
        </div>
        <div className="joined-channel">
          <Field
            name="twitterChannel"
            component={this.renderCheckboxField}
          />
          <p>{formatMessage(messages.joinTwitterChannelConfirmation)} </p>
          <div className="ui form">
            <Field
              type="text"
              name="twitterUsername"
              placeholder={formatMessage(messages.twitterUserName)}
              component={ValidatableField}
              validate={this.props.AirDropForm.twitterChannel ? [required({ message: formatMessage(messages.fieldRequired) })] : undefined}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };
  renderMailingListField = () => {
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="channel-link">
          <p>
            {formatMessage(messages.joinNewsletterChannelSuggestion)}&nbsp;
            <a className="link" href="http://eepurl.com/M708n" target="_blank">
              {formatMessage(messages.mailchimpLink)}
            </a>
          </p>
        </div>
        <div className="joined-channel">
          <Field
            name="mailingList"
            component={this.renderCheckboxField}
          />
          <p>{formatMessage(messages.joinNewsletterChannelConfirmation)} </p>
          <div className="ui form">
            <Field
              type="text"
              name="email"
              placeholder={formatMessage(messages.email)}
              component={ValidatableField}
              validate={this.props.AirDropForm.mailingList ? [required({ message: formatMessage(messages.fieldRequired) }), email({ message: formatMessage(messages.invalidEmail) })] : undefined}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  submit = values => new Promise((resolve, reject) => {
    this.props.authActions.receiveWelcomeBonus({
      values,
      resolve,
      reject,
      formatMessage: this.props.intl.formatMessage
    });
  })
  render() {
    const btnClass = (this.props.auth.loading || !!this.props.asyncValidating) ? 'ui loading' : '';
    const welcomeBonusAmount = this.props.auth.welcomeBonusAmount ? (this.props.auth.welcomeBonusAmount / 100000).toLocaleString() : '';
    const { handleSubmit, valid } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <React.Fragment>
        <div className="airdrop-container">
          <h2>
            {formatMessage(messages.receiveOmnicoinsByFollowingActions, {
              current_bonus_amount: welcomeBonusAmount
            })}
          </h2>
          <Form onSubmit={handleSubmit(this.submit)} className="form">
            <Field name="telegramChannel" component={this.renderTelegramChannelField} />
            <Field name="telegramBot" component={this.renderTelegramBotField} />
            <Field name="twitterChannel" component={this.renderTwitterChannelField} />
            <Field name="mailingList" component={this.renderMailingListField} />
            <div className="buttons">
              <Button
                disabled={!valid}
                className={btnClass}
                content={formatMessage(messages.receiveWelcomeBonus)}
                color="green"
                type="submit"
              />
              <Button
                className="skipFreeCoins"
                content={formatMessage(messages.skipFreeCoins)}
                color="white"
                onClick={this.signUp}
              />
            </div>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

AirDropForm = withRouter(AirDropForm);

AirDropForm = reduxForm({
  form: 'AirDropForm',
  validate: AirDropForm.validate,
  asyncBlurFields: [],
  destroyOnUnmount: true
})(AirDropForm);

const selector = formValueSelector('AirDropForm');

AirDropForm = injectIntl(AirDropForm);

export default connect(
  state => ({
    ...state.default,
    AirDropForm: {
      telegramChannel: selector(state, 'telegramChannel'),
      twitterChannel: selector(state, 'twitterChannel'),
      mailingList: selector(state, 'mailingList')
    }
  }),
  dispatch => ({
    authActions: bindActionCreators({ getWelcomeBonusAmount, receiveWelcomeBonus }, dispatch),
  })
)(AirDropForm);

AirDropForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  AirDropForm: PropTypes.shape({
    telegramChannel: PropTypes.bool,
    twitterChannel: PropTypes.bool,
    mailingList: PropTypes.bool
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  auth: PropTypes.shape({
    error: PropTypes.string
  }),
  authActions: PropTypes.shape({
    getWelcomeBonusAmount: PropTypes.func,
  }),
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
};

AirDropForm.defaultProps = {
  intl: {},
  AirDropForm: {},
  history: {},
  authActions: {},
  auth: {}
};
