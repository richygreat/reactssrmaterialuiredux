import React from 'react'
import { Typography } from '@material-ui/core'
import validate from "./validateRegister"
import renderField from './common'
import { reduxForm, Field } from 'redux-form'

class Register extends React.Component {
    render() {
        return (
            <div style={{ width: 300 }}>
                <Typography variant="h3">Register</Typography>
                <br />
                <Field
                    label="User Name"
                    name="username"
                    type="text"
                    helperText="Enter your Email Id"
                    component={renderField}
                />
            </div>
        );
    }
}

export default reduxForm({
    validate,
    form: 'registerForm',        // <------ same form name
    destroyOnUnmount: false,     // <------ preserve form data
})(Register)
