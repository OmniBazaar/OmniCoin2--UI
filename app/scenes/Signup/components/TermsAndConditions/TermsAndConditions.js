import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import './terms.scss';

const messages = defineMessages({
  termsIntro: {
    id: 'TermsConditions.termsIntro',
    defaultMessage: 'This end user agreement (the "Agreement") should be read by you (the "User" or "you") in its entirety prior to your use of any OmniBazaar™ or OmniCoin™-derived service or products. Please note that the Agreement constitutes a legally binding agreement between you and OmniBazaar Inc. (referred to herein as "OmniBazaar", "us" or "we"), which publishes software to support the Internet distributed marketplace described at OmniBazaar.info and experimental product described at OmniCoin.info (the "Services"). By clicking the "I Agree" button if and where provided and/or using the Services, you consent to the terms and conditions set forth in this Agreement.'
  },
  grantOfLicense: {
    id: 'TermsConditions.grantOfLicense',
    defaultMessage: '1. GRANT OF LICENSE'
  },
  grantOfLicense1: {
    id: 'TermsConditions.grantOfLicense1',
    defaultMessage: '1.1. Subject to the terms and conditions contained herein, OmniBazaar Inc. grants the User a non-exclusive, personal, non-transferable right to use the experimental marketplace, software products and educational information provided by these Services on your personal computer or other device that accesses the Internet in order to access the experimental marketplace and software products available and described on the OmniBazaar.info and OmniCoin.info websites (the websites, experimental marketplace and educational information together being the "Services"). By using this Service you are agreeing to join and participate in an economic experiment that may or may not prove useful, viable, or successful. This software is not guaranteed to be free from flaws or suitable for commercial use.'
  },
  grantOfLicense2: {
    id: 'TermsConditions.grantOfLicense2',
    defaultMessage: '1.2. the Services are not for use by (i) individuals under 18 years of age, (ii) individuals under the legal age of majority in their jurisdiction and (iii) individuals accessing the Services from jurisdictions from which it is illegal to do so. OmniBazaar Inc. is not able to verify the legality of the Services in each jurisdiction and it is the User\'s responsibility to ensure that their use of the Services are lawful.'
  },
  grantOfLicense3: {
    id: 'TermsConditions.grantOfLicense3',
    defaultMessage: '1.3. OmniCoin™ software provided by the Services are derived from the open source BitShares Toolkit and, like the BitShares code, are released under "The Unlicense" license. (For more information, please refer to'
  },
  grantOfLicense4: {
    id: 'TermsConditions.grantOfLicense4',
    defaultMessage: '1.4. The terms "OmniBazaar", "CryptoBazaar", "OmniCoin", "OmniBazaar Inc.", its associated domain names and any other trade marks, or service marks used by OmniBazaar Inc. as part of the Services (the "Trade Marks"), are solely owned by OmniBazaar Inc.. In addition, all content on the website, including, but not limited to, the images, pictures, graphics, photographs, animations, videos, music, audio and text (the "Site Content") belongs to OmniBazaar Inc. and is protected by copyright and/or other intellectual property or other rights. You hereby acknowledge that by using the Services, you obtain no rights in the Site Content and/or the Trade Marks, or any part thereof. Under no circumstances may you use the Site Content and/or the Trade Marks without prior written consent of OmniBazaar Inc. Additionally, you agree not to do anything that will harm or potentially harm the rights, including the intellectual property rights of OmniBazaar Inc.'
  },
  noWarranties: {
    id: 'TermsConditions.noWarranties',
    defaultMessage: '2. NO WARRANTIES.'
  },
  noWarranties1: {
    id: 'TermsConditions.noWarranties1',
    defaultMessage: '2.1. OMNIBAZAAR™, OMNICOIN™, ITS COMMUNITY OF INDEPENDENT DEVELOPERS AND OMNIBAZAAR INC. DISCLAIM ANY AND ALL WARRANTIES, EXPRESSED OR IMPLIED, IN CONNECTION WITH THE SERVICES WHICH IS PROVIDED TO YOU "AS IS" AND WE PROVIDE YOU WITH NO WARRANTY OR REPRESENTATION WHATSOEVER REGARDING ITS QUALITY, FITNESS FOR PURPOSE, COMPLETENESS OR ACCURACY.'
  },
  noWarranties2: {
    id: 'TermsConditions.noWarranties2',
    defaultMessage: '2.2. REGARDLESS OF OUR EFFORTS, WE MAKE NO WARRANTY THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.'
  },
  noWarranties3: {
    id: 'TermsConditions.noWarranties3',
    defaultMessage: '2.3. OMNIBAZAAR CERTIFIES ONLY THAT THE SOFTWARE BINARIES PROVIDED AS PART OF THE SERVICES HAVE BEEN COMPILED FROM THE SOURCE CODE LIBRARIES REFERENCED ON OMNIBAZAAR.INFO AND OMNICOIN.INFO, AND WILL PERFORM AS SPECIFIED IN THAT CODE. THE USER IS RESPONSIBLE FOR VERIFYING THAT CODE, WITH EXPERT PROFESSIONAL HELP IF NECESSARY, AND ACCEPTS THE RESULTS PRODUCED BY THAT CODE.'
  },
  authority: {
    id: 'TermsConditions.authority',
    defaultMessage: '3. AUTHORITY/TERMS OF SERVICE'
  },
  authority1: {
    id: 'TermsConditions.authority1',
    defaultMessage: 'You agree to the rules described on the OmniBazaar.info website. OmniBazaar Inc. retains authority over the issuing, maintenance, and closing of the Services. The decision of OmniBazaar Inc.\'s management, as regards any use of the Services, or dispute resolution, is final and shall not be open to review or appeal.'
  },
  yourRepresentations: {
    id: 'TermsConditions.yourRepresentations',
    defaultMessage: '4. YOUR REPRESENTATIONS AND WARRANTIES'
  },
  yourRepresentationsIntro: {
    id: 'TermsConditions.yourRepresentationsIntro',
    defaultMessage: 'Prior to your use of the Services and on an ongoing basis you represent, warrant, covenant and agree that:'
  },
  yourRepresentations1: {
    id: 'TermsConditions.yourRepresentations1',
    defaultMessage: '4.1. there is a risk of losing digital tokens when using the distributed marketplace and the software products provided by this Service, and that neither OmniBazaar™, OmniCoin™, its community of independent developers, nor OmniBazaar Inc. have any responsibility to you for any such loss;'
  },
  yourRepresentations2: {
    id: 'TermsConditions.yourRepresentations2',
    defaultMessage: '4.2. your use of the Services is at your sole option, discretion and risk;'
  },
  yourRepresentations3: {
    id: 'TermsConditions.yourRepresentations3',
    defaultMessage: '4.3. you are solely responsible for any applicable taxes which may be payable on income from sales of products and services in the distributed marketplace, and any taxes on digital tokens obtained by you through your use of the Services;'
  },
  yourRepresentations4: {
    id: 'TermsConditions.yourRepresentations4',
    defaultMessage: '4.4. you have read, and will abide by, the restrictions on use of the distributed marketplace for advertisement, purchase and sale of prohibited products and services, and that you alone are responsible for determining the legality in your jurisdiction of any products or services you advertise, buy or sell;'
  },
  yourRepresentations5: {
    id: 'TermsConditions.yourRepresentations5',
    defaultMessage: '4.5. the telecommunications networks and Internet access services required for you to access and use the Services and its products are entirely beyond the control of OmniBazaar Inc. and OmniBazaar Inc. shall have no liability whatsoever for any outages, slowness, capacity constraints or other deficiencies affecting the same; and'
  },
  yourRepresentations6: {
    id: 'TermsConditions.yourRepresentations6',
    defaultMessage: '4.6. you are aged 18 or over.'
  },
  prohibitedUses: {
    id: 'TermsConditions.prohibitedUses',
    defaultMessage: '5. PROHIBITED USES'
  },
  prohibitedUses1: {
    id: 'TermsConditions.prohibitedUses1',
    defaultMessage: '5.1. PERSONAL USE. The Services are intended solely for the User\'s personal use. The User is only allowed to experiment with the distributed marketplace, software products, and tokens for his/her personal edification or entertainment. To the extent that the Services are used by businesses or individuals for business or commercial purposes, such use is at the sole risk and liability of the user.'
  },
  prohibitedUses2: {
    id: 'TermsConditions.prohibitedUses2',
    defaultMessage: '5.2. GENERATED EXPERIMENTAL TOKENS. Any digital tokens (XOM) generated for personal use by the User while using the software products provided by these Services are for promotional purposes only, have zero par value, and are not generated in exchange for any consideration whatsoever provided by the user to OmniBazaar Inc., OmniBazaar™, OmniCoin™ or its independent community of developers. The digital tokens do not represent or evidence any ownership interest in the OmniBazaar™ distributed marketplace, OmniCoin™, the Services, or OmniBazaar Inc. The existence of these tokens does not infer an obligation or liability on any party.'
  },
  prohibitedUses3: {
    id: 'TermsConditions.prohibitedUses3',
    defaultMessage: '5.3 JURISDICTIONS. Persons located in or residents of any "Prohibited Jurisdictions" are not permitted make use of the Services. For the avoidance of doubt, the foregoing restrictions on engaging in experimentation from Prohibited Jurisdictions applies equally to residents and citizens of other nations while located in a Prohibited Jurisdiction. Any attempt to circumvent the restrictions on use by any persons located in a Prohibited Jurisdiction or Restricted Jurisdiction, is a breach of this Agreement. An attempt at circumvention includes, but is not limited to, manipulating any information used by OmniBazaar Inc. to identify your location and providing OmniBazaar Inc. with false or misleading information regarding your location or place of residence.'
  },
  breach: {
    id: 'TermsConditions.breach',
    defaultMessage: '6. BREACH'
  },
  breach1: {
    id: 'TermsConditions.breach1',
    defaultMessage: '6.1. Without prejudice to any other rights, if a User breaches in whole or in part any provision contained herein, OmniBazaar Inc. reserves the right to take such action as it sees fit, including terminating this Agreement or any other agreement in place with the User and/or taking legal action against such User.'
  },
  breach2: {
    id: 'TermsConditions.breach2',
    defaultMessage: '6.2. You agree to fully indemnify, defend and hold harmless OmniBazaar™, OmniCoin™, its community of independent developers, OmniBazaar Inc. and their shareholders, directors, agents and employees from and against all claims, demands, liabilities, damages, losses, costs and expenses, including legal fees and any other charges whatsoever, howsoever caused, that may arise as a result of: (i) your breach of this Agreement, in whole or in part; (ii) violation by you of any law or any third party rights; and (iii) use by you of the Service.'
  },
  limitationOfLiability: {
    id: 'TermsConditions.limitationOfLiability',
    defaultMessage: '7. LIMITATION OF LIABILITY.'
  },
  limitationOfLiability1: {
    id: 'TermsConditions.limitationOfLiability1',
    defaultMessage: '7.1. Under no circumstances, including negligence, shall OmniBazaar™, OmniCoin™, its community of independent developers, or OmniBazaar Inc. be liable for any special, incidental, direct, indirect or consequential damages whatsoever (including, without limitation, damages for loss of business profits, business interruption, loss of business information, or any other pecuniary loss) arising out of the use (or misuse) of the Service even if any had prior knowledge of the possibility of such damages.'
  },
  limitationOfLiability2: {
    id: 'TermsConditions.limitationOfLiability2',
    defaultMessage: '7.2. Nothing in this Agreement shall exclude or limit OmniBazaar Inc.\'s liability for death or personal injury resulting from its negligence.'
  },
  disputes: {
    id: 'TermsConditions.disputes',
    defaultMessage: '8. DISPUTES'
  },
  disputes1: {
    id: 'TermsConditions.disputes1',
    defaultMessage: 'If a User wishes to make a complaint, please express it at OmniBazaar.com. Should any dispute not be resolved to your satisfaction you may pursue remedies in the governing law jurisdiction set forth below.'
  },
  amendment: {
    id: 'TermsConditions.amendment',
    defaultMessage: '9. AMENDMENT'
  },
  amendment1: {
    id: 'TermsConditions.amendment1',
    defaultMessage: 'OmniBazaar Inc. reserves the right to update or modify this Agreement or any part thereof at any time or otherwise change the Services without notice and you will be bound by such amended Agreement upon posting. Therefore, we encourage you check the terms and conditions contained in the version of the Agreement in force at such time. Your continued use of the Services shall be deemed to attest to your agreement to any amendments to the Agreement.'
  },
  governingLaw: {
    id: 'TermsConditions.governingLaw',
    defaultMessage: '10. GOVERNING LAW'
  },
  governingLaw1: {
    id: 'TermsConditions.governingLaw1',
    defaultMessage: 'The Agreement and any matters relating hereto shall be governed by, and construed in accordance with, the laws of the state of Florida in the United States. You irrevocably agree that, subject as provided below, the courts of Florida shall have exclusive jurisdiction in relation to any claim, dispute or difference concerning the Agreement and any matter arising therefrom and irrevocably waive any right that it may have to object to an action being brought in those courts, or to claim that the action has been brought in an inconvenient forum, or that those courts do not have jurisdiction. Nothing in this clause shall limit the right of OmniBazaar Inc. to take proceedings against you in any other court of competent jurisdiction, nor shall the taking of proceedings in any one or more jurisdictions preclude the taking of proceedings in any other jurisdictions, whether concurrently or not, to the extent permitted by the law of such other jurisdiction.'
  },
  severability: {
    id: 'TermsConditions.severability',
    defaultMessage: '11. SEVERABILITY'
  },
  severability1: {
    id: 'TermsConditions.severability1',
    defaultMessage: 'If a provision of this Agreement is or becomes illegal, invalid or unenforceable in any jurisdiction, that shall not affect the validity or enforceability in that jurisdiction of any other provision hereof or the validity or enforceability in other jurisdictions of that or any other provision hereof.'
  },
  assignment: {
    id: 'TermsConditions.assignment',
    defaultMessage: '12. ASSIGNMENT'
  },
  assignment1: {
    id: 'TermsConditions.assignment1',
    defaultMessage: 'OmniBazaar Inc. reserves the right to assign this agreement, in whole or in part, at any time without notice. The User may not assign any of his/her rights or obligations under this Agreement.'
  },
  miscellaneous: {
    id: 'TermsConditions.miscellaneous',
    defaultMessage: '13. MISCELLANEOUS'
  },
  miscellaneous1: {
    id: 'TermsConditions.miscellaneous1',
    defaultMessage: '13.1. No waiver by OmniBazaar Inc. of any breach of any provision of this Agreement (including the failure of OmniBazaar Inc. to require strict and literal performance of or compliance with any provision of this Agreement) shall in any way be construed as a waiver of any subsequent breach of such provision or of any breach of any other provision of this Agreement.'
  },
  miscellaneous2: {
    id: 'TermsConditions.miscellaneous2',
    defaultMessage: '13.2. Nothing in this Agreement shall create or confer any rights or other benefits in favor of any third parties not party to this Agreement other than with an affiliate of OmniBazaar Inc.'
  },
  miscellaneous3: {
    id: 'TermsConditions.miscellaneous3',
    defaultMessage: '13.3. Nothing in this Agreement shall create or be deemed to create a partnership, agency, trust arrangement, fiduciary relationship or joint venture between you and us.'
  },
  miscellaneous4: {
    id: 'TermsConditions.miscellaneous4',
    defaultMessage: '13.4. This Agreement constitutes the entire understanding and agreement between you and us regarding the Services and supersedes any prior agreement, understanding, or arrangement between you and us.'
  }
});

