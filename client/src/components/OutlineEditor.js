import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
const SLIDE_TYPE_OPTIONS = [
  { type: 'title', icon: '🏷️', label: 'Title' },
  { type: 'overview', icon: '📋', label: 'Overview' },
  { type: 'bullets', icon: '📝', label: 'Bullets' },
  { type: 'stats', icon: '📊', label: 'Stats' },
  { type: 'piechart', icon: '🥧', label: 'Pie Chart' },
  { type: 'barchart', icon: '📈', label: 'Bar Chart' },
  { type: 'donut', icon: '🍩', label: 'Donut' },
  { type: 'blocks', icon: '🧩', label: 'Blocks' },
  { type: 'timeline', icon: '📅', label: 'Timeline' },
  { type: 'comparison', icon: '⚖️', label: 'Comparison' },
  { type: 'process', icon: '⚙️', label: 'Process' },
  { type: 'quote', icon: '💬', label: 'Quote' },
  { type: 'swot', icon: '🎯', label: 'SWOT' },
  { type: 'roadmap', icon: '🗺️', label: 'Roadmap' },
  { type: 'funnel', icon: '🔺', label: 'Funnel' },
  { type: 'hubspoke', icon: '🌐', label: 'Hub & Spoke' },
  { type: 'closing', icon: '🏁', label: 'Closing' },
];
const TYPE_COLORS = {
  title: '#6C5CE7', overview: '#00B894', bullets: '#0984E3',
  stats: '#FDCB6E', piechart: '#E17055', barchart: '#00CEC9',
  donut: '#A29BFE', blocks: '#55EFC4', timeline: '#74B9FF',
  comparison: '#FD79A8', process: '#FFEAA7', quote: '#DFE6E9', closing: '#6C5CE7'
};

