/**
 * created by alaverdyanrafayel on 08/07/18
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, change, Form } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import { required, email } from 'redux-form-validators';
import PropTypes from 'prop-types';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import ValidatableField from '../../../../components/ValidatableField/ValidatableField';
import './air-drop-form.scss';

const inputCustomSize = 15;

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
    defaultMessage: 'I joined the OmniBazaar channel. My Telegram user name is'
  },
  telegramUserName: {
    id: 'AirDropForm.telegramUserName',
    defaultMessage: 'User name'
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
  }
});

class AirDropForm extends Component {
  static validate = values => {
    const errors = {};
    if (!values.telegramChannel) {
      errors.telegramChannel = messages.fieldRequired;
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

  onTelegramChannelCheck = isChecked => {
    this.props.formActions.change('telegramChannel', isChecked);
  };

  onTwitterChannelCheck = isChecked => {
    this.props.formActions.change('twitterChannel', isChecked);
  };
  onMailingListCheck = isChecked => {
    this.props.formActions.change('mailingList', isChecked);
  };

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
          <Checkbox
            width={inputCustomSize}
            height={inputCustomSize}
            onChecked={this.onTelegramChannelCheck}
          />
          <p>{formatMessage(messages.joinTelegramChannelConfirmation)} </p>
          <div className="ui form">
            <Field
              type="text"
              name="telegramUsername"
              placeholder={formatMessage(messages.telegramUserName)}
              component={ValidatableField}
              validate={[required({ message: formatMessage(messages.fieldRequired) })]}
            />
          </div>
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
          <Checkbox
            width={inputCustomSize}
            height={inputCustomSize}
            onChecked={this.onTwitterChannelCheck}
          />
          <p>{formatMessage(messages.joinTwitterChannelConfirmation)} </p>
          <div className="ui form">
            <Field
              type="text"
              name="twitterUsername"
              placeholder={formatMessage(messages.twitterUserName)}
              component={ValidatableField}
              validate={[required({ message: formatMessage(messages.fieldRequired) })]}
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
            <a className="link" href="#" target="_blank">
              {formatMessage(messages.mailchimpLink)}
            </a>
          </p>
        </div>
        <div className="joined-channel">
          <Checkbox
            width={inputCustomSize}
            height={inputCustomSize}
            onChecked={this.onMailingListCheck}
          />
          <p>{formatMessage(messages.joinNewsletterChannelConfirmation)} </p>
          <div className="ui form">
            <Field
              type="text"
              name="email"
              placeholder={formatMessage(messages.email)}
              component={ValidatableField}
              validate={[required({ message: formatMessage(messages.fieldRequired) }), email({ message: formatMessage(messages.invalidEmail) })]}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  submit(values) {
    console.log(values, 'values');
  }
  render() {
    const { handleSubmit, valid } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="airdrop-container">
        <h2>
          {formatMessage(messages.receiveOmnicoinsByFollowingActions, {
            current_bonus_amount: 20
          })}
        </h2>
        <Form onSubmit={handleSubmit(this.submit)} className="form">
          <Field name="telegramChannel" component={this.renderTelegramChannelField} />
          <Field name="twitterChannel" component={this.renderTwitterChannelField} />
          <Field name="mailingList" component={this.renderMailingListField} />
          <div className="buttons">
            <Button
              disabled={!valid}
              className="receiveWelcomeBonus"
              content={formatMessage(messages.receiveWelcomeBonus)}
              color="green"
              type="submit"
            />
            <Button
              className="skipFreeCoins"
              content={formatMessage(messages.skipFreeCoins)}
              color="white"
            />
          </div>
        </Form>
      </div>
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

AirDropForm = injectIntl(AirDropForm);

export default connect(
  () => {},
  dispatch => ({
    formActions: bindActionCreators(
      {
        change: (field, value) => change('AirDropForm', field, value)
      },
      dispatch
    )
  })
)(AirDropForm);

AirDropForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }),
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  formActions: PropTypes.shape({
    change: PropTypes.func
  })
};

AirDropForm.defaultProps = {
  intl: {},
  formActions: {}
};
