const express = require('express');
const router = express.Router();
const axios = require('axios');
const appCredentials = require('../credentials.json');

/* API */
router.get('/subreddits/:token', async (req, res) => {
  const token = req.params.token;

  try {
    let subreddits = [];
    let after = null;

    do {
      let url = 'https://oauth.reddit.com/subreddits/mine/subscriber';
      if (after) {
        url += `?after=${after}`;
      }

      console.log(`Request: ${url}`);
      let response = await axios.get(url, {
        headers: {
          'User-Agent': appCredentials['user-agent'],
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Got Reddit response:');
      console.log(response);

      if (response.data.kind.toLowerCase() !== 'listing') {
        console.error('Returned page is not of kind Listing: ', response.data);
        res.status(500);
        res.send('Invalid page');
        return;
      }
      subreddits = subreddits.concat(response.data.data.children);
      after = response.data.data.after;
    } while (after);

    res.send(subreddits);
  } catch (e) {
    console.error('Exception on Reddit:');
    console.log(e);

    res.status(500);
    res.send(e);
  }
});

module.exports = router;
