import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import {
	saleCategories,
	servicesCategories,
	jobsCategories,
	cryptoCategories,
	communityCategories,
	housingCategories,
	gigsCategories
} from '../../../../../../categories';

const subcategoryMap = {
	'forSale': saleCategories,
	'services': servicesCategories,
	'jobs': jobsCategories,
	'cryptoBazaar': cryptoCategories ,
	'community': communityCategories,
	'housing': housingCategories,
	'gigs': gigsCategories
};

class SubCategoryDropdown extends Component {
	getCategories() {
		if (!this.props.parentCategory) {
			return [];
		}

		const subcategories = subcategoryMap[this.props.parentCategory]
		if (subcategories) {
			const { formatMessage } = this.props.intl;

			return Object.keys(subcategories).map(key => {
				return {
					value: key,
					text: formatMessage(subcategories[key])
				}
			});
		} else {
			return [];
		}
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
        options={this.getCategories()}
        onChange={this.onChange.bind(this)}
      />
		);
	}
};

SubCategoryDropdown.propTypes = {
	placeholder: PropTypes.string.isRequired,
	parentCategory: PropTypes.string.isRequired,
	intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired
};

export default injectIntl(SubCategoryDropdown)