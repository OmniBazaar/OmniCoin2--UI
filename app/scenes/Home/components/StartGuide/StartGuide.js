import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { showSettingsModal } from '../../../../services/menu/menuActions';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './start-guide.scss';

const messages = defineMessages({
  quickStart: {
    id: 'StartGuide.quickStart',
    defaultMessage: 'Quick-start Guide! (Please read...)'
  },
  welcome: {
    id: 'StartGuide.welcome',
    defaultMessage: 'Welcome to OmniBazaar!'
  },
  welcomeBonus: {
    id: 'StartGuide.welcomeBonus',
    defaultMessage: 'About the "Welcome Bonus"'
  },
  welcomeBonusText1: {
    id: 'StartGuide.welcomeBonusText1',
    defaultMessage: 'The first time you launch OmniBazaar on this device, you will receive a Welcome Bonus. This Welcome Bonus is our way of saying "thank you" for installing and usingOmniBazaar. '
  },
  welcomeBonusText2: {
    id: 'StartGuide.welcomeBonusText2',
    defaultMessage: ' What we ask in return is that you take some time to explore OmniBazaar, that you create at least one listing in the marketplace for some item or service that you are willing to sell or provide, and that you tell at least one other person about OmniBazaar. '
  },
  welcomeBonusText3: {
    id: 'StartGuide.welcomeBonusText3',
    defaultMessage: ' The listing you create could be for promoting your brick-and-mortar business, selling a used bicycle, finding a roommate, or offering some service you provide. We are using the "honor system" and asking for your cooperation. Please do your part to help us get the marketplace started by creating one or more listings.'
  },
  note: {
    id: 'StartGuide.note',
    defaultMessage: 'Note: You will only receive free registration and the Welcome Bonus from OmniBazaar, once on this computer.'
  },
  launch: {
    id: 'StartGuide.launch',
    defaultMessage: 'If this is the first time you have reached this screen, the OmniBazaar marketplace is currently being launched, configured and populated in the background. This process will take a few minutes ~ about the same amount of time it will take you to read this orientation page.'
  },
  getMoreOC: {
    id: 'StartGuide.getMoreOC',
    defaultMessage: 'Get More OmniCoins Through Referral Bonuses'
  },
  getMoreOCText1: {
    id: 'StartGuide.getMoreOCText',
    defaultMessage: 'When you refer some of your friends to OmniBazaar, they will receive a Welcome Bonus for joining and you will receive a Referral Bonus for referring them. Register as a Referrer on the '
  },
  getMoreOCText2: {
    id: 'StartGuide.getMoreOCText2',
    defaultMessage: ' User Settings tab '
  },
  getMoreOCText3: {
    id: 'StartGuide.getMoreOCText3',
    defaultMessage: ' of your account page. You will receive a customized URL, identifying you as the referrer, that your friends can use to download and install OmniBazaar.'
  },
  earnAdditional: {
    id: 'StartGuide.earnAdditional',
    defaultMessage: 'Earn Additional OmniCoins by Providing Marketplace Services'
  },
  willPayYou: {
    id: 'StartGuide.willPayYou',
    defaultMessage: 'OmniBazaar will pay you to provide the following services in the marketplace:'
  },
  willPayYouText1: {
    id: 'StartGuide.willPayYouText1',
    defaultMessage: 'You can earn OmniCoins and bitcoins by referring new users to the marketplace.'
  },
  willPayYouText2: {
    id: 'StartGuide.willPayYouText2',
    defaultMessage: 'You can earn OmniCoins by publishing listings for others on your computer.'
  },
  willPayYouText3: {
    id: 'StartGuide.willPayYouText3',
    defaultMessage: 'You can earn OmniCoins by acting as an escrow agent and arbitrator for other users.'
  },
  willPayYouText4: {
    id: 'StartGuide.willPayYouText4',
    defaultMessage: 'You can earn OmniCoins by processing transactions between buyers and sellers.'
  },
  distributingBillions: {
    id: 'StartGuide.distributingBillions',
    defaultMessage: 'We are distributing billions of coins to the people who join, refer their friends, and do transactions in the marketplace. Instead of selling OmniCoins in an \'Initial Coin Offering\' (ICO), we are using them as rewards to help us acquire more users.'
  },
  goToUserSettings1: {
    id: 'StartGuide.goToUserSettings1',
    defaultMessage: 'Go to the '
  },
  goToUserSettings2: {
    id: 'StartGuide.goToUserSettings2',
    defaultMessage: ' User Settings tab '
  },
  goToUserSettings3: {
    id: 'StartGuide.goToUserSettings3',
    defaultMessage: ' on your Account page to select the services you are willing and able to provide.'
  },
  earnBySelling: {
    id: 'StartGuide.earnBySelling',
    defaultMessage: 'Earn OmniCoins and Bitcoins by Selling in the Marketplace'
  },
  earnBySellingDesc: {
    id: 'StartGuide.earnBySellingDesc',
    defaultMessage: 'Of course, you can also earn OmniCoins (and bitcoins) by selling goods or services in the marketplace. Purchasers will pay you in one of these cryptocurrencies, and you will have more coins to spend. You can also trade your local currency for bitcoins or OmniCoins -- either by private transactions through the OmniBazaar marketplace, or through a cryptocurrency exchange business on the Internet. Exchanges that list OmniCoins include [coming soon].'
  },
  goShopping: {
    id: 'StartGuide.goShopping',
    defaultMessage: 'Go Shopping in the OmniBazaar Marketplace'
  },
  toUseOmniBazaar: {
    id: 'StartGuide.toUseOmniBazaar',
    defaultMessage: 'To use OmniBazaar, simply publish in the marketplace a listing of the product or service you would like to sell. Or, search for the product or service you would like to buy. If you have ever used CraigsList, you will find OmniBazaar easy to use.'
  },
  toUseOmniBazaar2: {
    id: 'StartGuide.toUseOmniBazaar2',
    defaultMessage: 'The marketplace matches buyers with sellers at a fraction of the cost of traditional e-commerce sites. Some optional marketplace services, such as escrow, may result in small fees when you buy or sell something. These fees are distributed to OmniBazaar users who provide the computer, network, escrow, and development services that make the marketplace possible. These fees are far less than the 10–15% fees charged by most e-commerce sites.'
  },
  aboutOmniCoin: {
    id: 'StartGuide.aboutOmniCoin',
    defaultMessage: 'About OmniCoin'
  },
  aboutOmniCoinText1: {
    id: 'StartGuide.aboutOmniCoinText1',
    defaultMessage: 'When you buy or sell using OmniCoins, you can use the "SecureSend" escrow service. SecureSend helps protect both buyers and sellers in long-distance transactions. OmniCoin also allows buyers and sellers to register reputation votes about each other, and helps ensure the validity of listings. OmniCoin transactions "clear" approximately 60 times faster than Bitcoin transactions, and you can send payments to a user\'s name instead of of long string of numbers and letters.'
  },
  aboutOmniCoinText2: {
    id: 'StartGuide.aboutOmniCoinText2',
    defaultMessage: 'OmniCoin is the official "currency" of the OmniBazaar marketplace. When you use OmniCoin or bitcoins to buy or sell in the marketplace, there is a one percent (1%) fee that is paid by the seller. This fee is divided among service providers in the OmniBazaar marketplace.'
  }
});

