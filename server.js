import express from 'express';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import axios from "axios";
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import { StaticRouter as Router } from 'react-router-dom'
import App from './App';
import theme from './theme';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers'

function renderFullPage(html, css, preloadedState) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>My page</title>
        <style id="jss-server-side">${css}</style>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <!-- Fonts to support Material Design -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      </head>
      <body>
        <script async src="build/bundle.js"></script>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
    /</g,
    '\\u003c'
  )}
        </script>
      </body>
    </html>
  `;
}

function handleRender(req, res) {
  const store = createStore(reducers)

  const context = {};
  const sheets = new ServerStyleSheets();

  // Render the component to a string.
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Router location={req.url} context={context}>
            <App />
          </Router>
        </ThemeProvider>
      </Provider>,
    ),
  );

  // Grab the CSS from our sheets.
  const css = sheets.toString();

  // Grab the initial state from our Redux store
  const preloadedState = store.getState()

  // Send the rendered page back to the client.
  res.send(renderFullPage(html, css, preloadedState));
}

function getAccessToken(authCode, req, res) {
  var payload = {
    grant_type: 'authorization_code',
    code: authCode
  }

  callTokenEndpoint(payload, req, res);
}

function refreshToken(req, res) {
  var now = new Date();
  if (now < Date.parse(req.cookies.expiryDate)) {
    handleRender(req, res);
  } else {
    var payload = {
      grant_type: 'refresh_token',
      refresh_token: req.cookies.refreshToken
    }
    callTokenEndpoint(payload, req, res);
  }
}

function callTokenEndpoint(payload, req, res) {
  var headers = {
    'Authorization': 'Basic Y2xpZW50OnNlY3JldA=='
  }

  axios.post('http://localhost:9180/oauth/token', querystring.stringify(payload), {
    headers: headers
  }).then(response => {
    res.cookie('accessToken', response.data.access_token);
    res.cookie('refreshToken', response.data.refresh_token);
    var expiresIn = response.data.expires_in;
    var expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + parseInt(expiresIn) - 30); // 30 is the session timeout
    res.cookie('expiryDate', expiryDate);

    handleRender(req, res);
  }).catch(error => {
    res.redirect("/");
  });
}

const app = express();

app.use(cookieParser());

app.use('/build', express.static('build'));

app.use(function (req, res, next) { // Redirect from Auth new Token
  if (req.path == '/dashboard' && req.query.code) {
    getAccessToken(req.query.code, req, res);
  } else if (req.path == '/') { // Root Page No auth needed
    handleRender(req, res);
  } else { // Authenticated pages check for token and refresh
    if (req.cookies.accessToken && req.cookies.expiryDate) {
      refreshToken(req, res);
    } else {
      res.redirect("/");
    }
  }
});

const port = 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on ${port}`);
});