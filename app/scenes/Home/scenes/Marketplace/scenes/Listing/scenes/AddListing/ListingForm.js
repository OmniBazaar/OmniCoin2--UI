import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Button, Grid } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import { required, numericality } from 'redux-form-validators';
import { toastr } from 'react-redux-toastr';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import CategoryDropdown from './components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from './components/SubCategoryDropdown/SubCategoryDropdown';
import CurrencyDropdown from './components/CurrencyDropdown/CurrencyDropdown';
import ConditionDropdown from './components/ConditionDropdown/ConditionDropdown';
import UnitDropdown from './components/UnitDropdown/UnitDropdown';
import ContactDropdown from './components/ContactDropdown/ContactDropdown';
import CountryDropdown from './components/CountryDropdown/CountryDropdown';
import StateDropdown from './components/StateDropdown/StateDropdown';
import Checkbox from './components/Checkbox/Checkbox';
import Calendar from './components/Calendar/Calendar';
import PublishersDropdown from './components/PublishersDropdown/PublishersDropdown';
import Images, { getImageId } from './components/Images/Images';
import messages from './messages';
import {
  InputField,
  makeValidatableField
} from '../../../../../../../../components/ValidatableField/ValidatableField';
import {
  setListingImages,
  saveListing,
  resetSaveListing
} from '../../../../../../../../services/listing/listingActions';
import {
  updatePublicData,
  setBtcAddress,
} from '../../../../../../../../services/accountSettings/accountActions';
import * as BitcoinApi from '../../../../../../../../services/blockchain/bitcoin/BitcoinApi';

import './add-listing.scss';
import {FetchChain} from "omnibazaarjs";

const contactOmniMessage = 'OmniMessage';

const requiredFieldValidator = [
  required({ message: messages.fieldRequired })
];

const numericFieldValidator = [
  numericality({ message: messages.fieldNumeric })
];

const SUPPORTED_IMAGE_TYPES = 'jpg, jpeg, png';
const MAX_IMAGE_SIZE = '1mb';

class ListingForm extends Component {
  static asyncValidate = async (values) => {
    try {
      const result = await BitcoinApi.validateAddress(values.bitcoin_address);
    } catch (e) {
      throw { bitcoin_address: messages.invalidAddress };
    }
  };

constructor(props) {
    super(props);

    this.CategoryDropdown = makeValidatableField(CategoryDropdown);
    this.SubCategoryDropdown = makeValidatableField(SubCategoryDropdown);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.ConditionDropdown = makeValidatableField(ConditionDropdown);
    this.UnitDropdown = makeValidatableField(UnitDropdown);
    this.ContactDropdown = makeValidatableField(ContactDropdown);
    this.CountryDropdown = makeValidatableField(CountryDropdown);
    this.StateDropdown = makeValidatableField(StateDropdown);
    this.Calendar = makeValidatableField(Calendar);
    this.PublishersDropdown = makeValidatableField(PublishersDropdown);
    this.DescriptionInput = makeValidatableField((props) => (<textarea {...props} />));
    this.PriceInput = makeValidatableField(this.renderLabeledField);

    this.state = {
      keywords: ''
    };
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
      <Button type='button' className="copy-btn button--gray-text">
        {buttonText}
      </Button>
    </div>
  );

  componentWillMount() {
    this.resetForm();
  }

  initFormData() {
    const { editingListing } = this.props;
    let data;
    if (editingListing) {
      data = {
        ...editingListing,
        keywords: editingListing.keywords ? editingListing.keywords.join(', ') : '',
        publisher: editingListing.ip
      };
    } else {
      const { images, ...defaultData } = this.props.listingDefaults;
      const { btc_address } = this.props.auth.account;
      data = {
        contact_type: contactOmniMessage,
        contact_info: this.props.auth.currentUser.username,
        price_using_btc: false,
        continuous: true,
        ...defaultData,
        price_using_omnicoin: true,
        start_date: moment().format('YYYY-MM-DD HH:mm:ss')
      };

      if (btc_address) {
        data.bitcoin_address = btc_address;
      }
    }

    this.props.initialize(data);
  }

