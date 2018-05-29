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
  render() {
    const { formatMessage } = this.props.intl;
    const { id } = this.props.match.params;
    const { myListings } = this.props;
    // const listing = myListings[id];http://127.0.0.1:8181/images/
    const listing = {
      "images": [
        {
          "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/d1c624e0-ebfd-4aed-bacf-f497722605c9.jpg",
          "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/d1c624e0-ebfd-4aed-bacf-f497722605c9.jpg",
          "image_name": "d1c624e0-ebfd-4aed-bacf-f497722605c9.jpg"
        },
        {
          "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/dc8b48d6-e941-47ae-8bc9-c9376fc27654.jpeg",
          "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/dc8b48d6-e941-47ae-8bc9-c9376fc27654.jpeg",
          "image_name": "dc8b48d6-e941-47ae-8bc9-c9376fc27654.jpeg"
        },
        {
          "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/5492e892-9cf1-4617-9c94-37c29ba14cfd.jpeg",
          "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/5492e892-9cf1-4617-9c94-37c29ba14cfd.jpeg",
          "image_name": "5492e892-9cf1-4617-9c94-37c29ba14cfd.jpeg"
        }
      ],
      "_id": "2525b0e8-410d-48ca-8d48-19917cda77a9",
      "contact_type": "OmniMessage",
      "contact_info": "tutran19",
      "price_using_btc": false,
      "price_using_omnicoin": false,
      "continuous": false,
      "listing_title": "Test",
      "category": "services",
      "subcategory": "beautyPersonal",
      "currency": "USD",
      "price": "200",
      "condition": "Service",
      "quantity": "12",
      "units": "Each",
      "start_date": "2018-05-24",
      "end_date": "2018-06-01",
      "keywords": [
        "abc",
        "xxx",
        "yyy"
      ],
      "description": "This is test 1\nThis is test 2",
      "name": "Tu Tran",
      "country": "Åland Islands",
      "address": "123 abc",
      "city": "AAAA",
      "state": "Finström",
      "post_code": "12345",
      "listing_type": "Listing",
      "listing_uuid": "testuuid",
      "owner": "tutran19",
      "listing_id": "Listing|2525b0e8-410d-48ca-8d48-19917cda77a9"
    };

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
            { listing && <ListingForm editingListing={listing} /> }
            { !listing &&
              <div className='not-found'>
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
  myListings: PropTypes.object.isRequired
};

const mapState = state => {
  return {
    myListings: state.default.listing.myListings
  };  
}

export default connect(mapState)(injectIntl(EditListing));