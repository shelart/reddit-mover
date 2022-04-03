const express = require('express');
const router = express.Router();
const qs = require('qs');
const appCredentials = require('../app-credentials.json');
const axios = require('axios');

router.post('/save/:token/:id', async (req, res) => {
  const token = req.params.token;
  const id = req.params.id;

  try {
    let response = await axios.post('https://oauth.reddit.com/api/save', qs.stringify({
      id,
    }), {
      headers: {
        'User-Agent': appCredentials['user-agent'],
        'Authorization': `Bearer ${token}`,
      },
    });

    res.send(response.data);
  } catch (e) {
    res.status(500);
    console.error(e);
    res.send('Unexpected error occurred!');
  }
});

router.post('/unSave/:token/:id', async (req, res) => {
  const token = req.params.token;
  const id = req.params.id;

  try {
    let response = await axios.post('https://oauth.reddit.com/api/unsave', qs.stringify({
      id,
    }), {
      headers: {
        'User-Agent': appCredentials['user-agent'],
        'Authorization': `Bearer ${token}`,
      },
    });

    res.send(response.data);
  } catch (e) {
    res.status(500);
    console.error(e);
    res.send('Unexpected error occurred!');
  }
});

module.exports = router;
