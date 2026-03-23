const express = require('express');
const router = express.Router();
const axios = require('axios');

function autoSelectTemplate(topic, style) {
  const t = (topic || '').toLowerCase();
  const s = (style || '').toLowerCase();
  if (s === 'startup' || t.includes('startup') || t.includes('pitch')) return 'neon-dark';
  if (s === 'academic' && (t.includes('research') || t.includes('thesis') || t.includes('university') || t.includes('biology') || t.includes('chemistry'))) return 'academic-white';
  if (s === 'business' || t.includes('business') || t.includes('market') || t.includes('sales') || t.includes('marketing')) return 'corporate-blue';
  if (t.includes('machine learning') || t.includes('ai') || t.includes('technology') || t.includes('software') || t.includes('engineering')) return 'dark-tech';
  if (t.includes('nature') || t.includes('environment') || t.includes('climate') || t.includes('ecology') || t.includes('biology')) return 'forest-green';
  if (t.includes('health') || t.includes('medical') || t.includes('medicine')) return 'ocean-blue';
  if (t.includes('finance') || t.includes('economics') || t.includes('investment')) return 'golden-luxury';
  if (t.includes('art') || t.includes('design') || t.includes('creative') || t.includes('music')) return 'sunset-warm';
  if (t.includes('space') || t.includes('astronomy') || t.includes('physics')) return 'royal-purple';
  if (s === 'creative') return 'sunset-warm';
  if (s === 'technical') return 'dark-tech';
  return 'dark-tech';
}

function autoSelectFont(style) {
  const fontMap = {
    academic: { id: 'montserrat-opensans', title: 'Montserrat', body: 'Open Sans' },
    business: { id: 'raleway-roboto', title: 'Raleway', body: 'Roboto' },
    technical: { id: 'syne-dm', title: 'Syne', body: 'DM Sans' },
    creative: { id: 'playfair-lato', title: 'Playfair Display', body: 'Lato' },
    startup: { id: 'oswald-sourcesans', title: 'Oswald', body: 'Source Sans Pro' },
  };
  return fontMap[style] || fontMap['technical'];
}

async function fetchSlideImage(heading, unsplashKey) {
  try {
    const keywords = (heading || '')
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .split(' ')
      .filter(w => w.length > 3)
      .slice(0, 3)
      .join(' ');
    if (unsplashKey && keywords) {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query: keywords, per_page: 3, orientation: 'landscape' },
        headers: { Authorization: `Client-ID ${unsplashKey}` },
        timeout: 5000
      });
      const results = response.data.results;
      if (results && results.length > 0) {
        const pick = results[Math.floor(Math.random() * results.length)];
        return pick.urls.regular;
      }
    }
    const seed = (keywords || heading || 'slide').replace(/\s+/g, '-').slice(0, 20);
    return `https://picsum.photos/seed/${seed}${Math.floor(Math.random() * 100)}/1280/720`;
  } catch (e) {
    return null;
  }
}

