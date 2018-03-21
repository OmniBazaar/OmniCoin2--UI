import React, { Component } from 'react';
import { Button, Image, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import OverviewIcon from './images/tile-overview.svg';
import VersatilityIcon from './images/tile-versatility.svg';
import RewardsIcon from './images/tile-rewards.svg';
import BenefitIcon from './images/tile-benefits.svg';
import FeesIcon from './images/tile-fees.svg';

import { getFeatureList, getForSale, getCategories } from '../../../../services/marketplace/marketplaceActions';

import './marketplace.scss';

const iconSize = 20;
const iconSizeSmall = 12;

const categories = [
  {
    id: 1,
    category: 'For sale',
    subCategories: [
      {
        id: 1,
        subCategory: 'Antiques'
      },
      {
        id: 2,
        subCategory: 'Appliances'
      }
    ]
  }
];

const featureListings = [
  {
    id: 1,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 2,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 3,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
  {
    id: 4,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 5,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 6,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 7,
    title: 'Mega Plumber',
    category: 'Services',
    subCategory: 'Home',
    description: 'We are looking for a plumber to work at our offices.',
    image: 'https://cdn.pixabay.com/photo/2018/03/12/11/07/plumber-3219389_640.jpg'
  },
  {
    id: 8,
    title: 'Lonely Star',
    category: 'For sale',
    subCategory: 'Others',
    description: 'For sale this beautiful yacht.',
    image: 'https://cdn.pixabay.com/photo/2017/06/22/16/46/luxury-yacht-2431471_640.jpg'
  },
  {
    id: 9,
    title: 'Ferrari',
    category: 'For sale',
    subCategory: 'Car',
    description: 'Beautiful brand new Ferrari car.',
    image: 'https://cdn.pixabay.com/photo/2018/03/20/21/47/car-3244831_640.jpg'
  },
  {
    id: 10,
    title: 'Farco Jevellery',
    category: 'For sale',
    subCategory: 'Jevellery',
    description: 'At Farco Jevellery we are focus on providing services for all different tastes.',
    image: 'https://cdn.pixabay.com/photo/2014/07/18/00/53/treasure-395994_640.jpg'
  },
  {
    id: 11,
    title: 'Suzuki Bandit 2000',
    category: 'For sale',
    subCategory: 'Motor Cycle',
    description: 'Awesome bike.',
    image: 'https://cdn.pixabay.com/photo/2016/09/27/15/15/motorcycle-1698615_640.jpg'
  },
  {
    id: 12,
    title: 'UX Designer',
    category: 'Jobs',
    subCategory: 'Design',
    description: 'We need someone to make a design for an awesome application.',
    image: 'https://cdn.pixabay.com/photo/2015/05/28/14/38/ux-787980_640.jpg'
  },
];

const messages = defineMessages({
  welcome: {
    id: 'Marketplace.welcome',
    defaultMessage: 'Welcome to OmniBazaar'
  },
  featuredListings: {
    id: 'Marketplace.featuredListings',
    defaultMessage: 'Featured listings'
  },
  seeAll: {
    id: 'Marketplace.seeAll',
    defaultMessage: 'SEE ALL'
  },
  overview: {
    id: 'Marketplace.overview',
    defaultMessage: 'Overview'
  },
  versatility: {
    id: 'Marketplace.versatility',
    defaultMessage: 'Versatility'
  },
  rewards: {
    id: 'Marketplace.rewards',
    defaultMessage: 'Rewards'
  },
  benefits: {
    id: 'Marketplace.benefits',
    defaultMessage: 'Benefits'
  },
  fees: {
    id: 'Marketplace.fees',
    defaultMessage: 'Fees'
  },
});

class Marketplace extends Component {
  componentDidMount() {
    this.fetchFeatureList();
  }

  fetchFeatureList() {
    this.props.marketplaceActions.getFeatureList(featureListings);
  }

  onClickItem = () => {
    console.log('View detail');
  };

  renderFeatureList() {
    const { props } = this;

    return (
      props.marketplace.featureList.map((item) => {
        const style = { backgroundImage: `url(${item.image})` };
        let { description } = item;
        description = description.length > 55 ? `${description.substring(0, 55)}...` : description;

        return (
          <div key={`fl-item-${item.id}`} className="item">
            <div
              className="img-wrapper"
              style={style}
              onClick={this.onClickItem}
              onKeyDown={this.onClickItem}
              tabIndex={0}
              role="link"
            />
            <span
              className="title"
              onClick={this.onClickItem}
              role="link"
              onKeyDown={this.onClickItem}
              tabIndex={0}
            >
              {item.title}
            </span>
            <span className="subtitle">
              {item.category}
              <span>
                <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
              </span>
              {item.subCategory}
            </span>
            <span className="description">{description}</span>
          </div>
        );
      })
    );
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container">
        <div className="header">
          <div className="menu">The menu</div>
          <span className="title">{formatMessage(messages.welcome)}</span>
          <div className="badges">
            <div className="badge blue">
              <Image src={OverviewIcon} width={iconSize} height={iconSize} />
              <span>{formatMessage(messages.overview)}</span>
            </div>
            <div className="badge green">
              <Image src={VersatilityIcon} width={iconSize} height={iconSize} />
              <span>{formatMessage(messages.versatility)}</span>
            </div>
            <div className="badge yellow">
              <Image src={BenefitIcon} width={iconSize} height={iconSize} />
              <span>{formatMessage(messages.benefits)}</span>
            </div>
            <div className="badge orange">
              <Image src={RewardsIcon} width={iconSize} height={iconSize} />
              <span>{formatMessage(messages.rewards)}</span>
            </div>
            <div className="badge red">
              <Image src={FeesIcon} width={iconSize} height={iconSize} />
              <span>{formatMessage(messages.fees)}</span>
            </div>
          </div>
        </div>
        <div className="body">
          <div className="list-container">
            <div className="top-detail">
              <span className="heading">{formatMessage(messages.featuredListings)}</span>
              <Button content={formatMessage(messages.seeAll)} className="button--blue" />
            </div>
            <div className="items">
              {this.renderFeatureList()}
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

Marketplace.propTypes = {
  marketplaceActions: PropTypes.shape({
    getFeatureList: PropTypes.func,
    getForSale: PropTypes.func,
    getCategories: PropTypes.func,
  }),
  marketplace: PropTypes.shape({
    categories: PropTypes.array,
    featureList: PropTypes.array,
    forSaleList: PropTypes.array,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Marketplace.defaultProps = {
  marketplaceActions: {},
  marketplace: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    marketplaceActions: bindActionCreators({
      getFeatureList,
      getForSale,
      getCategories
    }, dispatch),
  }),
)(injectIntl(Marketplace));
