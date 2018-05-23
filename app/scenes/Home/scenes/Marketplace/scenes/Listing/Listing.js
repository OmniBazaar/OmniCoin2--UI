import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import ReactStars from 'react-stars';
import { Image, Button, Popup } from 'semantic-ui-react';
import NumericInput from 'react-numeric-input';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import Menu from '../../../Marketplace/scenes/Menu/Menu';
import CategoryHeader from '../../../Marketplace/scenes/CategoryHeader';
import PriceItem from './components/PriceItem';
import CoinTypes from './constants';
import { integerWithCommas } from '../../../../../../utils/numeric';
import UserIcon from './images/icn-users-review.svg';

import './listing.scss';

import {
  getListingDetail,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} from '../../../../../../services/listing/listingActions';

const iconSizeSmall = 12;
const isUserOwner = false;

const listing = {
  id: 1,
  status: 'active',
  name: 'Farco Jewelry',
  description: 'If this is the first time you have reached this screen, the OmniBazaar marketplace is currently being launched',
  date: '2018-04-03',
  category: 'For sale',
  subCategory: 'Design',
  seller: {
    username: 'eugen1879',
    phone: '+1 50112223',
    name: 'Eugen Davis',
    city: 'Clearwater',
    postalCode: '23587',
    address: '153 South Street, PO box 15648',
    rating: 4.5,
    totalVotes: 1244
  },
  condition: 'Good',
  location: 'Dover, DE, USA',
  price: 500,
  amountAvailable: 150,
  images: [
    {
      original: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg',
    },
    {
      original: 'https://cdn.pixabay.com/photo/2017/10/19/11/00/heart-2867205_1280.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2017/10/19/11/00/heart-2867205_1280.jpg',
    },
    {
      original: 'https://cdn.pixabay.com/photo/2017/10/29/20/27/necklace-with-winged-heart-2900736_1280.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2017/10/29/20/27/necklace-with-winged-heart-2900736_1280.jpg',
    },
    {
      original: 'https://cdn.pixabay.com/photo/2017/10/19/10/58/heart-2867197_1280.jpg',
      thumbnail: 'https://cdn.pixabay.com/photo/2017/10/19/10/58/heart-2867197_1280.jpg',
    },
  ]
};

const messages = defineMessages({
  seller: {
    id: 'Listing.seller',
    defaultMessage: 'Seller'
  },
  editListing: {
    id: 'Listing.editListing',
    defaultMessage: 'EDIT LISTING'
  },
  delete: {
    id: 'Listing.delete',
    defaultMessage: 'DELETE'
  },
  available: {
    id: 'Listing.available',
    defaultMessage: 'Available:'
  },
  itemDescription: {
    id: 'Listing.itemDescription',
    defaultMessage: 'Item Description'
  },
  preferredContact: {
    id: 'Listing.preferredContact',
    defaultMessage: 'Preferred Contact'
  },
  name: {
    id: 'Listing.name',
    defaultMessage: 'Name'
  },
  city: {
    id: 'Listing.city',
    defaultMessage: 'City'
  },
  postalCode: {
    id: 'Listing.postalCode',
    defaultMessage: 'Postal Code'
  },
  address: {
    id: 'Listing.address',
    defaultMessage: 'Address'
  },
  listingDate: {
    id: 'Listing.listingDate',
    defaultMessage: 'Listing date'
  },
  condition: {
    id: 'Listing.condition',
    defaultMessage: 'condition'
  },
  cityLocation: {
    id: 'Listing.cityLocation',
    defaultMessage: 'City of Specific Location'
  },
  itemPrice: {
    id: 'Listing.itemPrice',
    defaultMessage: 'Item Price'
  },
  selectCurrency: {
    id: 'Listing.selectCurrency',
    defaultMessage: 'Select Payment Currency'
  },
  buyNow: {
    id: 'Listing.buyNow',
    defaultMessage: 'BUY NOW'
  },
  report: {
    id: 'Listing.report',
    defaultMessage: 'REPORT'
  },
  addToFavorites: {
    id: 'Listing.addToFavorites',
    defaultMessage: 'ADD TO FAVORITES'
  },
  removeFromFavorites: {
    id: 'Listing.removeFromFavorites',
    defaultMessage: 'REMOVE FROM FAVORITES'
  },
});

