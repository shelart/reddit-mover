const express = require('express');
const router = express.Router();
const qs = require('qs');
const crypto = require('crypto');
const path = require('path');
const appCredentials = require('../credentials.json');

/* In-memory map of pending authentication requests. */
const loginFlows = {};

/* To be called by 'Sign In' button, returns an URI to redirect the browser to. */
router.post('/init', (req, res) => {
  const flowId = crypto.randomBytes(20).toString('hex');
  res.send({
    'redirect_url': 'https://www.reddit.com/api/v1/authorize?' + qs.stringify({
      'response_type': 'token',
      'client_id': appCredentials['client-id'],
      'state': flowId,
      'redirect_uri': 'http://localhost:3000/api/login/callback',
      'scope': 'mysubreddits',
    }),
    'flow_id': flowId,
  });
  loginFlows[flowId] = 'init';
});

/* Here the browser will be redirected by Reddit after granted access, returns an URI to redirect the browser to. */
router.get('/callback', (req, res) => {
  const resolvedPath = path.dirname(__dirname) + path.sep + 'views' + path.sep + 'login-callback-process.html';
  res.sendFile(resolvedPath);
});

/* To be called by JS webpage handler to which the browser was redirected after granted access. */
router.get('/complete', (req, res) => {
  const flowId = req.query.state;
  if (!flowId) {
    res.send('No flow ID. Check URI string in the address bar to find out the error.');
    return;
  }
  if (!loginFlows[flowId]) {
    res.send('Flow has already been completed or was never initiated at all.');
    return;
  }

  const expiry = new Date();
  expiry.setSeconds(expiry.getSeconds() + parseInt(req.query.expires_in, 10));
  loginFlows[flowId] = {
    token: req.query.access_token,
    expiry: expiry.getTime(),
  };

  const resolvedPath = path.dirname(__dirname) + path.sep + 'views' + path.sep + 'login-callback-ok.html';
  res.sendFile(resolvedPath);
});

/* To be polled by the client after the browser opened the Reddit grant webpage whose URL was obtained via /init. */
router.get('/monitor/:flowId', (req, res) => {
  const flowId = req.params.flowId;
  if (!loginFlows[flowId]) {
    res.status(403);
    res.send('Flow has already been completed or was never initiated at all.');
    return;
  }

  if (loginFlows[flowId] === 'init') {
    res.status(202);
    res.send('Awaiting flow to complete...');
  } else {
    res.send(loginFlows[flowId]);
    delete loginFlows[flowId];
  }
});

module.exports = router;
