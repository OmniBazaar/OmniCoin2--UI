import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Form, Dropdown, Button, Grid, Modal } from 'semantic-ui-react';
import hash from 'object-hash';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import ImportedFilesTable from './components/ImportedFilesTable/ImportedFilesTable';
import {
  importFile,
  removeFile,
  removeAllFiles
} from '../../../../../../../../services/listing/importActions';

import { getFileExtension } from '../../../../../../../../utils/file';

import './import-listings.scss';

const iconSize = 42;

const options = [
  {
    key: 'all',
    value: 'all',
    text: 'All'
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
});

class ImportListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
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
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const extFile = getFileExtension(event);
      if (extFile === 'txt') {
        reader.onload = () => {
          // e.target.result
          const filename = this.inputElement.files[0].name;
          const file = {
            title: filename,
            content: 'The content for this txt file.',
            type: 'Amazon',
            category: 'Category',
            subCategory: 'Sub-category',
            contactType: 'Contact Type',
            contactInfo: 'Contact Info',
            price: 15,
            currency: 'USD',
          };
          this.props.listingActions.importFile(file);
        };
        reader.readAsDataURL(event.target.files[0]);
      } else {
        this.setState({ open: true });
      }
    }
  }

  onClickRemoveAll() {
    this.props.listingActions.removeAllFiles();
  }

  onClickImportFile() {
    this.inputElement.click();
  }

  importForm() {
    const { formatMessage } = this.props.intl;

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
              />
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
              {this.importedFiles()}
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
      <Modal size="mini" open={this.state.open} onClose={() => this.closeWarning()}>
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
    const { importedFiles } = this.props.listingImport;

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
              <ImportedFilesTable
                importedFiles={importedFiles}
                tableProps={{
                  sortable: true,
                  compact: true,
                  basic: 'very',
                  size: 'small'
                }}
              />
            </div>
          </div>
          <div className="footer-section">
            <Button content={formatMessage(messages.importListings).toUpperCase()} className="button--green-bg" />
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
    importedFiles: PropTypes.arrayOf(PropTypes.obj),
  }),
  listingActions: PropTypes.shape({
    importFile: PropTypes.func,
    removeFile: PropTypes.func,
    removeAllFiles: PropTypes.func,
  }),
};

ImportListings.defaultProps = {
  listingImport: {},
  listingActions: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      importFile,
      removeFile,
      removeAllFiles
    }, dispatch),
  }),
)(injectIntl(ImportListings));