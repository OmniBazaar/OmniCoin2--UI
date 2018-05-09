import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import SearchPrioritySetting from './components/SearchPrioritySetting';
import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import './search-priority.scss';

const messages = defineMessages({
  searchPriority: {
    id: 'SearchPriority.searchPriority',
    defaultMessage: 'Search Priority'
  },
});

class SearchPriority extends Component {
  render() {
  	const { formatMessage } = this.props.intl;
  	return (
    <div className="marketplace-container category-listing search-priority-container">
      <div className="header">
        <Menu />
      </div>
      <div className="body">
        <div className="top-header">
          <div className="content">
            <div className="category-title">
              {formatMessage(messages.searchPriority)}
            </div>
          </div>
        </div>

        <div className="body-content">
          <SearchPrioritySetting />
        </div>
      </div>
    </div>
    );
  }
}

SearchPriority.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

SearchPriority.defaultProps = {
  intl: {},
};

export default injectIntl(SearchPriority);
