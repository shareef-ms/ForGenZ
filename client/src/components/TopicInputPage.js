import React, { useState, useEffect } from 'react';

const SUGGESTED = ['Climate Change', 'Marketing Strategy', 'Startup Pitch', 'Machine Learning', 'Supply Chain', 'Solar System', 'Blockchain', 'Mental Health', 'Artificial Intelligence', 'Electric Vehicles'];

const STYLES = [
  { id: 'academic', label: 'Academic' },
  { id: 'business', label: 'Business' },
  { id: 'creative', label: 'Creative' },
  { id: 'technical', label: 'Technical' },
  { id: 'startup', label: 'Startup' },
];

const SLIDE_COUNTS = [5, 8, 10, 12, 15, 20];

const THEMES = [
  { id: 'dark-tech',       label: 'Dark Tech',      accent: '#00D2FF', bg: '#0D1117', preview: ['#0D1117', '#00D2FF', '#6C5CE7'] },
  { id: 'neon-dark',       label: 'Neon',            accent: '#00FF88', bg: '#050510', preview: ['#050510', '#00FF88', '#FF00FF'] },
  { id: 'ocean-blue',      label: 'Ocean Blue',      accent: '#00E5FF', bg: '#020B18', preview: ['#020B18', '#00E5FF', '#0070F3'] },
  { id: 'forest-green',    label: 'Forest',          accent: '#00E676', bg: '#0A1A0F', preview: ['#0A1A0F', '#00E676', '#69F0AE'] },
  { id: 'royal-purple',    label: 'Royal Purple',    accent: '#9C27B0', bg: '#0D0520', preview: ['#0D0520', '#9C27B0', '#E040FB'] },
  { id: 'corporate-blue',  label: 'Corporate',       accent: '#2196F3', bg: '#0A1628', preview: ['#0A1628', '#2196F3', '#64B5F6'] },
  { id: 'sunset-warm',     label: 'Sunset',          accent: '#FF6B35', bg: '#1A0A00', preview: ['#1A0A00', '#FF6B35', '#FFB300'] },
  { id: 'golden-luxury',   label: 'Gold',            accent: '#FFD700', bg: '#0A0800', preview: ['#0A0800', '#FFD700', '#FFA000'] },
  { id: 'midnight-blue',   label: 'Midnight',        accent: '#4CC9F0', bg: '#000814', preview: ['#000814', '#4CC9F0', '#4361EE'] },
  { id: 'crimson',         label: 'Crimson',         accent: '#DC2626', bg: '#0A0000', preview: ['#0A0000', '#DC2626', '#F97316'] },
  { id: 'aurora',          label: 'Aurora',          accent: '#7B2FBE', bg: '#0D0221', preview: ['#0D0221', '#7B2FBE', '#FF6B6B'] },
  { id: 'matrix',          label: 'Matrix',          accent: '#00FF41', bg: '#000300', preview: ['#000300', '#00FF41', '#00CC33'] },
];

const TONES = ['Professional', 'Casual', 'Persuasive', 'Informative', 'Academic'];

