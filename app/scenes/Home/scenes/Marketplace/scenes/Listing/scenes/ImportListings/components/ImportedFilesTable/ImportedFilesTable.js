import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
} from 'semantic-ui-react';
import hash from 'object-hash';
import { numberWithCommas } from '../../../../../../../../../../utils/numeric';

import { sortImportData } from '../../../../../../../../../../services/listing/importActions';
import CategoryDropdown from '../../../AddListing/components/CategoryDropdown/CategoryDropdown';
import SubCategoryDropdown from '../../../AddListing/components/SubCategoryDropdown/SubCategoryDropdown';

const messages = defineMessages({
  listingType: {
    id: 'ImportedFilesTable.listingType',
    defaultMessage: 'Listing Type'
  },
  category: {
    id: 'ImportedFilesTable.category',
    defaultMessage: 'Category'
  },
  subCategory: {
    id: 'ImportedFilesTable.subCategory',
    defaultMessage: 'Sub-Category'
  },
  contactType: {
    id: 'ImportedFilesTable.contactType',
    defaultMessage: 'Contact Type'
  },
  contactInfo: {
    id: 'ImportedFilesTable.contactInfo',
    defaultMessage: 'Contact Info'
  },
  title: {
    id: 'ImportedFilesTable.title',
    defaultMessage: 'Title'
  },
  description: {
    id: 'ImportedFilesTable.description',
    defaultMessage: 'Description'
  },
  price: {
    id: 'ImportedFilesTable.price',
    defaultMessage: 'Price'
  },
  currency: {
    id: 'ImportedFilesTable.currency',
    defaultMessage: 'Currency'
  },
});

class ImportedFilesTable extends Component {
  sortData = (clickedColumn) => () => {
    this.props.listingActions.sortImportData(clickedColumn);
  };

  renderCategoryDropdown({ category, index, fileIndex }) {
    const { onCategoryChange } = this.props;

    return (
      <CategoryDropdown
        selection
        disableAllOption
        input={{
          value: category,
          onChange: categorySelected => onCategoryChange({ categorySelected, index, fileIndex }),
        }}
      />
    );
  }

  renderSubCategoryDropdown({
    category, subcategory, index, fileIndex
  }) {
    const { onSubCategoryChange } = this.props;

    return (
      <SubCategoryDropdown
        selection
        disableAllOption
        parentCategory={category}
        input={{
          value: subcategory,
          onChange: subCategory => onSubCategoryChange({ subCategory, index, fileIndex }),
        }}
      />
    );
  }

  renderTitleInput({ listing_title, index, fileIndex }) {
    const { onTitleChange } = this.props;

    return (<input
      type="text"
      className="textfield"
      value={listing_title}
      onChange={editedTitle => onTitleChange({ editedTitle, index, fileIndex })}
    />);
  }

  renderDescriptionInput({ description, index, fileIndex }) {
    const { onDescriptionChange } = this.props;

    return (<input
      type="text"
      className="textfield"
      value={description}
      onChange={editedDesc => onDescriptionChange({ editedDesc, index, fileIndex })}
    />);
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      sortColumn,
      sortDirection,
      importedFiles
    } = this.props.listingImport;

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell key="type" sorted={sortColumn === 'type' ? sortDirection : null} onClick={this.sortData('type')}>
                  {formatMessage(messages.listingType)}
                </TableHeaderCell>
                <TableHeaderCell key="category" sorted={sortColumn === 'category' ? sortDirection : null} onClick={this.sortData('category')}>
                  {formatMessage(messages.category)}
                </TableHeaderCell>
                <TableHeaderCell key="subCategory" sorted={sortColumn === 'subcategory' ? sortDirection : null} onClick={this.sortData('subCategory')}>
                  {formatMessage(messages.subCategory)}
                </TableHeaderCell>
                <TableHeaderCell key="contactType" sorted={sortColumn === 'contactType' ? sortDirection : null} onClick={this.sortData('contactType')}>
                  {formatMessage(messages.contactType)}
                </TableHeaderCell>
                <TableHeaderCell key="contactInfo" sorted={sortColumn === 'contactInfo' ? sortDirection : null} onClick={this.sortData('contactInfo')}>
                  {formatMessage(messages.contactInfo)}
                </TableHeaderCell>
                <TableHeaderCell key="title" sorted={sortColumn === 'title' ? sortDirection : null} onClick={this.sortData('title')}>
                  {formatMessage(messages.title)}
                </TableHeaderCell>
                <TableHeaderCell key="description" sorted={sortColumn === 'description' ? sortDirection : null} onClick={this.sortData('description')}>
                  {formatMessage(messages.description)}
                </TableHeaderCell>
                <TableHeaderCell key="price" sorted={sortColumn === 'price' ? sortDirection : null} onClick={this.sortData('price')}>
                  {formatMessage(messages.price)}
                </TableHeaderCell>
                <TableHeaderCell key="currency" sorted={sortColumn === 'currency' ? sortDirection : null} onClick={this.sortData('currency')}>
                  {formatMessage(messages.currency)}
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                importedFiles.map((row, fileIndex) => row.items && row.items.map((item, index) => (
                  <TableRow key={hash(row) + hash(item) + hash(index)}>
                    <TableCell>{item.listing_type}</TableCell>
                    <TableCell>
                      {this.renderCategoryDropdown({ ...item, index, fileIndex })}
                    </TableCell>
                    <TableCell>
                      {this.renderSubCategoryDropdown({ ...item, index, fileIndex })}
                    </TableCell>
                    <TableCell>{item.contactType}</TableCell>
                    <TableCell>{item.contactInfo}</TableCell>
                    <TableCell>{this.renderTitleInput({ ...item, index, fileIndex })}</TableCell>
                    <TableCell>
                      {this.renderDescriptionInput({ ...item, index, fileIndex })}
                    </TableCell>
                    <TableCell>{numberWithCommas(item.price)}</TableCell>
                    <TableCell>{item.currency}</TableCell>
                  </TableRow>
                )))
              }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

ImportedFilesTable.propTypes = {
  listingActions: PropTypes.shape({
    sortImportData: PropTypes.func,
  }),
  listingImport: PropTypes.shape({
    importedFiles: PropTypes.array,
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string,
  }),
  myListings: PropTypes.arrayOf(PropTypes.object),
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    size: PropTypes.string
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  onCategoryChange: PropTypes.func.isRequired,
  onSubCategoryChange: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
};

ImportedFilesTable.defaultProps = {
  listingActions: {},
  listingImport: {},
  myListings: [],
  tableProps: {},
  intl: {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      sortImportData
    }, dispatch),
  })
)(injectIntl(ImportedFilesTable));
