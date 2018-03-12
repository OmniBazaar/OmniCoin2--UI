import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { changePriority } from '../../../../../services/accountSettings/accountActions';
import '../settings.scss';

const iconSize = 20;
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
            <label>Email</label>
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
            <label>First Name</label>
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
            <label>Last Name</label>
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
            <label>Website</label>
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
            <label />
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
    console.log(priority);
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
            <label>Search Priority</label>
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
                <label className="checkbox-inline">{formatMessage(messages.localArea)}</label>
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
                <label className="checkbox-inline">{formatMessage(messages.byCategoryType)}</label>
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
                <label className="checkbox-inline">{formatMessage(messages.publisherName)}</label>
              </div>
            </div>
            <div className="col-1" />
          </div>
          <div className="form-group">
            <label>{formatMessage(messages.country)}</label>
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
            <label>City</label>
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
            <label />
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

PrivateData = reduxForm({
  form: 'privateDataForm',
  destroyOnUnmount: true,
})(PrivateData);

PrivateData.propTypes = {
  accountSettingsActions: PropTypes.shape({
    changePriority: PropTypes.func,
  }),
  account: PropTypes.shape({
    priority: PropTypes.string,
  })
};

PrivateData.defaultProps = {
  accountSettingsActions: {},
  account: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    accountSettingsActions: bindActionCreators({
      changePriority,
    }, dispatch),
  }),
)(injectIntl(PrivateData));