export default function TopicInputPage({ nav }) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('academic');
  const [slideCount, setSlideCount] = useState(10);
  const [selectedTheme, setSelectedTheme] = useState('dark-tech');
  const [tone, setTone] = useState('Professional');
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  function handleGenerate() {
    if (!topic.trim()) return;
    localStorage.setItem('forgenz-theme-id', selectedTheme);
    nav.toOutline(topic, style, slideCount, 'detailed');
  }

  const m = mobile;
  const themeObj = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '14px 18px' : '18px 40px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ fontSize: m ? '19px' : '22px', fontWeight: '800', letterSpacing: '-1px', cursor: 'pointer' }} onClick={nav.toLanding}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <div style={{ display: 'flex', gap: m ? '8px' : '16px', alignItems: 'center' }}>
          {!m && <button onClick={nav.toLanding} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Home</button>}
          {!m && <button onClick={nav.toMyDecks} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>My Decks</button>}
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#D4FF00', border: '1px solid #333' }}>U</div>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: m ? '32px 18px 60px' : '56px 24px' }}>
        <h1 style={{ fontSize: m ? 'clamp(22px, 6vw, 32px)' : 'clamp(28px, 4vw, 42px)', fontWeight: '800', textAlign: 'center', marginBottom: '8px', letterSpacing: '-1.5px' }}>
          What's your presentation about? 🔥
        </h1>
        <p style={{ fontSize: m ? '13px' : '15px', color: '#555', textAlign: 'center', marginBottom: '28px', fontFamily: 'DM Sans, sans-serif' }}>
          Type your topic below. AI will build your full deck in ~15 seconds.
        </p>

        {/* Suggested chips */}
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '22px' }}>
          {SUGGESTED.map((s, i) => (
            <button key={i}
              onClick={() => setTopic(s)}
              style={{
                padding: '6px 12px', border: `1px solid ${topic === s ? '#D4FF00' : '#222'}`,
                borderRadius: '100px', fontSize: '12px', color: topic === s ? '#D4FF00' : '#666',
                cursor: 'pointer', background: 'transparent', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
              }}
            >{s}</button>
          ))}
        </div>

        {/* Input box */}
        <div style={{ background: '#0f0f0f', border: '1px solid #222', borderRadius: '14px', overflow: 'visible', marginBottom: '18px' }}>
          <textarea
            style={{ width: '100%', padding: '18px', background: 'transparent', border: 'none', color: '#fff', fontSize: m ? '14px' : '16px', fontFamily: 'DM Sans, sans-serif', resize: 'none', outline: 'none', minHeight: '90px', boxSizing: 'border-box' }}
            placeholder="e.g. The impact of social media on Gen Z mental health..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
          />
          <div style={{ height: '1px', background: '#1a1a1a', margin: '0 16px' }} />
          <div style={{ display: 'flex', gap: '7px', padding: '12px 16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif', marginRight: '4px' }}>Style:</span>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} style={{
                padding: '5px 12px',
                background: style === s.id ? '#D4FF00' : 'transparent',
                color: style === s.id ? '#000' : '#555',
                border: `1px solid ${style === s.id ? '#D4FF00' : '#222'}`,
                borderRadius: '100px', fontSize: '12px', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: style === s.id ? '700' : '400', transition: 'all 0.15s'
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Slide count + Tone */}
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>Number of Slides</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SLIDE_COUNTS.map(n => (
                <button key={n} onClick={() => setSlideCount(n)} style={{
                  padding: '5px 12px',
                  background: slideCount === n ? '#D4FF0020' : 'transparent',
                  border: slideCount === n ? '1px solid #D4FF00' : '1px solid #222',
                  borderRadius: '100px', fontSize: '12px',
                  color: slideCount === n ? '#D4FF00' : '#555',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
                }}>{n}</button>
              ))}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif' }}>{slideCount} slides selected</div>
          </div>

          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>Tone</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  padding: '5px 12px',
                  background: tone === t ? '#D4FF0020' : 'transparent',
                  border: tone === t ? '1px solid #D4FF00' : '1px solid #222',
                  borderRadius: '100px', fontSize: '12px',
                  color: tone === t ? '#D4FF00' : '#555',
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
                }}>{t}</button>
              ))}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif' }}>{tone} selected</div>
          </div>
        </div>

        {/* Theme picker */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif' }}>Presentation Theme</div>
            <div style={{ fontSize: '12px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif', fontWeight: '600' }}>✦ {themeObj.label} selected</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)', gap: '8px' }}>
            {THEMES.map(t => (
              <div key={t.id} onClick={() => setSelectedTheme(t.id)} style={{ borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: selectedTheme === t.id ? '2px solid #D4FF00' : '2px solid #1a1a1a', transition: 'all 0.15s', position: 'relative' }}>
                <div style={{ height: '34px', background: t.preview[0], display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0 8px' }}>
                  {t.preview.slice(1).map((c, i) => (
                    <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{ fontSize: '9px', color: '#888', textAlign: 'center', padding: '4px', background: '#111', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t.label}</div>
                {selectedTheme === t.id && (
                  <div style={{ position: 'absolute', top: '3px', right: '3px', width: '13px', height: '13px', background: '#D4FF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: '#000', fontWeight: '800' }}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          style={{
            width: '100%', padding: m ? '16px' : '18px',
            background: topic.trim() ? '#D4FF00' : '#111',
            color: topic.trim() ? '#000' : '#333',
            border: 'none', borderRadius: '12px',
            fontSize: m ? '16px' : '18px', fontWeight: '800',
            cursor: topic.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px'
          }}
          onClick={handleGenerate}
          disabled={!topic.trim()}
        >
          Generate Outline →
        </button>
      </div>
    </div>
  );
}