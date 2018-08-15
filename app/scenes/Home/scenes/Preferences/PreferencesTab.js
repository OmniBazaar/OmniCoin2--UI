import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Form, Button, Select, Image, Icon, Grid, Popup, Loader } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import { required } from 'redux-form-validators';
import Info from '../../images/info2.png';

import {
  savePreferences,
  loadServerPreferences
} from '../../../../services/preferences/preferencesActions';
import { restartNode } from "../../../../services/blockchain/connection/connectionActions";

import Dropdown from './components/Dropdown';
import Checkbox from '../Marketplace/scenes/Listing/scenes/AddListing/components/Checkbox/Checkbox';
import FormRadio from '../../../../components/Radio/FormRadio';
import ValidatableField from '../../../../components/ValidatableField/ValidatableField';
import messages from './messages';
import languages from './languages';
import listingPriorities from './priorities';
import './preferences.scss';

// need this variable to check saving success when language is changed,
// in that case we force all components to be recreated.
let lastLanguage = null;

class PreferencesTab extends Component {
  static validate = (values) => {
    const { logoutTimeout, chargeFee, searchListingOption, publisherFee, escrowFee } = values;
    const errors = {};
    const number = value => (value && !isNaN(Number(value)));

    if (!number(logoutTimeout) || logoutTimeout < 0) {
      errors.logoutTimeout = messages.errorTimeout;
    }

    if ((!number(publisherFee) || publisherFee < 0)) {
      errors.publisherFee = messages.errorFee;
    }

    if ((!number(escrowFee) || escrowFee < 0)) {
      errors.escrowFee = messages.errorFee;
    }

    return errors;
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMsg: ''
    };
    if (!lastLanguage) {
      lastLanguage = props.preferences.preferences.language;
    }
    this.restartNode = this.restartNode.bind(this);
  }

  componentWillMount() {
    const { preferences } = this.props.preferences;
    this.props.preferencesActions.loadServerPreferences();
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
    const { formatMessage } = this.props.intl;

    if (!nextProps.preferences.loading && this.props.preferences.loading) {
      this.props.initialize(nextProps.preferences.preferences);
    }

    if (!nextProps.preferences.saving && this.props.preferences.saving) {
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
    if (this.props.connection.restartingNode && !nextProps.connection.restartingNode) {
      if (nextProps.connection.error) {
        this.showErrorToast(formatMessage(messages.errorTitle), formatMessage(messages.nodeRestartError));
      } else {
        this.showSuccessToast(formatMessage(messages.successTitle), formatMessage(messages.nodeRestartSuccess));
      }
    }
  }

  componentWillUnmount() {
    lastLanguage = this.props.preferences.preferences.language;
  }

  restartNode(e) {
    this.props.connectionActions.restartNode();
    e.preventDefault();
  }

  showErrorToast(title, message) {
    toastr.error(title, message);
  }

  showSuccessToast(title, message) {
    toastr.success(title, message);
  }

  onSubmit(values) {
    const publisher = this.props.auth.account.is_a_publisher;
    const escrow = this.props.auth.account.is_an_escrow;

    if (!publisher) {
      values.publisherFee = '';
    }

    if (!escrow) {
      values.escrowFee = '';
    }

    this.props.preferencesActions.savePreferences(values);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit, valid } = this.props;
    const { saving, loading } = this.props.preferences;
    const publisher = this.props.auth.account.is_a_publisher;
    const escrow = this.props.auth.account.is_an_escrow;

    return (
      <div className="preferences-form-container">
        { loading ?
          <Loader></Loader>
          :
        <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="preferences-form">
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <span>{formatMessage(messages.logoutTimeout)}{` ${formatMessage(messages.minutes)}`}</span>
              </Grid.Column>
              <Grid.Column width={10}>
                <Field
                  type="text"
                  name="logoutTimeout"
                  placeholder={formatMessage(messages.logoutTimeout)}
                  component={ValidatableField}
                  validate={[required({ message: formatMessage(messages.fieldRequired) })]}
                />
                <div className="auto-log-out">
                  {formatMessage(messages.autoLogOut)}
                </div>
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
                  <span>{formatMessage(messages.publisherFee)}(%)</span>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Field
                    type="text"
                    name="publisherFee"
                    component={ValidatableField}
                    placeholder={formatMessage(messages.publisherFee)}
                    validate={[required({ message: formatMessage(messages.fieldRequired) })]}
                  />
                </Grid.Column>
              </Grid.Row>
            }

            {escrow &&
              <Grid.Row>
                <Grid.Column width={4}>
                  <span>{formatMessage(messages.escrowFee)}(%)</span>
                </Grid.Column>
                <Grid.Column width={10}>
                  <Field
                    type="text"
                    name="escrowFee"
                    component={ValidatableField}
                    placeholder={formatMessage(messages.escrowFee)}
                    validate={[required({ message: formatMessage(messages.fieldRequired) })]}
                  />
                </Grid.Column>
              </Grid.Row>
            }
            <Grid.Row>
              <Grid.Column width={4}>
                <span className="search-list-options">{formatMessage(messages.searchListingOptions)}</span>
                <Popup
                  trigger={<span><Image src={Info} width={20} height={20} /></span>}
                  content={formatMessage(messages.listingOptionsToolTip)}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <div className="radios field">
                  <div className="radio-group">
                    <Field
                      name="searchListingOption"
                      component={FormRadio}
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
                      component={FormRadio}
                      props={{
                        value: 'allKeywords'
                      }}
                    />
                    <span>{formatMessage(messages.byAllKeywords)}</span>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            {this.props.auth.account.is_a_processor &&
              <Grid.Row>
                <Grid.Column width={3}>
                  {false && formatMessage(messages.autoRun)}
                </Grid.Column>

                <Grid.Column>
                  {false &&
                    <div className="autorun">
                      <Field
                        name="autorun"
                        component={Checkbox}
                      />
                    </div>
                  }
                  <div className="autorun-note">
                    {false && formatMessage(messages.autoRunNote)}
                  </div>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Button
                    disabled={!this.props.auth.account.is_a_processor}
                    loading={this.props.connection.restartingNode}
                    content={formatMessage(messages.restartNode)}
                    onClick={this.restartNode}
                    className="button--primary"
                  />
                </Grid.Column>
                <Grid.Column width={3}>
                </Grid.Column>
              </Grid.Row>

            }
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
        }
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
    savePreferences: PropTypes.func,
    loadServerPreferences: PropTypes.func
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
      connection: state.default.connection
    }),
    dispatch => ({
      preferencesActions: bindActionCreators({
        savePreferences,
        loadServerPreferences
      }, dispatch),
      connectionActions: bindActionCreators({
        restartNode
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'preferencesForm',
    destroyOnUnmount: true,
    validate: PreferencesTab.validate
  })
)(injectIntl(PreferencesTab));
