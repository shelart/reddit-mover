const express = require('express');
const router = express.Router();
const axios = require('axios');
const getWithRetry = require('../src/axios-retry-wrapper');
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

      let response = await getWithRetry(url, {
        headers: {
          'User-Agent': appCredentials['user-agent'],
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.kind.toLowerCase() !== 'listing') {
        console.error('Returned page is not of kind Listing: ', response.data);
        res.status(500);
        res.send('Invalid page');
        return;
      }
      subreddits = subreddits.concat(response.data.data.children);
      after = response.data.data.after;
    } while (after);

    // Process subreddits: download their icons.
    subreddits.map(subreddit => {
      // TODO: download by subreddit.data.community_icon or subreddit.data.icon_img
      subreddit.image = "data:image/png;base64,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";
      return subreddit;
    });

    res.send(subreddits);
  } catch (e) {
    console.error('Exception on Reddit:');
    console.log(e);

    res.status(500);
    res.send(e);
  }
});

module.exports = router;
