import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Icon, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class UpdateNotification extends Component {

}

UpdateNotification.propTypes = {

};

export default connect(state => ({ ...state.default }))(UpdateNotification);
