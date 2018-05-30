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
            "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/76ff6818-5471-4d36-be0f-60651a9a86e0.png",
            "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/76ff6818-5471-4d36-be0f-60651a9a86e0.png",
            "image_name": "76ff6818-5471-4d36-be0f-60651a9a86e0.png"
          },
          {
            "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/6afa054b-0d5d-48ea-9b7b-12269c02b750.jpg",
            "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/6afa054b-0d5d-48ea-9b7b-12269c02b750.jpg",
            "image_name": "6afa054b-0d5d-48ea-9b7b-12269c02b750.jpg"
          },
          {
            "path": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/68155f99-f896-46e4-abbc-f19aecdac87b.jpeg",
            "thumb": "http://127.0.0.1:8181/images/b33e281d5e7a356198d89e3e3767d702fbda1878/thumbs/68155f99-f896-46e4-abbc-f19aecdac87b.jpeg",
            "image_name": "68155f99-f896-46e4-abbc-f19aecdac87b.jpeg"
          }
        ],
        "keywords": [
          "listing default"
        ],
        "_id": "9b21826f-9b0a-4d0d-826e-2a96f3152516",
        "contact_type": "OmniMessage",
        "contact_info": "tutran19",
        "price_using_btc": true,
        "price_using_omnicoin": true,
        "continuous": false,
        "category": "services",
        "subcategory": "beautyPersonal",
        "currency": "JPY",
        "description": "This is default description",
        "address": "123 ABC",
        "city": "DN",
        "post_code": "111111",
        "listing_title": "Listing Default",
        "price": "200",
        "condition": "Like-new",
        "quantity": "100",
        "units": "Each",
        "start_date": "2018-05-30",
        "end_date": "2018-06-09",
        "name": "Tu Tran",
        "country": "Anguilla",
        "state": "Anguillita Island",
        "listing_type": "Listing",
        "listing_uuid": "testuuid",
        "owner": "tutran19",
        "listing_id": "Listing|9b21826f-9b0a-4d0d-826e-2a96f3152516"
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