class Listing extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.setGallerySize.bind(this));
    this.setGallerySize();
    this.props.listingActions.getListingDetail(listing);
    this.props.listingActions.getFavorites();
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    const { listingDetail, favoriteListings } = props.listing;

    if (listingDetail.id !== nextProps.listing.listingDetail.id ||
      favoriteListings.length !== nextProps.listing.favoriteListings.length) {
      props.listingActions.isFavorite(nextProps.listing.listingDetail.id);
    }
  }

  setGallerySize() {
    if (this.gallery) {
      this.gallery.children[0].lastChild.firstChild.style.height = `${this.gallery.offsetWidth}px`;
    }
  }

  editListing = () => {
  };

  deleteListing = () => {
  };

  renderUser(listingDetail) {
    const { formatMessage } = this.props.intl;

    return (
      <Popup
        trigger={<span className="username">{listingDetail.seller ? listingDetail.seller.username : null}</span>}
        hoverable
        basic
        on="hover"
        position="bottom left"
        wide="very"
        hideOnScroll
        className="user-menu"
      >
        <div className="contact-popup">
          <div className="info">
            <span>{formatMessage(messages.preferredContact)}</span>
            <span className="value">Phone: {listingDetail.seller ? listingDetail.seller.phone : null}</span>
          </div>
          <div className="two-column">
            <div className="info">
              <span>{formatMessage(messages.name)}</span>
              <span className="value">{listingDetail.seller ? listingDetail.seller.name : null}</span>
            </div>
            <div className="info">
              <span>{formatMessage(messages.city)}</span>
              <span className="value">{listingDetail.seller ? listingDetail.seller.city : null}</span>
            </div>
          </div>
          <div className="two-column">
            <div className="info">
              <span>{formatMessage(messages.postalCode)}</span>
              <span className="value">{listingDetail.seller ? listingDetail.seller.postalCode : null}</span>
            </div>
            <div className="info">
              <span>{formatMessage(messages.address)}</span>
              <span className="value">{listingDetail.seller ? listingDetail.seller.address : null}</span>
            </div>
          </div>
        </div>
      </Popup>
    );
  }

  renderOwnerButtons() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="buttons-wrapper">
        <Button
          onClick={() => this.editListing()}
          content={formatMessage(messages.editListing)}
          className="button--green-bg"
        />
        <Button
          onClick={() => this.deleteListing()}
          content={formatMessage(messages.delete)}
          className="button--gray-text"
        />
      </div>
    );
  }

  buyItem = () => {
  };

  addToFavorites = () => {
    const { props } = this;
    const { listingDetail } = props.listing;
    props.listingActions.addToFavorites(listingDetail);
  };

  removeFromFavorites = () => {
    const { props } = this;
    const { listingDetail } = props.listing;
    props.listingActions.removeFromFavorites(listingDetail.id);
  };

  reportListing = () => {
  };

  setItemsAmount = (valueAsNumber) => {
  };

  renderUserButtons(amountAvailable) {
    const { formatMessage } = this.props.intl;

    return (
      <div className="buttons-wrapper">
        <div className="buy-wrapper">
          <Button
            onClick={() => this.buyItem()}
            content={formatMessage(messages.buyNow)}
            className="button--green-bg"
          />
          <NumericInput
            mobile
            className="form-control"
            min={0}
            value={0}
            max={amountAvailable}
            onChange={(valueAsNumber) => this.setItemsAmount(valueAsNumber)}
          />
        </div>
        {this.props.listing.isFavorite ?
          <Button
            onClick={() => this.removeFromFavorites()}
            content={formatMessage(messages.removeFromFavorites)}
            className="button--transparent"
          />
          :
          <Button
            onClick={() => this.addToFavorites()}
            content={formatMessage(messages.addToFavorites)}
            className="button--transparent"
          />
        }
        <Button
          onClick={() => this.reportListing()}
          content={formatMessage(messages.report)}
          className="button--gray-text"
        />
      </div>
    );
  }

  renderGallery(listingDetail) {
    return (
      <div ref={gallery => { this.gallery = gallery; }} className="gallery-container">
        <ImageGallery
          items={listingDetail.images}
          showPlayButton={false}
          showFullscreenButton={false}
        />
      </div>
    );
  }

  renderItemDetails(listingDetail) {
    const { formatMessage } = this.props.intl;
    const statusClass = classNames({
      status: true,
      green: listingDetail.status === 'active',
      red: listingDetail.status === 'inactive',
    });

    return (
      <div className="item-description">
        <div>
          <span className={statusClass}>{listingDetail.status}</span>
        </div>
        <span className="title">{listingDetail.name}</span>
        <div className="seller-wrapper">
          <span>{formatMessage(messages.seller)}</span>
          <div className="seller-info">
            {this.renderUser(listingDetail)}
            <span className="rating">
              {listingDetail.seller ?
                <ReactStars
                  count={5}
                  size={16}
                  value={listingDetail.seller.rating}
                  color1="#f9d596"
                  color2="#fbae3c"
                  edit={false}
                />
                : null}
            </span>
            <div className="votes">
              <Image src={UserIcon} width={iconSizeSmall} height={iconSizeSmall} />
              <span className="total-votes">{listingDetail.seller ? integerWithCommas(listingDetail.seller.totalVotes) : null}</span>
            </div>
          </div>
        </div>
        <div className="details-wrapper">
          <div className="info">
            <span>{formatMessage(messages.listingDate)}</span>
            <span className="value">{listingDetail.date}</span>
          </div>
          <div className="info">
            <span>{formatMessage(messages.condition)}</span>
            <span className="value">{listingDetail.condition}</span>
          </div>
          <div className="info">
            <span>{formatMessage(messages.cityLocation)}</span>
            <span className="value">{listingDetail.location}</span>
          </div>
        </div>
        <div className="price-wrapper">
          <span>
            {isUserOwner ?
              formatMessage(messages.itemPrice)
              :
              formatMessage(messages.selectCurrency)
            }
          </span>
          <PriceItem amount="154.50" coinLabel={CoinTypes.OMNI_COIN} currency={CoinTypes.OMNI_CURRENCY} isUserOwner={isUserOwner} />
          <PriceItem amount="0.000000000485" coinLabel={CoinTypes.BIT_COIN} currency={CoinTypes.BIT_CURRENCY} isUserOwner={isUserOwner} />
          <PriceItem amount="4.50" coinLabel={CoinTypes.LOCAL} currency={CoinTypes.LOCAL_CURRENCY} isUserOwner={isUserOwner} />
        </div>
        {isUserOwner ?
          this.renderOwnerButtons()
          :
          this.renderUserButtons(listingDetail.amountAvailable)
        }
        <div className="availability">
          <span>{formatMessage(messages.available)}</span>
          <span>{listingDetail.amountAvailable}</span>
        </div>
      </div>
    );
  }

  render() {
    const { props } = this;
    const { listingDetail } = props.listing;
    const { formatMessage } = this.props.intl;

    /*
    const listingId = props.match.params.id;
    const name = props.match.params.name;
    const activeCategory = props.marketplace.activeCategory;
    */
    return (
      <div className="marketplace-container category-listing listing">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <CategoryHeader />
            </div>
          </div>
          <div className="listing-body">
            {this.renderGallery(listingDetail)}
            {this.renderItemDetails(listingDetail)}
          </div>
          <div className="listing-description">
            <span className="title">{formatMessage(messages.itemDescription)}</span>
            <p className="description">{listingDetail.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

Listing.propTypes = {
  listingActions: PropTypes.shape({
    getListingDetail: PropTypes.func,
    isFavorite: PropTypes.func,
    addToFavorites: PropTypes.func,
    removeFromFavorites: PropTypes.func,
    getFavorites: PropTypes.func,
  }),
  listing: PropTypes.shape({
    listingDetail: PropTypes.object,
    favoriteListings: PropTypes.array,
    isFavorite: PropTypes.bool,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Listing.defaultProps = {
  listingActions: {},
  listing: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      isFavorite,
      getListingDetail,
      addToFavorites,
      removeFromFavorites,
      getFavorites
    }, dispatch),
  }),
)(injectIntl(Listing));
