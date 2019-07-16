import React from 'react'
import Register from './Register'
import About from './About'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        typeof window !== 'undefined' ?
            localStorage.getItem("TOKEN") !== null
                ? <Component {...props} />
                : window.location.href = 'https://example.com/1234'
            : <Component {...props} />
    )} />
)

class App extends React.Component {
    render() {
        if (typeof window !== 'undefined') {
            localStorage.setItem("TOKEN", "abcd")
        }
        return (
            <div align="center">
                <Route exact path="/" component={Register} />
                <PrivateRoute path="/about" component={About} />
            </div>
        );
    }
}

export default App