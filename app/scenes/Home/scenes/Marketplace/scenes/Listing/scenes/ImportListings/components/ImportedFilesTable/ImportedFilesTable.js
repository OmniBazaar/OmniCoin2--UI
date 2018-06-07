import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
    defaultMessage: 'Sub Category'
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

  render() {
    const { formatMessage } = this.props.intl;

    const {
      sortColumn,
      sortDirection,
      importedFiles
    } = this.props.listingImport;

    console.log(importedFiles);

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
                importedFiles.map(row => row.items && row.items.map((item, index) => (
                  <TableRow key={hash(row) + hash(item) + hash(index)}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.subcategory}</TableCell>
                    <TableCell>{item.contactType}</TableCell>
                    <TableCell>{item.contactInfo}</TableCell>
                    <TableCell>{item.listing_title}</TableCell>
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
