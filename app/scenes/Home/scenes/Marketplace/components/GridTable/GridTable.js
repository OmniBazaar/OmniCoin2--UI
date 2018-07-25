import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { toastr } from 'react-redux-toastr';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Icon,
  Button,
  Dimmer,
  Loader,
  Image
} from 'semantic-ui-react';
import hash from 'object-hash';
import './grid-table.scss';

import Pagination from '../../../../../../components/Pagination/Pagination';
import ConfirmationModal from '../../../../../../components/ConfirmationModal/ConfirmationModal';
import Dollar from '../../../../../../assets/images/currency-icons/dollar.png';
import Euro from '../../../../../../assets/images/currency-icons/euro.png';
import Btc from '../../../../../../assets/images/currency-icons/btc.png';
import Omni from '../../../../../../assets/images/currency-icons/omnic.svg';
import ObNet from '../../../../../../assets/images/ob-net.png';

import {
  setPaginationGridTable,
  setActivePageGridTable,
  sortGridTableBy
} from '../../../../../../services/marketplace/marketplaceActions';
import { deleteListing, removeFromFavorites } from '../../../../../../services/listing/listingActions';

import {
  mainCategories,
  getSubCategoryTitle
} from '../../categories';

import { numberWithCommas } from '../../../../../../utils/numeric';
import messages from './messages';

const iconSizeSmall = 12;

class GridTable extends Component {
  state = {
    confirmDeleteOpen: false
  };

  componentDidMount() {
    this.props.gridTableActions.sortGridTableBy(
      this.props.data,
      this.props.sortBy,
      this.props.sortDirection,
      this.props.currency
    );
    this.props.gridTableActions.setPaginationGridTable(this.props.rowsPerPage);
    this.props.gridTableActions.setActivePageGridTable(1);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data ||
        this.props.sortBy !== nextProps.sortBy ||
        this.props.sortDirection !== nextProps.sortDirection ||
        this.props.currency !== nextProps.currency) {
      this.props.gridTableActions.sortGridTableBy(
        nextProps.data,
        nextProps.sortBy,
        nextProps.sortDirection,
        nextProps.currency
      );
      this.props.gridTableActions.setPaginationGridTable(this.props.rowsPerPage);
      this.props.gridTableActions.setActivePageGridTable(1);
    }

