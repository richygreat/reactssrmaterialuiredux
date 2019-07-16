import React from 'react'
import Register from './Register';
import About from './About';
import { Route } from 'react-router-dom'

export default function App() {
    return (
        <div align="center">
            <Route exact path="/" component={Register} />
            <Route path="/about" component={About} />
        </div>
    );
}