function generateSpeakerNote(slide, topic) {
  const h = slide.heading || '';
  if (slide.type === 'title') return `Welcome everyone. Today we are presenting on ${topic}. This deck covers the key aspects, data, and insights you need to know. Let us get started.`;
  if (slide.type === 'overview') return `Here is our agenda for today. We will walk through each section systematically. Feel free to ask questions at the end of each section.`;
  if (slide.type === 'bullets') return `Let us go through these key points on ${h}. Each has been carefully selected to give a comprehensive understanding. Pause on any point that needs more discussion.`;
  if (slide.type === 'stats') return `These numbers speak for themselves. Take a moment to absorb these statistics on ${h}. These figures are based on the latest available data.`;
  if (slide.type === 'piechart' || slide.type === 'donut') return `This chart shows the distribution of ${h}. Notice the dominant segment and what it tells us about the overall composition.`;
  if (slide.type === 'barchart') return `This trend shows how ${h} has changed over time. Pay attention to the rate of change — it indicates where things are heading.`;
  if (slide.type === 'timeline') return `Let us walk through how ${topic} has evolved. Each milestone represents a significant development that shaped where we are today.`;
  if (slide.type === 'comparison') return `This comparison makes the difference crystal clear. The transformation shown here is exactly what we are working toward.`;
  if (slide.type === 'process') return `This is the step-by-step approach for ${h}. Each stage builds on the previous one. The key is to not skip any step.`;
  if (slide.type === 'blocks') return `These four pillars form the foundation of our approach to ${topic}. Together they create a comprehensive framework.`;
  if (slide.type === 'quote') return `This insight from ${slide.attribution || 'an industry expert'} encapsulates exactly what we are trying to convey. Worth reflecting on for a moment.`;
  if (slide.type === 'swot') return `This SWOT analysis gives us a complete picture of where ${topic} stands today. Each quadrant is equally important.`;
  if (slide.type === 'roadmap') return `This roadmap shows our planned progression. Each phase builds on the previous one with clear deliverables and timelines.`;
  if (slide.type === 'funnel') return `This funnel shows the journey from awareness to action. Each stage has specific strategies to move people to the next level.`;
  if (slide.type === 'hubspoke') return `This diagram shows how everything connects to the central concept of ${h}. Each spoke is critical to the whole system.`;
  if (slide.type === 'closing') return `To summarize everything we covered today — these are our key takeaways. Thank you for your attention. I am happy to take any questions now.`;
  return `This slide covers ${h}. Explain the key points clearly and invite questions from the audience.`;
}

