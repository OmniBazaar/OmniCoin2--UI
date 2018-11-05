import React from 'react';
import electron from 'electron';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { dhtReconnect } from '../../services/search/dht/dhtActions';

export default (WrappedComponent) => {
	class PMHOC extends React.Component {
		componentDidMount() {
			electron.remote.powerMonitor.on('resume', this.onPowerResume.bind(this));
		}

		onPowerResume() {
			this.props.dhtActions.dhtReconnect();
		}

		render() {
			return <WrappedComponent {...this.props} />
		}
	}

	return connect(
		null,
		dispatch => ({
			dhtActions: bindActionCreators({
				dhtReconnect
			}, dispatch)
		})
	)(PMHOC);
}