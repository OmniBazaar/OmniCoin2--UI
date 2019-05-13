import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import currencies from '../../../../../../commons/currencies';

class CurrencyDropdown extends Component {
  componentWillMount() {
    const { formatMessage } = this.props.intl;
    let currenciesData = currencies;
    if (this.props.disableAllOption) {
      currenciesData = {
        ...currencies
      };
      delete currenciesData.ALL;
    }

    this.options = Object.keys(currenciesData).map(id => ({
      value: id,
      text: formatMessage(currenciesData[id])
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
    const { required } = this.props;
    return (
      <Dropdown
        className={cn({required: required && !value})}
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

CurrencyDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default injectIntl(CurrencyDropdown);
