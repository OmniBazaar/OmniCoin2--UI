import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import hash from 'object-hash';
import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Pagination,
  Icon,
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';

import {
  setActivePageFeature,
  setPaginationFeature,
} from '../../../../../../services/marketplace/marketplaceActions';

import '../../marketplace.scss';
import '../CategoryListing/listings.scss';
import './table.scss';

const iconSizeSmall = 12;

const messages = defineMessages({
  firstItem: {
    id: 'Settings.firstItem',
    defaultMessage: 'First item'
  },
  lastItem: {
    id: 'Settings.lastItem',
    defaultMessage: 'Last item'
  },
  previousItem: {
    id: 'Settings.previousItem',
    defaultMessage: 'Previous item'
  },
  nextItem: {
    id: 'Settings.nextItem',
    defaultMessage: 'Next item'
  },
  first: {
    id: 'Settings.first',
    defaultMessage: 'First'
  },
  last: {
    id: 'Settings.last',
    defaultMessage: 'Last'
  },
  prev: {
    id: 'Settings.prev',
    defaultMessage: 'Prev'
  },
  next: {
    id: 'Settings.next',
    defaultMessage: 'Next'
  },
});

class CategoryListing extends Component {
  componentDidMount() {
    this.props.marketplaceActions.setPaginationFeature(this.props.rowsPerPage);
  }

  onClickItem() {
    console.log('');
  }

  handlePaginationChange = (e, { activePage }) => {
    this.props.marketplaceActions.setActivePageFeature(activePage);
  };

  render() {
    const { props } = this;
    let { categoryData } = props;
    const { formatMessage } = this.props.intl;
    const {
      activePageFeature,
      totalPagesFeature
    } = this.props.marketplace;
    const rows = _.chunk(categoryData, 6);

    return (
      <div className="data-table">
        <div className="table-container">
          <Table {...this.props.tableProps}>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={hash(row)} className="items">
                    {row.map(item => {
                      const style = { backgroundImage: `url(${item.image})` };
                      let { description } = item;
                      description = description.length > 55 ? `${description.substring(0, 55)}...` : description;
                      return (
                        <TableCell className="item" key={hash(item)}>
                          <div
                            className="img-wrapper"
                            style={style}
                            onClick={this.onClickItem}
                            onKeyDown={this.onClickItem}
                            tabIndex={0}
                            role="link"
                          />
                          <span
                            className="title"
                            onClick={this.onClickItem}
                            role="link"
                            onKeyDown={this.onClickItem}
                            tabIndex={0}
                          >
                            {item.id} - {item.title}
                          </span>
                          <span className="subtitle">
                            {item.category}
                            <span>
                              <Icon name="long arrow right" width={iconSizeSmall} height={iconSizeSmall} />
                            </span>
                            {item.subCategory}
                          </span>
                          <span className="description">{description}</span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="top-detail bottom">
          <div className="pagination-container">
            <Pagination
              activePage={activePageFeature}
              boundaryRange={1}
              onPageChange={this.handlePaginationChange}
              size="mini"
              siblingRange={1}
              totalPages={totalPagesFeature}
              firstItem={{ ariaLabel: formatMessage(messages.firstItem), content: `<< ${formatMessage(messages.first)}` }}
              lastItem={{ ariaLabel: formatMessage(messages.lastItem), content: `${formatMessage(messages.last)} >>` }}
              prevItem={{ ariaLabel: formatMessage(messages.previousItem), content: `< ${formatMessage(messages.prev)}` }}
              nextItem={{ ariaLabel: formatMessage(messages.nextItem), content: `${formatMessage(messages.next)} >` }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    marketplaceActions: bindActionCreators({
      setActivePageFeature,
      setPaginationFeature,
    }, dispatch),
  }),
)(injectIntl(CategoryListing));

