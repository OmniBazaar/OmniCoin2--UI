import { handleActions } from 'redux-actions';
import _ from 'lodash';
import {
  getListingDetail,
  getListingDetailSucceeded,
  getListingDetailFailed,
  isListingFine,
  isListingFineSucceeded,
  isListingFineFailed,
  setActiveCurrency,
  requestMyListings,
  requestMyListingsSuccess,
  requestMyListingsError,
  setBitcoinPrice,
  setContinuous,
  setOmnicoinPrice,
  addListingImage,
  startDeleteListingImage,
  deleteListingImageSuccess,
  deleteListingImageError,
  setListingImages,
  uploadListingImageSuccess,
  uploadListingImageError,
  clearListingImageError,
  resetSaveListing,
  saveListing,
  saveListingSuccess,
  saveListingError,
  resetDeleteListing,
  deleteListing,
  deleteListingSuccess,
  deleteListingError,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavorites,
  searchPublishers,
  searchPublishersFinish,
  setNumberToBuy
} from './listingActions';

import { marketplaceReturnListings } from "../search/searchActions";

const CoinTypes = Object.freeze({
  OMNI_COIN: 'OmniCoin',
});

const defaultState = {
  listingDetail: null,
  listingDetailRequest: {
    loading: false,
    error: null
  },
  myListings: [],
  requestMyListings: {
    ids: [],
    isRequest: false,
    error: null
  },
  myListingsFiltered: {},
  bitcoinPrice: false,
  omnicoinPrice: false,
  isContinuous: false,
  isFavorite: false,
  favoriteListings: [],
  listingImages: {},
  saveListing: {
    saving: false,
    error: null,
    listing: null,
    listingId: null
  },
  deleteListing: {
    deleting: false,
    error: null,
    listingId: null
  },
  buyListing: {
    listing: null,
    blockchainListing: null,
    activeCurrency: CoinTypes.OMNI_COIN,
    numberToBuy: 1,
    loading: false,
    error: null
  },
  publishers: {
    searching: false,
    publishers: [],
    error: null
  }
};

