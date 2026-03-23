import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { useScreenSize } from '../useScreenSize';
import { TEMPLATES, FONT_PAIRS } from './TemplateSelector';
import OutlineEditor from './OutlineEditor';

function autoSelectTemplate(topic, style) {
  const t = (topic || '').toLowerCase();
  const s = (style || '').toLowerCase();
  if (s === 'startup' || t.includes('startup') || t.includes('pitch')) return 'neon-dark';
  if (s === 'academic' && (t.includes('research') || t.includes('thesis') || t.includes('university') || t.includes('biology') || t.includes('chemistry'))) return 'academic-white';
  if (s === 'business' || t.includes('business') || t.includes('market') || t.includes('sales') || t.includes('marketing')) return 'corporate-blue';
  if (t.includes('machine learning') || t.includes('ai') || t.includes('technology') || t.includes('software') || t.includes('engineering') || t.includes('detection') || t.includes('system')) return 'dark-tech';
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
    academic: { id: 'montserrat-opensans', title: 'Montserrat', body: 'Open Sans', label: 'Professional' },
    business: { id: 'raleway-roboto', title: 'Raleway', body: 'Roboto', label: 'Technical' },
    technical: { id: 'syne-dm', title: 'Syne', body: 'DM Sans', label: 'Modern' },
    creative: { id: 'playfair-lato', title: 'Playfair Display', body: 'Lato', label: 'Elegant' },
    startup: { id: 'oswald-sourcesans', title: 'Oswald', body: 'Source Sans Pro', label: 'Bold' },
  };
  return fontMap[style] || fontMap['technical'];
}

function generateSpeakerNote(slide, topic) {
  const h = slide.heading || '';
  if (slide.type === 'title') return `Welcome everyone. Today we are presenting on ${topic}. This deck covers the key aspects, data, and insights you need to know.`;
  if (slide.type === 'overview') return `Here is our agenda for today. We will walk through each section systematically.`;
  if (slide.type === 'bullets') return `Let us go through these key points on ${h}. Each has been carefully selected to give a comprehensive understanding.`;
  if (slide.type === 'stats') return `These numbers speak for themselves. Take a moment to absorb these statistics on ${h}.`;
  if (slide.type === 'piechart' || slide.type === 'donut') return `This chart shows the distribution of ${h}. Notice the dominant segment.`;
  if (slide.type === 'barchart') return `This trend shows how ${h} has changed over time.`;
  if (slide.type === 'timeline') return `Let us walk through how ${topic} has evolved. Each milestone represents a key development.`;
  if (slide.type === 'comparison') return `This comparison makes the difference crystal clear between the two approaches.`;
  if (slide.type === 'process') return `This is the step-by-step approach for ${h}. Each stage builds on the previous one.`;
  if (slide.type === 'blocks') return `These four pillars form the foundation of our approach to ${topic}.`;
  if (slide.type === 'quote') return `This insight encapsulates what we are conveying. Worth reflecting on.`;
  if (slide.type === 'swot') return `This SWOT analysis gives us a complete picture of where ${topic} stands today.`;
  if (slide.type === 'roadmap') return `This roadmap shows our planned progression. Each phase builds on the previous one.`;
  if (slide.type === 'funnel') return `This funnel shows the journey from awareness to action. Each stage is critical.`;
  if (slide.type === 'hubspoke') return `This diagram shows how everything connects to the central concept of ${h}.`;
  if (slide.type === 'closing') return `To summarize, these are our key takeaways. Thank you. Happy to take questions.`;
  return `This slide covers ${h}. Explain the key points clearly.`;
}

