import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import ReactStars from 'react-stars';
import {
  Image,
  Button,
  Popup,
  Loader
} from 'semantic-ui-react';
import NumericInput from 'react-numeric-input';
import { toastr } from 'react-redux-toastr';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/scss/image-gallery.scss';

import Menu from '../../../Marketplace/scenes/Menu/Menu';
import CategoryHeader from '../../../Marketplace/scenes/CategoryHeader';
import PriceItem from './components/PriceItem';
import CoinTypes from './constants';
import { integerWithCommas } from '../../../../../../utils/numeric';
import UserIcon from './images/icn-users-review.svg';
import { currencyConverter } from "../../../../../../services/utils";

import './listing.scss';

import {
  getListingDetail,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isListingFine,
  setNumberToBuy,
  setActiveCurrency
} from '../../../../../../services/listing/listingActions';

const iconSizeSmall = 12;
const isUserOwner = false;

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
  addToFavorites: {
    id: 'Listing.addToFavorites',
    defaultMessage: 'ADD TO FAVORITES'
  },
  removeFromFavorites: {
    id: 'Listing.removeFromFavorites',
    defaultMessage: 'REMOVE FROM FAVORITES'
  },
  hashIsInvalid: {
    id: 'Listing.hashIsInvalid',
    defaultMessage: 'Listing is corrupted'
  },
  error: {
    id: 'Listing.error',
    defaultMessage: 'Error'
  },
  success: {
    id: 'Listing.success',
    defaultMessage: 'Success'
  }
});

class Listing extends Component {

