import React, { Component } from 'react';
import { Button, Image, Icon, Popup, Table, Loader } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';

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
  categories
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

import './marketplace.scss';

const iconSize = 20;
const iconSizeSmall = 12;

const messages = defineMessages({
  welcome: {
    id: 'Marketplace.welcome',
    defaultMessage: 'Welcome to OmniBazaar'
  },
  seeAll: {
    id: 'Marketplace.seeAll',
    defaultMessage: 'SEE ALL'
  },
  overview: {
    id: 'Marketplace.overview',
    defaultMessage: 'Overview'
  },
  versatility: {
    id: 'Marketplace.versatility',
    defaultMessage: 'Versatility'
  },
  rewards: {
    id: 'Marketplace.rewards',
    defaultMessage: 'Rewards'
  },
  benefits: {
    id: 'Marketplace.benefits',
    defaultMessage: 'Benefits'
  },
  fees: {
    id: 'Marketplace.fees',
    defaultMessage: 'Fees'
  },
  categories: {
    id: 'Marketplace.categories',
    defaultMessage: 'Categories'
  },
  viewAll: {
    id: 'Marketplace.viewAll',
    defaultMessage: 'VIEW ALL'
  },
  getOmniCoins: {
    id: 'Marketplace.getOmniCoins',
    defaultMessage: 'Get Some OmniCoins'
  },
  getOmniCoinsText: {
    id: 'Marketplace.getOmniCoinsText',
    defaultMessage: 'See how we are enabling e-commerce without middleman and payment without bankers. OmniBazaar is an Internet marketplace "of the people, by the people, for the people"'
  },
  exchangeOne: {
    id: 'Marketplace.exchangeOne',
    defaultMessage: 'EXCHANGE ONE'
  },
  exchangeTwo: {
    id: 'Marketplace.exchangeTwo',
    defaultMessage: 'EXCHANGE TWO'
  },
  whatYouCanSell: {
    id: 'Marketplace.whatYouCanSell',
    defaultMessage: 'What You Can Buy/Sell on OmniBazaar'
  },
  productsServices: {
    id: 'Marketplace.productsServices',
    defaultMessage: 'Products and Services'
  },
  personalItems: {
    id: 'Marketplace.personalItems',
    defaultMessage: 'Personal Items'
  },
  professionalServices: {
    id: 'Marketplace.professionalServices',
    defaultMessage: 'Professional Services'
  },
  gigsServices: {
    id: 'Marketplace.gigsServices',
    defaultMessage: 'Gigs and Contract Services'
  },
  localCrypto: {
    id: 'Marketplace.localCrypto',
    defaultMessage: 'Local Crypocurrencies'
  },
  overstockUnused: {
    id: 'Marketplace.overstockUnused',
    defaultMessage: 'Over-stock or Unused Inventory'
  },
  likeAmazon: {
    id: 'Marketplace.likeAmazon',
    defaultMessage: '(like Amazon or Alibaba)'
  },
  likeEbay: {
    id: 'Marketplace.likeEbay',
    defaultMessage: '(like eBay, Etsy or CraigsList)'
  },
  likeUpwork: {
    id: 'Marketplace.likeUpwork',
    defaultMessage: '(like UpWork, Freelancer or Guru)'
  },
  likeFiverr: {
    id: 'Marketplace.likeFiverr',
    defaultMessage: '(like Fiverr, GigBucks or Zeerk)'
  },
  likeLocalBitcoins: {
    id: 'Marketplace.likeLocalBitcoins',
    defaultMessage: '(like LocalBitcoins or Wall of Coins)'
  },
  likeBarter: {
    id: 'Marketplace.likeBarter',
    defaultMessage: '(like barter networks)'
  },
  incentivesBonuses: {
    id: 'Marketplace.incentivesBonuses',
    defaultMessage: 'OmniCoin (XOM) Incentives and Bonuses'
  },
  earlyAdopters: {
    id: 'Marketplace.earlyAdopters',
    defaultMessage: 'Early Adopters'
  },
  registrationAir: {
    id: 'Marketplace.registrationAir',
    defaultMessage: 'Registration ("Air-drop")'
  },
  upTo: {
    id: 'Marketplace.upTo',
    defaultMessage: 'Up to'
  },
  referralsNewUser: {
    id: 'Marketplace.referralsNewUser',
    defaultMessage: 'Referrals (Each new user)'
  },
  firstSale: {
    id: 'Marketplace.firstSale',
    defaultMessage: 'First Sale (Each new buyer)'
  },
  continuing: {
    id: 'Marketplace.continuing',
    defaultMessage: 'Continuing'
  },
  transactionProcessing: {
    id: 'Marketplace.transactionProcessing',
    defaultMessage: 'Transaction Processing ("Mining")'
  },
  perBlock: {
    id: 'Marketplace.perBlock',
    defaultMessage: 'per block'
  },
  referralsEachTransaction: {
    id: 'Marketplace.referralsEachTransaction',
    defaultMessage: 'Referrals (Each transaction)'
  },
  perSale: {
    id: 'Marketplace.perSale',
    defaultMessage: 'per sale'
  },
  proxyListing: {
    id: 'Marketplace.proxyListing',
    defaultMessage: 'Proxy Listing Publisher'
  },
  perListing: {
    id: 'Marketplace.perListing',
    defaultMessage: 'per listing'
  },
  mandatoryFees: {
    id: 'Marketplace.mandatoryFees',
    defaultMessage: 'Mandatory Fees:'
  },
  monthlyFees: {
    id: 'Marketplace.monthlyFees',
    defaultMessage: 'Monthly Fees:'
  },
  listingFees: {
    id: 'Marketplace.listingFees',
    defaultMessage: 'Listing Fees:'
  },
  transactionFees: {
    id: 'Marketplace.transactionFees',
    defaultMessage: 'Transaction Fees:'
  },
  softwareCost: {
    id: 'Marketplace.softwareCost',
    defaultMessage: 'Software Cost:'
  },
  feesNote1: {
    id: 'Marketplace.feesNote1',
    defaultMessage: 'When we say FREE, we meant it. OmniBazaar can be 100% free if you don\'t use any of the optional services.'
  },
  optionalServices: {
    id: 'Marketplace.optionalServices',
    defaultMessage: 'Optional Services:'
  },
  affiliateProgram: {
    id: 'Marketplace.affiliateProgram',
    defaultMessage: 'Affiliate Program:'
  },
  priorityListing: {
    id: 'Marketplace.priorityListing',
    defaultMessage: 'Priority Listing Placement:'
  },
  userSelectable: {
    id: 'Marketplace.userSelectable',
    defaultMessage: '(User Selectable)'
  },
  escrowAgents: {
    id: 'Marketplace.escrowAgents',
    defaultMessage: 'Escrow Agents:'
  },
  marketDrivenPrice: {
    id: 'Marketplace.marketDrivenPrice',
    defaultMessage: '(Market-Driven Price)'
  },
  feesNote2: {
    id: 'Marketplace.feesNote2',
    defaultMessage: 'You pay these fees only if you use the services. If you provide these services, you earn 100% of the fees.'
  },
  marketsLabel: {
    id: 'Marketplace.marketsLabel',
    defaultMessage: 'Amazon, eBay, Alibaba, Rakutan, Etsy, etc.'
  },
  highSellerFees: {
    id: 'Marketplace.highSellerFees',
    defaultMessage: 'High Seller Fees'
  },
  includingPayment1: {
    id: 'Marketplace.includingPayment1',
    defaultMessage: '(10-20% including payment processing)'
  },
  authorizationControl: {
    id: 'Marketplace.authorizationControl',
    defaultMessage: 'Authorization control'
  },
  tracksEvery: {
    id: 'Marketplace.tracksEvery',
    defaultMessage: 'Tracks every click ("big data")'
  },
  pushesContent: {
    id: 'Marketplace.pushesContent',
    defaultMessage: 'Pushes content/advertising'
  },
  requiresBank: {
    id: 'Marketplace.requiresBank',
    defaultMessage: 'Requires a bank account'
  },
  contentCensorship: {
    id: 'Marketplace.contentCensorship',
    defaultMessage: 'Content censorship'
  },
  lowerFees: {
    id: 'Marketplace.lowerFees',
    defaultMessage: '90-100% Lower Fees'
  },
  includingPayment2: {
    id: 'Marketplace.includingPayment2',
    defaultMessage: '(0-1.5% including payment processing)'
  },
  communityOwned: {
    id: 'Marketplace.communityOwned',
    defaultMessage: 'Community owned and operated'
  },
  noTrackingUser: {
    id: 'Marketplace.noTrackingUser',
    defaultMessage: 'No tracking of user information'
  },
  listingsYouChoose: {
    id: 'Marketplace.listingsYouChoose',
    defaultMessage: 'See only the listings you choose'
  },
  useBitcoin: {
    id: 'Marketplace.useBitcoin',
    defaultMessage: 'Use Bitcoin and Omnicoin'
  },
  communityPolicing: {
    id: 'Marketplace.communityPolicing',
    defaultMessage: 'Community policing'
  },
  omniBazaarFeatures: {
    id: 'Marketplace.omniBazaarFeatures',
    defaultMessage: 'OmniBazaar Features and Benefits'
  },
  omniBazaarFeature: {
    id: 'Marketplace.omniBazaarFeature',
    defaultMessage: 'OmniBazaar Feature'
  },
  yourBenefit: {
    id: 'Marketplace.yourBenefit',
    defaultMessage: 'Your Benefit'
  },
  lowerPlatformFees: {
    id: 'Marketplace.lowerPlatformFees',
    defaultMessage: '90% lower platform fees'
  },
  moreProfit: {
    id: 'Marketplace.moreProfit',
    defaultMessage: 'More profit for sellers'
  },
  lowerPricesBuyers: {
    id: 'Marketplace.lowerPricesBuyers',
    defaultMessage: 'Lower prices for buyers'
  },
  userOwned: {
    id: 'Marketplace.userOwned',
    defaultMessage: 'Lower prices for buyers'
  },
  shopWithoutMiddlemen: {
    id: 'Marketplace.shopWithoutMiddlemen',
    defaultMessage: 'Shop without middlemen'
  },
  payWithoutBank: {
    id: 'Marketplace.payWithoutBank',
    defaultMessage: 'Pay without bankers'
  },
  noTrackUserInfo: {
    id: 'Marketplace.noTrackUserInfo',
    defaultMessage: 'No tracking of user information'
  },
  noPushMarketing: {
    id: 'Marketplace.noPushMarketing',
    defaultMessage: 'No "push" marketing'
  },
  morePrivacy: {
    id: 'Marketplace.morePrivacy',
    defaultMessage: 'More privacy'
  },
  paymentsAreSecure: {
    id: 'Marketplace.paymentsAreSecure',
    defaultMessage: 'Payments are secure'
  },
  noChargeBacks: {
    id: 'Marketplace.noChargeBacks',
    defaultMessage: 'No charge-backs'
  },
  usersProtectFromIllegal: {
    id: 'Marketplace.usersProtectFromIllegal',
    defaultMessage: 'Users protect the marketplace from illegal listings.'
  },
  priorityListingsAvailable: {
    id: 'Marketplace.priorityListingsAvailable',
    defaultMessage: 'Priority listings available'
  },
  makeImportantListings: {
    id: 'Marketplace.makeImportantListings',
    defaultMessage: 'You can make important listings stand out.'
  },
  searchingForPublishers: {
    id: 'SearchResults.searchingForPublishers',
    defaultMessage: 'Searching for publishers'
  },
  loadingListings: {
    id: 'SearchMenu.loadingListings',
    defaultMessage: 'Loading listings'
  },
});

