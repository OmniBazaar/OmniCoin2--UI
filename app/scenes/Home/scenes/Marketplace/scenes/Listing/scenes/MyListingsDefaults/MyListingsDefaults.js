import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Form, Button, Grid } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import { Prompt } from 'react-router-dom';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import CategoryDropdown from '../AddListing/components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from '../AddListing/components/SubCategoryDropdown/SubCategoryDropdown';
import CurrencyDropdown from '../AddListing/components/CurrencyDropdown/CurrencyDropdown';
import StateDropdown from '../AddListing/components/StateDropdown/StateDropdown';
import CountryDropdown from '../AddListing/components/CountryDropdown/CountryDropdown';
import Checkbox from '../AddListing/components/Checkbox/Checkbox';
import Images from '../AddListing/components/Images/Images';
import BitcoinWalletDropdown from '../AddListing/components/BitcoinWalletDropdown/BitcoinWalletDropdown';
import PriorityFeeDropdown from '../AddListing/components/PriorityFeeDropdown/PriorityFeeDropdown';
import QuestionMark from '../../../../../../components/QuestionMark/QuestionMark';

import FormPrompt from '../../../../../../../../components/FormPrompt/FormPrompt';

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
  setEthAddress
} from '../../../../../../../../services/accountSettings/accountActions';
import * as BitcoinApi from '../../../../../../../../services/blockchain/bitcoin/BitcoinApi';
import * as EthereumApi from '../../../../../../../../services/blockchain/ethereum/EthereumApi';

import '../AddListing/add-listing.scss';
import UnitDropdown from '../AddListing/components/UnitDropdown/UnitDropdown';
import {MANUAL_INPUT_VALUE} from "../../../../../../../../utils/constants";
import priorityFees from '../AddListing/priorityFees';

const iconSize = 42;

class MyListingsDefaults extends Component {
  static asyncValidate = async (values) => {
    try {
      const {
        price_using_btc,
        bitcoin_address,
        manual_bitcoin_address,
        price_using_eth,
        ethereum_address
      } = values;
      if (price_using_btc && manual_bitcoin_address) {
        await BitcoinApi.validateAddress(manual_bitcoin_address);
      }
      if (price_using_eth && ethereum_address) {
        await EthereumApi.validateEthereumAddress(ethereum_address);
      }
    } catch (e) {
      if (e === 'Invalid Ethereum Address') {
        throw Object.create({ ethereum_address: listingDefaultMessages.invalidAddress });
      } else {
        throw Object.create({ bitcoin_address: listingDefaultMessages.invalidAddress });
      }
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
    this.UnitDropdown = makeValidatableField(UnitDropdown);
    this.BitcoinWalletDropdown = makeValidatableField(BitcoinWalletDropdown);
    this.state = {
      keywords: '',
      isPromptVisible: false
    };
  }

  componentWillMount() {
    const {
      auth,
      account,
      ethereum,
      listingDefaults,
      preferences
    } = this.props;

    const data = {
      ...listingDefaults
    };
    if (listingDefaults.bitcoin_address) {
      if (this.isBtcAddressInWallet(listingDefaults.bitcoin_address)) {
        data.bitcoin_address = listingDefaults.bitcoin_address;
      } else {
        data.bitcoin_address = MANUAL_INPUT_VALUE;
        data.manual_bitcoin_address = listingDefaults.manual_bitcoin_address;
      }
    }
    if (listingDefaults.ethereum_address) {
      data.ethereum_address = listingDefaults.ethereum_address;
    } else {
      data.ethereum_address = account.ethAddress || auth.account.eth_address || ethereum.address;
    }
    if (typeof data.priority_fee === 'undefined' || data.priority_fee === '') {
      data.priority_fee = preferences.preferences.listingPriority;
    }
    this.props.initialize(data);
    this.props.listingDefaultsActions.loadListingDefault();
  }

  isBtcAddressInWallet(btc_address) {
    const { wallets } = this.props.bitcoin;
    return !!wallets.find(wallet => wallet.receiveAddress === btc_address);
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
    this.setState({
      isPromptVisible: false
    });

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

  onChange = () => {
    this.setState({ isPromptVisible: true });
  };

  defaultsForm() {
    const { formatMessage } = this.props.intl;
    const {
      account, auth, bitcoin, ethereum, handleSubmit,
    } = this.props;
    const {
      category,
      country,
      currency,
      price_using_btc,
      price_using_eth,
    } = this.props.formValues ? this.props.formValues : {};
    const btcWalletAddress = bitcoin.wallets.length ? bitcoin.wallets[0].receiveAddress : null;
    const ethWalletAddress = ethereum.address;

    return (
      <Form className="add-listing-form" onChange={() => this.setState({ isPromptVisible: true })} onSubmit={handleSubmit(this.submit.bind(this))}>
        <FormPrompt isVisible={this.state.isPromptVisible}/>
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
                  placeholder: formatMessage(addListingMessages.category),
                  disableAllOption: true
                }}
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={6} className="align-top">
              <Field
                name="subcategory"
                component={this.SubCategoryDropdown}
                props={{
                  placeholder: formatMessage(addListingMessages.subCategory),
                  parentCategory: category,
                  disableAllOption: true
                }}
                onChange={this.onChange}
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
                onChange={this.onChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(addListingMessages.additionalInfo)}</span>
            </Grid.Column>
            <Grid.Column width={6} className="align-top">
              <Field
                name="units"
                component={this.UnitDropdown}
                props={{
                  placeholder: formatMessage(addListingMessages.unitsOfMeasure)
                }}
                onChange={this.onChange}
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
                  label: formatMessage(addListingMessages.bitcoinPrice)
                }}
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name="price_using_eth"
                component={Checkbox}
                props={{
                  label: formatMessage(addListingMessages.ethereumPrice)
                }}
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Field
                name="price_using_omnicoin"
                component={Checkbox}
                props={{
                  label: formatMessage(addListingMessages.omnicoinPrice)
                }}
                onChange={this.onChange}
              />
            </Grid.Column>
          </Grid.Row>
          {(price_using_btc || currency === 'BITCOIN') &&
          <Grid.Row>
            <Grid.Column width={4}>
              {formatMessage(addListingMessages.bitcoinAddress)}
              <QuestionMark message={formatMessage(addListingMessages.bitcoinAddressTooltip)} />
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                name="bitcoin_address"
                component={this.BitcoinWalletDropdown}
                className="textfield"
              />
            </Grid.Column>
            {this.props.formValues.bitcoin_address === MANUAL_INPUT_VALUE &&
            <Grid.Column width={4}>
              <Field
                name="manual_bitcoin_address"
                component={InputField}
                className="textfield"
              />
            </Grid.Column>
            }
          </Grid.Row>
          }
          {(price_using_eth || currency === 'ETHEREUM') &&
          <Grid.Row>
            <Grid.Column width={4}>
              {formatMessage(addListingMessages.ethereumAddress)}
              <QuestionMark message={formatMessage(addListingMessages.ethereumAddressTooltip)} />
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                name="ethereum_address"
                component={InputField}
                className="textfield"
                value={account.ethAddress || auth.account.eth_address || ethWalletAddress}
                onChange={({ target: { value } }) => {
                  this.props.accountActions.setEthAddress(value);
                  this.onChange();
                }}
              />
            </Grid.Column>
          </Grid.Row>
          }

