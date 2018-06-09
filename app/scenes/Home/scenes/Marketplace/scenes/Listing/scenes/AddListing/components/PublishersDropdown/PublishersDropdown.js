import React, { Component } from 'react';
import { Dropdown, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {  injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPublishers } from "../../../../../../../../../../services/accountSettings/accountActions";

class PublishersDropdown extends Component {

  state = {
    disabled: false
  };

  componentWillMount() {
    this.props.accountActions.getPublishers();
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
      onChange
    } = this.props.input || this.props;
    if (!nextProps.account.publishers.loading && this.props.account.publishers.loading) {
      this.options = nextProps.account.publishers.publishers.map(publisher => ({
        value: publisher,
        text: publisher.name
      }));
      if (value && typeof value === 'string') {
        const publisher = this.options.find(el => el.value.publisher_ip === value);
        this.props.input.onChange(publisher.value);
        this.setState({disabled: true});
      }
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
    const { loading } = this.props.account.publishers;

    return (
      <Dropdown
        compact
        selection
        placeholder={this.props.placeholder}
        options={this.options}
        onChange={this.onChange.bind(this)}
        value={value}
        loading={loading}
        disabled={this.state.disabled}
      />
    );
  }
}

PublishersDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired
};

export default connect(
  state => ({
    account: state.default.account,
  }),
  (dispatch) => ({
    accountActions: bindActionCreators({ getPublishers }, dispatch)
  })
)(injectIntl(PublishersDropdown));
