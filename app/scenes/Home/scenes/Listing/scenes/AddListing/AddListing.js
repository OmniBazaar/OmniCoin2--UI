import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Image, Dropdown, Button, Grid } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import DatePicker from 'react-datepicker';
import hash from 'object-hash';

import Menu from '../../../Marketplace/scenes/Menu/Menu';
import CheckNormal from '../../../../images/ch-box-0-norm.svg';
import CheckPreNom from '../../../../images/ch-box-1-norm.svg';
import CalendarIcon from '../../../../images/icn-calendar.svg';
import AddIcon from '../../../../images/btn-add-image.svg';
import RemoveIcon from '../../../../images/btn-remove-image-norm+press.svg';

import {
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addImage,
  removeImage
} from '../../../../../../services/listing/listingActions';

import './add-listing.scss';

require('react-datepicker/dist/react-datepicker-cssmodules.css');

const iconSize = 42;
const iconSizeLarge = 23;
const iconSizeMedium = 20;
const iconSizeSmall = 15;

const messages = defineMessages({
  myListings: {
    id: 'MyListings.myListings',
    defaultMessage: 'My Listings'
  },
  createListing: {
    id: 'MyListings.createListing',
    defaultMessage: 'Create Listing'
  },
  primaryInfo: {
    id: 'MyListings.primaryInfo',
    defaultMessage: 'Primary Info'
  },
  importListings: {
    id: 'MyListings.importListings',
    defaultMessage: 'IMPORT LISTINGS'
  },
  listingTitle: {
    id: 'MyListings.listingTitle',
    defaultMessage: 'Listing Title'
  },
  pleaseEnter: {
    id: 'MyListings.pleaseEnter',
    defaultMessage: 'Please enter'
  },
  placing: {
    id: 'MyListings.placing',
    defaultMessage: 'Placing'
  },
  type: {
    id: 'MyListings.type',
    defaultMessage: 'Type'
  },
  category: {
    id: 'MyListings.category',
    defaultMessage: 'Category'
  },
  subCategory: {
    id: 'MyListings.subCategory',
    defaultMessage: 'Sub-category'
  },
  pricing: {
    id: 'MyListings.pricing',
    defaultMessage: 'Pricing'
  },
  currency: {
    id: 'MyListings.currency',
    defaultMessage: 'Currency'
  },
  pricePerItem: {
    id: 'MyListings.pricePerItem',
    defaultMessage: 'Price per item'
  },
  na: {
    id: 'MyListings.na',
    defaultMessage: 'N/A'
  },
  bitcoinPrice: {
    id: 'MyListings.bitcoinPrice',
    defaultMessage: 'Add Bitcoin Price'
  },
  omnicoinPrice: {
    id: 'MyListings.omnicoinPrice',
    defaultMessage: 'Add Omnicoin Price'
  },
  additionalInfo: {
    id: 'MyListings.additionalInfo',
    defaultMessage: 'Additional Info'
  },
  condition: {
    id: 'MyListings.condition',
    defaultMessage: 'Condition'
  },
  numberAvailable: {
    id: 'MyListings.numberAvailable',
    defaultMessage: 'Number Available'
  },
  unitsOfMeasure: {
    id: 'MyListings.unitsOfMeasure',
    defaultMessage: 'Units of Measure'
  },
  listingDates: {
    id: 'MyListings.listingDates',
    defaultMessage: 'Listing Dates'
  },
  optional: {
    id: 'MyListings.optional',
    defaultMessage: '(Optional)'
  },
  from: {
    id: 'MyListings.from',
    defaultMessage: 'From'
  },
  to: {
    id: 'MyListings.to',
    defaultMessage: 'To'
  },
  continuous: {
    id: 'MyListings.continuous',
    defaultMessage: 'continuous'
  },
  images: {
    id: 'MyListings.images',
    defaultMessage: 'Images'
  },
  listingImages: {
    id: 'MyListings.listingImages',
    defaultMessage: 'Listing Images'
  },
  description: {
    id: 'MyListings.description',
    defaultMessage: 'Description'
  },
  keywordsSearch: {
    id: 'MyListings.keywordsSearch',
    defaultMessage: 'Keywords for search engine'
  },
  keywordCommas: {
    id: 'MyListings.keywordCommas',
    defaultMessage: 'Keywords separated by commas'
  },
  owner: {
    id: 'MyListings.owner',
    defaultMessage: 'Owner'
  },
  ownerDetails: {
    id: 'MyListings.ownerDetails',
    defaultMessage: 'Owner Details'
  },
  ownerName: {
    id: 'MyListings.ownerName',
    defaultMessage: 'Owner Name'
  },
  preferredContact: {
    id: 'MyListings.preferredContact',
    defaultMessage: 'Preferred contact'
  },
  enterPreferredContact: {
    id: 'MyListings.enterPreferredContact',
    defaultMessage: 'Enter preferred contact'
  },
  location: {
    id: 'MyListings.location',
    defaultMessage: 'Location'
  },
  country: {
    id: 'MyListings.country',
    defaultMessage: 'Country'
  },
  address: {
    id: 'MyListings.address',
    defaultMessage: 'Address'
  },
  city: {
    id: 'MyListings.city',
    defaultMessage: 'City'
  },
  state: {
    id: 'MyListings.state',
    defaultMessage: 'State'
  },
  postalCode: {
    id: 'MyListings.postalCode',
    defaultMessage: 'Postal Code'
  },
  createListingCaps: {
    id: 'MyListings.createListingCaps',
    defaultMessage: 'CREATE LISTING'
  },
});

