import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Image, Dropdown, Button, Grid, Modal } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { toastr } from 'react-redux-toastr';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import CategoryDropdown from '../AddListing/components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from '../AddListing/components/SubCategoryDropdown/SubCategoryDropdown';
import CurrencyDropdown from '../AddListing/components/CurrencyDropdown/CurrencyDropdown';
import Checkbox from '../AddListing/components/Checkbox/Checkbox';
import Images, { getImageId } from '../AddListing/components/Images/Images';
import addListingMessages from '../AddListing/messages';
import listingDefaultMessages from './messages';

import {
  InputField,
  makeValidatableField
} from '../../../../../../../../components/ValidatableField/ValidatableField';

import {
  saveListingDefault
} from '../../../../../../../../services/listing/listingDefaultsActions';

import '../AddListing/add-listing.scss';

const iconSize = 42;

class MyListingsDefaults extends Component {
  constructor(props) {
    super(props);
    this.CategoryDropdown = makeValidatableField(CategoryDropdown);
    this.SubCategoryDropdown = makeValidatableField(SubCategoryDropdown);
    this.CurrencyDropdown = makeValidatableField(CurrencyDropdown);
    this.DescriptionInput = makeValidatableField((props) => (<textarea {...props} />));
  }

  componentWillMount() {
    const { listingDefaults } = this.props;
    this.props.initialize(listingDefaults);
  }

  submit(values) {
    const { saveListingDefault } = this.props.listingDefaultsActions;
    const { formatMessage } = this.props.intl;

    saveListingDefault({
      ...values,
      images: this.getImagesData()
    });

    this.showSuccessToast(
      formatMessage(listingDefaultMessages.success), 
      formatMessage(listingDefaultMessages.saveListingSuccessMessage)
    );
  }

  getImagesData() {
    const { images } = this.props.listingDefaults;

    const data = {};
    for (const imageId in images) {
      const imageItem = images[imageId];
      const {
        uploadError, path
      } = imageItem;
      if (uploadError || !path) {
        continue;
      }

      data[imageId] = { path };
    }

    return data;
  }

  showSuccessToast(title, message) {
    toastr.success(title, message);
  }

  defaultsForm() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { category } = this.props.formValues ? this.props.formValues : {};

    return (
      <Form className="add-listing-form" onSubmit={handleSubmit(this.submit.bind(this))}>
        <Grid>
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
                  placeholder: formatMessage(addListingMessages.currency)
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
              <Images />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(addListingMessages.location)}</span>
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
  listingDefaults: PropTypes.shape({
    images: PropTypes.object
  }).isRequired,
  listingDefaultsActions: PropTypes.shape({
    saveListingDefault: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  formValues: PropTypes.shape({
    category: PropTypes.string
  })
};

MyListingsDefaults.defaultProps = {
  formValues: {}
};

export default compose(
  connect(
    state => ({
      listingDefaults: state.default.listingDefaults,
      formValues: getFormValues('listingDefaultsForm')(state)
    }),
    (dispatch) => ({
      listingDefaultsActions: bindActionCreators({
        saveListingDefault
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'listingDefaultsForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(MyListingsDefaults));
