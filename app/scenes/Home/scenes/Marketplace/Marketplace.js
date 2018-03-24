import React, { Component } from 'react';
import { Button, Image, Icon, Popup } from 'semantic-ui-react';
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
import AddIcon from './images/btn-add-listing.svg';
import SearchIcon from './images/btn-search-norm.svg';
import SearchHoverIcon from './images/btn-search-hover.svg';
import SearchPressIcon from './images/btn-search-press.svg';
import UserIcon from './images/btn-user-menu-norm.svg';
import UserHoverIcon from './images/btn-user-menu-hover.svg';
import UserPressIcon from './images/btn-user-menu-press.svg';

import {
  getFeatureList,
  getForSaleList,
  getJobsList,
  getRentalsList,
  getServicesList,
  getCryptoBazaarList,
  getForSaleCategories,
  getServicesCategories,
  getJobsCategories,
  getCryptoCategories
} from '../../../../services/marketplace/marketplaceActions';

import './marketplace.scss';

const iconSizeBig = 25;
const iconSize = 20;
const iconSizeMedium = 15;
const iconSizeSmall = 12;

const CategoriesTypes = Object.freeze({
  FOR_SALE: 'For sale',
  SERVICES: 'Services',
  JOBS: 'Jobs',
  CRYPTO_BAZAAR: 'CrytoBazaar',
  RENTALS: 'Rentals'
});

const forSaleCategories = [
  {
    id: 1,
    subCategory: 'Antiques'
  },
  {
    id: 2,
    subCategory: 'Appliances'
  },
  {
    id: 3,
    subCategory: 'Arts / Crafts'
  },
  {
    id: 4,
    subCategory: 'Baby / Child'
  },
  {
    id: 5,
    subCategory: 'Barter'
  },
  {
    id: 6,
    subCategory: 'Beauty / Health'
  },
  {
    id: 7,
    subCategory: 'Bikes'
  },
  {
    id: 8,
    subCategory: 'Boats'
  },
  {
    id: 9,
    subCategory: 'Books'
  },
  {
    id: 10,
    subCategory: 'Business'
  },
  {
    id: 11,
    subCategory: 'Cars / Trucks'
  },
  {
    id: 12,
    subCategory: 'CD / DVD / VHS'
  },
  {
    id: 13,
    subCategory: 'Farm / Garden'
  },
  {
    id: 14,
    subCategory: 'Free'
  },
  {
    id: 15,
    subCategory: 'Furniture'
  },
  {
    id: 16,
    subCategory: 'Garage Sale'
  },
  {
    id: 17,
    subCategory: 'General'
  },
  {
    id: 18,
    subCategory: 'Heavy Equip'
  },
  {
    id: 19,
    subCategory: 'Household'
  },
  {
    id: 20,
    subCategory: 'Jewelry'
  },
  {
    id: 21,
    subCategory: 'Materials'
  },
  {
    id: 22,
    subCategory: 'Motorcycles'
  },
  {
    id: 23,
    subCategory: 'Musical Instruments'
  },
  {
    id: 24,
    subCategory: 'Photo / Video'
  },
  {
    id: 25,
    subCategory: 'RVs / Campers'
  }
];

const servicesCategories = [
  {
    id: 1,
    subCategory: 'Automotive'
  },
  {
    id: 2,
    subCategory: 'Beauty / Personal'
  },
  {
    id: 3,
    subCategory: 'Computer / IT'
  },
  {
    id: 4,
    subCategory: 'Creative'
  },
  {
    id: 5,
    subCategory: 'Dental'
  },
  {
    id: 6,
    subCategory: 'Event Mgmt'
  },
  {
    id: 7,
    subCategory: 'Farm / Garden'
  },
  {
    id: 8,
    subCategory: 'Financial'
  },
  {
    id: 9,
    subCategory: 'Health Care'
  },
  {
    id: 10,
    subCategory: 'Labor / Construction'
  },
  {
    id: 11,
    subCategory: 'Legal'
  },
  {
    id: 12,
    subCategory: 'Lessons / Coaching'
  },
  {
    id: 13,
    subCategory: 'Marine'
  },
  {
    id: 14,
    subCategory: 'Real State'
  },
  {
    id: 15,
    subCategory: 'Skilled Trades'
  },
  {
    id: 16,
    subCategory: 'Small Business'
  },
  {
    id: 17,
    subCategory: 'Therapeutic'
  },
  {
    id: 18,
    subCategory: 'Travel / Vacation'
  },
  {
    id: 19,
    subCategory: 'Writing / Editing'
  }
];

