import React, { Component } from 'react';
import { Dropdown as DropdownLib } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

class Dropdown extends Component {
  componentWillMount() {
    const { formatMessage } = this.props.intl;
    const { options } = this.props;
    this.options = options.map(opt => ({
      value: opt.id,
      text: formatMessage(opt.msg)
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
    const { className } = this.props;
    return (
      <DropdownLib
        compact
        selection
        placeholder={this.props.placeholder}
        options={this.options}
        onChange={this.onChange.bind(this)}
        value={value + ''}
        className={className}
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
};

export default injectIntl(Dropdown);
