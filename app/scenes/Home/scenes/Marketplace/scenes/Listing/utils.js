import { weightUnits, sizeUnits } from './scenes/AddListing/constants';

export const getWeightUnit = (listing, defaultValue) => {
	if (!defaultValue) {
		defaultValue = 'oz';
	}

	if (!listing.weight_unit) {
		return weightUnits[defaultValue];
	}

	const u = weightUnits[listing.weight_unit];
	if (!u) {
		return weightUnits[defaultValue];
	}

	return u;
}

export const getSizeUnit = (listing, unitProp, defaultValue) => {
	if (!defaultValue) {
		defaultValue = 'in';
	}

	if (!listing[unitProp]) {
		return sizeUnits[defaultValue];
	}

	const u = sizeUnits[listing[unitProp]];
	if (!u) {
		return sizeUnits[defaultValue];
	}

	return u;
}