import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { login } from  '../../../services/auth/authActions';

import './login-form.scss';
import BtnLock from '../../../assets/images/common/btn-lock-norm+pres.svg';


class LoginForm extends Component {
    // static propTypes = {
    //     accountKey: string
    // };

    static defaultProps = {
        username: "denis12343"
    };

    submit = (values) => {
        const { password } = values;
        this.props.loginActions.login(this.props.username, password);
    };


   render() {
       const {handleSubmit, username} = this.props;
       return (
           <form onSubmit={handleSubmit(this.submit)} className="signup-container">
               <img src={BtnLock} height={50} width={50}/>
               <span>{username}</span>
               <div className="password-block">
                   <Field
                       type="password"
                       name="password"
                       className="form-control"
                       placeholder="Enter password"
                       component="input"
                   />
                   <button className="btn btn-success" type="submit">UNLOCK</button>
               </div>
           </form>
       )
   }
}

LoginForm = reduxForm({
    form: 'loginForm',
    destroyOnUnmount: true,
})(LoginForm);

export default connect(
    state => {
        return {...state.default}
    },
    (dispatch) => ({
        loginActions: bindActionCreators({login}, dispatch),
    }),
)(LoginForm);