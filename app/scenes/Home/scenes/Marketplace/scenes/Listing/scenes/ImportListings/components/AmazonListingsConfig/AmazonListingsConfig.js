import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import { Button, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { updateImportConfig } from '../../../../../../../../../../services/listing/importActions';
import Checkbox from '../../../../../../../../../../components/Checkbox/Checkbox';

const AMAZON_PROVIDER = 'amazon';

const messages = defineMessages({
  accessKeyTitle: {
    id: 'AmazonListingsConfig.accessKeyTitle',
    defaultMessage: 'AWS Access Key*'
  },
  secretKeyTitle: {
    id: 'AmazonListingsConfig.secretKeyTitle',
    defaultMessage: 'AWS Secret Key*'
  },
  assocTagTitle: {
    id: 'AmazonListingsConfig.assocTagTitle',
    defaultMessage: 'AWS Assoc Tag*'
  },
  accessKey: {
    id: 'AmazonListingsConfig.accessKey',
    defaultMessage: 'Your access key'
  },
  secretKey: {
    id: 'AmazonListingsConfig.secretKey',
    defaultMessage: 'Your secret key'
  },
  assocTag: {
    id: 'AmazonListingsConfig.assocTag',
    defaultMessage: 'Your assoc tag'
  },
  accessKeyError: {
    id: 'AmazonListingsConfig.accessKeyError',
    defaultMessage: 'Your access key is missing'
  },
  secretKeyError: {
    id: 'AmazonListingsConfig.secretKeyError',
    defaultMessage: 'Your secret key is missing'
  },
  assocTagError: {
    id: 'AmazonListingsConfig.assocTagError',
    defaultMessage: 'Your assoc tag is missing'
  },
  updateConfig: {
    id: 'AmazonListingsConfig.updateConfig',
    defaultMessage: 'Update Config'
  },
  errorTitle: {
    id: 'AmazonListingsConfig.errorTitle',
    defaultMessage: 'Error'
  },
  successTitle: {
    id: 'AmazonListingsConfig.successTitle',
    defaultMessage: 'Success'
  },
  successMessage: {
    id: 'AmazonListingsConfig.successMessage',
    defaultMessage: 'Config updated'
  },
  rememberConfig: {
    id: 'AmazonListingsConfig.rememberConfig',
    defaultMessage: 'I want to use this configuration for this provider\'s future importations'
  }
});

class AmazonListingsConfig extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessKey: '',
      secret: '',
      assocTag: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { updatingConfig } = nextProps;
    const { formatMessage } = this.props.intl;

    if (!updatingConfig && this.props.updatingConfig) {
      if (this.props.error) {
        toastr.error(
          formatMessage(messages.errorTitle),
          this.props.error
        );
      } else {
        toastr.success(
          formatMessage(messages.successTitle),
          formatMessage(messages.successMessage)
        );

        this.props.onConfigUpdate();
      }
    }
  }

  updateConfig() {
    const { accessKey, secret, assocTag } = this.state;
    const { formatMessage } = this.props.intl;
    let errorMessage;

    if (!accessKey) {
      errorMessage = formatMessage(messages.accessKeyError);
    } else if (!secret) {
      errorMessage = formatMessage(messages.secretKeyError);
    } else if (!assocTag) {
      errorMessage = formatMessage(messages.assocTagError);
    }

    if (errorMessage) {
      return toastr.error(
        formatMessage(messages.errorTitle),
        errorMessage
      );
    }

    this.props.listingsActions.updateImportConfig({
      provider: AMAZON_PROVIDER,
      data: { accessKey, secret, assocTag },
    });
  }

  render() {
    const { updatingConfig, intl: { formatMessage } } = this.props;

    return ([
      <Grid.Column width={4}>
        {formatMessage(messages.accessKeyTitle)}
      </Grid.Column>,
      <Grid.Column width={12} className="import-config">
        <input
          className="textfield"
          type="text"
          name="awsAccessKey"
          placeholder={formatMessage(messages.accessKey)}
          onChange={e => this.setState({ accessKey: e.target.value })}
        />
      </Grid.Column>,
      <Grid.Column width={4}>
        {formatMessage(messages.secretKeyTitle)}
      </Grid.Column>,
      <Grid.Column width={12} className="import-config">
        <input
          className="textfield"
          type="text"
          name="awsSecretKey"
          placeholder={formatMessage(messages.secretKey)}
          onChange={e => this.setState({ secret: e.target.value })}
        />
      </Grid.Column>,
      <Grid.Column width={4}>
        {formatMessage(messages.assocTagTitle)}
      </Grid.Column>,
      <Grid.Column width={12} className="import-config">
        <input
          className="textfield"
          type="text"
          name="awsAssocTag"
          placeholder={formatMessage(messages.assocTag)}
          onChange={e => this.setState({ assocTag: e.target.value })}
        />
      </Grid.Column>,
      <Grid.Column width={4} />,
      <Grid.Column width={12} className="import-config">
        <Checkbox
          value={false}
          onChecked={() => {}}
        />
        <span style={{ marginLeft: '3px' }}>{formatMessage(messages.rememberConfig)}</span>
      </Grid.Column>,
      <Grid.Column width={4} />,
      <Grid.Column width={12} className="import-config">
        <Button
          className="button--primary"
          loading={updatingConfig}
          disabled={updatingConfig}
          content={formatMessage(messages.updateConfig)}
          onClick={() => this.updateConfig()}
        />
      </Grid.Column>,
    ]);
  }
}

AmazonListingsConfig.propTypes = {
  listingsActions: PropTypes.shape({
    updateImportConfig: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  updatingConfig: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onConfigUpdate: PropTypes.func,
};

AmazonListingsConfig.defaultProps = {
  error: '',
  onConfigUpdate: () => ({}),
};

export default connect(
  state => ({ ...state.default.listingImport, ...state.default.intl }),
  dispatch => ({
    listingsActions: bindActionCreators({
      updateImportConfig,
    }, dispatch)
  })
)(injectIntl(AmazonListingsConfig));
