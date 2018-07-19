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

class EditListing extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    const { myListings } = this.props;
    this.listing = myListings.find(el => el.listing_id === id);
    if (!this.listing) {
      this.listing = this.props.listingDetail;
    }
  }

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
                <span className="child">{formatMessage(messages.editListing)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            { this.listing && <ListingForm editingListing={this.listing} /> }
            { !this.listing &&
              <div className="not-found">
                {formatMessage(messages.listingNotFound)}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

EditListing.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  myListings: PropTypes.object,
  listingDetail: PropTypes.object
};

const mapState = state => ({
  myListings: state.default.listing.myListings,
  listingDetail: state.default.listing.listingDetail
});

export default connect(mapState)(injectIntl(EditListing));