async function generateBatch(topic, style, slides, detailGuide, apiKey) {
  const slideTypes = slides.map(s => `slide ${s.num}: type="${s.type}", heading="${s.heading}"`).join('\n');

  const prompt = `You are a world-class ${style} presentation designer and domain expert.
Generate HIGHLY DETAILED, CONTENT-RICH content for these slides about "${topic}":
${slideTypes}

CRITICAL RULES:
- ${detailGuide}
- ALL content must be 100% SPECIFIC to "${topic}" — absolutely no generic placeholders
- Use REAL statistics, percentages, years, names and domain-specific terminology
- Each bullet point must be a COMPLETE sentence with actual information, not just a title
- Return ONLY valid JSON array, no markdown, no explanation
- Max 120 chars per string value

JSON format for each slide type:
- title: {"num":N,"type":"title","heading":"Specific compelling title about ${topic}","subheading":"Specific subtitle with context","body":"One powerful tagline"}
- overview/bullets: {"num":N,"type":"TYPE","heading":"Specific heading","items":["Complete sentence with specific fact or data point about ${topic}","Another complete sentence with real information and numbers","Third point with domain-specific terminology and context","Fourth point with practical implication or example","Fifth point with key insight or recommendation"]}
- stats: {"num":N,"type":"stats","heading":"Key Numbers","stats":[{"value":"XX%","label":"Specific metric name relevant to ${topic}"},{"value":"$X.XB","label":"Another specific metric with context"},{"value":"XXXX","label":"Third impactful number with meaning"}]}
- piechart: {"num":N,"type":"piechart","heading":"Distribution of specific aspect","chartData":{"labels":["Specific Category A","Specific Category B","Specific Category C","Specific Category D"],"values":[38,27,21,14]}}
- barchart: {"num":N,"type":"barchart","heading":"Growth trend of specific metric","chartData":{"labels":["2019","2020","2021","2022","2023","2024"],"values":[32,41,55,67,79,91],"unit":"%"}}
- donut: {"num":N,"type":"donut","heading":"Breakdown of specific aspect","centerValue":"XX%","centerLabel":"Specific Label","chartData":{"labels":["Segment A","Segment B","Segment C"],"values":[55,30,15]}}
- blocks: {"num":N,"type":"blocks","heading":"Core components","blocks":[{"icon":"⚡","title":"Specific component name","body":"2 sentence explanation specific to ${topic} with real detail"},{"icon":"🔬","title":"Specific component name","body":"2 sentence explanation with technical context"},{"icon":"📊","title":"Specific component name","body":"2 sentence explanation with metrics or outcomes"},{"icon":"🎯","title":"Specific component name","body":"2 sentence explanation with practical application"}]}
- timeline: {"num":N,"type":"timeline","heading":"Key milestones","items":[{"year":"2018","title":"Specific real milestone","body":"What happened and its significance for ${topic}"},{"year":"2020","title":"Specific real milestone","body":"Development with real context and impact"},{"year":"2022","title":"Specific real milestone","body":"Progress with specific data or outcome"},{"year":"2024","title":"Current state","body":"Where things stand now with recent data"}]}
- comparison: {"num":N,"type":"comparison","heading":"Before vs After / A vs B","col1":{"title":"Specific Left Label","items":["Specific issue 1 with detail","Specific issue 2 with context","Specific issue 3 with impact","Specific issue 4 with data"]},"col2":{"title":"Specific Right Label","items":["Specific improvement 1 with result","Specific improvement 2 with metric","Specific improvement 3 with outcome","Specific improvement 4 with benefit"]}}
- process: {"num":N,"type":"process","heading":"Step-by-step process","steps":[{"num":"01","title":"Specific step name","body":"Detailed explanation of this step for ${topic}"},{"num":"02","title":"Specific step name","body":"What happens in this step with technical detail"},{"num":"03","title":"Specific step name","body":"This step's role and its specific output"},{"num":"04","title":"Specific step name","body":"Final step with measurable result or deliverable"}]}
- quote: {"num":N,"type":"quote","heading":"Expert perspective","quote":"Powerful insightful quote directly relevant to ${topic} from a real expert","attribution":"— Real Expert Name, Their Title or Organization"}
- swot: {"num":N,"type":"swot","heading":"SWOT Analysis of ${topic}","strengths":["Specific strength 1 with evidence","Specific strength 2 with data","Specific strength 3 with context"],"weaknesses":["Specific weakness 1 with impact","Specific weakness 2 with consequence","Specific weakness 3 with challenge"],"opportunities":["Specific opportunity 1 with potential","Specific opportunity 2 with market data","Specific opportunity 3 with timeline"],"threats":["Specific threat 1 with risk level","Specific threat 2 with probability","Specific threat 3 with mitigation"]}
- roadmap: {"num":N,"type":"roadmap","heading":"Strategic roadmap","phases":[{"period":"Q1 2025","title":"Phase 1 specific name","items":["Specific deliverable 1","Specific milestone 2"]},{"period":"Q2 2025","title":"Phase 2 specific name","items":["Specific deliverable 1","Specific milestone 2"]},{"period":"Q3 2025","title":"Phase 3 specific name","items":["Specific deliverable 1","Specific milestone 2"]},{"period":"Q4 2025","title":"Phase 4 specific name","items":["Specific deliverable 1","Specific milestone 2"]}]}
- funnel: {"num":N,"type":"funnel","heading":"Conversion funnel","stages":[{"label":"Specific Stage 1","value":"10,000"},{"label":"Specific Stage 2","value":"5,000"},{"label":"Specific Stage 3","value":"1,200"},{"label":"Specific Stage 4","value":"300"}]}
- hubspoke: {"num":N,"type":"hubspoke","heading":"Ecosystem overview","center":"Core concept name","spokes":["Specific aspect 1","Specific aspect 2","Specific aspect 3","Specific aspect 4","Specific aspect 5","Specific aspect 6"]}
- closing: {"num":N,"type":"closing","heading":"Conclusion","body":"One powerful sentence summarizing the entire presentation","items":["Key takeaway 1 — specific and actionable","Key takeaway 2 — measurable outcome","Key takeaway 3 — forward-looking insight","Contact or next step information"]}

Return ONLY a JSON array: [slide1, slide2, ...]
Make every word count. Be specific. Be detailed. Be expert-level.`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'arcee-ai/trinity-large-preview:free',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'ForGenZ'
      }
    }
  );

  let text = response.data.choices[0].message.content;
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  const idx1 = text.indexOf('[');
  const idx2 = text.lastIndexOf(']');
  if (idx1 >= 0 && idx2 > idx1) {
    text = text.slice(idx1, idx2 + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const completedSlides = [];
    let depth = 0, slideStart = -1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{') { if (depth === 0) slideStart = i; depth++; }
      else if (text[i] === '}') {
        depth--;
        if (depth === 0 && slideStart !== -1) {
          try {
            const obj = JSON.parse(text.slice(slideStart, i + 1));
            if (obj.num && obj.type) completedSlides.push(obj);
          } catch (se) {}
          slideStart = -1;
        }
      }
    }
    if (completedSlides.length > 0) return completedSlides;
    throw new Error('Could not parse batch response');
  }

  return Array.isArray(parsed) ? parsed : [];
}

