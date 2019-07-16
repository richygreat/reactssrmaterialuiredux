const validate = values => {
    const errors = {}

    if (!values.username) {
        errors.username = 'Required'
    }
    if (!values.username) {
        errors.username = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
        errors.username = 'Invalid email address'
    }
    return errors
}

export default validate