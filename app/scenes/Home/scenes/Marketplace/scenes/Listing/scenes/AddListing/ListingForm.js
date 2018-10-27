import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Button, Grid } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import { required, numericality } from 'redux-form-validators';
import { toastr } from 'react-redux-toastr';
import { NavLink, Prompt } from 'react-router-dom';
import moment from 'moment';

import CategoryDropdown from './components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from './components/SubCategoryDropdown/SubCategoryDropdown';
import PriorityFeeDropdown from './components/PriorityFeeDropdown/PriorityFeeDropdown';
import CurrencyDropdown from './components/CurrencyDropdown/CurrencyDropdown';
import ConditionDropdown from './components/ConditionDropdown/ConditionDropdown';
import UnitDropdown from './components/UnitDropdown/UnitDropdown';
import ContactDropdown from './components/ContactDropdown/ContactDropdown';
import CountryDropdown from './components/CountryDropdown/CountryDropdown';
import StateDropdown from './components/StateDropdown/StateDropdown';
import Checkbox from './components/Checkbox/Checkbox';
import Calendar from './components/Calendar/Calendar';
import PublishersDropdown from './components/PublishersDropdown/PublishersDropdown';
import BitcoinWalletDropdown from './components/BitcoinWalletDropdown/BitcoinWalletDropdown';
import FormPrompt from '../../../../../../../../components/FormPrompt/FormPrompt';
import GeneralDropdown from './components/GeneralDropdown/GeneralDropdown';

import Images, { getImageId } from './components/Images/Images';
import messages from './messages';
import priorityFees from './priorityFees';
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
  setEthAddress
} from '../../../../../../../../services/accountSettings/accountActions';
import {
  requiredFieldValidator,
  numericFieldValidator,
  allowBlankNumericFieldValidator,
  omnicoinFieldValidator,
  bitcoinFieldValidator,
  ethereumFieldValidator,
  fiatFieldValidator,
  ethereumPriceFieldValidator
} from "./validators";
import * as BitcoinApi from '../../../../../../../../services/blockchain/bitcoin/BitcoinApi';
import TagsInput from '../../../../../../../../components/TagsInput';
import cn from 'classnames';
import * as EthereumApi from '../../../../../../../../services/blockchain/ethereum/EthereumApi';

import './add-listing.scss';
import { TOKENS_IN_XOM, WEI_IN_ETH, MANUAL_INPUT_VALUE } from "../../../../../../../../utils/constants";
import { weightUnits, sizeUnits } from  './constants'; 

const contactOmniMessage = 'OmniMessage';



const SUPPORTED_IMAGE_TYPES = 'jpg, jpeg, png';
const MAX_IMAGE_SIZE = '1mb';

const unitKeys = ['weight_unit', 'width_unit', 'height_unit', 'length_unit'];

class ListingForm extends Component {
  static asyncValidate = async (values) => {
    try {
      const {
        price_using_btc,
        bitcoin_address,
        price_using_eth,
        ethereum_address,
        manual_bitcoin_address,
      } = values;
      if (price_using_btc && manual_bitcoin_address) {
        await BitcoinApi.validateAddress(manual_bitcoin_address);
      }
      if (price_using_eth && ethereum_address) {
          await EthereumApi.validateEthereumAddress(ethereum_address);
      }
    } catch (e) {
      if (e === "Invalid Ethereum Address") {
        throw { ethereum_address: messages.invalidAddress };
      } else {
        throw { manual_bitcoin_address: messages.invalidAddress };
      }
    }
  };

