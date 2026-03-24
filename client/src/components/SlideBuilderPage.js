import React, { useState } from 'react';
import axios from 'axios';
import SlideViewer from './SlideViewer';
import SlideEditor from './SlideEditor';

const THEMES = [
  { id: 'dark-tech',      label: 'Dark Tech',    color: '#00D2FF', bg: '#0D1117', accent: '#00D2FF', accent2: '#6C5CE7', gradients: [['#0D1117','#1A2332'],['#0A1628','#162A4A'],['#0A0E1A','#162040'],['#111827','#0A1628']] },
  { id: 'neon-dark',      label: 'Neon',         color: '#00FF88', bg: '#050510', accent: '#00FF88', accent2: '#FF00FF', gradients: [['#050510','#0A0A20'],['#050510','#0F0A25'],['#030310','#080818'],['#050510','#0A0A20']] },
  { id: 'ocean-blue',     label: 'Ocean',        color: '#00E5FF', bg: '#020B18', accent: '#00E5FF', accent2: '#0070F3', gradients: [['#020B18','#041525'],['#020B18','#001F30'],['#010810','#031020'],['#020B18','#041525']] },
  { id: 'forest-green',   label: 'Forest',       color: '#00E676', bg: '#0A1A0F', accent: '#00E676', accent2: '#69F0AE', gradients: [['#0A1A0F','#0F2518'],['#0A1A0F','#132010'],['#081508','#0D1E0D'],['#0A1A0F','#0F2518']] },
  { id: 'royal-purple',   label: 'Purple',       color: '#9C27B0', bg: '#0D0520', accent: '#9C27B0', accent2: '#E040FB', gradients: [['#0D0520','#1A0A3D'],['#0D0520','#2D0845'],['#0A0118','#1E0535'],['#0D0520','#1A0A3D']] },
  { id: 'corporate-blue', label: 'Corporate',    color: '#2196F3', bg: '#0A1628', accent: '#2196F3', accent2: '#64B5F6', gradients: [['#0A1628','#112240'],['#0A1628','#0D1E38'],['#081222','#0F1C35'],['#0A1628','#112240']] },
  { id: 'sunset-warm',    label: 'Sunset',       color: '#FF6B35', bg: '#1A0A00', accent: '#FF6B35', accent2: '#FFB300', gradients: [['#1A0A00','#271200'],['#1A0A00','#200E00'],['#130800','#1E0A00'],['#1A0A00','#271200']] },
  { id: 'golden-luxury',  label: 'Gold',         color: '#FFD700', bg: '#0A0800', accent: '#FFD700', accent2: '#FFA000', gradients: [['#0A0800','#181200'],['#0A0800','#141000'],['#080600','#120E00'],['#0A0800','#181200']] },
  { id: 'midnight-blue',  label: 'Midnight',     color: '#4CC9F0', bg: '#000814', accent: '#4CC9F0', accent2: '#4361EE', gradients: [['#000814','#001233'],['#000B1D','#001845'],['#000814','#001233'],['#000B1D','#001845']] },
  { id: 'crimson',        label: 'Crimson',      color: '#DC2626', bg: '#0A0000', accent: '#DC2626', accent2: '#F97316', gradients: [['#0A0000','#1A0000'],['#0D0000','#200000'],['#080000','#160000'],['#0A0000','#1A0000']] },
  { id: 'aurora',         label: 'Aurora',       color: '#7B2FBE', bg: '#0D0221', accent: '#7B2FBE', accent2: '#FF6B6B', gradients: [['#0D0221','#1A0A3D'],['#0D0221','#2D0845'],['#0A0118','#1E0535'],['#0D0221','#1A0A3D']] },
  { id: 'matrix',         label: 'Matrix',       color: '#00FF41', bg: '#000300', accent: '#00FF41', accent2: '#00CC33', gradients: [['#000300','#000A00'],['#000300','#000D00'],['#000200','#000800'],['#000300','#000A00']] },
];

const FONTS = [
  { id: 'Syne', label: 'Syne', sub: 'DM Sans' },
  { id: 'Poppins', label: 'Poppins', sub: 'Inter' },
  { id: 'Montserrat', label: 'Montserrat', sub: 'Open Sans' },
  { id: 'Raleway', label: 'Raleway', sub: 'Roboto' },
  { id: 'Oswald', label: 'Oswald', sub: 'Source Sans Pro' },
  { id: 'Playfair Display', label: 'Playfair', sub: 'Lato' },
];

