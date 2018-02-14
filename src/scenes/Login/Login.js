import React, {Component} from 'react';
import {connect} from 'react-redux';

import Background from '../../components/Background/Background';
import LoginForm from './components/LoginForm';
import './login.scss';

class Login extends Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthorized) {
            this.props.history.push('/');
        }
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
    state => {
        return {...state.default}
    }
)(Login);