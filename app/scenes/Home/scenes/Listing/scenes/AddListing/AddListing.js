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
    id: 'Listing.myListings',
    defaultMessage: 'My Listings'
  },
  createListing: {
    id: 'Listing.createListing',
    defaultMessage: 'Create Listing'
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
        <img alt="" id="target" src={image} width={132} height={100} className="added-img" />
      </div>
    ));
  }

  addListingForm() {
    return (
      <Form className="add-listing-form">
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <span className="title">Primary Info</span>
            </Grid.Column>
            <Grid.Column width={4} floated="right">
              <Button content="IMPORT LISTINGS" className="button--primary" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>Listing Title</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="text"
                name="listingTitle"
                component="input"
                className="textfield"
                placeholder="Please enter"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>Placing</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Type"
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Category"
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Sub-category"
                options={placingTypeOptions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>Pricing</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Type"
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="pricePerItem"
                placeholder="Price per item"
                component={this.renderLabeledField}
                className="textfield"
                buttonText="N/A"
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
                    Add Bitcoin Price
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
                    Add Omnicoin Price
                  </div>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>Additional Info</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Condition"
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="numberAvailable"
                component="input"
                className="textfield"
                placeholder="Number available"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Units of Measure"
                options={placingTypeOptions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>Listing Dates (Optional)</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="fromDate"
                placeholder="From"
                component={this.renderCalendarField}
                className="textfield"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="toDate"
                placeholder="To"
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
                    Continuous
                  </div>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">Images</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>Listing Images (Optional)</span>
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
              <span className="title">Description</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>Keywords for search engine</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="text"
                name="listingTitle"
                component="input"
                className="textfield"
                placeholder="Keywords separated by commas"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>Description</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="textarea"
                name="listingTitle"
                component="textarea"
                className="textfield"
                placeholder="Please enter"
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">Owner</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>Owner Details</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="ownerName"
                component="input"
                className="textfield"
                placeholder="Owner Name"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Preferred contact"
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="preferredContactDetail"
                component="input"
                className="textfield"
                placeholder="Enter preferred contact"
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>Location</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="Country"
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="address"
                component="input"
                className="textfield"
                placeholder="Address"
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="city"
                component="input"
                className="textfield"
                placeholder="City"
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder="State"
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                type="text"
                name="postalCode"
                component="input"
                className="textfield"
                placeholder="Postal Code"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Button content="CREATE LISTING" className="button--green-bg" />
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
