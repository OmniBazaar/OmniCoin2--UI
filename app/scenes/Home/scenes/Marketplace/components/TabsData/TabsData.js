import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import GridTable from '../GridTable/GridTable';

class TabsData extends Component {
  renderPanes() {
    const { data, tabs, showActions, showTrailingLoader, currency } = this.props;
    const rowsPerPage = 3 * 6;

    return (
      tabs.map((tab) => (
        {
          menuItem: tab.title,
          render: () => (
            <Tab.Pane>
              <GridTable
                data={data}
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
              />
            </Tab.Pane>
          )
        }
      ))
    );
  }

  render() {
    return (
      <Tab
        className="tabs"
        menu={{ secondary: true, pointing: true }}
        panes={this.renderPanes()}
      />
    );
  }
}

TabsData.propTypes = {
  data: PropTypes.object,
  tabs: PropTypes.arrayOf(PropTypes.object),
  showActions: PropTypes.bool,
  showTrailingLoader: PropTypes.bool
};

TabsData.defaultProps = {
  data: {},
  tabs: [],
  showActions: false,
  showTrailingLoader: false,
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    tabsDataActions: bindActionCreators({
    }, dispatch),
  })
)(injectIntl(TabsData));
