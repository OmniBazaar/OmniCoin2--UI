import { defineMessages } from 'react-intl';

export default defineMessages({
  error: {
    id: 'MyEscrowProposals.error',
    defaultMessage: 'Error'
  },
  success: {
    id: 'MyEscrowProposals.success',
    defaultMessage: 'Success'
  },
  proposalText: {
    id: 'MyEscrowProposals.proposalText',
    defaultMessage: '{initiator} proposed to extend escrow transaction expiration time '
  },
  proposalExpirationTime: {
    id: 'MyEscrowProposals.to',
    defaultMessage: ' to {proposedTime}.'
  },
  you: {
    id: 'MyEscrowProposals.you',
    defaultMessage: 'You'
  },
  approve: {
    id: 'MyEscrowProposals.approve',
    defaultMessage: 'Approve it'
  },
  proposalApproveSuccess: {
    id: 'MyEscrowProposals.approveSuccess',
    defaultMessage: 'Proposal was successfully approved'
  }
});