class Marketplace extends Component {
  static getValue(category) {
    const arr = category.split('.');
    let categoryName = category;
    if (arr.length > 1) {
      categoryName = arr[1];
    }

    return categoryName;
  }

  componentWillMount() {
    this.props.accountActions.getPublisherData();
    const { country, city } = this.props.account.publisherData;
    this.fetchListings(country, city);
  }

  componentWillReceiveProps(nextProps) {
    const { searchResults } = this.props.search;

    if (searchResults !== nextProps.search.searchResults) {
      this.props.searchActions.filterSearchByCategory();
    }

    const { country, city } = this.props.account.publisherData;
    if (country !== nextProps.account.publisherData.country ||
        city !== nextProps.account.publisherData.city) {
      this.fetchListings(nextProps.account.publisherData.country, nextProps.account.publisherData.city);
    }
  }

  fetchListings(country, city) {
    this.props.searchActions.searchListings(null, 'All', country, city, true, null);
  }

  listItems(items, size) {
    return (
      items.slice(0, size).map((item) => {
        const image = item.images[0];
        const imageUrl = `http://${item.ip}/publisher-images/${image ? image.thumb : ''}`;
        const style = { backgroundImage: `url(${imageUrl})` };
        let { description } = item;
        description = description.length > 55 ? `${description.substring(0, 55)}...` : description;

        return (
          <div key={`fl-item-${item.listing_id}`} className="item">
            <Link to={`listing/${item.listing_id}`}>
              <div className="img-wrapper" style={style} />
            </Link>
            <Link to={`listing/${item.id}`}>
              <span className="title" >
                {item.listing_title}
              </span>
            </Link>
            <span className="subtitle">
              {item.category}
              <span>
                <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
              </span>
              {item.subcategory}
            </span>
            <span className="description">{description}</span>
          </div>
        );
      })
    );
  }

