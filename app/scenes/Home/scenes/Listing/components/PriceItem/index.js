import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './price.scss';

class PriceItem extends Component {
  render() {
    return (
      <div className="price-item">
        <span className="amount">{this.props.amount} {this.props.currency}</span>
        <span>{this.props.coinLabel}</span>
      </div>
    );
  }
}

PriceItem.propTypes = {
  amount: PropTypes.string,
  currency: PropTypes.string,
  coinLabel: PropTypes.string,
};

PriceItem.defaultProps = {
  amount: '0',
  currency: '',
  coinLabel: '',
};

export default PriceItem;