  constructor(props) {
    super(props);

    this.CategoryDropdown = makeValidatableField(CategoryDropdown);
    this.SubCategoryDropdown = makeValidatableField(SubCategoryDropdown);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.PriorityFeeDropdown = makeValidatableField(PriorityFeeDropdown);
    this.ConditionDropdown = makeValidatableField(ConditionDropdown);
    this.UnitDropdown = makeValidatableField(UnitDropdown);
    this.ContactDropdown = makeValidatableField(ContactDropdown);
    this.CountryDropdown = makeValidatableField(CountryDropdown);
    this.StateDropdown = makeValidatableField(StateDropdown);
    this.Calendar = makeValidatableField(Calendar);
    this.PublishersDropdown = makeValidatableField(PublishersDropdown);
    this.BitcoinWalletDropdown = makeValidatableField(BitcoinWalletDropdown);
    this.DescriptionInput = makeValidatableField((props) => (<textarea {...props} />));
    this.PriceInput = makeValidatableField(this.renderLabeledField);
    this.GeneralDropdown = makeValidatableField(GeneralDropdown);

    this.state = {
      keywords: '',
      isPromptVisible: false
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
      <Button type="button" className="copy-btn button--gray-text">
        {buttonText}
      </Button>
    </div>
  );

  componentWillMount() {
    this.resetForm();
  }

  initFormData() {
    const {
      editingListing,
      auth,
      account,
      ethereum
    } = this.props;
    let data;
    if (editingListing) {
      data = {
        ...editingListing,
        keywords: editingListing.keywords ? editingListing.keywords.join(', ') : '',
        publisher: editingListing.ip
      };
      if (editingListing.bitcoin_address) {
        if (!this.isBtcAddressInWallet(editingListing.bitcoin_address)) {
          data.bitcoin_address = MANUAL_INPUT_VALUE;
          data.manual_bitcoin_address = editingListing.bitcoin_address;
        }
      }
    } else {
      const { images, ...defaultData } = this.props.listingDefaults;
      const listingPriority = this.getDefaultListingPriority();
      data = {
        contact_type: contactOmniMessage,
        contact_info: this.props.auth.currentUser.username,
        priority_fee: listingPriority,
        price_using_btc: false,
        price_using_eth: false,
        continuous: true,
        ...defaultData,
        price_using_omnicoin: true,
        start_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        shipping_price_included: false
      };

      if (defaultData.bitcoin_address) {
        if (this.isBtcAddressInWallet(defaultData.bitcoin_address)) {
          data.bitcoin_address = defaultData.bitcoin_address;
        } else {
          data.bitcoin_address = MANUAL_INPUT_VALUE;
          data.manual_bitcoin_address = defaultData.bitcoin_address;
        }
      }
      if (defaultData.ethereum_address) {
        data.ethereum_address = defaultData.ethereum_address;
      } else {
        data.ethereum_address = account.ethAddress || auth.account.eth_address || ethereum.address;
      }
    }

    unitKeys.forEach(key => {
      if (!data[key]) {
        data[key] = key === 'weight_unit' ? 'oz' : 'in';
      }
    });

    this.props.initialize(data);
  }

  isBtcAddressInWallet(btc_address) {
    const { wallets } = this.props.bitcoin;
    return !!wallets.find(wallet => wallet.receiveAddress === btc_address);
  }

  getDefaultListingPriority() {
    const preferencesStorageKey = `preferences_${this.props.auth.currentUser.username}`;
    const userPreferences = JSON.parse(localStorage.getItem(preferencesStorageKey));

    return userPreferences && userPreferences.listingPriority ? parseInt(userPreferences.listingPriority) : 50
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

    this.setState({ keywords: nextProps.formValues && nextProps.formValues.keywords });

    const { error, saving } = nextProps.listing.saveListing;

    if (this.props.listing.saveListing.saving && !saving) {
      const { formatMessage } = this.props.intl;
      if (error) {
        let msg = null;
        if (error.statusCode === 413) {
          msg = formatMessage(messages.imageSizeTooLarge);
        } else if (error.message) {
          if (/StatusCodeError: 413/.test(error.message)) {
            msg = formatMessage(messages.imageSizeTooLarge);
          } else if (error.message === 'no_changes') {
            msg = formatMessage(messages.saveListingErrorNoChangeDetectedMessage);
          } else if (error.message === 'publisher_not_alive') {
            msg = formatMessage(messages.publisherNotReachable);
          } else if (error.message.includes(messages.saveListingNotEnoughFunds.defaultMessage)) {
            msg = formatMessage(messages.saveListingNotEnoughFunds);
          } else {
            msg = error.message;
          }
        } else {
          msg = formatMessage(messages.saveListingErrorMessage);
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

  onContinuousChange = () => {
    this.setState({
      toDateDisabled: !this.state.toDateDisabled
    });
  };

  onKeywordsChange(keys) {
    const keywords = keys.join(',');

    this.props.formActions.change('keywords', keywords);
    this.setState({ keywords });
  }

  onShowEthPriceChange = (e, isShow) => {
    if (isShow) {
      this.populateEthAddress();
    }
  }

  onCurrencyChange = (e, currency) => {
    if (currency === 'ETHEREUM') {
      this.populateEthAddress();
    }
  }

  populateEthAddress() {
    const { editingListing, account, auth, ethereum } = this.props;
    let address = editingListing && editingListing.ethereum_address;
    if (!address) {
      address = account.ethAddress || auth.account.eth_address || ethereum.address
    }
    this.props.formActions.change('ethereum_address', address);
  }

  getImagesData() {
    const { listingImages } = this.props.listing;

    const data = [];
    for (const imageId in listingImages) {
      const imageItem = listingImages[imageId];
      const {
        uploadError, image, thumb, fileName, localFilePath, path, file
      } = imageItem;
      if (uploadError || (!image && !localFilePath && !file)) {
        continue;
      }

      if (localFilePath) {
        data.push({
          localFilePath,
          path,
          id: imageId
        });
      } else if (file) {
        data.push({
          file,
          id: imageId
        });
      } else {
        data.push({
          path: this.fixImagePath(image),
          thumb: this.fixThumbPath(thumb),
          image_name: fileName,
          id: imageId
        });
      }
    }

    return data;
  }

  fixImagePath(path) {
    const segs = path.split('/');
    if (segs.length > 2) {
      return `${segs[segs.length - 2]}/${segs[segs.length - 1]}`;
    }

    return path;
  }

  fixThumbPath(path) {
    const segs = path.split('/');
    if (segs.length > 3) {
      return (
        `${segs[segs.length - 3]
        }/${segs[segs.length - 2]
        }/${segs[segs.length - 1]}`
      );
    }

    return path;
  }

  getPriceValidators(currency) {
    const priceValidators = [numericFieldValidator, requiredFieldValidator];
    if (currency === 'OMNICOIN') {
      priceValidators.push(omnicoinFieldValidator);
    } else if (currency === 'BITCOIN') {
      priceValidators.push(bitcoinFieldValidator);
    } else if (currency === 'ETHEREUM') {
      priceValidators.push(ethereumPriceFieldValidator);
    } else {
      priceValidators.push(fiatFieldValidator);
    }
    return priceValidators;
  }

  showSuccessToast(title, message) {
    toastr.success(title, message);
  }

  showErrorToast(title, message) {
    toastr.error(title, message);
  }

  submit(values) {
    const { saveListing } = this.props.listingActions;
    const {
      listing_id, publisher, keywords, ...data
    } = values;

    if (!data.weight) {
      delete data.weight_unit;
    }
    if (!data.width) {
      delete data.width_unit;
    }
    if (!data.height) {
      delete data.height_unit;
    }
    if (!data.length) {
      delete data.length_unit;
    }

    const obj = {
      ...data,
      images: this.getImagesData(),
      keywords: keywords.split(',').map(el => el.trim())
    };
    if (obj.bitcoin_address === MANUAL_INPUT_VALUE) {
      obj.bitcoin_address = obj.manual_bitcoin_address;
      delete obj.manual_bitcoin_address;
    }
    saveListing(publisher, obj, listing_id);

    this.setState({
      isPromptVisible: false
    })
  }

  renderKeywordsInput() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <TagsInput
          value={this.state.keywords ? this.state.keywords.split(',') : []}
          name="keywords"
          inputProps={{
            className: cn('react-tagsinput-input', { empty: !this.state.keywords }),
            placeholder: (
              formatMessage(messages.addKeywords)
            )
          }}
          onChange={this.onKeywordsChange.bind(this)}
        />
        <div className="note">{formatMessage(messages.keywordsNote)}</div>
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      category,
      country,
      currency,
      publisher,
      price_using_btc,
      price_using_eth,
      continuous
    } = this.props.formValues ? this.props.formValues : {};
    const {
      account,
      auth,
      bitcoin,
      ethereum,
      handleSubmit,
      editingListing,
      invalid,
      submitting,
      asyncValidating
    } = this.props;

    const formValues = this.props.formValues || {};
    const { saving } = this.props.listing.saveListing;

    const btcWalletAddress = bitcoin.wallets.length ? bitcoin.wallets[0].receiveAddress : null;
    const ethWalletAddress = ethereum.address;

    return (
      <Form className="add-listing-form" onChange={() => this.setState({ isPromptVisible: true })} onSubmit={handleSubmit(this.submit.bind(this))}>
        <FormPrompt isVisible={this.state.isPromptVisible}/>
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
                placeholder={formatMessage(messages.pleaseEnterTitle)}
                validate={[requiredFieldValidator]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} className="align-top">
              <span>{formatMessage(messages.keywordsSearch)}*</span>
            </Grid.Column>
            <Grid.Column width={12} className="keywords form-group keyword-container">
              {this.renderKeywordsInput()}
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
                validate={[requiredFieldValidator]}
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
                validate={[requiredFieldValidator]}
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
                onChange={this.onCurrencyChange}
                validate={[requiredFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="price"
                placeholder={formatMessage(messages.pricePerItem)}
                component={this.PriceInput}
                className="textfield"
                validate={this.getPriceValidators(currency)}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name="shipping_price_included"
                component={Checkbox}
                props={{
                  label: formatMessage(messages.shippingPriceIncluded)
                }}
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
                name="price_using_eth"
                component={Checkbox}
                props={{
                  label: formatMessage(messages.ethereumPrice)
                }}
                onChange={this.onShowEthPriceChange}
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
                component={this.BitcoinWalletDropdown}
                className="textfield"
                validate={[requiredFieldValidator]}
              />
            </Grid.Column>
            {this.props.formValues.bitcoin_address === MANUAL_INPUT_VALUE &&
              <Grid.Column width={4}>
                <Field
                  name="manual_bitcoin_address"
                  component={InputField}
                  className="textfield"
                  validate={[requiredFieldValidator]}
                />
              </Grid.Column>
            }
          </Grid.Row>
          }
          {(price_using_eth || currency === 'ETHEREUM') &&
          <Grid.Row>
            <Grid.Column width={4}>
              {formatMessage(messages.ethereumAddress)}
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                name="ethereum_address"
                component={InputField}
                className="textfield"
                validate={[requiredFieldValidator]}
                onChange={({ target: { value } }) => this.props.accountActions.setEthAddress(value)}
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
                validate={[requiredFieldValidator, numericFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="units"
                component={this.UnitDropdown}
                props={{
                  placeholder: formatMessage(messages.unitsOfMeasure)
                }}
                validate={[requiredFieldValidator]}
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
                validate={[requiredFieldValidator]}
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
                  validate={[requiredFieldValidator]}
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
              <span>{formatMessage(messages.priorityFee)}*</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="text"
                name="priority_fee"
                component={this.PriorityFeeDropdown}
                props={{
                  placeholder: formatMessage(messages.selectPriorityFee),
                  priorityFees
                }}
                validate={[requiredFieldValidator]}
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
                validate={[requiredFieldValidator]}
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
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.description)}*</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} className="top-align">
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="textarea"
                name="description"
                component={this.DescriptionInput}
                className="textfield"
                placeholder={formatMessage(messages.pleaseEnterDescription)}
                validate={[requiredFieldValidator]}
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
                validate={[requiredFieldValidator]}
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
                validate={[requiredFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="contact_info"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.enterPreferredContact)}
                validate={[requiredFieldValidator]}
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
                validate={[requiredFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="address"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.address)}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="city"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.city)}
                validate={[requiredFieldValidator]}
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
                validate={[requiredFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="post_code"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.postalCode)}
                validate={[requiredFieldValidator]}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.shipping)}</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} className="top-align">
            </Grid.Column>
            <Grid.Column width={10}>
              <Field
                type="textarea"
                name="shipping_description"
                component={this.DescriptionInput}
                className="textfield"
                placeholder={formatMessage(messages.enterShippingInformation)}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}></Grid.Column>
            <Grid.Column width={12}>
              <Field
                name="no_shipping_address_required"
                component={Checkbox}
                props={{
                  label: formatMessage(messages.noShippingAddressRequired)
                }}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="row-section">
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.weightAndSize)}</span>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.weight)}</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="weight"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.weight)}
                validate={[allowBlankNumericFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="weight_unit"
                component={GeneralDropdown}
                props={{
                  data: weightUnits
                }}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.width)}</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="width"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.width)}
                validate={[allowBlankNumericFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="width_unit"
                component={GeneralDropdown}
                props={{
                  data: sizeUnits
                }}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.height)}</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="height"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.height)}
                validate={[allowBlankNumericFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="height_unit"
                component={GeneralDropdown}
                props={{
                  data: sizeUnits
                }}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.length)}</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="length"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(messages.length)}
                validate={[allowBlankNumericFieldValidator]}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="length_unit"
                component={GeneralDropdown}
                props={{
                  data: sizeUnits
                }}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={4}>
              <Button
                type="submit"
                content={
                  formatMessage(editingListing ?
                    messages.saveListing :
                    messages.createListingCaps)
                }
                className="button--green-bg uppercase"
                loading={saving || submitting || asyncValidating}
                disabled={saving || invalid || !this.state.keywords || submitting || asyncValidating}
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
    setEthAddress: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  account: PropTypes.shape({
    btcAddress: PropTypes.string,
    ethAddress: PropTypes.string,
  }).isRequired,
  auth: PropTypes.shape({
    account: PropTypes.shape({
      btc_address: PropTypes.string,
      eth_address: PropTypes.string,
    }),
    currentUser: PropTypes.shape({
      username: PropTypes.string,
    })
  }).isRequired,
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array
  }).isRequired,
  ethereum: PropTypes.shape({
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
  }).isRequired,
  formActions: PropTypes.shape({
    change: PropTypes.func,
  }).isRequired,
};

export default compose(
  reduxForm({
    form: 'listingForm',
    destroyOnUnmount: true,
    asyncValidate: ListingForm.asyncValidate,
    asyncBlurFields: ['bitcoin_address', 'ethereum_address', 'manual_bitcoin_address'],
  }),
  connect(
    state => ({
      auth: state.default.auth,
      account: state.default.account,
      listing: state.default.listing,
      formValues: getFormValues('listingForm')(state),
      listingDefaults: state.default.listingDefaults,
      bitcoin: state.default.bitcoin,
      ethereum: state.default.ethereum
    }),
    (dispatch) => ({
      listingActions: bindActionCreators({
        setListingImages,
        saveListing,
        resetSaveListing
      }, dispatch),
      accountActions: bindActionCreators({
        setBtcAddress,
        setEthAddress,
        updatePublicData,
      }, dispatch),
      formActions: bindActionCreators({
        change: (field, value) => change('listingForm', field, value)
      }, dispatch)
    })
  )
)(injectIntl(ListingForm));
