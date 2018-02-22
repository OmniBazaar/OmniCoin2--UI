import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Button, Input, Form, Container, Image } from 'semantic-ui-react'

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
           <Form onSubmit={handleSubmit(this.submit)} className="signup-container">
               <Image src={BtnLock} width={50} height={50}/>
               <span>{username}</span>
               <div className="password-block">
                       <Field
                           type="password"
                           name="password"
                           placeholder="Enter password"
                           component="input"
                       />
                   <Button content="UNLOCK" color="green" type="submit"/>
               </div>
           </Form>
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