import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Dropdown, Button, Grid, Modal, Input, Loader } from 'semantic-ui-react';
import hash from 'object-hash';
import { toastr } from 'react-redux-toastr';
import { pick } from 'lodash';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import ImportedFilesTable from './components/ImportedFilesTable/ImportedFilesTable';
import {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles
} from '../../../../../../../../services/listing/importActions';
import { getFileExtension } from '../../../../../../../../utils/file';
import './import-listings.scss';
import PublishersDropdown from '../AddListing/components/PublishersDropdown/PublishersDropdown';

const iconSize = 42;

const options = [
  {
    key: 'all',
    value: 'all',
    text: 'All',
  },
  {
    key: 'amazon',
    value: 'amazon',
    text: 'Amazon',
  },
];

const messages = defineMessages({
  myListings: {
    id: 'ImportListings.myListings',
    defaultMessage: 'My Listings'
  },
  importListings: {
    id: 'ImportListings.importListings',
    defaultMessage: 'Import Listings'
  },
  files: {
    id: 'ImportListings.files',
    defaultMessage: 'Files'
  },
  listingsVendor: {
    id: 'ImportListings.listingsVendor',
    defaultMessage: 'Listings Vendor'
  },
  filesToImport: {
    id: 'ImportListings.filesToImport',
    defaultMessage: 'Files to Import'
  },
  addFiles: {
    id: 'ImportListings.addFiles',
    defaultMessage: 'ADD FILES'
  },
  removeAll: {
    id: 'ImportListings.removeAll',
    defaultMessage: 'REMOVE ALL'
  },
  importedData: {
    id: 'ImportListings.importedData',
    defaultMessage: 'Imported Data'
  },
  warning: {
    id: 'ImportListings.warning',
    defaultMessage: 'Warning'
  },
  ok: {
    id: 'ImportListings.ok',
    defaultMessage: 'Ok'
  },
  onlyTextFileMsg: {
    id: 'ImportListings.onlyTextFileMsg',
    defaultMessage: 'Only txt files are allowed.'
  },
  selectPublisher: {
    id: 'AddListing.selectPublisher',
    defaultMessage: 'Select publisher'
  },
  importationErrorTitle: {
    id: 'ImportListings.errorTitle',
    defaultMessage: 'Error'
  },
  importationSuccessTitle: {
    id: 'ImportListings.successTitle',
    defaultMessage: 'Success'
  },
  importationSuccess: {
    id: 'ImportListings.success',
    defaultMessage: 'The files has been imported successfully'
  },
  importationPublisherRequired: {
    id: 'ImportListings.publisherRequired',
    defaultMessage: 'A publisher must be selected'
  },
  importationMissingDefaults: {
    id: 'ImportListings.missingDefaults',
    defaultMessage: 'You should fill you Listing Default values to proceed...'
  },
});

const renderLoader = () => <div className="loading-container"><Loader inline active /></div>;