function InputSection({ setSlides, setDeckTitle, setLoading, setError, loading, setSpeakerNotes }) {
  const theme = useTheme();
  const { isMobile } = useScreenSize();
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('academic');
  const [slideCount, setSlideCount] = useState(10);
  const [detail, setDetail] = useState('detailed');
  const [showOutline, setShowOutline] = useState(false);
  const [outline, setOutline] = useState([]);
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [buildLoading, setBuildLoading] = useState(false);

  const selectStyle = {
    background: theme.surface2, border: `1px solid ${theme.border}`,
    borderRadius: '8px', padding: '8px 12px',
    color: theme.text, fontFamily: 'DM Sans, sans-serif',
    fontSize: '13px', outline: 'none', cursor: 'pointer',
  };

  async function generateOutline() {
    if (!topic.trim()) return;
    setOutlineLoading(true);
    setError('');
    try {
      const res = await axios.post('https://forgenz-production.up.railway.app/api/outline', {
        topic, style, slideCount
      });
      if (res.data.outline && res.data.outline.length > 0) {
        setOutline(res.data.outline);
        setShowOutline(true);
      } else {
        setError('Could not generate outline. Please try again.');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to generate outline.');
    }
    setOutlineLoading(false);
  }

  async function buildFromOutline(approvedOutline) {
    setBuildLoading(true);
    setLoading(true);
    try {
      const res = await axios.post('https://forgenz-production.up.railway.app/api/generate', {
        topic, style,
        slideCount: approvedOutline.length,
        detail,
        outline: approvedOutline
      });

      setDeckTitle(res.data.title);
      setSlides(res.data.slides);
      setShowOutline(false);

      const tpl = TEMPLATES.find(t => t.id === res.data.templateId) || TEMPLATES[0];
      const fonts = res.data.fonts || FONT_PAIRS[0];

      localStorage.setItem('slideai-theme', JSON.stringify({
        bg: tpl.colors.bg,
        accent: tpl.colors.accent,
        accent2: tpl.colors.accent2,
        text: tpl.colors.text,
        muted: tpl.colors.muted,
        gradients: tpl.gradients
      }));
      localStorage.setItem('slideai-theme-key', tpl.id);
      localStorage.setItem('slideai-topic', topic);
      localStorage.setItem('slideai-style', style);
      localStorage.setItem('slideai-fonts', JSON.stringify(fonts));

      if (res.data.speakerNotes && setSpeakerNotes) {
        setSpeakerNotes(res.data.speakerNotes);
      } else if (setSpeakerNotes) {
        const notes = {};
        (res.data.slides || []).forEach(slide => {
          notes[slide.num] = generateSpeakerNote(slide, topic);
        });
        setSpeakerNotes(notes);
      }

    } catch (e) {
      setError(e.response?.data?.error || 'Failed to build presentation.');
    }
    setBuildLoading(false);
    setLoading(false);
  }

  return (
    <>
      {showOutline && (
        <OutlineEditor
          outline={outline}
          onBuild={buildFromOutline}
          onCancel={() => setShowOutline(false)}
          loading={buildLoading}
        />
      )}

      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: '12px', padding: isMobile ? '1rem' : '1.5rem',
        marginBottom: '1.5rem', transition: 'background 0.3s'
      }}>
        <div style={{ fontSize: '11px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
          Create Your Presentation ✦
        </div>

        {/* Topic input */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generateOutline()}
            placeholder={isMobile ? 'Type your topic...' : "Type any topic — Climate Change, Machine Learning, My Startup, Solar System..."}
            style={{
              flex: 1, background: theme.surface2, border: `1px solid ${theme.border}`,
              borderRadius: '8px', padding: '12px 16px', color: theme.text,
              fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none',
            }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Style</span>
            <select style={selectStyle} value={style} onChange={e => setStyle(e.target.value)}>
              <option value="academic">Academic</option>
              <option value="business">Business Pitch</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
              <option value="startup">Startup / Investor</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Slides</span>
            <input
              type="number" min="4" max="40" value={slideCount}
              onChange={e => setSlideCount(parseInt(e.target.value))}
              style={{ ...selectStyle, width: '80px', textAlign: 'center' }}
            />
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detail</span>
              <select style={selectStyle} value={detail} onChange={e => setDetail(e.target.value)}>
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
          )}

          <button
            onClick={generateOutline}
            disabled={outlineLoading || loading}
            style={{
              padding: '12px 28px',
              background: outlineLoading || loading ? theme.surface2 : '#6C5CE7',
              color: outlineLoading || loading ? theme.muted : '#fff',
              border: 'none', borderRadius: '8px',
              fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: '600',
              cursor: outlineLoading || loading ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-end', transition: 'all 0.2s',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            {outlineLoading ? '⏳ Generating outline...' : loading ? '⏳ Cooking... 🔥' : '✦ Generate My Deck'}
          </button>
        </div>

        {/* Auto features */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          {['🎨 Auto template', '🖼 Auto images', '🔤 Auto fonts', '📝 Auto speaker notes'].map((f, i) => (
            <span key={i} style={{ fontSize: '11px', color: theme.muted }}>{f}</span>
          ))}
        </div>
      </div>
    </>
  );
}

export default InputSection;