const jobsCategories = [
  {
    id: 1,
    subCategory: 'Accounting / Finance'
  },
  {
    id: 2,
    subCategory: 'Admin / Office'
  },
  {
    id: 3,
    subCategory: 'Architect / Engineer'
  },
  {
    id: 4,
    subCategory: 'Art / Media / Design'
  },
  {
    id: 5,
    subCategory: 'Aerospace / Science'
  },
  {
    id: 6,
    subCategory: 'Business Management'
  },
  {
    id: 7,
    subCategory: 'Customer Service'
  },
  {
    id: 8,
    subCategory: 'Education'
  },
  {
    id: 9,
    subCategory: 'Food / Bev / Hosp'
  },
  {
    id: 10,
    subCategory: 'General Labor'
  },
  {
    id: 11,
    subCategory: 'Government'
  },
  {
    id: 12,
    subCategory: 'Human Resources'
  },
  {
    id: 13,
    subCategory: 'IT / Software / Computer'
  },
  {
    id: 14,
    subCategory: 'Legal / Paralegal'
  },
  {
    id: 15,
    subCategory: 'Manufacturing'
  },
  {
    id: 16,
    subCategory: 'Sales / Marketing'
  }
];

const cryptoCategories = [
  {
    id: 1,
    subCategory: 'Local + OmniCoin'
  },
  {
    id: 2,
    subCategory: 'Local + Bitcoin'
  },
  {
    id: 3,
    subCategory: 'Local + Eutherium'
  },
  {
    id: 4,
    subCategory: 'Local + Monero'
  },
  {
    id: 5,
    subCategory: 'Local + Other'
  },
  {
    id: 6,
    subCategory: 'OmniCoin + Bitcoin'
  },
  {
    id: 7,
    subCategory: 'Omnicoin + Other'
  }
];

