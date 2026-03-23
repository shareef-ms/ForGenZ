const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { message, slides, currentSlide } = req.body;

  if (!message || !slides) {
    return res.status(400).json({ error: 'Message and slides are required' });
  }

  const prompt = `You are an AI presentation assistant. The user has a presentation with these slides:
${JSON.stringify(slides.slice(0, 5), null, 2)}
${slides.length > 5 ? `...and ${slides.length - 5} more slides` : ''}

Current selected slide: ${currentSlide || 1}

User request: "${message}"

Respond with ONLY a valid JSON object, no markdown:
{
  "reply": "Brief friendly message explaining what you did",
  "action": "edit_slide" | "add_notes" | "add_notes_all" | "no_change",
  "slideNum": 1,
  "updatedSlide": { ...complete updated slide object },
  "speakerNotes": "Speaker notes text if requested",
  "allNotes": { "1": "notes for slide 1", "2": "notes for slide 2" }
}

Rules:
- If user asks to edit/modify/improve a slide, use action "edit_slide" and return updatedSlide
- If user asks for speaker notes for ONE slide, use action "add_notes" and return speakerNotes
- If user asks for speaker notes for ALL slides, use action "add_notes_all" and return allNotes
- If just chatting, use action "no_change"
- Keep the same slide type and num when editing
- speakerNotes should be 2-4 sentences, conversational`;

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
    text = text.replace(/```json|```/g, '').trim();
    const idx1 = text.indexOf('{');
    const idx2 = text.lastIndexOf('}');
    if (idx1 >= 0 && idx2 > idx1) text = text.slice(idx1, idx2 + 1);
    const parsed = JSON.parse(text);
    res.json(parsed);

  } catch (e) {
    console.error('Assistant error:', e.message);
    res.status(500).json({ error: 'Assistant failed. Please try again.' });
  }
});

module.exports = router;