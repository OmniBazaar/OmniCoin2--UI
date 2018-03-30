import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { changePriority, getPrivateData, updatePrivateData } from '../../../../../../services/accountSettings/accountActions';

import '../../settings.scss';
import './private.scss';

const messages = defineMessages({
  notPublisherYet: {
    id: 'PrivateData.notPublisherYet',
    defaultMessage: 'You are not a publisher yet.'
  },
  publisherNeedInfo: {
    id: 'PrivateData.publisherNeedInfo',
    defaultMessage: 'We need the following information so that we can connect you to a Publisher of listings that align with your interests.'
  },
  localArea: {
    id: 'PrivateData.localArea',
    defaultMessage: 'Local area.'
  },
  byCategoryType: {
    id: 'PrivateData.byCategoryType',
    defaultMessage: 'By Category / Type'
  },
  publisherName: {
    id: 'PrivateData.publisherName',
    defaultMessage: 'Publisher Name'
  },
  country: {
    id: 'PrivateData.country',
    defaultMessage: 'Country'
  },
  city: {
    id: 'PrivateData.city',
    defaultMessage: 'City'
  },
  startTyping: {
    id: 'PrivateData.startTyping',
    defaultMessage: 'Start typing...'
  },
  apply: {
    id: 'PrivateData.apply',
    defaultMessage: 'APPLY'
  },
  updateSuccess: {
    id: 'PrivateData.updateSuccess',
    defaultMessage: 'Successfully updated'
  },
  update: {
    id: 'PrivateData.update',
    defaultMessage: 'Update'
  }
});

const PriorityTypes = Object.freeze({
  LOCAL_DATA: 'local',
  BY_CATEGORY: 'category',
  PUBLISHER: 'publisher',
});

class PrivateData extends Component {
  constructor(props) {
    super(props);

    this.onChangePriority = this.onChangePriority.bind(this);
    this.submitPrivateData = this.submitPrivateData.bind(this);
    this.submitPublisherData = this.submitPublisherData.bind(this);
    this.privateDataForm = this.privateDataForm.bind(this);
    this.publisherForm = this.publisherForm.bind(this);
  }

  state = {
    country: '',
    city: ''
  };

  componentWillMount() {
    this.props.accountSettingsActions.getPrivateData();
  }

  selectCountry(val) {
    this.setState({ country: val });
  }

  selectCity(val) {
    this.setState({ city: val });
  }


  submitPrivateData(values) {
    const { formatMessage } = this.props.intl;
    this.props.accountSettingsActions.updatePrivateData(values);
    toastr.success(formatMessage(messages.update), formatMessage(messages.updateSuccess));
  }

  privateDataForm() {
    const { handleSubmit } = this.props;
    return (
      <div className="private-form">
        <Form onSubmit={handleSubmit(this.submitPrivateData)} className="mail-form-container">
          <div className="form-group">
            <span>Email</span>
            <Field
              type="text"
              name="email"
              placeholder="Email"
              component="input"
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>First Name</span>
            <Field
              type="text"
              name="firstname"
              placeholder="First Name"
              component="input"
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>Last Name</span>
            <Field
              type="text"
              name="lastname"
              placeholder="Last Name"
              component="input"
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>Website</span>
            <Field
              type="text"
              name="website"
              placeholder="Website"
              component="input"
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span />
            <Button type="submit" content="UPDATE" className="button--green-bg" />
            <div className="col-1" />
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }

  onChangePriority(priority) {
    this.props.accountSettingsActions.changePriority(priority);
  }

  submitPublisherData(values) {
    console.log(values);
  }

  publisherForm() {
    const { priority } = this.props.account;
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;

    return (
      <div className="publisher-form">
        <div className="header">
          <p className="title">{formatMessage(messages.notPublisherYet)}</p>
          <p>
            {formatMessage(messages.publisherNeedInfo)}
          </p>
        </div>
        <Form onSubmit={handleSubmit(this.submitPublisherData)} className="mail-form-container">
          <div className="form-group">
            <span>Search Priority</span>
            <div className="field radios-container">
              <div className="radio-wrapper">
                <Field
                  onClick={() => { this.onChangePriority(PriorityTypes.LOCAL_DATA); }}
                  name={PriorityTypes.LOCAL_DATA}
                  component="input"
                  type="radio"
                  checked={priority === PriorityTypes.LOCAL_DATA}
                  value={PriorityTypes.LOCAL_DATA}
                />
                <span className="checkbox-inline">{formatMessage(messages.localArea)}</span>
              </div>

              <div className="radio-wrapper">
                <Field
                  onClick={() => { this.onChangePriority(PriorityTypes.BY_CATEGORY); }}
                  name={PriorityTypes.BY_CATEGORY}
                  component="input"
                  type="radio"
                  checked={priority === PriorityTypes.BY_CATEGORY}
                  value={PriorityTypes.BY_CATEGORY}
                />
                <span className="checkbox-inline">{formatMessage(messages.byCategoryType)}</span>
              </div>

              <div className="radio-wrapper">
                <Field
                  onClick={() => { this.onChangePriority(PriorityTypes.PUBLISHER); }}
                  name={PriorityTypes.PUBLISHER}
                  component="input"
                  type="radio"
                  checked={priority === PriorityTypes.PUBLISHER}
                  value={PriorityTypes.PUBLISHER}
                />
                <span className="checkbox-inline">{formatMessage(messages.publisherName)}</span>
              </div>
            </div>
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.country)}</span>
            <CountryDropdown
              value={this.state.country}
              classes="ui dropdown textfield"
              onChange={(val) => this.selectCountry(val)} />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.city)}</span>
            <RegionDropdown
              country={this.state.country}
              value={this.state.city}
              classes="ui dropdown textfield"
              onChange={(val) => this.selectCity(val)} />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span />
            <Button type="submit" content={formatMessage(messages.apply)} className="button--green-bg" />
            <div className="col-1" />
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }

  render() {
    return (
      <div className="private-data">
        {this.privateDataForm()}
        {this.publisherForm()}
      </div>
    );
  }
}

PrivateData.propTypes = {
  accountSettingsActions: PropTypes.shape({
    changePriority: PropTypes.func,
    getPrivateData: PropTypes.func,
    updatePrivateData: PropTypes.func
  }).isRequired,
  account: PropTypes.shape({
    priority: PropTypes.string,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  handleSubmit: PropTypes.func.isRequired
};

PrivateData.defaultProps = {
  accountSettingsActions: {},
  account: {},
  intl: {},
};

export default compose(
  connect(
    state => ({
      ...state.default,
      initialValues: {
        ...state.default.account.privateData
      }
    }),
    (dispatch) => ({
      accountSettingsActions: bindActionCreators({
        changePriority,
        getPrivateData,
        updatePrivateData
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'privateDataForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(PrivateData));
