import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Image, Dropdown, Button, Grid, Modal } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import { required } from 'redux-form-validators';
import hash from 'object-hash';
import { NavLink } from 'react-router-dom';

import { getFileExtension } from '../../../../../../../../utils/file';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
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
import Checkbox from './components/Checkbox';
import Calendar from './components/Calendar';
import messages from './messages';
import ValidatableField,
  { makeValidatableField } from '../../../../../../../../components/ValidatableField';

import {
  setBitcoinPrice,
  setOmnicoinPrice,
  setContinuous,
  addImage,
  removeImage
} from '../../../../../../../../services/listing/listingActions';

import './add-listing.scss';

const iconSize = 42;
const iconSizeLarge = 23;

const contactOmniMessage = 'OmniMessage';

const requiredFieldValidator = [
  required({ message: messages.fieldRequired })
];

class AddListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.CategoryDropdown = makeValidatableField(CategoryDropdown);
    this.SubCategoryDropdown = makeValidatableField(SubCategoryDropdown);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.ConditionDropdown = makeValidatableField(ConditionDropdown);
    this.UnitDropdown = makeValidatableField(UnitDropdown);
    this.ContactDropdown = makeValidatableField(ContactDropdown);
    this.CountryDropdown = makeValidatableField(CountryDropdown);
    this.StateDropdown = makeValidatableField(StateDropdown);
    this.Calendar = makeValidatableField(Calendar);
    this.DescriptionInput = makeValidatableField((props) => (<textarea {...props} />));
    this.PriceInput = makeValidatableField(this.renderLabeledField);
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

  submit(values) {
    console.log(values)
  }

  addListingForm() {
    const { formatMessage } = this.props.intl;
    const { category, country } = this.props.formValues ? this.props.formValues : {};
    const { handleSubmit } = this.props;

    return (
      <Form className="add-listing-form" onSubmit={handleSubmit(this.submit.bind(this))}>
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
                component={ValidatableField}
                className="textfield"
                placeholder={formatMessage(messages.pleaseEnter)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.placing)}</span>
            </Grid.Column>
            <Grid.Column width={6} className='align-top'>
              <Field
                name='category'
                component={this.CategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.category)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={6} className='align-top'>
              <Field
                name='subcategory'
                component={this.SubCategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.subCategory),
                  parentCategory: category
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.pricing)}</span>
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                name='currency'
                component={this.CurrencyDropdown}
                props={{
                  placeholder: formatMessage(messages.currency)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="price"
                placeholder={formatMessage(messages.pricePerItem)}
                component={this.PriceInput}
                className="textfield"
                buttonText={formatMessage(messages.na)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Field
                name='price_using_btc'
                component={Checkbox}
                props={{
                  label: formatMessage(messages.bitcoinPrice)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name='price_using_omnicoin'
                component={Checkbox}
                props={{
                  label: formatMessage(messages.omnicoinPrice)
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.additionalInfo)}</span>
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                name='condition'
                component={this.ConditionDropdown}
                props={{
                  placeholder: formatMessage(messages.condition)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="quantity"
                component={ValidatableField}
                className="textfield"
                placeholder={formatMessage(messages.numberAvailable)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                name='units'
                component={this.UnitDropdown}
                props={{
                  placeholder: formatMessage(messages.unitsOfMeasure)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.listingDates)} {formatMessage(messages.optional)}</span>
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="start_date"
                component={this.Calendar}
                className="textfield"
                props={{
                  placeholder: formatMessage(messages.from)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="end_date"
                component={this.Calendar}
                className="textfield"
                props={{
                  placeholder: formatMessage(messages.to)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name='continuous'
                component={Checkbox}
                props={{
                  label: formatMessage(messages.continuous)
                }}
              />
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
                component={ValidatableField}
                className="textfield"
                placeholder={formatMessage(messages.keywordCommas)}
                validate={requiredFieldValidator}
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
                component={this.DescriptionInput}
                className="textfield"
                placeholder={formatMessage(messages.pleaseEnter)}
                validate={requiredFieldValidator}
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
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="name"
                component={ValidatableField}
                className="textfield"
                placeholder={formatMessage(messages.ownerName)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                name='contact_type'
                component={this.ContactDropdown}
                onChange={this.onContactTypeChange.bind(this)}
                props={{
                  placeholder: formatMessage(messages.preferredContact)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="contact_info"
                component={ValidatableField}
                className="textfield"
                placeholder={formatMessage(messages.enterPreferredContact)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.location)}</span>
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                name='country'
                component={this.CountryDropdown}
                props={{
                  placeholder: formatMessage(messages.country)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="address"
                component={ValidatableField}
                className="textfield"
                placeholder={formatMessage(messages.address)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
              <Field
                type="text"
                name="city"
                component={ValidatableField}
                className="textfield"
                placeholder={formatMessage(messages.city)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4} className='align-top'>
              <Field
                name='state'
                component={this.StateDropdown}
                props={{
                  placeholder: formatMessage(messages.state),
                  country
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className='align-top'>
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
              <Button type='submit' content={formatMessage(messages.createListingCaps)} className="button--green-bg" />
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
