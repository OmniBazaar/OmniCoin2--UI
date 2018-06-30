import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import currencies from '../../../../../../commons/currencies';

class CurrencyDropdown extends Component {
  componentWillMount() {
    const { formatMessage } = this.props.intl;
    this.options = Object.keys(currencies).map(id => ({
      value: id,
      text: formatMessage(currencies[id])
    }));
  }

  onChange(e, data) {
    const { onChange } = this.props.input;
    if (onChange) {
      onChange(data.value);
    }
    if (this.props.onChange) {
      this.props.onChange(data.value);
    }
  }

  render() {
    const { value } = this.props.input;
    const { removeAll } = this.props;
    let options = this.options;
    if(removeAll){
      options = options.filter((item) => item.text !== 'All');
    }

    return (
      <Dropdown
        compact
        selection
        placeholder={this.props.placeholder}
        options={options}
        onChange={this.onChange.bind(this)}
        value={value}
      />
    );
  }
}

CurrencyDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default injectIntl(CurrencyDropdown);
