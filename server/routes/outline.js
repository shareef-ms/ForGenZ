const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { topic, style, slideCount } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const count = Math.min(40, Math.max(4, parseInt(slideCount) || 10));

  const prompt = `You are a professional presentation designer.
Create an outline for a ${style || 'academic'} presentation on: "${topic}" with exactly ${count} slides.

IMPORTANT: You MUST include at least one of each of these special slide types if they fit the topic:
- swot → for analysis/strategy topics
- roadmap → for planning/future topics  
- funnel → for sales/marketing/conversion topics
- hubspoke → for showing relationships around a central concept

Return ONLY raw JSON, no markdown, no explanation:
{"outline":[
{"num":1,"type":"title","heading":"Exact slide title","description":"One sentence about this slide"},
{"num":2,"type":"overview","heading":"Exact slide title","description":"One sentence about this slide"},
{"num":3,"type":"bullets","heading":"Exact slide title","description":"One sentence about this slide"},
{"num":4,"type":"stats","heading":"Exact slide title","description":"One sentence about this slide"},
{"num":5,"type":"swot","heading":"SWOT Analysis of X","description":"Analyze strengths weaknesses opportunities threats"},
{"num":6,"type":"roadmap","heading":"X Roadmap","description":"Quarter by quarter plan"},
{"num":7,"type":"funnel","heading":"X Funnel","description":"Conversion stages"},
{"num":8,"type":"hubspoke","heading":"X Ecosystem","description":"Central concept and related aspects"}
]}

Rules:
- First slide must be type "title"
- Last slide must be type "closing"
- Use varied types across all ${count} slides
- For Digital Marketing always include: funnel, swot, roadmap
- For Tech topics always include: hubspoke, roadmap, process
- For Business always include: swot, funnel, stats
- All headings must be SPECIFIC to "${topic}"
- Generate exactly ${count} slides`;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'arcee-ai/trinity-large-preview:free',
        max_tokens: 2000,
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
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const idx1 = text.indexOf('{'), idx2 = text.lastIndexOf('}');
    if (idx1 >= 0 && idx2 > idx1) text = text.slice(idx1, idx2 + 1);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Recovery - extract outline items
      const items = [];
      let depth = 0, start = -1;
      const arrStart = text.indexOf('[', text.indexOf('"outline"'));
      if (arrStart === -1) throw e;
      for (let i = arrStart + 1; i < text.length; i++) {
        if (text[i] === '{') { if (depth === 0) start = i; depth++; }
        else if (text[i] === '}') {
          depth--;
          if (depth === 0 && start !== -1) {
            try {
              const obj = JSON.parse(text.slice(start, i + 1));
              if (obj.num && obj.type) items.push(obj);
            } catch (se) {}
            start = -1;
          }
        }
      }
      if (items.length > 0) parsed = { outline: items };
      else throw e;
    }

    res.json(parsed);

  } catch (e) {
    console.error('Outline error:', e.message);
    res.status(500).json({ error: 'Failed to generate outline. Please try again.' });
  }
});

module.exports = router;