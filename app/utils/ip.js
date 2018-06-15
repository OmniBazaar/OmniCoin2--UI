import publicIp from 'public-ip';

export const getIp = () => {
	return publicIp.v4();
}