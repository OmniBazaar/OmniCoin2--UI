import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Image, Dropdown, Button, Grid, Modal } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import DatePicker from 'react-datepicker';
import hash from 'object-hash';
import { NavLink } from 'react-router-dom';

import Checkbox from '../../../../../../../../components/Checkbox/Checkbox';
import { getFileExtension } from '../../../../../../../../utils/file';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import CalendarIcon from '../../../../../../images/icn-calendar.svg';
import AddIcon from '../../../../../../images/btn-add-image.svg';
import RemoveIcon from '../../../../../../images/btn-remove-image-norm+press.svg';
import CategoryDropdown from './components/CategoryDropdown';
import SubCategoryDropdown from './components/SubCategoryDropdown';
import CurrencyDropdown from './components/CurrencyDropdown';
import ConditionDropdown from './components/ConditionDropdown';
import UnitDropdown from './components/UnitDropdown';
import ContactDropdown from './components/ContactDropdown';
import CountryDropdown from './components/CountryDropdown';
import StateDropdown from './components/StateDropdown';

import {
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addImage,
  removeImage
} from '../../../../../../../../services/listing/listingActions';

import './add-listing.scss';

require('react-datepicker/dist/react-datepicker-cssmodules.css');

const iconSize = 42;
const iconSizeLarge = 23;
const iconSizeMedium = 20;
const iconSizeSmall = 15;

const messages = defineMessages({
  myListings: {
    id: 'AddListing.myListings',
    defaultMessage: 'My Listings'
  },
  createListing: {
    id: 'AddListing.createListing',
    defaultMessage: 'Create Listing'
  },
  primaryInfo: {
    id: 'AddListing.primaryInfo',
    defaultMessage: 'Primary Info'
  },
  importListings: {
    id: 'AddListing.importListings',
    defaultMessage: 'IMPORT LISTINGS'
  },
  listingTitle: {
    id: 'AddListing.listingTitle',
    defaultMessage: 'Listing Title'
  },
  pleaseEnter: {
    id: 'AddListing.pleaseEnter',
    defaultMessage: 'Please enter'
  },
  placing: {
    id: 'AddListing.placing',
    defaultMessage: 'Placing'
  },
  type: {
    id: 'AddListing.type',
    defaultMessage: 'Type'
  },
  category: {
    id: 'AddListing.category',
    defaultMessage: 'Category'
  },
  subCategory: {
    id: 'AddListing.subCategory',
    defaultMessage: 'Sub-category'
  },
  pricing: {
    id: 'AddListing.pricing',
    defaultMessage: 'Pricing'
  },
  currency: {
    id: 'AddListing.currency',
    defaultMessage: 'Currency'
  },
  pricePerItem: {
    id: 'AddListing.pricePerItem',
    defaultMessage: 'Price per item'
  },
  na: {
    id: 'AddListing.na',
    defaultMessage: 'N/A'
  },
  bitcoinPrice: {
    id: 'AddListing.bitcoinPrice',
    defaultMessage: 'Add Bitcoin Price'
  },
  omnicoinPrice: {
    id: 'AddListing.omnicoinPrice',
    defaultMessage: 'Add Omnicoin Price'
  },
  additionalInfo: {
    id: 'AddListing.additionalInfo',
    defaultMessage: 'Additional Info'
  },
  condition: {
    id: 'AddListing.condition',
    defaultMessage: 'Condition'
  },
  numberAvailable: {
    id: 'AddListing.numberAvailable',
    defaultMessage: 'Number Available'
  },
  unitsOfMeasure: {
    id: 'AddListing.unitsOfMeasure',
    defaultMessage: 'Units of Measure'
  },
  listingDates: {
    id: 'AddListing.listingDates',
    defaultMessage: 'Listing Dates'
  },
  optional: {
    id: 'AddListing.optional',
    defaultMessage: '(Optional)'
  },
  from: {
    id: 'AddListing.from',
    defaultMessage: 'From'
  },
  to: {
    id: 'AddListing.to',
    defaultMessage: 'To'
  },
  continuous: {
    id: 'AddListing.continuous',
    defaultMessage: 'continuous'
  },
  images: {
    id: 'AddListing.images',
    defaultMessage: 'Images'
  },
  listingImages: {
    id: 'AddListing.listingImages',
    defaultMessage: 'Listing Images'
  },
  description: {
    id: 'AddListing.description',
    defaultMessage: 'Description'
  },
  keywordsSearch: {
    id: 'AddListing.keywordsSearch',
    defaultMessage: 'Keywords for search engine'
  },
  keywordCommas: {
    id: 'AddListing.keywordCommas',
    defaultMessage: 'Keywords separated by commas'
  },
  owner: {
    id: 'AddListing.owner',
    defaultMessage: 'Owner'
  },
  ownerDetails: {
    id: 'AddListing.ownerDetails',
    defaultMessage: 'Owner Details'
  },
  ownerName: {
    id: 'AddListing.ownerName',
    defaultMessage: 'Owner Name'
  },
  preferredContact: {
    id: 'AddListing.preferredContact',
    defaultMessage: 'Preferred contact'
  },
  enterPreferredContact: {
    id: 'AddListing.enterPreferredContact',
    defaultMessage: 'Enter preferred contact'
  },
  location: {
    id: 'AddListing.location',
    defaultMessage: 'Location'
  },
  country: {
    id: 'AddListing.country',
    defaultMessage: 'Country'
  },
  address: {
    id: 'AddListing.address',
    defaultMessage: 'Address'
  },
  city: {
    id: 'AddListing.city',
    defaultMessage: 'City'
  },
  state: {
    id: 'AddListing.state',
    defaultMessage: 'State'
  },
  postalCode: {
    id: 'AddListing.postalCode',
    defaultMessage: 'Postal Code'
  },
  createListingCaps: {
    id: 'AddListing.createListingCaps',
    defaultMessage: 'CREATE LISTING'
  },
  warning: {
    id: 'AddListing.warning',
    defaultMessage: 'Warning'
  },
  ok: {
    id: 'AddListing.ok',
    defaultMessage: 'Ok'
  },
  onlyImagesMsg: {
    id: 'AddListing.onlyImagesMsg',
    defaultMessage: 'Only jpg/jpeg and png files are allowed.'
  },
});

