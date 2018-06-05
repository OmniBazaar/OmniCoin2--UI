import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Modal, Tab, Form, Button, Select, Image, Icon } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import FormInputWithIconOnRight 
from '../../../../components/FormInputWithIconOnRight/FormInputWithIconOnRight';
import Dropdown from './components/Dropdown';
import Checkbox from '../Marketplace/scenes/Listing/scenes/AddListing/components/Checkbox/Checkbox';
import messages from './messages';
import languages from './languages';
import votes from './votes';
import listingPriorities from './priorities';
import './preferences.scss';

class PreferencesTab extends Component {
  componentWillMount() {
    this.props.initialize({
      listingPriority: 'normal'
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="preferences-form-container">
        <Form onSubmit={this.onSubmit} className="preferences-form">
          <div className="form-group">
            <span>{formatMessage(messages.logoutTimeout)}</span>
            <Field
              name="logoutTimeout"
              placeholder={formatMessage(messages.logoutTimeout)}
              component={FormInputWithIconOnRight}
              className="textfield"
              props={{
                rightButtonText: formatMessage(messages.seconds)
              }}             
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.transactionFee)}</span>
            <Field
              name='transactionFee'
              placeholder={formatMessage(messages.transactionFee)}
              component={FormInputWithIconOnRight}
              className="textfield"
              props={{
                rightButtonText: formatMessage(messages.xomUnit)
              }}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.byDefaultVote)}</span>
            <Field
              name="vote"
              component={Dropdown}
              props={{
                options: votes
              }}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.interfaceLanguage)}</span>
            <Field
              name="language"
              component={Dropdown}
              props={{
                options: languages
              }}
            />
            <div className="col-1" />
          </div>
          <div className="form-group top">
            <span>{formatMessage(messages.referralProgram)}</span>
            <div className="check-form field">
              <div className="description">
                <div className="check-container">
                  <Field
                    name='isReferrer'
                    component={Checkbox}
                    props={{
                      label: ''
                    }}
                  />
                </div>
                <div className="description-text">
                  <p className="title">{formatMessage(messages.referralProgramTitle)}</p>
                  <div>
                    {formatMessage(messages.referralProgramText)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.priorityForListing)}</span>
            <Field
              name="listingPriority"
              component={Dropdown}
              props={{
                options: listingPriorities
              }}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.publisherFee)}</span>
            <Field
              name="publisherFee"
              placeholder={formatMessage(messages.publisherFee)}
              component={FormInputWithIconOnRight}
              className="textfield"
              props={{
                rightButtonText: formatMessage(messages.xomUnit)
              }}
            />
            <div className="col-1" />
          </div>
          <div className="form-group">
            <span>{formatMessage(messages.chargeFee)}</span>
            <Field
              type="text"
              name="chargeFee"
              component="input"
              className="textfield"
              placeholder={formatMessage(messages.chargeFee)}
            />
            <div className="col-1" />
          </div>
          <div className="form-group submit-group">
            <span />
            <div className="field">
              <Button type="submit" content={formatMessage(messages.update)} className="button--green-bg" />
            </div>
            <div className="col-1" />
          </div>
        </Form>
      </div>
    );
  }
}

PreferencesTab.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired
};

export default compose(
  connect(
    state => ({ ...state.default })
  ),
  reduxForm({
    form: 'preferencesForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(PreferencesTab));
