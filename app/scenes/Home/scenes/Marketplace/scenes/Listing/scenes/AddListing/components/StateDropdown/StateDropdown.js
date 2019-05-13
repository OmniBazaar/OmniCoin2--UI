import React, { Component } from 'react';
import countryRegionData from 'country-region-data';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class StateDropdown extends Component {
	state = {
	  options: []
	}

	componentWillMount() {
	  this.getStateOptions(this.props.country);
	}

	componentWillReceiveProps(nextProps) {
	  if (nextProps.country !== this.props.country) {
	    this.getStateOptions(nextProps.country);
	  }
	}

	getStateOptions(country) {
	  for (const i in countryRegionData) {
	    if (countryRegionData[i].countryName === country) {
	      const options = countryRegionData[i].regions.map(item => {
	        const { name } = item;
	        return {
	          value: name,
	          text: name
	        };
	      });

	      this.setState({ options });
	      break;
	    }
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
		const { required } = this.props;
	  return (
	<Dropdown
		className={cn({required: required && !value})}
    search
    compact
    selection
    placeholder={this.props.placeholder}
    options={this.state.options}
    onChange={this.onChange.bind(this)}
    value={value}
  />
	  );
	}
}

StateDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  country: PropTypes.string,
  input: PropTypes.shape({
  	onChange: PropTypes.func,
  	value: PropTypes.string
  })
};

StateDropdown.defaultProps = {
  country: '',
  input: {}
};

export default StateDropdown;
