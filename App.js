import React from 'react'
import Register from './Register'
import Dashboard from './Dashboard'
import { Route } from 'react-router-dom'

class App extends React.Component {
    render() {
        return (
            <div align="center">
                <Route exact path="/" component={Register} />
                <Route path="/dashboard" component={Dashboard} />
            </div>
        );
    }
}

export default App