import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { getStatus } from '../../services/blockchain/latency/latency';

class Latency extends Component {
  format() {
    const { latency } = this.props;
    if (latency < 1000) {
      return latency;
    }
    return (latency / 1000).toFixed(2);
  }

  renderStatus() {
    const { latency } = this.props;
    const status = getStatus(latency);
    switch (status) {
      case 'low':
        return (
          <FormattedMessage
            id="Latency.low"
            defaultMessage="Latency.low"
          />
        );
      case 'medium':
        return (
          <FormattedMessage
            id="Latency.medium"
            defaultMessage="Latency.medium"
          />
        );
      case 'high':
        return (
          <FormattedMessage
            id="Latency.high"
            defaultMessage="Latency.high"
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { latency } = this.props;
    return (
      <span>
        {this.renderStatus()}: {
          latency < 1000 ?
            <FormattedMessage
              id="Latency.milliseconds"
              defaultMessage="{latency} ms"
              values={{ latency: this.format(latency) }}
            />
            :
            <FormattedMessage
              id="Latency.seconds"
              defaultMessage="{latency} s"
              values={{ latency: this.format(latency) }}
            />
        }
      </span>
    );
  }
}

export default Latency;

Latency.propTypes = {
  latency: PropTypes.number
};

Latency.defaultProps = {
  latency: null
};
