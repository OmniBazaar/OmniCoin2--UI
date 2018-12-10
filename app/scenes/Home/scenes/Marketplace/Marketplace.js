import React, { Component } from 'react';
import { Button, Image, Icon, Popup, Table, Loader } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import OverviewIcon from './images/tile-overview.svg';
import VersatilityIcon from './images/tile-versatility.svg';
import RewardsIcon from './images/tile-rewards.svg';
import BenefitIcon from './images/tile-benefits.svg';
import FeesIcon from './images/tile-fees.svg';
import ForSaleIcon from './images/bg-forsale.jpg';
import ServicesIcon from './images/bg-services.jpg';
import JobsIcon from './images/bg-jobs.jpg';
import CryptoIcon from './images/bg-crypto.jpg';
import Logo from '../../../../assets/images/logo.png';
import Overview from './images/Overview.png';
import Versatility from './images/Versatility.png';
import Rewards from './images/Rewards.png';
import Fees from './images/Fees.png';
import Benefits from './images/Benefits.png';
import EbayNet from '../../../../assets/images/ebay-net.png';
import ObNet from '../../../../assets/images/ob-net.png';

import { CategoriesTypes } from './constants';
import Menu from './scenes/Menu/Menu';
import CategoryListing from './scenes/CategoryListing/CategoryListing';

import {
  saleCategories,
  servicesCategories,
  jobsCategories,
  cryptoCategories,
  mainCategories,
  categories,
  getSubCategoryTitle
} from './categories';

import {
  getFeatureList,
  getForSaleList,
  getJobsList,
  getRentalsList,
  getServicesList,
  getCryptoBazaarList,
  setActiveCategory
} from '../../../../services/marketplace/marketplaceActions';

import { getPublisherData } from '../../../../services/accountSettings/accountActions';
import { searchListings, filterSearchByCategory } from '../../../../services/search/searchActions';
import messages from './messages';
import './marketplace.scss';

const iconSize = 20;
const iconSizeSmall = 12;


class Marketplace extends Component {
  static getValue(category) {
    const arr = category.split('.');
    let categoryName = category;
    if (arr.length > 1) {
      categoryName = arr[1];
    }

    return categoryName;
  }

  state = {
    textsMaxSizes: {
      descriptionMaxSize: 50,
      titleMaxSize: 50,
      categoryMaxSize: 25
    }
  };

  componentWillMount() {
    window.addEventListener('resize', this.setTextsSizes.bind(this));
    this.setTextsSizes();
    this.props.accountActions.getPublisherData();
  }

  componentWillReceiveProps(nextProps) {
    const { searchResults } = this.props.search;

    if (searchResults !== nextProps.search.searchResults) {
      this.props.searchActions.filterSearchByCategory();
    }

    if (this.props.account.publisherData !== nextProps.account.publisherData) {
      if (!nextProps.listing.saveListing.saving) {
        this.fetchListings(nextProps.account.publisherData);
      }
    }

    if (this.props.listing.saveListing.saving && !nextProps.listing.saveListing.saving) {
      this.fetchListings(this.props.account.publisherData);
    }

    // if (this.props.dht.isConnecting && !nextProps.dht.isConnecting) {
    //   this.fetchListings(this.props.account.publisherData);
    // }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setTextsSizes);
  }

  fetchListings({
    country, state, city, keywords
  }) {
    const searchTerm = keywords.join(' ');
    this.props.searchActions.searchListings(searchTerm, 'All', country, state, city, true, null);
  }

