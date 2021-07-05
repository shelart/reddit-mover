const express = require('express');
const router = express.Router();
const axios = require('axios');
const getWithRetry = require('../src/axios-retry-wrapper');
const appCredentials = require('../credentials.json');
const listing = require('./listing');

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

  const listingId = listing.invoke(
    'https://oauth.reddit.com/subreddits/mine/subscriber', appCredentials['user-agent'], token,
    subreddits => {
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
      return subreddits;
    }
  );
  res.send(listingId);
});

router.get('/listing/:id', async (req, res) => {
  const listingId = req.params.id;
  const result = listing.pull(listingId);
  if (typeof result === typeof undefined) {
    res.status(500);
    res.send('Invalid listing process ID');
    return;
  }

  res.send(result);
});

module.exports = router;
