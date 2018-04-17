import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Tab, Dropdown, Icon } from 'semantic-ui-react';

import 'react-image-gallery/styles/scss/image-gallery.scss';

import MyListingsTable from '../MyListingsTable/MyListingsTable';
import Menu from '../../../Marketplace/scenes/Menu/Menu';
import CurrencyDropdown from '../../../../components/CurrencyDropdown/CurrencyDropdown';

import './my-listings.scss';

import { getMyListings, setPaginationMyListings } from '../../../../../../services/listing/listingActions';

import '../../../Marketplace/marketplace.scss';
import '../../../Marketplace/scenes/CategoryListing/listings.scss';

const iconSize = 42;

const myListings = [
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

const messages = defineMessages({
  firstItem: {
    id: 'Listing.firstItem',
    defaultMessage: 'First item'
  },
  lastItem: {
    id: 'Listing.lastItem',
    defaultMessage: 'Last item'
  },
  previousItem: {
    id: 'Listing.previousItem',
    defaultMessage: 'Previous item'
  },
  nextItem: {
    id: 'Listing.nextItem',
    defaultMessage: 'Next item'
  },
  first: {
    id: 'Listing.first',
    defaultMessage: 'First'
  },
  last: {
    id: 'Listing.last',
    defaultMessage: 'Last'
  },
  prev: {
    id: 'Listing.prev',
    defaultMessage: 'Prev'
  },
  next: {
    id: 'Listing.next',
    defaultMessage: 'Next'
  },
  byDate: {
    id: 'Listing.byDate',
    defaultMessage: 'By Date'
  },
  lowestPrice: {
    id: 'Listing.lowestPrice',
    defaultMessage: 'Lowest Price'
  },
  highestPrice: {
    id: 'Listing.highestPrice',
    defaultMessage: 'Highest Price'
  },
  allCategories: {
    id: 'Listing.allCategories',
    defaultMessage: 'All Categories'
  },
  marketplace: {
    id: 'Listing.marketplace',
    defaultMessage: 'Marketplace'
  },
  myListings: {
    id: 'Listing.myListings',
    defaultMessage: 'My Listings'
  },
});

const options = [
  { key: 1, text: 'Category 1', value: 'category1' },
  { key: 2, text: 'Category 2', value: 'category2' },
];

class MyListings extends Component {
  componentDidMount() {
    this.props.listingActions.getMyListings(myListings);
    this.props.listingActions.setPaginationMyListings(3 * 6);
  }

  renderMyListings() {
    const { formatMessage } = this.props.intl;
    const myListingsList = this.props.listing.myListings;

    return (
      <div className="list-container my-listings">
        <div className="filters">
          <Dropdown
            button
            className="categories icon"
            floating
            options={options}
            placeholder={formatMessage(messages.allCategories)}
          />
          <CurrencyDropdown />
        </div>
        <Tab
          className="tabs"
          menu={{ secondary: true, pointing: true }}
          panes={[
            {
              menuItem: formatMessage(messages.byDate),
              render: () => (
                <Tab.Pane>
                  <MyListingsTable
                    myListings={myListingsList}
                    sortBy="date"
                    sortDirection="descending"
                    rowsPerPage={3 * 6}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              )
            },
            {
              menuItem: formatMessage(messages.lowestPrice),
              render: () => (
                <Tab.Pane>
                  <MyListingsTable
                    myListings={myListingsList}
                    sortBy="price"
                    sortDirection="ascending"
                    rowsPerPage={3 * 6}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              )
            },
            {
              menuItem: formatMessage(messages.highestPrice),
              render: () => (
                <Tab.Pane>
                  <MyListingsTable
                    myListings={myListingsList}
                    sortBy="price"
                    sortDirection="descending"
                    rowsPerPage={3 * 6}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              ),
            }
          ]}
        />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container category-listing listing container">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                <div className="parent">
                  <span>{formatMessage(messages.marketplace)}</span>
                  <Icon name="long arrow right" width={iconSize} height={iconSize} />
                </div>
                <span className="child">{formatMessage(messages.myListings)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            {this.renderMyListings()}
          </div>
        </div>
      </div>
    );
  }
}

MyListings.propTypes = {
  listingActions: PropTypes.shape({
    getMyListings: PropTypes.func,
    setPaginationMyListings: PropTypes.func,
  }),
  listing: PropTypes.shape({
    myListings: PropTypes.array,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

MyListings.defaultProps = {
  listingActions: {},
  listing: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      getMyListings,
      setPaginationMyListings
    }, dispatch),
  }),
)(injectIntl(MyListings));
