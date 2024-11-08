import React, { Component } from 'react';
import { Pagination } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import './pagination.scss';

const messages = defineMessages({
  ariaFirst: {
    id: 'Pagination.ariaFirst',
    defaultMessage: 'First item'
  },
  contentFirst: {
    id: 'Pagination.contentFirst',
    defaultMessage: '<< First'
  },
  ariaLast: {
    id: 'Pagination.ariaLast',
    defaultMessage: 'Last item'
  },
  contentLast: {
    id: 'Pagination.contentLast',
    defaultMessage: 'Last >>'
  },
  ariaPrev: {
    id: 'Pagination.ariaPrev',
    defaultMessage: 'Previous item'
  },
  contentPrev: {
    id: 'Pagination.contentPrev',
    defaultMessage: '< Prev'
  },
  ariaNext: {
    id: 'Pagination.ariaNext',
    defaultMessage: 'Next item'
  },
  contentNext: {
    id: 'Pagination.contentNext',
    defaultMessage: 'Next >'
  }
});
class CustomPagination extends Component {
  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(e, data) {
    if (data.activePage !== this.props.activePage) {
      this.props.onPageChange(e, data);
    }
  }

  render() {
    const {
      activePage,
      totalPages
    } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="pagination-container">
        <Pagination
          activePage={activePage}
          boundaryRange={1}
          onPageChange={this.handlePageChange}
          size="mini"
          siblingRange={1}
          totalPages={totalPages}
          firstItem={{
            ariaLabel: formatMessage(messages.ariaFirst),
            content: formatMessage(messages.contentFirst)
          }}
          lastItem={{
            ariaLabel: formatMessage(messages.ariaLast),
            content: formatMessage(messages.contentLast)
          }}
          prevItem={{
            ariaLabel: formatMessage(messages.ariaPrev),
            content: formatMessage(messages.contentPrev)
          }}
          nextItem={{
            ariaLabel: formatMessage(messages.ariaNext),
            content: formatMessage(messages.contentNext)
          }}
        />
      </div>
    );
  }
}

CustomPagination.propTypes = {
  activePage: PropTypes.number,
  onPageChange: PropTypes.func,
  totalPages: PropTypes.number,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func
  })
};

CustomPagination.defaultProps = {
  activePage: 1,
  onPageChange: null,
  totalPages: 1,
  intl: {}
};

export default injectIntl(CustomPagination);
