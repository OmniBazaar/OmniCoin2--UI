import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { changePriority } from '../../../../../../services/accountSettings/accountActions';

import '../../settings.scss';
import './private.scss';

const messages = defineMessages({
  notPublisherYet: {
    id: 'Settings.notPublisherYet',
    defaultMessage: 'You are not a publisher yet.'
  },
  publisherNeedInfo: {
    id: 'Settings.publisherNeedInfo',
    defaultMessage: 'We need the following information so that we can connect you to a Publisher of listings that align with your interests.'
  },
  localArea: {
    id: 'Settings.localArea',
    defaultMessage: 'Local area.'
  },
  byCategoryType: {
    id: 'Settings.byCategoryType',
    defaultMessage: 'By Category / Type'
  },
  publisherName: {
    id: 'Settings.publisherName',
    defaultMessage: 'Publisher Name'
  },
  country: {
    id: 'Settings.country',
    defaultMessage: 'Country'
  },
  startTyping: {
    id: 'Settings.startTyping',
    defaultMessage: 'Start typing...'
  },
  apply: {
    id: 'Settings.apply',
    defaultMessage: 'APPLY'
  },
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
  }

  privateDataForm() {
    return (
      <div className="private-form">
        <Form onSubmit={this.onSubmit} className="mail-form-container">
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
          <div className="form-group submit-group">
            <span />
            <div className="field">
              <Button type="submit" content="UPDATE" className="button--green-bg" />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }

  onChangePriority(priority) {
    this.props.accountSettingsActions.changePriority(priority);
  }

  publisherForm() {
    const { priority } = this.props.account;
    const { formatMessage } = this.props.intl;

    return (
      <div className="publisher-form">
        <div className="header">
          <p className="title">{formatMessage(messages.notPublisherYet)}</p>
          <p>
            {formatMessage(messages.publisherNeedInfo)}
          </p>
        </div>
        <Form onSubmit={this.onSubmit} className="mail-form-container">
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
            <Field
              type="text"
              name="country"
              placeholder={formatMessage(messages.country)}
              component="input"
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>City</span>
            <Field
              type="text"
              name="city"
              placeholder={formatMessage(messages.startTyping)}
              component="input"
              className="textfield"
            />
            <div className="col-1" />
          </div>
          <div className="form-group submit-group">
            <span />
            <div className="field">
              <Button type="submit" content={formatMessage(messages.apply)} className="button--green-bg" />
            </div>
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
  }),
  account: PropTypes.shape({
    priority: PropTypes.string,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

PrivateData.defaultProps = {
  accountSettingsActions: {},
  account: {},
  intl: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      accountSettingsActions: bindActionCreators({
        changePriority,
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'privateDataForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(PrivateData));
