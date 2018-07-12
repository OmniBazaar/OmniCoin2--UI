import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Form, Button, Grid } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { toastr } from 'react-redux-toastr';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import CategoryDropdown from '../AddListing/components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from '../AddListing/components/SubCategoryDropdown/SubCategoryDropdown';
import CurrencyDropdown from '../AddListing/components/CurrencyDropdown/CurrencyDropdown';
import StateDropdown from '../AddListing/components/StateDropdown/StateDropdown';
import CountryDropdown from '../AddListing/components/CountryDropdown/CountryDropdown';
import Checkbox from '../AddListing/components/Checkbox/Checkbox';
import Images from '../AddListing/components/Images/Images';
import addListingMessages from '../AddListing/messages';
import listingDefaultMessages from './messages';

import {
  InputField,
  makeValidatableField
} from '../../../../../../../../components/ValidatableField/ValidatableField';

import {
  saveListingDefault,
  loadListingDefault
} from '../../../../../../../../services/listing/listingDefaultsActions';
import {
  updatePublicData,
  setBtcAddress,
} from '../../../../../../../../services/accountSettings/accountActions';
import * as BitcoinApi from '../../../../../../../../services/blockchain/bitcoin/BitcoinApi';

import '../AddListing/add-listing.scss';

const iconSize = 42;

class MyListingsDefaults extends Component {
  static asyncValidate = async (values) => {
    try {
      const { price_using_btc, bitcoin_address } = values;
      if (price_using_btc && bitcoin_address) {
        await BitcoinApi.validateAddress(bitcoin_address);
      }
    } catch (e) {
      throw Object.create({ bitcoin_address: listingDefaultMessages.invalidAddress });
    }
  };

  static showSuccessToast = (title, message) => {
    toastr.success(title, message);
  };

  constructor(props) {
    super(props);

    this.CategoryDropdown = makeValidatableField(CategoryDropdown);
    this.SubCategoryDropdown = makeValidatableField(SubCategoryDropdown);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.CountryDropdown = makeValidatableField(CountryDropdown);
    this.StateDropdown = makeValidatableField(StateDropdown);
    this.DescriptionInput = makeValidatableField(allProps => (<textarea {...allProps} />));
  }

