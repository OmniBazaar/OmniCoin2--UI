import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Button, Form, Tab, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import Checkbox from '../../../../../../components/Checkbox/Checkbox';
import SearchResultsTable from '../components/SearchResultsTable/SearchResultsTable';
import CurrencyDropdown from '../../../../components/CurrencyDropdown/CurrencyDropdown';

import Menu from '../../../Marketplace/scenes/Menu/Menu';

import {
  setExtendedSearch,
  getSearchResults,
  setPaginationSearchResults,
  filterSearchResults
} from '../../../../../../services/search/searchActions';

import './search-results.scss';

const iconSizeMedium = 15;
const iconSizeSmall = 12;

const options = [
  { key: 1, text: 'All Categories', value: 'all' },
  { key: 2, text: 'Category 1', value: 'category1' },
  { key: 3, text: 'Category 2', value: 'category2' },
];

const messages = defineMessages({
  marketplace: {
    id: 'SearchResults.marketplace',
    defaultMessage: 'Marketplace'
  },
  extendedSearch: {
    id: 'SearchResults.extendedSearch',
    defaultMessage: 'Extended Search'
  },
  search: {
    id: 'SearchResults.search',
    defaultMessage: 'Search'
  },
  saveSearch: {
    id: 'SearchResults.saveSearch',
    defaultMessage: 'SAVE SEARCH'
  },
  featured: {
    id: 'SearchResults.featured',
    defaultMessage: 'Featured'
  },
  newArrivals: {
    id: 'SearchResults.newArrivals',
    defaultMessage: 'New Arrivals'
  },
  lowestPrice: {
    id: 'SearchResults.lowestPrice',
    defaultMessage: 'Lowest Price'
  },
  highestPrice: {
    id: 'SearchResults.highestPrice',
    defaultMessage: 'Highest Price'
  },
  allCategories: {
    id: 'SearchResults.allCategories',
    defaultMessage: 'All Categories'
  },
  searchResults: {
    id: 'SearchResults.searchResults',
    defaultMessage: 'Search results'
  },
});

const searchResultsList = [
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
    price: 5840,
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

class SearchResults extends Component {
  componentDidMount() {
    this.props.searchActions.getSearchResults(searchResultsList);
    this.props.searchActions.setPaginationSearchResults(3 * 6);
  }

  toggleExtendedSearch = () => this.props.searchActions.setExtendedSearch();
  // setSearchText = () => this.props.searchActions.setSearchText();

  onSearch = () => {
    this.props.searchActions.filterSearchResults(this.searchInput.value);
  };

  renderButtonField = ({
    input, placeholder
  }) => (
    <div className="hybrid-input">
      <input
        {...input}
        ref={searchInput => { this.searchInput = searchInput; }}
        type="text"
        className="textfield"
        placeholder={placeholder}
      />
      <div className="search-actions">
        <Button
          content={<Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />}
          className="button--primary search-btn"
          onClick={this.onSearch}
        />
      </div>
    </div>
  );

  renderSearchResults() {
    const { formatMessage } = this.props.intl;
    const rowsPerPage = 3 * 6;
    const { searchResults } = this.props.search;

    return (
      <div className="list-container search-filters">
        <div className="filters">
          <Dropdown
            button
            className="categories icon"
            floating
            options={options}
            defaultValue="all"
            placeholder={formatMessage(messages.allCategories)}
          />
          <CurrencyDropdown />
        </div>
        <Tab
          className="tabs"
          menu={{ secondary: true, pointing: true }}
          panes={[
            {
              menuItem: formatMessage(messages.featured),
              render: () => (
                <Tab.Pane>
                  <SearchResultsTable
                    searchResults={searchResults}
                    sortBy="date"
                    sortDirection="ascending"
                    rowsPerPage={rowsPerPage}
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
              menuItem: formatMessage(messages.newArrivals),
              render: () => (
                <Tab.Pane>
                  <SearchResultsTable
                    searchResults={searchResults}
                    sortBy="date"
                    sortDirection="descending"
                    rowsPerPage={rowsPerPage}
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
                  <SearchResultsTable
                    searchResults={searchResults}
                    sortBy="price"
                    sortDirection="ascending"
                    rowsPerPage={rowsPerPage}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              ),
            },
            {
              menuItem: formatMessage(messages.highestPrice),
              render: () => (
                <Tab.Pane>
                  <SearchResultsTable
                    searchResults={searchResults}
                    sortBy="price"
                    sortDirection="descending"
                    rowsPerPage={rowsPerPage}
                    tableProps={{
                      sortable: false,
                      compact: true,
                      basic: 'very',
                      size: 'small'
                    }}
                  />
                </Tab.Pane>
              ),
            },
          ]}
        />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container category-listing search-results">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                <div className="parent">
                  <span>{formatMessage(messages.marketplace)}</span>
                  <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                </div>
                <span className="child">{formatMessage(messages.searchResults)}</span>
              </div>
              <div className="search-container">
                <Form className="search-form">
                  <Field
                    type="text"
                    name="search"
                    placeholder={formatMessage(messages.search)}
                    component={this.renderButtonField}
                    className="textfield"
                  />
                  <div className="check-wrapper">
                    <Checkbox
                      width={iconSizeMedium}
                      height={iconSizeMedium}
                      onChecked={this.toggleExtendedSearch}
                    />
                    <div className="description-text">
                      {formatMessage(messages.extendedSearch)}
                    </div>
                  </div>
                  <div className="btn-wrapper">
                    <Button content={formatMessage(messages.saveSearch)} className="button--blue-text" />
                  </div>
                </Form>
              </div>
            </div>
          </div>
          {this.renderSearchResults()}
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  search: PropTypes.shape({
    recentSearches: PropTypes.array,
    searchResults: PropTypes.array
  }),
  searchActions: PropTypes.shape({
    setExtendedSearch: PropTypes.func,
    getSearchResults: PropTypes.func,
    setPaginationSearchResults: PropTypes.func,
    filterSearchResults: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

SearchResults.defaultProps = {
  intl: {},
  search: {},
  searchActions: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      searchActions: bindActionCreators({
        setExtendedSearch,
        getSearchResults,
        setPaginationSearchResults,
        filterSearchResults
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'searchForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(SearchResults));
