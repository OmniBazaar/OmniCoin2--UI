import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'semantic-ui-react';

import { selectShippingRate } from '../../../../../../services/shipping/shippingActions';

import CheckIcon from './images/ui-price-check.svg';
import PriceInactiveIcon from './images/ui-price-inactive.svg';
import './price.scss';

const iconSize = 20;
const iconSizeSmall = 12;

class ShippingRate extends Component {
  renderCheckIcon() {
    if (this.props.shipping.selectedShippingRateIndex === this.props.index) {
      return <Image src={CheckIcon} width={iconSize} height={iconSize} />;
    }

    return <Image src={PriceInactiveIcon} width={iconSizeSmall} height={iconSizeSmall} />;
  }

  onSelect() {
    this.props.shippingActions.selectShippingRate(this.props.index);
    if (this.props.onSelect) {
      this.props.onSelect(this.props.shipping.shippingRates[this.props.index]);
    }
  }

  render() {
    const classes = classNames({
      'shipping-rate-item': true,
      active: this.props.index == this.props.shipping.selectedShippingRateIndex
    });

    const rate = this.props.shipping.shippingRates[this.props.index];
    if (!rate) {
      return null;
    }

    return (
      <div
        className={classes}
        onClick={this.onSelect.bind(this)}
        tabIndex={0}
        role="link"
      >
        
        <div className="service">
          <span>{rate.carrier} - {rate.service.split(/(?=[A-Z])/).join(' ')}</span>
        </div>
        <div className="amount">
          <span>{rate.rate} USD</span>
          {this.renderCheckIcon()}
        </div>
      </div>
    );
  }
}

ShippingRate.propTypes = {
  index: PropTypes.number.isRequired,
  shipping: PropTypes.shape({
    shippingRates: PropTypes.array
  }).isRequired,
  shippingActions: PropTypes.shape({
    selectShippingRate: PropTypes.func
  }).isRequired
};

export default connect(
  state => ({
    shipping: state.default.shipping
  }),
  dispatch => ({
    shippingActions: bindActionCreators({
      selectShippingRate
    }, dispatch)
  })
)(ShippingRate);
