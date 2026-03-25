import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SlideViewer from './SlideViewer';
import SlideEditor from './SlideEditor';

import API from './config';

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
  { id: 'Syne', sub: 'DM Sans' },
  { id: 'Poppins', sub: 'Inter' },
  { id: 'Montserrat', sub: 'Open Sans' },
  { id: 'Raleway', sub: 'Roboto' },
  { id: 'Oswald', sub: 'Source Sans Pro' },
  { id: 'Playfair Display', sub: 'Lato' },
];

function SlidePreview({ slide, themeObj, titleFont, bodyFont }) {
  const bg = themeObj.gradients[0] || ['#0D1117', '#1A2332'];
  const accent = themeObj.accent;
  const accent2 = themeObj.accent2;
  const muted = 'rgba(255,255,255,0.85)';
  const tf = `'${titleFont}', sans-serif`;
  const bf = `'${bodyFont}', sans-serif`;

  return (
    <div style={{ background: `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`, borderRadius: '10px', padding: '20px 24px', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box', WebkitFontSmoothing: 'antialiased' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${accent}, ${accent2})` }} />
      <div style={{ fontFamily: bf, fontSize: '9px', color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '600' }}>
        {(slide.type || '').toUpperCase()} · {String(slide.num).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: tf, fontSize: 'clamp(14px, 2.5vw, 28px)', fontWeight: '800', color: '#fff', marginBottom: '12px', lineHeight: '1.15', letterSpacing: '-0.3px' }}>
        {slide.heading}
      </div>

      {(slide.type === 'bullets' || slide.type === 'overview') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflowY: 'hidden' }}>
          {(slide.items || []).slice(0, 4).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', padding: '5px 8px' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: accent, marginTop: '5px', flexShrink: 0 }} />
              <span style={{ fontFamily: bf, fontSize: 'clamp(9px, 1.1vw, 12px)', color: muted, lineHeight: '1.4' }}>{item}</span>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'stats' && (
        <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
          {(slide.stats || []).slice(0, 3).map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: '7px', padding: '10px', textAlign: 'center', border: `1px solid ${accent}25` }}>
              <div style={{ fontFamily: tf, fontSize: 'clamp(16px, 2vw, 26px)', fontWeight: '800', color: accent }}>{s.value}</div>
              <div style={{ fontFamily: bf, fontSize: 'clamp(8px, 0.9vw, 11px)', color: muted, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'title' && <div style={{ fontFamily: bf, fontSize: 'clamp(10px, 1.3vw, 14px)', color: muted }}>{slide.subheading || slide.body}</div>}

      {slide.type === 'quote' && (
        <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '12px', flex: 1 }}>
          <div style={{ fontFamily: bf, fontSize: 'clamp(9px, 1.2vw, 13px)', fontStyle: 'italic', color: muted, lineHeight: '1.5', marginBottom: '6px' }}>{(slide.quote || '').slice(0, 120)}...</div>
          <div style={{ fontFamily: tf, fontSize: '10px', color: accent }}>{slide.attribution}</div>
        </div>
      )}

      {slide.type === 'swot' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', flex: 1 }}>
          {[['strengths','Strengths','#00E676'],['weaknesses','Weaknesses','#FF6B6B'],['opportunities','Opportunities','#00D2FF'],['threats','Threats','#FFB300']].map(([key, label, color]) => (
            <div key={key} style={{ background: `${color}10`, borderRadius: '5px', padding: '6px 8px', border: `1px solid ${color}25` }}>
              <div style={{ fontFamily: tf, fontSize: '8px', fontWeight: '700', color, marginBottom: '4px', textTransform: 'uppercase' }}>{label}</div>
              {(slide[key] || []).slice(0, 2).map((item, i) => (
                <div key={i} style={{ fontFamily: bf, fontSize: '8px', color: muted, marginBottom: '2px' }}>• {item}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {slide.type === 'blocks' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', flex: 1 }}>
          {(slide.blocks || []).slice(0, 4).map((b, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '8px', border: `1px solid ${accent}15` }}>
              <div style={{ fontSize: '14px', marginBottom: '3px' }}>{b.icon}</div>
              <div style={{ fontFamily: tf, fontSize: '10px', fontWeight: '700', color: '#fff', marginBottom: '2px' }}>{b.title}</div>
              <div style={{ fontFamily: bf, fontSize: '8px', color: muted, lineHeight: '1.3' }}>{(b.body || '').slice(0, 45)}</div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'comparison' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
          <div style={{ background: 'rgba(255,107,107,0.08)', borderRadius: '6px', padding: '10px', border: '1px solid rgba(255,107,107,0.2)' }}>
            <div style={{ fontFamily: tf, fontSize: '10px', fontWeight: '700', color: '#FF6B6B', marginBottom: '6px', textAlign: 'center' }}>{slide.col1?.title}</div>
            {(slide.col1?.items || []).slice(0, 3).map((item, i) => <div key={i} style={{ fontFamily: bf, fontSize: '9px', color: muted, marginBottom: '4px', display: 'flex', gap: '4px' }}><span style={{ color: '#FF6B6B' }}>✗</span>{item}</div>)}
          </div>
          <div style={{ background: 'rgba(0,230,118,0.08)', borderRadius: '6px', padding: '10px', border: '1px solid rgba(0,230,118,0.2)' }}>
            <div style={{ fontFamily: tf, fontSize: '10px', fontWeight: '700', color: '#00E676', marginBottom: '6px', textAlign: 'center' }}>{slide.col2?.title}</div>
            {(slide.col2?.items || []).slice(0, 3).map((item, i) => <div key={i} style={{ fontFamily: bf, fontSize: '9px', color: muted, marginBottom: '4px', display: 'flex', gap: '4px' }}><span style={{ color: '#00E676' }}>✓</span>{item}</div>)}
          </div>
        </div>
      )}

      {slide.type === 'timeline' && (
        <div style={{ paddingLeft: '14px', borderLeft: `2px solid ${accent}35`, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          {(slide.items || []).slice(0, 4).map((it, i) => (
            <div key={i} style={{ position: 'relative', paddingLeft: '8px' }}>
              <div style={{ position: 'absolute', left: '-19px', top: '3px', width: '8px', height: '8px', borderRadius: '50%', background: accent }} />
              <div style={{ fontFamily: tf, fontSize: '10px', fontWeight: '700', color: accent }}>{it.year} <span style={{ color: '#fff' }}>— {it.title}</span></div>
              <div style={{ fontFamily: bf, fontSize: '8px', color: muted, lineHeight: '1.3' }}>{(it.body || '').slice(0, 55)}</div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'process' && (
        <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
          {(slide.steps || []).slice(0, 4).map((st, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '8px', textAlign: 'center', border: `1px solid ${accent}15`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: tf, fontSize: '9px', fontWeight: '800', color: '#000' }}>{st.num}</div>
                <div style={{ fontFamily: tf, fontSize: '9px', fontWeight: '700', color: '#fff' }}>{st.title}</div>
                <div style={{ fontFamily: bf, fontSize: '8px', color: muted, lineHeight: '1.2' }}>{(st.body || '').slice(0, 30)}...</div>
              </div>
              {i < arr.length - 1 && <div style={{ color: accent, fontSize: '12px', flexShrink: 0 }}>→</div>}
            </React.Fragment>
          ))}
        </div>
      )}

      {slide.type === 'roadmap' && (
        <div style={{ display: 'flex', gap: '6px', flex: 1, paddingTop: '16px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '7px', left: '16px', right: '16px', height: '2px', background: `${accent}25` }} />
          {(slide.phases || []).slice(0, 4).map((phase, j) => (
            <div key={j} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: tf, fontSize: '9px', fontWeight: '800', color: '#000', zIndex: 1 }}>{j + 1}</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '6px', border: `1px solid ${accent}18`, width: '100%' }}>
                <div style={{ fontFamily: tf, fontSize: '8px', fontWeight: '700', color: accent }}>{phase.period}</div>
                <div style={{ fontFamily: tf, fontSize: '9px', fontWeight: '700', color: '#fff' }}>{phase.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.type === 'funnel' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flex: 1, justifyContent: 'center' }}>
          {(slide.stages || []).slice(0, 4).map((stage, j, arr) => {
            const w = 100 - j * (50 / arr.length);
            const colors = [accent, accent2, '#00E676', '#FFB300'];
            return (
              <div key={j} style={{ width: `${w}%`, background: `${colors[j % colors.length]}18`, border: `1px solid ${colors[j % colors.length]}40`, borderRadius: '4px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: tf, fontSize: '10px', fontWeight: '700', color: colors[j % colors.length] }}>{stage.label}</div>
                <div style={{ fontFamily: tf, fontSize: '12px', fontWeight: '800', color: '#fff' }}>{stage.value}</div>
              </div>
            );
          })}
        </div>
      )}

      {slide.type === 'hubspoke' && (
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <div style={{ fontFamily: tf, fontSize: '8px', fontWeight: '800', color: '#000', textAlign: 'center', padding: '4px' }}>{(slide.center || '').slice(0, 8)}</div>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {(slide.spokes || []).slice(0, 6).map((spoke, j) => {
              const a = (j / Math.min((slide.spokes || []).length, 6)) * 360 - 90;
              const rad = a * Math.PI / 180;
              const x = 50 + 38 * Math.cos(rad), y = 50 + 38 * Math.sin(rad);
              return (
                <div key={j} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', background: 'rgba(255,255,255,0.06)', border: `1px solid ${accent}30`, borderRadius: '4px', padding: '3px 7px' }}>
                  <div style={{ fontFamily: bf, fontSize: '8px', color: '#fff', whiteSpace: 'nowrap' }}>{spoke.slice(0, 10)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {slide.type === 'closing' && (
        <div>
          <div style={{ fontFamily: bf, fontSize: 'clamp(9px, 1.1vw, 12px)', color: muted, marginBottom: '8px' }}>{slide.body}</div>
          {(slide.items || []).slice(0, 2).map((item, i) => (
            <div key={i} style={{ fontFamily: bf, fontSize: '9px', color: accent, background: `${accent}12`, borderRadius: '4px', padding: '4px 8px', marginBottom: '4px', border: `1px solid ${accent}20` }}>{item}</div>
          ))}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '6px', right: '10px', fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: bf }}>{slide.num}</div>
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
  const [selectedFontId, setSelectedFontId] = useState(() => JSON.parse(localStorage.getItem('slideai-fonts') || '{}').title || 'Syne');
  const [showPanel, setShowPanel] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const currentTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
  const currentFont = FONTS.find(f => f.id === selectedFontId) || FONTS[0];
  const accent = currentTheme.accent;
  const m = mobile;
  const currentSlide = slides[currentIdx];

  function applyTheme(id) {
    const t = THEMES.find(th => th.id === id) || THEMES[0];
    setSelectedThemeId(id);
    localStorage.setItem('slideai-theme-key', id);
    localStorage.setItem('slideai-theme', JSON.stringify({ bg: t.bg, accent: t.accent, accent2: t.accent2, text: '#fff', muted: 'rgba(255,255,255,0.6)', gradients: t.gradients }));
  }

  function applyFont(id) {
    const f = FONTS.find(fo => fo.id === id) || FONTS[0];
    setSelectedFontId(id);
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
      const res = await axios.post(`${API}/api/assistant`, {
        message: aiMessage, slides, currentSlide: slides[currentIdx]?.num || 1,
      });
      if (res.data.action === 'edit_slide' && res.data.updatedSlide) {
        setSlides(prev => prev.map(s => s.num === slides[currentIdx]?.num ? { ...res.data.updatedSlide, num: s.num } : s));
        setAiReply('✓ Slide updated!');
      } else if (res.data.action === 'add_notes' && res.data.speakerNotes) {
        setSpeakerNotes(prev => ({ ...prev, [slides[currentIdx]?.num]: res.data.speakerNotes }));
        setAiReply('✓ Notes added!');
      } else if (res.data.action === 'add_notes_all' && res.data.allNotes) {
        setSpeakerNotes(prev => ({ ...prev, ...res.data.allNotes }));
        setAiReply('✓ All slides updated!');
      } else {
        setAiReply(res.data.reply || '✓ Done!');
      }
      setAiMessage('');
    } catch (e) {
      setAiReply('❌ AI error. Please try again.');
    }
    setAiLoading(false);
  }

  if (showViewer) return <SlideViewer slides={slides} startIndex={currentIdx} onClose={() => setShowViewer(false)} />;

  return (
    <div style={{ height: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {editingSlide && <SlideEditor slide={editingSlide} onSave={handleSaveEdit} onClose={() => setEditingSlide(null)} />}

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '10px 14px' : '12px 20px', borderBottom: '1px solid #333', flexShrink: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: m ? '8px' : '14px' }}>
          <div style={{ fontSize: m ? '17px' : '20px', fontWeight: '800', cursor: 'pointer' }} onClick={nav.toLanding}>
            For<span style={{ color: '#D4FF00' }}>GenZ</span>
          </div>
          {!m && (
            <>
              <div style={{ width: '1px', height: '18px', background: '#555' }} />
              <button onClick={nav.toLanding} style={{ background: 'none', border: 'none', color: '#e0e0e0', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>🏠 Home</button>
              <button onClick={nav.toTopic} style={{ background: 'none', border: 'none', color: '#e0e0e0', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>← Back</button>
            </>
          )}
        </div>

        {!m && (
          <div style={{ fontSize: '12px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif', position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxWidth: '260px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {deckTitle}
          </div>
        )}

        <div style={{ display: 'flex', gap: m ? '6px' : '8px', alignItems: 'center' }}>
          {m && (
            <button onClick={() => setShowPanel(!showPanel)} style={{ padding: '7px 10px', background: showPanel ? '#D4FF0015' : 'transparent', border: `1px solid ${showPanel ? '#D4FF00' : '#555'}`, borderRadius: '7px', color: showPanel ? '#D4FF00' : '#e0e0e0', fontSize: '13px', cursor: 'pointer' }}>⚙️</button>
          )}
          <button onClick={() => currentSlide && setEditingSlide(currentSlide)} style={{ padding: m ? '7px 10px' : '7px 12px', background: 'transparent', border: '1px solid #555', borderRadius: '7px', color: '#e0e0e0', fontSize: '12px', cursor: 'pointer' }}>
            {m ? '✎' : '✎ Edit'}
          </button>
          <button onClick={() => setShowViewer(true)} style={{ padding: m ? '7px 10px' : '7px 12px', background: 'transparent', border: '1px solid #555', borderRadius: '7px', color: '#e0e0e0', fontSize: '12px', cursor: 'pointer' }}>▶</button>
          <button onClick={() => nav.toExport(slides, deckTitle, speakerNotes)} style={{ padding: m ? '7px 12px' : '8px 16px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '7px', fontSize: m ? '12px' : '13px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
            {m ? '↓' : 'Export ↓'}
          </button>
        </div>
      </nav>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* Left thumbnails — desktop only */}
        {!m && (
          <div style={{ width: '165px', borderRight: '1px solid #333', overflowY: 'auto', padding: '10px 8px', flexShrink: 0, background: '#0A0A0A' }}>
            <div style={{ fontSize: '10px', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>{slides.length} slides</div>
            {slides.map((slide, i) => (
              <div key={slide.num} style={{ marginBottom: '8px' }}>
                <div onClick={() => setCurrentIdx(i)} style={{ borderRadius: '5px', overflow: 'hidden', cursor: 'pointer', border: i === currentIdx ? `2px solid ${accent}` : '2px solid #555', background: `linear-gradient(135deg, ${currentTheme.gradients[i % currentTheme.gradients.length][0]}, ${currentTheme.gradients[i % currentTheme.gradients.length][1]})`, aspectRatio: '16/9', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
                  <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif', marginBottom: '2px' }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ fontSize: '6px', fontWeight: '700', color: '#fff', lineHeight: '1.2', fontFamily: 'Syne, sans-serif', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{slide.heading}</div>
                  </div>
                </div>
                <div style={{ fontSize: '9px', color: i === currentIdx ? accent : '#e0e0e0', marginTop: '2px', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{slide.heading}</div>
              </div>
            ))}
          </div>
        )}

        {/* Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: m ? '12px 12px' : '16px 20px', overflow: 'hidden', minWidth: 0 }}>
          {currentSlide && (
            <>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
                <div style={{ width: '100%', maxWidth: m ? '100%' : '780px' }}>
                  <SlidePreview slide={currentSlide} themeObj={currentTheme} titleFont={selectedFontId} bodyFont={currentFont.sub} />
                </div>
              </div>

              {/* Mobile slide strip */}
              {m && (
                <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', padding: '8px 0', flexShrink: 0 }}>
                  {slides.map((slide, i) => (
                    <div key={slide.num} onClick={() => setCurrentIdx(i)} style={{ width: '48px', height: '28px', borderRadius: '3px', flexShrink: 0, cursor: 'pointer', background: `linear-gradient(135deg, ${currentTheme.gradients[0][0]}, ${currentTheme.gradients[0][1]})`, border: i === currentIdx ? `2px solid ${accent}` : '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '7px', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: '700' }}>{i + 1}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Prev/Next */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', paddingTop: '10px', flexShrink: 0 }}>
                <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #555', borderRadius: '7px', color: currentIdx === 0 ? '#555' : '#e0e0e0', cursor: currentIdx === 0 ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }}>← Prev</button>
                <span style={{ fontSize: '12px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' }}>{currentIdx + 1} / {slides.length}</span>
                <button onClick={() => setCurrentIdx(i => Math.min(slides.length - 1, i + 1))} disabled={currentIdx === slides.length - 1} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #555', borderRadius: '7px', color: currentIdx === slides.length - 1 ? '#555' : '#e0e0e0', cursor: currentIdx === slides.length - 1 ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '12px' }}>Next →</button>
              </div>

              {/* Speaker notes desktop */}
              {!m && speakerNotes[currentSlide.num] && (
                <div style={{ marginTop: '10px', background: '#0f0f0f', border: '1px solid #333', borderRadius: '8px', padding: '10px 14px', flexShrink: 0 }}>
                  <div style={{ fontSize: '10px', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontFamily: 'DM Sans, sans-serif' }}>Speaker Notes</div>
                  <div style={{ fontSize: '12px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6' }}>{speakerNotes[currentSlide.num]}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right panel */}
        {(!m || showPanel) && (
          <div style={{
            width: m ? '100%' : '210px',
            position: m ? 'fixed' : 'static',
            bottom: m ? 0 : 'auto', left: m ? 0 : 'auto', right: m ? 0 : 'auto',
            maxHeight: m ? '72vh' : 'none',
            borderLeft: m ? 'none' : '1px solid #333',
            borderTop: m ? '1px solid #555' : 'none',
            overflowY: 'auto', padding: m ? '16px 20px 24px' : '16px 14px', flexShrink: 0,
            background: '#0A0A0A', zIndex: m ? 50 : 1,
            borderRadius: m ? '20px 20px 0 0' : '0'
          }}>
            {m && <div style={{ width: '36px', height: '3px', background: '#555', borderRadius: '2px', margin: '0 auto 16px' }} />}

            {/* Theme */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>Theme</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                {THEMES.map(t => (
                  <div key={t.id} onClick={() => applyTheme(t.id)} title={t.label} style={{ position: 'relative', cursor: 'pointer' }}>
                    <div style={{ aspectRatio: '1', borderRadius: '6px', background: t.bg, border: selectedThemeId === t.id ? `2px solid ${t.color}` : '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color }} />
                    </div>
                    {selectedThemeId === t.id && <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '12px', height: '12px', background: '#D4FF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: '#000', fontWeight: '800' }}>✓</div>}
                    <div style={{ fontSize: '7px', color: '#e0e0e0', textAlign: 'center', marginTop: '2px', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>Font</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {FONTS.map(f => (
                  <button key={f.id} onClick={() => applyFont(f.id)} style={{ padding: '7px 10px', background: selectedFontId === f.id ? '#111' : 'transparent', border: selectedFontId === f.id ? '1px solid #555' : '1px solid transparent', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: `'${f.id}', sans-serif`, fontSize: '12px', color: selectedFontId === f.id ? '#fff' : '#e0e0e0', fontWeight: '600' }}>{f.id}</span>
                    {selectedFontId === f.id && <span style={{ color: '#D4FF00', fontSize: '10px' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: '#333', marginBottom: '18px' }} />

            {/* AI Chat */}
            <div>
              <div style={{ fontSize: '10px', color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>AI Edit</div>
              <input value={aiMessage} onChange={e => setAiMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} placeholder="e.g. Make more detailed..." style={{ width: '100%', background: '#0f0f0f', border: '1px solid #555', borderRadius: '7px', padding: '10px', color: '#fff', fontSize: '12px', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', marginBottom: '7px' }} />
              <button onClick={askAI} disabled={aiLoading || !aiMessage.trim()} style={{ width: '100%', padding: '10px', background: aiLoading ? '#111' : '#D4FF00', color: aiLoading ? '#e0e0e0' : '#000', border: aiLoading ? '1px solid #555' : 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '800', cursor: aiLoading ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif' }}>
                {aiLoading ? 'Thinking...' : 'Ask AI ✦'}
              </button>
              {aiReply && <div style={{ marginTop: '8px', padding: '8px', background: '#0f0f0f', border: '1px solid #333', borderRadius: '7px', fontSize: '11px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' }}>{aiReply}</div>}
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['Make more detailed', 'Add statistics', 'Add speaker notes', 'Add notes to all slides', 'Simplify content'].map((action, i) => (
                  <button key={i} onClick={() => setAiMessage(action)} style={{ padding: '6px 8px', background: 'transparent', border: '1px solid #555', borderRadius: '5px', color: '#e0e0e0', fontSize: '11px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textAlign: 'left' }}>{action}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile backdrop */}
        {m && showPanel && <div onClick={() => setShowPanel(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />}
      </div>
    </div>
  );
}