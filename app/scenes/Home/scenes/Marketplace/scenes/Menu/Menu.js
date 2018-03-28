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
  communityCategories,
  housingCategories,
  gigsCategories,
  quickLinksCategories,
  supportCategories,
  usefulLinksCategories,
  userMenu
} from '../../categories';

const logoWidth = 200;
const iconSizeBig = 25;
const iconSizeMedium = 15;

const messages = defineMessages({
  home: {
    id: 'Marketplace.home',
    defaultMessage: 'Home'
  },
  more: {
    id: 'Marketplace.more',
    defaultMessage: 'More'
  },
  about: {
    id: 'Marketplace.about',
    defaultMessage: 'About'
  },
  forSale: {
    id: 'Marketplace.forSale',
    defaultMessage: 'For Sale'
  },
  jobs: {
    id: 'Marketplace.jobs',
    defaultMessage: 'Jobs'
  },
  services: {
    id: 'Marketplace.services',
    defaultMessage: 'Services'
  },
  cryptoBazaar: {
    id: 'Marketplace.cryptoBazaar',
    defaultMessage: 'CryptoBazaar'
  },
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
      active: props.marketplace.parentCategory === category.id
    });

    return (
      <li className={optionMenuClass}>{title}</li>
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
    const categoryTitle = formatMessage(messages.forSale);

    return (
      <Popup
        trigger={this.menuTitle(messages.forSale)}
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
            {this.renderOption(saleCategories.antiques, messages.forSale)}
            {this.renderOption(saleCategories.appliances, messages.forSale)}
            {this.renderOption(saleCategories.artsCrafts, messages.forSale)}
            {this.renderOption(saleCategories.babyChild, messages.forSale)}
            {this.renderOption(saleCategories.barter, messages.forSale)}
            {this.renderOption(saleCategories.beautyHealth, messages.forSale)}
            {this.renderOption(saleCategories.bikes, messages.forSale)}
            {this.renderOption(saleCategories.boats, messages.forSale)}
            {this.renderOption(saleCategories.books, messages.forSale)}
            {this.renderOption(saleCategories.business, messages.forSale)}
            {this.renderOption(saleCategories.carsTrucks, messages.forSale)}
            {this.renderOption(saleCategories.cdDvd, messages.forSale)}
            {this.renderOption(saleCategories.farmGarden, messages.forSale)}
            {this.renderOption(saleCategories.free, messages.forSale)}
            {this.renderOption(saleCategories.furniture, messages.forSale)}
            {this.renderOption(saleCategories.garageSale, messages.forSale)}
            {this.renderOption(saleCategories.general, messages.forSale)}
            {this.renderOption(saleCategories.heavyEquip, messages.forSale)}
            {this.renderOption(saleCategories.household, messages.forSale)}
            {this.renderOption(saleCategories.jewelry, messages.forSale)}
            {this.renderOption(saleCategories.materials, messages.forSale)}
            {this.renderOption(saleCategories.motorcycles, messages.forSale)}
            {this.renderOption(saleCategories.musicalInstruments, messages.forSale)}
            {this.renderOption(saleCategories.photoVideo, messages.forSale)}
            {this.renderOption(saleCategories.rvCampers, messages.forSale)}
          </div>
        </div>
      </Popup>
    );
  }

  renderServicesSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(messages.services);

    return (
      <Popup
        trigger={this.menuTitle(messages.services)}
        hoverable
        basic
        on="click"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup services"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            {this.renderOption(servicesCategories.automotive, messages.services)}
            {this.renderOption(servicesCategories.beautyPersonal, messages.services)}
            {this.renderOption(servicesCategories.computerIT, messages.services)}
            {this.renderOption(servicesCategories.creative, messages.services)}
            {this.renderOption(servicesCategories.dental, messages.services)}
            {this.renderOption(servicesCategories.eventMgmt, messages.services)}
            {this.renderOption(servicesCategories.farmGarden, messages.services)}
            {this.renderOption(servicesCategories.financial, messages.services)}
            {this.renderOption(servicesCategories.healthCare, messages.services)}
            {this.renderOption(servicesCategories.laborConstruction, messages.services)}
            {this.renderOption(servicesCategories.legal, messages.services)}
            {this.renderOption(servicesCategories.lessonsCoaching, messages.services)}
            {this.renderOption(servicesCategories.marine, messages.services)}
            {this.renderOption(servicesCategories.realState, messages.services)}
            {this.renderOption(servicesCategories.skilledTrades, messages.services)}
            {this.renderOption(servicesCategories.smallBusiness, messages.services)}
            {this.renderOption(servicesCategories.therapeutic, messages.services)}
            {this.renderOption(servicesCategories.travelVacation, messages.services)}
            {this.renderOption(servicesCategories.writingEditing, messages.services)}
          </div>
        </div>
      </Popup>
    );
  }

  renderJobsSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(messages.jobs);

    return (
      <Popup
        trigger={this.menuTitle(messages.jobs)}
        hoverable
        basic
        on="click"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup jobs"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            {this.renderOption(jobsCategories.accounting, messages.jobs)}
            {this.renderOption(jobsCategories.adminOffice, messages.jobs)}
            {this.renderOption(jobsCategories.architect, messages.jobs)}
            {this.renderOption(jobsCategories.artMediaDesign, messages.jobs)}
            {this.renderOption(jobsCategories.aerospace, messages.jobs)}
            {this.renderOption(jobsCategories.businessManagement, messages.jobs)}
            {this.renderOption(jobsCategories.customerService, messages.jobs)}
            {this.renderOption(jobsCategories.education, messages.jobs)}
            {this.renderOption(jobsCategories.foodBev, messages.jobs)}
            {this.renderOption(jobsCategories.generalLabor, messages.jobs)}
            {this.renderOption(jobsCategories.government, messages.jobs)}
            {this.renderOption(jobsCategories.humanResources, messages.jobs)}
            {this.renderOption(jobsCategories.itSoftware, messages.jobs)}
            {this.renderOption(jobsCategories.legalParalegal, messages.jobs)}
            {this.renderOption(jobsCategories.manufacturing, messages.jobs)}
            {this.renderOption(jobsCategories.salesMarketing, messages.jobs)}
          </div>
        </div>
      </Popup>
    );
  }

  renderCryptoSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(messages.cryptoBazaar);

    return (
      <Popup
        trigger={this.menuTitle(messages.cryptoBazaar)}
        hoverable
        basic
        on="click"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup crypto"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            {this.renderOption(cryptoCategories.localOmniCoin, messages.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localBitCoin, messages.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localEutherium, messages.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localMonero, messages.cryptoBazaar)}
            {this.renderOption(cryptoCategories.localOther, messages.cryptoBazaar)}
            {this.renderOption(cryptoCategories.omniCoinBitCoin, messages.cryptoBazaar)}
            {this.renderOption(cryptoCategories.omniCoinOther, messages.cryptoBazaar)}
          </div>
        </div>
      </Popup>
    );
  }

  renderMoreSubMenu() {
    const { formatMessage } = this.props.intl;

    return (
      <Popup
        trigger={this.menuTitle(messages.more)}
        hoverable
        basic
        on="click"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup"
      >
        <div className="menu-wrapper more">
          <div className="submenu">
            <p className="title">{formatMessage(messages.community)}</p>
            <div className="sub-categories">
              {this.renderOption(communityCategories.activities, messages.more)}
              {this.renderOption(communityCategories.arts, messages.more)}
              {this.renderOption(communityCategories.childCare, messages.more)}
              {this.renderOption(communityCategories.classes, messages.more)}
              {this.renderOption(communityCategories.events, messages.more)}
              {this.renderOption(communityCategories.general, messages.more)}
              {this.renderOption(communityCategories.groups, messages.more)}
              {this.renderOption(communityCategories.localNews, messages.more)}
              {this.renderOption(communityCategories.lostFound, messages.more)}
              {this.renderOption(communityCategories.music, messages.more)}
              {this.renderOption(communityCategories.pets, messages.more)}
              {this.renderOption(communityCategories.politics, messages.more)}
              {this.renderOption(communityCategories.ridesharing, messages.more)}
              {this.renderOption(communityCategories.volunteers, messages.more)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.housing)}</p>
            <div className="sub-categories">
              {this.renderOption(housingCategories.aptsHousing, messages.more)}
              {this.renderOption(housingCategories.housingSwap, messages.more)}
              {this.renderOption(housingCategories.housingWanted, messages.more)}
              {this.renderOption(housingCategories.officeCommercial, messages.more)}
              {this.renderOption(housingCategories.realEstateSale, messages.more)}
              {this.renderOption(housingCategories.roomsToShare, messages.more)}
              {this.renderOption(housingCategories.roomWanted, messages.more)}
              {this.renderOption(housingCategories.subletsTemporary, messages.more)}
              {this.renderOption(housingCategories.vacation, messages.more)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.gigs)}</p>
            <div className="sub-categories">
              {this.renderOption(gigsCategories.babySitting, messages.more)}
              {this.renderOption(gigsCategories.cleaning, messages.more)}
              {this.renderOption(gigsCategories.crew, messages.more)}
              {this.renderOption(gigsCategories.delivery, messages.more)}
              {this.renderOption(gigsCategories.escort, messages.more)}
              {this.renderOption(gigsCategories.houseSitting, messages.more)}
              {this.renderOption(gigsCategories.handyman, messages.more)}
              {this.renderOption(gigsCategories.massage, messages.more)}
              {this.renderOption(gigsCategories.movingHauling, messages.more)}
              {this.renderOption(gigsCategories.petCare, messages.more)}
              {this.renderOption(gigsCategories.techSupport, messages.more)}
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
        trigger={this.menuTitle(messages.about)}
        hoverable
        basic
        on="click"
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
              {this.renderOption(quickLinksCategories.home, messages.about)}
              {this.renderOption(quickLinksCategories.features, messages.about)}
              {this.renderOption(quickLinksCategories.theTeam, messages.about)}
              {this.renderOption(quickLinksCategories.roadmap, messages.about)}
              {this.renderOption(quickLinksCategories.downloads, messages.about)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.support)}</p>
            <div className="sub-categories">
              {this.renderOption(supportCategories.tutorialVideos, messages.about)}
              {this.renderOption(supportCategories.community, messages.about)}
              {this.renderOption(supportCategories.slack, messages.about)}
              {this.renderOption(supportCategories.blog, messages.about)}
              {this.renderOption(supportCategories.contact, messages.about)}
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.usefulLinks)}</p>
            <div className="sub-categories">
              {this.renderOption(usefulLinksCategories.privacyPolicy, messages.about)}
              {this.renderOption(usefulLinksCategories.termsOfUse, messages.about)}
              {this.renderOption(usefulLinksCategories.webWallet, messages.about)}
              {this.renderOption(usefulLinksCategories.ominCoinExplorer, messages.about)}
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
        on="click"
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
      active: !props.marketplace.parentCategory
    });

    return (
      <div className="menu">
        <ul>
          <li className={optionMenuClass}>
            <span
              onClick={() => this.viewCategory(messages.home.id)}
              onKeyDown={() => this.viewCategory(messages.home.id)}
              tabIndex={0}
              role="link"
            >
              {formatMessage(messages.home)}
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
