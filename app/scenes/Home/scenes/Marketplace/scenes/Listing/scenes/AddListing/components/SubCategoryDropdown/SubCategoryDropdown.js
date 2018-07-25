import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import {
  allCategories,
  saleCategories,
  servicesCategories,
  jobsCategories,
  cryptoCategories,
  communityCategories,
  housingCategories,
  gigsCategories
} from '../../../../../../categories';

const subcategoryMap = {
  all: allCategories,
  forSale: saleCategories,
  services: servicesCategories,
  jobs: jobsCategories,
  cryptoBazaar: cryptoCategories,
  community: communityCategories,
  housing: housingCategories,
  gigs: gigsCategories
};

class SubCategoryDropdown extends Component {
  getCategories() {
    if (!this.props.parentCategory) {
      return [];
    }

    const subcategories = subcategoryMap[this.props.parentCategory];
    if (subcategories) {
      const { formatMessage } = this.props.intl;

      if (this.props.disableAllOption) {
        delete subcategories.all;
      }

      return Object.keys(subcategories).map(key => ({
        value: key,
        text: formatMessage(subcategories[key])
      }));
    }
    return [];
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
        options={this.getCategories()}
        onChange={this.onChange.bind(this)}
        value={value}
      />
    );
  }
}

SubCategoryDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  parentCategory: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired
};

SubCategoryDropdown.defaultProps = {
  parentCategory: null
};

export default injectIntl(SubCategoryDropdown);
