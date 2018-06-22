import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { history } from 'react-router-prop-types';

import { searchListings } from '../../../../../../services/search/searchActions';
import { setActiveCategory } from '../../../../../../services/marketplace/marketplaceActions';

import {
  mainCategories,
  getSubCategoryTitle
} from '../../categories';

import './breadcrumb.scss';

const iconSizeSmall = 12;

const messages = defineMessages({
  marketplace: {
    id: 'Breadcrumb.marketplace',
    defaultMessage: 'Marketplace'
  },
});

class Breadcrumb extends Component {
  viewCategory = (category, subCategory) => {
    const { country, city } = this.props.account.publisherData;
    this.props.history.push('/search-results');
    this.props.searchActions.searchListings(null, category || 'All', country, city, true, subCategory);
  };

  setActiveCategory = () => {
    if (this.props.searchActions.setActiveCategory) {
      this.props.searchActions.setActiveCategory('Marketplace.home');
    }
  };

  render() {
    const { formatMessage } = this.props.intl;
    const { category, subCategory } = this.props;
    const categoryTitle = category && category !== 'All' ? formatMessage(mainCategories[category]) : category || '';
    const subcategory = getSubCategoryTitle(category, subCategory);
    const subCategoryTitle = subcategory !== '' ? formatMessage(subcategory) : '';

    return (
      <div className="top-header">
        <div className="content">
          <div className="category-title">
            <div className="parent">
              <NavLink to="/marketplace" activeClassName="active" className="menu-item" onClick={() => this.setActiveCategory()}>
                <span className="link">
                  {formatMessage(messages.marketplace)}
                </span>
              </NavLink>
              {category ?
                <div className="subcategory">
                  <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                  <span
                    className="link"
                    onClick={() => this.viewCategory(category, null)}
                    onKeyDown={() => this.viewCategory(category, null)}
                    tabIndex={0}
                    role="link"
                  >
                    {categoryTitle || ''}
                  </span>
                </div>
              : null}
              {subCategory ?
                <div className="subcategory">
                  <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                  <span
                    className="link child"
                    onClick={() => this.viewCategory(category, subCategory)}
                    onKeyDown={() => this.viewCategory(category, subCategory)}
                    tabIndex={0}
                    role="link"
                  >
                    {subCategoryTitle || ''}
                  </span>
                </div>
              : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Breadcrumb.propTypes = {
  history,
  category: PropTypes.string,
  subCategory: PropTypes.string,
  searchActions: PropTypes.shape({
    searchListings: PropTypes.func,
    setActiveCategory: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  })
};

Breadcrumb.defaultProps = {
  intl: {},
  searchActions: {},
  category: '',
  subCategory: '',
  history: null,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    searchActions: bindActionCreators({
      searchListings,
      setActiveCategory
    }, dispatch),
  })
)(injectIntl(withRouter(Breadcrumb)));