const reducer = handleActions({
  [getFavorites](state) {
    // localStorage.removeItem('favoritesListings');
    const favorites = localStorage.getItem('favoritesListings');
    const favoriteListings = favorites ? JSON.parse(favorites) : [];
    return {
      ...state,
      favoriteListings
    };
  },
  [isFavorite](state, { payload: { listingDetailId } }) {
    const index = state.favoriteListings.length > 0 ?
      state.favoriteListings.findIndex(x => x.id === listingDetailId) : -1;
    return {
      ...state,
      isFavorite: index !== -1
    };
  },
  [addToFavorites](state, { payload: { listingDetail } }) {
    const favoriteListings = [...state.favoriteListings, listingDetail];
    localStorage.setItem('favoritesListings', JSON.stringify(favoriteListings));
    return {
      ...state,
      favoriteListings
    };
  },
  [removeFromFavorites](state, { payload: { listingDetailId } }) {
    const index = state.favoriteListings.length > 0 ?
      state.favoriteListings.findIndex(x => x['listing_id'] === listingDetailId) : -1;
    const favoriteListings = [
      ...state.favoriteListings.slice(0, index),
      ...state.favoriteListings.slice(index + 1)
    ];
    localStorage.setItem('favoritesListings', favoriteListings);
    return {
      ...state,
      favoriteListings
    };
  },
  [getListingDetail](state) {
    return {
      ...state,
      listingDetail: null,
      listingDetailRequest: {
        loading: true,
        error: null
      }
    }
  },
  [getListingDetailSucceeded](state, { payload: { listingDetail }}) {
    return {
      ...state,
      listingDetail,
      listingDetailRequest: {
        ...state.listingDetailRequest,
        loading: false
      }
    }
  },
  [getListingDetailFailed](state, { payload: { error }}) {
    return {
      ...state,
      listingDetailRequest: {
        ...state.listingDetailRequest,
        loading: false,
        error: true
      }
    }
  },
  [isListingFine](state, { payload: { listing } }) {
    return {
      ...state,
      buyListing: {
        ...state.buyListing,
        listing,
        blockchainListing: null,
        loading: true,
        error: null,
        numberToBuy: 1
      }
    }
  },
  [isListingFineSucceeded](state, { payload: { blockchainListing } }) {
    return {
      ...state,
      buyListing: {
        ...state.buyListing,
        blockchainListing,
        loading: false,
      }
    }
  },
  [isListingFineFailed](state, { payload: { error } }) {
    return {
      ...state,
      buyListing: {
        ...state.buyListing,
        error,
        loading: false
      }
    }
  },
  [setActiveCurrency](state, { payload: { activeCurrency } }) {
    return {
      ...state,
      buyListing: {
        ...state.buyListing,
        activeCurrency
      }
    };
  },
  [requestMyListings](state) {
    return {
      ...state,
      myListings: [],
      requestMyListings: {
        ...state.requestMyListings,
        ids: [],
        isRequest: true,
        error: null
      }
    };
  },
  [requestMyListingsSuccess](state, { payload: { ids } }) {
    return {
      ...state,
      requestMyListings: {
        ...state.requestMyListings,
        ids,
        error: null
      }
    }
  },
  [requestMyListingsError](state, { payload: { error } }) {
    return {
      ...state,
      requestMyListings: {
        ...state.requestMyListings,
        isRequest: false,
        error
      }
    }
  },
  [setBitcoinPrice](state) {
    return {
      ...state,
      bitcoinPrice: !state.bitcoinPrice
    };
  },
  [setOmnicoinPrice](state) {
    return {
      ...state,
      omnicoinPrice: !state.omnicoinPrice
    };
  },
  [setContinuous](state) {
    return {
      ...state,
      isContinuous: !state.isContinuous
    };
  },
  [addListingImage](state, { payload: { file, imageId } }) {
    return {
      ...state,
      listingImages: {
        ...state.listingImages,
        [imageId]: {
          file,
          uploading: true,
          id: imageId
        }
      }
    };
  },
  [setListingImages](state, { payload: { images } }) {
    return {
      ...state,
      listingImages: images || {}
    };
  },
  [uploadListingImageSuccess](state, {
    payload: {
      imageId,
      image,
      thumb,
      fileName
    }
  }) {
    if (state.listingImages[imageId]) {
      const imageItem = {
        ...state.listingImages[imageId],
        uploading: false,
        image,
        thumb,
        fileName,
        file: null
      };

      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: imageItem
        }
      };
    }

    return state;
  },
  [uploadListingImageError](state, { payload: { imageId, error } }) {
    if (state.listingImages[imageId]) {
      const imageItem = {
        ...state.listingImages[imageId],
        uploading: false,
        uploadError: error,
        file: null
      };

      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: imageItem
        }
      };
    }

    return state;
  },
  [startDeleteListingImage](state, { payload: { imageId } }) {
    if (state.listingImages[imageId]) {
      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: {
            ...state.listingImages[imageId],
            deleting: true,
            deleteError: null
          }
        }
      };
    }

    return state;
  },
  [deleteListingImageSuccess](state, { payload: { imageId } }) {
    const listingImages = {
      ...state.listingImages
    };
    delete listingImages[imageId];
    return {
      ...state,
      listingImages
    };
  },
  [deleteListingImageError](state, { payload: { imageId, error } }) {
    if (state.listingImages[imageId]) {
      return {
        ...state,
        listingImages: {
          ...state.listingImages,
          [imageId]: {
            ...state.listingImages[imageId],
            deleting: false,
            deleteError: error
          }
        }
      };
    }

    return state;
  },
  [clearListingImageError](state, { payload: { imageId } }) {
    if (state.listingImages[imageId]) {
      const images = {
        ...state.listingImages
      };
      if (images[imageId].uploadError) {
        delete images[imageId];
      } else {
        images[imageId] = {
          ...images[imageId],
          deleteError: null
        };
      }

      return {
        ...state,
        listingImages: images
      };
    }

    return state;
  },
  [resetSaveListing](state) {
    return {
      ...state,
      saveListing: {
        saving: false,
        error: null,
        listing: null,
        listingId: null
      }
    };
  },
  [saveListing](state, { payload: { listing, listingId } }) {
    return {
      ...state,
      saveListing: {
        ...state.saveListing,
        saving: true,
        error: null,
        listing,
        listingId
      }
    };
  },
  [saveListingSuccess](state, { payload: { listingId, listing } }) {
    return {
      ...state,
      saveListing: {
        ...state.saveListing,
        saving: false,
        error: null,
        listing,
        listingId
      }
    };
  },
  [saveListingError](state, { payload: { listingId, error } }) {
    return {
      ...state,
      saveListing: {
        ...state.saveListing,
        saving: false,
        error,
        listingId
      }
    };
  },
  [resetDeleteListing](state) {
    return {
      ...state,
      deleteListing: {
        deleting: false,
        error: null,
        listingId: null
      }
    };
  },
  [deleteListing](state, { payload: { listing } }) {
    return {
      ...state,
      deleteListing: {
        ...state.deleteListing,
        deleting: true,
        listingId: listing.listing_id,
        error: null
      }
    };
  },
  [deleteListingSuccess](state, { payload: { listingId } }) {
    if (state.deleteListing.listingId === listingId) {
      return {
        ...state,
        deleteListing: {
          ...state.deleteListing,
          deleting: false
        },
        myListings: state.myListings.filter(el => el.listing_id !== listingId)
      };
    }

    return state;
  },
  [deleteListingError](state, { payload: { listingId, error } }) {
    if (state.deleteListing.listingId === listingId) {
      return {
        ...state,
        deleteListing: {
          ...state.deleteListing,
          deleting: false,
          error
        }
      };
    }

    return state;
  },
  [marketplaceReturnListings](state, { data }) {
    const listingsObj = JSON.parse(data.command.listings);
    if (!listingsObj.listings) {
      return {
        ...state,
        requestMyListings: {
          ...state.requestMyListings,
          ids: state.requestMyListings.ids.filter(el => el !== parseInt(data.id)),
          isRequest: state.requestMyListings.ids.length === 1
        }
      }
    }
    const listings = listingsObj.listings.map(listing => ({
      ...listing,
      ip: data.command.address
    }));
    if (state.requestMyListings.ids.includes(parseInt(data.id))) {
      return {
        ...state,
        myListings: [...state.myListings, ...listings],
        requestMyListings: {
          ...state.requestMyListings,
          ids: state.requestMyListings.ids.filter(el => el !== parseInt(data.id)),
          isRequest: state.requestMyListings.ids.length === 1
        }
      }
    } else return  {
      ...state
    };
  },
  [searchPublishers](state) {
    return {
      ...state,
      publishers: {
        ...state.publishers,
        searching: true,
        publishers: [],
        error: null
      }
    }
  },
  [searchPublishersFinish](state, { payload: { error, publishers }}) {
    const pubs = {
      ...state.publishers,
      searching: false
    };

    if (error) {
      pubs.error = error; 
    } else {
      pubs.publishers = publishers;
    }

    return {
      ...state,
      publishers: pubs
    };
  },
  [setNumberToBuy](state, { payload: { number } }) {
    return {
      ...state,
      buyListing: {
        ...state.buyListing,
        numberToBuy: number
      }
    };
  }
}, defaultState);

export default reducer;
