import React, { useState } from 'react';

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

  function handleGenerate() {
    if (!topic.trim()) return;
    localStorage.setItem('forgenz-theme-id', selectedTheme);
    nav.toOutline(topic, style, slideCount, 'detailed');
  }

  const S = {
    page: { minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid #1a1a1a' },
    logo: { fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', cursor: 'pointer' },
    logoAccent: { color: '#D4FF00' },
    main: { maxWidth: '680px', margin: '0 auto', padding: '56px 24px' },
    title: { fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', textAlign: 'center', marginBottom: '10px', letterSpacing: '-1.5px' },
    subtitle: { fontSize: '15px', color: '#555', textAlign: 'center', marginBottom: '40px', fontFamily: 'DM Sans, sans-serif' },
    suggested: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' },
    chip: { padding: '7px 14px', border: '1px solid #222', borderRadius: '100px', fontSize: '12px', color: '#666', cursor: 'pointer', background: 'transparent', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' },
    inputBox: { background: '#0f0f0f', border: '1px solid #222', borderRadius: '14px', overflow: 'visible', marginBottom: '20px' },
    textarea: { width: '100%', padding: '22px', background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', fontFamily: 'DM Sans, sans-serif', resize: 'none', outline: 'none', minHeight: '100px', boxSizing: 'border-box' },
    divider: { height: '1px', background: '#1a1a1a', margin: '0 16px' },
    styleRow: { display: 'flex', gap: '8px', padding: '14px 16px', flexWrap: 'wrap', alignItems: 'center' },
    styleLabel: { fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif', marginRight: '4px' },
    sectionTitle: { fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' },
    sectionBlock: { marginBottom: '24px' },
    themeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
    themeCard: (active) => ({
      borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
      border: active ? '2px solid #D4FF00' : '2px solid #1a1a1a',
      transition: 'all 0.15s', position: 'relative'
    }),
    themePreview: (bg) => ({ height: '36px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0 8px' }),
    themeLabel: { fontSize: '10px', color: '#888', textAlign: 'center', padding: '5px', background: '#111', fontFamily: 'DM Sans, sans-serif' },
    activeCheck: { position: 'absolute', top: '4px', right: '4px', width: '14px', height: '14px', background: '#D4FF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#000', fontWeight: '800' },
    optionsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' },
    optCard: (active) => ({ background: '#0f0f0f', border: active ? '1px solid #D4FF00' : '1px solid #1a1a1a', borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }),
    optLabel: { fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' },
    optValue: { fontSize: '16px', fontWeight: '700', color: '#fff' },
    optSubRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' },
    optPill: (active) => ({ padding: '5px 12px', background: active ? '#D4FF0020' : 'transparent', border: active ? '1px solid #D4FF00' : '1px solid #222', borderRadius: '100px', fontSize: '12px', color: active ? '#D4FF00' : '#555', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }),
    generateBtn: { width: '100%', padding: '18px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px', marginTop: '8px' },
    disabledBtn: { width: '100%', padding: '18px', background: '#111', color: '#333', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '800', cursor: 'not-allowed', fontFamily: 'Syne, sans-serif', marginTop: '8px' },
  };

  const activeStyle = (id) => id === style;
  const activeTheme = selectedTheme;
  const themeObj = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={S.logo} onClick={nav.toLanding}>For<span style={S.logoAccent}>GenZ</span></div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={nav.toLanding} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Home</button>
          <button onClick={nav.toMyDecks} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>My Decks</button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#D4FF00', border: '1px solid #333' }}>U</div>
        </div>
      </nav>

      <div style={S.main}>
        <h1 style={S.title}>What's your presentation about? 🔥</h1>
        <p style={S.subtitle}>Type your topic below. AI will build your full deck in ~15 seconds.</p>

        {/* Suggested */}
        <div style={S.suggested}>
          {SUGGESTED.map((s, i) => (
            <button key={i} style={{ ...S.chip, borderColor: topic === s ? '#D4FF00' : '#222', color: topic === s ? '#D4FF00' : '#666' }}
              onClick={() => setTopic(s)}
            >{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={S.inputBox}>
          <textarea
            style={S.textarea}
            placeholder="e.g. The impact of social media on Gen Z mental health..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
          />
          <div style={S.divider} />
          <div style={S.styleRow}>
            <span style={S.styleLabel}>Style:</span>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} style={{
                padding: '6px 14px', background: activeStyle(s.id) ? '#D4FF00' : 'transparent',
                color: activeStyle(s.id) ? '#000' : '#555',
                border: `1px solid ${activeStyle(s.id) ? '#D4FF00' : '#222'}`,
                borderRadius: '100px', fontSize: '12px', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: activeStyle(s.id) ? '700' : '400',
                transition: 'all 0.15s'
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Slide count + Tone */}
        <div style={S.optionsRow}>
          <div style={S.optCard(false)}>
            <div style={S.optLabel}>Number of Slides</div>
            <div style={{ ...S.optSubRow }}>
              {SLIDE_COUNTS.map(n => (
                <button key={n} onClick={() => setSlideCount(n)} style={S.optPill(slideCount === n)}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif' }}>
              {slideCount} slides selected
            </div>
          </div>

          <div style={S.optCard(false)}>
            <div style={S.optLabel}>Tone</div>
            <div style={S.optSubRow}>
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)} style={S.optPill(tone === t)}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif' }}>
              {tone} selected
            </div>
          </div>
        </div>

        {/* Theme picker */}
        <div style={S.sectionBlock}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={S.sectionTitle}>Presentation Theme</div>
            <div style={{ fontSize: '12px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif', fontWeight: '600' }}>
              ✦ {themeObj.label} selected
            </div>
          </div>
          <div style={S.themeGrid}>
            {THEMES.map(t => (
              <div key={t.id} style={S.themeCard(activeTheme === t.id)} onClick={() => setSelectedTheme(t.id)}>
                <div style={S.themePreview(t.preview[0])}>
                  {t.preview.slice(1).map((c, i) => (
                    <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={S.themeLabel}>{t.label}</div>
                {activeTheme === t.id && <div style={S.activeCheck}>✓</div>}
              </div>
            ))}
          </div>
        </div>

        <button
          style={topic.trim() ? S.generateBtn : S.disabledBtn}
          onClick={handleGenerate}
          disabled={!topic.trim()}
        >
          Generate Outline →
        </button>
      </div>
    </div>
  );
}