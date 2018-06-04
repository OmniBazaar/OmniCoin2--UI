import React, { Component } from 'react';
import { Button, Image, Icon, Popup } from 'semantic-ui-react';
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
  mainCategories
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

import './marketplace.scss';

const iconSize = 20;
const iconSizeSmall = 12;

const featureListings = [
  {
    id: 1,
    date: '2018-01-05',
    price: 6840,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 2,
    date: '2017-01-05',
    price: 6840,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 3,
    date: '2017-11-05',
    price: 6840,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 4,
    date: '2018-03-05',
    price: 6840,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 5,
    date: '2018-03-05',
    price: 36840,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 6,
    date: '2018-02-05',
    price: 87240,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    date: '2018-01-01',
    price: 6840,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 8,
    date: '2018-02-02',
    price: 6840,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 9,
    date: '2018-03-15',
    price: 6840,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 10,
    date: '2018-02-02',
    price: 6840,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 11,
    date: '2018-03-12',
    price: 6840,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 12,
    date: '2018-01-22',
    price: 6840,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 13,
    date: '2018-02-16',
    price: 6840,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 14,
    date: '2018-02-18',
    price: 6840,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 15,
    date: '2018-03-19',
    price: 6840,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 16,
    date: '2018-03-20',
    price: 3550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 17,
    date: '2018-03-21',
    price: 1550,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 18,
    date: '2018-03-08',
    price: 5550,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 19,
    date: '2018-03-08',
    price: 5550,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 20,
    date: '2018-03-08',
    price: 5550,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 21,
    date: '2018-03-08',
    price: 5550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 22,
    date: '2018-03-21',
    price: 465550,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 23,
    date: '2018-03-21',
    price: 5550,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 24,
    date: '2018-03-08',
    price: 3550,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 25,
    date: '2018-03-21',
    price: 345550,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 26,
    date: '2018-03-21',
    price: 4550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 27,
    date: '2018-03-08',
    price: 2550,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 28,
    date: '2018-03-08',
    price: 6840,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 29,
    date: '2018-03-21',
    price: 3550,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 30,
    date: '2018-03-08',
    price: 12550,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 31,
    date: '2018-03-21',
    price: 5550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 32,
    date: '2018-03-21',
    price: 5550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 33,
    date: '2018-03-08',
    price: 5550,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
];

const forSaleListings = [
  {
    id: 1,
    date: '2018-01-05',
    price: 5550,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jewelry',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 2,
    date: '2018-03-08',
    price: 5550,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 3,
    price: 10550,
    date: '2018-03-08',
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 4,
    date: '2018-03-08',
    price: 850,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 5,
    date: '2018-03-21',
    price: 9550,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 6,
    date: '2018-03-21',
    price: 1550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    date: '2018-01-15',
    price: 2050,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 8,
    date: '2018-03-21',
    price: 1550,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 9,
    date: '2018-03-21',
    price: 5028,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 10,
    date: '2018-03-21',
    price: 6505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 11,
    date: '2018-03-21',
    price: 6505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 12,
    date: '2018-03-21',
    price: 3550,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 13,
    date: '2018-02-12',
    price: 6505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 14,
    date: '2018-03-21',
    price: 6505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 15,
    date: '2018-03-11',
    price: 6505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 16,
    date: '2017-01-21',
    price: 6505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 17,
    date: '2018-03-21',
    price: 6505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 18,
    date: '2018-01-15',
    price: 6505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 19,
    date: '2018-01-15',
    price: 6505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 20,
    date: '2018-01-15',
    price: 6505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 21,
    date: '2018-01-05',
    price: 3550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 22,
    date: '2018-01-05',
    price: 6505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 23,
    date: '2018-03-21',
    price: 6505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 24,
    date: '2018-01-15',
    price: 6505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 25,
    date: '2018-01-05',
    price: 6505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 26,
    date: '2018-01-05',
    price: 6505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 27,
    date: '2018-01-15',
    price: 16505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 28,
    date: '2018-01-15',
    price: 2505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 29,
    date: '2018-01-15',
    price: 6905,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 30,
    date: '2018-01-15',
    price: 6505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 31,
    date: '2018-01-15',
    price: 3550,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 32,
    date: '2018-01-15',
    price: 6505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 33,
    date: '2018-01-15',
    price: 6505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 34,
    date: '2018-01-15',
    price: 2505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 35,
    date: '2018-01-15',
    price: 2505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 36,
    date: '2018-01-15',
    price: 2505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 37,
    date: '2018-01-15',
    price: 2505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 38,
    date: '2018-01-15',
    price: 2505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 39,
    date: '2018-01-15',
    price: 2505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 40,
    date: '2018-01-15',
    price: 3505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 41,
    date: '2018-01-15',
    price: 300505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 42,
    date: '2018-01-15',
    price: 3505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 43,
    date: '2018-01-15',
    price: 20505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 44,
    date: '2018-01-15',
    price: 3505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 45,
    date: '2018-01-15',
    price: 3505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 46,
    date: '2018-01-15',
    price: 3505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 47,
    date: '2018-01-15',
    price: 3505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 48,
    date: '2018-01-15',
    price: 3505,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jewelry',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 49,
    date: '2018-01-15',
    price: 3505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 50,
    date: '2018-01-15',
    price: 3505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 51,
    date: '2018-01-15',
    price: 3505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 52,
    date: '2018-01-15',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 53,
    date: '2018-01-15',
    price: 504505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 54,
    date: '2018-01-15',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 55,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 56,
    date: '2018-01-15',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 57,
    date: '2018-03-14',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 58,
    date: '2018-02-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 59,
    date: '2018-01-15',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 60,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 61,
    date: '2017-01-15',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 62,
    date: '2018-01-15',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 63,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 64,
    date: '2018-01-15',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 65,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 66,
    date: '2018-01-15',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 67,
    date: '2018-01-15',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 68,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 69,
    date: '2018-01-15',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 70,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 71,
    date: '2018-01-15',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 72,
    date: '2018-01-15',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 73,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 74,
    date: '2018-01-15',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 75,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 76,
    date: '2018-01-15',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 77,
    date: '2018-01-15',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 78,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 79,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 80,
    date: '2018-01-15',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 81,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 82,
    date: '2018-01-15',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 83,
    date: '2018-01-15',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 84,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 85,
    date: '2018-01-15',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 86,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 87,
    date: '2018-01-14',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 88,
    date: '2018-01-12',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 89,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 90,
    date: '2018-01-17',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 91,
    date: '2018-01-18',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 92,
    date: '2018-01-20',
    price: 4505,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 93,
    date: '2017-12-20',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 94,
    date: '2017-12-20',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 95,
    date: '2018-03-08',
    price: 4505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 96,
    date: '2017-12-20',
    price: 4505,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 97,
    date: '2017-12-20',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 98,
    date: '2018-03-20',
    price: 1405,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 99,
    date: '2017-12-20',
    price: 1205,
    title: 'UX Designer',
    category: 'For sale',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 100,
    date: '2018-03-20',
    price: 1300,
    title: 'Mega Plumber',
    category: 'For sale',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
];

const jobsListings = [
  {
    id: 1,
    date: '2018-01-15',
    price: 3505,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 2,
    date: '2018-01-15',
    price: 53305,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 3,
    date: '2018-01-15',
    price: 20505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 4,
    date: '2018-01-15',
    price: 14505,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 5,
    date: '2018-01-15',
    price: 94505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 6,
    date: '2018-01-15',
    price: 2505,
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
    date: '2018-01-15',
    price: 566505,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 2,
    date: '2018-01-15',
    price: 4505,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 3,
    date: '2018-01-15',
    price: 2505,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 4,
    date: '2018-01-15',
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 5,
    title: 'Ferrari',
    price: 804505,
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 6,
    date: '2018-01-15',
    price: 1505,
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
    date: '2018-01-15',
    price: 478505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 6,
    date: '2018-01-15',
    price: 904505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    date: '2018-01-15',
    price: 4505,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 8,
    date: '2018-01-15',
    price: 4505,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 9,
    date: '2018-01-15',
    price: 4505,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 10,
    date: '2018-01-15',
    price: 4505,
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
    date: '2018-01-15',
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    date: '2018-01-15',
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 8,
    date: '2018-01-15',
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 9,
    date: '2018-01-15',
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 10,
    date: '2018-01-15',
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 11,
    date: '2018-01-15',
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
  }
});

class Marketplace extends Component {
  componentWillMount() {
    this.props.accountActions.getPublisherData();
  }

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
  }

  listItems(items, size) {
    return (
      items.slice(0, size).map((item) => {
        const style = { backgroundImage: `url(${item.image})` };
        let { description } = item;
        description = description.length > 55 ? `${description.substring(0, 55)}...` : description;

        return (
          <div key={`fl-item-${item.id}`} className="item">
            <Link to={`listing/${item.id}`}>
              <div className="img-wrapper" style={style} />
            </Link>
            <Link to={`listing/${item.id}`}>
              <span className="title" >
                {item.title}
              </span>
            </Link>
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

  renderForSaleCategory() {
    const categoryName = CategoriesTypes.FOR_SALE;
    const { formatMessage } = this.props.intl;
    const style = { backgroundImage: `url(${ForSaleIcon})` };

    return (
      <div className="item" style={style}>
        <span className="title">{formatMessage(mainCategories.forSale)}</span>
        <div className="sub-categories">
          <div className="sub-category">{formatMessage(saleCategories.antiques)}</div>
          <div className="sub-category">{formatMessage(saleCategories.appliances)}</div>
          <div className="sub-category">{formatMessage(saleCategories.artsCrafts)}</div>
          <div className="sub-category">{formatMessage(saleCategories.babyChild)}</div>
          <div className="sub-category">{formatMessage(saleCategories.barter)}</div>
          <div className="sub-category">{formatMessage(saleCategories.beautyHealth)}</div>
          <div className="sub-category">{formatMessage(saleCategories.bikes)}</div>
          <div className="sub-category">{formatMessage(saleCategories.boats)}</div>
          <div className="sub-category">{formatMessage(saleCategories.books)}</div>
          <div className="sub-category">{formatMessage(saleCategories.business)}</div>
          <div className="sub-category">{formatMessage(saleCategories.carsTrucks)}</div>
          <div className="sub-category">{formatMessage(saleCategories.cdDvd)}</div>
          <div className="sub-category">{formatMessage(saleCategories.farmGarden)}</div>
          <div className="sub-category">{formatMessage(saleCategories.free)}</div>
          <div className="sub-category">{formatMessage(saleCategories.furniture)}</div>
          <div className="sub-category">{formatMessage(saleCategories.garageSale)}</div>
          <div className="sub-category">{formatMessage(saleCategories.general)}</div>
          <div className="sub-category">{formatMessage(saleCategories.heavyEquip)}</div>
          <div className="sub-category">{formatMessage(saleCategories.household)}</div>
          <div className="sub-category">{formatMessage(saleCategories.jewelry)}</div>
          <div className="sub-category">{formatMessage(saleCategories.materials)}</div>
          <div className="sub-category">{formatMessage(saleCategories.motorcycles)}</div>
          <div className="sub-category">{formatMessage(saleCategories.musicalInstruments)}</div>
          <div className="sub-category">{formatMessage(saleCategories.photoVideo)}</div>
          <div className="sub-category">{formatMessage(saleCategories.rvCampers)}</div>
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
          <div className="sub-category">{formatMessage(servicesCategories.automotive)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.beautyPersonal)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.computerIT)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.creative)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.dental)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.eventMgmt)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.farmGarden)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.financial)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.healthCare)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.laborConstruction)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.legal)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.lessonsCoaching)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.marine)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.realState)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.skilledTrades)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.smallBusiness)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.therapeutic)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.travelVacation)}</div>
          <div className="sub-category">{formatMessage(servicesCategories.writingEditing)}</div>
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
          <div className="sub-category">{formatMessage(jobsCategories.accounting)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.adminOffice)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.architect)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.artMediaDesign)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.aerospace)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.businessManagement)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.customerService)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.education)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.foodBev)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.generalLabor)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.government)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.humanResources)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.itSoftware)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.legalParalegal)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.manufacturing)}</div>
          <div className="sub-category">{formatMessage(jobsCategories.salesMarketing)}</div>
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
          <div className="sub-category">{formatMessage(cryptoCategories.localOmniCoin)}</div>
          <div className="sub-category">{formatMessage(cryptoCategories.localBitCoin)}</div>
          <div className="sub-category">{formatMessage(cryptoCategories.localEutherium)}</div>
          <div className="sub-category">{formatMessage(cryptoCategories.localMonero)}</div>
          <div className="sub-category">{formatMessage(cryptoCategories.localOther)}</div>
          <div className="sub-category">{formatMessage(cryptoCategories.omniCoinBitCoin)}</div>
          <div className="sub-category">{formatMessage(cryptoCategories.omniCoinOther)}</div>
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
              <div>10,000 XOM</div>
            </div>
            <div className="separator" />
            <div className="item">
              <div>{formatMessage(messages.firstSale)}</div>
              <div>{formatMessage(messages.upTo)}</div>
              <div>10,000 XOM</div>
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
    return (
      <div className="menu-wrapper benefits">
        <p className="title">Benefits</p>
        <div className="items" />
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
    return (
      <Popup
        trigger={this.badgeMenu(icon, title)}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="badges-popup"
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

  /**
   * todo:
   * onClick SEE ALL, open view with all results for that category
   */
  viewCategory = (categoryId) => {
    if (this.props.marketplaceActions.setActiveCategory) {
      this.props.marketplaceActions.setActiveCategory(categoryId);
    }
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

  renderMarketHome() {
    const { props } = this;
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container">
        {this.header()}
        <div className="body">
          {this.renderListItems(
            CategoriesTypes.FEATURED,
            formatMessage(mainCategories.featuredListings),
            props.marketplace.featureList
          )}
          <div className="categories-container">
            <div className="top-detail">
              <span className="heading">{formatMessage(messages.categories)}</span>
            </div>
            {this.categoriesItems()}
          </div>
          {this.renderListItems(
            CategoriesTypes.FOR_SALE,
            formatMessage(mainCategories.forSale),
            props.marketplace.forSaleList
          )}
          {this.renderListItems(
            CategoriesTypes.SERVICES,
            formatMessage(mainCategories.services),
            props.marketplace.servicesList
          )}
          {this.renderListItems(
            CategoriesTypes.JOBS,
            formatMessage(mainCategories.jobs),
            props.marketplace.jobsList
          )}
          {this.renderListItems(
            CategoriesTypes.RENTALS,
            formatMessage(mainCategories.rentals),
            props.marketplace.rentalsList
          )}
          {this.renderListItems(
            CategoriesTypes.CRYPTO_BAZAAR,
            formatMessage(mainCategories.cryptoBazaar),
            props.marketplace.cryptoBazaarList
          )}
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
      setActiveCategory
    }, dispatch),
    accountActions: bindActionCreators({
      getPublisherData
    }, dispatch)
  }),
)(injectIntl(Marketplace));
