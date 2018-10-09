import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon, Loader } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import Menu from '../../../../../Marketplace/scenes/Menu/Menu';
import ListingForm from './ListingForm';
import messages from './messages';
import { getListingDetail } from '../../../../../../../../services/listing/listingActions'
import './add-listing.scss';

const iconSize = 42;

class EditListing extends Component {
  componentWillMount() {
    this.props.listingActions.getListingDetail(this.props.match.params.id);
  }

  renderForm() {
    const { formatMessage } = this.props.intl;
    const { listingDetail } = this.props;
    return (
      <div>
        { listingDetail ?
          <ListingForm editingListing={listingDetail} />
          : <div className='not-found'>
              {formatMessage(messages.listingNotFound)}
            </div>
        }
      </div>
    );
  }

  render() {
    const { listingDetailRequest } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className="marketplace-container category-listing add-listing" style={{ position: 'relative' }}>
        <div className="header">
          <Menu />
        </div>
        <div className="body">
          <div className="top-header">
            <div className="content">
              <div className="category-title">
                <div className="parent">
                  <NavLink to="/listings">{formatMessage(messages.myListings)}</NavLink>
                  <Icon name="long arrow right" width={iconSize} height={iconSize} />
                </div>
                <span className="child">{formatMessage(messages.editListing)}</span>
              </div>
            </div>
          </div>
          <div className="listing-body">
            {
              listingDetailRequest.loading ?
                <div className="loader-container">
                  <Loader active inline>{formatMessage(messages.loadListing)}</Loader>
                </div> :
              this.renderForm()
            }
          </div>
        </div>
      </div>
    )
  }
}

EditListing.propTypes = {
  listingActions: PropTypes.shape({
    getListingDetail: PropTypes.func
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  myListings: PropTypes.arrayOf(PropTypes.object),
  listingDetail: PropTypes.object,
  listingDetailRequest: PropTypes.object,
};

export default connect(
  (state) => ({
    myListings: state.default.listing.myListings,
    listingDetail: state.default.listing.listingDetail,
    listingDetailRequest: state.default.listing.listingDetailRequest,
  }),
  (dispatch) => ({
    listingActions: bindActionCreators({
      getListingDetail
    }, dispatch),
  }))(injectIntl(EditListing));
