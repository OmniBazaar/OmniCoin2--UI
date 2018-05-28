import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon } from 'semantic-ui-react';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import ListingForm from './ListingForm';
import messages from './messages';

import './add-listing.scss';

const iconSize = 42;

class AddListing extends Component {
  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container category-listing add-listing" style={{ position: 'relative' }}>
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
            <ListingForm />
          </div>
        </div>
      </div>
    );
  }
}

AddListing.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired
};

export default injectIntl(AddListing);