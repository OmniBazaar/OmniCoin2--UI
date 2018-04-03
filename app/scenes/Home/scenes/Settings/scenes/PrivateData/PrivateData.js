import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import {
  changePriority,
  changeCountry,
  changeCity,
  changePublisherName,
  changeCategory,
  updatePrivateData,
  updatePublisherData,
  getPublishers
} from '../../../../../../services/accountSettings/accountActions';

import { getCategories } from '../../../../../../services/marketplace/marketplaceActions';

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
  },
  categoriesPlaceholder: {
    id: 'PrivateData.categoriesPlaceholder',
    defaultMessage: 'Select category...'
  },
  category: {
    id: 'PrivateData.category',
    defaultMessage: 'Category'
  },
  publisherPlaceholder: {
    id: 'PrivateData.publisherPlaceholder',
    defaultMessage: 'Select publisher...'
  },
  publisher: {
    id: 'PrivateData.publisher',
    defaultMessage: 'Publisher'
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
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangePublisherName = this.onChangePublisherName.bind(this);
    this.submitPrivateData = this.submitPrivateData.bind(this);
    this.submitPublisherData = this.submitPublisherData.bind(this);
    this.privateDataForm = this.privateDataForm.bind(this);
    this.publisherForm = this.publisherForm.bind(this);
  }

  componentWillMount() {
    this.props.marketplaceActions.getCategories();
    this.props.accountSettingsActions.getPublishers();
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

  onChangePriority(priority) {
    this.props.accountSettingsActions.changePriority(priority);
  }

  onChangeCountry(country) {
    this.props.accountSettingsActions.changeCountry(country);
  }

  onChangeCity(city) {
    this.props.accountSettingsActions.changeCity(city);
  }

  onChangeCategory(e, data) {
    this.props.accountSettingsActions.changeCategory(data.value);
  }

  onChangePublisherName(e, data) {
    this.props.accountSettingsActions.changePublisherName(data.value);
  }

  submitPublisherData() {
    const { formatMessage } = this.props.intl;
    this.props.accountSettingsActions.updatePublisherData(this.props.account.publisherData);
    toastr.success(formatMessage(messages.update), formatMessage(messages.updateSuccess));
  }

  renderPublisherFormFields() {
    const { publisherData, publishers } = this.props.account;
    const { formatMessage } = this.props.intl;
    const categoriesKeys = Object.keys(this.props.marketplace.categories);
    switch (publisherData.priority) {
      case PriorityTypes.LOCAL_DATA:
        return (
          <div>
            <div className="form-group">
              <span>{formatMessage(messages.country)}</span>
              <CountryDropdown
                value={publisherData.country}
                classes="ui dropdown textfield"
                onChange={this.onChangeCountry}
              />
              <div className="col-1" />
            </div>
            <div className="form-group">
              <span>{formatMessage(messages.city)}</span>
              <RegionDropdown
                country={publisherData.country}
                value={publisherData.city}
                classes="ui dropdown textfield"
                onChange={this.onChangeCity}
              />
              <div className="col-1" />
            </div>
          </div>
        );
      case PriorityTypes.BY_CATEGORY:
        return (
          <div className="form-group" key="category">
            <span>{formatMessage(messages.category)}</span>
            <Dropdown
              placeholder={formatMessage(messages.categoriesPlaceholder)}
              defaultValue={publisherData.category}
              fluid
              selection
              options={categoriesKeys.map(el => ({
                  key: el,
                  value: el,
                  text: formatMessage(this.props.marketplace.categories[el]),
              }))}
              onChange={this.onChangeCategory}
            />
            <div className="col-1" />
          </div>
        );
      case PriorityTypes.PUBLISHER:
        return (
          <div className="form-group" key="publisher">
            <span>{formatMessage(messages.publisherName)}</span>
            <Dropdown
              placeholder={formatMessage(messages.publisherPlaceholder)}
              defaultValue={publisherData.publisherName}
              loading={publishers.loading}
              fluid
              selection
              options={publishers.names.map(el => ({
                  key: el,
                  value: el,
                  text: el
                }))}
              onChange={this.onChangePublisherName}
            />
            <div className="col-1" />
          </div>
        );
      default:
        return null;
    }
  }

  publisherForm() {
    const { publisherData } = this.props.account;
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
                  checked={publisherData.priority === PriorityTypes.LOCAL_DATA}
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
                  checked={publisherData.priority === PriorityTypes.BY_CATEGORY}
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
                  checked={publisherData.priority === PriorityTypes.PUBLISHER}
                  value={PriorityTypes.PUBLISHER}
                />
                <span className="checkbox-inline">{formatMessage(messages.publisherName)}</span>
              </div>
            </div>
            <div className="col-1" />
          </div>
          {this.renderPublisherFormFields()}
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
        {!this.props.auth.account.get('is_a_publisher') && this.publisherForm()}
      </div>
    );
  }
}

PrivateData.propTypes = {
  accountSettingsActions: PropTypes.shape({
    changePriority: PropTypes.func,
    changeCountry: PropTypes.func,
    changeCity: PropTypes.func,
    changeCategory: PropTypes.func,
    changePublisherName: PropTypes.func,
    updatePrivateData: PropTypes.func,
    updatePublisherData: PropTypes.func,
    getPublishers: PropTypes.func
  }).isRequired,
  marketplaceActions: PropTypes.shape({
    getCategories: PropTypes.func
  }).isRequired,
  account: PropTypes.shape({
    priority: PropTypes.string,
    publisherData: PropTypes.shape({}),
    publishers: PropTypes.array,
  }),
  marketplace: PropTypes.shape({
    categories: PropTypes.array
  }).isRequired,
  auth: PropTypes.shape({
    account: PropTypes.shape({
      get: PropTypes.func
    })
  }).isRequired,
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
        changeCountry,
        changeCity,
        changeCategory,
        changePublisherName,
        updatePrivateData,
        updatePublisherData,
        getPublishers
      }, dispatch),
      marketplaceActions: bindActionCreators({
        getCategories
      }, dispatch)
    }),
  ),
  reduxForm({
    form: 'privateDataForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(PrivateData));
