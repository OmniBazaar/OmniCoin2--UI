import React, { Component } from 'react';
import equalIcon from './equal.png';

export default class Rate extends Component {
	render() {
		const { icon, fromName, toName, rate } = this.props;
		return (
			<div className='rate-row'>
				<img className='currency-icon' src={icon} />
				<div className='exchange-part from'>
					<div className='value'>1</div>
					<div className='currency'>{fromName}</div>
				</div>
				<img className='equal-icon' src={equalIcon} />
				<div className='exchange-part to'>
					<div className='value'>{rate}</div>
					<div className='currency'>{toName}</div>
				</div>
			</div>
		);
	}
}