const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { topic, style, slideType, slideNum } = req.body;

  const prompt = `Create a single ${slideType} slide for a ${style} presentation on "${topic}".
Return ONLY a valid JSON object for this one slide, no markdown:
{
  "slide": {
    "num": ${slideNum},
    "type": "${slideType}",
    "heading": "...",
    "items": ["point 1","point 2","point 3"],
    "body": "..."
  }
}
Make the content specific and realistic for the topic "${topic}".`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'arcee-ai/trinity-large-preview:free',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'SlideAI'
        }
      }
    );

    let text = response.data.choices[0].message.content;
    text = text.replace(/```json|```/g, '').trim();
    const idx1 = text.indexOf('{');
    const idx2 = text.lastIndexOf('}');
    if (idx1 >= 0 && idx2 > idx1) text = text.slice(idx1, idx2 + 1);
    const parsed = JSON.parse(text);
    res.json(parsed);

  } catch (e) {
    console.error('Regenerate error:', e.message);
    res.status(500).json({ error: 'Regeneration failed.' });
  }
});

module.exports = router;