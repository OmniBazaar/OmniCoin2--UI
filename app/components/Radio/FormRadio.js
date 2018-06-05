import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Radio from './Radio';

const size = 20;

class FormRadio extends Component {
  onChecked(isChecked) {
    const { onChange } = this.props.input;
    if (onChange) {
      onChange(this.props.value);
    }
  }

  render() {
    const { input, ...params } = this.props;
    const checked = input.value === this.props.value;
    return (
      <Radio {...params}
        checked={checked}
        onChecked={this.onChecked.bind(this)}/>
    );
  }
}

FormRadio.propTypes = {
  input: PropTypes.object.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  value: PropTypes.string.isRequired
};

FormRadio.defaultProps = {
  height: size,
  width: size
}

export default FormRadio;