  viewAllSubCategories = (category) => {
    console.log('View all sub categories for: ', category);
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
          tabIndex={0}
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
        <span className="title">{formatMessage(mainCategories.services)}</span>
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
        <span className="title">{formatMessage(mainCategories.jobs)}</span>
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
    const { formatMessage } = this.props.intl;
    const style = { backgroundImage: `url(${CryptoIcon})` };

    return (
      <div className="item" style={style}>
        <span className="title">{formatMessage(mainCategories.cryptoBazaar)}</span>
        <div className="sub-categories">
          {Object.keys(cryptoCategories).map(key => this.renderOption(cryptoCategories[key], mainCategories.cryptoBazaar))}
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
        <div className="items">
          <div className="left-items">
            <div className="title">{formatMessage(messages.marketsLabel)}</div>
            <Image src={EbayNet} width={300} className="net-img" />
            <div className="title">{formatMessage(messages.highSellerFees)}</div>
            <div className="small">{formatMessage(messages.includingPayment1)}</div>
            <div>{formatMessage(messages.authorizationControl)}</div>
            <div>{formatMessage(messages.tracksEvery)}</div>
            <div>{formatMessage(messages.pushesContent)}</div>
            <div>{formatMessage(messages.requiresBank)}</div>
            <div>{formatMessage(messages.contentCensorship)}</div>
          </div>
          <div className="right-items">
            <Image src={Logo} width={300} />
            <Image src={ObNet} width={300} className="net-img" />
            <div className="title">{formatMessage(messages.lowerFees)}</div>
            <div className="small">{formatMessage(messages.includingPayment2)}</div>
            <div>{formatMessage(messages.communityOwned)}</div>
            <div>{formatMessage(messages.noTrackingUser)}</div>
            <div>{formatMessage(messages.listingsYouChoose)}</div>
            <div>{formatMessage(messages.useBitcoin)}</div>
            <div>{formatMessage(messages.communityPolicing)}</div>
          </div>
        </div>
      </div>
    );
  }

  versatilityPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper versatility">
        <p className="title">{formatMessage(messages.whatYouCanSell)}</p>
        <div className="items">
          <div className="item">
            <Icon name="check" /><span className="subtitle">{formatMessage(messages.productsServices)}</span> {formatMessage(messages.likeAmazon)}
          </div>
          <div className="item">
            <Icon name="check" /><span className="subtitle">{formatMessage(messages.personalItems)}</span> {formatMessage(messages.likeEbay)}
          </div>
          <div className="item">
            <Icon name="check" /><span className="subtitle">{formatMessage(messages.professionalServices)}</span> {formatMessage(messages.likeUpwork)}
          </div>
          <div className="item">
            <Icon name="check" /><span className="subtitle">{formatMessage(messages.gigsServices)}</span> {formatMessage(messages.likeFiverr)}
          </div>
          <div className="item">
            <Icon name="check" /><span className="subtitle">{formatMessage(messages.localCrypto)}</span> {formatMessage(messages.likeLocalBitcoins)}
          </div>
          <div className="item">
            <Icon name="check" /><span className="subtitle">{formatMessage(messages.overstockUnused)}</span> {formatMessage(messages.likeBarter)}
          </div>
        </div>
      </div>
    );
  }

  rewardsPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper rewards">
        <p className="title">{formatMessage(messages.incentivesBonuses)}</p>
        <div className="items">
          <div className="left-items">
            <div className="subtitle">{formatMessage(messages.earlyAdopters)}</div>
            <div className="item">
              <div>{formatMessage(messages.registrationAir)}</div>
              <div>{formatMessage(messages.upTo)}</div>
              <div>10,000 XOM</div>
            </div>
            <div className="separator" />
            <div className="item">
              <div>{formatMessage(messages.referralsNewUser)}</div>
              <div>{formatMessage(messages.upTo)}</div>
              <div>2,500 XOM</div>
            </div>
            <div className="separator" />
            <div className="item">
              <div>{formatMessage(messages.firstSale)}</div>
              <div>{formatMessage(messages.upTo)}</div>
              <div>500 XOM</div>
            </div>
          </div>
          <div className="right-items">
            <div className="subtitle">{formatMessage(messages.continuing)}</div>
            <div className="item">
              <div>{formatMessage(messages.transactionProcessing)}</div>
              <div>{formatMessage(messages.upTo)}</div>
              <div>50 XOM {formatMessage(messages.perBlock)}</div>
            </div>
            <div className="separator" />
            <div className="item">
              <div>{formatMessage(messages.referralsEachTransaction)}</div>
              <div>{formatMessage(messages.upTo)}</div>
              <div>0.25% {formatMessage(messages.perSale)}</div>
            </div>
            <div className="separator" />
            <div className="item">
              <div>{formatMessage(messages.proxyListing)}</div>
              <div>{formatMessage(messages.upTo)}</div>
              <div>0.50% {formatMessage(messages.perListing)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  benefitsPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper benefits">
        <p className="title">{formatMessage(messages.omniBazaarFeatures)}</p>
        <Table className="benefits-table" celled striped fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="1">
                <Icon name="caret down" size={32} /> {formatMessage(messages.omniBazaarFeature)}
              </Table.HeaderCell>
              <Table.HeaderCell colSpan="2">
                <Icon name="caret down" size={32} /> {formatMessage(messages.yourBenefit)}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{formatMessage(messages.lowerPlatformFees)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.moreProfit)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.lowerPricesBuyers)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{formatMessage(messages.userOwned)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.shopWithoutMiddlemen)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.payWithoutBank)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{formatMessage(messages.noTrackUserInfo)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.noPushMarketing)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.morePrivacy)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{formatMessage(messages.useBitcoin)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.paymentsAreSecure)}</Table.Cell>
              <Table.Cell>{formatMessage(messages.noChargeBacks)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{formatMessage(messages.communityPolicing)}</Table.Cell>
              <Table.Cell colSpan="2">{formatMessage(messages.usersProtectFromIllegal)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{formatMessage(messages.priorityListingsAvailable)}</Table.Cell>
              <Table.Cell colSpan="2">{formatMessage(messages.makeImportantListings)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }

  feesPopup() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu-wrapper fees">
        <div className="items">
          <div className="left-items">
            <div className="title">{formatMessage(messages.mandatoryFees)}</div>
            <div className="row">
              <div className="item">
                <div>{formatMessage(messages.monthlyFees)}</div>
                <div className="amount">$0</div>
              </div>
              <div className="item">
                <div>{formatMessage(messages.listingFees)}</div>
                <div className="amount">$0</div>
              </div>
            </div>
            <div className="row">
              <div className="item">
                <div>{formatMessage(messages.transactionFees)}</div>
                <div className="amount">$0</div>
              </div>
              <div className="item">
                <div>{formatMessage(messages.softwareCost)}</div>
                <div className="amount">$0</div>
              </div>
            </div>
            <div className="small">{formatMessage(messages.feesNote1)}</div>
          </div>
          <div className="right-items">
            <div className="title">{formatMessage(messages.optionalServices)}</div>
            <div className="row">
              <div className="item">
                <div>{formatMessage(messages.affiliateProgram)}</div>
                <div className="amount">0 - .5%</div>
                <div className="note">{formatMessage(messages.userSelectable)}</div>
              </div>
              <div className="item">
                <div>{formatMessage(messages.escrowAgents)}</div>
                <div className="amount">0 - .5%</div>
                <div className="note">{formatMessage(messages.marketDrivenPrice)}</div>
              </div>
            </div>
            <div className="row">
              <div className="item">
                <div>{formatMessage(messages.proxyListing)}:</div>
                <div className="amount">0 - .5%</div>
                <div className="note">{formatMessage(messages.marketDrivenPrice)}</div>
              </div>
              <div className="item">
                <div>{formatMessage(messages.priorityListing)}</div>
                <div className="amount">0 - 2%</div>
                <div className="note">{formatMessage(messages.userSelectable)}</div>
              </div>
            </div>
            <div className="small">{formatMessage(messages.feesNote2)}</div>
          </div>
        </div>
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
    const { country, city } = this.props.account.publisherData;
    const category = parent ? Marketplace.getValue(parent) : Marketplace.getValue(categoryId);
    const subCategory = parent ? Marketplace.getValue(categoryId) : null;

    this.props.searchActions.searchListings(null, category, country, city, true, subCategory);
    this.props.marketplaceActions.setActiveCategory(categoryId);
  };

  renderListItems(type, title, itemsList) {
    const { formatMessage } = this.props.intl;
    let maxDisplay = 6;
    if (type === CategoriesTypes.FEATURED) {
      maxDisplay = 12;
    }

    return (
      <div className="list-container">
        <div className="top-detail">
          <span className="heading">{title}</span>
          <NavLink to="/marketplace">
            <Button
              onClick={() => this.viewCategory(type)}
              content={formatMessage(messages.seeAll)}
              className="button--blue"
            />
          </NavLink>
        </div>
        <div className="items">
          {this.listItems(itemsList, maxDisplay)}
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

    return (
      <div className="market-footer">
        <span className="title">{formatMessage(messages.getOmniCoins)}</span>
        <span className="description">{formatMessage(messages.getOmniCoinsText)}</span>
        <div>
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
        </div>
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

    return (
      <div className="marketplace-container">
        {this.header()}
        <div className="body">
          {this.renderListItems(
            CategoriesTypes.FEATURED,
            formatMessage(mainCategories.featuredListings),
            []
          )}
          <div className="categories-container">
            <div className="top-detail">
              <span className="heading">{formatMessage(messages.categories)}</span>
            </div>
            {this.categoriesItems()}
          </div>
          {(this.props.dht.isLoading || this.props.search.searching)
            ?
              <Loader
                content={
                  this.props.dht.isLoading
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
                {this.renderListItems(
                  CategoriesTypes.RENTALS,
                  formatMessage(mainCategories.rentals),
                  this.getListingForCategory(categories.rentals)
                )}
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

    if (props.marketplace.activeCategory === mainCategories.home.id) {
      return this.renderMarketHome();
    }

    return <CategoryListing />;
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
  search: PropTypes.shape({
    recentSearches: PropTypes.array,
    searchResultsFiltered: PropTypes.array
  }),
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
)(injectIntl(Marketplace));
