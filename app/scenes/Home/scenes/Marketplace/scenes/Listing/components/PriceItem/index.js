import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Image } from 'semantic-ui-react';
import { setActiveCurrency } from '../../../../../../../../services/listing/listingActions';

import CheckIcon from './images/ui-price-check.svg';
import PriceInactiveIcon from './images/ui-price-inactive.svg';
import './price.scss';

const iconSize = 20;
const iconSizeSmall = 12;

class PriceItem extends Component {
  renderCheckIcon() {
    if (this.props.listing.buyListing.activeCurrency === this.props.coinLabel) {
      return <Image src={CheckIcon} width={iconSize} height={iconSize} />;
    }

    return <Image src={PriceInactiveIcon} width={iconSizeSmall} height={iconSizeSmall} />;
  }

  selectCurrency = () => {
    this.props.listingActions.setActiveCurrency(this.props.coinLabel);
  };

  render() {
    const { isUserOwner } = this.props;
    const priceClass = classNames({
      'price-item': true,
      'owner-view': isUserOwner,
      active: this.props.listing.buyListing.activeCurrency === this.props.coinLabel
    });

    return (
      <div
        className={priceClass}
        onClick={() => this.selectCurrency()}
        onKeyDown={() => this.selectCurrency()}
        tabIndex={0}
        role="link"
      >
        <span className="amount">{this.props.amount} {this.props.currency}</span>
        <div className="currency">
          <span>{this.props.coinLabel}</span>
          {!isUserOwner ?
            this.renderCheckIcon()
          : null }
        </div>
      </div>
    );
  }
}

PriceItem.propTypes = {
  amount: PropTypes.string,
  currency: PropTypes.string,
  coinLabel: PropTypes.string,
  isUserOwner: PropTypes.bool,
  listing: PropTypes.shape({
    activeCurrency: PropTypes.bool
  }),
  listingActions: PropTypes.shape({
    setActiveCurrency: PropTypes.func
  })
};

PriceItem.defaultProps = {
  amount: '0',
  currency: '',
  coinLabel: '',
  isUserOwner: false,
  listing: {},
  listingActions: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      setActiveCurrency
    }, dispatch),
  }),
)(PriceItem);