class TermsAndConditions extends Component {
  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="terms-conditions">
        <p>{formatMessage(messages.termsIntro)}</p>

        <h3>{formatMessage(messages.grantOfLicense)}</h3>
        <p>{formatMessage(messages.grantOfLicense1)}</p>
        <p>{formatMessage(messages.grantOfLicense2)}</p>
        <p>{formatMessage(messages.grantOfLicense3)}</p>
        <p>{formatMessage(messages.grantOfLicense4)}</p>

        <h3>{formatMessage(messages.noWarranties)}</h3>
        <p>{formatMessage(messages.noWarranties1)}</p>
        <p>{formatMessage(messages.noWarranties2)}</p>
        <p>{formatMessage(messages.noWarranties3)}</p>

        <h3>{formatMessage(messages.authority)}</h3>
        <p>{formatMessage(messages.authority1)}</p>

        <h3>{formatMessage(messages.yourRepresentations)}</h3>
        <p>{formatMessage(messages.yourRepresentationsIntro)}</p>
        <p>{formatMessage(messages.yourRepresentations1)}</p>
        <p>{formatMessage(messages.yourRepresentations2)}</p>
        <p>{formatMessage(messages.yourRepresentations3)}</p>
        <p>{formatMessage(messages.yourRepresentations4)}</p>
        <p>{formatMessage(messages.yourRepresentations5)}</p>
        <p>{formatMessage(messages.yourRepresentations6)}</p>