  componentWillMount() {
    const { listingDefaults } = this.props;
    this.props.initialize(listingDefaults);
    this.props.listingDefaultsActions.loadListingDefault();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.listingDefaults.name !== this.props.listingDefaults.name) {
      this.props.initialize(newProps.listingDefaults);
    }
  }

  getImagesData() {
    const { images } = this.props.listingDefaults;
    const data = {};

    Object.keys(images).forEach((imageId) => {
      const imageItem = images[imageId];
      const {
        uploadError, path
      } = imageItem;

      if (!uploadError && path) {
        data[imageId] = { path };
      }
    });

    return data;
  }

  submit(values) {
    const { saveListingDefault } = this.props.listingDefaultsActions;
    const { formatMessage } = this.props.intl;

    this.props.accountActions.updatePublicData();

    try {
      saveListingDefault({
        ...values,
        images: this.getImagesData(),
      });

      MyListingsDefaults.showSuccessToast(
        formatMessage(listingDefaultMessages.success),
        formatMessage(listingDefaultMessages.saveListingSuccessMessage)
      );
    } catch (e) {
      toastr.error(
        formatMessage(listingDefaultMessages.error),
        e.message
      );
    }
  }

  defaultsForm() {
    const { formatMessage } = this.props.intl;
    const {
      account, auth, bitcoin, handleSubmit,
    } = this.props;
    const {
      category,
      country,
      currency,
      price_using_btc,
    } = this.props.formValues ? this.props.formValues : {};
    const btcWalletAddress = bitcoin.wallets.length ? bitcoin.wallets[0].receiveAddress : null;

    return (
      <Form className="add-listing-form" onSubmit={handleSubmit(this.submit.bind(this))}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <span className="title">
                {formatMessage(listingDefaultMessages.defaultsNote)}
              </span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(addListingMessages.placing)}</span>
            </Grid.Column>
            <Grid.Column width={6} className="align-top">
              <Field
                name="category"
                component={this.CategoryDropdown}
                props={{
                  placeholder: formatMessage(addListingMessages.category)
                }}
              />
            </Grid.Column>
            <Grid.Column width={6} className="align-top">
              <Field
                name="subcategory"
                component={this.SubCategoryDropdown}
                props={{
                  placeholder: formatMessage(addListingMessages.subCategory),
                  parentCategory: category
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(addListingMessages.pricing)}</span>
            </Grid.Column>
            <Grid.Column width={6} className="align-top">
              <Field
                name="currency"
                component={this.CurrencyDropdown}
                props={{
                  placeholder: formatMessage(addListingMessages.currency),
                  disableAllOption: true
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={6}>
              <Field
                name="price_using_btc"
                component={Checkbox}
                props={{
                  label: formatMessage(addListingMessages.bitcoinPrice)
                }}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Field
                name="price_using_omnicoin"
                component={Checkbox}
                props={{
                  label: formatMessage(addListingMessages.omnicoinPrice)
                }}
              />
            </Grid.Column>
          </Grid.Row>
          {(price_using_btc || currency === 'BITCOIN') &&
          <Grid.Row>
            <Grid.Column width={4}>
              {formatMessage(addListingMessages.bitcoinAddress)}
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                name="bitcoin_address"
                component={InputField}
                className="textfield"
                value={account.btcAddress || auth.account.btc_address || btcWalletAddress}
                onChange={({ target: { value } }) => this.props.accountActions.setBtcAddress(value)}
              />
            </Grid.Column>
          </Grid.Row>
          }

          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>{formatMessage(addListingMessages.description)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Field
                type="textarea"
                name="description"
                component={this.DescriptionInput}
                className="textfield"
                placeholder={formatMessage(addListingMessages.pleaseEnter)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} className="top-align">
              <span>
                {formatMessage(addListingMessages.listingImages)} {formatMessage(addListingMessages.optional)}
              </span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Images isListingDefaults />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(addListingMessages.ownerDetails)}</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="name"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(addListingMessages.ownerName)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(addListingMessages.location)}</span>
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                name="country"
                component={this.CountryDropdown}
                props={{
                  placeholder: formatMessage(addListingMessages.country)
                }}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="address"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(addListingMessages.address)}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="city"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(addListingMessages.city)}
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
                  placeholder: formatMessage(addListingMessages.state),
                  country
                }}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="post_code"
                component="input"
                className="textfield"
                placeholder={formatMessage(addListingMessages.postalCode)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={6}>
              <Button
                type="submit"
                content={formatMessage(listingDefaultMessages.saveDefaults)}
                className="button--green-bg uppercase"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
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
                  <span>{formatMessage(listingDefaultMessages.myListings)}</span>
                  <Icon name="long arrow right" width={iconSize} height={iconSize} />
                </div>
                <span className="child">{formatMessage(listingDefaultMessages.listingDefaults)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            {this.defaultsForm()}
          </div>
        </div>
      </div>
    );
  }
}

MyListingsDefaults.propTypes = {
  account: PropTypes.shape({
    btcAddress: PropTypes.string,
  }),
  accountActions: PropTypes.shape({
    updatePublicData: PropTypes.func,
    setBtcAddress: PropTypes.func,
  }),
  auth: PropTypes.shape({
    btc_address: PropTypes.string,
  }),
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array,
  }),
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  listingDefaults: PropTypes.shape({
    images: PropTypes.object,
    name: PropTypes.string,
  }).isRequired,
  listingDefaultsActions: PropTypes.shape({
    saveListingDefault: PropTypes.func,
    loadListingDefault: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  formValues: PropTypes.shape({
    category: PropTypes.string
  })
};

MyListingsDefaults.defaultProps = {
  formValues: {},
  bitcoin: {},
  auth: {},
  account: {},
  accountActions: {},
};

export default compose(
  connect(
    state => ({
      listingDefaults: state.default.listingDefaults,
      account: state.default.account,
      auth: state.default.auth,
      bitcoin: state.default.bitcoin,
      formValues: getFormValues('listingDefaultsForm')(state)
    }),
    (dispatch) => ({
      listingDefaultsActions: bindActionCreators({
        saveListingDefault,
        loadListingDefault,
      }, dispatch),
      accountActions: bindActionCreators({
        updatePublicData,
        setBtcAddress,
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'listingDefaultsForm',
    destroyOnUnmount: true,
    asyncValidate: MyListingsDefaults.asyncValidate,
    asyncBlurFields: ['bitcoin_address']
  })
)(injectIntl(MyListingsDefaults));