router.post('/', async (req, res) => {
  const { topic, style, slideCount, detail, outline } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const count = Math.min(40, Math.max(4, parseInt(slideCount) || 10));
  const templateId = autoSelectTemplate(topic, style);
  const fonts = autoSelectFont(style);

  const detailGuides = {
    concise: '4-5 specific bullet points per slide with real facts and numbers — keep sentences punchy but informative',
    detailed: '5-6 detailed bullet points per slide — each point must include domain-specific data, percentages, or examples',
    comprehensive: '6-7 comprehensive bullet points per slide — expert-level detail with specific statistics, technical terms, real-world examples and implications',
  };
  const detailGuide = detailGuides[detail] || detailGuides.detailed;

  let slideList = [];
  if (outline && outline.length > 0) {
    slideList = outline.map((s, i) => ({ num: i + 1, type: s.type, heading: s.heading }));
  } else {
    const defaultTypes = ['title','overview','bullets','stats','piechart','barchart','donut','blocks','timeline','comparison','process','quote','swot','roadmap','funnel','hubspoke','closing'];
    for (let i = 0; i < count; i++) {
      slideList.push({
        num: i + 1,
        type: i === 0 ? 'title' : i === count - 1 ? 'closing' : defaultTypes[i % defaultTypes.length],
        heading: `Slide ${i + 1}`
      });
    }
  }

  try {
    const batchSize = 5;
    const batches = [];
    for (let i = 0; i < slideList.length; i += batchSize) {
      batches.push(slideList.slice(i, i + batchSize));
    }

    const allSlides = [];
    for (const batch of batches) {
      try {
        const batchSlides = await generateBatch(
          topic, style, batch, detailGuide,
          process.env.OPENROUTER_API_KEY
        );
        allSlides.push(...batchSlides);
      } catch (batchErr) {
        console.error('Batch error:', batchErr.message);
        batch.forEach(s => {
          allSlides.push({
            num: s.num,
            type: s.type,
            heading: s.heading,
            items: [
              `This slide covers key aspects of ${s.heading}`,
              'Please use the edit button to add your specific content',
              'You can also use the AI Assistant to regenerate this slide',
              'Click the ↺ redo button to try generating again'
            ],
            body: 'Click edit or redo to add content'
          });
        });
      }
    }

    allSlides.sort((a, b) => a.num - b.num);

    // Generate title from first slide or topic
    const title = outline?.[0]?.heading
      ? outline[0].heading
      : `${topic} — Complete Guide`;

    // Auto speaker notes — instant
    const speakerNotes = {};
    allSlides.forEach(slide => {
      speakerNotes[slide.num] = generateSpeakerNote(slide, topic);
    });

    // Send response immediately — fast!
    res.json({
      title,
      slides: allSlides,
      templateId,
      fonts,
      speakerNotes
    });

    // Fetch background images AFTER response is sent (non-blocking)
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      Promise.allSettled(
        allSlides.map(slide => fetchSlideImage(slide.heading || topic, unsplashKey))
      ).catch(() => {});
    }

  } catch (e) {
    console.error('Error:', e.message);
    res.status(500).json({ error: 'Failed to generate. Please try again.' });
  }
});

module.exports = router;