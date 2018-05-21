import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

const currencies = {
	USD: {
    id: 'AddListing.currencyUsd',
    defaultMessage: 'US Dollar'
  },
	EUR: {
    id: 'AddListing.currencyEur',
    defaultMessage: 'Euro'
  },
	GBP: {
    id: 'AddListing.currencyGbp',
    defaultMessage: 'Sterling'
  },
	CAD: {
    id: 'AddListing.currencyCad',
    defaultMessage: 'Canadian Dollar'
  },
	SEK: {
    id: 'AddListing.currencySek',
    defaultMessage: 'Swedish Crown'
  },
	AUD: {
    id: 'AddListing.currencyAud',
    defaultMessage: 'Aussie'
  },
	JPY: {
    id: 'AddListing.currencyJpy',
    defaultMessage: 'Yen'
  },
};

class CurrencyDropdown extends Component {
	componentWillMount() {
		const { formatMessage } = this.props.intl;
		this.options = Object.keys(currencies).map(id => {
			return {
				value: id,
				text: formatMessage(currencies[id])
			}
		});
	}

	onChange(e, data) {
		const { onChange } = this.props.input;
		if (onChange) {
			onChange(data.value);
		}
	}

	render() {
		return (
			<Dropdown
        compact
        selection
        placeholder={this.props.placeholder}
        options={this.options}
        onChange={this.onChange.bind(this)}
      />
		);
	}
};

CurrencyDropdown.propTypes = {
	placeholder: PropTypes.string.isRequired,
	intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired
};

export default injectIntl(CurrencyDropdown)