class StartGuide extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    const { showSettingsModal } = this.props.menuActions;

    return (
      <div className="quick-start">
        <h1>{formatMessage(messages.quickStart)}</h1>
        <h3>{formatMessage(messages.welcome)}</h3>
        <p>{formatMessage(messages.launch)}</p>
        <h3>{formatMessage(messages.welcomeBonus)}</h3>
        <p>
          {formatMessage(messages.welcomeBonusText1)}
          <span className="red">{formatMessage(messages.welcomeBonusText2)}</span>
          {formatMessage(messages.welcomeBonusText3)}
        </p>
        <p>{formatMessage(messages.note)}</p>

        <h3>{formatMessage(messages.getMoreOC)}</h3>
        <p>
          {formatMessage(messages.getMoreOCText1)}
          <NavLink to="/wallet" activeClassName="active" className="menu-item">
            {formatMessage(messages.getMoreOCText2)}
          </NavLink>
          {formatMessage(messages.getMoreOCText3)}
        </p>

        <h3>{formatMessage(messages.earnAdditional)}</h3>
        <p>{formatMessage(messages.willPayYou)}</p>
        <ul>
          <li>{formatMessage(messages.willPayYouText1)}</li>
          <li>{formatMessage(messages.willPayYouText2)}</li>
          <li>{formatMessage(messages.willPayYouText3)}</li>
          <li>{formatMessage(messages.willPayYouText4)}</li>
        </ul>
        <p>{formatMessage(messages.distributingBillions)}</p>
        <p>
          {formatMessage(messages.goToUserSettings1)}
          <NavLink to="/wallet" activeClassName="active" className="menu-item">
            {formatMessage(messages.goToUserSettings2)}
          </NavLink>
          {formatMessage(messages.goToUserSettings3)}
        </p>

        <h3>{formatMessage(messages.earnBySelling)}</h3>
        <p>{formatMessage(messages.earnBySellingDesc)}</p>

        <h3>{formatMessage(messages.goShopping)}</h3>
        <p>{formatMessage(messages.toUseOmniBazaar)}</p>
        <p>{formatMessage(messages.toUseOmniBazaar2)}</p>

        <h3>{formatMessage(messages.aboutOmniCoin)}</h3>
        <p>{formatMessage(messages.aboutOmniCoinText1)}</p>
        <p>{formatMessage(messages.aboutOmniCoinText2)}</p>
      </div>
    );
  }
}

StartGuide.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  menuActions: PropTypes.shape({
    showSettingsModal: PropTypes.func
  }),
};

StartGuide.defaultProps = {
  intl: {},
  menuActions: {},
};

export default connect(
  state => ({ ...state.default }),
  dispatch => ({
    menuActions: bindActionCreators({ showSettingsModal }, dispatch),
  })
)(injectIntl(StartGuide));
