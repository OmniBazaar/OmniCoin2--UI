import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';

class PriorityFeeDropdown extends Component {
  componentWillMount() {
    const { formatMessage } = this.props.intl;
    let { priorityFees } = this.props;
    
    this.options = Object.keys(priorityFees).map(id => ({
      value: parseInt(id),
      text: formatMessage(priorityFees[id])
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

PriorityFeeDropdown.propTypes = {
  placeholder: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export default injectIntl(PriorityFeeDropdown);
