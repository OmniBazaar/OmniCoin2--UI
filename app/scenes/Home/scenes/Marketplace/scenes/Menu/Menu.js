import React, { Component } from 'react';
import { Button, Image, Popup, Form, Dropdown, Icon, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import hash from 'object-hash';

import Checkbox from '../../../../../../components/Checkbox/Checkbox';

import AddIcon from '../../images/btn-add-listing.svg';
import SearchIcon from '../../images/btn-search-norm.svg';
import UserIcon from '../../images/btn-user-menu-norm.svg';
import OmniLogo from '../../images/omni-logo-about.svg';

import {
  setActiveCategory,
  setExtendedSearch,
  getRecentSearches
} from '../../../../../../services/marketplace/marketplaceActions';

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

const recentSearchesList = [
  {
    id: 1,
    date: '2018-04-19',
    search: 'car',
    filters: ['USA', 'Lowest price', 'Newest'],
  },
  {
    id: 2,
    date: '2018-04-19',
    search: 'motorcycles',
    filters: ['USA', 'Lowest price', 'Newest'],
  },
  {
    id: 3,
    date: '2018-04-20',
    search: 'cars',
    filters: ['USA', 'Lowest price'],
  },
  {
    id: 4,
    date: '2018-04-20',
    search: 'jewelry',
    filters: [],
  },
];

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
  },
  extendedSearch: {
    id: 'Menu.extendedSearch',
    defaultMessage: 'Extended Search'
  },
  viewAll: {
    id: 'Menu.viewAll',
    defaultMessage: 'VIEW ALL'
  },
  default: {
    id: 'Menu.default',
    defaultMessage: 'Default'
  },
});

const options = [
  { key: 1, text: 'All Categories', value: 'all' },
  { key: 2, text: 'Category 1', value: 'category1' },
  { key: 3, text: 'Category 2', value: 'category2' },
  { key: 4, text: 'Category 3', value: 'category3' },
];

class Menu extends Component {
  static getValue(category) {
    const arr = category.split('.');
    let categoryName = category;
    if (arr.length > 1) {
      categoryName = arr[1];
    }

    return categoryName;
  }

  componentDidMount() {
    this.props.marketplaceActions.getRecentSearches(recentSearchesList);
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

  renderOption(category, parentCategory) {
    const { formatMessage } = this.props.intl;
    const type = category.id;
    const parent = parentCategory ? parentCategory.id : null;

    return (
      <NavLink to="/marketplace">
        <span
          onClick={() => this.viewCategory(type, parent)}
          onKeyDown={() => this.viewCategory(type, parent)}
          tabIndex={0}
          role="link"
        >
          {formatMessage(category)}
        </span>
      </NavLink>
    );
  }

  viewCategory = (categoryId, parent) => {
    if (this.props.marketplaceActions.setActiveCategory) {
      const category = categoryId !== mainCategories.home.id ?
        Menu.getValue(categoryId) : categoryId;
      const parentValue = parent ? Menu.getValue(parent) : null;

      this.props.marketplaceActions.setActiveCategory(category, parentValue);
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
        <div className="link-menu">
          <NavLink to="/listings">{formatMessage(userMenu.myListings)}</NavLink>
        </div>
        <div className="link-menu">{formatMessage(userMenu.myPurchases)}</div>
        <div className="link-menu">{formatMessage(userMenu.favoriteListings)}</div>
        <div className="link-menu">
          <NavLink to="/listings-defaults">{formatMessage(userMenu.newListingDefaults)}</NavLink>
        </div>
        <div className="link-menu">{formatMessage(userMenu.resyncWithServer)}</div>
      </Popup>
    );
  }

  renderSelectField = ({
    input, placeholder, dropdownPlaceholder
  }) => (
    <div className="hybrid-input">
      <input
        {...input}
        type="text"
        className="textfield"
        placeholder={placeholder}
      />
      <div className="search-actions">
        <Dropdown
          labeled
          defaultValue="all"
          options={options}
          placeholder={dropdownPlaceholder}
          selection
          className="icon button--gray-text select-btn"
        />
        <NavLink to="/search-results">
          <Button
            content={<Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />}
            className="button--primary search-btn"
          />
        </NavLink>
      </div>
    </div>
  );

  toggleExtendedSearch = () => this.props.marketplaceActions.setExtendedSearch();

  renderFilters(filters) {
    const { formatMessage } = this.props.intl;

    if (filters.length === 0) {
      return (
        <span>{formatMessage(messages.default)}</span>
      );
    }

    return (
      filters.map((filter, index) => {
        const comma = filters.length - 1 !== index ? ', ' : '';
        return (
          <span key={hash(filter)}>{`${filter}${comma}`}</span>
        );
      })
    );
  }

  recentSearches() {
    const { recentSearches } = this.props.marketplace;
    return (
      recentSearches.slice(0, maxSearches).map((search) => (
        <Grid.Row key={hash(search)}>
          <Grid.Column width={8}>
            <span className="blue-text">{search.search}</span>
          </Grid.Column>
          <Grid.Column width={8}>
            <span className="gray-text">{this.renderFilters(search.filters)}</span>
          </Grid.Column>
        </Grid.Row>
      ))
    );
  }

  renderSearchMenu() {
    const { formatMessage } = this.props.intl;

    return (
      <Popup
        trigger={<Image src={SearchIcon} width={iconSizeBig} height={iconSizeBig} />}
        hoverable
        basic
        on="click"
        position="bottom center"
        wide="very"
        hideOnScroll
        className="search-menu"
      >
        <Form className="search-form">
          <Field
            type="text"
            name="search"
            placeholder="Search"
            dropdownPlaceholder="Categories"
            component={this.renderSelectField}
            className="textfield"
          />
        </Form>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <span className="gray-text">{formatMessage(messages.recent)}</span>
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="check-wrapper">
                <Checkbox
                  width={iconSizeMedium}
                  height={iconSizeMedium}
                  onChecked={this.toggleExtendedSearch}
                />
                <div className="description-text">
                  {formatMessage(messages.extendedSearch)}
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          {this.recentSearches()}
          <Grid.Row>
            <Grid.Column width={12} />
            <Grid.Column width={4} className="right">
              <Button content={formatMessage(messages.viewAll)} className="button--blue-text view-all" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
            <NavLink to="/marketplace">
              <span
                onClick={() => this.viewCategory(mainCategories.home.id)}
                onKeyDown={() => this.viewCategory(mainCategories.home.id)}
                tabIndex={0}
                role="link"
              >
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
          {this.renderSearchMenu()}
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
  marketplaceActions: PropTypes.shape({
    setActiveCategory: PropTypes.func,
    setExtendedSearch: PropTypes.func,
    getRecentSearches: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

Menu.defaultProps = {
  intl: {},
  marketplace: {},
  marketplaceActions: {},
};

export default compose(
  connect(
    state => ({ ...state.default }),
    (dispatch) => ({
      marketplaceActions: bindActionCreators({
        setActiveCategory,
        setExtendedSearch,
        getRecentSearches
      }, dispatch),
    }),
  ),
  reduxForm({
    form: 'searchForm',
    destroyOnUnmount: true,
  }),
)(injectIntl(Menu));
