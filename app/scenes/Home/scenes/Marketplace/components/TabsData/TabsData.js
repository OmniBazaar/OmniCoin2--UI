import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import GridTable from '../GridTable/GridTable';

class TabsData extends Component {
  renderPanes() {
    const { data, tabs } = this.props;
    const rowsPerPage = 3 * 6;

    return (
      tabs.map((tab) => (
        {
          menuItem: tab.title,
          render: () => (
            <Tab.Pane>
              <GridTable
                data={data}
                sortBy={tab.sortBy}
                sortDirection={tab.sortDirection}
                rowsPerPage={rowsPerPage}
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
  data: PropTypes.arrayOf(PropTypes.object),
  tabs: PropTypes.arrayOf(PropTypes.object),
};

TabsData.defaultProps = {
  data: [],
  tabs: [],
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    tabsDataActions: bindActionCreators({
    }, dispatch),
  })
)(injectIntl(TabsData));