    if (
      this.props.listing.deleteListing.deleting &&
      !nextProps.listing.deleteListing.deleting &&
      nextProps.listing.deleteListing.listingId
    ) {
      const { formatMessage } = this.props.intl;
      if (nextProps.listing.deleteListing.error) {
        this.showErrorToast(
          formatMessage(messages.error),
          formatMessage(messages.deleteListingError)
        );
      } else {
        this.showSuccessToast(
          formatMessage(messages.success),
          formatMessage(messages.deleteListingSuccess)
        );
      }
    }
  }

  handlePaginationChange = (e, { activePage }) => {
    this.props.gridTableActions.setActivePageGridTable(activePage);
  };

  removeFromFavorites = (listing_id) => {
    this.props.listingActions.removeFromFavorites(listing_id);
  };

  renderEmptyRow() {
    const { formatMessage } = this.props.intl;

    return (
      <TableRow className="items empty">
        <TableCell className="item">
          {formatMessage(messages.noData)}
        </TableCell>
      </TableRow>
    );
  }

  onEditClick(item) {
    const { history } = this.props;
    history.push(`/edit-listing/${item.listing_id}`);
  }

  onDeleteClick(item) {
    this.setState({
      confirmDeleteOpen: true
    });
    this.item = item;
  }

  onOkDelete() {
    this.closeConfirm();
    if (this.item) {
      this.props.listingActions.deleteListing({ publisher_ip: this.item.ip }, this.item);
    }
  }

  closeConfirm() {
    this.setState({
      confirmDeleteOpen: false
    });
  }

  showSuccessToast(title, message) {
    toastr.success(title, message);
  }

  showErrorToast(title, message) {
    toastr.error(title, message);
  }

  getIcon(showConvertedPrice, itemCurrency, currency) {
    const type = showConvertedPrice ? currency : itemCurrency;

    if (type === 'USD') {
      return <Image src={Dollar} className="currency-icon" />;
    } else if (type === 'EUR') {
      return <Image src={Euro} className="currency-icon" />;
    } else if (type === 'BITCOIN') {
      return <Image src={Btc} className="currency-icon" />;
    }
    return <Image src={Omni} className="currency-icon" />;
  }

  renderLoading() {
    const { deleting } = this.props.listing.deleteListing;
    return (
      <Dimmer active={deleting} inverted>
        <Loader size="medium" />
      </Dimmer>
    );
  }

  render() {
    const {
      activePageGridTable,
      totalPagesGridTable,
      gridTableDataFiltered
    } = this.props.marketplace;
    const {
      showTrailingLoader,
      currency,
      loading
    } = this.props;
    const data = gridTableDataFiltered.filter(item => item && item.listing_id);
    const rows = _.chunk(data, 6);
    const { formatMessage } = this.props.intl;
    let showConvertedPrice = false;
    if (currency && currency !== 'ALL' && currency !== 'all') {
      showConvertedPrice = true;
    }

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableBody>
              {!loading && (
                (rows.length > 0 || showTrailingLoader) ? rows.map((row, idx) =>
                  (
                    <TableRow key={hash(row)} className="items">
                      {row.map(item => {
                        let image = item.ip ?
                          `http://${item.ip}/publisher-images/${item.images && item.images[0] ? item.images[0].thumb : ''}` : null; // todo
                        if(!item.images.length) {
                          image = ObNet
                        }
                        const style = image ? { backgroundImage: `url(${image})` } : {};
                        let { description } = item;
                        description = description.length > 55 ? `${description.substring(0, 55)}...` : description;

                        let categoryTitle = '';
                        if (item.category && item.category.toLowerCase() !== 'all') {
                          categoryTitle = mainCategories[item.category] ?
                            formatMessage(mainCategories[item.category]) : item.category;
                        }
                        const subcategory = getSubCategoryTitle(item.category, item.subcategory);
                        const subCategoryTitle = subcategory !== '' ? formatMessage(subcategory) : '';

                        return (
                          <TableCell className="item" key={hash(item)}>
                            <Link to={`listing/${item.listing_id}`}>
                              <div className="img-wrapper" style={style} />
                            </Link>

                            <Link to={`listing/${item.listing_id}`}>
                              <span className="title">{item.listing_title}</span>
                            </Link>

                            <span className="subtitle">
                              {categoryTitle}
                              <span>
                                <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                              </span>
                              {subCategoryTitle}
                            </span>

                            <span className="description">{description}</span>
                            <div className="listing-info">
                              <div className="price">
                                {this.getIcon(showConvertedPrice, item.currency, currency)}
                              </div>
                              <div>
                                {!showConvertedPrice ? numberWithCommas(parseFloat(item.price)) : numberWithCommas(parseFloat(item.convertedPrice))}
                              </div>
                              {(this.props.location.pathname === '/favorite-listings') &&
                                <div>
                                  <Button
                                    onClick={() => this.removeFromFavorites(item.listing_id)}
                                    content={formatMessage(messages.removeFromFavorites)}
                                    className="button--transparent"
                                  />
                                </div>
                              }
                            </div>
                            {this.props.showActions ?
                              <div className="actions">
                                <Button
                                  content={formatMessage(messages.edit)}
                                  className="button--blue"
                                  onClick={this.onEditClick.bind(this, item)}
                                />
                                <Button
                                  content={formatMessage(messages.delete)}
                                  className="button--gray-text"
                                  onClick={this.onDeleteClick.bind(this, item)}
                                />
                              </div>
                              : null
                            }
                          </TableCell>
                        );
                      })}
                      {showTrailingLoader && idx === rows.length - 1 &&
                        <TableCell className="item">
                          <Loader active />
                        </TableCell>
                      }
                    </TableRow>
                  ))
                  : this.renderEmptyRow()
                )
              }
              {(loading || (showTrailingLoader && rows.length === 0)) &&
                <TableRow>
                  <TableCell className="item">
                    <Loader active />
                  </TableCell>
                </TableRow>
              }
            </TableBody>

          </Table>
        </div>
        <div className="top-detail bottom">
          <div className="pagination-container">
            <Pagination
              activePage={activePageGridTable}
              onPageChange={this.handlePaginationChange}
              totalPages={totalPagesGridTable}
            />
          </div>
        </div>
        <ConfirmationModal
          onApprove={() => this.onOkDelete()}
          onCancel={() => this.closeConfirm()}
          isOpen={this.state.confirmDeleteOpen}
        >
          {formatMessage(messages.confirmDeleteMessage)}
        </ConfirmationModal>
        {this.renderLoading()}
      </div>
    );
  }
}

GridTable.propTypes = {
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  rowsPerPage: PropTypes.number,
  showActions: PropTypes.bool,
  data: PropTypes.object,
  tableProps: PropTypes.shape({
    sortable: PropTypes.bool,
    compact: PropTypes.bool,
    basic: PropTypes.string,
    size: PropTypes.string
  }),
  marketplace: PropTypes.shape({
    activePageGridTable: PropTypes.number,
    totalPagesGridTable: PropTypes.number,
    gridTableDataFiltered: PropTypes.array
  }),
  gridTableActions: PropTypes.shape({
    setPaginationGridTable: PropTypes.func,
    setActivePageGridTable: PropTypes.func,
    sortGridTableBy: PropTypes.func,
  }),
  listingActions: PropTypes.shape({
    deleteListing: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  showTrailingLoader: PropTypes.bool,
  currency: PropTypes.string,
  loading: PropTypes.bool
};

GridTable.defaultProps = {
  intl: {},
  marketplace: {},
  tableProps: {},
  data: {},
  rowsPerPage: 3 * 6,
  showActions: false,
  sortBy: '',
  sortDirection: '',
  gridTableActions: {},
  showTrailingLoader: false,
  currency: null,
  loading: false
};

export default connect(
  state => ({
    listing: state.default.listing,
    marketplace: state.default.marketplace
  }),
  (dispatch) => ({
    gridTableActions: bindActionCreators({
      setPaginationGridTable,
      setActivePageGridTable,
      sortGridTableBy
    }, dispatch),
    listingActions: bindActionCreators({
      deleteListing,
      removeFromFavorites
    }, dispatch)
  })
)(injectIntl(withRouter(GridTable)));
