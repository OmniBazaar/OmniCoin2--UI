import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import { getIp } from '../../../../../../../utils/ip';

export default class IpInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ip: props.value,
			loading: false
		}
	}

	componentDidMount() {
		if (!this.state.ip) {
			this.setState({
				loading: true
			});

			getIp().then(ip => {
				if (!this.state.ip) {
					this.setState({
						ip,
						loading: false
					});
					this.props.onChange(ip);
				}
			});
		}
	}

	onChange(event, data) {
		this.setState({
			ip: data.value
		});
		this.props.onChange(data.value);
	}

	render() {
		return (
			<Input
				loading={this.state.loading}
				input={{
					value: this.state.ip
				}}
        onChange={this.onChange.bind(this)}
      />
		);
	}
}