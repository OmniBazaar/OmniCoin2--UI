import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import CheckNormal from './images/ch-box-0-norm.svg';
import CheckPreNom from './images/ch-box-1-norm.svg';
import './checkbox.scss';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.getIcon = this.getIcon.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isChecked: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        isChecked: nextProps.value
      });
    }
  }

  getIcon() {
    return this.state.isChecked ? CheckPreNom : CheckNormal;
  }

  handleClick() {
    if (this.props.disabled) {
      return;
    }
    
    if (this.props.onChecked) {
      this.props.onChecked(!this.state.isChecked);
    }
    this.setState({
      isChecked: !this.state.isChecked
    });
  }

  render() {
    return (
      <div className="check-container">
        <Image
          src={this.getIcon()}
          width={this.props.width}
          height={this.props.height}
          className={cn('checkbox', this.props.disabled ? 'disabled' : '')}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

export default Checkbox;

Checkbox.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  value: PropTypes.bool,
  onChecked: PropTypes.func,
  disabled: PropTypes.bool
};

Checkbox.defaultProps = {
  height: 20,
  width: 20,
  value: false,
  onChecked: null,
  disabled: false
};
