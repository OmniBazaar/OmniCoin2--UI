import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { toLinuxArchString } from 'builder-util';

class AmazonListingsConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessKey: '',
      secret: '',
      assocTag: '',
      updatingConfig: false,
    };
  }

  updateConfig() {
    const { accessKey, secret, assocTag } = this.state;
    let errorMessage;

    if (!accessKey) {
      errorMessage = 'Access Key is missing!';
    } else if (!secret) {
      errorMessage = 'Secret is missing!';
    } else if (!assocTag) {
      errorMessage = 'Assoc Tag is missing!';
    }

    if (errorMessage) {
      return toastr.error(
        'Error',
        errorMessage
      );
    }

    this.setState({ updatingConfig: true });

    this.props.listingsActions.updateImportConfig({
      provider: 'amazon',
      data: { accessKey, secret, assocTag },
    });
  }

  render() {
    const { updatingConfig } = this.state;
    const { accessKey, secret, assocTag } = this.props;

    return ([
      <Grid.Column width={4}>
        AWS Access Key*
      </Grid.Column>,
      <Grid.Column width={12} className="import-config">
        <input
          className="textfield"
          type="text"
          name="awsAccessKey"
          placeholder="testing"
          onChange={e => this.setState({ accessKey: e.target.value })}
        />
      </Grid.Column>,
      <Grid.Column width={4}>
        AWS Secret Key*
      </Grid.Column>,
      <Grid.Column width={12} className="import-config">
        <input
          className="textfield"
          type="text"
          name="awsSecretKey"
          placeholder="testing"
          onChange={e => this.setState({ secret: e.target.value })}
        />
      </Grid.Column>,
      <Grid.Column width={4}>
        AWS Assoc Tag*
      </Grid.Column>,
      <Grid.Column width={12} className="import-config">
        <input
          className="textfield"
          type="text"
          name="awsAssocTag"
          placeholder="testing"
          onChange={e => this.setState({ assocTag: e.target.value })}
        />
      </Grid.Column>,
      <Grid.Column width={4}>
        Update configuration
      </Grid.Column>,
      <Grid.Column width={12}>
        <Button
          className="button--primary"
          loading={updatingConfig}
          content="Update Config"
          onClick={() => this.updateConfig()}
        />
      </Grid.Column>,
    ]);
  }
}

AmazonListingsConfig.propTypes = {
  onAccessKeyChange: PropTypes.func,
  onSecretChange: PropTypes.func,
  onAssocTagChange: PropTypes.func,
};

AmazonListingsConfig.defaultProps = {
  onAccessKeyChange: () => {},
  onSecretChange: () => {},
  onAssocTagChange: () => {},
};

export default connect(
  state => ({ ...state.default }),
  () => ({

  })
)(injectIntl(AmazonListingsConfig));
