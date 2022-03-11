const express = require('express');
const router = express.Router();
const axios = require('axios');
const getWithRetry = require('../src/axios-retry-wrapper');
const appCredentials = require('../app-credentials.json');
const listing = require('./listing');

const userNameForToken = {};

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
    userNameForToken[token] = response.data.name;
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

router.get('/savedPosts/:token', async (req, res) => {
  const token = req.params.token;

  const listingId = listing.invoke(
    `https://oauth.reddit.com/user/${userNameForToken[token]}/saved`, appCredentials['user-agent'], token,
    savedThings => savedThings
      // Filter out non-posts
      .filter(thing => thing.kind === 't3')
      // Process saved posts
      .map(post => {
        // Convert creation date/time to a human-readable string.
        post.created_human_readable = new Date(post.data.created_utc * 1000).toLocaleString();

        // Process post text (if any) into HTML.
        if (post.data.selftext) {
           post.selftext_processed = post.data.selftext
              .split('\n')
              .map(paragraph => `<p>${paragraph}</p>`)
              .join('\n');
        }

        // Prepare URL of the preview image (if any).
        let imageUrl;
        let preview, images, firstImage, imageResolutions;
        if (
            (preview = post.data.preview)
            && (images = preview.images)
            && (firstImage = images[0])
            && (imageResolutions = firstImage.resolutions)
            && imageResolutions.length
        ) {
          // Find an image variant with the lowest resolution.
          const idxOfMin = imageResolutions
              .map(data => data.height * data.width)
              .reduce((idxOfMin, size, idx, sizesArr) => size > sizesArr[idxOfMin] ? idx : idxOfMin, 0);
          imageUrl = imageResolutions[idxOfMin].url.replace(/&amp;/g, '&');
        }
        if (imageUrl) {
          post.image = imageUrl;
        }

        return post;
      })
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