  componentWillMount() {
    this.props.listingActions.getListingDetail(this.props.match.params.id);
    this.props.listingActions.setActiveCurrency(CoinTypes.LOCAL_CURRENCY);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setGallerySize.bind(this));
    this.setGallerySize();
    this.props.listingActions.getFavorites();
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    const {
      listingDetail,
      favoriteListings,
    } = props.listing;
    if (listingDetail && nextProps.listing.listingDetail) {
      if (listingDetail['listing_id'] !== nextProps.listing.listingDetail['listing_id'] ||
        favoriteListings.length !== nextProps.listing.favoriteListings.length) {
        props.listingActions.isFavorite(nextProps.listing.listingDetail['listing_id']);
      }
    }
    if (listingDetail !== nextProps.listing.listingDetail) {
      this.props.listingActions.isListingFine(nextProps.listing.listingDetail);
    }
    if (this.props.listing.buyListing.loading && !nextProps.listing.buyListing.loading) {
      const { error } = nextProps.listing.buyListing;
      if (error) {
        if (error === 'hash') {
           this.errorToast(messages.hashIsInvalid);
        } else {
           this.errorToast(messages.error);
        }
      }
    }
  }

  errorToast(message) {
    const { formatMessage } = this.props.intl;
    toastr.error(formatMessage(messages.error), formatMessage(message));
  }

  successToast(message) {
    const { formatMessage } = this.props.intl;
    toastr.success(formatMessage(messages.success), formatMessage(message));
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
        trigger={<span className="username">{listingDetail.owner}</span>}
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
            <span className="value">{listingDetail['contact_type']}</span>
          </div>
          <div className="two-column">
            <div className="info">
              <span>{formatMessage(messages.name)}</span>
              <span className="value">{listingDetail.name}</span>
            </div>
            <div className="info">
              <span>{formatMessage(messages.city)}</span>
              <span className="value">{listingDetail.city}</span>
            </div>
          </div>
          <div className="two-column">
            <div className="info">
              <span>{formatMessage(messages.postalCode)}</span>
              <span className="value">{listingDetail['post_code']}</span>
            </div>
            <div className="info">
              <span>{formatMessage(messages.address)}</span>
              <span className="value">{listingDetail.address}</span>
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
    const { listingDetail } = this.props.listing;
    if (this.props.listing.buyListing.activeCurrency === CoinTypes.OMNI_COIN) {
      const type = CoinTypes.OMNI_COIN;
      const listingId = this.props.listing.buyListing.blockchainListing.id;
      const price = currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'OMC');
      const number =  this.props.listing.buyListing.numberToBuy;
      const to = listingDetail.owner;
      this.props.history.push(`/transfer?listing_id=${listingId}&price=${price}&to=${to}&type=${type}&number=${number}`)
    }
    if (this.props.listing.buyListing.activeCurrency === CoinTypes.BIT_COIN) {
      const type = CoinTypes.BIT_COIN;
      const listingId = this.props.listing.buyListing.blockchainListing.id;
      const price = currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'BTC');
      const number = this.props.listing.buyListing.numberToBuy;
      const to = listingDetail['bitcoin_address'];
      this.props.history.push(`/transfer?listing_id=${listingId}&price=${price}&to=${to}&type=${type}&number=${number}`)
    }
  };

  addToFavorites = () => {
    const { props } = this;
    const { listingDetail } = props.listing;
    props.listingActions.addToFavorites(listingDetail);
  };

  removeFromFavorites = () => {
    const { props } = this;
    const { listingDetail } = props.listing;
    props.listingActions.removeFromFavorites(listingDetail['listing_id']);
  };

  setItemsAmount = (valueAsNumber) => {
    this.props.listingActions.setNumberToBuy(valueAsNumber);
  };

  renderUserButtons(amountAvailable) {
    const { formatMessage } = this.props.intl;
    const { buyListing } = this.props.listing;
    const { quantity } = this.props.listing.buyListing;
    return (
      <div className="buttons-wrapper">
        <div className="buy-wrapper">
          <Button
            onClick={() => this.buyItem()}
            content={formatMessage(messages.buyNow)}
            className="button--green-bg"
            loading={buyListing.loading}
            disabled={!!buyListing.error}
          />
          <NumericInput
            mobile
            className="form-control"
            min={0}
            value={1}
            max={quantity}
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

      </div>
    );
  }

  renderGallery(listingDetail) {
    return (
      <div ref={gallery => { this.gallery = gallery; }} className="gallery-container">
        <ImageGallery
          items={listingDetail.images.map(image => ({
            original: `http://${listingDetail.ip}/publisher-images/${image.path}`,
            thumbnail: `http://${listingDetail.ip}/publisher-images/${image.thumb}`
            })
          )}
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
        <span className="title">{listingDetail.title}</span>
        <div className="seller-wrapper">
          <span>{formatMessage(messages.seller)}</span>
          <div className="seller-info">
            {this.renderUser(listingDetail)}
            <span className="rating">
                <ReactStars
                  count={5}
                  size={16}
                  value={listingDetail.reputationScore * 100 / 5}
                  color1="#f9d596"
                  color2="#fbae3c"
                  edit={false}
                />
            </span>
            <div className="votes">
              <span className="total-votes">{integerWithCommas(listingDetail.reputationVotesCount)}</span>
              <Image src={UserIcon} width={iconSizeSmall} height={iconSizeSmall} />
            </div>
          </div>
        </div>
        <div className="details-wrapper">
          <div className="info">
            <span>{formatMessage(messages.listingDate)}</span>
            <span className="value">{listingDetail['end_date']}</span>
          </div>
          <div className="info">
            <span>{formatMessage(messages.condition)}</span>
            <span className="value">{listingDetail['condition']}</span>
          </div>
          <div className="info">
            <span>{formatMessage(messages.cityLocation)}</span>
            <span className="value">{listingDetail['city']}</span>
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
          {listingDetail['price_using_omnicoin'] &&
              <PriceItem amount={currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'OMC')}
                         coinLabel={CoinTypes.OMNI_COIN}
                         currency={CoinTypes.OMNI_CURRENCY}
                         isUserOwner={isUserOwner}/>
          }
          {listingDetail['price_using_btc'] &&
            <PriceItem amount={currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'BTC')}
                       coinLabel={CoinTypes.BIT_COIN}
                       currency={CoinTypes.BIT_CURRENCY}
                       isUserOwner={isUserOwner}/>
          }
          <PriceItem
            amount={listingDetail.price}
            coinLabel={CoinTypes.LOCAL}
            currency={listingDetail['currency']}
            isUserOwner={isUserOwner}
          />
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
    const { listingDetail } = this.props.listing;
    const { formatMessage } = this.props.intl;


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
          {!listingDetail
            ?
            <Loader active inline/>
            :
            [
              <div className="listing-body">
                {this.renderGallery(listingDetail)}
                {this.renderItemDetails(listingDetail)}
              </div>,
              <div className="listing-description">
                <span className="title">{formatMessage(messages.itemDescription)}</span>
                <p className="description">{listingDetail.description}</p>
              </div>
            ]
          }

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

Listing = withRouter(Listing);

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      isFavorite,
      getListingDetail,
      addToFavorites,
      removeFromFavorites,
      getFavorites,
      isListingFine,
      setNumberToBuy,
      setActiveCurrency
    }, dispatch),
  }),
)(injectIntl(Listing));
