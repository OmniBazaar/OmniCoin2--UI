import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './settings.scss';

class Settings extends Component {
  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  _publicData() {
    return (
      <div>Public Data</div>
    );
  }

  _privateData() {
    return (
      <div>Private Data</div>
    );
  }

  renderModal() {
    const { props } = this;

    return (
      <Modal size="large" open={props.menu.showSettings} onClose={this.close}>
        <Modal.Content>
          <div className="home-container">
            <div className="sidebar settings visible">Side Menu</div>
            <div className="home-content">
              <Tab
                className="tabs"
                menu={{ secondary: true, pointing: true }}
                panes={[
                 {
                   menuItem: 'Public Data',
                   render: () => <Tab.Pane>{this._publicData()}</Tab.Pane>,
                 },
                 {
                   menuItem: 'Private Data',
                   render: () => <Tab.Pane>{this._privateData()}</Tab.Pane>,
                 },
                ]}
              />
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    return this.renderModal();
  }
}

Settings.propTypes = {
  onClose: PropTypes.func,
};

Settings.defaultProps = {
  onClose: () => {},
};

export default connect(
  state => ({ ...state.default }),
  (dispatch) => ({
    menuActions: bindActionCreators({ }, dispatch),
  }),
)(Settings);
