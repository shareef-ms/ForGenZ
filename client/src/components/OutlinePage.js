import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SLIDE_TYPES = [
  { type: 'title', label: 'Title', icon: '🏷️' },
  { type: 'bullets', label: 'Bullets', icon: '📝', badge: 'popular' },
  { type: 'stats', label: 'Stats', icon: '📊' },
  { type: 'barchart', label: 'Bar Chart', icon: '📈' },
  { type: 'piechart', label: 'Pie Chart', icon: '🥧' },
  { type: 'donut', label: 'Donut', icon: '🍩' },
  { type: 'swot', label: 'SWOT', icon: '🎯', badge: 'new' },
  { type: 'timeline', label: 'Timeline', icon: '📅' },
  { type: 'comparison', label: 'Compare', icon: '⚖️' },
  { type: 'process', label: 'Process', icon: '⚙️' },
  { type: 'blocks', label: 'Blocks', icon: '🧩' },
  { type: 'roadmap', label: 'Roadmap', icon: '🗺️', badge: 'new' },
  { type: 'funnel', label: 'Funnel', icon: '🔺' },
  { type: 'hubspoke', label: 'Hub & Spoke', icon: '🌐' },
  { type: 'quote', label: 'Quote', icon: '💬' },
  { type: 'closing', label: 'Closing', icon: '🏁' },
];

const TYPE_COLORS = {
  title: '#D4FF00', overview: '#00E676', bullets: '#00D2FF',
  stats: '#FFB300', piechart: '#FF6B35', barchart: '#00CEC9',
  donut: '#A29BFE', blocks: '#55EFC4', timeline: '#74B9FF',
  comparison: '#FD79A8', process: '#FFEAA7', quote: '#DFE6E9',
  swot: '#00E676', roadmap: '#00D2FF', funnel: '#FF6B35',
  hubspoke: '#9C27B0', closing: '#D4FF00',
};

const THEME_MAP = {
  'dark-tech':      { bg: '#0D1117', accent: '#00D2FF', accent2: '#6C5CE7', gradients: [['#0D1117','#1A2332'],['#0A1628','#162A4A'],['#0A0E1A','#162040'],['#111827','#0A1628']] },
  'neon-dark':      { bg: '#050510', accent: '#00FF88', accent2: '#FF00FF', gradients: [['#050510','#0A0A20'],['#050510','#0F0A25'],['#030310','#080818'],['#050510','#0A0A20']] },
  'ocean-blue':     { bg: '#020B18', accent: '#00E5FF', accent2: '#0070F3', gradients: [['#020B18','#041525'],['#020B18','#001F30'],['#010810','#031020'],['#020B18','#041525']] },
  'forest-green':   { bg: '#0A1A0F', accent: '#00E676', accent2: '#69F0AE', gradients: [['#0A1A0F','#0F2518'],['#0A1A0F','#132010'],['#081508','#0D1E0D'],['#0A1A0F','#0F2518']] },
  'royal-purple':   { bg: '#0D0520', accent: '#9C27B0', accent2: '#E040FB', gradients: [['#0D0520','#1A0A3D'],['#0D0520','#2D0845'],['#0A0118','#1E0535'],['#0D0520','#1A0A3D']] },
  'corporate-blue': { bg: '#0A1628', accent: '#2196F3', accent2: '#64B5F6', gradients: [['#0A1628','#112240'],['#0A1628','#0D1E38'],['#081222','#0F1C35'],['#0A1628','#112240']] },
  'sunset-warm':    { bg: '#1A0A00', accent: '#FF6B35', accent2: '#FFB300', gradients: [['#1A0A00','#271200'],['#1A0A00','#200E00'],['#130800','#1E0A00'],['#1A0A00','#271200']] },
  'golden-luxury':  { bg: '#0A0800', accent: '#FFD700', accent2: '#FFA000', gradients: [['#0A0800','#181200'],['#0A0800','#141000'],['#080600','#120E00'],['#0A0800','#181200']] },
  'midnight-blue':  { bg: '#000814', accent: '#4CC9F0', accent2: '#4361EE', gradients: [['#000814','#001233'],['#000B1D','#001845'],['#000814','#001233'],['#000B1D','#001845']] },
  'crimson':        { bg: '#0A0000', accent: '#DC2626', accent2: '#F97316', gradients: [['#0A0000','#1A0000'],['#0D0000','#200000'],['#080000','#160000'],['#0A0000','#1A0000']] },
  'aurora':         { bg: '#0D0221', accent: '#7B2FBE', accent2: '#FF6B6B', gradients: [['#0D0221','#1A0A3D'],['#0D0221','#2D0845'],['#0A0118','#1E0535'],['#0D0221','#1A0A3D']] },
  'matrix':         { bg: '#000300', accent: '#00FF41', accent2: '#00CC33', gradients: [['#000300','#000A00'],['#000300','#000D00'],['#000200','#000800'],['#000300','#000A00']] },
};

