import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';

import OverviewIcon from './images/tile-overview.svg';
import VersatilityIcon from './images/tile-versatility.svg';
import RewardsIcon from './images/tile-rewards.svg';
import BenefitIcon from './images/tile-benefits.svg';
import FeesIcon from './images/tile-fees.svg';

import './marketplace.scss';

const iconSize = 20;

class Marketplace extends Component {
  render() {
    return (
      <div className="marketplace-container">
        <div className="header">
          <div className="menu">The menu</div>
          <span className="title">Welcome to OmniBazaar</span>
          <div className="badges">
            <div className="badge blue">
              <Image src={OverviewIcon} width={iconSize} height={iconSize} />
              <span>Badge</span>
            </div>
            <div className="badge green">
              <Image src={VersatilityIcon} width={iconSize} height={iconSize} />
              <span>Badge</span>
            </div>
            <div className="badge yellow">
              <Image src={BenefitIcon} width={iconSize} height={iconSize} />
              <span>Badge</span>
            </div>
            <div className="badge orange">
              <Image src={RewardsIcon} width={iconSize} height={iconSize} />
              <span>Badge</span>
            </div>
            <div className="badge red">
              <Image src={FeesIcon} width={iconSize} height={iconSize} />
              <span>Fees</span>
            </div>
          </div>
        </div>
        <div className="body">
          <div className="list-container">
            <div className="top-detail">
              <span className="heading">Featured listings</span>
              <Button content="SEE ALL" className="button--blue" />
            </div>
            <div className="items">
              <div className="item">
                <span className="title">Farco Jevellery</span>
                <span className="subtitle">For sale</span>
                <span className="description">At Farco Jewellers...</span>
              </div>
            </div>
          </div>
          <div>Categories</div>
          <div>For sale</div>
          <div>Jobs</div>
          <div>Rentals</div>
          <div>CryptoBazaar</div>
          <div className="footer">Get Some OmniCoins</div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ ...state.default }))(withRouter(Marketplace));
