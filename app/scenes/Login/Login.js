import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {  getCurrentUser } from  '../../services/blockchain/auth/authActions';
import Background from '../../components/Background/Background';
import LoginForm from './components/LoginForm';
import './login.scss';

class Login extends Component {

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.auth.currentUser) {
            this.props.history.push('/');
        }
    }

    componentWillMount() {
        this.props.authActions.getCurrentUser();
    }

    render() {
        return (
            <Background>
                <LoginForm/>
            </Background>
        )
    }
}

export default connect(
    (state) => {
        return {...state.default}
    },
    (dispatch) => ({
        authActions: bindActionCreators({ getCurrentUser }, dispatch),
    }),
)(Login);