export default function OutlinePage({ nav, topic, style, slideCount, detail }) {
  const [outline, setOutline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => { generateOutline(); }, []);

  async function generateOutline() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://forgenz-production.up.railway.app/api/outline', { topic, style, slideCount });
      if (res.data.outline?.length > 0) setOutline(res.data.outline);
      else setError('Could not generate outline. Please try again.');
    } catch (e) {
      setError('Failed to connect. Make sure server is running.');
    }
    setLoading(false);
  }

  async function buildDeck() {
    setBuilding(true);
    try {
      const themeId = localStorage.getItem('forgenz-theme-id') || 'dark-tech';
      const res = await axios.post('https://forgenz-production.up.railway.app/api/generate', {
        topic, style, slideCount: outline.length, detail, outline
      });
      const { title, slides, fonts, speakerNotes } = res.data;
      const chosenTheme = THEME_MAP[themeId] || THEME_MAP['dark-tech'];
      localStorage.setItem('slideai-theme', JSON.stringify({ ...chosenTheme, text: '#fff', muted: 'rgba(255,255,255,0.6)' }));
      localStorage.setItem('slideai-theme-key', themeId);
      localStorage.setItem('slideai-topic', topic);
      localStorage.setItem('slideai-style', style);
      if (fonts) localStorage.setItem('slideai-fonts', JSON.stringify(fonts));
      nav.toBuilder(outline, slides, title, speakerNotes || {});
    } catch (e) {
      setError('Failed to build deck. Please try again.');
      setBuilding(false);
    }
  }

  function updateHeading(idx, val) { setOutline(prev => prev.map((s, i) => i === idx ? { ...s, heading: val } : s)); }
  function updateType(idx, type) { setOutline(prev => prev.map((s, i) => i === idx ? { ...s, type } : s)); setEditingType(null); }
  function addSlide() { setOutline(prev => [...prev, { num: prev.length + 1, type: 'bullets', heading: 'New Slide' }].map((s, i) => ({ ...s, num: i + 1 }))); }
  function deleteSlide(idx) { if (outline.length <= 2) return; setOutline(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, num: i + 1 }))); }

  function handleDragStart(e, idx) { setDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; }
  function handleDragOver(e, idx) { e.preventDefault(); setDragOverIdx(idx); }
  function handleDrop(e, idx) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    setOutline(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIdx, 1);
      updated.splice(idx, 0, moved);
      return updated.map((s, i) => ({ ...s, num: i + 1 }));
    });
    setDragIdx(null); setDragOverIdx(null);
  }

  const m = mobile;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '12px 16px' : '16px 32px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ fontSize: '18px', fontWeight: '800', cursor: 'pointer' }} onClick={nav.toLanding}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <div style={{ fontSize: '12px', color: '#555', fontFamily: 'DM Sans, sans-serif', display: m ? 'none' : 'block' }}>
          Outline · <span style={{ color: '#D4FF00' }}>{topic}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={nav.toTopic} style={{ padding: '7px 12px', background: 'transparent', border: '1px solid #333', borderRadius: '7px', color: '#888', fontSize: '12px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>← Back</button>
          <button onClick={buildDeck} disabled={building || loading || outline.length === 0}
            style={{ padding: '8px 16px', background: building ? '#1a1a1a' : '#D4FF00', color: building ? '#444' : '#000', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '800', cursor: building ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif' }}>
            {building ? '⏳...' : m ? 'Build ✦' : 'Build Deck ✦'}
          </button>
        </div>
      </nav>

      <div style={{ padding: m ? '20px 16px 100px' : '28px 32px', maxWidth: m ? '100%' : '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: m ? '18px' : '22px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '3px' }}>{topic} 📋</div>
            <div style={{ fontSize: '12px', color: '#444', fontFamily: 'DM Sans, sans-serif' }}>{outline.length} slides · drag ⠿ to reorder</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={addSlide} style={{ padding: '7px 12px', background: '#111', border: '1px solid #222', borderRadius: '7px', color: '#888', fontSize: '11px', cursor: 'pointer' }}>+ Add</button>
            <button onClick={generateOutline} style={{ padding: '7px 12px', background: '#111', border: '1px solid #222', borderRadius: '7px', color: '#888', fontSize: '11px', cursor: 'pointer' }}>↺ Redo</button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: '28px', height: '28px', border: '3px solid #1a1a1a', borderTop: '3px solid #D4FF00', borderRadius: '50%', margin: '0 auto 14px', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ fontSize: '14px', color: '#444', fontFamily: 'DM Sans, sans-serif' }}>Generating outline...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '32px', background: '#110a0a', border: '1px solid #2a1a1a', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#FF6B6B', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>{error}</div>
            <button onClick={generateOutline} style={{ padding: '10px 20px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px' }}>Try Again</button>
          </div>
        )}

        {/* Outline items */}
        {!loading && outline.map((slide, idx) => (
          <div key={idx}
            draggable
            onDragStart={e => handleDragStart(e, idx)}
            onDragOver={e => handleDragOver(e, idx)}
            onDrop={e => handleDrop(e, idx)}
            onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: m ? '8px' : '12px',
              padding: m ? '10px 12px' : '12px 14px', borderRadius: '10px', marginBottom: '6px',
              background: dragOverIdx === idx ? '#111' : 'transparent',
              border: dragOverIdx === idx ? '1px solid #D4FF00' : '1px solid transparent',
              opacity: dragIdx === idx ? 0.4 : 1, transition: 'all 0.1s'
            }}
          >
            <span style={{ color: '#333', cursor: 'grab', fontSize: '16px', flexShrink: 0 }}>⠿</span>
            <span style={{ fontSize: '11px', color: '#333', minWidth: '18px', fontFamily: 'DM Sans, sans-serif' }}>{String(slide.num).padStart(2, '0')}</span>

            {/* Type badge */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <span onClick={() => setEditingType(editingType === idx ? null : idx)} style={{
                padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: '700',
                background: `${TYPE_COLORS[slide.type] || '#666'}18`,
                color: TYPE_COLORS[slide.type] || '#666',
                border: `1px solid ${TYPE_COLORS[slide.type] || '#666'}30`,
                cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px'
              }}>
                {SLIDE_TYPES.find(t => t.type === slide.type)?.icon} {m ? '' : slide.type} ▾
              </span>
              {editingType === idx && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 200, background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', minWidth: m ? '200px' : '240px', boxShadow: '0 12px 40px rgba(0,0,0,0.9)', marginTop: '4px' }}>
                  {SLIDE_TYPES.map(opt => (
                    <button key={opt.type} onClick={() => updateType(idx, opt.type)} style={{ padding: '6px 8px', background: slide.type === opt.type ? '#D4FF0015' : 'transparent', border: `1px solid ${slide.type === opt.type ? '#D4FF00' : 'transparent'}`, borderRadius: '5px', color: slide.type === opt.type ? '#D4FF00' : '#777', fontSize: '11px', cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input value={slide.heading} onChange={e => updateHeading(idx, e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: m ? '13px' : '14px', fontFamily: 'Syne, sans-serif', fontWeight: '600', outline: 'none', minWidth: 0 }} />

            <button onClick={() => deleteSlide(idx)} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontSize: '13px', padding: '2px 4px', flexShrink: 0 }}
              onMouseEnter={e => e.target.style.color = '#FF6B6B'}
              onMouseLeave={e => e.target.style.color = '#333'}
            >✕</button>
          </div>
        ))}

        {/* Add at bottom */}
        {!loading && outline.length > 0 && (
          <button onClick={addSlide} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px dashed #1a1a1a', borderRadius: '10px', color: '#333', fontSize: '13px', cursor: 'pointer', marginTop: '6px', fontFamily: 'DM Sans, sans-serif' }}>
            + Add Slide
          </button>
        )}
      </div>

      {/* Mobile sticky build button */}
      {m && !loading && outline.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: '#0A0A0A', borderTop: '1px solid #1a1a1a', zIndex: 10 }}>
          <button onClick={buildDeck} disabled={building} style={{ width: '100%', padding: '16px', background: building ? '#111' : '#D4FF00', color: building ? '#444' : '#000', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '800', cursor: building ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif' }}>
            {building ? '⏳ Building...' : 'Build Deck ✦'}
          </button>
        </div>
      )}
    </div>
  );
}