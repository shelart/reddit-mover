const express = require('express');
const router = express.Router();
const axios = require('axios');
const getWithRetry = require('../src/axios-retry-wrapper');
const appCredentials = require('../credentials.json');

/* API */
router.get('/username/:token', async (req, res) => {
  const token = req.params.token;

  try {
    let url = 'https://oauth.reddit.com/api/v1/me';

    let response = await getWithRetry(url, {
      headers: {
        'User-Agent': appCredentials['user-agent'],
        'Authorization': `Bearer ${token}`,
      },
    });

    res.send(response.data.name);
  } catch (e) {
    console.error('Exception on Reddit:');
    console.log(e);

    res.status(500);
    res.send(e);
  }
});

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
      // Return URL by subreddit.data.community_icon or subreddit.data.icon_img
      let imageUrl;
      if (subreddit.data.community_icon) {
        imageUrl = subreddit.data.community_icon;
      } else if (subreddit.data.icon_img) {
        imageUrl = subreddit.data.icon_img;
      }
      if (imageUrl) {
        subreddit.image = imageUrl.substring(0, imageUrl.indexOf('?'));
      }
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
