import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
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
  Modal,
  Dimmer,
  Loader
} from 'semantic-ui-react';
import hash from 'object-hash';
import './grid-table.scss';

import Pagination from '../../../../../../components/Pagination/Pagination';

import {
  setPaginationGridTable,
  setActivePageGridTable,
  sortGridTableBy
} from '../../../../../../services/marketplace/marketplaceActions';
import {
  deleteListing
} from '../../../../../../services/listing/listingActions';

import { numberWithCommas } from '../../../../../../utils/numeric';
import messages from './messages';

const iconSizeSmall = 12;

class GridTable extends Component {
  state = {
    confirmDeleteOpen: false
  }

  componentDidMount() {
    this.props.gridTableActions.sortGridTableBy(
      this.props.data,
      this.props.sortBy,
      this.props.sortDirection
    );
    this.props.gridTableActions.setPaginationGridTable(this.props.rowsPerPage);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data ||
        this.props.sortBy !== nextProps.sortBy ||
        this.props.sortDirection !== nextProps.sortDirection) {
      this.props.gridTableActions.sortGridTableBy(
        nextProps.data,
        nextProps.sortBy,
        nextProps.sortDirection
      );
      this.props.gridTableActions.setPaginationGridTable(this.props.rowsPerPage);
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
    history.push(`/edit-listing/${item.id}`);
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
      this.props.listingActions.deleteListing(this.item);
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

  renderLoading() {
    const { deleting } = this.props.listing.deleteListing;
    return (
      <Dimmer active={deleting} inverted>
        <Loader size='medium'></Loader>
      </Dimmer>
    );
  }

  renderConfirmDialog() {
    const { formatMessage } = this.props.intl;

    return (
      <Modal size="mini"
        open={this.state.confirmDeleteOpen}
        onClose={this.closeConfirm.bind(this)}>
        <Modal.Header>
          {formatMessage(messages.confirmDeleteTitle)}
        </Modal.Header>
        <Modal.Content>
          <p className="modal-content">
            {formatMessage(messages.confirmDeleteMessage)}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='grey' onClick={this.closeConfirm.bind(this)}>
            {formatMessage(messages.cancel)}
          </Button>
          <Button color='red' onClick={this.onOkDelete.bind(this)}>
            {formatMessage(messages.ok)}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    const {
      activePageGridTable,
      totalPagesGridTable,
      gridTableDataFiltered
    } = this.props.marketplace;
    const rows = _.chunk(gridTableDataFiltered, 6);
    const { formatMessage } = this.props.intl;

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableBody>
              {rows.length > 0 ? rows.map(row =>
                (
                  <TableRow key={hash(row)} className="items">
                    {row.map(item => {
                      const image = `http://${item.ip}/publisher-images/${item.images ? item.images[0].thumb : ''}`; //todo
                      const style = { backgroundImage: `url(${image})` };
                      let { description } = item;
                      description = description.length > 55 ? `${description.substring(0, 55)}...` : description;
                      return (
                        <TableCell className="item" key={hash(item)}>
                          <Link to={`listing/${item['listing_id']}`}>
                            <div className="img-wrapper" style={style} />
                          </Link>

                          <Link to={`listing/${item['listing_id']}`}>
                            <span className="title">{item['listing_title']}</span>
                          </Link>

                          <span className="subtitle">
                            {item.category}
                            <span>
                              <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                            </span>
                            {item.subCategory}
                          </span>
                          <span className="description">{description}</span>
                          <span className="price">$ {numberWithCommas(parseFloat(item.price))}</span>
                          {this.props.showActions ?
                            <div className="actions">
                              <Button
                                content={formatMessage(messages.edit)}
                                className="button--blue"
                                onClick={this.onEditClick.bind(this, item)} />
                              <Button
                                content={formatMessage(messages.delete)}
                                className="button--gray-text"
                                onClick={this.onDeleteClick.bind(this, item)} />
                            </div>
                            : null
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
                : this.renderEmptyRow()
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

        {this.renderConfirmDialog()}
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
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    gridTableActions: bindActionCreators({
      setPaginationGridTable,
      setActivePageGridTable,
      sortGridTableBy
    }, dispatch),
    listingActions: bindActionCreators({
      deleteListing
    }, dispatch)
  }),
)(injectIntl(withRouter(GridTable)));
