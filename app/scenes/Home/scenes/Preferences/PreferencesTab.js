import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Form, Button, Select, Image, Icon, Grid } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import { required } from 'redux-form-validators';

import {
  savePreferences
} from '../../../../services/preferences/preferencesActions';
import FormInputWithIconOnRight
from '../../../../components/FormInputWithIconOnRight/FormInputWithIconOnRight';
import Dropdown from './components/Dropdown';
import Checkbox from '../Marketplace/scenes/Listing/scenes/AddListing/components/Checkbox/Checkbox';
import FormRadido from '../../../../components/Radio/FormRadio';
import ValidatableField from '../../../../components/ValidatableField/ValidatableField';
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
    this.state = {
      errorMsg: ''
    };
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
      } else if (!nextProps.dht.isConnecting) {
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
  
  static validate = (values) => {
    const { logoutTimeout, chargeFee } = values;
    const errors = {};
    const number = value => (value && !isNaN(Number(value)));
    
    if (!number(logoutTimeout) || logoutTimeout < 0) {
      errors.logoutTimeout = messages.errorTimeout
    }
  
    if ((!number(chargeFee) || chargeFee < 0)) {
      errors.chargeFee = messages.errorFee
    }
    
    return errors;
  };

  showErrorToast(title, message) {
    toastr.error(title, message);
  }

  showSuccessToast(title, message) {
    toastr.success(title, message);
  }
  
  onSubmit(values) {
    const publisher = this.props.auth.account.is_a_publisher;
    
    if (!publisher) {
      values.chargeFee = '';
    }
    this.props.preferencesActions.savePreferences(values);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, valid } = this.props;
    const { saving } = this.props.preferences;
    const publisher = this.props.auth.account.is_a_publisher;

    return (
      <div className="preferences-form-container">
        <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="preferences-form">
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <span>{formatMessage(messages.logoutTimeout)}{' ' + formatMessage(messages.minutes)}</span>
              </Grid.Column>
              <Grid.Column width={10}>
                <Field
                  type="text"
                  name="logoutTimeout"
                  placeholder={formatMessage(messages.logoutTimeout)}
                  component={ValidatableField}
                  validate={[required({ message: formatMessage(messages.fieldRequired) })]}
                />
              </Grid.Column>
            </Grid.Row>
          {/*<div className="form-group">
            <span>{formatMessage(messages.transactionFee)}</span>
            <Field
              name='transactionFee'
              placeholder={formatMessage(messages.transactionFee)}
              component={FormInputWithIconOnRight}
              className="textfield"
              props={{
                rightButtonText: formatMessage(messages.xomUnit)
              }}
            />
            <div className="col-1" />
          </div>*/}
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
          </div>*/}
            <Grid.Row>
              <Grid.Column width={4}>
                <span>{formatMessage(messages.interfaceLanguage)}</span>
              </Grid.Column>
              <Grid.Column width={10}>
                <Field
                  name="language"
                  component={Dropdown}
                  props={{
                    options: languages,
                    className: "priority-listings"
                  }}
                />
              </Grid.Column>
            </Grid.Row>
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
            <Grid.Row>
              <Grid.Column width={4}>
                <span>{formatMessage(messages.priorityForListing)}</span>
              </Grid.Column>
              <Grid.Column width={10}>
                <Field
                  name="listingPriority"
                  component={Dropdown}
                  props={{
                    options: listingPriorities,
                    className: "priority-listings"
                  }}
                />
              </Grid.Column>
            </Grid.Row>
  
            {publisher &&
              <Grid.Row>
                <Grid.Column width={4}>
                  <span>{formatMessage(messages.chargeFee)}(%)</span>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Field
                    type="text"
                    name="chargeFee"
                    component={ValidatableField}
                    placeholder={formatMessage(messages.chargeFee)}
                    validate={[required({ message: formatMessage(messages.fieldRequired) })]}
                  />
                </Grid.Column>
              </Grid.Row>
            }
            
            <Grid.Row>
              <Grid.Column width={4}>
                <span>{formatMessage(messages.searchListingOptions)}</span>
              </Grid.Column>
              <Grid.Column width={5}>
                <div className="radios field">
                  <div className="radio-group">
                    <Field
                      name="searchListingOption"
                      component={FormRadido}
                      props={{
                    value: 'anyKeyword'
                  }}
                    />
                    <span>{formatMessage(messages.byAnyKeyword)}</span>
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column width={5}>
                <div className="radios field">
                  <div className="radio-group">
                    <Field
                      name="searchListingOption"
                      component={FormRadido}
                      props={{
                    value: 'allKeywords'
                  }}
                    />
                    <span>{formatMessage(messages.byAllKeywords)}</span>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
  
            <Grid.Row>
              <Grid.Column width={4}>
              </Grid.Column>
              <Grid.Column width={10}>
                <Button
                  type="submit"
                  content={formatMessage(messages.update)}
                  className="button--green-bg"
                  loading={saving}
                  disabled={!valid || saving}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
  }).isRequired,
  dht: PropTypes.shape({
    isConnecting: PropTypes.bool,
  }).isRequired,
};

export default compose(
  connect(
    state => ({
      preferences: state.default.preferences,
      account: state.default.account,
      auth: state.default.auth,
      dht: state.default.dht,
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
    validate: PreferencesTab.validate
  })
)(injectIntl(PreferencesTab));