const placingTypeOptions = [
  {
    key: 'all',
    value: 'all',
    text: 'All'
  },
];

class AddListing extends Component {
  getBitcoinIcon() {
    return this.props.listing.bitcoinPrice ? CheckPreNom : CheckNormal;
  }

  getOmnicoinIcon() {
    return this.props.listing.omnicoinPrice ? CheckPreNom : CheckNormal;
  }

  getContinuousIcon() {
    return this.props.listing.isContinuous ? CheckPreNom : CheckNormal;
  }

  toggleBitcoinPrice = () => this.props.listingActions.setBitcoinPrice();
  toggleOmnicoinPrice = () => this.props.listingActions.setOmnicoinPrice();
  toggleContinuous = () => this.props.listingActions.setContinuous();

  onSubmit() {
    console.log('');
  }

  renderLabeledField = ({
    input, placeholder, buttonText
  }) => (
    <div className="hybrid-input">
      <input
        {...input}
        type="text"
        className="textfield"
        placeholder={placeholder}
      />
      <Button className="copy-btn button--gray-text">
        {buttonText}
      </Button>
    </div>
  );

  renderCalendarField = ({
    placeholder
  }) => (
    <div className="hybrid-input">
      <DatePicker
        placeholderText={placeholder}
        onChange={this.handleChange}
      />
      <Button className="copy-btn button--gray-text">
        <Image src={CalendarIcon} width={iconSizeSmall} height={iconSizeSmall} />
      </Button>
    </div>
  );

  onImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.props.listingActions.addImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onClickAddImage = () => {
    this.inputElement.click();
  };

  removeImage = (index) => {
    this.props.listingActions.removeImage(index);
  };

  addedImages() {
    const { addedImages } = this.props.listing;

    return addedImages.map((image, index) => (
      <div key={hash(image)} className="img-container">
        <Image src={RemoveIcon} width={iconSizeLarge} height={iconSizeLarge} className="remove-icon" onClick={() => this.removeImage(index)} />
        <img alt="" src={image} width={132} height={100} className="added-img" />
      </div>
    ));
  }