const placingTypeOptions = [
  {
    key: 'all',
    value: 'all',
    text: 'All'
  },
];

const contactOmniMessage = 'OmniMessage';

class AddListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleBitcoinPrice = () => this.props.listingActions.setBitcoinPrice();
  toggleOmnicoinPrice = () => this.props.listingActions.setOmnicoinPrice();
  toggleContinuous = () => this.props.listingActions.setContinuous();

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

  componentWillMount() {
    this.props.initialize({
      contact_type: contactOmniMessage,
      contact_info: this.props.auth.currentUser.username
    });
  }

  onImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const extFile = getFileExtension(event);

      if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
        reader.onload = (e) => {
          this.props.listingActions.addImage(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  onContactTypeChange(e, newValue) {
    let contactInfo = '';
    if (newValue === contactOmniMessage) {
      contactInfo = this.props.auth.currentUser.username;
    }

    this.props.formActions.change('contact_info', contactInfo);
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

    const { category, country } = this.props.formValues ? this.props.formValues : {};

    return (
      <Form className="add-listing-form">
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <span className="title">{formatMessage(messages.primaryInfo)}</span>
            </Grid.Column>
            <Grid.Column width={4} floated="right">
              <NavLink to="/import-listings">
                <Button content={formatMessage(messages.importListings)} className="button--primary" />
              </NavLink>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.listingTitle)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="text"
                name="listing_title"
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
            <Grid.Column width={6}>
              <Field
                name='category'
                component={CategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.category)
                }}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Field
                name='subcategory'
                component={SubCategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.subCategory),
                  parentCategory: category
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.pricing)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name='currency'
                component={CurrencyDropdown}
                props={{
                  placeholder: formatMessage(messages.currency)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="price"
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
                  <Checkbox
                    width={iconSizeMedium}
                    height={iconSizeMedium}
                    onChecked={this.toggleBitcoinPrice}
                  />
                  <div className="description-text">
                    {formatMessage(messages.bitcoinPrice)}
                  </div>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              <div className="check-form field">
                <div className="description">
                  <Checkbox
                    width={iconSizeMedium}
                    height={iconSizeMedium}
                    onChecked={this.toggleOmnicoinPrice}
                  />
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
              <Field
                name='condition'
                component={ConditionDropdown}
                props={{
                  placeholder: formatMessage(messages.condition)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="quantity"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.numberAvailable)}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name='units'
                component={UnitDropdown}
                props={{
                  placeholder: formatMessage(messages.unitsOfMeasure)
                }}
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
                name="start_date"
                placeholder={formatMessage(messages.from)}
                component={this.renderCalendarField}
                className="textfield"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="end_date"
                placeholder={formatMessage(messages.to)}
                component={this.renderCalendarField}
                className="textfield"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <div className="check-form field">
                <div className="description">
                  <Checkbox
                    width={iconSizeMedium}
                    height={iconSizeMedium}
                    onChecked={this.toggleContinuous}
                  />
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
                accept="image/*"
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
                name="name"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.ownerName)}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name='contact_type'
                component={ContactDropdown}
                onChange={this.onContactTypeChange.bind(this)}
                props={{
                  placeholder: formatMessage(messages.preferredContact)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="contact_info"
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
              <Field
                name='country'
                component={CountryDropdown}
                props={{
                  placeholder: formatMessage(messages.country)
                }}
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
              <Field
                name='state'
                component={StateDropdown}
                props={{
                  placeholder: formatMessage(messages.state),
                  country
                }}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="post_code"
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

  closeWarning() {
    this.setState({ open: false });
  }

  showWarningMessage() {
    const { formatMessage } = this.props.intl;

    return (
      <Modal size="mini" open={this.state.open} onClose={() => this.closeWarning()}>
        <Modal.Header>
          {formatMessage(messages.warning)}
        </Modal.Header>
        <Modal.Content>
          <p className="modal-content">{formatMessage(messages.onlyImagesMsg)}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={() => this.closeWarning()}>
            {formatMessage(messages.ok)}
          </Button>
        </Modal.Actions>
      </Modal>
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
        {this.showWarningMessage()}
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
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string
    })
  })
};

AddListing.defaultProps = {
  listingActions: {},
  listing: {},
  intl: {},
  auth: {}
};

export default compose(
  reduxForm({
    form: 'addListingForm',
    destroyOnUnmount: true,
  }),
  connect(
    state => ({
      ...state.default,
      formValues: getFormValues('addListingForm')(state)
    }),
    (dispatch) => ({
      listingActions: bindActionCreators({
        setBitcoinPrice,
        setOmnicoinPrice,
        setContinuous,
        addImage,
        removeImage
      }, dispatch),
      formActions: bindActionCreators({
        change: (field, value) => change('addListingForm', field, value)
      }, dispatch)
    }),
  ),
)(injectIntl(AddListing));
