import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import cn from 'classnames';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import _ from 'lodash';

import Radio from '../../../../../../../../../components/Radio/Radio';
import TagsInput from '../../../../../../../../../components/TagsInput';
import PriorityTypes from '../../../../../../../../../common/SearchPriorityType';
import {
  changePriority,
  changeCountry,
  changeState,
  changeCity,
  changePublisherName,
  changeKeywords,
  updatePublisherData,
  getPublishers,
  getPublisherData
} from '../../../../../../../../../services/accountSettings/accountActions';
import { searchPublishers } from '../../../../../../../../../services/listing/listingActions';
import { dhtReconnect } from '../../../../../../../../../services/search/dht/dhtActions';
import './search-priority-setting.scss';

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
    defaultMessage: 'Publisher'
  },
  country: {
    id: 'SearchPrioritySetting.country',
    defaultMessage: 'Country'
  },
  state: {
    id: 'SearchPrioritySetting.state',
    defaultMessage: 'State'
  },
  city: {
    id: 'SearchPrioritySetting.city',
    defaultMessage: 'City'
  },
  updateSuccess: {
    id: 'SearchPrioritySetting.updateSuccess',
    defaultMessage: 'Update'
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
    defaultMessage: 'Keywords for listings that you want to see'
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

    this.state = {
      publishers: [],
      loading: true,
      isSubmitting: false,
    };

    this.onChangePriority = this.onChangePriority.bind(this);
    this.onChangeState = this.onChangeState.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeKeywords = this.onChangeKeywords.bind(this);
    this.onChangePublisherName = this.onChangePublisherName.bind(this);
    this.submitPublisherData = this.submitPublisherData.bind(this);
  }

  componentWillMount() {
    if (!this.props.allPublishers.loading) {
      this.props.listingActions.searchPublishers();
    }
    this.props.accountSettingsActions.getPublisherData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.allPublishers.loading && !nextProps.allPublishers.loading) {
      this.props.listingActions.searchPublishers();
    }
    if (!nextProps.publishers.searching && this.props.publishers.searching) {
      this.setState({ loading: false });
      if (!nextProps.publishers.error) {
        const publishers = nextProps.publishers.publishers.map(publisher => {
          const publisherFee = publisher.publisher_fee ? `(${parseInt(publisher.publisher_fee) / 100}% Fee)` : '';
          const listingCount = publisher.listingCount ? `(${publisher.listingCount})` : '';

          return {
            value: publisher,
            text: publisher.name + ` ${publisherFee} ${listingCount}`,
            key: publisher.name
          }
        });
        this.setState({
          publishers
        });
      } else {
        const { formatMessage } = this.props.intl;
        this.showErrorToast(
          formatMessage(messages.error),
          formatMessage(messages.searchPublishersErrorMessage)
        );
      }
    }

    const { formatMessage } = this.props.intl;

    if (this.state.isSubmitting && !nextProps.dht.isConnecting && this.props.dht.isConnecting) {
      this.setState({ isSubmitting: false });
      toastr.success(formatMessage(messages.update), formatMessage(messages.updateSuccess));
    }
  }

  onChangePriority(priority) {
    this.props.accountSettingsActions.changePriority(priority);
  }

  onChangeCountry(country) {
    if (!country) {
      this.props.accountSettingsActions.changeState('');
      this.props.accountSettingsActions.changeCity('');
    }
    this.props.accountSettingsActions.changeCountry(country);
  }

  onChangeState(state) {
    this.props.accountSettingsActions.changeState(state);
  }

  onChangeCity(e) {
    this.props.accountSettingsActions.changeCity(e.target.value);
  }

  onChangeKeywords(keywords) {
    this.props.accountSettingsActions.changeKeywords(keywords);
  }

  onChangePublisherName(e, data) {
    this.props.accountSettingsActions.changePublisherName(data.value);
  }

  submitPublisherData() {
    const { publisherData } = this.props.account;

    this.setState({ isSubmitting: true });

    this.props.accountSettingsActions.updatePublisherData(publisherData);
    this.props.dhtActions.dhtReconnect();
  }

  renderLocalDataOptions() {
    const { publisherData } = this.props.account;
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <div className="form-group">
          <span>{formatMessage(messages.country)}*</span>
          <CountryDropdown
            value={publisherData.country}
            classes="ui dropdown textfield"
            onChange={this.onChangeCountry}
          />
          <div className="col-1" />
        </div>
        <div className="form-group">
          <span>{formatMessage(messages.state)}</span>
          <RegionDropdown
            country={publisherData.country}
            value={publisherData.state}
            defaultOptionLabel=""
            blankOptionLabel=""
            classes="ui dropdown textfield"
            onChange={this.onChangeState}
          />
          <div className="col-1" />
        </div>
        <div className="form-group">
          <span>{formatMessage(messages.city)}</span>
          <input
            type="text"
            className="textfield"
            value={publisherData.city}
            onChange={this.onChangeCity}
          />
          <div className="col-1" />
        </div>
      </div>
    );
  }

  renderCategoryOptions() {
    const { publisherData } = this.props.account;
    const { formatMessage } = this.props.intl;

    let { keywords } = publisherData;

    if (!keywords) keywords = [];

    return (
      <div className="form-group keyword-container" key="category">
        <span>{formatMessage(messages.keywordLabel)}*</span>
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
  }

  renderPublisherOptions() {
    const { publisherData } = this.props.account;
    const { formatMessage } = this.props.intl;


    return (
      <div className="form-group" key="publisher">
        <span>{formatMessage(messages.publisherName)}*</span>
        <Dropdown
          placeholder={formatMessage(messages.publisherPlaceholder)}
          defaultValue={publisherData.publisherName}
          loading={this.state.loading}
          fluid
          selection
          options={this.state.publishers}
          onChange={this.onChangePublisherName}
        />
        <div className="col-1" />
      </div>
    );
  }

  renderPublisherFormFields() {
    const { publisherData } = this.props.account;

    switch (publisherData.priority) {
      case PriorityTypes.LOCAL_DATA:
        return this.renderLocalDataOptions();
      case PriorityTypes.BY_CATEGORY:
        return this.renderCategoryOptions();
      case PriorityTypes.PUBLISHER:
        return this.renderPublisherOptions();
      default:
        return null;
    }
  }

  render() {
    const { publisherData } = this.props.account;
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { isConnecting } = this.props.dht;

    const noCategoryIsSelected = publisherData.priority === 'category' && !publisherData.keywords.length;
    const noPublisherIsSelected = publisherData.priority === 'publisher' && !publisherData.publisherName;
    const noCountryIsSelected = publisherData.priority === 'local' && !publisherData.country;
    const isDisabled = noCategoryIsSelected || noPublisherIsSelected || noCountryIsSelected;

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
          <div style={{ marginBottom: '5px' }}>
            {this.renderPublisherFormFields()}
          </div>
          <div className="form-group">
            <span />
            <Button
              type="submit"
              content={formatMessage(messages.apply)}
              className="button--green-bg"
              loading={this.state.isSubmitting}
              disabled={isDisabled}
            />
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
    changeCity: PropTypes.func,
    changeState: PropTypes.func,
    changeCountry: PropTypes.func,
    changeKeywords: PropTypes.func,
    changePriority: PropTypes.func,
    changePublisherName: PropTypes.func,
    getPublishers: PropTypes.func,
    getPublisherData: PropTypes.func,
    updatePublisherData: PropTypes.func
  }).isRequired,
  dhtActions: PropTypes.shape({
    dhtReconnect: PropTypes.func,
  }),
  account: PropTypes.shape({
    priority: PropTypes.string,
    publisherData: PropTypes.shape({}),
    publishers: PropTypes.object,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  handleSubmit: PropTypes.func.isRequired,
  dht: PropTypes.shape({
    isConnecting: PropTypes.bool,
  }),
  listingActions: PropTypes.shape({
    searchPublishers: PropTypes.func
  }),
  publishers: PropTypes.shape({
    publishers: PropTypes.array,
    searching: PropTypes.bool,
    error: PropTypes.object
  }).isRequired,
  allPublishers: PropTypes.shape({
    loading: PropTypes.bool
  })
};

SearchPrioritySetting.defaultProps = {
  dhtActions: {},
  account: {},
  intl: {},
  dht: {
    isConnecting: false,
  }
};

export default compose(
  connect(
    state => ({
      ...state.default,
      publishers: state.default.listing.publishers,
      allPublishers: state.default.listing.allPublishers
    }),
    (dispatch) => ({
      accountSettingsActions: bindActionCreators({
        changePriority,
        changeCountry,
        changeState,
        changeCity,
        changeKeywords,
        changePublisherName,
        getPublishers,
        updatePublisherData,
        getPublisherData
      }, dispatch),
      dhtActions: bindActionCreators({
        dhtReconnect,
      }, dispatch),
      listingActions: bindActionCreators({
        searchPublishers
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'searchPriorityForm',
    destroyOnUnmount: true,
  })
)(injectIntl(SearchPrioritySetting));
