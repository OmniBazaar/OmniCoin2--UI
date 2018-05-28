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
    // const listing = myListings[id];
    const listing = {
      "images": [
        {
          "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/a06b1136-6090-4bbc-9581-1f0d0cb61cee.jpg",
          "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/a06b1136-6090-4bbc-9581-1f0d0cb61cee.jpg",
          "image_name": "a06b1136-6090-4bbc-9581-1f0d0cb61cee.jpg"
        },
        {
          "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/04c98ac5-acd1-4f2a-b6cc-bd81f62f32f0.jpeg",
          "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/04c98ac5-acd1-4f2a-b6cc-bd81f62f32f0.jpeg",
          "image_name": "04c98ac5-acd1-4f2a-b6cc-bd81f62f32f0.jpeg"
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
      "price": "100",
      "condition": "Service",
      "quantity": "10",
      "units": "Each",
      "start_date": "2018-05-24",
      "end_date": "2018-06-01",
      "keywords": [
        "abc",
        "xxx"
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