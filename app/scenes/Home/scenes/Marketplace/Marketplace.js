import React, { Component } from 'react';
import { Button, Image, Icon } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import OverviewIcon from './images/tile-overview.svg';
import VersatilityIcon from './images/tile-versatility.svg';
import RewardsIcon from './images/tile-rewards.svg';
import BenefitIcon from './images/tile-benefits.svg';
import FeesIcon from './images/tile-fees.svg';
import ForSaleIcon from './images/bg-forsale.jpg';
import ServicesIcon from './images/bg-services.jpg';
import JobsIcon from './images/bg-jobs.jpg';
import CryptoIcon from './images/bg-crypto.jpg';

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
  }
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
  }

  listItems(items, size) {
    return (
      items.slice(0, size).map((item) => {
        const style = { backgroundImage: `url(${item.image})` };
        let { description } = item;
        description = description.length > 55 ? `${description.substring(0, 55)}...` : description;

        return (
          <div key={`fl-item-${item.id}`} className="item">
            <Link to={`listing/${item.id}/test`}>
              <div className="img-wrapper" style={style} />
            </Link>
            <Link to={`listing/${item.id}/test`}>
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

  header() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="header">
        <Menu />
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
  }),
)(injectIntl(Marketplace));
