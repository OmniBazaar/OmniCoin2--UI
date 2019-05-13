import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import units from '../../../../../../commons/units';

class UnitDropdown extends Component {
  componentWillMount() {
    const { formatMessage } = this.props.intl;
    this.options = Object.keys(units).map(id => ({
      value: id,
      text: formatMessage(units[id])
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

UnitDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired
};

export default injectIntl(UnitDropdown);
