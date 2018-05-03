import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Image, Dropdown, Button, Grid, Modal } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import hash from 'object-hash';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import AddIcon from '../../../../../../images/btn-add-image.svg';
import RemoveIcon from '../../../../../../images/btn-remove-image-norm+press.svg';
import Checkbox from '../../../../../../../../components/Checkbox/Checkbox';

import { getFileExtension } from '../../../../../../../../utils/file';

import {
  setBitcoinPriceDefaults,
  setOmnicoinPriceDefaults,
  addImageDefaults,
  removeImageDefaults
} from '../../../../../../../../services/listing/listingDefaultsActions';

import '../AddListing/add-listing.scss';

require('react-datepicker/dist/react-datepicker-cssmodules.css');

const iconSize = 42;
const iconSizeLarge = 23;
const iconSizeMedium = 20;

const messages = defineMessages({
  myListings: {
    id: 'ListingsDefaults.myListings',
    defaultMessage: 'My Listings'
  },
  listingDefaults: {
    id: 'ListingsDefaults.listingDefaults',
    defaultMessage: 'Listing Defaults'
  },
  defaultsNote: {
    id: 'ListingsDefaults.defaultsNote',
    defaultMessage: 'Pre-defined information for all new listings you are creating.'
  },
  type: {
    id: 'ListingsDefaults.type',
    defaultMessage: 'Type'
  },
  category: {
    id: 'ListingsDefaults.category',
    defaultMessage: 'Category'
  },
  subCategory: {
    id: 'ListingsDefaults.subCategory',
    defaultMessage: 'Sub-category'
  },
  localCurrency: {
    id: 'ListingsDefaults.localCurrency',
    defaultMessage: 'Local Currency'
  },
  selectCoin: {
    id: 'ListingsDefaults.selectCoin',
    defaultMessage: 'Select Coin'
  },
  addBitcoinPrice: {
    id: 'ListingsDefaults.addBitcoinPrice',
    defaultMessage: 'Add Bitcoin Price'
  },
  addOmnicoinPrice: {
    id: 'ListingsDefaults.addOmnicoinPrice',
    defaultMessage: 'Add Omnicoin Price'
  },
  description: {
    id: 'ListingsDefaults.description',
    defaultMessage: 'Description'
  },
  pleaseEnter: {
    id: 'ListingsDefaults.pleaseEnter',
    defaultMessage: 'Please enter'
  },
  listingImages: {
    id: 'ListingsDefaults.listingImages',
    defaultMessage: 'Listing Images'
  },
  optional: {
    id: 'ListingsDefaults.optional',
    defaultMessage: '(Optional)'
  },
  location: {
    id: 'ListingsDefaults.location',
    defaultMessage: 'Location'
  },
  address: {
    id: 'ListingsDefaults.address',
    defaultMessage: 'Address'
  },
  city: {
    id: 'ListingsDefaults.city',
    defaultMessage: 'City'
  },
  postalCode: {
    id: 'ListingsDefaults.postalCode',
    defaultMessage: 'Postal Code'
  },
  saveDefaults: {
    id: 'ListingsDefaults.saveDefaults',
    defaultMessage: 'SAVE DEFAULTS'
  },
  warning: {
    id: 'ListingsDefaults.warning',
    defaultMessage: 'Warning'
  },
  ok: {
    id: 'ListingsDefaults.ok',
    defaultMessage: 'Ok'
  },
  onlyImagesMsg: {
    id: 'ListingsDefaults.onlyImagesMsg',
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

class MyListingsDefaults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleBitcoinPrice = () => this.props.listingActions.setBitcoinPriceDefaults();
  toggleOmnicoinPrice = () => this.props.listingActions.setOmnicoinPriceDefaults();

  onImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const extFile = getFileExtension(event);

      if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
        reader.onload = (e) => {
          this.props.listingActions.addImageDefaults(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      } else {
        this.setState({ open: true });
      }
    }
  }

  onClickAddImage = () => {
    this.inputElement.click();
  };

  removeImage = (index) => {
    this.props.listingActions.removeImageDefaults(index);
  };

  addedImages() {
    const { addedImagesDefaults } = this.props.listingDefaults;

    return addedImagesDefaults.map((image, index) => (
      <div key={hash(image)} className="img-container">
        <Image src={RemoveIcon} width={iconSizeLarge} height={iconSizeLarge} className="remove-icon" onClick={() => this.removeImage(index)} />
        <img alt="" id="target" src={image} width={132} height={100} className="added-img" />
      </div>
    ));
  }

  defaultsForm() {
    const { formatMessage } = this.props.intl;

    return (
      <Form className="add-listing-form">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.defaultsNote)}</span>
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
              <span>Pricing</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.localCurrency)}
                options={placingTypeOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.selectCoin)}
                options={placingTypeOptions}
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
                    {formatMessage(messages.addBitcoinPrice)}
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
                    {formatMessage(messages.addOmnicoinPrice)}
                  </div>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>{formatMessage(messages.description)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="textarea"
                name="listingTitle"
                component="textarea"
                className="textfield"
                placeholder={formatMessage(messages.pleaseEnter)}
              />
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

          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.location)}</span>
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
              <Button content={formatMessage(messages.saveDefaults)} className="button--green-bg" />
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
      <div className="marketplace-container category-listing listing-defaults">
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
                <span className="child">{formatMessage(messages.listingDefaults)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            {this.defaultsForm()}
          </div>
        </div>
        {this.showWarningMessage()}
      </div>
    );
  }
}

MyListingsDefaults.propTypes = {
  listingActions: PropTypes.shape({
    setBitcoinPriceDefaults: PropTypes.func,
    setOmnicoinPriceDefaults: PropTypes.func,
    addImageDefaults: PropTypes.func,
    removeImageDefaults: PropTypes.func,
  }),
  listingDefaults: PropTypes.shape({
    bitcoinPriceDefaults: PropTypes.bool,
    omnicoinPriceDefaults: PropTypes.bool,
    addedImagesDefaults: PropTypes.arrayOf(PropTypes.string),
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

MyListingsDefaults.defaultProps = {
  listingActions: {},
  listingDefaults: {},
  intl: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      listingActions: bindActionCreators({
        setBitcoinPriceDefaults,
        setOmnicoinPriceDefaults,
        addImageDefaults,
        removeImageDefaults
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'addListingForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(MyListingsDefaults));
