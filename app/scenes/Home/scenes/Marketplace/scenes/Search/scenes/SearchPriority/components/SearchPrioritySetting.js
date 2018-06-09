import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import cn from 'classnames';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';

import Radio from '../../../../../../../../../components/Radio/Radio';
import TagsInput from '../../../../../../../../../components/TagsInput';
import PriorityTypes from '../../../../../../../../../common/SearchPriorityType';
import {
  changePriority,
  changeCountry,
  changeCity,
  changePublisherName,
  changeKeywords,
  updatePublisherData,
  getPublishers
} from '../../../../../../../../../services/accountSettings/accountActions';
import { dhtConnect } from '../../../../../../../../../services/search/dht/dhtActions';
import './search-priority-setting.scss';
import DHTConnector from '../../../../../../../../../utils/dht-connector';

const messages = defineMessages({
  specificLocation: {
    id: 'SearchPrioritySetting.specificLocation',
    defaultMessage: 'Specific Location'
  },
  anywhere: {
    id: 'SearchPrioritySetting.anywhere',
    defaultMessage: 'Anywhere'
  },
  publisherName: {
    id: 'SearchPrioritySetting.publisherName',
    defaultMessage: 'Specific Publisher'
  },
  country: {
    id: 'SearchPrioritySetting.country',
    defaultMessage: 'Country'
  },
  city: {
    id: 'SearchPrioritySetting.city',
    defaultMessage: 'City'
  },
  updateSuccess: {
    id: 'SearchPrioritySetting.updateSuccess',
    defaultMessage: 'Successfully updated'
  },
  update: {
    id: 'SearchPrioritySetting.update',
    defaultMessage: 'Update'
  },
  publisherPlaceholder: {
    id: 'SearchPrioritySetting.publisherPlaceholder',
    defaultMessage: 'Select publisher...'
  },
  publisher: {
    id: 'SearchPrioritySetting.publisher',
    defaultMessage: 'Publisher'
  },
  searchPriority: {
    id: 'SearchPrioritySetting.searchPriority',
    defaultMessage: 'Search Priority'
  },
  keywords: {
    id: 'SearchPrioritySetting.keywords',
    defaultMessage: 'Keywords for listing your want to see'
  },
  addKeyword: {
    id: 'SearchPrioritySetting.addKeyword',
    defaultMessage: 'Add keyword'
  },
  keywordLabel: {
    id: 'SearchPrioritySetting.keywordLabel',
    defaultMessage: 'Keywords'
  },
  apply: {
    id: 'SearchPrioritySetting.apply',
    defaultMessage: 'APPLY'
  },
});

class SearchPrioritySetting extends Component {
  constructor(props) {
    super(props);

    this.publishers = [];

    this.onChangePriority = this.onChangePriority.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeKeywords = this.onChangeKeywords.bind(this);
    this.onChangePublisherName = this.onChangePublisherName.bind(this);
    this.submitPublisherData = this.submitPublisherData.bind(this);
  }

  componentWillMount() {
    this.props.accountSettingsActions.getPublishers();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.account.publishers.loading && this.props.account.publishers.loading) {
      this.publishers = nextProps.account.publishers.publishers.map(publisher => ({
        value: publisher,
        text: publisher.name,
        key: publisher.name,
      }));
    }
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

  onChangeKeywords(keywords) {
    this.props.accountSettingsActions.changeKeywords(keywords);
  }

  onChangePublisherName(e, data) {
    this.props.accountSettingsActions.changePublisherName(data.value);
    DHTConnector.disconnect();
    this.props.dhtActions.dhtConnect();
  }

  submitPublisherData() {
    const { formatMessage } = this.props.intl;

    this.props.accountSettingsActions.updatePublisherData(this.props.account.publisherData);
    toastr.success(formatMessage(messages.update), formatMessage(messages.updateSuccess));
  }

  renderPublisherFormFields() {
    const { publisherData, publishers } = this.props.account;
    const { formatMessage } = this.props.intl;

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
                defaultOptionLabel=""
                blankOptionLabel=""
                classes="ui dropdown textfield"
                onChange={this.onChangeCity}
              />
              <div className="col-1" />
            </div>
          </div>
        );
      case PriorityTypes.BY_CATEGORY:
        let keywords = publisherData.keywords;
        if (!keywords) keywords = [];
        return (
          <div className="form-group keyword-container" key="category">
            <span>{formatMessage(messages.keywordLabel)}</span>
            <TagsInput
              value={keywords}
              inputProps={{
                className: cn('react-tagsinput-input', { empty: !keywords.length }),
                placeholder: (
                  formatMessage(!keywords.length ? messages.keywords : messages.addKeyword)
                )
              }}
              onChange={this.onChangeKeywords.bind(this)}
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
              options={this.publishers.length && this.publishers}
              onChange={this.onChangePublisherName}
            />
            <div className="col-1" />
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const { publisherData } = this.props.account;
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;

    return (
      <div className="search-priority-setting">
        <Form onSubmit={handleSubmit(this.submitPublisherData)} className="mail-form-container">
          <div className="form-group publisher-container">
            <span>{formatMessage(messages.searchPriority)}</span>
            <div className="radios-container">
              <div className="radio-wrapper">
                <Radio
                  width={20}
                  height={20}
                  value={PriorityTypes.LOCAL_DATA}
                  checked={publisherData.priority === PriorityTypes.LOCAL_DATA}
                  onChecked={this.onChangePriority}
                />
                <span className="checkbox-inline">{formatMessage(messages.specificLocation)}</span>
              </div>

              <div className="radio-wrapper">
                <Radio
                  width={20}
                  height={20}
                  value={PriorityTypes.BY_CATEGORY}
                  checked={publisherData.priority === PriorityTypes.BY_CATEGORY}
                  onChecked={this.onChangePriority}
                />
                <span className="checkbox-inline">{formatMessage(messages.anywhere)}</span>
              </div>

              <div className="radio-wrapper">
                <Radio
                  width={20}
                  height={20}
                  value={PriorityTypes.PUBLISHER}
                  checked={publisherData.priority === PriorityTypes.PUBLISHER}
                  onChecked={this.onChangePriority}
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
}


SearchPrioritySetting.propTypes = {
  accountSettingsActions: PropTypes.shape({
    changePriority: PropTypes.func,
    changeCountry: PropTypes.func,
    changeCity: PropTypes.func,
    changePublisherName: PropTypes.func,
    getPublishers: PropTypes.func,
    updatePublisherData: PropTypes.func
  }).isRequired,
  dhtActions: PropTypes.shape({
    dhtConnect: PropTypes.func,
  }),
  account: PropTypes.shape({
    priority: PropTypes.string,
    publisherData: PropTypes.shape({}),
    publishers: PropTypes.object,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  handleSubmit: PropTypes.func.isRequired
};

SearchPrioritySetting.defaultProps = {
  dhtActions: {},
  account: {},
  intl: {},
};

export default compose(
  connect(
    state => ({
      ...state.default
    }),
    (dispatch) => ({
      accountSettingsActions: bindActionCreators({
        changePriority,
        changeCountry,
        changeCity,
        changeKeywords,
        changePublisherName,
        getPublishers,
        updatePublisherData
      }, dispatch),
      dhtActions: bindActionCreators({
        dhtConnect,
      }, dispatch),
    })
  ),
  reduxForm({
    form: 'searchPriorityForm',
    destroyOnUnmount: true,
  })
)(injectIntl(SearchPrioritySetting));
