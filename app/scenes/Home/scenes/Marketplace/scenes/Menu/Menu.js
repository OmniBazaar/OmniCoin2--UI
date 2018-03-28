import React, { Component } from 'react';
import { Button, Image, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';

import AddIcon from '../../images/btn-add-listing.svg';
import SearchIcon from '../../images/btn-search-norm.svg';
import SearchHoverIcon from '../../images/btn-search-hover.svg';
import SearchPressIcon from '../../images/btn-search-press.svg';
import UserIcon from '../../images/btn-user-menu-norm.svg';
import UserHoverIcon from '../../images/btn-user-menu-hover.svg';
import UserPressIcon from '../../images/btn-user-menu-press.svg';
import OmniLogo from '../../images/omni-logo-about.svg';

import { setActiveCategory } from '../../../../../../services/marketplace/marketplaceActions';

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

const logoWidth = 200;
const iconSizeBig = 25;
const iconSizeMedium = 15;

const messages = defineMessages({
  addListing: {
    id: 'Marketplace.addListing',
    defaultMessage: 'ADD LISTING'
  },
  community: {
    id: 'Marketplace.community',
    defaultMessage: 'Community'
  },
  housing: {
    id: 'Marketplace.housing',
    defaultMessage: 'Housing'
  },
  gigs: {
    id: 'Marketplace.gigs',
    defaultMessage: 'Gigs'
  },
  quickLinks: {
    id: 'Marketplace.quickLinks',
    defaultMessage: 'Quick Links'
  },
  support: {
    id: 'Marketplace.support',
    defaultMessage: 'Support'
  },
  usefulLinks: {
    id: 'Marketplace.usefulLinks',
    defaultMessage: 'Useful Links'
  },
  omniLink: {
    id: 'Marketplace.omniLink',
    defaultMessage: 'omnibazaar.com'
  },
});

class Menu extends Component {
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

  renderOption(category, parentCategory) {
    const { formatMessage } = this.props.intl;
    const type = category.id;
    const parent = parentCategory ? parentCategory.id : null;

    return (
      <span
        onClick={() => this.viewCategory(type, parent)}
        onKeyDown={() => this.viewCategory(type, parent)}
        tabIndex={0}
        role="link"
      >
        {formatMessage(category)}
      </span>
    );
  }

  viewCategory = (categoryId, parent) => {
    if (this.props.marketplaceActions.setActiveCategory) {
      this.props.marketplaceActions.setActiveCategory(categoryId, parent);
    }
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
            {this.renderOption(saleCategories.antiques, mainCategories.forSale)}
            {this.renderOption(saleCategories.appliances, mainCategories.forSale)}
            {this.renderOption(saleCategories.artsCrafts, mainCategories.forSale)}
            {this.renderOption(saleCategories.babyChild, mainCategories.forSale)}
            {this.renderOption(saleCategories.barter, mainCategories.forSale)}
            {this.renderOption(saleCategories.beautyHealth, mainCategories.forSale)}
            {this.renderOption(saleCategories.bikes, mainCategories.forSale)}
            {this.renderOption(saleCategories.boats, mainCategories.forSale)}
            {this.renderOption(saleCategories.books, mainCategories.forSale)}
            {this.renderOption(saleCategories.business, mainCategories.forSale)}
            {this.renderOption(saleCategories.carsTrucks, mainCategories.forSale)}
            {this.renderOption(saleCategories.cdDvd, mainCategories.forSale)}
            {this.renderOption(saleCategories.farmGarden, mainCategories.forSale)}
            {this.renderOption(saleCategories.free, mainCategories.forSale)}
            {this.renderOption(saleCategories.furniture, mainCategories.forSale)}
            {this.renderOption(saleCategories.garageSale, mainCategories.forSale)}
            {this.renderOption(saleCategories.general, mainCategories.forSale)}
            {this.renderOption(saleCategories.heavyEquip, mainCategories.forSale)}
            {this.renderOption(saleCategories.household, mainCategories.forSale)}
            {this.renderOption(saleCategories.jewelry, mainCategories.forSale)}
            {this.renderOption(saleCategories.materials, mainCategories.forSale)}
            {this.renderOption(saleCategories.motorcycles, mainCategories.forSale)}
            {this.renderOption(saleCategories.musicalInstruments, mainCategories.forSale)}
            {this.renderOption(saleCategories.photoVideo, mainCategories.forSale)}
            {this.renderOption(saleCategories.rvCampers, mainCategories.forSale)}
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
            {this.renderOption(servicesCategories.automotive, mainCategories.services)}
            {this.renderOption(servicesCategories.beautyPersonal, mainCategories.services)}
            {this.renderOption(servicesCategories.computerIT, mainCategories.services)}
            {this.renderOption(servicesCategories.creative, mainCategories.services)}
            {this.renderOption(servicesCategories.dental, mainCategories.services)}
            {this.renderOption(servicesCategories.eventMgmt, mainCategories.services)}
            {this.renderOption(servicesCategories.farmGarden, mainCategories.services)}
            {this.renderOption(servicesCategories.financial, mainCategories.services)}
            {this.renderOption(servicesCategories.healthCare, mainCategories.services)}
            {this.renderOption(servicesCategories.laborConstruction, mainCategories.services)}
            {this.renderOption(servicesCategories.legal, mainCategories.services)}
            {this.renderOption(servicesCategories.lessonsCoaching, mainCategories.services)}
            {this.renderOption(servicesCategories.marine, mainCategories.services)}
            {this.renderOption(servicesCategories.realState, mainCategories.services)}
            {this.renderOption(servicesCategories.skilledTrades, mainCategories.services)}
            {this.renderOption(servicesCategories.smallBusiness, mainCategories.services)}
            {this.renderOption(servicesCategories.therapeutic, mainCategories.services)}
            {this.renderOption(servicesCategories.travelVacation, mainCategories.services)}
            {this.renderOption(servicesCategories.writingEditing, mainCategories.services)}
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
            {this.renderOption(jobsCategories.accounting, mainCategories.jobs)}
            {this.renderOption(jobsCategories.adminOffice, mainCategories.jobs)}
            {this.renderOption(jobsCategories.architect, mainCategories.jobs)}
            {this.renderOption(jobsCategories.artMediaDesign, mainCategories.jobs)}
            {this.renderOption(jobsCategories.aerospace, mainCategories.jobs)}
            {this.renderOption(jobsCategories.businessManagement, mainCategories.jobs)}
            {this.renderOption(jobsCategories.customerService, mainCategories.jobs)}
            {this.renderOption(jobsCategories.education, mainCategories.jobs)}
            {this.renderOption(jobsCategories.foodBev, mainCategories.jobs)}
            {this.renderOption(jobsCategories.generalLabor, mainCategories.jobs)}
            {this.renderOption(jobsCategories.government, mainCategories.jobs)}
            {this.renderOption(jobsCategories.humanResources, mainCategories.jobs)}
            {this.renderOption(jobsCategories.itSoftware, mainCategories.jobs)}
            {this.renderOption(jobsCategories.legalParalegal, mainCategories.jobs)}
            {this.renderOption(jobsCategories.manufacturing, mainCategories.jobs)}
            {this.renderOption(jobsCategories.salesMarketing, mainCategories.jobs)}
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
            {this.renderOption(cryptoCategories.localOmniCoin, mainCategories.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localBitCoin, mainCategories.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localEutherium, mainCategories.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localMonero, mainCategories.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localOther, mainCategories.cryptoBazaar)}
            {this.renderOption(cryptoCategories.omniCoinBitCoin, mainCategories.cryptoBazaar)}
            {this.renderOption(cryptoCategories.omniCoinOther, mainCategories.cryptoBazaar)}
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
              <Image src={OmniLogo} width={logoWidth} />
              <p className="link">{formatMessage(messages.omniLink)}</p>
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.quickLinks)}</p>
            <div className="sub-categories">
              {this.renderOption(aboutCategories.home, mainCategories.about)}
              {this.renderOption(aboutCategories.features, mainCategories.about)}
              {this.renderOption(aboutCategories.theTeam, mainCategories.about)}
              {this.renderOption(aboutCategories.roadmap, mainCategories.about)}
              {this.renderOption(aboutCategories.downloads, mainCategories.about)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.support)}</p>
            <div className="sub-categories">
              {this.renderOption(aboutCategories.tutorialVideos, mainCategories.about)}
              {this.renderOption(aboutCategories.community, mainCategories.about)}
              {this.renderOption(aboutCategories.slack, mainCategories.about)}
              {this.renderOption(aboutCategories.blog, mainCategories.about)}
              {this.renderOption(aboutCategories.contact, mainCategories.about)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.usefulLinks)}</p>
            <div className="sub-categories">
              {this.renderOption(aboutCategories.privacyPolicy, mainCategories.about)}
              {this.renderOption(aboutCategories.termsOfUse, mainCategories.about)}
              {this.renderOption(aboutCategories.webWallet, mainCategories.about)}
              {this.renderOption(aboutCategories.ominCoinExplorer, mainCategories.about)}
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
        <div className="link-menu">{formatMessage(userMenu.recentSearches)}</div>
        <div className="link-menu">{formatMessage(userMenu.myPurchases)}</div>
        <div className="link-menu">{formatMessage(userMenu.favoriteListings)}</div>
        <div className="link-menu">{formatMessage(userMenu.newListingDefaults)}</div>
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
            <span
              onClick={() => this.viewCategory(mainCategories.home.id)}
              onKeyDown={() => this.viewCategory(mainCategories.home.id)}
              tabIndex={0}
              role="link"
            >
              {formatMessage(mainCategories.home)}
            </span>
          </li>
          {this.renderForSaleSubMenu()}
          {this.renderServicesSubMenu()}
          {this.renderJobsSubMenu()}
          {this.renderCryptoSubMenu()}
          {this.renderMoreSubMenu()}
          {this.renderAboutSubMenu()}
        </ul>
        <div className="options">
          <Button icon className="button--green-bg">
            <Image src={AddIcon} width={iconSizeMedium} height={iconSizeMedium} />
            {formatMessage(messages.addListing)}
          </Button>
          <Image src={SearchIcon} width={iconSizeBig} height={iconSizeBig} />
          {this.renderUserMenu()}
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  setActiveCategory: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Menu.defaultProps = {
  intl: {},
  setActiveCategory: () => {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    marketplaceActions: bindActionCreators({
      setActiveCategory,
    }, dispatch),
  }),
)(injectIntl(Menu));
