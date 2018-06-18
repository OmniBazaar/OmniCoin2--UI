import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Form, Button, Select, Image, Icon } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { toastr } from 'react-redux-toastr';

import {
  savePreferences
} from '../../../../services/preferences/preferencesActions';
import FormInputWithIconOnRight
from '../../../../components/FormInputWithIconOnRight/FormInputWithIconOnRight';
import Dropdown from './components/Dropdown';
import Checkbox from '../Marketplace/scenes/Listing/scenes/AddListing/components/Checkbox/Checkbox';
import FormRadido from '../../../../components/Radio/FormRadio';
import messages from './messages';
import languages from './languages';
import votes from './votes';
import listingPriorities from './priorities';
import './preferences.scss';

//need this variable to check saving success when language is changed,
//in that case we force all components to be recreated.
let lastLanguage = null;

class PreferencesTab extends Component {
  constructor(props) {
    super(props);
    if (!lastLanguage) {
      lastLanguage = props.preferences.preferences.language;
    }
  }

  componentWillMount() {
    const { preferences } = this.props.preferences;
    this.props.initialize(preferences);
  }

  componentDidMount() {
    const { language } = this.props.preferences.preferences;
    const { formatMessage } = this.props.intl;
    if (lastLanguage !== language) {
      this.showSuccessToast(
        formatMessage(messages.successTitle),
        formatMessage(messages.saveSuccessMessage)
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.preferences.saving && this.props.preferences.saving) {
      const { formatMessage } = this.props.intl;
      if (nextProps.preferences.error) {
        this.showErrorToast(
          formatMessage(messages.errorTitle),
          formatMessage(messages.saveErrorMessage)
        );
      } else {
        this.showSuccessToast(
          formatMessage(messages.successTitle),
          formatMessage(messages.saveSuccessMessage)
        );
      }
    }
  }

  componentWillUnmount() {
    lastLanguage = this.props.preferences.preferences.language;
  }

  showErrorToast(title, message) {
    toastr.error(title, message);
  }

  showSuccessToast(title, message) {
    toastr.success(title, message);
  }

  onSubmit(values) {
    const { publisher } = this.props.account;
    if (!publisher) {
      values.chargeFee = '';
    }
    this.props.preferencesActions.savePreferences(values);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { saving } = this.props.preferences;
    const { publisher } = this.props.account;

    return (
      <div className="preferences-form-container">
        <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="preferences-form">
          <div className="form-group">
            <span>{formatMessage(messages.logoutTimeout)}</span>
            <Field
              name="logoutTimeout"
              placeholder={formatMessage(messages.logoutTimeout)}
              component={FormInputWithIconOnRight}
              className="textfield"
              props={{
                rightButtonText: formatMessage(messages.minutes)
              }}
            />
            <div className="col-1" />
          </div>
          {/*<div className="form-group">*/}
            {/*<span>{formatMessage(messages.transactionFee)}</span>*/}
            {/*<Field*/}
              {/*name='transactionFee'*/}
              {/*placeholder={formatMessage(messages.transactionFee)}*/}
              {/*component={FormInputWithIconOnRight}*/}
              {/*className="textfield"*/}
              {/*props={{*/}
                {/*rightButtonText: formatMessage(messages.xomUnit)*/}
              {/*}}*/}
            {/*/>*/}
            {/*<div className="col-1" />*/}
          {/*</div>*/}
          {/*<div className="form-group">
            <span>{formatMessage(messages.byDefaultVote)}</span>
            <Field
              name="vote"
              component={Dropdown}
              props={{
                options: votes
              }}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.interfaceLanguage)}</span>
            <Field
              name="language"
              component={Dropdown}
              props={{
                options: languages
              }}
            />
            <div className="col-1" />
          </div>*/}
          {/*<div className="form-group top referrer">
            <span>{formatMessage(messages.referralProgram)}</span>
            <div className="check-form field">
              <div className="description">
                <div className="check-container">
                  <Field
                    name='isReferrer'
                    component={Checkbox}
                    props={{
                      label: ''
                    }}
                  />
                </div>
                <div className="description-text">
                  <p className="title">{formatMessage(messages.referralProgramTitle)}</p>
                  <div>
                    {formatMessage(messages.referralProgramText)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1" />
          </div>*/}
          <div className="form-group">
            <span>{formatMessage(messages.priorityForListing)}</span>
            <Field
              name="listingPriority"
              component={Dropdown}
              props={{
                options: listingPriorities
              }}
            />
            <div className="col-1" />
          </div>
          {
            publisher &&
            <div className="form-group">
              <span>{formatMessage(messages.chargeFee)}</span>
              <Field
                type="text"
                name="chargeFee"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.chargeFee)}
              />
              <div className="col-1" />
            </div>
          }
          <div className='form-group'>
            <span>{formatMessage(messages.searchListingOptions)}</span>
            <div className='radios field'>
              <div className='radio-group'>
                <Field
                  name='searchListingOption'
                  component={FormRadido}
                  props={{
                    value: 'anyKeyword'
                  }}
                />
                <span>{formatMessage(messages.byAnyKeyword)}</span>
              </div>
              <div className='radio-group'>
                <Field
                  name='searchListingOption'
                  component={FormRadido}
                  props={{
                    value: 'allKeywords'
                  }}
                />
                <span>{formatMessage(messages.byAllKeywords)}</span>
              </div>
            </div>
            <div className="col-1" />
          </div>
          <div className="form-group submit-group">
            <span />
            <div className="field">
              <Button
                type="submit"
                content={formatMessage(messages.update)}
                className="button--green-bg"
                loading={saving}
                disabled={saving} />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }
}

PreferencesTab.propTypes = {
  account: PropTypes.shape({
    publisher: PropTypes.bool
  }).isRequired,
  preferences: PropTypes.shape({
    preferences: PropTypes.object,
    saving: PropTypes.bool,
    error: PropTypes.object
  }).isRequired,
  preferencesActions: PropTypes.shape({
    savePreferences: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired
};

export default compose(
  connect(
    state => ({
      preferences: state.default.preferences,
      account: state.default.account
    }),
    dispatch => ({
      preferencesActions: bindActionCreators({
        savePreferences
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'preferencesForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(PreferencesTab));
