import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { NavLink } from 'react-router-dom';
import { injectIntl, defineMessages } from 'react-intl';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { history } from 'react-router-prop-types';
import {
  Popup,
  Button,
  Grid,
  Dimmer,
  Loader,
  Form,
  Image,
  Icon
} from 'semantic-ui-react';
import hash from 'object-hash';
import dateformat from 'dateformat';
import { startCase } from 'lodash';

import './search-menu.scss';

import CategoryDropdown from '../../../../scenes/Listing/scenes/AddListing/components/CategoryDropdown/CategoryDropdown';
import SearchIcon from '../../../../images/btn-search-norm.svg';
import { getSavedSearches, searchListings } from '../../../../../../../../services/search/searchActions';
import { getPublisherData } from '../../../../../../../../services/accountSettings/accountActions';

const messages = defineMessages({
  default: {
    id: 'SearchMenu.default',
    defaultMessage: 'Default'
  },
  connectingToDht: {
    id: 'SearchMenu.connectingToDht',
    defaultMessage: 'Connecting to DHT'
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
  noSavedSearches: {
    id: 'SearchMenu.noSavedSearches',
    defaultMessage: 'You haven\'t saved any searches yet.'
  }
});

const iconSizeSmall = 12;
const maxSearches = 5;
const iconSizeMedium = 15;
const iconSizeBig = 25;

class SearchMenu extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    const { currentUser } = this.props.auth;
    this.props.publisherActions.getPublisherData();
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
        <CategoryDropdown
          placeholder={dropdownPlaceholder}
          selection
          input={{
            value: input.category,
            onChange: (value) => input.onChange({
              ...input.value,
              category: value
            }),
          }}
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

    return (
      savedSearches.length === 0
        ?
          <Grid.Row>
            <Grid.Column width={16}>{formatMessage(messages.noSavedSearches)}</Grid.Column>
          </Grid.Row>
        :
        savedSearches.slice(0, maxSearches).map((search) => (
          <Grid.Row key={hash(search)} onClick={() => this.handleSubmit({ search })} className="clickable">
            <Grid.Column width={4}>
              <span className="gray-text"> {search.searchTerm}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <span className="gray-text">{startCase(search.category)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <span className="gray-text">{startCase(search.subCategory)}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <span className="gray-text">{dateformat(search.date)}</span>
            </Grid.Column>
          </Grid.Row>
        ))
    );
  }

  handleSubmit(values) {
    let searchTerm = '';
    let category = 'all';
    if (values && values.search) {
      searchTerm = values.search.searchTerm;
      category = values.search.category;
    }

    this.props.history.push('/search-results');

    const { country, state, city } = this.props.account.publisherData;

    this.props.searchActions.searchListings(searchTerm, category || 'All', country, state, city, true, null, true);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { handleSubmit } = this.props;
    const { savedSearches } = this.props.search;
    return (
      <Popup
        trigger={<Image src={SearchIcon} width={iconSizeBig} height={iconSizeBig} />}
        hoverable={false}
        basic
        on="click"
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
            <Grid.Row>
              <Grid.Column width={8}>
                <span className="gray-text">{formatMessage(messages.saved)}</span>
              </Grid.Column>
            </Grid.Row>
            {this.recentSearches()}
            {savedSearches.length > maxSearches &&
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

SearchMenu.propTypes = {
  history,
  auth: PropTypes.shape({
    currentUser: PropTypes.shape(),
  }),
  searchActions: PropTypes.shape({
    searchListings: PropTypes.func,
    getSavedSearches: PropTypes.func,
  }),
  account: PropTypes.shape({
    publisherData: PropTypes.shape(),
  }),
  dht: PropTypes.shape({
    isConnecting: PropTypes.bool,
  }),
  handleSubmit: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  search: PropTypes.shape({
    savedSearches: PropTypes.array,
  }),
  publisherActions: PropTypes.shape({
    getPublisherData: PropTypes.func,
  }),
};

SearchMenu.defaultProps = {
  auth: {},
  account: {},
  dht: {},
  history: null,
  intl: {},
  search: {},
  searchActions: {},
  publisherActions: {},
  handleSubmit: () => null,
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      searchActions: bindActionCreators({
        searchListings,
        getSavedSearches
      }, dispatch),
      publisherActions: bindActionCreators({
        getPublisherData
      }, dispatch)
    })
  ),
  reduxForm({
    form: 'searchMenu',
    destroyOnUnmount: true,
  })
)(injectIntl(withRouter(SearchMenu)));
