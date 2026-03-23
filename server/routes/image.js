const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const keywords = prompt
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .split(' ')
      .filter(w => w.length > 3)
      .slice(0, 4)
      .join(' ');

    // Try Unsplash API first
    if (process.env.UNSPLASH_ACCESS_KEY) {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: keywords,
          per_page: 5,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      });

      const results = response.data.results;
      if (results && results.length > 0) {
        const random = results[Math.floor(Math.random() * results.length)];
        return res.json({
          imageUrl: random.urls.regular,
          photographer: random.user.name,
          unsplashLink: random.links.html
        });
      }
    }

    // Fallback to Picsum
    const seed = keywords.replace(/\s+/g, '-').slice(0, 20);
    res.json({
      imageUrl: `https://picsum.photos/seed/${seed}${Date.now()}/1280/720`
    });

  } catch (e) {
    console.error('Image error:', e.message);
    // Fallback
    res.json({
      imageUrl: `https://picsum.photos/seed/${Date.now()}/1280/720`
    });
  }
});

module.exports = router;