  listItems(items, size) {
    return (
      items.slice(0, size).map((item) => {
        if (!item.description || !item.listing_title) {
          return;
        }
        const { textsMaxSizes: { descriptionMaxSize, titleMaxSize, categoryMaxSize } } = this.state;
        const { formatMessage } = this.props.intl;
        const image = item.images && item.images.length ? item.images[0] : '';
        let imageUrl = `http://${item.ip}/publisher-images/${image ? image.thumb : ''}`;
        if(!image){
          imageUrl = ObNet
        }

        const style = { backgroundImage: `url(${imageUrl})` };
        let { description, listing_title: listingTitle } = item;
        description = description.length > descriptionMaxSize ? `${description.substring(0, descriptionMaxSize)}...` : description;
        listingTitle = listingTitle.length > titleMaxSize ? `${listingTitle.substring(0, titleMaxSize)}...` : listingTitle;

        let categoryTitle = '';
        if (item.category && item.category.toLowerCase() !== 'all') {
          categoryTitle = mainCategories[item.category] ?
            formatMessage(mainCategories[item.category]) : item.category;
        }
        const subcategory = getSubCategoryTitle(item.category, item.subcategory);
        let subCategoryTitle = subcategory !== '' ? formatMessage(subcategory) : '';

        if (categoryTitle.length + subCategoryTitle.length > categoryMaxSize) {
          if (categoryTitle.length > categoryMaxSize) {
            categoryTitle = `${categoryTitle.substring(0, categoryMaxSize - 2)}...`;
            subCategoryTitle = `${subCategoryTitle.substring(0, 2)}...`;
          } else {
            subCategoryTitle = `${subCategoryTitle.substring(0, categoryMaxSize - categoryTitle.length)}...`;
          }
        }

        return (
          <div key={`fl-item-${item.listing_id}`} className="item">
            <Link to={`listing/${item.listing_id}`}>
              <div className="img-wrapper" style={style} />
            </Link>
            <Link to={`listing/${item.listing_id}`}>
              <span className="title" >
                {listingTitle}
              </span>
            </Link>
            <span className="subtitle">
              {categoryTitle}
              <span>
                <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
              </span>
              {subCategoryTitle}
            </span>
            <span className="description">{description}</span>
          </div>
        );
      })
    );
  }

  viewAllSubCategories = (category) => {
    const { country, state, city } = this.props.account.publisherData;
    this.props.history.push('/search-results');
    this.props.searchActions.searchListings(null, category || 'All', country, state, city, true, null);
  };

  renderOption(category, parentCategory) {
    const { formatMessage } = this.props.intl;
    const type = category.id;
    const parent = parentCategory ? parentCategory.id : null;

    return (
      <div
        className="sub-category"
        onClick={() => this.viewCategory(type, parent)}
        onKeyDown={() => this.viewCategory(type, parent)}
        tabIndex={0}
        role="link"
      >
        {formatMessage(category)}
      </div>
    );
  }

  renderForSaleCategory() {
    const categoryName = CategoriesTypes.FOR_SALE;
    const { formatMessage } = this.props.intl;
    const style = { backgroundImage: `url(${ForSaleIcon})` };

    return (
      <div className="item" style={style}>
        <span
          className="title"
          onClick={() => this.viewCategory(mainCategories.forSale.id)}
          onKeyDown={() => this.viewCategory(mainCategories.forSale.id)}
          role="link"
        >
          {formatMessage(mainCategories.forSale)}
        </span>
        <div className="sub-categories">
          {Object.keys(saleCategories).map(key => this.renderOption(saleCategories[key], mainCategories.forSale))}
          <div
            className="view-all"
            onClick={() => this.viewAllSubCategories(categoryName)}
            onKeyDown={() => this.viewAllSubCategories(categoryName)}
            tabIndex={0}
            role="link"
          >
            {formatMessage(messages.viewAll)}
          </div>
        </div>
      </div>
    );
  }

  renderServicesCategory() {
    const categoryName = CategoriesTypes.SERVICES;
    const { formatMessage } = this.props.intl;
    const style = { backgroundImage: `url(${ServicesIcon})` };

    return (
      <div className="item" style={style}>
        <span
          className="title"
          onClick={() => this.viewCategory(mainCategories.services.id)}
          onKeyDown={() => this.viewCategory(mainCategories.services.id)}
          role="link"
        >
          {formatMessage(mainCategories.services)}
        </span>
        <div className="sub-categories">
          {Object.keys(servicesCategories).map(key => this.renderOption(servicesCategories[key], mainCategories.services))}
          <div
            className="view-all"
            onClick={() => this.viewAllSubCategories(categoryName)}
            onKeyDown={() => this.viewAllSubCategories(categoryName)}
            tabIndex={0}
            role="link"
          >
            {formatMessage(messages.viewAll)}
          </div>
        </div>
      </div>
    );
  }