  addListingForm() {
    const { formatMessage } = this.props.intl;

    return (
      <Form className="add-listing-form">
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <span className="title">{formatMessage(messages.primaryInfo)}</span>
            </Grid.Column>
            <Grid.Column width={4} floated="right">
              <Button content={formatMessage(messages.importListings)} className="button--primary" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.listingTitle)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="text"
                name="listingTitle"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.pleaseEnter)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.placing)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.type)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.category)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.subCategory)}
                options={placingTypeOptions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.pricing)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.currency)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="pricePerItem"
                placeholder={formatMessage(messages.pricePerItem)}
                component={this.renderLabeledField}
                className="textfield"
                buttonText={formatMessage(messages.na)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <div className="check-form field">
                <div className="description">
                  <div className="check-container">
                    <Image src={this.getBitcoinIcon()} width={iconSizeMedium} height={iconSizeMedium} className="checkbox" onClick={this.toggleBitcoinPrice} />
                  </div>
                  <div className="description-text">
                    {formatMessage(messages.bitcoinPrice)}
                  </div>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div className="check-form field">
                <div className="description">
                  <div className="check-container">
                    <Image src={this.getOmnicoinIcon()} width={iconSizeMedium} height={iconSizeMedium} className="checkbox" onClick={this.toggleOmnicoinPrice} />
                  </div>
                  <div className="description-text">
                    {formatMessage(messages.omnicoinPrice)}
                  </div>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.additionalInfo)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.condition)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="numberAvailable"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.numberAvailable)}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.unitsOfMeasure)}
                options={placingTypeOptions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.listingDates)} {formatMessage(messages.optional)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="fromDate"
                placeholder={formatMessage(messages.from)}
                component={this.renderCalendarField}
                className="textfield"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="toDate"
                placeholder={formatMessage(messages.to)}
                component={this.renderCalendarField}
                className="textfield"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <div className="check-form field">
                <div className="description">
                  <div className="check-container">
                    <Image
                      src={this.getContinuousIcon()}
                      width={iconSizeMedium}
                      height={iconSizeMedium}
                      className="checkbox"
                      onClick={this.toggleContinuous}
                    />
                  </div>
                  <div className="description-text">
                    {formatMessage(messages.continuous)}
                  </div>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.images)}</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>
                {formatMessage(messages.listingImages)} {formatMessage(messages.optional)}
              </span>
            </Grid.Column>
            <Grid.Column width={12}>
              <input
                ref={(ref) => { this.inputElement = ref; }}
                type="file"
                onChange={this.onImageChange.bind(this)}
                className="filetype"
              />
              <div className="images-wrapper">
                {this.addedImages()}
                <Button className="add-img-button" onClick={() => this.onClickAddImage()}>
                  <Image src={AddIcon} width={iconSize} height={iconSize} />
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.description)}</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.keywordsSearch)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="text"
                name="keywords"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.keywordCommas)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>{formatMessage(messages.description)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="textarea"
                name="description"
                component="textarea"
                className="textfield"
                placeholder={formatMessage(messages.pleaseEnter)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.owner)}</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.ownerDetails)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="ownerName"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.ownerName)}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.preferredContact)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="preferredContactDetail"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.enterPreferredContact)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.location)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.country)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="address"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.address)}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="city"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.city)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.state)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="postalCode"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.postalCode)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Button content={formatMessage(messages.createListingCaps)} className="button--green-bg" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container category-listing add-listing">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                <div className="parent">
                  <span>{formatMessage(messages.myListings)}</span>
                  <Icon name="long arrow right" width={iconSize} height={iconSize} />
                </div>
                <span className="child">{formatMessage(messages.createListing)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            {this.addListingForm()}
          </div>
        </div>
      </div>
    );
  }
}

AddListing.propTypes = {
  listingActions: PropTypes.shape({
    setBitcoinPrice: PropTypes.func,
    setOmnicoinPrice: PropTypes.func,
    setContinuous: PropTypes.func,
    addImage: PropTypes.func,
    removeImage: PropTypes.func,
  }),
  listing: PropTypes.shape({
    bitcoinPrice: PropTypes.bool,
    omnicoinPrice: PropTypes.bool,
    isContinuous: PropTypes.bool,
    addedImages: PropTypes.arrayOf(PropTypes.string),
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

AddListing.defaultProps = {
  listingActions: {},
  listing: {},
  intl: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      listingActions: bindActionCreators({
        setBitcoinPrice,
        setOmnicoinPrice,
        setContinuous,
        addImage,
        removeImage
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'addListingForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(AddListing));
