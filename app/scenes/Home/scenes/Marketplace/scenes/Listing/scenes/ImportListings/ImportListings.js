import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Dropdown, Button, Grid, Modal, Input, Loader } from 'semantic-ui-react';
import hash from 'object-hash';
import { toastr } from 'react-redux-toastr';
import { pick } from 'lodash';
import { NavLink } from 'react-router-dom';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import ImportedFilesTable from './components/ImportedFilesTable/ImportedFilesTable';
import {
  stageFile,
  importFiles,
  removeFile,
  removeAllFiles,
  updateFileItemCategory,
  updateFileItemSubcategory,
  updateFileItemTitle,
  updateFileItemDescription,
} from '../../../../../../../../services/listing/importActions';
import { getFileExtension } from '../../../../../../../../utils/file';
import './import-listings.scss';
import PublishersDropdown from '../AddListing/components/PublishersDropdown/PublishersDropdown';
import { checkPublisherAliveStatus } from '../../../../../../../../services/listing/apis';
import AmazonListingsConfig from './components/AmazonListingsConfig/AmazonListingsConfig';

const MANDATORY_DEFAULTS_FIELDS = ['category', 'currency', 'description', 'name'];

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
    defaultMessage: 'Okay'
  },
  onlyTextFileMsg: {
    id: 'ImportListings.onlyTextFileMsg',
    defaultMessage: 'Only TXT files are allowed.'
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
    defaultMessage: 'The file has been imported successfully.'
  },
  importationSuccess: {
    id: 'ImportListings.success',
    defaultMessage: 'The files has been imported successfully'
  },
  importationPublisherRequired: {
    id: 'ImportListings.publisherRequired',
    defaultMessage: 'A publisher must be selected.'
  },
  importationPublisherNotAvailable: {
    id: 'ImportListings.importationPublisherNotAvailable',
    defaultMessage: 'This publisher is not active. Please choose another one.'
  },
  importationMissingDefaults: {
    id: 'ImportListings.missingDefaults',
    defaultMessage: 'Please enter your Listing Default values to proceed...'
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
      validatingPublisher: false,
      configValid: false,
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

      this.removeAllFiles();
      this.setState({ selectedPublisher: null, selectedVendor: null });

      toastr.success(
        formatMessage(messages.importationSuccessTitle),
        formatMessage(messages.importationSuccess)
      );
    }
  }

  vendorsConfigs = {
    amazon: () => (
      <AmazonListingsConfig
        onConfigUpdate={() => this.setState({ configValid: true })}
        onConfigValid={() => {
          if (!this.state.configValid) {
            this.setState({ configValid: true });
          }
        }}
        onConfigInvalid={() => {
          if (this.state.configValid) {
            this.setState({ configValid: false });
          }
        }}
      />
    )
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

  async importFile(file) {
    const { formatMessage } = this.props.intl;
    const { auth } = this.props;

    if (!this.state.selectedPublisher) {
      return toastr.error(
        formatMessage(messages.importationErrorTitle),
        formatMessage(messages.importationPublisherRequired)
      );
    }

    this.setState({ validatingPublisher: true });

    const isPublisherAlive = await checkPublisherAliveStatus(
      auth.currentUser,
      this.state.selectedPublisher
    );

    this.setState({ validatingPublisher: false });

    if (!isPublisherAlive) {
      this.removeAllFiles();

      return toastr.error(
        formatMessage(messages.importationErrorTitle),
        formatMessage(messages.importationPublisherNotAvailable)
      );
    }

    const {
      category, currency, description, name,
    } = pick(
      this.props.listingDefaults,
      MANDATORY_DEFAULTS_FIELDS
    );

    if (!category || !currency || !description || !name) {
      return toastr.error(
        formatMessage(messages.importationErrorTitle),
        formatMessage(messages.importationMissingDefaults)
      );
    }


    if (file && file) {
      const extFile = getFileExtension(file);

      if (extFile !== 'txt') {
        return this.setState({ open: true });
      }

      const content = this.inputElement.files[0];

      this.props.listingActions.stageFile(
        {
          content,
          name: content.name,
        },
        this.props.listingDefaults,
        this.state.selectedVendor
      );
    }
  }

  onClickRemoveAll() {
    this.removeAllFiles();
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

  removeAllFiles() {
    this.inputElement.value = '';
  }

  onVendorChange(selectedVendor) {
    this.setState({ selectedVendor, configValid: selectedVendor === 'all' });
  }

  importForm() {
    const { formatMessage } = this.props.intl;
    const { stagingFile } = this.props.listingImport;
    const { validatingPublisher, configValid, selectedVendor } = this.state;

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
              <span>{formatMessage(messages.listingsVendor)}*</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <Dropdown
                compact
                selection
                placeholder={formatMessage(messages.listingsVendor)}
                options={options}
                value={this.state.selectedVendor}
                onChange={(e, { value }) => this.onVendorChange(value)}
              />
            </Grid.Column>
            {this.state.selectedVendor && this.vendorsConfigs[this.state.selectedVendor] &&
              this.vendorsConfigs[this.state.selectedVendor]()}
            <Grid.Column width={4}>
              <span>{formatMessage(messages.selectPublisher)}*</span>
            </Grid.Column>
            <Grid.Column width={12} className="publishers-dropdown">
              <Input className="publishers-input">
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
              <span>{formatMessage(messages.filesToImport)}*</span>
            </Grid.Column>
            <Grid.Column width={12}>
              <div className="buttons-wrapper">
                <input
                  ref={(ref) => { this.inputElement = ref; }}
                  type="file"
                  onChange={({ target: { files } }) =>
                    files && files[0] && this.importFile(files[0])}
                  className="filetype"
                  accept=".txt"
                />
                <Button
                  className="button--primary"
                  loading={validatingPublisher}
                  content={formatMessage(messages.addFiles)}
                  disabled={!selectedVendor || (selectedVendor !== 'all' && !configValid)}
                  onClick={() => this.onClickImportFile()}
                />
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

  updateCategory({ categorySelected, index, fileIndex }) {
    this.props.listingActions.updateFileItemCategory({
      index, fileIndex, category: categorySelected,
    });
  }

  updateSubCategory({ subCategory, index, fileIndex }) {
    this.props.listingActions.updateFileItemSubcategory({
      index, fileIndex, subcategory: subCategory,
    });
  }

  updateTitle({ editedTitle, index, fileIndex }) {
    this.props.listingActions.updateFileItemTitle({
      index, fileIndex, title: editedTitle,
    });
  }

  updateDescription({ editedDesc, index, fileIndex }) {
    this.props.listingActions.updateFileItemDescription({
      index, fileIndex, description: editedDesc,
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { importedFiles, importingFile, stagingFile } = this.props.listingImport;
    const { selectedVendor, selectedPublisher, configValid } = this.state;
    let isDisabled = false;
    if (!selectedVendor || (selectedVendor !== 'all' && !configValid) || !selectedPublisher || !importedFiles.length) {
      isDisabled = true;
    }


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
                    <NavLink to="/listings" activeClassName="active" className="menu-item">
                      <span className="link">
                        <span>{formatMessage(messages.myListings)}</span>
                      </span>
                    </NavLink>
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
                onCategoryChange={params => this.updateCategory(params)}
                onSubCategoryChange={params => this.updateSubCategory(params)}
                onTitleChange={params => this.updateTitle(params)}
                onDescriptionChange={params => this.updateDescription(params)}
              />}
            </div>
          </div>
          <div className="footer-section">
            <Button
              content={formatMessage(messages.importListings).toUpperCase()}
              className="button--green-bg"
              loading={importingFile}
              onClick={() => this.importListings()}
              disabled={isDisabled}
            />
          </div>
        </div>
        {this.showWarningMessage()}
      </div>
    );
  }
}

ImportListings.propTypes = {
  auth: PropTypes.shape({
    currentUser: PropTypes.object,
  }),
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
    updateFileItemCategory: PropTypes.func,
    updateFileItemSubcategory: PropTypes.func,
    updateFileItemTitle: PropTypes.func,
    updateFileItemDescription: PropTypes.func,
  }),
  listingDefaults: PropTypes.shape({
    category: PropTypes.string,
    subcategory: PropTypes.string,
    currency: PropTypes.string,
    price_using_btc: PropTypes.bool,
    price_using_eth: PropTypes.bool,
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
  auth: {},
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
      removeAllFiles,
      updateFileItemCategory,
      updateFileItemSubcategory,
      updateFileItemTitle,
      updateFileItemDescription,
    }, dispatch),
  })
)(injectIntl(ImportListings));
