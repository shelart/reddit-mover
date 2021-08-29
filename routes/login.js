const express = require('express');
const router = express.Router();
const qs = require('qs');
const crypto = require('crypto');
const path = require('path');
const appCredentials = require('../app-credentials.json');
const axios = require('axios');
const fs = require('fs');

const REDIRECT_URI = 'http://localhost:3000/api/login/callback';

/* In-memory map of pending authentication requests. */
const loginFlows = {};

/* To be called by 'Sign In' button, returns an URI to redirect the browser to. */
router.post('/init/:userNum', (req, res) => {
  const userNum = req.params.userNum;
  const flowId = crypto.randomBytes(20).toString('hex');
  res.send({
    'redirect_url': 'https://www.reddit.com/api/v1/authorize?' + qs.stringify({
      'response_type': 'code',
      'client_id': appCredentials['client-id'],
      'state': flowId,
      'redirect_uri': REDIRECT_URI,
      'scope': 'identity mysubreddits',
      'duration': 'permanent',
    }),
    'flow_id': flowId,
  });
  loginFlows[flowId] = {state: 'init', userNum};
});

/* Here the browser will be redirected by Reddit after granted access, returns an URI to redirect the browser to. */
router.get('/callback', async (req, res) => {
  let error = req.query.error;
  let code = req.query.code;
  let flowId = req.query.state;

  if (error) {
    res.status(500);
    res.send(error);
    return;
  }

  if (!code) {
    res.status(500);
    res.send('No Code provided, but no error reported.');
    return;
  }

  if (!flowId) {
    res.status(500);
    res.send('No flow ID. Check URI string in the address bar to find out the error.');
    return;
  }
  if (!loginFlows[flowId]) {
    res.status(500);
    res.send('Flow has already been completed or was never initiated at all.');
    return;
  }

  try {
    let response = await axios.post('https://www.reddit.com/api/v1/access_token', qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }), {
      headers: {
        'User-Agent': appCredentials['user-agent'],
      },
      auth: {
        username: appCredentials['client-id'],
        password: appCredentials['client-secret'],
      },
    });

    const tokenJSON = JSON.parse(JSON.stringify(response.data));
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + parseInt(tokenJSON.expires_in, 10));
    tokenJSON.expires_at = expiry.getTime();

    // Store the permanent credentials
    const userNum = loginFlows[flowId].userNum;
    const pathToCredFile = path.dirname(__dirname) + path.sep + `user-${userNum}-credentials.json`;
    fs.writeFileSync(pathToCredFile, JSON.stringify(tokenJSON));

    loginFlows[flowId].state = 'finished';
    loginFlows[flowId].token = tokenJSON;

    const resolvedPath = path.dirname(__dirname) + path.sep + 'views' + path.sep + 'login-callback-ok.html';
    res.sendFile(resolvedPath);
  } catch (e) {
    res.status(500);
    console.error(e);
    res.send('Unexpected error occurred!');
  }
});

/* To be polled by the client after the browser opened the Reddit grant webpage whose URL was obtained via /init. */
router.get('/monitor/:flowId', (req, res) => {
  const flowId = req.params.flowId;
  if (!loginFlows[flowId]) {
    res.status(403);
    res.send('Flow has already been completed or was never initiated at all.');
    return;
  }

  if (loginFlows[flowId].state === 'init') {
    res.status(202);
    res.send('Awaiting flow to complete...');
  } else {
    res.send(loginFlows[flowId].token);
    delete loginFlows[flowId];
  }
});

/* This will be called by the frontend page to refresh the expired token. */
router.get('/refresh/:userNum/:refreshToken', async (req, res) => {
  const userNum = req.params.userNum;
  const refreshToken = req.params.refreshToken;

  try {
    let response = await axios.post('https://www.reddit.com/api/v1/access_token', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }), {
      headers: {
        'User-Agent': appCredentials['user-agent'],
      },
      auth: {
        username: appCredentials['client-id'],
        password: appCredentials['client-secret'],
      },
    });

    const tokenJSON = JSON.parse(JSON.stringify(response.data));
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + parseInt(tokenJSON.expires_in, 10));
    tokenJSON.expires_at = expiry.getTime();

    // Store the permanent credentials
    const pathToCredFile = path.dirname(__dirname) + path.sep + `user-${userNum}-credentials.json`;
    fs.writeFileSync(pathToCredFile, JSON.stringify(tokenJSON));

    res.send(tokenJSON);
  } catch (e) {
    res.status(500);
    console.error(e);
    res.send('Unexpected error occurred!');
  }
});

module.exports = router;
