import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import open from 'open';

const messages = defineMessages({
	"newVersionAvailable": {
		id: "Home.newVersionAvailable",
		defaultMessage: "Update's available"
	}
})

class UpdateNotification extends Component {
	onClickUpdate() {
		const { updateLink } = this.props.updateNotification;
		open(updateLink);
	}

	render() {
		const { formatMessage } = this.props.intl;
		const { hasUpdate, updateLink } = this.props.updateNotification;

		if (hasUpdate && updateLink) {
			return (
				<div className='update-notification'>
					<Button className="button--green-bg" onClick={this.onClickUpdate.bind(this)}>
		        {formatMessage(messages.newVersionAvailable)}
		      </Button>
	      </div>
			);
		}

		return null;
	}
}

UpdateNotification.propTypes = {
	updateNotification: PropTypes.shape({
		updateLink: PropTypes.string,
		checking: PropTypes.bool,
		hasUpdate: PropTypes.bool
	})
};

export default connect(
	state => ({
		updateNotification: state.default.updateNotification
	})
)(injectIntl(UpdateNotification));