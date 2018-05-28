import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckboxComponent from '../../../../../../../../../../components/Checkbox/Checkbox';

const size = 20;

class Checkbox extends Component {
  onChecked(isChecked) {
    const { onChange } = this.props.input;
    if (onChange) {
      onChange(isChecked);
    }
  }

  render() {
    const { value } = this.props.input;
    return (
      <div className="check-form field">
        <div className="description">
          <CheckboxComponent
            width={size}
            height={size}
            onChecked={this.onChecked.bind(this)}
          />
          <div className="description-text">
            {this.props.label}
          </div>
        </div>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired
};

export default Checkbox;
