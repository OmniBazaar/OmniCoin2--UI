import publicIp from 'public-ip';

export const getIp = () => publicIp.v4();