const featureListings = [
  {
    id: 1,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 2,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 3,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 4,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 5,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 6,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 8,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 9,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 10,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 11,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 12,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
];

const forSaleListings = [
  {
    id: 1,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 2,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 3,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 4,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 5,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 6,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
];

const jobsListings = [
  {
    id: 1,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 2,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 3,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 4,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 5,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 6,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
];

const rentalsListings = [
  {
    id: 1,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 2,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 3,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 4,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 5,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 6,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
];

const servicesListings = [
  {
    id: 5,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 6,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 8,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 9,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 10,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
];

const cryptoBazaarListings = [
  {
    id: 6,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 8,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 9,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 10,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 11,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
];

const messages = defineMessages({
  welcome: {
    id: 'Marketplace.welcome',
    defaultMessage: 'Welcome to OmniBazaar'
  },
  featuredListings: {
    id: 'Marketplace.featuredListings',
    defaultMessage: 'Featured listings'
  },
  home: {
    id: 'Marketplace.home',
    defaultMessage: 'Home'
  },
  more: {
    id: 'Marketplace.more',
    defaultMessage: 'More'
  },
  about: {
    id: 'Marketplace.about',
    defaultMessage: 'About'
  },
  forSale: {
    id: 'Marketplace.forSale',
    defaultMessage: 'For Sale'
  },
  jobs: {
    id: 'Marketplace.jobs',
    defaultMessage: 'Jobs'
  },
  services: {
    id: 'Marketplace.services',
    defaultMessage: 'Services'
  },
  cryptoBazaar: {
    id: 'Marketplace.cryptoBazaar',
    defaultMessage: 'CryptoBazaar'
  },
  rentals: {
    id: 'Marketplace.rentals',
    defaultMessage: 'Rentals'
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
  addListing: {
    id: 'Marketplace.addListing',
    defaultMessage: 'ADD LISTING'
  },
});

class Marketplace extends Component {
  componentDidMount() {
    this.fetchFeatureList();
  }

  fetchFeatureList() {
    this.props.marketplaceActions.getFeatureList(featureListings);
    this.props.marketplaceActions.getForSaleList(forSaleListings);
    this.props.marketplaceActions.getJobsList(jobsListings);
    this.props.marketplaceActions.getRentalsList(rentalsListings);
    this.props.marketplaceActions.getServicesList(servicesListings);
    this.props.marketplaceActions.getCryptoBazaarList(cryptoBazaarListings);

    this.props.marketplaceActions.getForSaleCategories(forSaleCategories);
    this.props.marketplaceActions.getServicesCategories(servicesCategories);
    this.props.marketplaceActions.getJobsCategories(jobsCategories);
    this.props.marketplaceActions.getCryptoCategories(cryptoCategories);
  }

  onClickItem = () => {
    console.log('View detail');
  };

  listItems(items) {
    return (
      items.map((item) => {
        const style = { backgroundImage: `url(${item.image})` };
        let { description } = item;
        description = description.length > 55 ? `${description.substring(0, 55)}...` : description;

        return (
          <div key={`fl-item-${item.id}`} className="item">
            <div
              className="img-wrapper"
              style={style}
              onClick={this.onClickItem}
              onKeyDown={this.onClickItem}
              tabIndex={0}
              role="link"
            />
            <span
              className="title"
              onClick={this.onClickItem}
              role="link"
              onKeyDown={this.onClickItem}
              tabIndex={0}
            >
              {item.title}
            </span>
            <span className="subtitle">
              {item.category}
              <span>
                <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
              </span>
              {item.subCategory}
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

  renderCategory(categoryName, categoriesList, icon) {
    const { formatMessage } = this.props.intl;
    const style = { backgroundImage: `url(${icon})` };

    return (
      <div className="item" style={style}>
        <span className="title">{categoryName}</span>
        <div className="sub-categories">
          {categoriesList.map((subCategory) => (
            <div key={`sub-${categoryName}-${subCategory.id}`} className="sub-category">
              {subCategory.subCategory}
            </div>
          ))}
          {
            categoryName !== CategoriesTypes.CRYPTO_BAZAAR ?
              <div
                className="view-all"
                onClick={() => this.viewAllSubCategories(categoryName)}
                onKeyDown={() => this.viewAllSubCategories(categoryName)}
                tabIndex={0}
                role="link"
              >
                {formatMessage(messages.viewAll)}
              </div>
          : null}
        </div>
      </div>
    );
  }

  categoriesItems() {
    const { props } = this;

    return (
      <div className="items">
        {this.renderCategory(
            CategoriesTypes.FOR_SALE,
            props.marketplace.forSaleCategories,
            ForSaleIcon
        )}
        {this.renderCategory(
          CategoriesTypes.SERVICES,
          props.marketplace.servicesCategories,
          ServicesIcon
        )}
        {this.renderCategory(
          CategoriesTypes.JOBS,
          props.marketplace.jobsCategories,
          JobsIcon
        )}
        {this.renderCategory(
          CategoriesTypes.CRYPTO_BAZAAR,
          props.marketplace.cryptoCategories,
          CryptoIcon
        )}
      </div>
    );
  }

  renderMenu() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu">
        <ul>
          <li className="active">{formatMessage(messages.home)}</li>
          {this.forSaleSubMenu()}
          <li>{formatMessage(messages.services)}</li>
          <li>{formatMessage(messages.jobs)}</li>
          <li>{formatMessage(messages.cryptoBazaar)}</li>
          <li>{formatMessage(messages.more)}</li>
          <li>{formatMessage(messages.about)}</li>
        </ul>
        <div className="options">
          <Button icon className="button--green-bg">
            <Image src={AddIcon} width={iconSizeMedium} height={iconSizeMedium} />
            {formatMessage(messages.addListing)}
          </Button>
          <Image src={SearchIcon} width={iconSizeBig} height={iconSizeBig} />
          <Image src={UserIcon} width={iconSizeBig} height={iconSizeBig} />
        </div>
      </div>
    );
  }

  forSaleMenu() {
    const { formatMessage } = this.props.intl;

    return (
      <li>{formatMessage(messages.forSale)}</li>
    );
  }

  forSaleSubMenu() {
    const { props } = this;
    const { formatMessage } = this.props.intl;
    /*
    const containerClass = classNames({
      'button--primary': props.className === 'button--primary',
      'button--green': props.className === 'button--green',
      'button--green-bg': props.className === 'button--green-bg',
      'button--transparent': props.className === 'button--transparent',
    });
    */

    return (
      <Popup
        trigger={this.forSaleMenu()}
        hoverable
        basic
        on="click"
        position="top center"
        wide="very"
        hideOnScroll
        className="menu-popup orange"
      >
        <div>
          <p className="title">{formatMessage(messages.forSale)}</p>
          <div>
            Sub menu here
          </div>
        </div>
      </Popup>
    );
  }

  header() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="header">
        {this.renderMenu()}
        <span className="title">{formatMessage(messages.welcome)}</span>
        <div className="badges">
          <div className="badge blue">
            <Image src={OverviewIcon} width={iconSize} height={iconSize} />
            <span>{formatMessage(messages.overview)}</span>
          </div>
          <div className="badge green">
            <Image src={VersatilityIcon} width={iconSize} height={iconSize} />
            <span>{formatMessage(messages.versatility)}</span>
          </div>
          <div className="badge yellow">
            <Image src={BenefitIcon} width={iconSize} height={iconSize} />
            <span>{formatMessage(messages.benefits)}</span>
          </div>
          <div className="badge orange">
            <Image src={RewardsIcon} width={iconSize} height={iconSize} />
            <span>{formatMessage(messages.rewards)}</span>
          </div>
          <div className="badge red">
            <Image src={FeesIcon} width={iconSize} height={iconSize} />
            <span>{formatMessage(messages.fees)}</span>
          </div>
        </div>
      </div>
    );
  }

  seeAll = (listType) => {
    console.log(listType);
  };

  renderListItems(type, title, itemsList) {
    const { formatMessage } = this.props.intl;

    return (
      <div className="list-container">
        <div className="top-detail">
          <span className="heading">{title}</span>
          <Button content={formatMessage(messages.seeAll)} className="button--blue" onClick={() => this.seeAll(type)} />
        </div>
        <div className="items">
          {this.listItems(itemsList)}
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
          <Button content={formatMessage(messages.exchangeOne)} className="button--secondary" onClick={() => this.onClickExchangeOne()} />
          <Button content={formatMessage(messages.exchangeTwo)} className="button--secondary" onClick={() => this.onClickExchangeTwo()} />
        </div>
      </div>
    );
  }

  render() {
    const { props } = this;
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container">
        {this.header()}
        <div className="body">
          {this.renderListItems('featured', formatMessage(messages.featuredListings), props.marketplace.featureList)}
          <div className="categories-container">
            <div className="top-detail">
              <span className="heading">{formatMessage(messages.categories)}</span>
            </div>
            {this.categoriesItems()}
          </div>
          {this.renderListItems(
            CategoriesTypes.FOR_SALE,
            formatMessage(messages.forSale),
            props.marketplace.forSaleList
          )}
          {this.renderListItems(
            CategoriesTypes.SERVICES,
            formatMessage(messages.services),
            props.marketplace.servicesList
          )}
          {this.renderListItems(
            CategoriesTypes.JOBS,
            formatMessage(messages.jobs),
            props.marketplace.jobsList
          )}
          {this.renderListItems(
            CategoriesTypes.RENTALS,
            formatMessage(messages.rentals),
            props.marketplace.rentalsList
          )}
          {this.renderListItems(
            CategoriesTypes.CRYPTO_BAZAAR,
            formatMessage(messages.cryptoBazaar),
            props.marketplace.cryptoBazaarList
          )}
          <div>
            {this.renderFooter()}
          </div>
        </div>
      </div>
    );
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
    getForSaleCategories: PropTypes.func,
    getServicesCategories: PropTypes.func,
    getJobsCategories: PropTypes.func,
    getCryptoCategories: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Marketplace.defaultProps = {
  marketplaceActions: {},
  intl: {},
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
      getForSaleCategories,
      getServicesCategories,
      getJobsCategories,
      getCryptoCategories
    }, dispatch),
  }),
)(injectIntl(Marketplace));