function OutlineEditor({ outline, onBuild, onCancel, loading }) {
  const theme = useTheme();
  const [slides, setSlides] = useState(outline);
  const [editingIdx, setEditingIdx] = useState(null);
  const [showTypeMenu, setShowTypeMenu] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  function updateSlide(idx, field, value) {
    setSlides(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  function deleteSlide(idx) {
    if (slides.length <= 2) return;
    setSlides(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, num: i + 1 })));
  }

  function addSlide(afterIdx) {
    const newSlide = { num: afterIdx + 2, type: 'bullets', heading: 'New Slide', description: 'Add content here' };
    setSlides(prev => {
      const updated = [...prev];
      updated.splice(afterIdx + 1, 0, newSlide);
      return updated.map((s, i) => ({ ...s, num: i + 1 }));
    });
  }

  function handleDragStart(idx) { setDragging(idx); }
  function handleDragOver(e, idx) { e.preventDefault(); setDragOver(idx); }
  function handleDrop(idx) {
    if (dragging === null || dragging === idx) return;
    setSlides(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragging, 1);
      updated.splice(idx, 0, moved);
      return updated.map((s, i) => ({ ...s, num: i + 1 }));
    });
    setDragging(null);
    setDragOver(null);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: '16px', width: '100%', maxWidth: '680px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
        }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: theme.text }}>
              ✦ Review Your Outline
            </div>
            <div style={{ fontSize: '12px', color: theme.muted, marginTop: '2px' }}>
              Edit slide titles, types and order — then build your deck
            </div>
          </div>
          <button onClick={onCancel} style={{ background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.muted, padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>
            ✕ Cancel
          </button>
        </div>

        {/* Outline list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {slides.map((slide, idx) => {
            const typeInfo = SLIDE_TYPE_OPTIONS.find(t => t.type === slide.type) || SLIDE_TYPE_OPTIONS[0];
            const badgeColor = TYPE_COLORS[slide.type] || '#666';
            const isDragOver = dragOver === idx;

            return (
              <div key={idx}>
                {/* Drop zone */}
                {isDragOver && dragging !== idx && (
                  <div style={{ height: '3px', background: '#6C5CE7', borderRadius: '2px', margin: '4px 0' }} />
                )}

                <div
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDrop={() => handleDrop(idx)}
                  onDragEnd={() => { setDragging(null); setDragOver(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px', marginBottom: '6px',
                    border: `1px solid ${editingIdx === idx ? '#6C5CE7' : theme.border}`,
                    background: editingIdx === idx ? '#6C5CE710' : theme.surface2,
                    transition: 'all 0.15s', cursor: 'grab',
                    opacity: dragging === idx ? 0.4 : 1
                  }}
                >
                  {/* Drag handle */}
                  <div style={{ color: theme.muted, fontSize: '14px', cursor: 'grab', flexShrink: 0 }}>⠿</div>

                  {/* Slide number */}
                  <div style={{ fontSize: '11px', color: theme.muted, minWidth: '20px', flexShrink: 0 }}>{slide.num}</div>

                  {/* Type badge — clickable */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      onClick={() => setShowTypeMenu(showTypeMenu === idx ? null : idx)}
                      style={{
                        padding: '3px 8px', borderRadius: '20px', fontSize: '10px',
                        fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px',
                        background: `${badgeColor}20`, color: badgeColor,
                        border: `1px solid ${badgeColor}40`, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                      }}
                    >
                      {typeInfo.icon} {slide.type} ▾
                    </button>

                    {/* Type dropdown */}
                    {showTypeMenu === idx && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, zIndex: 100,
                        background: theme.surface, border: `1px solid ${theme.border}`,
                        borderRadius: '10px', padding: '8px', marginTop: '4px',
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px',
                        minWidth: '200px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                      }}>
                        {SLIDE_TYPE_OPTIONS.map(opt => (
                          <button key={opt.type} onClick={() => { updateSlide(idx, 'type', opt.type); setShowTypeMenu(null); }} style={{
                            padding: '6px 8px', borderRadius: '6px', fontSize: '11px',
                            background: slide.type === opt.type ? '#6C5CE720' : 'transparent',
                            border: `1px solid ${slide.type === opt.type ? '#6C5CE7' : 'transparent'}`,
                            color: theme.text, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: '6px'
                          }}>
                            {opt.icon} {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Heading input */}
                  <input
                    value={slide.heading}
                    onChange={e => updateSlide(idx, 'heading', e.target.value)}
                    onFocus={() => setEditingIdx(idx)}
                    onBlur={() => setEditingIdx(null)}
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: theme.text, fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px', fontWeight: '500', outline: 'none',
                      minWidth: 0
                    }}
                  />

                  {/* Description input */}
                  <input
                    value={slide.description || ''}
                    onChange={e => updateSlide(idx, 'description', e.target.value)}
                    placeholder="Brief description..."
                    style={{
                      width: '160px', background: 'transparent', border: 'none',
                      color: theme.muted, fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px', outline: 'none', flexShrink: 0
                    }}
                  />

                  {/* Delete button */}
                  <button
                    onClick={() => deleteSlide(idx)}
                    style={{ background: 'transparent', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: '14px', padding: '2px 6px', flexShrink: 0, opacity: slides.length <= 2 ? 0.3 : 1 }}
                  >🗑</button>
                </div>

                {/* Add slide button between items */}
                <div
                  onClick={() => addSlide(idx)}
                  style={{
                    height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', marginBottom: '2px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '20px', background: '#6C5CE720', border: '1px solid #6C5CE740' }}>
                    <span style={{ color: '#6C5CE7', fontSize: '12px' }}>+ Add slide here</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add slide at end */}
          <button onClick={() => addSlide(slides.length - 1)} style={{
            width: '100%', padding: '10px', borderRadius: '10px',
            border: `1.5px dashed ${theme.border}`, background: 'transparent',
            color: theme.muted, fontSize: '13px', cursor: 'pointer', marginTop: '4px',
            fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6C5CE7'}
            onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
          >
            + Add Slide
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem', borderTop: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, background: theme.surface
        }}>
          <div style={{ fontSize: '12px', color: theme.muted }}>
            {slides.length} slides · drag to reorder · click type badge to change
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onCancel} style={{
              padding: '10px 20px', background: 'transparent',
              border: `1px solid ${theme.border}`, borderRadius: '8px',
              color: theme.muted, fontSize: '14px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>Back</button>
            <button
              onClick={() => onBuild(slides)}
              disabled={loading}
              style={{
                padding: '10px 24px', background: loading ? '#3A3A4A' : '#6C5CE7',
                border: 'none', borderRadius: '8px', color: '#fff',
                fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Building...' : '✦ Build Presentation →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutlineEditor;