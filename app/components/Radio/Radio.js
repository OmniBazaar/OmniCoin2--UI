import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CheckNormal from './images/rad-0-norm.svg';
import CheckPreNom from './images/rad-1-norm.svg';
import './raido.scss';

class Radio extends Component {
  constructor(props) {
    super(props);
    this.getIcon = this.getIcon.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getIcon() {
    return this.props.checked ? CheckPreNom : CheckNormal;
  }

  handleClick() {
    if (this.props.onChecked) {
      this.props.onChecked(this.props.value);
    }
  }

  render() {
    return (
      <div className="radio-container">
        <Image
          src={this.getIcon()}
          width={this.props.width}
          height={this.props.height}
          className="radio"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export default Radio;

Radio.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  value: PropTypes.string,
  checked: PropTypes.bool,
  onChecked: PropTypes.func
};

Radio.defaultProps = {
  height: 20,
  width: 20,
  value: '',
  checked: false,
  onChecked: null
};
