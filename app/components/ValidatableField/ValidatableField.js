import React, {Component} from 'react';

const Field = ({ input, placeholder, type, meta: { asyncValidating, touched, error, warning } }) => (
    [
        <div>
            {touched && ((error && <span className="error">{error}</span>) || (warning && <span className="warning">{warning}</span>))}
        </div>,
        <input {...input} placeholder={placeholder} type={type}/>
    ]
);

export default Field;
