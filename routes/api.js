const express = require('express');
const router = express.Router();
const axios = require('axios');
const appCredentials = require('../credentials.json');

/* API */
router.get('/subreddits/:token', (req, res) => {
  const token = req.params.token;

  axios.get('https://oauth.reddit.com/subreddits/mine/subscriber', {
    headers: {
      'User-Agent': appCredentials['user-agent'],
      'Authorization': `Bearer ${token}`,
    },
  }).then(response => {
    console.log('Got Reddit response:');
    console.log(response);

    res.send(response.data);
  }).catch(e => {
    console.error('Exception on Reddit:');
    console.log(e);

    res.error();
  });
});

module.exports = router;