class ImportListings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedPublisher: null,
      selectedVendor: null,
    };
  }

  componentWillReceiveProps({ listingImport }) {
    const { formatMessage } = this.props.intl;
    const { importingFile, error } = listingImport;

    if (!importingFile && importingFile !== this.props.listingImport.importingFile) {
      if (listingImport.error) {
        return toastr.error(
          formatMessage(messages.importationErrorTitle),
          error
        );
      }

      toastr.success(
        formatMessage(messages.importationSuccessTitle),
        formatMessage(messages.importationSuccess)
      );
    }
  }

  removeFile(index) {
    this.props.listingActions.removeFile(index);
  }

  importedFiles() {
    const { importedFiles } = this.props.listingImport;

    return (
      <div className="imported-files">
        {importedFiles.map((file, index) => (
          <div key={hash(file)} className="file">
            <span className="file-id">{index + 1}</span>
            <span className="file-name">{file.title}</span>
            <span
              className="file-delete-icon"
              onClick={() => this.removeFile(index)}
              onKeyDown={() => this.removeFile(index)}
              tabIndex={0}
              role="link"
            >
              X
            </span>
          </div>
        ))}
      </div>
    );
  }

  importFile(event) {
    const { formatMessage } = this.props.intl;

    if (!this.state.selectedPublisher) {
      return toastr.error(
        formatMessage(messages.importationErrorTitle),
        formatMessage(messages.importationPublisherRequired)
      );
    }

    const {
      category, currency, description, name,
    } = pick(
      this.props.listingDefaults,
      ['category', 'currency', 'description', 'name']
    );

    if (!category || !currency || !description || !name) {
      return toastr.error(
        formatMessage(messages.importationErrorTitle),
        formatMessage(messages.importationMissingDefaults)
      );
    }


    if (event.target.files && event.target.files[0]) {
      const extFile = getFileExtension(event);

      if (extFile !== 'txt') {
        return this.setState({ open: true });
      }

      const file = this.inputElement.files[0];

      this.props.listingActions.stageFile(
        {
          content: file,
          name: file.name,
        },
        this.props.listingDefaults,
        this.state.selectedVendor
      );
    }
  }

  onClickRemoveAll() {
    this.props.listingActions.removeAllFiles();
  }

  onClickImportFile() {
    this.inputElement.click();
  }

  importListings() {
    const { formatMessage } = this.props.intl;

    if (!this.state.selectedPublisher) {
      return toastr.error(
        formatMessage(messages.importationErrorTitle),
        formatMessage(messages.importationPublisherRequired)
      );
    }

    this.props.listingActions.importFiles({
      publisher: this.state.selectedPublisher,
      filesToImport: this.props.listingImport.importedFiles,
    });
  }

  importForm() {
    const { formatMessage } = this.props.intl;
    const { stagingFile } = this.props.listingImport;

    return (
      <Form className="import-listing-form">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <span className="title">{formatMessage(messages.files)}</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.listingsVendor)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.listingsVendor)}
                options={options}
                value={this.state.selectedVendor}
                onChange={(e, { value }) => this.setState({ selectedVendor: value })}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.selectPublisher)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Input>
                <PublishersDropdown
                  placeholder={formatMessage(messages.selectPublisher)}
                  value={this.state.selectedPublisher}
                  onChange={selectedPublisher => this.setState({ selectedPublisher })}
                />
              </Input>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <span>{formatMessage(messages.filesToImport)}</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <div className="buttons-wrapper">
                <input
                  ref={(ref) => { this.inputElement = ref; }}
                  type="file"
                  onChange={this.importFile.bind(this)}
                  className="filetype"
                  accept=".txt"
                />
                <Button content={formatMessage(messages.addFiles)} className="button--primary" onClick={() => this.onClickImportFile()} />
                <Button content={formatMessage(messages.removeAll)} className="button--blue removeAll" onClick={() => this.onClickRemoveAll()} />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={12}>
              {stagingFile ? renderLoader() : this.importedFiles()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  closeWarning() {
    this.setState({ open: false });
  }

  showWarningMessage() {
    const { formatMessage } = this.props.intl;

    return (
      <Modal size="mini" open={this.state.open} onClose={() => this.closeWarning()} closeIcon>
        <Modal.Header>
          {formatMessage(messages.warning)}
        </Modal.Header>
        <Modal.Content>
          <p className="modal-content">{formatMessage(messages.onlyTextFileMsg)}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={() => this.closeWarning()}>
            {formatMessage(messages.ok)}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { importedFiles, importingFile, stagingFile } = this.props.listingImport;

    return (
      <div className="marketplace-container category-listing import-listings">
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-section">
            <div className="top-header">
              <div className="content">
                <div className="category-title">
                  <div className="parent">
                    <span>{formatMessage(messages.myListings)}</span>
                    <Icon name="long arrow right" width={iconSize} height={iconSize} />
                  </div>
                  <span className="child">{formatMessage(messages.importListings)}</span>
                </div>
              </div>
            </div>
            <div className="listing-body">
              {this.importForm()}
            </div>
          </div>
          <div className="bottom-section">
            <div className="listing-body">
              <span className="title">{formatMessage(messages.importedData)}</span>
              {stagingFile ? renderLoader() : <ImportedFilesTable
                importedFiles={importedFiles}
                tableProps={{
                  sortable: true,
                  compact: true,
                  basic: 'very',
                  size: 'small'
                }}
              />}
            </div>
          </div>
          <div className="footer-section">
            <Button
              content={formatMessage(messages.importListings).toUpperCase()}
              className="button--green-bg"
              loading={importingFile}
              onClick={() => this.importListings()}
            />
          </div>
        </div>
        {this.showWarningMessage()}
      </div>
    );
  }
}

ImportListings.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  listingImport: PropTypes.shape({
    importedFiles: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string,
    importingFile: PropTypes.bool,
    stagingFile: PropTypes.bool,
  }),
  listingActions: PropTypes.shape({
    stageFile: PropTypes.func,
    importFiles: PropTypes.func,
    removeFile: PropTypes.func,
    removeAllFiles: PropTypes.func,
  }),
  listingDefaults: PropTypes.shape({
    category: PropTypes.string,
    subcategory: PropTypes.string,
    currency: PropTypes.string,
    price_using_btc: PropTypes.bool,
    price_using_omnicoin: PropTypes.bool,
    description: PropTypes.string,
    images: PropTypes.object,
    address: PropTypes.string,
    city: PropTypes.string,
    post_code: PropTypes.string,
  }),
};

ImportListings.defaultProps = {
  account: {},
  listingImport: {},
  listingActions: {},
  listingDefaults: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      stageFile,
      importFiles,
      removeFile,
      removeAllFiles
    }, dispatch),
  })
)(injectIntl(ImportListings));
