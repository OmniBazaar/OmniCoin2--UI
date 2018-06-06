import React, { Component } from 'react';
import { Dropdown as DropdownLib } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

class Dropdown extends Component {
  componentWillMount() {
    const { formatMessage } = this.props.intl;
    const { options } = this.props;
    this.options = Object.keys(options).map(id => ({
      value: id,
      text: formatMessage(options[id])
    }));
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
      <DropdownLib
        compact
        selection
        placeholder={this.props.placeholder}
        options={this.options}
        onChange={this.onChange.bind(this)}
        value={value}
      />
    );
  }
}

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.object.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired
};

Dropdown.defaultProps = {
  placeholder: ''
}

export default injectIntl(Dropdown);