function ThumbnailSlide({ slide, index, isSelected, accent, onClick }) {
  const gradients = JSON.parse(localStorage.getItem('slideai-theme') || '{}').gradients || [['#0D1117', '#1A2332']];
  const bg = gradients[index % gradients.length] || ['#0D1117', '#1A2332'];
  return (
    <div onClick={onClick} style={{
      borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
      border: isSelected ? `2px solid ${accent}` : '2px solid #1a1a1a',
      background: `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`,
      aspectRatio: '16/9', position: 'relative',
      transition: 'border-color 0.15s'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
      <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.35)', marginBottom: '3px', fontFamily: 'DM Sans, sans-serif' }}>{String(index + 1).padStart(2, '0')}</div>
        <div style={{ fontSize: '7px', fontWeight: '700', color: '#fff', lineHeight: '1.3', fontFamily: 'Syne, sans-serif', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{slide.heading}</div>
      </div>
    </div>
  );
}

function SlidePreview({ slide, themeObj, titleFont, bodyFont }) {
  const bg = themeObj.gradients[0] || ['#0D1117', '#1A2332'];
  const accent = themeObj.accent;
  const accent2 = themeObj.accent2;
  const muted = 'rgba(255,255,255,0.65)';
  const tf = `'${titleFont}', sans-serif`;
  const bf = `'${bodyFont}', sans-serif`;

  const headingStyle = { fontFamily: tf, fontSize: 'clamp(20px, 2.8vw, 32px)', fontWeight: '800', color: '#fff', marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-0.5px' };
  const bodyTextStyle = { fontFamily: bf, fontSize: 'clamp(12px, 1.4vw, 15px)', color: muted, lineHeight: '1.6' };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`,
      borderRadius: '12px', padding: '28px 36px',
      aspectRatio: '16/9', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden', width: '100%',
      boxSizing: 'border-box', WebkitFontSmoothing: 'antialiased'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${accent}, ${accent2})` }} />

      <div style={{ fontFamily: bf, fontSize: '10px', color: accent, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: '600' }}>
        {(slide.type || '').toUpperCase()} · {String(slide.num).padStart(2, '0')}
      </div>

      <div style={headingStyle}>{slide.heading}</div>

      {(slide.type === 'bullets' || slide.type === 'overview') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'hidden' }}>
          {(slide.items || []).slice(0, 5).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.05)', borderRadius: '7px', padding: '7px 12px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, marginTop: '6px', flexShrink: 0 }} />
              <span style={bodyTextStyle}>{item}</span>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'stats' && (
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          {(slide.stats || []).slice(0, 3).map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px', textAlign: 'center', border: `1px solid ${accent}30` }}>
              <div style={{ fontFamily: tf, fontSize: 'clamp(20px, 2.8vw, 34px)', fontWeight: '800', color: accent }}>{s.value}</div>
              <div style={{ fontFamily: bf, fontSize: '11px', color: muted, marginTop: '6px', lineHeight: '1.4' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'title' && (
        <div style={bodyTextStyle}>{slide.subheading || slide.body}</div>
      )}

      {slide.type === 'quote' && (
        <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '18px', flex: 1 }}>
          <div style={{ ...bodyTextStyle, fontStyle: 'italic', fontSize: 'clamp(13px, 1.6vw, 17px)', marginBottom: '10px' }}>
            {(slide.quote || '').slice(0, 140)}{slide.quote?.length > 140 ? '...' : ''}
          </div>
          <div style={{ fontFamily: tf, fontSize: '12px', color: accent }}>{slide.attribution}</div>
        </div>
      )}

      {slide.type === 'closing' && (
        <div>
          <div style={{ ...bodyTextStyle, marginBottom: '14px' }}>{slide.body}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {(slide.items || []).slice(0, 3).map((item, i) => (
              <div key={i} style={{ fontFamily: bf, fontSize: '12px', color: accent, background: `${accent}15`, borderRadius: '6px', padding: '7px 12px', border: `1px solid ${accent}25` }}>{item}</div>
            ))}
          </div>
        </div>
      )}

      {slide.type === 'swot' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
          {[
            { key: 'strengths', label: 'Strengths', color: '#00E676', bg: 'rgba(0,230,118,0.08)' },
            { key: 'weaknesses', label: 'Weaknesses', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)' },
            { key: 'opportunities', label: 'Opportunities', color: '#00D2FF', bg: 'rgba(0,210,255,0.08)' },
            { key: 'threats', label: 'Threats', color: '#FFB300', bg: 'rgba(255,179,0,0.08)' },
          ].map(({ key, label, color, bg: qbg }) => (
            <div key={key} style={{ background: qbg, borderRadius: '8px', padding: '10px 12px', border: `1px solid ${color}25` }}>
              <div style={{ fontFamily: tf, fontSize: '10px', fontWeight: '700', color, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              {(slide[key] || []).slice(0, 3).map((item, i) => (
                <div key={i} style={{ fontFamily: bf, fontSize: '10px', color: muted, marginBottom: '3px', display: 'flex', gap: '5px' }}>
                  <span style={{ color, flexShrink: 0 }}>•</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {slide.type === 'blocks' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
          {(slide.blocks || []).slice(0, 4).map((b, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', border: `1px solid ${accent}18` }}>
              <div style={{ fontSize: '18px', marginBottom: '5px' }}>{b.icon}</div>
              <div style={{ fontFamily: tf, fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{b.title}</div>
              <div style={{ fontFamily: bf, fontSize: '10px', color: muted, lineHeight: '1.4' }}>{(b.body || '').slice(0, 60)}</div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'comparison' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flex: 1 }}>
          <div style={{ background: 'rgba(255,107,107,0.08)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,107,107,0.2)' }}>
            <div style={{ fontFamily: tf, fontSize: '12px', fontWeight: '700', color: '#FF6B6B', marginBottom: '8px', textAlign: 'center' }}>{slide.col1?.title}</div>
            {(slide.col1?.items || []).slice(0, 4).map((item, i) => (
              <div key={i} style={{ fontFamily: bf, fontSize: '10px', color: muted, marginBottom: '5px', display: 'flex', gap: '5px' }}><span style={{ color: '#FF6B6B' }}>✗</span>{item}</div>
            ))}
          </div>
          <div style={{ background: 'rgba(0,230,118,0.08)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(0,230,118,0.2)' }}>
            <div style={{ fontFamily: tf, fontSize: '12px', fontWeight: '700', color: '#00E676', marginBottom: '8px', textAlign: 'center' }}>{slide.col2?.title}</div>
            {(slide.col2?.items || []).slice(0, 4).map((item, i) => (
              <div key={i} style={{ fontFamily: bf, fontSize: '10px', color: muted, marginBottom: '5px', display: 'flex', gap: '5px' }}><span style={{ color: '#00E676' }}>✓</span>{item}</div>
            ))}
          </div>
        </div>
      )}

      {slide.type === 'timeline' && (
        <div style={{ paddingLeft: '18px', borderLeft: `2px solid ${accent}35`, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          {(slide.items || []).slice(0, 4).map((it, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: '10px' }}>
              <div style={{ position: 'absolute', left: '-23px', top: '4px', width: '9px', height: '9px', borderRadius: '50%', background: accent, border: '2px solid ' + bg[0] }} />
              <div style={{ fontFamily: tf, fontSize: '12px', fontWeight: '700', color: accent }}>{it.year} <span style={{ color: '#fff' }}>— {it.title}</span></div>
              <div style={{ fontFamily: bf, fontSize: '10px', color: muted, lineHeight: '1.3', marginTop: '2px' }}>{(it.body || '').slice(0, 65)}</div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'process' && (
        <div style={{ display: 'flex', gap: '6px', flex: 1, alignItems: 'center' }}>
          {(slide.steps || []).slice(0, 4).map((st, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px', textAlign: 'center', border: `1px solid ${accent}18`, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: tf, fontSize: '11px', fontWeight: '800', color: '#000' }}>{st.num}</div>
                <div style={{ fontFamily: tf, fontSize: '11px', fontWeight: '700', color: '#fff' }}>{st.title}</div>
                <div style={{ fontFamily: bf, fontSize: '9px', color: muted, lineHeight: '1.3' }}>{(st.body || '').slice(0, 35)}...</div>
              </div>
              {i < arr.length - 1 && <div style={{ color: accent, fontSize: '14px', flexShrink: 0 }}>→</div>}
            </React.Fragment>
          ))}
        </div>
      )}

      {slide.type === 'roadmap' && (
        <div style={{ display: 'flex', gap: '8px', flex: 1, paddingTop: '18px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '8px', left: '20px', right: '20px', height: '2px', background: `${accent}25` }} />
          {(slide.phases || []).slice(0, 4).map((phase, j) => (
            <div key={j} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: tf, fontSize: '11px', fontWeight: '800', color: '#000', zIndex: 1 }}>{j + 1}</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '7px', padding: '8px', border: `1px solid ${accent}20`, width: '100%' }}>
                <div style={{ fontFamily: tf, fontSize: '9px', fontWeight: '700', color: accent, marginBottom: '2px' }}>{phase.period}</div>
                <div style={{ fontFamily: tf, fontSize: '11px', fontWeight: '700', color: '#fff' }}>{phase.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'funnel' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
          {(slide.stages || []).slice(0, 4).map((stage, j, arr) => {
            const w = 100 - j * (50 / arr.length);
            const colors = [accent, accent2, '#00E676', '#FFB300'];
            return (
              <div key={j} style={{ width: `${w}%`, background: `${colors[j % colors.length]}18`, border: `1px solid ${colors[j % colors.length]}40`, borderRadius: '5px', padding: '7px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: tf, fontSize: '12px', fontWeight: '700', color: colors[j % colors.length] }}>{stage.label}</div>
                <div style={{ fontFamily: tf, fontSize: '15px', fontWeight: '800', color: '#fff' }}>{stage.value}</div>
              </div>
            );
          })}
        </div>
      )}

      {slide.type === 'hubspoke' && (
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: `0 0 18px ${accent}35` }}>
            <div style={{ fontFamily: tf, fontSize: '9px', fontWeight: '800', color: '#000', textAlign: 'center', padding: '4px' }}>{(slide.center || '').slice(0, 10)}</div>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {(slide.spokes || []).slice(0, 6).map((spoke, j) => {
              const a = (j / Math.min((slide.spokes || []).length, 6)) * 360 - 90;
              const rad = a * Math.PI / 180;
              const x = 50 + 38 * Math.cos(rad);
              const y = 50 + 38 * Math.sin(rad);
              return (
                <div key={j} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}35`, borderRadius: '5px', padding: '4px 8px' }}>
                  <div style={{ fontFamily: bf, fontSize: '9px', color: '#fff', whiteSpace: 'nowrap' }}>{spoke.slice(0, 12)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '9px', color: 'rgba(255,255,255,0.18)', fontFamily: bf }}>
        {slide.num}
      </div>
    </div>
  );
}

export default function SlideBuilderPage({ nav, slides, setSlides, deckTitle, speakerNotes, setSpeakerNotes }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState(localStorage.getItem('slideai-theme-key') || 'dark-tech');
  const [selectedFontId, setSelectedFontId] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('slideai-fonts') || '{}');
    return saved.title || 'Syne';
  });

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
  const currentFontObj = FONTS.find(f => f.id === selectedFontId) || FONTS[0];
  const titleFont = currentFontObj.id;
  const bodyFont = currentFontObj.sub;
  const accent = currentTheme.accent;

  function applyTheme(themeId) {
    const t = THEMES.find(th => th.id === themeId) || THEMES[0];
    setSelectedThemeId(themeId);
    localStorage.setItem('slideai-theme-key', themeId);
    localStorage.setItem('slideai-theme', JSON.stringify({ bg: t.bg, accent: t.accent, accent2: t.accent2, text: '#fff', muted: 'rgba(255,255,255,0.6)', gradients: t.gradients }));
  }

  function applyFont(fontId) {
    const f = FONTS.find(fo => fo.id === fontId) || FONTS[0];
    setSelectedFontId(fontId);
    localStorage.setItem('slideai-fonts', JSON.stringify({ title: f.id, body: f.sub }));
  }

  function handleSaveEdit(updated) {
    setSlides(prev => prev.map(s => s.num === updated.num ? updated : s));
    setEditingSlide(null);
  }

  async function askAI() {
    if (!aiMessage.trim()) return;
    setAiLoading(true);
    setAiReply('');
    try {
      const res = await axios.post('http://localhost:5000/api/assistant', {
        message: aiMessage,
        slides,
        currentSlide: slides[currentIdx]?.num || 1,
      });
      if (res.data.action === 'edit_slide' && res.data.updatedSlide) {
        setSlides(prev => prev.map(s => s.num === slides[currentIdx]?.num ? { ...res.data.updatedSlide, num: s.num } : s));
        setAiReply('✓ Slide updated!');
      } else if (res.data.action === 'add_notes' && res.data.speakerNotes) {
        setSpeakerNotes(prev => ({ ...prev, [slides[currentIdx]?.num]: res.data.speakerNotes }));
        setAiReply('✓ Speaker notes added!');
      } else if (res.data.action === 'add_notes_all' && res.data.allNotes) {
        setSpeakerNotes(prev => ({ ...prev, ...res.data.allNotes }));
        setAiReply('✓ Notes added to all slides!');
      } else {
        setAiReply(res.data.reply || '✓ Done!');
      }
      setAiMessage('');
    } catch (e) {
      setAiReply('❌ AI not responding. Check server.');
    }
    setAiLoading(false);
  }

  const currentSlide = slides[currentIdx];

  if (showViewer) {
    return <SlideViewer slides={slides} startIndex={currentIdx} onClose={() => setShowViewer(false)} />;
  }

  return (
    <div style={{ height: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Edit modal */}
      {editingSlide && <SlideEditor slide={editingSlide} onSave={handleSaveEdit} onClose={() => setEditingSlide(null)} />}

      {/* ── Nav ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #1a1a1a', flexShrink: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', cursor: 'pointer' }} onClick={nav.toLanding}>
            For<span style={{ color: '#D4FF00' }}>GenZ</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: '#222' }} />
          <button onClick={nav.toLanding} style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🏠 Home
          </button>
          <button onClick={nav.toTopic} style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← Back
          </button>
        </div>

        <div style={{ fontSize: '13px', color: '#444', fontFamily: 'DM Sans, sans-serif', position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxWidth: '300px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {deckTitle}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => currentSlide && setEditingSlide(currentSlide)} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #333', borderRadius: '7px', color: '#888', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            ✎ Edit Slide
          </button>
          <button onClick={() => setShowViewer(true)} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #333', borderRadius: '7px', color: '#888', fontSize: '12px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
            ▶ Present
          </button>
          <button onClick={() => nav.toExport(slides, deckTitle, speakerNotes)} style={{ padding: '8px 18px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
            Export .pptx ↓
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* ── Left thumbnails ── */}
        <div style={{ width: '180px', borderRight: '1px solid #1a1a1a', overflowY: 'auto', padding: '12px 10px', flexShrink: 0, background: '#0A0A0A' }}>
          <div style={{ fontSize: '10px', color: '#2a2a2a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>
            {slides.length} slides
          </div>
          {slides.map((slide, i) => (
            <div key={slide.num} style={{ marginBottom: '10px' }}>
              <ThumbnailSlide slide={slide} index={i} isSelected={i === currentIdx} accent={accent} onClick={() => setCurrentIdx(i)} />
              <div style={{ fontSize: '10px', color: i === currentIdx ? accent : '#333', marginTop: '3px', paddingLeft: '2px', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {slide.heading}
              </div>
            </div>
          ))}
        </div>

        {/* ── Center ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', overflow: 'hidden', minWidth: 0 }}>
          {currentSlide && (
            <>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
                <div style={{ width: '100%', maxWidth: '820px' }}>
                  <SlidePreview slide={currentSlide} themeObj={currentTheme} titleFont={titleFont} bodyFont={bodyFont} />
                </div>
              </div>

              {/* Nav controls */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', paddingTop: '14px', flexShrink: 0 }}>
                <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
                  style={{ padding: '7px 18px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: '7px', color: currentIdx === 0 ? '#2a2a2a' : '#666', cursor: currentIdx === 0 ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                  ← Prev
                </button>
                <span style={{ fontSize: '13px', color: '#333', fontFamily: 'DM Sans, sans-serif', minWidth: '60px', textAlign: 'center' }}>{currentIdx + 1} / {slides.length}</span>
                <button onClick={() => setCurrentIdx(i => Math.min(slides.length - 1, i + 1))} disabled={currentIdx === slides.length - 1}
                  style={{ padding: '7px 18px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: '7px', color: currentIdx === slides.length - 1 ? '#2a2a2a' : '#666', cursor: currentIdx === slides.length - 1 ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                  Next →
                </button>
              </div>

              {/* Speaker notes */}
              {speakerNotes[currentSlide.num] && (
                <div style={{ marginTop: '10px', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '10px 14px', flexShrink: 0 }}>
                  <div style={{ fontSize: '10px', color: '#333', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontFamily: 'DM Sans, sans-serif' }}>Speaker Notes</div>
                  <div style={{ fontSize: '12px', color: '#555', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6' }}>{speakerNotes[currentSlide.num]}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right panel ── */}
        <div style={{ width: '220px', borderLeft: '1px solid #1a1a1a', overflowY: 'auto', padding: '18px 14px', flexShrink: 0, background: '#0A0A0A' }}>

          {/* Theme */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>Theme</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {THEMES.map(t => (
                <div key={t.id} onClick={() => applyTheme(t.id)} title={t.label} style={{ position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: '6px', background: t.bg, border: selectedThemeId === t.id ? `2px solid ${t.color}` : '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border 0.15s' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color }} />
                  </div>
                  {selectedThemeId === t.id && (
                    <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', background: '#D4FF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#000', fontWeight: '800' }}>✓</div>
                  )}
                  <div style={{ fontSize: '8px', color: '#444', textAlign: 'center', marginTop: '3px', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Font */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>Font Pair</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {FONTS.map(f => (
                <button key={f.id} onClick={() => applyFont(f.id)} style={{
                  padding: '8px 10px', background: selectedFontId === f.id ? '#111' : 'transparent',
                  border: selectedFontId === f.id ? '1px solid #333' : '1px solid transparent',
                  borderRadius: '7px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s'
                }}>
                  <span style={{ fontFamily: `'${f.id}', sans-serif`, fontSize: '13px', color: selectedFontId === f.id ? '#fff' : '#555', fontWeight: '600' }}>{f.label}</span>
                  <span style={{ fontFamily: `'${f.sub}', sans-serif`, fontSize: '10px', color: '#333' }}>{f.sub}</span>
                  {selectedFontId === f.id && <span style={{ color: '#D4FF00', fontSize: '10px' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: '#111', marginBottom: '20px' }} />

          {/* AI Chat */}
          <div>
            <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>AI Edit</div>
            <input
              value={aiMessage}
              onChange={e => setAiMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askAI()}
              placeholder="e.g. Make more detailed..."
              style={{ width: '100%', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '7px', padding: '10px', color: '#fff', fontSize: '12px', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', marginBottom: '7px' }}
            />
            <button onClick={askAI} disabled={aiLoading || !aiMessage.trim()} style={{ width: '100%', padding: '10px', background: aiLoading ? '#111' : '#D4FF00', color: aiLoading ? '#444' : '#000', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '800', cursor: aiLoading ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif' }}>
              {aiLoading ? 'Thinking...' : 'Ask AI ✦'}
            </button>

            {aiReply && (
              <div style={{ marginTop: '8px', padding: '8px 10px', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '7px', fontSize: '11px', color: '#888', fontFamily: 'DM Sans, sans-serif' }}>{aiReply}</div>
            )}

            {/* Quick actions */}
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {['Make more detailed', 'Add statistics', 'Add speaker notes', 'Simplify content', 'Add notes to all slides'].map((action, i) => (
                <button key={i} onClick={() => setAiMessage(action)} style={{ padding: '6px 9px', background: 'transparent', border: '1px solid #111', borderRadius: '5px', color: '#444', fontSize: '11px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textAlign: 'left', transition: 'all 0.1s' }}
                  onMouseEnter={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#777'; }}
                  onMouseLeave={e => { e.target.style.borderColor = '#111'; e.target.style.color = '#444'; }}
                >{action}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}