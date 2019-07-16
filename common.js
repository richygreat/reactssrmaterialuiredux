import React from "react"
import { TextField, FormHelperText, FormControl, InputLabel, Select } from "@material-ui/core"

export function renderField(field) {
    const {
        input,
        label,
        type,
        helperText,
        meta: { touched, error }
    } = field
    return (
        <TextField
            label={label}
            type={type}
            helperText={(touched && error) || (!error && helperText) || helperText}
            {...input}
            fullWidth={true}
            error={touched && error ? true : false}
        />
    )
}

export function renderFromHelper(field) {
    const {
        touched, error
    } = field
    if (!(touched && error)) {
        return
    } else {
        return <FormHelperText>{touched && error}</FormHelperText>
    }
}

export function renderSelectField(field) {
    const {
        input,
        label,
        meta: { touched, error },
        children,
        ...custom
    } = field
    return (
        <FormControl error={touched && error} style={{ width: "80%" }}>
            <InputLabel>{label}</InputLabel>
            <Select
                {...input}
                {...custom}
            >
                {children}
            </Select>
            {renderFromHelper({ touched, error })}
        </FormControl>
    )
}

export default renderField