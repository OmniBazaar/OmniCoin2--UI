import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import _ from 'lodash';
import GridTable from '../GridTable/GridTable';


class TabsData extends Component {
  constructor(props) {
    super(props);

    const { location } = props;
    const query = queryString.parse(location.search);
    this.state = {
      activeIndex: query.tabIndex
    };
  }
  
  renderPanes() {
    const {
      data, tabs, showActions, showTrailingLoader, currency, loading,
      showNoDataMessageOnEmpty
    } = this.props;
    const rowsPerPage = 3 * 6;

    return (
      tabs.map((tab) => (
        {
          menuItem: tab.title,
          render: () => (
            <Tab.Pane>
              <GridTable
                data={data}
                showNoDataMessageOnEmpty={showNoDataMessageOnEmpty}
                currency={currency}
                sortBy={tab.sortBy}
                sortDirection={tab.sortDirection}
                rowsPerPage={rowsPerPage}
                showActions={showActions}
                showTrailingLoader={showTrailingLoader}
                tableProps={{
                  sortable: false,
                  compact: true,
                  basic: 'very',
                  size: 'small'
                }}
                loading={loading}
              />
            </Tab.Pane>
          )
        }
      ))
    );
  }

  onTabChange = (event, data) => {
    const { location } = this.props;
    const query = queryString.parse(location.search);
    query.tabIndex = data.activeIndex;

    const strs = Object.keys(query).map(key => `${key}=${query[key]}`);
    this.props.history.push({
      pathname: location.pathname,
      search: `?${strs.join('&')}`
    });

    this.setState({ activeIndex: data.activeIndex });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Tab
        className="tabs"
        menu={{ secondary: true, pointing: true }}
        panes={this.renderPanes()}
        activeIndex={activeIndex}
        onTabChange={this.onTabChange}
      />
    );
  }
}

TabsData.propTypes = {
  data: PropTypes.object,
  tabs: PropTypes.arrayOf(PropTypes.object),
  showActions: PropTypes.bool,
  showTrailingLoader: PropTypes.bool,
  loading: PropTypes.bool
};

TabsData.defaultProps = {
  data: {},
  tabs: [],
  showActions: false,
  showTrailingLoader: false,
  loading: false
};

export default connect(
  null,
  (dispatch) => ({
    tabsDataActions: bindActionCreators({
    }, dispatch),
  })
)(injectIntl(withRouter(TabsData)));
