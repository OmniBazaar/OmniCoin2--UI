/**
 * Created by denissamohvalov on 14.02.18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import BtnLock from '../../assets/images/common/btn-lock-norm+pres.svg';
import Background from '../../components/Background/Background';
import './login.scss';
import { login } from '../../services/auth/actions';

class Login extends Component {
    // static propTypes = {
    //     accountKey: string
    // };

    static defaultProps = {
        username: "denis12343"
    };

    render() {
        const {loginActions, username} = this.props;
        return (
            <Background>
                <div className="signup-container">
                    <img src={BtnLock} height={50} width={50}></img>
                    <span>{username}</span>
                    <div className="password">
                        <input className="form-control" placeholder="Enter password"></input>
                        <button className="btn btn-success" onClick={() => loginActions.login(username, 'password')}>UNLOCK</button>
                    </div>
                </div>
            </Background>
        )
    }
}

export default connect(
    state => {
        return {...state.default}
    },
    (dispatch) => ({
        loginActions: bindActionCreators({login}, dispatch),
    }),
)(Login);