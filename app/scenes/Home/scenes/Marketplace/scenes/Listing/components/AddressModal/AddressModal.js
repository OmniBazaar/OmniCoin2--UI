import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import { Modal, Form, Button, Grid } from 'semantic-ui-react';
import { Field, reduxForm, getFormValues, change } from 'redux-form';
import { required } from 'redux-form-validators';
import ConfirmationModal from '../../../../../../../../components/ConfirmationModal/ConfirmationModal';

import CountryDropdown from '../../scenes/AddListing/components/CountryDropdown/CountryDropdown';
import StateDropdown from '../../scenes/AddListing/components/StateDropdown/StateDropdown';
import Checkbox from '../../scenes/AddListing/components/Checkbox/Checkbox';
import {
  InputField,
  makeValidatableField
} from '../../../../../../../../components/ValidatableField/ValidatableField';

import listingMessages from '../../messages';
import messages from '../../scenes/AddListing/messages';

import './style.scss';

const requiredFieldValidator = required({ message: messages.fieldRequired });

class AddressModal extends Component {
  constructor(props) {
    super(props);
    this.CountryDropdown = makeValidatableField(CountryDropdown);
    this.StateDropdown = makeValidatableField(StateDropdown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen && !this.props.isOpen) {
      this.props.reset();
      this.props.initialize(nextProps.transfer.defaultShippingAddress);
    }
  }

  onCountryChange() {
    this.props.formActions.change('state', '');
  }

  submit(values) {
    const { saveAsDefault, ...data } = values; 
    this.props.onSave(data, saveAsDefault);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      invalid,
      handleSubmit,
      isOpen,
      onCancel
    } = this.props;

    const {
      country
    } = this.props.formValues ? this.props.formValues : {};

    return (
      <Modal open={isOpen} onClose={onCancel} className="confirmation-modal address-confirm-modal" closeIcon>
        <Modal.Header>
          {formatMessage(listingMessages.yourAddress)}
        </Modal.Header>
        <Modal.Content>
          <div className='head-msg'>
            <div>{formatMessage(listingMessages.enterShippingAddress)}</div>
            <div>{formatMessage(listingMessages.shippingAddressNote)}</div>
          </div>
          <Form className="address-form" onSubmit={handleSubmit(this.submit.bind(this))}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={2}>
                  <span>{formatMessage(messages.location)}*</span>
                </Grid.Column>
                <Grid.Column width={4} className="align-top">
                  <Field
                    name="country"
                    component={this.CountryDropdown}
                    props={{
                      placeholder: formatMessage(messages.country)
                    }}
                    onChange={this.onCountryChange.bind(this)}
                    validate={[requiredFieldValidator]}
                  />
                </Grid.Column>
                <Grid.Column width={5} className="align-top">
                  <Field
                    type="text"
                    name="address"
                    component={InputField}
                    className="textfield"
                    placeholder={formatMessage(messages.address)}
                    validate={[requiredFieldValidator]}
                  />
                </Grid.Column>
                <Grid.Column width={5} className="align-top">
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
                <Grid.Column width={2} />
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
                <Grid.Column width={5} className="align-top">
                  <Field
                    type="text"
                    name="postalCode"
                    component={InputField}
                    className="textfield"
                    placeholder={formatMessage(messages.postalCode)}
                    validate={[requiredFieldValidator]}
                  />
                </Grid.Column>
                <Grid.Column width={5} className='default-check'>
                  <Field
                    name="saveAsDefault"
                    component={Checkbox}
                    props={{
                      label: formatMessage(messages.saveAsDefault)
                    }}
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={16}>
                  <div className='actions'>
                    <Button
                      type="button"
                      content={formatMessage(listingMessages.cancel)}
                      className="button--transparent"
                      onClick={onCancel}
                    />
                    <Button
                      type="submit"
                      content={formatMessage(listingMessages.save)}
                      className="button--green-bg"
                      disabled={invalid}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

AddressModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  formValues: PropTypes.object.isRequired
};

export default compose(
  reduxForm({
    form: 'addressForm',
    destroyOnUnmount: true
  }),
  connect(
    state => ({
      formValues: getFormValues('addressForm')(state),
      transfer: state.default.transfer
    }),
    dispatch => ({
      formActions: bindActionCreators({
        change: (field, value) => change('addressForm', field, value)
      }, dispatch)
    })
  )
)(injectIntl(AddressModal));
