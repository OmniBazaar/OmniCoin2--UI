import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import {connect} from "react-redux";
import { Field, reduxForm } from 'redux-form';
import { NavLink } from 'react-router-dom';
import { injectIntl, defineMessages } from 'react-intl';
import {
  Popup,
  Dropdown,
  Button,
  Grid,
  Dimmer,
  Loader,
  Form,
  Image,
  Icon
} from 'semantic-ui-react';
import hash from 'object-hash';

import './search-menu.scss';

import Checkbox from '../../../../../../../../components/Checkbox/Checkbox';
import SearchIcon from '../../../../images/btn-search-norm.svg';
import {
  getRecentSearches,
  setActiveCategory,
} from "../../../../../../../../services/marketplace/marketplaceActions";

import {
  searchListings
} from "../../../../../../../../services/search/searchActions";


const recentSearchesList = [
  {
    id: 1,
    date: '2018-04-19',
    search: 'car',
    filters: ['USA', 'Lowest price', 'Newest'],
  },
  {
    id: 2,
    date: '2018-04-19',
    search: 'motorcycles',
    filters: ['USA', 'Lowest price', 'Newest'],
  },
  {
    id: 3,
    date: '2018-04-20',
    search: 'cars',
    filters: ['USA', 'Lowest price'],
  },
  {
    id: 4,
    date: '2018-04-20',
    search: 'jewelry',
    filters: [],
  },
];

const messages = defineMessages({
  default: {
    id: 'SearchMenu.default',
    defaultMessage: 'Default'
  },
  connectingToDht: {
    id: 'SearchMenu.connectingToDht',
    defaultMessage: 'Connecting to dht'
  },
  recent: {
    id: 'SearchMenu.recent',
    defaultMessage: 'Recent'
  },
  extendedSearch: {
    id: 'SearchMenu.extendedSearch',
    defaultMessage: 'Extended Search'
  },
  viewAll: {
    id: 'SearchMenu.viewAll',
    defaultMessage: 'VIEW ALL'
  },
  searchingForPeers: {
    id: 'SearchMenu.searchingForPeers',
    defaultMessage: 'Searching for publishers'
  },
  loadingListings: {
    id: 'SearchMenu.loadingListings',
    defaultMessage: 'Loading listings'
  }
});

const iconSizeSmall = 12;
const maxSearches = 5;
const iconSizeMedium = 15;
const iconSizeBig = 25;

const options = [
  { key: 1, text: 'All Categories', value: 'all' },
  { key: 2, text: 'Category 1', value: 'category1' },
  { key: 3, text: 'Category 2', value: 'category2' },
  { key: 4, text: 'Category 3', value: 'category3' },
];

class SearchMenu extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.dht.isLoading && !nextProps.dht.isLoading) {
      console.log('Peers map', nextProps.dht.peers);
    }
  }

  componentDidMount() {
    this.props.marketplaceActions.getRecentSearches(recentSearchesList);
  }

  renderSelectField = ({
                         input, placeholder, dropdownPlaceholder
                       }) => (
    <div className="hybrid-input">
      <input
        value={input.value.searchTerm}
        type="text"
        className="textfield"
        placeholder={placeholder}
        onChange={(e) => input.onChange({
          ...input.value,
          searchTerm: e.target.value
        })}
      />
      <div className="search-actions">
        <Dropdown
          labeled
          defaultValue="all"
          options={options}
          placeholder={dropdownPlaceholder}
          onChange={(e, data) => input.onChange({
            ...input.value,
            category: value
          })}
          selection
          className="icon button--gray-text select-btn"
        />
        <Button
          content={<Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />}
          className="button--primary search-btn"
          type="submit"
        />
      </div>
    </div>
  );

  renderFilters(filters) {
    const { formatMessage } = this.props.intl;

    if (filters.length === 0) {
      return (
        <span>{formatMessage(messages.default)}</span>
      );
    }

    return (
      filters.map((filter, index) => {
        const comma = filters.length - 1 !== index ? ', ' : '';
        return (
          <span key={hash(filter)}>{`${filter}${comma}`}</span>
        );
      })
    );
  }

  recentSearches() {
    const { recentSearches } = this.props.marketplace;
    const { formatMessage } = this.props.intl;
    if (this.props.dht.isLoading || this.props.marketplace.loading) {
      return (
        <Grid.Row>
          <Grid.Column width={16} style={{display: 'flex', justifyContent: 'center'}}>
            <Loader
                    content={
                      this.props.dht.isLoading
                        ? formatMessage(messages.searchingForPeers)
                        : formatMessage(messages.loadingListings)
                    }
                    inline
                    active
            />
          </Grid.Column>
        </Grid.Row>
      );
    }
    return (
      recentSearches.slice(0, maxSearches).map((search) => (
        <Grid.Row key={hash(search)}>
          <Grid.Column width={8}>
            <span className="blue-text">{search.search}</span>
          </Grid.Column>
          <Grid.Column width={8}>
            <span className="gray-text">{this.renderFilters(search.filters)}</span>
          </Grid.Column>
        </Grid.Row>
      ))
    );
  }

  handleSubmit(values) {
    const { searchTerm, category } = values.search;
    this.props.searchActions.searchListings(searchTerm, category ? category: 'All');
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const isLoading = this.props.dht.isLoading || this.props.marketplace.loading;
    return (
      <Popup
        trigger={<Image src={SearchIcon} width={iconSizeBig} height={iconSizeBig} />}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="search-menu"
      >
        <Dimmer.Dimmable  as="div" dimmed={this.props.dht.isConnecting}>
          <Dimmer active={this.props.dht.isConnecting}>
            <Loader>{formatMessage(messages.connectingToDht)}</Loader>
          </Dimmer>
          <Form className="search-form" onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              type="text"
              name="search"
              placeholder="Search"
              dropdownPlaceholder="Categories"
              component={this.renderSelectField}
              className="textfield"
            />
          </Form>
          <Grid>
            {!isLoading &&
              <Grid.Row>
                <Grid.Column width={8}>
                  <span className="gray-text">{formatMessage(messages.recent)}</span>
                </Grid.Column>
                <Grid.Column width={8}>
                  <div className="check-wrapper">
                    <Checkbox
                      width={iconSizeMedium}
                      height={iconSizeMedium}
                    />
                    <div className="description-text">
                      {formatMessage(messages.extendedSearch)}
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
            }
            {this.recentSearches()}
            {!isLoading &&
              <Grid.Row>
                <Grid.Column width={12}/>
                <Grid.Column width={4} className="right">
                  <NavLink to="/saved-searches">
                    <Button content={formatMessage(messages.viewAll)} className="button--blue-text view-all"/>
                  </NavLink>
                </Grid.Column>
              </Grid.Row>
            }
          </Grid>
        </Dimmer.Dimmable>
      </Popup>
    );
  }
}


export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      marketplaceActions: bindActionCreators({
        getRecentSearches
      }, dispatch),
      searchActions: bindActionCreators({
        searchListings
      }, dispatch)
    }),
  ),
  reduxForm({
    form: 'searchMenu',
    destroyOnUnmount: true,
  }),
)(injectIntl(SearchMenu));
