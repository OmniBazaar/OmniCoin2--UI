import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { NavLink } from 'react-router-dom';
import { injectIntl, defineMessages } from 'react-intl';
import { withRouter } from 'react-router';
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

import SearchIcon from '../../../../images/btn-search-norm.svg';
import { getSavedSearches } from '../../../../../../../../services/search/searchActions';

import { searchListings } from '../../../../../../../../services/search/searchActions';


const messages = defineMessages({
  default: {
    id: 'SearchMenu.default',
    defaultMessage: 'Default'
  },
  connectingToDht: {
    id: 'SearchMenu.connectingToDht',
    defaultMessage: 'Connecting to dht'
  },
  saved: {
    id: 'SearchMenu.saved',
    defaultMessage: 'Saved searches'
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
  },
  noSavedSearches: {
    id: 'SearchMenu.noSavedSearches',
    defaultMessage: 'You haven\'t saved any searches yet'
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


  componentDidMount() {
    const { currentUser } = this.props.auth;
    this.props.searchActions.getSavedSearches(currentUser.username);
  }

  renderSearchField = ({
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


  recentSearches() {
    const { savedSearches } = this.props.search;
    const { formatMessage } = this.props.intl;
    if (this.props.dht.isLoading || this.props.search.loading) {
      return (
        <Grid.Row>
          <Grid.Column width={16} style={{ display: 'flex', justifyContent: 'center' }}>
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
      savedSearches.length === 0
        ?
          <Grid.Row>
            <Grid.Column width={16}>{formatMessage(messages.noSavedSearches)}</Grid.Column>
          </Grid.Row>
        :
        savedSearches.slice(0, maxSearches).map((search) => (
          <Grid.Row key={hash(search)}>
            <Grid.Column width={8}>
              <span className="blue-text">{search.searchTerm}</span>
            </Grid.Column>
            <Grid.Column width={8}>
              <span className="gray-text">{search.date}</span>
            </Grid.Column>
          </Grid.Row>
        ))
    );
  }

  handleSubmit(values) {
    const { searchTerm, category } = values.search;
    this.props.history.push('/search-results');
    this.props.searchActions.searchListings(searchTerm, category || 'All');
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { savedSearches } = this.props.search;
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
        <Dimmer.Dimmable as="div" dimmed={this.props.dht.isConnecting}>
          <Dimmer active={this.props.dht.isConnecting}>
            <Loader>{formatMessage(messages.connectingToDht)}</Loader>
          </Dimmer>
          <Form className="search-form" onSubmit={handleSubmit(this.handleSubmit)}>
            <Field
              type="text"
              name="search"
              placeholder="Search"
              dropdownPlaceholder="Categories"
              component={this.renderSearchField}
              className="textfield"
            />
          </Form>
          <Grid>
            {!isLoading &&
              <Grid.Row>
                <Grid.Column width={8}>
                  <span className="gray-text">{formatMessage(messages.saved)}</span>
                </Grid.Column>
              </Grid.Row>
            }
            {this.recentSearches()}
            {!isLoading && savedSearches.length > maxSearches &&
              <Grid.Row>
                <Grid.Column width={12} />
                <Grid.Column width={4} className="right">
                  <NavLink to="/saved-searches">
                    <Button content={formatMessage(messages.viewAll)} className="button--blue-text view-all" />
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

SearchMenu = withRouter(SearchMenu);

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      searchActions: bindActionCreators({
        searchListings,
        getSavedSearches
      }, dispatch)
    }),
  ),
  reduxForm({
    form: 'searchMenu',
    destroyOnUnmount: true,
  }),
)(injectIntl(SearchMenu));
