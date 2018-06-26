import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import SearchPrioritySetting from '../../../Marketplace/scenes/Search/scenes/SearchPriority/components/SearchPrioritySetting';

import { updatePrivateData } from '../../../../../../services/accountSettings/accountActions';

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
  updateSuccess: {
    id: 'PrivateData.updateSuccess',
    defaultMessage: 'Successfully updated'
  },
  update: {
    id: 'PrivateData.update',
    defaultMessage: 'Update'
  },
  email: {
    id: 'PrivateData.email',
    defaultMessage: 'Email'
  },
  firstName: {
    id: 'PrivateData.firstName',
    defaultMessage: 'First name'
  },
  lastName: {
    id: 'PrivateData.lastName',
    defaultMessage: 'Last name'
  },
  website: {
    id: 'PrivateData.website',
    defaultMessage: 'Website'
  }
});

class PrivateData extends Component {
  constructor(props) {
    super(props);


    this.submitPrivateData = this.submitPrivateData.bind(this);
    this.privateDataForm = this.privateDataForm.bind(this);
    this.publisherForm = this.publisherForm.bind(this);
  }

  submitPrivateData(values) {
    const { formatMessage } = this.props.intl;
    this.props.accountSettingsActions.updatePrivateData(values);
    toastr.success(formatMessage(messages.update), formatMessage(messages.updateSuccess));
  }

  privateDataForm() {
    const { handleSubmit } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="private-form">
        <Form onSubmit={handleSubmit(this.submitPrivateData)} className="mail-form-container">
          <div className="form-group">
            <span>{formatMessage(messages.email)}</span>
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
            <span>{formatMessage(messages.firstName)}</span>
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
            <span>{formatMessage(messages.lastName)}</span>
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
            <span>{formatMessage(messages.website)}</span>
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

  publisherForm() {
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
        <SearchPrioritySetting />
      </div>
    );
  }

  render() {
    return (
      <div className="private-data">
        {this.privateDataForm()}
        {!this.props.auth.account.is_a_publisher && this.publisherForm()}
      </div>
    );
  }
}

PrivateData.propTypes = {
  accountSettingsActions: PropTypes.shape({
    updatePrivateData: PropTypes.func
  }).isRequired,
  auth: PropTypes.shape({
    account: PropTypes.shape({
      get: PropTypes.func,
      is_a_publisher: PropTypes.bool
    })
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  handleSubmit: PropTypes.func.isRequired
};

PrivateData.defaultProps = {
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
        updatePrivateData
      }, dispatch)
    }),
  ),
  reduxForm({
    form: 'privateDataForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(PrivateData));