          <Grid.Row>
            <Grid.Column width={4}>
              <span>
                {formatMessage(addListingMessages.priorityFee)}
                <QuestionMark message={formatMessage(addListingMessages.priorityFeeTooltip)} />
              </span>
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                type="text"
                name="priority_fee"
                component={PriorityFeeDropdown}
                props={{
                  placeholder: formatMessage(addListingMessages.selectPriorityFee),
                  priorityFees
                }}
              />
            </Grid.Column>
          </Grid.Row>


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
                placeholder={formatMessage(addListingMessages.pleaseEnterDescription)}
                onChange={this.onChange}
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
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={8} className="align-top">
              <Field
                name="email"
                component={InputField}
                placeholder={formatMessage(addListingMessages.email)}
                className="textfield"
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
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="address"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(addListingMessages.address)}
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="city"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(addListingMessages.city)}
                onChange={this.onChange}
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
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="post_code"
                component="input"
                className="textfield"
                placeholder={formatMessage(addListingMessages.postalCode)}
                onChange={this.onChange}
              />
            </Grid.Column>
            <Grid.Column width={4} className="align-top">
              <Field
                type="text"
                name="phone"
                component={InputField}
                className="textfield"
                placeholder={formatMessage(addListingMessages.phone)}
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
    ethAddress: PropTypes.string,
  }),
  accountActions: PropTypes.shape({
    updatePublicData: PropTypes.func,
    setBtcAddress: PropTypes.func,
    setEthAddress: PropTypes.func,
  }),
  auth: PropTypes.shape({
    btc_address: PropTypes.string,
    eth_address: PropTypes.string,
  }),
  bitcoin: PropTypes.shape({
    wallets: PropTypes.array,
  }),
  ethereum: PropTypes.shape({
    wallet: PropTypes.object,
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
  ethereum: {},
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
      ethereum: state.default.ethereum,
      preferences: state.default.preferences,
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
        setEthAddress,
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'listingDefaultsForm',
    destroyOnUnmount: true,
    asyncValidate: MyListingsDefaults.asyncValidate,
    asyncBlurFields: ['manual_bitcoin_address', 'ethereum_address']
  })
)(injectIntl(MyListingsDefaults));