  renderJobsCategory() {
    const categoryName = CategoriesTypes.JOBS;
    const { formatMessage } = this.props.intl;
    const style = { backgroundImage: `url(${JobsIcon})` };

    return (
      <div className="item" style={style}>
        <span
          className="title"
          onClick={() => this.viewCategory(mainCategories.jobs.id)}
          onKeyDown={() => this.viewCategory(mainCategories.jobs.id)}
          role="link"
        >
          {formatMessage(mainCategories.jobs)}
        </span>
        <div className="sub-categories">
          {Object.keys(jobsCategories).map(key => this.renderOption(jobsCategories[key], mainCategories.jobs))}
          <div
            className="view-all"
            onClick={() => this.viewAllSubCategories(categoryName)}
            onKeyDown={() => this.viewAllSubCategories(categoryName)}
            tabIndex={0}
            role="link"
          >
            {formatMessage(messages.viewAll)}
          </div>
        </div>
      </div>
    );
  }

  renderCryptoCategory() {
    const categoryName = CategoriesTypes.CRYPTO_BAZAAR;
    const { formatMessage } = this.props.intl;
    const style = { backgroundImage: `url(${CryptoIcon})` };

    return (
      <div className="item" style={style}>
        <span
          className="title"
          onClick={() => this.viewCategory(mainCategories.cryptoBazaar.id)}
          onKeyDown={() => this.viewCategory(mainCategories.cryptoBazaar.id)}
          role="link"
        >
          {formatMessage(mainCategories.cryptoBazaar)}
        </span>
        <div className="sub-categories">
          {Object.keys(cryptoCategories).map(key => this.renderOption(cryptoCategories[key], mainCategories.cryptoBazaar))}
          <div
            className="view-all"
            onClick={() => this.viewAllSubCategories(categoryName)}
            onKeyDown={() => this.viewAllSubCategories(categoryName)}
            tabIndex={0}
            role="link"
          >
            {formatMessage(messages.viewAll)}
          </div>
        </div>
      </div>
    );
  }

  categoriesItems() {
    return (
      <div className="items">
        {this.renderForSaleCategory()}
        {this.renderServicesCategory()}
        {this.renderJobsCategory()}
        {this.renderCryptoCategory()}
      </div>
    );
  }

  badgeMenu(icon, title) {
    const { formatMessage } = this.props.intl;
    const badgeClass = classNames({
      badge: true,
      blue: title === 'overview',
      green: title === 'versatility',
      yellow: title === 'benefits',
      orange: title === 'rewards',
      red: title === 'fees'
    });

    return (
      <div className={badgeClass}>
        <Image src={icon} width={iconSize} height={iconSize} />
        <span>{formatMessage(messages[title])}</span>
      </div>
    );
  }

  overviewPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper overview">
        <Image src={Overview} width={490} height={380} />
      </div>
    );
  }

  versatilityPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper versatility">
        <Image src={Versatility} width={456} height={300} />
      </div>
    );
  }

  rewardsPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper rewards">
        <Image src={Rewards} width={456} height={300} />
      </div>
    );
  }

  benefitsPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper benefits">
        <Image src={Benefits} width={760} height={500} />
      </div>
    );
  }

  feesPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper fees">
        <Image src={Fees} width={456} height={300} />
      </div>
    );
  }

  renderBadge(icon, title) {
    const popupClass = classNames({
      'badges-popup': true,
      benefits: title === 'benefits'
    });

    return (
      <Popup
        trigger={this.badgeMenu(icon, title)}
        hoverable
        basic
        on="click"
        position="bottom center"
        wide="very"
        hideOnScroll
        className={popupClass}
      >
        {title === 'overview' ? this.overviewPopup() : null}
        {title === 'versatility' ? this.versatilityPopup() : null}
        {title === 'rewards' ? this.rewardsPopup() : null}
        {title === 'fees' ? this.feesPopup() : null}
        {title === 'benefits' ? this.benefitsPopup() : null}
      </Popup>
    );
  }

  header() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="header">
        <Menu />
        <span className="title">{formatMessage(messages.welcome)}</span>
        <div className="badges">
          {this.renderBadge(OverviewIcon, 'overview')}
          {this.renderBadge(VersatilityIcon, 'versatility')}
          {this.renderBadge(BenefitIcon, 'benefits')}
          {this.renderBadge(RewardsIcon, 'rewards')}
          {this.renderBadge(FeesIcon, 'fees')}
        </div>
      </div>
    );
  }

  viewCategory = (categoryId, parent) => {
    this.props.history.push('/search-results');
    const { country, state, city } = this.props.account.publisherData;
    const category = parent ? Marketplace.getValue(parent) : Marketplace.getValue(categoryId);
    const subCategory = parent ? Marketplace.getValue(categoryId) : null;
    if (categoryId !== 'featuredListings') {
      this.props.searchActions.searchListings(null, category, country, state, city, true, subCategory);
    } else {
      this.props.searchActions.searchListings(this.props.account.publisherData.keywords.join(' '), 'All', country, state, city, true, null);
    }
  };

  setTextsSizes() {
    let { textsMaxSizes: { descriptionMaxSize, titleMaxSize, categoryMaxSize } } = this.state;

    if (window.innerWidth < 768) {
      descriptionMaxSize = 60;
      titleMaxSize = 50;
      categoryMaxSize = 30;
    } else if (window.innerWidth < 871) {
      descriptionMaxSize = 13;
      titleMaxSize = 10;
      categoryMaxSize = 7;
    } else if (window.innerWidth < 1200) {
      descriptionMaxSize = 20;
      titleMaxSize = 18;
      categoryMaxSize = 9;
    } else if (window.innerWidth < 1351) {
      descriptionMaxSize = 25;
      titleMaxSize = 22;
      categoryMaxSize = 13;
    }  else if (window.innerWidth < 1550) {
      descriptionMaxSize = 25;
      titleMaxSize = 25;
      categoryMaxSize = 15;
    } else if (window.innerWidth < 1700) {
      descriptionMaxSize = 50;
      titleMaxSize = 40;
      categoryMaxSize = 25;
    } else {
      descriptionMaxSize = 60;
      titleMaxSize = 50;
      categoryMaxSize = 30;
    }

    this.setState({ textsMaxSizes: { descriptionMaxSize, titleMaxSize, categoryMaxSize } });
  }

  renderListItems(type, title, itemsList, loading) {
    const { formatMessage } = this.props.intl;
    let maxDisplay = 6;
    if (type === CategoriesTypes.FEATURED) {
      maxDisplay = 12;
    }
    let content = this.listItems(itemsList, maxDisplay);
    content = content.length !== 0 ? content : formatMessage(messages.noListingsFound);
    return (
      <div className="list-container">
        <div className="top-detail">
          <span className="heading">{title}</span>
          <Button
            onClick={() => this.viewCategory(type)}
            content={formatMessage(messages.seeAll)}
            className="button--blue"
          />
        </div>
        <div className="items">
          {
            loading ? <div className="loading-container"><Loader inline active /></div>
                    : content
          }
        </div>
      </div>
    );
  }

  onClickExchangeOne = () => {
    console.log('Exchange one');
  };

  onClickExchangeTwo = () => {
    console.log('Exchange two');
  };

  renderFooter() {
    const { formatMessage } = this.props.intl;
    const { identityVerificationStatus } = this.props.auth;

    return (
      <div className="market-footer">
        <NavLink to={identityVerificationStatus && identityVerificationStatus.verified ? '/exchange' : '/identity-verification'}>
          <Button content={formatMessage(messages.getOmniCoins)} className="title button--green-bg" />
        </NavLink>
        <span className="description">{formatMessage(messages.getOmniCoinsText)}</span>
        {/* <div>
          <Button
            content={formatMessage(messages.exchangeOne)}
            className="button--secondary"
            onClick={() => this.onClickExchangeOne()}
          />
          <Button
            content={formatMessage(messages.exchangeTwo)}
            className="button--secondary"
            onClick={() => this.onClickExchangeTwo()}
          />
        </div> */}
      </div>
    );
  }

  getListingForCategory(category) {
    const searchResultsByCategory = this.props.search.searchResultsByCategory || [];
    let result = [];
    searchResultsByCategory.forEach((listing) => {
      if (listing.category === category) {
        result = listing.listings;
      }
    });

    return result;
  }

  renderMarketHome() {
    const { formatMessage } = this.props.intl;
    const { searchResults } = this.props.search;
    const isSearching = this.props.dht.isLoading || this.props.search.searching;
    const { saving } = this.props.listing.saveListing;

    return (
      <div className="marketplace-container">
        {this.header()}
        <div className="body">
          {this.renderListItems(
            CategoriesTypes.FEATURED,
            formatMessage(mainCategories.featuredListings),
            searchResults,
            saving || isSearching
          )}
          <div className="categories-container">
            <div className="top-detail">
              <span className="heading">{formatMessage(messages.categories)}</span>
            </div>
            {this.categoriesItems()}
          </div>
          {(saving || this.props.dht.isLoading || this.props.search.searching)
            ?
              <Loader
                content={
                  saving || this.props.dht.isLoading
                    ? formatMessage(messages.searchingForPublishers)
                    : formatMessage(messages.loadingListings)
                }
                inline
                active
              />
            :
              <div>
                {this.renderListItems(
                  CategoriesTypes.FOR_SALE,
                  formatMessage(mainCategories.forSale),
                  this.getListingForCategory(categories.forSale)
                )}
                {this.renderListItems(
                  CategoriesTypes.SERVICES,
                  formatMessage(mainCategories.services),
                  this.getListingForCategory(categories.services)
                )}
                {this.renderListItems(
                  CategoriesTypes.JOBS,
                  formatMessage(mainCategories.jobs),
                  this.getListingForCategory(categories.jobs)
                )}
                {/* {this.renderListItems(
                  CategoriesTypes.RENTALS,
                  formatMessage(mainCategories.rentals),
                  this.getListingForCategory(categories.rentals)
                )} */}
                {this.renderListItems(
                  CategoriesTypes.CRYPTO_BAZAAR,
                  formatMessage(mainCategories.cryptoBazaar),
                  this.getListingForCategory(categories.cryptoBazaar)
                )}
              </div>
          }
          <div>
            {this.renderFooter()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { props } = this;

    return this.renderMarketHome();
  }
}

Marketplace.propTypes = {
  marketplaceActions: PropTypes.shape({
    getFeatureList: PropTypes.func,
    getForSaleList: PropTypes.func,
    getJobsList: PropTypes.func,
    getRentalsList: PropTypes.func,
    getServicesList: PropTypes.func,
    getCryptoBazaarList: PropTypes.func,
    setActiveCategory: PropTypes.func
  }),
  accountActions: PropTypes.shape({
    getPublisherData: PropTypes.func
  }),
  searchActions: PropTypes.shape({
    searchListings: PropTypes.func,
    filterSearchByCategory: PropTypes.func
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  auth: PropTypes.shape({
    identityVerificationStatus: PropTypes.string
  }),
  search: PropTypes.shape({
    recentSearches: PropTypes.array,
    searchResultsFiltered: PropTypes.array
  }),
  listing: PropTypes.shape({
    saveListing: PropTypes.shape({
      saving: PropTypes.bool
    })
  })
};

Marketplace.defaultProps = {
  searchActions: {},
  marketplaceActions: {},
  intl: {},
  search: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    marketplaceActions: bindActionCreators({
      getFeatureList,
      getForSaleList,
      getJobsList,
      getRentalsList,
      getServicesList,
      getCryptoBazaarList,
      setActiveCategory
    }, dispatch),
    accountActions: bindActionCreators({
      getPublisherData
    }, dispatch),
    searchActions: bindActionCreators({
      searchListings,
      filterSearchByCategory
    }, dispatch)
  }),
)(injectIntl(withRouter(Marketplace)));
