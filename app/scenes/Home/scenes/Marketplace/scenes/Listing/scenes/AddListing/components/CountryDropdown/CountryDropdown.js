import React, { Component } from 'react';
import countryRegionData from 'country-region-data';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class CountryDropdown extends Component {
  componentWillMount() {
    this.options = countryRegionData.map(item => {
      const { countryName } = item;
      return {
        value: countryName,
        text: countryName
      };
    });
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
        search
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

CountryDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  input: PropTypes.shape({
  	onChange: PropTypes.func,
  	value: PropTypes.string
  })
};

export default CountryDropdown;
