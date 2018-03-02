import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Button, Form, Divider } from 'semantic-ui-react'
import {required} from 'redux-form-validators';
import {toastr} from 'react-redux-toastr'
import cn from 'classnames';
import {key} from "omnibazaarjs/es";
import { withRouter } from 'react-router-dom';


import { signup } from  '../../../../services/blockchain/auth/authActions';

import ClipboardButton from "react-clipboard.js";
import ValidatableField from '../../../../components/ValidatableField/ValidatableField';
import './signup-form.scss';

class SignupForm extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    state = {
        isLoading: false
    };

    componentWillMount() {
        this.props.initialize({
            password: ("P" + key.get_random_key().toWif()).substr(0, 45)
        });
    }

    signIn() {
        this.props.history.push('/login');
    }

    submit(values) {

    }

    renderPasswordGenerator = ({input,  meta: {touched, error, warning}}) => {
        return (
            <div className="password-gen">
                <input
                    {...input}
                    type="text"
                />
                <ClipboardButton
                    className="button"
                    data-clipboard-text={input.value}
                    data-place="right"
                    onClick={() => toastr.success("Copy", "Password copied!")}
                >
                   Copy
                </ClipboardButton>
            </div>
        );
    };
    render() {
        const {handleSubmit, valid, auth} = this.props;
        return (
            <Form
                onSubmit={handleSubmit(this.submit)}
                className="signup"
            >
                <Field
                    type="text"
                    name="username"
                    placeholder="Account name"
                    component={ValidatableField}
                    validate={[required({message: "This field is required"})]}
                />
                <Field
                    type="text"
                    name="password"
                    component={this.renderPasswordGenerator}
                    validate={[required({message: "This field is required"})]}
                />
                <Field
                    type="password"
                    placeholder="Confirm password"
                    name="passwordConfirmation"
                    validate={[required({message: "This field is required"})]}
                    component="input"
                />
                <Field
                    type="text"
                    placeholder="Start typing referrer name"
                    name="referrer"
                    component="input"
                />
                <div className="agreement-terms">
                    <Field
                        type="checkbox"
                        name="agreementTerms"
                        component="input"
                    />
                    <span>I agree with </span>
                    <a href="#">Terms & Conditions</a>
                </div>
                <Button
                    content="Sign up"
                    disabled={!valid || this.state.isLoading}
                    color="green"
                    type="submit"
                />
                <Divider fitted/>
                <div className="question">
                    <h3>Already have an account?</h3>
                </div>
                <Button
                    content="Sign in"
                    disabled={this.state.isLoading}
                    color="blue"
                    onClick={this.signIn}
                />
            </Form>
        );
    }
}

SignupForm = withRouter(SignupForm);

SignupForm = reduxForm({
    form: 'signupForm',
    destroyOnUnmount: true,
})(SignupForm);

export default connect(
    (state) => {
        return {...state.default}
    },
    (dispatch) => ({
        authActions: bindActionCreators({signup}, dispatch),
    })
)(SignupForm);