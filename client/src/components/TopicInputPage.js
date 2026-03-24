import React, { useState, useEffect } from 'react';

const SUGGESTED = ['Climate Change', 'Marketing Strategy', 'Startup Pitch', 'Machine Learning', 'Solar System', 'Blockchain', 'Mental Health', 'AI & Future'];
const STYLES = [{ id: 'academic', label: 'Academic' }, { id: 'business', label: 'Business' }, { id: 'creative', label: 'Creative' }, { id: 'technical', label: 'Technical' }, { id: 'startup', label: 'Startup' }];
const SLIDE_COUNTS = [5, 8, 10, 12, 15, 20];
const TONES = ['Professional', 'Casual', 'Persuasive', 'Informative'];
const THEMES = [
  { id: 'dark-tech', label: 'Dark Tech', accent: '#00D2FF', bg: '#0D1117' },
  { id: 'neon-dark', label: 'Neon', accent: '#00FF88', bg: '#050510' },
  { id: 'ocean-blue', label: 'Ocean', accent: '#00E5FF', bg: '#020B18' },
  { id: 'forest-green', label: 'Forest', accent: '#00E676', bg: '#0A1A0F' },
  { id: 'royal-purple', label: 'Purple', accent: '#9C27B0', bg: '#0D0520' },
  { id: 'corporate-blue', label: 'Corporate', accent: '#2196F3', bg: '#0A1628' },
  { id: 'sunset-warm', label: 'Sunset', accent: '#FF6B35', bg: '#1A0A00' },
  { id: 'golden-luxury', label: 'Gold', accent: '#FFD700', bg: '#0A0800' },
  { id: 'midnight-blue', label: 'Midnight', accent: '#4CC9F0', bg: '#000814' },
  { id: 'crimson', label: 'Crimson', accent: '#DC2626', bg: '#0A0000' },
  { id: 'aurora', label: 'Aurora', accent: '#7B2FBE', bg: '#0D0221' },
  { id: 'matrix', label: 'Matrix', accent: '#00FF41', bg: '#000300' },
];

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
  const pill = (active) => ({
    padding: m ? '7px 12px' : '7px 14px',
    background: active ? '#D4FF00' : 'transparent',
    color: active ? '#000' : '#555',
    border: `1px solid ${active ? '#D4FF00' : '#222'}`,
    borderRadius: '100px', fontSize: m ? '11px' : '12px',
    cursor: 'pointer', fontFamily: 'Syne, sans-serif',
    fontWeight: active ? '700' : '400', transition: 'all 0.15s',
    whiteSpace: 'nowrap'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '14px 20px' : '18px 40px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', cursor: 'pointer' }} onClick={nav.toLanding}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {!m && <button onClick={nav.toLanding} style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Home</button>}
          {!m && <button onClick={nav.toMyDecks} style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>My Decks</button>}
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#D4FF00', border: '1px solid #333' }}>U</div>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: m ? '32px 20px 100px' : '56px 24px' }}>
        <h1 style={{ fontSize: m ? '24px' : 'clamp(28px, 4vw, 42px)', fontWeight: '800', textAlign: 'center', marginBottom: '8px', letterSpacing: '-1px' }}>
          What's your presentation about? 🔥
        </h1>
        <p style={{ fontSize: '14px', color: '#555', textAlign: 'center', marginBottom: '28px', fontFamily: 'DM Sans, sans-serif' }}>
          Type your topic. AI builds your full deck in ~15 seconds.
        </p>

        {/* Suggested chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => setTopic(s)} style={{ padding: '6px 12px', border: `1px solid ${topic === s ? '#D4FF00' : '#222'}`, borderRadius: '100px', fontSize: '12px', color: topic === s ? '#D4FF00' : '#666', cursor: 'pointer', background: 'transparent', fontFamily: 'DM Sans, sans-serif' }}>{s}</button>
          ))}
        </div>

        {/* Text input */}
        <div style={{ background: '#0f0f0f', border: '1px solid #222', borderRadius: '14px', marginBottom: '16px', overflow: 'hidden' }}>
          <textarea
            style={{ width: '100%', padding: '18px 20px', background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', fontFamily: 'DM Sans, sans-serif', resize: 'none', outline: 'none', minHeight: '90px', boxSizing: 'border-box' }}
            placeholder="e.g. The impact of social media on Gen Z mental health..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <div style={{ height: '1px', background: '#1a1a1a' }} />
          {/* Style pills */}
          <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: '#444', alignSelf: 'center', fontFamily: 'DM Sans, sans-serif', marginRight: '4px' }}>Style:</span>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} style={pill(style === s.id)}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Slides count */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>
            Number of Slides · <span style={{ color: '#D4FF00' }}>{slideCount} selected</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SLIDE_COUNTS.map(n => (
              <button key={n} onClick={() => setSlideCount(n)} style={pill(slideCount === n)}>{n}</button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>
            Tone · <span style={{ color: '#D4FF00' }}>{tone} selected</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TONES.map(t => (
              <button key={t} onClick={() => setTone(t)} style={pill(tone === t)}>{t}</button>
            ))}
          </div>
        </div>

        {/* Theme picker */}
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'DM Sans, sans-serif' }}>Theme</div>
            <div style={{ fontSize: '12px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif', fontWeight: '600' }}>
              ✦ {THEMES.find(t => t.id === selectedTheme)?.label}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {THEMES.map(t => (
              <div key={t.id} onClick={() => setSelectedTheme(t.id)} style={{ position: 'relative', cursor: 'pointer' }}>
                <div style={{
                  aspectRatio: '1', borderRadius: '8px', background: t.bg,
                  border: selectedTheme === t.id ? `2px solid ${t.accent}` : '2px solid #1a1a1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border 0.15s'
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.accent }} />
                </div>
                {selectedTheme === t.id && (
                  <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', background: '#D4FF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#000', fontWeight: '800' }}>✓</div>
                )}
                <div style={{ fontSize: '8px', color: '#444', textAlign: 'center', marginTop: '3px', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button — sticky on mobile */}
        <div style={{ position: m ? 'fixed' : 'static', bottom: m ? 0 : 'auto', left: m ? 0 : 'auto', right: m ? 0 : 'auto', padding: m ? '16px 20px' : '0', background: m ? '#0A0A0A' : 'transparent', borderTop: m ? '1px solid #1a1a1a' : 'none', zIndex: 10 }}>
          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            style={{ width: '100%', padding: '18px', background: topic.trim() ? '#D4FF00' : '#111', color: topic.trim() ? '#000' : '#333', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '800', cursor: topic.trim() ? 'pointer' : 'not-allowed', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}
          >
            Generate Outline →
          </button>
        </div>
      </div>
    </div>
  );
}