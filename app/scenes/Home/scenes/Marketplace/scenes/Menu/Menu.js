import React, { Component } from 'react';
import { Button, Image, Popup, Form, Dropdown, Icon, Grid, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

import { searchListings } from '../../../../../../services/search/searchActions';

import { setActiveCategory } from '../../../../../../services/marketplace/marketplaceActions';

import SearchMenu from './components/SearchMenu/SearchMenu';

import AddIcon from '../../images/btn-add-listing.svg';
import UserIcon from '../../images/btn-user-menu-norm.svg';
import OmniLogo from '../../images/omni-logo-about.svg';

import {
  saleCategories,
  servicesCategories,
  jobsCategories,
  cryptoCategories,
  moreCategories,
  aboutCategories,
  userMenu,
  mainCategories
} from '../../categories';

import './menu.scss';

const logoWidth = 200;
const iconSizeBig = 25;
const iconSizeMedium = 15;
const iconSizeSmall = 12;
const maxSearches = 5;

const messages = defineMessages({
  addListing: {
    id: 'Menu.addListing',
    defaultMessage: 'ADD LISTING'
  },
  community: {
    id: 'Menu.community',
    defaultMessage: 'Community'
  },
  housing: {
    id: 'Menu.housing',
    defaultMessage: 'Housing'
  },
  gigs: {
    id: 'Menu.gigs',
    defaultMessage: 'Gigs'
  },
  quickLinks: {
    id: 'Menu.quickLinks',
    defaultMessage: 'Quick Links'
  },
  support: {
    id: 'Menu.support',
    defaultMessage: 'Support'
  },
  usefulLinks: {
    id: 'Menu.usefulLinks',
    defaultMessage: 'Useful Links'
  },
  omniLink: {
    id: 'Menu.omniLink',
    defaultMessage: 'omnibazaar.com'
  },
  recent: {
    id: 'Menu.recent',
    defaultMessage: 'Recent'
  }
});

class Menu extends Component {
  static getValue(category) {
    const arr = category.split('.');
    let categoryName = category;
    if (arr.length > 1) {
      categoryName = arr[1];
    }

    return categoryName;
  }


  menuTitle(category) {
    const { props } = this;
    const { formatMessage } = this.props.intl;
    const title = formatMessage(category);
    const optionMenuClass = classNames({
      active: props.marketplace.parentCategory === category.id ||
              props.marketplace.activeCategory === category.id
    });

    return (
      <li className={optionMenuClass}>
        <span
          onClick={() => this.viewCategory(category.id)}
          onKeyDown={() => this.viewCategory(category.id)}
          tabIndex={0}
          role="link"
        >
          {title}
        </span>
      </li>
    );
  }

  renderOption(category, parentCategory, path, isExternal) {
    const { formatMessage } = this.props.intl;
    const type = category.id;
    const parent = parentCategory ? parentCategory.id : null;

    const menuItem = (
      <div>
        <span
          onClick={() => this.viewCategory(type, parent)}
          onKeyDown={() => this.viewCategory(type, parent)}
          tabIndex={0}
          role="link"
        >
          {formatMessage(category)}
        </span>
      </div>
    );

    if (!isExternal) {
      return (
        <div>{menuItem}</div>
      );
    }

    return (
      <a href={path} target="_blank">
        {menuItem}
      </a>
    );
  }

  setActiveCategory = () => {
    if (this.props.marketplaceActions.setActiveCategory) {
      this.props.marketplaceActions.setActiveCategory('Marketplace.home');
    }
  };

  viewCategory = (categoryId, parent) => {
    this.props.history.push('/search-results');
    const { country, city } = this.props.account.publisherData;
    const category = parent ? Menu.getValue(parent) : Menu.getValue(categoryId);
    const subCategory = parent ? Menu.getValue(categoryId) : null;

    this.props.searchActions.searchListings(null, category, country, city, true, subCategory);
    this.props.marketplaceActions.setActiveCategory(categoryId);
  };

  renderForSaleSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(mainCategories.forSale);
    return (
      <Popup
        trigger={this.menuTitle(mainCategories.forSale)}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup for-sale"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            {Object.keys(saleCategories).map(key => this.renderOption(saleCategories[key], mainCategories.forSale))}
          </div>
        </div>
      </Popup>
    );
  }

  renderServicesSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(mainCategories.services);

    return (
      <Popup
        trigger={this.menuTitle(mainCategories.services)}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup services"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            {Object.keys(servicesCategories).map(key => this.renderOption(servicesCategories[key], mainCategories.services))}
          </div>
        </div>
      </Popup>
    );
  }

  renderJobsSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(mainCategories.jobs);

    return (
      <Popup
        trigger={this.menuTitle(mainCategories.jobs)}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup jobs"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            {Object.keys(jobsCategories).map(key => this.renderOption(jobsCategories[key], mainCategories.jobs))}
          </div>
        </div>
      </Popup>
    );
  }

  renderCryptoSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(mainCategories.cryptoBazaar);

    return (
      <Popup
        trigger={this.menuTitle(mainCategories.cryptoBazaar)}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup crypto"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            {Object.keys(cryptoCategories).map(key => this.renderOption(cryptoCategories[key], mainCategories.cryptoBazaar))}
          </div>
        </div>
      </Popup>
    );
  }

  renderMoreSubMenu() {
    const { formatMessage } = this.props.intl;

    return (
      <Popup
        trigger={this.menuTitle(mainCategories.more)}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup"
      >
        <div className="menu-wrapper more">
          <div className="submenu">
            <p className="title">{formatMessage(messages.community)}</p>
            <div className="sub-categories">
              {this.renderOption(moreCategories.activities, mainCategories.more)}
              {this.renderOption(moreCategories.arts, mainCategories.more)}
              {this.renderOption(moreCategories.childCare, mainCategories.more)}
              {this.renderOption(moreCategories.classes, mainCategories.more)}
              {this.renderOption(moreCategories.events, mainCategories.more)}
              {this.renderOption(moreCategories.general, mainCategories.more)}
              {this.renderOption(moreCategories.groups, mainCategories.more)}
              {this.renderOption(moreCategories.localNews, mainCategories.more)}
              {this.renderOption(moreCategories.lostFound, mainCategories.more)}
              {this.renderOption(moreCategories.music, mainCategories.more)}
              {this.renderOption(moreCategories.pets, mainCategories.more)}
              {this.renderOption(moreCategories.politics, mainCategories.more)}
              {this.renderOption(moreCategories.ridesharing, mainCategories.more)}
              {this.renderOption(moreCategories.volunteers, mainCategories.more)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.housing)}</p>
            <div className="sub-categories">
              {this.renderOption(moreCategories.aptsHousing, mainCategories.more)}
              {this.renderOption(moreCategories.housingSwap, mainCategories.more)}
              {this.renderOption(moreCategories.housingWanted, mainCategories.more)}
              {this.renderOption(moreCategories.officeCommercial, mainCategories.more)}
              {this.renderOption(moreCategories.realEstateSale, mainCategories.more)}
              {this.renderOption(moreCategories.roomsToShare, mainCategories.more)}
              {this.renderOption(moreCategories.roomWanted, mainCategories.more)}
              {this.renderOption(moreCategories.subletsTemporary, mainCategories.more)}
              {this.renderOption(moreCategories.vacation, mainCategories.more)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.gigs)}</p>
            <div className="sub-categories">
              {this.renderOption(moreCategories.babySitting, mainCategories.more)}
              {this.renderOption(moreCategories.cleaning, mainCategories.more)}
              {this.renderOption(moreCategories.crew, mainCategories.more)}
              {this.renderOption(moreCategories.delivery, mainCategories.more)}
              {this.renderOption(moreCategories.escort, mainCategories.more)}
              {this.renderOption(moreCategories.houseSitting, mainCategories.more)}
              {this.renderOption(moreCategories.handyman, mainCategories.more)}
              {this.renderOption(moreCategories.massage, mainCategories.more)}
              {this.renderOption(moreCategories.movingHauling, mainCategories.more)}
              {this.renderOption(moreCategories.petCare, mainCategories.more)}
              {this.renderOption(moreCategories.techSupport, mainCategories.more)}
            </div>
          </div>
        </div>
      </Popup>
    );
  }

  renderAboutSubMenu() {
    const { formatMessage } = this.props.intl;

    return (
      <Popup
        trigger={this.menuTitle(mainCategories.about)}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup"
      >
        <div className="menu-wrapper about">
          <div className="submenu logo">
            <div>
              <a href="http://omnibazaar.com/" target="_blank" rel="noopener noreferrer">
                <Image src={OmniLogo} width={logoWidth} />
                <p className="link">{formatMessage(messages.omniLink)}</p>
              </a>
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(aboutCategories.community)}</p>
            <div className="sub-categories">
              {this.renderOption(aboutCategories.telegramOmniBazaar, mainCategories.about, 'https://t.me/OmniBazaar', true)}
              {this.renderOption(aboutCategories.telegramOmniCoin, mainCategories.about, 'https://t.me/RealOmniCoin', true)}
              {this.renderOption(aboutCategories.reddit, mainCategories.about, 'https://www.reddit.com/r/OmniBazaar', true)}
              {this.renderOption(aboutCategories.twitter, mainCategories.about, 'https://twitter.com/OmniBazaar', true)}
              {this.renderOption(aboutCategories.youtube, mainCategories.about, 'https://www.youtube.com/channel/UCTbkLcypGrEeUKjZtxcGCBg', true)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(aboutCategories.documentation)}</p>
            <div className="sub-categories">
              {this.renderOption(aboutCategories.knowledgeBase, mainCategories.about, 'http://support.omnibazaar.com/knowledgebase/', true)}
              {this.renderOption(aboutCategories.forum, mainCategories.about, 'http://support.omnibazaar.com/', true)}
              {this.renderOption(aboutCategories.technology, mainCategories.about, 'http://omnibazaar.com/index.php/support/technology', true)}
              {this.renderOption(aboutCategories.whitePaper, mainCategories.about, 'http://omnibazaar.com/index.php/support/white-paper', true)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(aboutCategories.connections)}</p>
            <div className="sub-categories">
              {this.renderOption(aboutCategories.downloadOmniBazaar, mainCategories.about, 'http://download.omnibazaar.com/support/download', true)}
              {this.renderOption(aboutCategories.blockExplorer, mainCategories.about, '', true)}
              {this.renderOption(aboutCategories.blog, mainCategories.about, 'http://omnibazaar.com/index.php/about/news', true)}
              {this.renderOption(aboutCategories.newsletter, mainCategories.about, 'http://eepurl.com/M708n', true)}
              {this.renderOption(aboutCategories.contact, mainCategories.about, 'http://omnibazaar.com/index.php/about/contact', true)}
            </div>
          </div>
        </div>
      </Popup>
    );
  }

  renderUserMenu() {
    const { formatMessage } = this.props.intl;

    return (
      <Popup
        trigger={<Image src={UserIcon} width={iconSizeBig} height={iconSizeBig} />}
        hoverable
        basic
        on="hover"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="user-menu"
      >
        <div className="link-menu">
          <NavLink to="/recent-searches">{formatMessage(userMenu.recentSearches)}</NavLink>
        </div>
        <div className="link-menu">
          <NavLink to="/listings">{formatMessage(userMenu.myListings)}</NavLink>
        </div>
        <div className="link-menu">{formatMessage(userMenu.myPurchases)}</div>
        <div className="link-menu">
          <NavLink to="/favorite-listings">{formatMessage(userMenu.favoriteListings)}</NavLink>
        </div>
        <div className="link-menu">
          <NavLink to="/listings-defaults">{formatMessage(userMenu.newListingDefaults)}</NavLink>
        </div>
        <div className="link-menu">
          <NavLink to="/search-priority">{formatMessage(userMenu.searchPriority)}</NavLink>
        </div>
        <div className="link-menu">{formatMessage(userMenu.resyncWithServer)}</div>
      </Popup>
    );
  }

  render() {
    const { props } = this;
    const { formatMessage } = this.props.intl;
    const optionMenuClass = classNames({
      active: props.marketplace.activeCategory === mainCategories.home.id
    });

    return (
      <div className="menu">
        <ul>
          <li className={optionMenuClass}>
            <NavLink to="/marketplace" activeClassName="active" className="menu-item" onClick={() => this.setActiveCategory()}>
              <span>
                {formatMessage(mainCategories.home)}
              </span>
            </NavLink>
          </li>
          {this.renderForSaleSubMenu()}
          {this.renderServicesSubMenu()}
          {this.renderJobsSubMenu()}
          {this.renderCryptoSubMenu()}
          {this.renderMoreSubMenu()}
          {this.renderAboutSubMenu()}
        </ul>
        <div className="options">
          <NavLink to="/add-listing">
            <Button icon className="button--green-bg">
              <Image src={AddIcon} width={iconSizeMedium} height={iconSizeMedium} />
              {formatMessage(messages.addListing)}
            </Button>
          </NavLink>
          <SearchMenu />
          {this.renderUserMenu()}
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  marketplace: PropTypes.shape({
    recentSearches: PropTypes.array
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  searchActions: PropTypes.shape({
    searchListings: PropTypes.func,
  }),
  marketplaceActions: PropTypes.shape({
    setActiveCategory: PropTypes.func,
  }),
};

Menu.defaultProps = {
  intl: {},
  marketplace: {},
  searchActions: {},
  marketplaceActions: {},
};

Menu = withRouter(Menu);

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    marketplaceActions: bindActionCreators({
      setActiveCategory
    }, dispatch),
    searchActions: bindActionCreators({
      searchListings
    }, dispatch)
  })
)(injectIntl(Menu));
