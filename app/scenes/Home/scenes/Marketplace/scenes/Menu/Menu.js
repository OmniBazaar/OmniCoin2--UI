import React, { Component } from 'react';
import { Button, Image, Icon, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
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

import { CategoriesTypes } from '../../constants';

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
  static menuTitle(title) {
    return (
      <li>{title}</li>
    );
  }

  renderForSaleSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(messages.forSale);

    return (
      <Popup
        trigger={Menu.menuTitle(categoryTitle)}
        hoverable
        basic
        on="click"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="menu-popup for-sale"
      >
        <div className="menu-wrapper">
          <p className="title">{categoryTitle}</p>
          <div className="submenu">
            <span>{formatMessage(saleCategories.antiques)}</span>
            <span>{formatMessage(saleCategories.appliances)}</span>
            <span>{formatMessage(saleCategories.artsCrafts)}</span>
            <span>{formatMessage(saleCategories.babyChild)}</span>
            <span>{formatMessage(saleCategories.barter)}</span>
            <span>{formatMessage(saleCategories.beautyHealth)}</span>
            <span>{formatMessage(saleCategories.bikes)}</span>
            <span>{formatMessage(saleCategories.boats)}</span>
            <span>{formatMessage(saleCategories.books)}</span>
            <span>{formatMessage(saleCategories.business)}</span>
            <span>{formatMessage(saleCategories.carsTrucks)}</span>
            <span>{formatMessage(saleCategories.cdDvd)}</span>
            <span>{formatMessage(saleCategories.farmGarden)}</span>
            <span>{formatMessage(saleCategories.free)}</span>
            <span>{formatMessage(saleCategories.furniture)}</span>
            <span>{formatMessage(saleCategories.garageSale)}</span>
            <span>{formatMessage(saleCategories.general)}</span>
            <span>{formatMessage(saleCategories.heavyEquip)}</span>
            <span>{formatMessage(saleCategories.household)}</span>
            <span>{formatMessage(saleCategories.jewelry)}</span>
            <span>{formatMessage(saleCategories.materials)}</span>
            <span>{formatMessage(saleCategories.motorcycles)}</span>
            <span>{formatMessage(saleCategories.musicalInstruments)}</span>
            <span>{formatMessage(saleCategories.photoVideo)}</span>
            <span>{formatMessage(saleCategories.rvCampers)}</span>
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
        trigger={Menu.menuTitle(categoryTitle)}
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
            <span>{formatMessage(servicesCategories.automotive)}</span>
            <span>{formatMessage(servicesCategories.beautyPersonal)}</span>
            <span>{formatMessage(servicesCategories.computerIT)}</span>
            <span>{formatMessage(servicesCategories.creative)}</span>
            <span>{formatMessage(servicesCategories.dental)}</span>
            <span>{formatMessage(servicesCategories.eventMgmt)}</span>
            <span>{formatMessage(servicesCategories.farmGarden)}</span>
            <span>{formatMessage(servicesCategories.financial)}</span>
            <span>{formatMessage(servicesCategories.healthCare)}</span>
            <span>{formatMessage(servicesCategories.laborConstruction)}</span>
            <span>{formatMessage(servicesCategories.legal)}</span>
            <span>{formatMessage(servicesCategories.lessonsCoaching)}</span>
            <span>{formatMessage(servicesCategories.marine)}</span>
            <span>{formatMessage(servicesCategories.realState)}</span>
            <span>{formatMessage(servicesCategories.skilledTrades)}</span>
            <span>{formatMessage(servicesCategories.smallBusiness)}</span>
            <span>{formatMessage(servicesCategories.therapeutic)}</span>
            <span>{formatMessage(servicesCategories.travelVacation)}</span>
            <span>{formatMessage(servicesCategories.writingEditing)}</span>
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
        trigger={Menu.menuTitle(categoryTitle)}
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
            <span>{formatMessage(jobsCategories.accounting)}</span>
            <span>{formatMessage(jobsCategories.adminOffice)}</span>
            <span>{formatMessage(jobsCategories.architect)}</span>
            <span>{formatMessage(jobsCategories.artMediaDesign)}</span>
            <span>{formatMessage(jobsCategories.aerospace)}</span>
            <span>{formatMessage(jobsCategories.businessManagement)}</span>
            <span>{formatMessage(jobsCategories.customerService)}</span>
            <span>{formatMessage(jobsCategories.education)}</span>
            <span>{formatMessage(jobsCategories.foodBev)}</span>
            <span>{formatMessage(jobsCategories.generalLabor)}</span>
            <span>{formatMessage(jobsCategories.government)}</span>
            <span>{formatMessage(jobsCategories.humanResources)}</span>
            <span>{formatMessage(jobsCategories.itSoftware)}</span>
            <span>{formatMessage(jobsCategories.legalParalegal)}</span>
            <span>{formatMessage(jobsCategories.manufacturing)}</span>
            <span>{formatMessage(jobsCategories.salesMarketing)}</span>
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
        trigger={Menu.menuTitle(categoryTitle)}
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
            <span>{formatMessage(cryptoCategories.localOmniCoin)}</span>
            <span>{formatMessage(cryptoCategories.localBitCoin)}</span>
            <span>{formatMessage(cryptoCategories.localEutherium)}</span>
            <span>{formatMessage(cryptoCategories.localMonero)}</span>
            <span>{formatMessage(cryptoCategories.localOther)}</span>
            <span>{formatMessage(cryptoCategories.omniCoinBitCoin)}</span>
            <span>{formatMessage(cryptoCategories.omniCoinOther)}</span>
          </div>
        </div>
      </Popup>
    );
  }

  renderMoreSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(messages.more);

    return (
      <Popup
        trigger={Menu.menuTitle(categoryTitle)}
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
              <span>{formatMessage(communityCategories.activities)}</span>
              <span>{formatMessage(communityCategories.arts)}</span>
              <span>{formatMessage(communityCategories.childCare)}</span>
              <span>{formatMessage(communityCategories.classes)}</span>
              <span>{formatMessage(communityCategories.events)}</span>
              <span>{formatMessage(saleCategories.general)}</span>
              <span>{formatMessage(communityCategories.groups)}</span>
              <span>{formatMessage(communityCategories.localNews)}</span>
              <span>{formatMessage(communityCategories.lostFound)}</span>
              <span>{formatMessage(communityCategories.music)}</span>
              <span>{formatMessage(communityCategories.pets)}</span>
              <span>{formatMessage(communityCategories.politics)}</span>
              <span>{formatMessage(communityCategories.ridesharing)}</span>
              <span>{formatMessage(communityCategories.volunteers)}</span>
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.housing)}</p>
            <div className="sub-categories">
              <span>{formatMessage(housingCategories.aptsHousing)}</span>
              <span>{formatMessage(housingCategories.housingSwap)}</span>
              <span>{formatMessage(housingCategories.housingWanted)}</span>
              <span>{formatMessage(housingCategories.officeCommercial)}</span>
              <span>{formatMessage(housingCategories.realEstateSale)}</span>
              <span>{formatMessage(housingCategories.roomsToShare)}</span>
              <span>{formatMessage(housingCategories.roomWanted)}</span>
              <span>{formatMessage(housingCategories.subletsTemporary)}</span>
              <span>{formatMessage(housingCategories.vacation)}</span>
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.gigs)}</p>
            <div className="sub-categories">
              <span>{formatMessage(gigsCategories.babySitting)}</span>
              <span>{formatMessage(gigsCategories.cleaning)}</span>
              <span>{formatMessage(gigsCategories.crew)}</span>
              <span>{formatMessage(gigsCategories.delivery)}</span>
              <span>{formatMessage(gigsCategories.escort)}</span>
              <span>{formatMessage(gigsCategories.houseSitting)}</span>
              <span>{formatMessage(gigsCategories.handyman)}</span>
              <span>{formatMessage(gigsCategories.massage)}</span>
              <span>{formatMessage(gigsCategories.movingHauling)}</span>
              <span>{formatMessage(gigsCategories.petCare)}</span>
              <span>{formatMessage(gigsCategories.techSupport)}</span>
            </div>
          </div>
        </div>
      </Popup>
    );
  }

  renderAboutSubMenu() {
    const { formatMessage } = this.props.intl;
    const categoryTitle = formatMessage(messages.about);

    return (
      <Popup
        trigger={Menu.menuTitle(categoryTitle)}
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
              <span>{formatMessage(quickLinksCategories.home)}</span>
              <span>{formatMessage(quickLinksCategories.features)}</span>
              <span>{formatMessage(quickLinksCategories.theTeam)}</span>
              <span>{formatMessage(quickLinksCategories.roadmap)}</span>
              <span>{formatMessage(quickLinksCategories.downloads)}</span>
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.support)}</p>
            <div className="sub-categories">
              <span>{formatMessage(supportCategories.tutorialVideos)}</span>
              <span>{formatMessage(supportCategories.community)}</span>
              <span>{formatMessage(supportCategories.slack)}</span>
              <span>{formatMessage(supportCategories.blog)}</span>
              <span>{formatMessage(supportCategories.contact)}</span>
            </div>
          </div>
          <div className="submenu">
            <p className="title">{formatMessage(messages.usefulLinks)}</p>
            <div className="sub-categories">
              <span>{formatMessage(usefulLinksCategories.privacyPolicy)}</span>
              <span>{formatMessage(usefulLinksCategories.termsOfUse)}</span>
              <span>{formatMessage(usefulLinksCategories.webWallet)}</span>
              <span>{formatMessage(usefulLinksCategories.ominCoinExplorer)}</span>
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
    const { formatMessage } = this.props.intl;

    return (
      <div className="menu">
        <ul>
          <li className="active">{formatMessage(messages.home)}</li>
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Menu.defaultProps = {
  intl: {},
};

export default connect(state => ({ ...state.default }))(injectIntl(Menu));