  initImages() {
    const { editingListing } = this.props;
    let images = {};
    if (editingListing && editingListing.images) {
      editingListing.images.forEach(item => {
        const id = getImageId();
        images[id] = {
          image: item.path,
          thumb: this.imageUrl(editingListing.ip, item.thumb),
          fileName: item.image_name,
          id
        };
      });
    } else if (!editingListing) {
      images = this.props.listingDefaults.images;
    }

    this.props.listingActions.setListingImages(images);
  }

  imageUrl(publisherIp, path) {
    return `http://${publisherIp}/publisher-images/${path}`;
  }

  resetForm() {
    this.initFormData();
    this.initImages();
    this.props.listingActions.resetSaveListing();
    this.setState({
      keywords: ''
    });
  }

  componentWillReceiveProps(nextProps) {
    if ((
        nextProps.formValues !== this.props.formValues
        && !nextProps.formValues
      )) {
      this.resetForm();
    }

    const { error, saving } = nextProps.listing.saveListing;

    if (this.props.listing.saveListing.saving && !saving) {
      const { formatMessage } = this.props.intl;
      if (error) {
        let msg = null;
        if (error.message) {
          if (error.message === 'no_changes') {
            msg = formatMessage(messages.saveListingErrorNoChangeDetectedMessage);
          } else if (error.message === 'publisher_not_alive') {
            msg = formatMessage(messages.publisherNotReachable);
          } else if (error.message.includes(messages.saveListingNotEnoughFunds.defaultMessage)) {
            msg = formatMessage(messages.saveListingNotEnoughFunds);
          } else {
            msg = error.message;
          }
        } else {
          msg = msg = formatMessage(messages.saveListingErrorMessage);
        }

        this.showErrorToast(formatMessage(messages.error), msg);
      } else {
        const { editingListing } = this.props;
        if (!editingListing) {
          this.resetForm();
        }

        this.showSuccessToast(
          formatMessage(messages.success),
          formatMessage(messages.saveListingSuccessMessage)
        );
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

  onContinuousChange = (event, newValue) => {
    this.setState({
      toDateDisabled: !this.state.toDateDisabled
    })
  };

  onKeywordsBlur(e) {
    this.setState({
      keywords: e.target.value
    });
  }

  getImagesData() {
    const { listingImages } = this.props.listing;

    const data = [];
    for (const imageId in listingImages) {
      const imageItem = listingImages[imageId];
      const {
        uploadError, image, thumb, fileName, localFilePath, path
      } = imageItem;
      if (uploadError || (!image && !localFilePath)) {
        continue;
      }

      if (localFilePath) {
        data.push({
          localFilePath,
          path,
          id: imageId
        });
      } else {
        data.push({
          path: this.fixImagePath(image),
          thumb: this.fixThumbPath(thumb),
          image_name: fileName
        });
      }
    }

    return data;
  }

  fixImagePath(path) {
    const segs = path.split('/');
    if (segs.length > 2) {
      return segs[segs.length - 2] + '/' + segs[segs.length - 1];
    }

    return path;
  }

  fixThumbPath(path) {
    const segs = path.split('/');
    if (segs.length > 3) {
      return (
        segs[segs.length - 3]
        + '/' + segs[segs.length - 2]
        + '/' + segs[segs.length - 1]
      );
    }

    return path;
  }

  showSuccessToast(title, message) {
    toastr.success(title, message);
  }

  showErrorToast(title, message) {
    toastr.error(title, message);
  }

  submit(values) {
    const { saveListing } = this.props.listingActions;
    const { listing_id, publisher, keywords, ...data } = values;

    this.props.accountActions.updatePublicData();

    saveListing(publisher, {
      ...data,
      images: this.getImagesData(),
      keywords: keywords.split(',').map(el => el.trim())
    }, listing_id);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      category,
      country,
      currency,
      publisher,
      price_using_btc,
      continuous
    } = this.props.formValues ? this.props.formValues : {};
    const {
      account,
      auth,
      bitcoin,
      handleSubmit,
      editingListing,
      invalid
    } = this.props;

    const formValues = this.props.formValues || {};
    const { saving } = this.props.listing.saveListing;
    const btcWalletAddress = bitcoin.wallets.length ? bitcoin.wallets[0].receiveAddress : null;

    return (
      <Form className="add-listing-form" onSubmit={handleSubmit(this.submit.bind(this))}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <span className="title">{formatMessage(messages.primaryInfo)}</span>
            </Grid.Column>
            {
              !editingListing &&
              <Grid.Column width={4} floated="right">
                <NavLink to="/import-listings">
                  <Button content={formatMessage(messages.importListings)} className="button--primary" />
                </NavLink>
              </Grid.Column>
            }
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.listingTitle)}*</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="text"
                name="listing_title"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.pleaseEnter)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} className="align-top">
              <span>{formatMessage(messages.keywordsSearch)}*</span>
            </Grid.Column>
            <Grid.Column width={12} className='keywords'>
              <Field
                type="text"
                name="keywords"
                component={InputField}
                onBlur={this.onKeywordsBlur.bind(this)}
                className="textfield"
                placeholder={formatMessage(messages.keywordCommas)}
                validate={requiredFieldValidator}
              />
              <div className="note">{formatMessage(messages.keywordsNote)}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.placing)}*</span>
            </Grid.Column>
            <Grid.Column width={6} className="align-top">
              <Field
                name="category"
                component={this.CategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.category),
                  disableAllOption: true
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={6} className="align-top">
              <Field
                name="subcategory"
                component={this.SubCategoryDropdown}
                props={{
                  placeholder: formatMessage(messages.subCategory),
                  parentCategory: category,
                  disableAllOption: true
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.pricing)}*</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="currency"
                component={this.CurrencyDropdown}
                removeAll
                props={{
                  placeholder: formatMessage(messages.currency),
                  disableAllOption: true
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="price"
                placeholder={formatMessage(messages.pricePerItem)}
                component={this.PriceInput}
                className="textfield"
                validate={[...requiredFieldValidator, ...numericFieldValidator]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Field
                name="price_using_btc"
                component={Checkbox}
                props={{
                  label: formatMessage(messages.bitcoinPrice)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name="price_using_omnicoin"
                component={Checkbox}
                props={{
                  label: formatMessage(messages.omnicoinPrice)
                }}
              />
            </Grid.Column>
          </Grid.Row>
          {(price_using_btc || currency === 'BITCOIN') &&
          <Grid.Row>
            <Grid.Column width={4}>
              {formatMessage(messages.bitcoinAddress)}
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                name="bitcoin_address"
                component={InputField}
                className="textfield"
                validate={requiredFieldValidator}
                value={account.btcAddress || auth.account.btc_address || btcWalletAddress}
                onChange={({ target: { value } }) => this.props.accountActions.setBtcAddress(value)}
              />
            </Grid.Column>
          </Grid.Row>
          }
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.additionalInfo)}*</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="condition"
                component={this.ConditionDropdown}
                props={{
                  placeholder: formatMessage(messages.condition)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="quantity"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.numberAvailable)}
                validate={[...requiredFieldValidator, ...numericFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="units"
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
              <span>{formatMessage(messages.listingDates)}*</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="start_date"
                component={this.Calendar}
                className="textfield"
                maxDate={(formValues && formValues.end_date) ? formValues.end_date : null}
                props={{
                  placeholder: formatMessage(messages.from)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            {
              !continuous &&
              <Grid.Column width={4} className="align-top">
                <Field
                  type="text"
                  name="end_date"
                  component={this.Calendar}
                  className="textfield"
                  minDate={(formValues && formValues.start_date) ? formValues.start_date : null}
                  props={{
                    placeholder: formatMessage(messages.to)
                  }}
                  validate={requiredFieldValidator}
                />
              </Grid.Column>
            }
            <Grid.Column width={4}>
              <Field
                name="continuous"
                component={Checkbox}
                props={{
                  label: formatMessage(messages.continuous)
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.publisher)}*</span>
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                name="publisher"
                component={this.PublishersDropdown}
                props={{
                  placeholder: formatMessage(messages.selectPublisher),
                  keywords: this.state.keywords
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.images)}</span>
            </Grid.Column>
            <Grid.Column width={16}>
              <span className="error">
                {formatMessage(messages.imagesSpecification, {
                  imageSize: MAX_IMAGE_SIZE,
                  supportedTypes: SUPPORTED_IMAGE_TYPES
                })}
              </span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>
                {formatMessage(messages.listingImages)} {formatMessage(messages.optional)}
              </span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Images
                publisher={publisher}
                disabled={!publisher}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.description)}</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>{formatMessage(messages.description)}*</span>
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
              <span>{formatMessage(messages.ownerDetails)}*</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="name"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.ownerName)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="contact_type"
                component={this.ContactDropdown}
                onChange={this.onContactTypeChange.bind(this)}
                props={{
                  placeholder: formatMessage(messages.preferredContact)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="contact_info"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.enterPreferredContact)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.location)}*</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="country"
                component={this.CountryDropdown}
                props={{
                  placeholder: formatMessage(messages.country)
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="address"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.address)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="city"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.city)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4} className="align-top">
              <Field
                name="state"
                component={this.StateDropdown}
                props={{
                  placeholder: formatMessage(messages.state),
                  country
                }}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="post_code"
                component="input"
                className="textfield"
                placeholder={formatMessage(messages.postalCode)}
                validate={requiredFieldValidator}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Button
                type="submit"
                content={
                  formatMessage(
                    editingListing ?
                    messages.saveListing :
                    messages.createListingCaps
                  )
                }
                className="button--green-bg uppercase"
                loading={saving}
                disabled={saving || invalid}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

ListingForm.propTypes = {
  listingActions: PropTypes.shape({
    setListingImages: PropTypes.func,
    resetSaveListing: PropTypes.func,
    saveListing: PropTypes.func
  }).isRequired,
  accountActions: PropTypes.shape({
    updatePublicData: PropTypes.func,
    setBtcAddress: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  account: PropTypes.shape({
    btcAddress: PropTypes.string,
  }).isRequired,
  auth: PropTypes.shape({
    account: PropTypes.shape({
      btc_address: PropTypes.string,
    }),
    currentUser: PropTypes.shape({
      username: PropTypes.string,
    })
  }).isRequired,
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array
  }).isRequired,
  listing: PropTypes.shape({
    saveListing: PropTypes.shape({
      error: PropTypes.object,
      saving: PropTypes.bool
    }),
    listingImages: PropTypes.object
  }).isRequired,
  listingDefaults: PropTypes.shape({
    images: PropTypes.object
  }).isRequired
};

export default compose(
  reduxForm({
    form: 'listingForm',
    destroyOnUnmount: true,
    asyncValidate: ListingForm.asyncValidate,
    asyncBlurFields: ['bitcoin_address'],
  }),
  connect(
    state => ({
      auth: state.default.auth,
      account: state.default.account,
      listing: state.default.listing,
      formValues: getFormValues('listingForm')(state),
      listingDefaults: state.default.listingDefaults,
      bitcoin: state.default.bitcoin
    }),
    (dispatch) => ({
      listingActions: bindActionCreators({
        setListingImages,
        saveListing,
        resetSaveListing
      }, dispatch),
      accountActions: bindActionCreators({
        setBtcAddress,
        updatePublicData,
      }, dispatch),
      formActions: bindActionCreators({
        change: (field, value) => change('listingForm', field, value)
      }, dispatch)
    })
  )
)(injectIntl(ListingForm));
