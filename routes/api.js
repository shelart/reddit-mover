const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const qs = require('qs');

/* API */
router.post('/login', (req, res) => {
  const expiry = new Date();

  const reqCredentials = {
    login: req.body.login,
    password: req.body.password,
  };

  const appCredentials = JSON.parse(fs.readFileSync('credentials.json'));

  axios.post('https://www.reddit.com/api/v1/access_token', qs.stringify({
    grant_type: 'client_credentials',
    username: reqCredentials.login,
    password: reqCredentials.password,
  }), {
    auth: {
      username: appCredentials['client-id'],
      password: appCredentials['client-secret'],
    },
  }).then(response => {
    console.log('Got Reddit response:');
    console.log(response.headers);
    console.log(response.data);

    expiry.setSeconds(expiry.getSeconds() + response.data.expires_in);
    res.send({
      token: response.data.access_token,
      expiry: expiry.getTime(),
    });
  }).catch(e => {
    console.error('Exception on Reddit:');
    console.log(e);

    res.error();
  });
});

module.exports = router;
