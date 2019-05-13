import React, { Component } from 'react';
import { Dropdown, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cn from 'classnames';

import { getPublishers } from '../../../../../../../../../../services/accountSettings/accountActions';
import { searchPublishers } from '../../../../../../../../../../services/listing/listingActions';
import messages from '../../messages';

class PublishersDropdown extends Component {
  state = {
    options: [],
    loading: true
  };

  componentWillMount() {
    // this.props.accountActions.getPublishers();
    if (!this.props.allPublishers.loading) {
      this.props.listingActions.searchPublishers();
    }
  }

  showErrorToast(title, message) {
    toastr.error(title, message);
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
      onChange
    } = this.props.input || this.props;
    if (this.props.allPublishers.loading && !nextProps.allPublishers.loading) {
      this.props.listingActions.searchPublishers();
    }
    if (!nextProps.publishers.searching && this.props.publishers.searching) {
      this.setState({ loading: false });
      if (!nextProps.publishers.error) {
        const options = nextProps.publishers.publishers.map(publisher => {
          const publisherFee = publisher.publisher_fee ? `(${parseInt(publisher.publisher_fee) / 100}% Fee)` : '';
          const listingCount = publisher.listingCount ? `(${publisher.listingCount})` : '';

          return {
            value: publisher,
            text: publisher.name + ` ${publisherFee} ${listingCount}`,
            key: publisher.name
          }
        });
        this.setState({
          options
        });

        if (value && typeof value === 'string') {
          const publisher = options.find(el => el.value.publisher_ip === value);
          if (publisher) {
            this.props.input.onChange(publisher.value);
          }
        }
      } else {
        const { formatMessage } = this.props.intl;
        this.showErrorToast(
          formatMessage(messages.error),
          formatMessage(messages.searchPublishersErrorMessage)
        );
      }
    }
    if (this.props.keywords !== nextProps.keywords) {
      const keywords = nextProps.keywords.split(',').map(s => s.trim());
      this.props.listingActions.searchPublishers(keywords);
    }
  }

  onChange(e, data) {
    const { onChange } = this.props.input || this.props;
    if (onChange) {
      onChange(data.value);
    }
  }

  render() {
    const { value } = this.props.input || this.props;
    const { searching } = this.props.publishers;
    const { required } = this.props;
    return (
      <Dropdown
        className={cn({required: required && !value})}
        compact
        selection
        placeholder={this.props.placeholder}
        options={this.state.options}
        onChange={this.onChange.bind(this)}
        value={value}
        loading={this.state.loading || searching}
      />
    );
  }
}

PublishersDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired,
  listingActions: PropTypes.shape({
    searchPublishers: PropTypes.func
  }),
  keywords: PropTypes.string,
  publishers: PropTypes.shape({
    publishers: PropTypes.array,
    searching: PropTypes.bool,
    error: PropTypes.object
  }).isRequired,
  allPublishers: PropTypes.shape({
    loading: PropTypes.bool
  })
};

PublishersDropdown.defaultProps = {
  keywords: ''
};

export default connect(
  state => ({
    account: state.default.account,
    publishers: state.default.listing.publishers,
    allPublishers: state.default.listing.allPublishers
  }),
  (dispatch) => ({
    accountActions: bindActionCreators({ getPublishers }, dispatch),
    listingActions: bindActionCreators({
      searchPublishers
    }, dispatch)
  })
)(injectIntl(PublishersDropdown));
