import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
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

import ConfirmationModal from '../../../../../../components/ConfirmationModal/ConfirmationModal';
import Menu from '../../../Marketplace/scenes/Menu/Menu';
import Breadcrumb from '../../../Marketplace/scenes/Breadcrumb/Breadcrumb';
import PriceItem from './components/PriceItem';
import CoinTypes from './constants';
import { integerWithCommas } from '../../../../../../utils/numeric';
import UserIcon from './images/icn-users-review.svg';
import { currencyConverter } from '../../../../../../services/utils';

import messages from './messages';
import './listing.scss';

import {
  getListingDetail,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isListingFine,
  setNumberToBuy,
  setActiveCurrency,
  deleteListing
} from '../../../../../../services/listing/listingActions';

const iconSizeSmall = 12;

class Listing extends Component {

  state = {
    confirmDeleteOpen: false
  };

  componentWillMount() {
    this.props.listingActions.getListingDetail(this.props.match.params.id);
    this.props.listingActions.setActiveCurrency(CoinTypes.LOCAL);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setGallerySize.bind(this));
    setTimeout(() => {
      this.setGallerySize();
    }, 100);
    this.props.listingActions.getFavorites();
    this.props.listingActions.isFavorite(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    const {
      listingDetail,
      listingDetailRequest,
      favoriteListings,
    } = props.listing;

    if (listingDetailRequest.loading && !nextProps.listing.listingDetailRequest.loading) {
      if (nextProps.listing.listingDetailRequest.error) {
        this.errorToast(messages.loadListingError);
      }
    }

    if (listingDetail && nextProps.listing.listingDetail) {
      if (listingDetail.listing_id !== nextProps.listing.listingDetail.listing_id ||
        favoriteListings.length !== nextProps.listing.favoriteListings.length) {
        props.listingActions.isFavorite(nextProps.listing.listingDetail.listing_id);
      }
    }
    if (listingDetail !== nextProps.listing.listingDetail) {
      this.props.listingActions.isListingFine(nextProps.listing.listingDetail);
      if (nextProps.listing.listingDetail && nextProps.listing.listingDetail.quantity === 0) {
        this.errorToast(messages.outOfStock);
      }
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
    if (this.props.listing.deleteListing.deleting && !nextProps.listing.deleteListing.deleting) {
      if (nextProps.listing.deleteListing.error) {
        this.errorToast(messages.deleteListingError);
      } else {
        this.props.history.push('/listings');
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

  isOwner() {
    return this.props.listing.listingDetail.owner === this.props.auth.currentUser.username;
  }

  setGallerySize() {
    if (this.gallery) {
      this.gallery.children[0].lastChild.firstChild.style.height = `${this.gallery.offsetWidth}px`;
    }
  }


  editListing = () => {
    const { history } = this.props;
    history.push(`/edit-listing/${this.props.listing.listingDetail.listing_id}`);
  };

  deleteListing = () => {
    this.setState({
      confirmDeleteOpen: true
    });
  };

  onOkDelete() {
    this.closeConfirm();
    const { listingDetail } = this.props.listing;
    this.props.listingActions.deleteListing({publisher_ip: listingDetail.ip }, listingDetail);
  }

  closeConfirm() {
    this.setState({
      confirmDeleteOpen: false
    });
  }

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
    const { deleting } = this.props.listing.deleteListing;
    return (
      <div className="buttons-wrapper">
        <Button
          onClick={() => this.editListing()}
          content={formatMessage(messages.editListing)}
          className="button--green-bg"
          loading={deleting}
        />
        <Button
          onClick={() => this.deleteListing()}
          content={formatMessage(messages.delete)}
          className="button--gray-text"
          loading={deleting}
        />
      </div>
    );
  }

  buyItem = () => {
    const { listingDetail } = this.props.listing;
    const { activeCurrency } = this.props.listing.buyListing;
    if (activeCurrency === CoinTypes.OMNI_COIN || activeCurrency === CoinTypes.LOCAL) {
      const type = CoinTypes.OMNI_COIN;
      const listingId = this.props.listing.buyListing.blockchainListing.id;
      const price = currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'OMNICOIN').toFixed(2);
      const number =  this.props.listing.buyListing.numberToBuy;
      const to = listingDetail.owner;
      this.props.history.push(`/transfer?listing_id=${listingId}&price=${price}&to=${to}&type=${type}&number=${number}`)
    }
    if (activeCurrency === CoinTypes.BIT_COIN) {
      const type = CoinTypes.BIT_COIN;
      const listingId = this.props.listing.buyListing.blockchainListing.id;
      const price = currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'BITCOIN').toFixed(9);
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

  setItemsAmount = (valueAsNumber, max) => {
    let v = valueAsNumber;
    if (v > max) {
      v = max;
    } else if (v < 1) {
      v = 1;
    }

    this.props.listingActions.setNumberToBuy(v);
  };

  renderUserButtons(maxQuantity) {
    const { formatMessage } = this.props.intl;
    const { loading, error, numberToBuy } = this.props.listing.buyListing;
    return (
      <div className="buttons-wrapper">
        <div className="buy-wrapper">
          <Button
            onClick={() => this.buyItem()}
            content={formatMessage(messages.buyNow)}
            className="button--green-bg"
            loading={loading}
            disabled={!!error || maxQuantity === 0}
          />
          <NumericInput
            mobile
            className="form-control"
            min={1}
            value={numberToBuy}
            max={maxQuantity}
            onChange={(valueAsNumber) => this.setItemsAmount(valueAsNumber, maxQuantity)}
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

  getLocation(listingDetail) {
    const locations = [];
    const keys = ['city', 'state', 'country'];
    keys.forEach(k => {
      if (listingDetail[k]) {
        locations.push(listingDetail[k]);
      }
    });
    return locations.join(', ');
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
        <span className="title">{listingDetail.listing_title}</span>
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
            <span className="value">{listingDetail['start_date']}</span>
          </div>
          <div className="info">
            <span>{formatMessage(messages.condition)}</span>
            <span className="value">{listingDetail['condition']}</span>
          </div>
          <div className="info">
            <span>{formatMessage(messages.cityLocation)}</span>
            <span className="value">{ this.getLocation(listingDetail) }</span>
          </div>
        </div>
        <div className="price-wrapper">
          <span>
            {this.isOwner() ?
              formatMessage(messages.itemPrice)
              :
              formatMessage(messages.selectCurrency)
            }
          </span>
          {listingDetail['price_using_omnicoin'] &&
              <PriceItem amount={currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'OMNICOIN').toFixed(2)}
                         coinLabel={CoinTypes.OMNI_COIN}
                         currency={CoinTypes.OMNI_CURRENCY}
                         isUserOwner={this.isOwner()}/>
          }
          {listingDetail['price_using_btc'] &&
            <PriceItem amount={currencyConverter(Number.parseFloat(listingDetail.price), listingDetail['currency'], 'BITCOIN').toFixed(8)}
                       coinLabel={CoinTypes.BIT_COIN}
                       currency={CoinTypes.BIT_CURRENCY}
                       isUserOwner={this.isOwner()}/>
          }
          {!(listingDetail['currency'] === 'OMNICOIN' && listingDetail['price_using_omnicoin']) &&
            <PriceItem
              amount={listingDetail.price}
              coinLabel={CoinTypes.LOCAL}
              currency={listingDetail['currency']}
              isUserOwner={this.isOwner()}
            />
          }
        </div>
        {this.isOwner() ?
          this.renderOwnerButtons()
          :
          this.renderUserButtons(listingDetail.quantity)
        }
        <div className="availability">
          <span>{formatMessage(messages.available)}</span>
          <span>{listingDetail.quantity + ' ' + listingDetail.units}</span>
        </div>
      </div>
    );
  }

  renderDetail() {
    const { listingDetail } = this.props.listing;
    const { formatMessage } = this.props.intl;

    if (!listingDetail) {
      return null;
    }

    return [
      <Breadcrumb category={listingDetail.category} subCategory={listingDetail.subcategory} />,
      <div className="listing-body detail">
        {this.renderGallery(listingDetail)}
        {this.renderItemDetails(listingDetail)}
      </div>,
      <div className="listing-description">
        <span className="title">{formatMessage(messages.itemDescription)}</span>
        <p className="description">{listingDetail.description}</p>
      </div>
    ];
  }

  render() {
    const { listingDetailRequest } = this.props.listing;
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container category-listing listing">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          {
            listingDetailRequest.loading ?
              <div className="loader-container">
                <Loader active inline>{formatMessage(messages.loadListing)}</Loader>
              </div> :
            this.renderDetail()
          }
          <ConfirmationModal
            onApprove={() => this.onOkDelete()}
            onCancel={() => this.closeConfirm()}
            isOpen={this.state.confirmDeleteOpen}
          />
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
  }).isRequired,
  listing: PropTypes.shape({
    listingDetail: PropTypes.object,
    listingDetailRequest: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.bool
    }),
    favoriteListings: PropTypes.array,
    isFavorite: PropTypes.bool,
    buyListing: PropTypes.shape({
      activeCurrency: PropTypes.string,
      loading: PropTypes.bool,
      numberToBuy: PropTypes.number,
      quantity: PropTypes.number,
      blockchainListing: PropTypes.object,
      error: PropTypes.object
    })
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
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
      setActiveCurrency,
      deleteListing
    }, dispatch),
  }),
)(injectIntl(Listing));
