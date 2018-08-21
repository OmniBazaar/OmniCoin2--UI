import React, {Component} from 'react';
import {defineMessages, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import './terms.scss';

const messages = defineMessages({
  termsIntroTitle: {
    id: 'TermsConditions.termsIntroTitle',
    defaultMessage: 'OmniBazaar, Inc.\'s Software Terms of Use'
  },
  termsIntro: {
    id: 'TermsConditions.termsIntro',
    defaultMessage: 'Please read these Terms of Use carefully before using this Software offered by OmniBazaar, Inc. ("OmniBazaar", "us", "we"). These Terms of Use set forth the terms and conditions of our relationship and for the use of the OmniBazaar Software (the "Software") by you (“you”, “your”, “user”).'
  },
  termsIntroNotice: {
    id: 'TermsConditions.termsIntroNotice',
    defaultMessage: 'IMPORTANT NOTICE: THIS AGREEMENT CONTAINS AN ARBITRATION AGREEMENT, WHICH WILL REQUIRE YOU TO SUBMIT ANY CLAIMS YOU MAY HAVE AGAINST OMNIBAZAAR TO BINDING AND FINAL ARBITRATION.  IN ADDITION, UNDER THE ARBITRATION PROVISION, (A) YOU WILL ONLY BE PERMITTED TO PURSUE CLAIMS AGAINST OMNIBAZAAR ON AN INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE ACTION OR PROCEEDING, AND (B) YOU WILL ONLY BE PERMITTED TO SEEK RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND DECLARATORY RELIEF) ON AN INDIVIDUAL BASIS. BY ENTERING THIS AGREEMENT, YOU EXPRESSLY ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND ALL OF THE TERMS OF THIS AGREEMENT, INCLUDING BUT NOT LIMITED TO THE SECTIONS REGARDING ARBITRATION.'
  },
  
  omniBazaarSoftwareTitle: {
    id: 'TermsConditions.omniBazaarSoftwareTitle',
    defaultMessage: 'The OmniBazaar Software'
  },
  omniBazaarSoftware: {
    id: 'TermsConditions.omniBazaarSoftware',
    defaultMessage: 'The OmniBazaar Software (the "Software") is a free software program that performs the following functions:'
  },
  omniBazaarSoftware1: {
    id: 'TermsConditions.omniBazaarSoftware1',
    defaultMessage: '1. Create a peer-to-peer data-sharing network (the “OmniBazaar Marketplace Platform” or “Network”).'
  },
  omniBazaarSoftware2: {
    id: 'TermsConditions.omniBazaarSoftware2',
    defaultMessage: '2. Connect the user’s computer to that Network.'
  },
  omniBazaarSoftware3: {
    id: 'TermsConditions.omniBazaarSoftware3',
    defaultMessage: '3. Allow individuals and businesses to buy and sell goods and services from each other.'
  },
  omniBazaarSoftware4: {
    id: 'TermsConditions.omniBazaarSoftware4',
    defaultMessage: '4. Enable automated payment for purchases using OmniCoin and Bitcoin cryptocurrencies.'
  },
  omniBazaarSoftware5: {
    id: 'TermsConditions.omniBazaarSoftware5',
    defaultMessage: '5. Reward users who provide services that benefit other users and the marketplace.'
  },
  omniBazaarSoftware6: {
    id: 'TermsConditions.omniBazaarSoftware6',
    defaultMessage: '6. Distribute free OmniCoins to users who join and refer their friends.'
  },
  omniBazaarSoftware7: {
    id: 'TermsConditions.omniBazaarSoftware7',
    defaultMessage: '7. Provide an escrow service that allows users to do business with other users that they do not know or trust.'
  },
  omniBazaarSoftware8: {
    id: 'TermsConditions.omniBazaarSoftware8',
    defaultMessage: '8. Track and use reputation and other information about users of the marketplace.'
  },
  omniBazaarSoftwareEnd: {
    id: 'TermsConditions.omniBazaarSoftwareEnd',
    defaultMessage: 'Track and use reputation and other information about users of the marketplace.'
  },
  
  omniCoinTokenTitle: {
    id: 'TermsConditions.omniCoinTokenTitle',
    defaultMessage: 'The OmniCoin Token Sale Event'
  },
  omniCoinToken1: {
    id: 'TermsConditions.omniCoinToken1',
    defaultMessage: '1.	OmniBazaar is conducting Token Sale Event (“Sale”) of its OmniBazaar Tokens, as further described in the OmniBazaar White Paper and the OmniBazaar Offering and/or Terms and Conditions Memorandum (collectively, the “Memorandum”.)'
  },
  omniCoinToken2: {
    id: 'TermsConditions.omniCoinToken2',
    defaultMessage: '2.	You understand that the terms, conditions, and important disclosures and information regarding the Sale are set forth in the White Paper and the Memorandum.'
  },
  
  agreementTitle: {
    id: 'TermsConditions.agreementTitle',
    defaultMessage: 'The Agreement between OmniBazaar and You'
  },
  
  agreement1: {
    id: 'TermsConditions.agreement1',
    defaultMessage: '1.	You understand that by installing or using the Software, you are agreeing to comply with and be bound by the terms and conditions contained herein ("Terms of Use" or "Agreement", which also incorporates OmniBazaar’s'
  },
  privacyPolicy: {
    id: 'TermsConditions.privacyPolicy',
    defaultMessage: 'Privacy Policy'
  },
  agreement1_1: {
    id: 'TermsConditions.agreement1_1',
    defaultMessage: ').'
  },
  privacyPolicyLink: {
    id: 'TermsConditions.privacyPolicyLink',
    defaultMessage: 'https://omnicoin.net/wp-content/uploads/2018/08/Omnicoin-Privacy-Policy-20180813.pdf'
  },
  agreement2: {
    id: 'TermsConditions.agreement2',
    defaultMessage: '2.	This Agreement constitutes the entire and only agreement between us and you.'
  },
  agreement3: {
    id: 'TermsConditions.agreement3',
    defaultMessage: '1.	This Agreement supersedes all prior or contemporaneous agreements, representations, warranties and understandings with respect to the Software, the content, products or services provided by or through the Software, and the subject matter of this Agreement.'
  },
  
  reviewingChangesTitle: {
    id: 'TermsConditions.reviewingChangesTitle',
    defaultMessage: 'You are responsible for reviewing changes to this Agreement'
  },
  reviewingChanges1: {
    id: 'TermsConditions.reviewingChanges1',
    defaultMessage: '1.	This Agreement applies to all users of the Software.'
  },
  reviewingChanges2: {
    id: 'TermsConditions.reviewingChanges2',
    defaultMessage: '2. OmniBazaar may make changes to this Agreement from time to time without specifically notifying you.'
  },
  reviewingChanges3: {
    id: 'TermsConditions.reviewingChanges3',
    defaultMessage: '3.	OmniBazaar will post the latest Agreement on the Software, but it is up to you to review it before using the Software.'
  },
  reviewingChanges4: {
    id: 'TermsConditions.reviewingChanges4',
    defaultMessage: '4. If you continue to use the Software after any of these changes, your continued use will mean that you have accepted any changes to the Agreement.'
  },
  reviewingChangesEnd: {
    id: 'TermsConditions.reviewingChangesEnd',
    defaultMessage: 'In addition, some services offered through the Software may be subject to additional terms and conditions specified by OmniBazaar from time to time and your use of such services is subject to those additional terms and conditions, which are incorporated into this Agreement by this reference.'
  },
  
  copyrightContentTitle: {
    id: 'TermsConditions.copyrightContentTitle',
    defaultMessage: 'The copyright to all content on the Software is owned by the provider of that content'
  },
  copyrightContent1: {
    id: 'TermsConditions.copyrightContent1',
    defaultMessage: '1. The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Software (“Copyright Content”) are the property of OmniBazaar, Inc. or the applicable content owner and are protected under applicable copyrights, trademarks and other proprietary rights.'
  },
  copyrightContent2: {
    id: 'TermsConditions.copyrightContent2',
    defaultMessage: '2.	You may not copy, redistribute, use or publish any part of the Software, except as allowed by this Agreement.'
  },
  copyrightContent3: {
    id: 'TermsConditions.copyrightContent3',
    defaultMessage: '3.	You may not copy, redistribute, use or publish any part of the Software, except as allowed by this Agreement.'
  },
  
  
  trademarksTitle: {
    id: 'TermsConditions.trademarksTitle',
    defaultMessage: 'You may not use trademarks appearing on the Software in an infringing manner'
  },
  trademarksTitle1: {
    id: 'TermsConditions.trademarksTitle1',
    defaultMessage: '1. You agree that OmniBazaar, CryptoBazaar, OmniCoin, and other OmniBazaar graphics, logos, page headers, button icons, scripts, and service names are trademarks, registered trademarks or trade dress of OmniBazaar or its affiliates (“Trademark Content”).'
  },
  trademarksTitle2: {
    id: 'TermsConditions.trademarksTitle2',
    defaultMessage: '2.	OmniBazaar trademarks and trade dress may not be used in connection with any product or service that is not OmniBazaar’s, in any manner that is likely to cause confusion among consumers, or in any manner that disparages or discredits OmniBazaar.'
  },
  trademarksTitle3: {
    id: 'TermsConditions.trademarksTitle3',
    defaultMessage: '3.	All other trademarks not owned by OmniBazaar or its affiliates that may appear on the Software are the property of their respective owners, who may or may not be affiliated with, connected to, or sponsored by OmniBazaar or its affiliates.'
  },
  
  
  limitedPurposesTitle: {
    id: 'TermsConditions.limitedPurposesTitle',
    defaultMessage: 'You may use the OmniBazaar Software for limited purposes'
  },
  limitedPurposes1: {
    id: 'TermsConditions.limitedPurposes1',
    defaultMessage: '1. OmniBazaar grants you a limited license to access and make personal use of the Software.'
  },
  limitedPurposes2: {
    id: 'TermsConditions.limitedPurposes2',
    defaultMessage: '2. OmniBazaar does not grant you the right to modify the Software, or any portion of the Software.'
  },
  limitedPurposes3: {
    id: 'TermsConditions.limitedPurposes3',
    defaultMessage: '3. You understand OmniBazaar does not grant you the right to: (a) resell or make commercial use (except as provided herein) of the Software or its contents; (b) make any derivative use of the Software or their contents; (c) download or copy account information for the benefit of a third party or merchant; or (d) use any data mining, robots, or similar data gathering and extraction tools.'
  },
  limitedPurposes4: {
    id: 'TermsConditions.limitedPurposes4',
    defaultMessage: '4. The Software contains or uses OmniCoin and other software, the source code for which is “open source”, and the reproduction and use of which is governed by the licenses of those programs. Specifically, the OmniCoin cryptocurrency software is licensed under the MIT license ('
  },
  limitedPurposesLink1: {
    id: 'TermsConditions.limitedPurposesLink1',
    defaultMessage: 'https://opensource.org/licenses/MIT'
  },
  limitedPurposes4_1: {
    id: 'TermsConditions.limitedPurposes4_1',
    defaultMessage: '). Couchbase (and its associated programs) are licensed under the Apache 2.0 license ('
  },
  limitedPurposesLink2: {
    id: 'TermsConditions.limitedPurposesLink2',
    defaultMessage: 'http://www.apache.org/licenses/LICENSE-2.0.html'
  },
  limitedPurposes4_2: {
    id: 'TermsConditions.limitedPurposes4_2',
    defaultMessage: '). Nothing in this license is intended to invalidate or contravene the licenses of these open source software licenses.'
  },
  limitedPurposes5: {
    id: 'TermsConditions.limitedPurposes5',
    defaultMessage: '5. You understand that the Software or any portion of the Software may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose, other than as required for the limited commercial use granted herein.'
  },
  limitedPurposes6: {
    id: 'TermsConditions.limitedPurposes6',
    defaultMessage: '6. You may not frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information of OmniBazaar and our affiliates without express written consent.'
  },
  limitedPurposes7: {
    id: 'TermsConditions.limitedPurposes7',
    defaultMessage: '7. You may not use any meta tags or any other "hidden text" utilizing OmniBazaar’s name or trademarks without the express written consent of OmniBazaar. Any unauthorized use terminates the permission or license granted by OmniBazaar hereunder.'
  },
  limitedPurposes8: {
    id: 'TermsConditions.limitedPurposes8',
    defaultMessage: '8. You may not engage in the copying, reproduction, publication, rearrangement, redistribution, modification, revision, alteration, or reverse engineering, of the Software.'
  },
  limitedPurposes9: {
    id: 'TermsConditions.limitedPurposes9',
    defaultMessage: '9. You are granted a limited, revocable, and nonexclusive right to create a hyperlink to the home page of OmniBazaar so long as the link does not portray OmniBazaar, its affiliates, or their products or services in a false, misleading, derogatory, or otherwise offensive matter.'
  },
  limitedPurposes10: {
    id: 'TermsConditions.limitedPurposes10',
    defaultMessage: '10. You may not use any OmniBazaar logo or other proprietary graphic or trademark as part of the link without express written permission.'
  },
  
  useOfTheSoftwareTitle: {
    id: 'TermsConditions.useOfTheSoftwareTitle',
    defaultMessage: 'Your Use of the Software'
  },
  
  registrationAndAccountTitle: {
    id: 'TermsConditions.registrationAndAccountTitle',
    defaultMessage: 'Your registration and account security'
  },
  registrationAndAccountStart: {
    id: 'TermsConditions.registrationAndAccountStart',
    defaultMessage: 'When you use the Software you may provide OmniBazaar certain registration and account information, which OmniBazaar will rely on to provide you with the Software. The following are your obligations when creating, registering, and maintaining the security and accuracy of your account:'
  },
  registrationAndAccount1: {
    id: 'TermsConditions.registrationAndAccount1',
    defaultMessage: '1. You will register your account for your own use and not for the use of another person, alter ego, or other identity.'
  },
  registrationAndAccount2: {
    id: 'TermsConditions.registrationAndAccount2',
    defaultMessage: '2. You will create only one account for yourself.'
  },
  registrationAndAccount3: {
    id: 'TermsConditions.registrationAndAccount3',
    defaultMessage: '3. You will not assign or transfer your account to anyone without first obtaining OmniBazaar\'s written consent.'
  },
  registrationAndAccount4: {
    id: 'TermsConditions.registrationAndAccount4',
    defaultMessage: '4. You will not provide false or misleading information when you register an account.'
  },
  registrationAndAccount5: {
    id: 'TermsConditions.registrationAndAccount5',
    defaultMessage: '5. If OmniBazaar terminates or disables your account, you may not create another account without first getting OmniBazaar\'s written consent.'
  },
  registrationAndAccount6: {
    id: 'TermsConditions.registrationAndAccount6',
    defaultMessage: '6. You will keep your contact and other information requested by OmniBazaar (such as email, location, etc.) accurate and up-to-date.'
  },
  registrationAndAccount7: {
    id: 'TermsConditions.registrationAndAccount7',
    defaultMessage: '7. You will not share your password, let anyone other than you access your account, or do anything that might compromise the security of your account.'
  },
  
  
  personalInfoTitle: {
    id: 'TermsConditions.personalInfoTitle',
    defaultMessage: 'Your personal information'
  },
  personalInfo1: {
    id: 'TermsConditions.personalInfo1',
    defaultMessage: '1. You understand and acknowledge that your use of the Software is governed by the'
  },
  personalInfo1_1: {
    id: 'TermsConditions.personalInfo1_1',
    defaultMessage: ', which is incorporated into this Agreement by this reference.'
  },
  personalInfo2: {
    id: 'TermsConditions.personalInfo2',
    defaultMessage: '2. OmniBazaar will only use personal information in accordance with OmniBazaar’s'
  },
  personalInfo3: {
    id: 'TermsConditions.personalInfo3',
    defaultMessage: '3. You grant a worldwide, perpetual, royalty-free, irrevocable, and transferable license to OmniBazaar to display, reproduce, transmit, use, and/or store this information to the extent necessary to support the operation of the Software.'
  },
  
  editOrModifyTitle: {
    id: 'TermsConditions.editOrModifyTitle',
    defaultMessage: 'OmniBazaar may edit or modify anything on the Software without notice'
  },
  editOrModifyStart: {
    id: 'TermsConditions.editOrModifyStart',
    defaultMessage: 'OmniBazaar is committed to delivering a positive user experience and you understand that OmniBazaar reserves the right (but without undertaking any duty) to edit, monitor, review, delete, modify, or move any content or material provided or placed on or though the Software in its sole discretion, without notice.'
  },
  
  updatedVersionsTitle: {
    id: 'TermsConditions.updatedVersionsTitle',
    defaultMessage: 'You are responsible for accepting updated versions of the Software'
  },
  updatedVersions1: {
    id: 'TermsConditions.updatedVersions1',
    defaultMessage: '1. If OmniBazaar provides updated versions of the Software and/or the Software and you do not accept these updated versions, you may not enjoy the most recent content, feature sets, and materials.'
  },
  updatedVersions2: {
    id: 'TermsConditions.updatedVersions2',
    defaultMessage: '2. If you do not accept updated versions of the Software, OmniBazaar shall not bear any responsibility or liability for your decision'
  },
  
  ageOfUseTitle: {
    id: 'TermsConditions.ageOfUseTitle',
    defaultMessage: 'You must be 18 or older to use the OmniBazaar Software'
  },
  ageOfUse1: {
    id: 'TermsConditions.ageOfUse1',
    defaultMessage: '1. You understand that you may not use the Software where such use is prohibited'
  },
  ageOfUse2: {
    id: 'TermsConditions.ageOfUse2',
    defaultMessage: '2. You understand that the Software are intended solely for users who are eighteen (18) years of age or older and can legally form a binding agreement.'
  },
  ageOfUse3: {
    id: 'TermsConditions.ageOfUse3',
    defaultMessage: '3. Any use of or access to the Software by anyone under 18 is unauthorized. If you are 13 or older but under 18, you must have your parent or legal guardian’s permission to use the Software and to accept the Terms of Use.'
  },
  ageOfUse4: {
    id: 'TermsConditions.ageOfUse4',
    defaultMessage: '4. You represent and warrant that you are 18 or older, or entering this Agreement on behalf of someone who is between the ages of 13 and 18, and that you agree to abide by all of the terms and conditions of this Agreement.'
  },
  ageOfUse5: {
    id: 'TermsConditions.ageOfUse5',
    defaultMessage: '5. OmniBazaar does not knowingly collect information from individuals who are less than thirteen (13) years of age.'
  },
  
  lawsApplicableTitle: {
    id: 'TermsConditions.lawsApplicableTitle',
    defaultMessage: 'It is your responsibility to make sure this Agreement and your use of the Software complies with all laws applicable to you'
  },
  lawsApplicable1: {
    id: 'TermsConditions.lawsApplicable1',
    defaultMessage: '1. You understand that OmniBazaar may, in its sole discretion, refuse to offer or make available the Software to any person or entity and change its eligibility criteria at any time.'
  },
  lawsApplicable2: {
    id: 'TermsConditions.lawsApplicable2',
    defaultMessage: '2. You are solely responsible for ensuring that this Agreement complies with all laws, rules and regulations applicable to you.'
  },
  lawsApplicable3: {
    id: 'TermsConditions.lawsApplicable3',
    defaultMessage: '3. You understand that your right to access the Software will be revoked where this Agreement or use of the Software is prohibited and, if that is the case, you agree not to use or access the Software in any way.'
  },
  
  responsibleForFollowingTitle: {
    id: 'TermsConditions.responsibleForFollowingTitle',
    defaultMessage: 'What Laws and Rules You Are Responsible for Following'
  },
  
  regulationsTitle: {
    id: 'TermsConditions.regulationsTitle',
    defaultMessage: 'You promise to comply with this Agreement and any laws or regulations applicable to you'
  },
  regulations1: {
    id: 'TermsConditions.regulations1',
    defaultMessage: '1. You promise not to use the Software for any purpose that is prohibited by this Agreement.'
  },
  regulations2: {
    id: 'TermsConditions.regulations2',
    defaultMessage: '2. You are responsible for all of your activity in connection with the Software.'
  },
  regulations3: {
    id: 'TermsConditions.regulations3',
    defaultMessage: '3. You shall abide by all applicable local, state, national and international laws and regulations and, if you represent a business, any educational, education, teaching, privacy, or other self-regulatory code(s) applicable to you.'
  },
  
  conductPoliciesTitle: {
    id: 'TermsConditions.conductPoliciesTitle',
    defaultMessage: 'You agree to comply with OmniBazaar’s conduct policies when using the Software'
  },
  conductPolicies1: {
    id: 'TermsConditions.conductPolicies1',
    defaultMessage: '1. We do our best to keep the Software safe and operational, but we cannot guarantee it. We need your help to do that, which includes the following commitments:'
  },
  conductPolicies2: {
    id: 'TermsConditions.conductPolicies2',
    defaultMessage: 'You will not modify, adapt, appropriate, reproduce, distribute, translate, create derivative works or adaptations of, publicly display, republish, repurpose, or in any way exploit the Software except as expressly authorized by OmniBazaar;'
  },
  conductPolicies3: {
    id: 'TermsConditions.conductPolicies3',
    defaultMessage: 'You will not decipher, decompile, disassemble, reverse engineer or otherwise attempt to derive any source code or underlying ideas or algorithms of any part of the Software, except to the limited extent applicable laws specifically prohibit such restriction;'
  },
  conductPolicies4: {
    id: 'TermsConditions.conductPolicies4',
    defaultMessage: 'You will not interfere or attempt to interfere with the proper working of the Software or any activities conducted on the Software;'
  },
  conductPolicies5: {
    id: 'TermsConditions.conductPolicies5',
    defaultMessage: 'You will not bypass any measures OmniBazaar may use to prevent or restrict access to the Software (or other accounts, computer systems or networks connected to the Software);'
  },
  conductPolicies6: {
    id: 'TermsConditions.conductPolicies6',
    defaultMessage: 'You will not run any form of auto-responder or "spam" on the Software;'
  },
  conductPolicies7: {
    id: 'TermsConditions.conductPolicies7',
    defaultMessage: 'You will not use manual or automated software, devices, or other processes to "crawl" or "spider" any page of the Software;'
  },
  conductPolicies8: {
    id: 'TermsConditions.conductPolicies8',
    defaultMessage: 'You will not harvest or scrape any content or materials from the Software;'
  },
  conductPolicies9: {
    id: 'TermsConditions.conductPolicies9',
    defaultMessage: 'You will not copy, rent, lease, distribute, or otherwise transfer any of the rights that you receive hereunder;'
  },
  conductPolicies10: {
    id: 'TermsConditions.conductPolicies10',
    defaultMessage: 'You will not solicit passwords or personally identifying information (this includes, but is not limited to, someone else’s name, birth date, home address, IP address, credit card number, social security number, or other government-issued identification information) for commercial or unlawful purposes;'
  },
  conductPolicies11: {
    id: 'TermsConditions.conductPolicies11',
    defaultMessage: 'You will not upload, post, transmit, share, store or otherwise make available any material that contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment;'
  },
  conductPolicies12: {
    id: 'TermsConditions.conductPolicies12',
    defaultMessage: 'You will not otherwise take any action in violation of OmniBazaar’s guidelines and policies;'
  },
  conductPolicies13: {
    id: 'TermsConditions.conductPolicies13',
    defaultMessage: 'You will not threaten, intimidate, or harass another user or any parties on or through the Software;'
  },
  conductPolicies14: {
    id: 'TermsConditions.conductPolicies14',
    defaultMessage: 'You will not falsely represent your identity or impersonate a third party, nor will you falsify or mislead third parties regarding your affiliation with any entity;'
  },
  
  importantNoticesTitle: {
    id: 'TermsConditions.importantNoticesTitle',
    defaultMessage: 'Important Notices'
  },
  
  riskTitle: {
    id: 'TermsConditions.riskTitle',
    defaultMessage: 'You use the OmniBazaar Software at your own risk'
  },
  risk1: {
    id: 'TermsConditions.risk1',
    defaultMessage: '1. OmniBazaar has no obligation to review any content or material, including vendor and product information, posted to or through the Software, and cannot therefore be responsible for such material or content.'
  },
  risk2: {
    id: 'TermsConditions.risk2',
    defaultMessage: '2. By providing the Software, OmniBazaar does not represent or imply that it endorses any content or material there posted, or that it believes such material to be accurate, useful or non-harmful.'
  },
  risk3: {
    id: 'TermsConditions.risk3',
    defaultMessage: '3. You are responsible for taking precautions as necessary to protect yourself and your computer systems from viruses, worms, Trojan horses, and other harmful or destructive content.'
  },
  risk4: {
    id: 'TermsConditions.risk4',
    defaultMessage: '4. The Software may contain content that is offensive, indecent, or otherwise objectionable, as well as content containing technical inaccuracies, typographical mistakes, and other errors.'
  },
  risk5: {
    id: 'TermsConditions.risk5',
    defaultMessage: '5. The Software may also contain material that violates the privacy or publicity rights, or infringes the intellectual property and other proprietary rights, of third parties, or the downloading, copying or use of which is subject to additional terms and conditions, stated or unstated.'
  },
  risk6: {
    id: 'TermsConditions.risk6',
    defaultMessage: '6. OmniBazaar disclaims any responsibility for any harm resulting from the use of the Software, or from viewing or downloading by those users of content posted on the Software.'
  },
  
  legalConditionsTitle: {
    id: 'TermsConditions.legalConditionsTitle',
    defaultMessage: 'Legal Conditions'
  },
  liabilityLimitedTitle: {
    id: 'TermsConditions.liabilityLimitedTitle',
    defaultMessage: 'OmniBazaar’s liability is limited'
  },
  liabilityLimited1: {
    id: 'TermsConditions.liabilityLimited1',
    defaultMessage: '1. OmniBazaar is not responsible for any third party sites, third party content posted on the Software.'
  },
  liabilityLimited2: {
    id: 'TermsConditions.liabilityLimited2',
    defaultMessage: '2. OmniBazaar is not responsible for the conduct, whether online or offline, of any user of the Software.'
  },
  liabilityLimited3: {
    id: 'TermsConditions.liabilityLimited3',
    defaultMessage: '3. OmniBazaar assumes no responsibility for any error, omission, interruption, deletion, defect, delay in operation or transmission, communications line failure, theft or destruction or unauthorized access to, or alteration of, user communications.'
  },
  liabilityLimited4: {
    id: 'TermsConditions.liabilityLimited4',
    defaultMessage: '4. You understand that it is your duty to confirm and verify any information provided on or through the Software, and that you bear the sole risk of relying on any such information, including but not limited to content, third-party content, links, or product listings.'
  },
  liabilityLimited5: {
    id: 'TermsConditions.liabilityLimited5',
    defaultMessage: '5. OmniBazaar is not responsible for any problems or technical malfunction of any telephone network or lines, cellular data provider or network, computer online systems, servers or providers, computer equipment, software, on account of technical problems or traffic congestion on the Software, including injury or damage to users or to any other person\'s computer, and/or mobile device.'
  },
  
  liabilityLimitedEnd1: {
    id: 'TermsConditions.liabilityLimitedEnd1',
    defaultMessage: 'WE TRY TO KEEP THE SOFTWARE AND SERVICES UP, BUG-FREE, AND SAFE, BUT YOU USE THEM AT YOUR OWN RISK. THE INFORMATION FROM OR THROUGH THE SOFTWARE AND THE SERVICES IS PROVIDED "AS IS," "AS AVAILABLE," AND ALL WARRANTIES, EXPRESS OR IMPLIED, ARE DISCLAIMED. THE INFORMATION, SOFTWARE AND THE SERVICES MAY CONTAIN VIRUSES, BUGS, ERRORS, PROBLEMS OR OTHER LIMITATIONS. IN NO EVENT WILL OMNIBAZAAR OR ITS DIRECTORS, EMPLOYEES OR AGENTS HAVE ANY LIABILITY WHATSOEVER FOR YOUR USE OF ANY THE SOFTWARE. WE ARE NOT LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES (INCLUDING DAMAGES FOR LOSS OF BUSINESS, LOSS OF PROFITS, LITIGATION, OR THE LIKE), WHETHER BASED ON BREACH OF CONTRACT, BREACH OF WARRANTY, TORT (INCLUDING NEGLIGENCE), PRODUCT LIABILITY OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.'
  },
  liabilityLimitedEnd2: {
    id: 'TermsConditions.liabilityLimitedEnd2',
    defaultMessage: 'OMNIBAZAAR DOES NOT CONTROL THIRD PARTY CONTENT OR THE INFORMATION PROVIDED BY THIRD PARTIES, AND THEREFORE SHALL NOT BE RESPONSIBLE FOR YOUR RELIANCE ON ANY INFORMATION OR STATEMENTS MADE ON OR THROUGH THE SOFTWARE.'
  },
  liabilityLimitedEnd3: {
    id: 'TermsConditions.liabilityLimitedEnd3',
    defaultMessage: 'OMNIBAZAAR’S LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER, AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE FEES, IF ANY, PAID BY YOU TO US FOR THE USE OF THE SOFTWARE, BUT IN NO CASE WILL OUR LIABILITY TO YOU SHALL EXCEED $50. YOU AGREE THAT DISPUTES BETWEEN YOU AND OMNIBAZAAR WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION. YOU ACKNOWLEDGE THAT IF NO FEES ARE PAID TO US FOR THE SOFTWARE, YOU SHALL BE LIMITED TO INJUNCTIVE RELIEF ONLY, UNLESS OTHERWISE PERMITTED BY LAW, AND SHALL NOT BE ENTITLED TO DAMAGES OF ANY KIND FROM US, REGARDLESS OF THE CAUSE OF ACTION. IF YOU ARE A CALIFORNIA RESIDENT, YOU WAIVE CALIFORNIA CIVIL CODE SECTION 1542, WHICH STATES, IN PART: "A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN HIS FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE DEBTOR".'
  },
  
  agreeToIndemnifyTitle: {
    id: 'TermsConditions.agreeToIndemnifyTitle',
    defaultMessage: 'You agree to indemnify OmniBazaar'
  },
  agreeToIndemnifyText: {
    id: 'TermsConditions.agreeToIndemnifyText',
    defaultMessage: 'You agree to indemnify, defend, and hold harmless OmniBazaar, its contractors, licensors, subsidiaries and affiliates and their respective partners, directors, officers, members, managers, employees and agents from and against any and all claims and expenses, including any and all losses, costs, liabilities, and attorneys\' fees, arising out of or in connection with: (1) your use of the Software, (2) any third party content, third party sites and any other content, (3) any purchases from or interactions with vendors (4) your violation of this Agreement, or of any law or the rights of any third party, and (5) your breach of this Agreement and/or any breach of your representations and warranties set forth herein'
  },
  
  floridaLawTitle: {
    id: 'TermsConditions.floridaLawTitle',
    defaultMessage: 'You agree that Florida law applies to this Agreement'
  },
  floridaLawText1: {
    id: 'TermsConditions.floridaLawText1',
    defaultMessage: 'Subject to the arbitration clauses included above, if there is any dispute arising out of the Software, by using the Software, you expressly agree that any such dispute shall be governed by the laws of the State of Florida, without regard to its conflict of law provisions, and you expressly agree and consent to the exclusive jurisdiction and venue of the state and federal courts of the State of Florida, in Pinellas County, for the resolution of any such dispute. Omnibazaar and you hereby exclude the application of the Uniform Computer Information Transactions Act (“UCITA”), the United Nations Convention on the International Sale of Goods (“CISG”) and any law of any jurisdiction that would apply UCITA or CISG or terms equivalent to UCITA or CISG to this Agreement'
  },
  floridaLawText2: {
    id: 'TermsConditions.floridaLawText2',
    defaultMessage: 'The Software and the underlying information and technology may not be downloaded or otherwise exported or re-exported (i) into (or to a national or resident of) Cuba, Iraq, Libya, Yugoslavia, North Korea, Iran, Syria or any other country to which the U.S. has embargoed goods; or (ii) to anyone on the U.S. Treasury Department\'s list of Specially Designated Nationals or the U.S. Commerce Department\'s Table of Deny Orders. By downloading or using the Software, you are agreeing to the foregoing and you represent and warrant that you are not located in, under the control of, or a national or resident of any such country or on any such list'
  },
  floridaLawText3: {
    id: 'TermsConditions.floridaLawText3',
    defaultMessage: 'The Software is a “commercial item,” as that term is defined at 48 C.F.R. 2.101 (Oct. 1995), consisting of “commercial computer software” and “commercial computer software documentation”, as such terms are used in 48 C.F.R. 12.212 (Sept. 1995). Consistent with 48 C.F.R. 12.212 and 48 C.F.R. 227.7202-1 through 227.7202-4 (June 1995), all United States government end users acquire only those rights in the Software that are provided by this Agreement'
  },
  
  representationAndWarrantyTitle: {
    id: 'TermsConditions.representationAndWarrantyTitle',
    defaultMessage: 'Your general representation and warranty'
  },
  representationAndWarranty1: {
    id: 'TermsConditions.representationAndWarranty1',
    defaultMessage: 'You represent and warrant that:'
  },
  representationAndWarranty2: {
    id: 'TermsConditions.representationAndWarranty2',
    defaultMessage: 'You will use the Software in accordance with the'
  },
  representationAndWarranty2_1: {
    id: 'TermsConditions.representationAndWarranty2_1',
    defaultMessage: ', with this Agreement and with all applicable laws and regulations (including without limitation any local laws or regulations in your country, state, city, or other governmental area, regarding online conduct and acceptable content, and including all applicable laws regarding the transmission of technical data exported from the United States or the country in which you reside)'
  },
  representationAndWarranty3: {
    id: 'TermsConditions.representationAndWarranty3',
    defaultMessage: 'You will use the Software so as not to infringe or misappropriate the intellectual property rights of any third party.'
  },
  
  otherTermsTitle: {
    id: 'TermsConditions.otherTermsTitle',
    defaultMessage: 'Other Terms'
  },
  otherTerms1: {
    id: 'TermsConditions.otherTerms1',
    defaultMessage: '1. You and OmniBazaar agree that any cause of action arising out of or related to the Software must commence within one (1) year after the cause of action arose; otherwise, such cause of action is permanently barred.'
  },
  otherTerms2: {
    id: 'TermsConditions.otherTerms2',
    defaultMessage: '2. You agree that, except for claims for injunctive or equitable relief or claims regarding intellectual property rights (which may be brought in any competent court without the posting of a bond), any dispute arising under this Agreement shall be finally settled in accordance with the Comprehensive Arbitration Rules of the Judicial Arbitration and Mediation Service, Inc. (”JAMS”) by arbitrators appointed in accordance with such rules.'
  },
  otherTerms3: {
    id: 'TermsConditions.otherTerms3',
    defaultMessage: '3. You agree any arbitration shall take place in Pinellas County, Florida, in the English language and the arbitral decision may be enforced in any court. The prevailing party in any action or proceeding to enforce this Agreement shall be entitled to costs and attorneys\' fees.'
  },
  otherTerms4: {
    id: 'TermsConditions.otherTerms4',
    defaultMessage: '4. If any part of this Agreement is held invalid or unenforceable, that part will be construed to reflect the parties\' original intent, and the remaining portions will remain in full force and effect.'
  },
  otherTerms5: {
    id: 'TermsConditions.otherTerms5',
    defaultMessage: '5. A waiver by either party of any term or condition of this Agreement or any breach thereof, in any one instance, will not waive such term or condition or any subsequent breach thereof.'
  },
  otherTerms6: {
    id: 'TermsConditions.otherTerms6',
    defaultMessage: '6. OmniBazaar may assign its rights under this Agreement without condition.'
  },
  otherTerms7: {
    id: 'TermsConditions.otherTerms7',
    defaultMessage: '7. This Agreement will be binding upon and will inure to the benefit of the parties, their successors and permitted assigns. The headings of the paragraphs of this Agreement are inserted for convenience only and shall not be deemed to constitute part of this Agreement or to affect the construction thereofThis Agreement will be binding upon and will inure to the benefit of the parties, their successors and permitted assigns. The headings of the paragraphs of this Agreement are inserted for convenience only and shall not be deemed to constitute part of this Agreement or to affect the construction thereof.'
  },
});

class TermsAndConditions extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    
    return (
      <div className="terms-conditions">
        <div className="title"><h2>{formatMessage(messages.termsIntroTitle)}</h2></div>
        <p>{formatMessage(messages.termsIntro)}</p>
        <div className="important">{formatMessage(messages.termsIntroNotice)}</div>
        
        <h3><u>{formatMessage(messages.omniBazaarSoftwareTitle)}</u></h3>
        <p>{formatMessage(messages.omniBazaarSoftware)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware1)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware2)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware3)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware4)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware5)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware6)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware7)}</p>
        <p>{formatMessage(messages.omniBazaarSoftware8)}</p>
        <p>{formatMessage(messages.omniBazaarSoftwareEnd)}</p>
        
        <h3><u>{formatMessage(messages.omniCoinTokenTitle)}</u></h3>
        <p>{formatMessage(messages.omniCoinToken1)}</p>
        <p>{formatMessage(messages.omniCoinToken2)}</p>
        
        <h3><u>{formatMessage(messages.agreementTitle)}</u></h3>
        <p>
          {formatMessage(messages.agreement1)}
          <a href={formatMessage(messages.privacyPolicyLink)}>{` ${formatMessage(messages.privacyPolicy)}`}</a>
          {formatMessage(messages.agreement1_1)}
        </p>
        <p>{formatMessage(messages.agreement2)}</p>
        <p>{formatMessage(messages.agreement3)}</p>
        
        <h3>{formatMessage(messages.reviewingChangesTitle)}</h3>
        <p>{formatMessage(messages.reviewingChanges1)}</p>
        <p>{formatMessage(messages.reviewingChanges2)}</p>
        <p>{formatMessage(messages.reviewingChanges3)}</p>
        <p>{formatMessage(messages.reviewingChanges4)}</p>
        <p>{formatMessage(messages.reviewingChangesEnd)}</p>
        
        <h3>{formatMessage(messages.copyrightContentTitle)}</h3>
        <p>{formatMessage(messages.copyrightContent1)}</p>
        <p>{formatMessage(messages.copyrightContent2)}</p>
        <p>{formatMessage(messages.copyrightContent3)}</p>
        
        <h3>{formatMessage(messages.trademarksTitle)}</h3>
        <p>{formatMessage(messages.trademarksTitle1)}</p>
        <p>{formatMessage(messages.trademarksTitle2)}</p>
        <p>{formatMessage(messages.trademarksTitle3)}</p>
        
        <h3>{formatMessage(messages.limitedPurposesTitle)}</h3>
        <p>{formatMessage(messages.limitedPurposes1)}</p>
        <p>{formatMessage(messages.limitedPurposes2)}</p>
        <p>{formatMessage(messages.limitedPurposes3)}</p>
        <p>
          {formatMessage(messages.limitedPurposes4)}
          <a href={formatMessage(messages.limitedPurposesLink1)}
             target="_blank">{formatMessage(messages.limitedPurposesLink1)}</a>
          {formatMessage(messages.limitedPurposes4_1)}
          <a href={formatMessage(messages.limitedPurposesLink2)}
             target="_blank">{formatMessage(messages.limitedPurposesLink2)}</a>
          {formatMessage(messages.limitedPurposes4_2)}
        </p>
        <p>{formatMessage(messages.limitedPurposes5)}</p>
        <p>{formatMessage(messages.limitedPurposes6)}</p>
        <p>{formatMessage(messages.limitedPurposes7)}</p>
        <p>{formatMessage(messages.limitedPurposes8)}</p>
        <p>{formatMessage(messages.limitedPurposes9)}</p>
        <p>{formatMessage(messages.limitedPurposes10)}</p>
        
        <h3><u>{formatMessage(messages.useOfTheSoftwareTitle)}</u></h3>
        
        <p>{formatMessage(messages.registrationAndAccountTitle)}</p>
        <p>{formatMessage(messages.registrationAndAccountStart)}</p>
        <p>{formatMessage(messages.registrationAndAccount1)}</p>
        <p>{formatMessage(messages.registrationAndAccount2)}</p>
        <p>{formatMessage(messages.registrationAndAccount3)}</p>
        <p>{formatMessage(messages.registrationAndAccount4)}</p>
        <p>{formatMessage(messages.registrationAndAccount5)}</p>
        <p>{formatMessage(messages.registrationAndAccount6)}</p>
        <p>{formatMessage(messages.registrationAndAccount7)}</p>
        
        <h3>{formatMessage(messages.personalInfoTitle)}</h3>
        <p>
          {formatMessage(messages.personalInfo1)}
          <a href={formatMessage(messages.privacyPolicyLink)}>{` ${formatMessage(messages.privacyPolicy)}`}</a>
          {formatMessage(messages.personalInfo1_1)}
        </p>
        <p>
          {formatMessage(messages.personalInfo2)}
          <a href={formatMessage(messages.privacyPolicyLink)}>{` ${formatMessage(messages.privacyPolicy)}.`}</a>
        </p>
        <p>{formatMessage(messages.personalInfo3)}</p>
        
        <h3>{formatMessage(messages.editOrModifyTitle)}</h3>
        <p>{formatMessage(messages.editOrModifyStart)}</p>
        
        <h3>{formatMessage(messages.updatedVersionsTitle)}</h3>
        <p>{formatMessage(messages.updatedVersions1)}</p>
        <p>{formatMessage(messages.updatedVersions2)}</p>
        
        <h3>{formatMessage(messages.ageOfUseTitle)}</h3>
        <p>{formatMessage(messages.ageOfUse1)}</p>
        <p>{formatMessage(messages.ageOfUse2)}</p>
        <p>{formatMessage(messages.ageOfUse3)}</p>
        <p>{formatMessage(messages.ageOfUse4)}</p>
        <p>{formatMessage(messages.ageOfUse5)}</p>
        
        <h3>{formatMessage(messages.lawsApplicableTitle)}</h3>
        <p>{formatMessage(messages.lawsApplicable1)}</p>
        <p>{formatMessage(messages.lawsApplicable2)}</p>
        <p>{formatMessage(messages.lawsApplicable3)}</p>
        
        <h3><u>{formatMessage(messages.responsibleForFollowingTitle)}</u></h3>
        
        <h3>{formatMessage(messages.regulationsTitle)}</h3>
        <p>{formatMessage(messages.regulations1)}</p>
        <p>{formatMessage(messages.regulations2)}</p>
        <p>{formatMessage(messages.regulations3)}</p>
        
        <h3>{formatMessage(messages.regulationsTitle)}</h3>
        <p>{formatMessage(messages.regulations1)}</p>
        <p>{formatMessage(messages.regulations2)}</p>
        <p>{formatMessage(messages.regulations3)}</p>
        
        <h3>{formatMessage(messages.conductPoliciesTitle)}</h3>
        <p>{formatMessage(messages.conductPolicies1)}</p>
        <ul className="conduct">
          <li>{formatMessage(messages.conductPolicies2)}</li>
          <li>{formatMessage(messages.conductPolicies3)}</li>
          <li>{formatMessage(messages.conductPolicies4)}</li>
          <li>{formatMessage(messages.conductPolicies5)}</li>
          <li>{formatMessage(messages.conductPolicies6)}</li>
          <li>{formatMessage(messages.conductPolicies7)}</li>
          <li>{formatMessage(messages.conductPolicies8)}</li>
          <li>{formatMessage(messages.conductPolicies9)}</li>
          <li>{formatMessage(messages.conductPolicies10)}</li>
          <li>{formatMessage(messages.conductPolicies11)}</li>
          <li>{formatMessage(messages.conductPolicies12)}</li>
          <li>{formatMessage(messages.conductPolicies13)}</li>
          <li>{formatMessage(messages.conductPolicies14)}</li>
        </ul>
        
        <h3><u>{formatMessage(messages.importantNoticesTitle)}</u></h3>
        
        <h3>{formatMessage(messages.riskTitle)}</h3>
        <p>{formatMessage(messages.risk1)}</p>
        <p>{formatMessage(messages.risk2)}</p>
        <p>{formatMessage(messages.risk3)}</p>
        <p>{formatMessage(messages.risk4)}</p>
        <p>{formatMessage(messages.risk5)}</p>
        <p>{formatMessage(messages.risk6)}</p>
        
        <h3><u>{formatMessage(messages.legalConditionsTitle)}</u></h3>
        
        <h3>{formatMessage(messages.liabilityLimitedTitle)}</h3>
        <p>{formatMessage(messages.liabilityLimited1)}</p>
        <p>{formatMessage(messages.liabilityLimited2)}</p>
        <p>{formatMessage(messages.liabilityLimited3)}</p>
        <p>{formatMessage(messages.liabilityLimited4)}</p>
        <p>{formatMessage(messages.liabilityLimited5)}</p>
        
        <p>{formatMessage(messages.liabilityLimitedEnd1)}</p>
        <p>{formatMessage(messages.liabilityLimitedEnd2)}</p>
        <p>{formatMessage(messages.liabilityLimitedEnd3)}</p>
        
        <h3>{formatMessage(messages.agreeToIndemnifyTitle)}</h3>
        <p>{formatMessage(messages.agreeToIndemnifyText)}</p>
        
        <h3>{formatMessage(messages.floridaLawTitle)}</h3>
        <p>{formatMessage(messages.floridaLawText1)}</p>
        <p>{formatMessage(messages.floridaLawText2)}</p>
        <p>{formatMessage(messages.floridaLawText3)}</p>
        
        <h3>{formatMessage(messages.representationAndWarrantyTitle)}</h3>
        <p>{formatMessage(messages.representationAndWarranty1)}</p>
        <ul className="conduct">
          <li>
            {formatMessage(messages.representationAndWarranty2)}
            <a href={formatMessage(messages.privacyPolicyLink)}>{` ${formatMessage(messages.privacyPolicy)}`}</a>
            {formatMessage(messages.representationAndWarranty2_1)}
          </li>
          <li>{formatMessage(messages.representationAndWarranty3)}</li>
        </ul>
        
        <h3>{formatMessage(messages.otherTermsTitle)}</h3>
        <p>{formatMessage(messages.otherTerms1)}</p>
        <p>{formatMessage(messages.otherTerms2)}</p>
        <p>{formatMessage(messages.otherTerms3)}</p>
        <p>{formatMessage(messages.otherTerms4)}</p>
        <p>{formatMessage(messages.otherTerms5)}</p>
        <p>{formatMessage(messages.otherTerms6)}</p>
        <p>{formatMessage(messages.otherTerms7)}</p>
      
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