        <h3>{formatMessage(messages.prohibitedUses)}</h3>
        <p>{formatMessage(messages.prohibitedUses1)}</p>
        <p>{formatMessage(messages.prohibitedUses2)}</p>
        <p>{formatMessage(messages.prohibitedUses3)}</p>

        <h3>{formatMessage(messages.breach)}</h3>
        <p>{formatMessage(messages.breach1)}</p>
        <p>{formatMessage(messages.breach2)}</p>

        <h3>{formatMessage(messages.limitationOfLiability)}</h3>
        <p>{formatMessage(messages.limitationOfLiability1)}</p>
        <p>{formatMessage(messages.limitationOfLiability2)}</p>

        <h3>{formatMessage(messages.disputes)}</h3>
        <p>{formatMessage(messages.disputes1)}</p>

        <h3>{formatMessage(messages.amendment)}</h3>
        <p>{formatMessage(messages.amendment1)}</p>

        <h3>{formatMessage(messages.governingLaw)}</h3>
        <p>{formatMessage(messages.governingLaw1)}</p>

        <h3>{formatMessage(messages.severability)}</h3>
        <p>{formatMessage(messages.severability1)}</p>

        <h3>{formatMessage(messages.assignment)}</h3>
        <p>{formatMessage(messages.assignment1)}</p>

        <h3>{formatMessage(messages.miscellaneous)}</h3>
        <p>{formatMessage(messages.miscellaneous1)}</p>
        <p>{formatMessage(messages.miscellaneous2)}</p>
        <p>{formatMessage(messages.miscellaneous3)}</p>
        <p>{formatMessage(messages.miscellaneous4)}</p>
      </div>
    );
  }
}

TermsAndConditions.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

TermsAndConditions.defaultProps = {
  intl: {},
};

export default injectIntl(TermsAndConditions);
