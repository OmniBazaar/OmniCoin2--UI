import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
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
import AddressModal from './components/AddressModal/AddressModal';
import CoinTypes from './constants';
import { integerWithCommas } from '../../../../../../utils/numeric';
import UserIcon from './images/icn-users-review.svg';
import { currencyConverter } from '../../../../../../services/utils';
import ObNet from '../../../../../../assets/images/ob-net.png';

import messages from './messages';
import listingFormMessages from './scenes/AddListing/messages';
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
  deleteListing,
  reportListing
} from '../../../../../../services/listing/listingActions';

import { setBuyerAddress } from '../../../../../../services/transfer/transferActions';

const iconSizeSmall = 12;

class Listing extends Component {
  state = {
    confirmDeleteOpen: false,
    confirmReportOpen: false,
    addressModalOpen: false
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
      if (nextProps.listing.listingDetail && !nextProps.listing.listingDetail.existsInBlockchain) {
        this.warningToast(messages.notInBlockchain);
      } else if (nextProps.listing.listingDetail && nextProps.listing.listingDetail.quantity === 0) {
        this.errorToast(messages.outOfStock);
      } else {
        this.props.listingActions.isListingFine(nextProps.listing.listingDetail);
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
    if (this.props.listing.reportListing.reporting && !nextProps.listing.reportListing.reporting) {
      if (nextProps.listing.reportListing.error) {
        const { error } = nextProps.listing.reportListing;
        if (error.indexOf('Proof of Participation score is too low.') !== -1) {
          this.errorToast(messages.reportListingErrorPopScore);
        } else {
          this.errorToast(messages.reportListingError);
        }
      } else {
        this.successToast(messages.reportListingSuccess);
        this.props.listingActions.getListingDetail(this.props.match.params.id);
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

  warningToast(message) {
    const { formatMessage } = this.props.intl;
    toastr.warning(formatMessage(messages.warning), formatMessage(message));
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

  reportListing = () => {
    this.setState({
      confirmReportOpen: true
    });
  };

  onOkDelete() {
    this.closeConfirm();
    const { listingDetail } = this.props.listing;
    this.props.listingActions.deleteListing({ publisher_ip: listingDetail.ip }, listingDetail);
  }

  onOkReport() {
    this.closeConfirm();
    const { listingDetail } = this.props.listing;
    this.props.listingActions.reportListing(listingDetail.listing_id);
  }

  closeConfirm() {
    this.setState({
      confirmDeleteOpen: false,
      confirmReportOpen: false
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
            <span className="value">{listingDetail.contact_type}</span>
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
              <span className="value">{listingDetail.post_code}</span>
            </div>
            <div className="info">
              <span>{formatMessage(messages.address)}</span>
              <span className="value">{listingDetail.address}</span>
            </div>
          </div>
          <Link to={{
            pathname: '/mail',
            username: listingDetail.owner
          }}
          >
            <div className="contact-seller">
              <span>{formatMessage(messages.contactSeller)}</span>
            </div>
          </Link>
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

  getOmnicoinPrice(listingDetail) {
    let amount = currencyConverter(Number.parseFloat(listingDetail.price), listingDetail.currency, 'OMNICOIN');
    amount = Math.ceil(amount * Math.pow(10, 5));
    amount = (amount / Math.pow(10, 5)).toFixed(5);

    return amount;
  }

  getBitcoinPrice(listingDetail) {
    let amount = currencyConverter(Number.parseFloat(listingDetail.price), listingDetail.currency, 'BITCOIN');
    amount = Math.ceil(amount * Math.pow(10, 8));
    amount = (amount / Math.pow(10, 8)).toFixed(8);
    amount = parseFloat(amount);

    return amount;
  }

  getEthereumPrice(listingDetail) {
    let amount = currencyConverter(Number.parseFloat(listingDetail.price), listingDetail.currency, 'ETHEREUM');
    amount = Math.ceil(amount * Math.pow(10, 18));
    amount = (amount / Math.pow(10, 18));
    amount = parseFloat(amount);

    return amount;
  }

  buyItem = () => {
    const { listingDetail } = this.props.listing;
    const { owner, currency, price, listing_title, bitcoin_address, ethereum_address } = listingDetail;
    const { activeCurrency } = this.props.listing.buyListing;
    const listingId = this.props.listing.buyListing.blockchainListing.id;
    const number = this.props.listing.buyListing.numberToBuy;
    if (activeCurrency === CoinTypes.LOCAL) {
      let url = `/transfer?listing_id=${listingId}&price=${price}&seller_name=${owner}&number=${number}&currency=${currency}&title=${listing_title}`;
      if (currency === 'BITCOIN') {
        url += `&type=${CoinTypes.BIT_COIN}&bitcoin_address=${bitcoin_address}`
      } else if (currency === 'ETHEREUM') {
        url += `&type=${CoinTypes.ETHEREUM}&ethereum_address=${ethereum_address}`
      } else {
        url += `&type=${CoinTypes.OMNI_COIN}`;
      }
      this.props.history.push(url);
    }
    if (activeCurrency === CoinTypes.OMNI_COIN) {
      this.props.history.push(`/transfer?listing_id=${listingId}&price=${price}&seller_name=${owner}&type=${CoinTypes.OMNI_COIN}&number=${number}&currency=${currency}&title=${listing_title}`);
    }
    if (activeCurrency === CoinTypes.BIT_COIN) {
      this.props.history.push(`/transfer?listing_id=${listingId}&price=${price}&seller_name=${owner}&bitcoin_address=${bitcoin_address}&type=${CoinTypes.BIT_COIN}&number=${number}&currency=${currency}&title=${listing_title}`);
    }
    if (activeCurrency === CoinTypes.ETHEREUM) {
      this.props.history.push(`/transfer?listing_id=${listingId}&price=${price}&seller_name=${owner}&ethereum_address=${ethereum_address}&type=${CoinTypes.ETHEREUM}&number=${number}&currency=${currency}&title=${listing_title}`);
    }
  };

  addToFavorites = () => {
    const { listingDetail } = this.props.listing;
    this.props.listingActions.addToFavorites(listingDetail);
  };

  removeFromFavorites = () => {
    const { listingDetail } = this.props.listing;
    this.props.listingActions.removeFromFavorites(listingDetail.listing_id);
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

  onBuyClick() {
    this.setState({addressModalOpen: true});
  }

  onCancelBuyerAddress() {
    this.setState({addressModalOpen: false});
  }

  onSaveBuyerAddress(address) {
    this.props.transferActions.setBuyerAddress(address);
    this.buyItem();
  }

  renderUserButtons(maxQuantity) {
    const { formatMessage } = this.props.intl;
    const { loading, error, numberToBuy } = this.props.listing.buyListing;
    const { listingDetail } = this.props.listing;
    const { existsInBlockchain, isReportedByCurrentUser } = listingDetail;
    const disabled = !!error || maxQuantity === 0 || !listingDetail.existsInBlockchain;
    const disableReportBtn = isReportedByCurrentUser || !existsInBlockchain;

    return (
      <div className="buttons-wrapper">
        <div className="buy-wrapper">
          <Button
            onClick={this.onBuyClick.bind(this)}
            content={formatMessage(messages.buyNow)}
            className="button--green-bg"
            loading={loading}
            disabled={disabled}
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
        <Button
          onClick={() => this.reportListing()}
          content={disableReportBtn ?
            formatMessage(messages.reported) :
              formatMessage(messages.report)}
          loading={this.props.listing.reportListing.reporting}
          disabled={disableReportBtn}
          className="button--gray-text"
        />
      </div>
    );
  }

  renderGallery(listingDetail) {

    let items = listingDetail.images.map(image => ({
      original: `http://${listingDetail.ip}/publisher-images/${image.path}`,
      thumbnail: `http://${listingDetail.ip}/publisher-images/${image.thumb}`
    }));

    if (!listingDetail.images.length) {
      items = [{
        original: ObNet,
        thumbnail: ObNet
      }];
    }

    return (
      <div ref={gallery => { this.gallery = gallery; }} className="gallery-container">
        <ImageGallery
          items={items}
          showPlayButton={false}
          showFullscreenButton={false}
        />
      </div>
    );
  }

  getLocation(listingDetail) {
    const locations = [];
    const keys = ['city', 'state', 'country', 'address'];
    keys.forEach(k => {
      if (listingDetail[k]) {
        locations.push(listingDetail[k]);
      }
    });
    return locations.join(', ');
  }

  renderOmncoinPrice(listingDetail) {
    const amount = this.getOmnicoinPrice(listingDetail);
    return (
      <PriceItem
        amount={amount}
        coinLabel={CoinTypes.OMNI_COIN}
        currency={CoinTypes.OMNI_CURRENCY}
        isUserOwner={this.isOwner()}
      />
    );
  }

  renderBitcoinPrice(listingDetail) {
    const amount = this.getBitcoinPrice(listingDetail);
    return (
      <PriceItem
        amount={amount}
        coinLabel={CoinTypes.BIT_COIN}
        currency={CoinTypes.BIT_CURRENCY}
        isUserOwner={this.isOwner()}
      />
    );
  }

  renderEthereumPrice(listingDetail) {
    const amount = this.getEthereumPrice(listingDetail);
    return (
      <PriceItem
        amount={amount}
        coinLabel={CoinTypes.ETHEREUM}
        currency={CoinTypes.ETHEREUM_CURRENCY}
        isUserOwner={this.isOwner()}
      />
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
        <span className="title">{listingDetail.listing_title}</span>
        <div className="seller-wrapper">
          <span>{formatMessage(messages.seller)}</span>
          <div className="seller-info">
            {this.renderUser(listingDetail)}
            <span className="rating">
              <ReactStars
                count={5}
                size={16}
                value={listingDetail.reputationScore / 10000 * 5}
                color1="#F6D4A2"
                color2="#F6AE4B"
                edit={false}
                half
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
            <span className="value">{listingDetail.start_date}</span>
          </div>
          <div className="info">
            <span>{formatMessage(messages.condition)}</span>
            <span className="value">{listingDetail.condition}</span>
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
          {
            listingDetail.price_using_omnicoin &&
            this.renderOmncoinPrice(listingDetail)
          }
          {
            listingDetail.price_using_btc &&
            this.renderBitcoinPrice(listingDetail)
          }
          {
            listingDetail.price_using_eth &&
            this.renderEthereumPrice(listingDetail)
          }
          {(!(listingDetail.currency === 'OMNICOIN' && listingDetail.price_using_omnicoin) &&
           !(listingDetail.currency === 'BITCOIN' && listingDetail.price_using_btc) &&
           !(listingDetail.currency === 'ETHEREUM' && listingDetail.price_using_eth)) &&
           <PriceItem
             amount={listingDetail.price}
             coinLabel={CoinTypes.LOCAL}
             currency={listingDetail.currency}
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
          <span>{`${formatMessage(messages.available)} `}</span>
          <span>{`${listingDetail.quantity} ${listingDetail.units}`}</span>
        </div>
      </div>
    );
  }

  renderWeightAndSize() {
    const { listingDetail } = this.props.listing;
    const { formatMessage } = this.props.intl;

    if (
      !listingDetail.weight && 
      !listingDetail.width && 
      !listingDetail.height && 
      !listingDetail.length
    ) {
      return null;
    }

    return (
      <div className="listing-weight-size">
        <span className="title">{formatMessage(listingFormMessages.weightAndSize)}</span>
        {
          listingDetail.weight &&
          <div>
            <span>{formatMessage(listingFormMessages.weight)}:</span>
            {listingDetail.weight} {formatMessage(listingFormMessages.ounce).toLowerCase()}
          </div>
        }
        {
          listingDetail.width &&
          <div>
            <span>{formatMessage(listingFormMessages.width)}:</span>
            {listingDetail.width} {formatMessage(listingFormMessages.inches).toLowerCase()}
          </div>
        }
        {
          listingDetail.height &&
          <div>
            <span>{formatMessage(listingFormMessages.height)}:</span>
            {listingDetail.height} {formatMessage(listingFormMessages.inches).toLowerCase()}
          </div>
        }
        {
          listingDetail.length &&
          <div>
            <span>{formatMessage(listingFormMessages.length)}:</span>
            {listingDetail.length} {formatMessage(listingFormMessages.inches).toLowerCase()}
          </div>
        }
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
      </div>,
      this.renderWeightAndSize()
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
          >
            {formatMessage(messages.reportDeleteQuestion)}
          </ConfirmationModal>
          <ConfirmationModal
            onApprove={() => this.onOkReport()}
            onCancel={() => this.closeConfirm()}
            isOpen={this.state.confirmReportOpen}
          >
            {formatMessage(messages.reportConfirmationQuestion)}
          </ConfirmationModal>
          <AddressModal
            isOpen={this.state.addressModalOpen}
            onCancel={this.onCancelBuyerAddress.bind(this)}
            onSave={this.onSaveBuyerAddress.bind(this)}
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
  transferActions: PropTypes.shape({
    setBuyerAddress: PropTypes.func
  }).isRequired
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
      deleteListing,
      reportListing
    }, dispatch),
    transferActions: bindActionCreators({
      setBuyerAddress
    }, dispatch)
  }),
)(injectIntl(Listing));
