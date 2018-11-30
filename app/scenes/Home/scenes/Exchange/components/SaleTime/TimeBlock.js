import React, { Component } from 'react';
import cn from 'classnames';

export default class TimeBlock extends Component {
	render() {
		return (
			<div className={cn('time-block', this.props.className)}>
				<div className='content'>
					<div className='value'>{this.props.value}</div>
					<div className='unit'>{this.props.unit}</div>
				</div>
			</div>
		);
	}
}