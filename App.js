import React from 'react'
import Home from './components/Home';
import About from './components/About';
import { Route } from 'react-router-dom'

export default function App() {
    return (
        <div align="center">
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
        </div>
    );
}