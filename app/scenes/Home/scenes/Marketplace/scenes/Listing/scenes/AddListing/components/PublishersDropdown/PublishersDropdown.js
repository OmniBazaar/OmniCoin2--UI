import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {  injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPublishers } from "../../../../../../../../../../services/accountSettings/accountActions";

class PublishersDropdown extends Component {

  componentWillMount() {
    this.props.accountActions.getPublishers();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.account.publishers.loading && this.props.account.publishers.loading) {
      this.options = nextProps.account.publishers.publishers.map(publisher => ({
        value: publisher,
        text: publisher.name
      }));
    }
  }

  onChange(e, data) {
    const { onChange } = this.props.input;
    if (onChange) {
      onChange(data.value);
    }
  }

  render() {
    const { value } = this.props.input;
    return (
      <Dropdown
        compact
        selection
        placeholder={this.props.placeholder}
        options={this.options}
        onChange={this.onChange.bind(this)}
        value={value}
        loading={this.props.account.publishers.loading}
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
