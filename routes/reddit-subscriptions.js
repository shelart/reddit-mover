const express = require('express');
const router = express.Router();
const qs = require('qs');
const appCredentials = require('../app-credentials.json');
const axios = require('axios');

router.post('/subscribe/:token/:ids', async (req, res) => {
  const token = req.params.token;
  const ids = req.params.ids;

  try {
    let response = await axios.post('https://oauth.reddit.com/api/subscribe', qs.stringify({
      action: 'sub',
      skip_initial_defaults: true,
      sr: ids,
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
