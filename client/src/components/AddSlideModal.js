import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

const SLIDE_TYPES = [
  { type: 'bullets', icon: '📝', label: 'Bullet Points' },
  { type: 'stats', icon: '📊', label: 'Stats / Numbers' },
  { type: 'timeline', icon: '📅', label: 'Timeline' },
  { type: 'comparison', icon: '⚖️', label: 'Comparison' },
  { type: 'process', icon: '⚙️', label: 'Process Flow' },
  { type: 'blocks', icon: '🧩', label: 'Blocks Grid' },
  { type: 'quote', icon: '💬', label: 'Quote' },
  { type: 'piechart', icon: '🥧', label: 'Pie Chart' },
  { type: 'barchart', icon: '📈', label: 'Bar Chart' },
  { type: 'donut', icon: '🍩', label: 'Donut Chart' },
  { type: 'overview', icon: '🗂️', label: 'Overview' },
  { type: 'closing', icon: '🎯', label: 'Closing Slide' },
];

function AddSlideModal({ onAdd, onClose, totalSlides }) {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState('bullets');
  const [topic, setTopic] = useState('');
  const [position, setPosition] = useState(totalSlides + 1);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const style = localStorage.getItem('slideai-style') || 'academic';
      const res = await fetch('https://forgenz-production.up.railway.app/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          style,
          slideType: selectedType,
          slideNum: position
        })
      });
      const data = await res.json();
      if (data.slide) {
        onAdd(data.slide, position - 1);
      }
    } catch (e) {
      alert('Failed to generate slide. Try again.');
    }
    setLoading(false);
  }

  const inputStyle = {
    width: '100%', background: theme.surface2,
    border: `1px solid ${theme.border}`, borderRadius: '8px',
    padding: '10px 14px', color: theme.text,
    fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
    outline: 'none', marginBottom: '12px'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '540px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: theme.text }}>
            Add New Slide
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: `1px solid ${theme.border}`,
            borderRadius: '8px', color: theme.muted, padding: '6px 12px',
            cursor: 'pointer', fontSize: '13px'
          }}>✕</button>
        </div>

        {/* Slide type picker */}
        <div style={{ fontSize: '11px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
          Slide Type
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px', marginBottom: '16px'
        }}>
          {SLIDE_TYPES.map(({ type, icon, label }) => (
            <div key={type} onClick={() => setSelectedType(type)} style={{
              background: selectedType === type ? `${theme.accent}20` : theme.surface2,
              border: `1px solid ${selectedType === type ? theme.accent : theme.border}`,
              borderRadius: '8px', padding: '10px 8px', cursor: 'pointer',
              textAlign: 'center', transition: 'all 0.15s'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
              <div style={{ fontSize: '11px', color: selectedType === type ? theme.accent : theme.muted, fontWeight: '500' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Topic input */}
        <div style={{ fontSize: '11px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          What should this slide be about?
        </div>
        <input
          style={inputStyle}
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder={`e.g. Key benefits of renewable energy...`}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />

        {/* Position picker */}
        <div style={{ fontSize: '11px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
          Insert at position
        </div>
        <input
          type="number" min="1" max={totalSlides + 1}
          value={position}
          onChange={e => setPosition(parseInt(e.target.value))}
          style={{ ...inputStyle, width: '100px' }}
        />

        {/* Add button */}
        <button onClick={handleAdd} disabled={loading || !topic.trim()} style={{
          width: '100%', padding: '12px',
          background: loading || !topic.trim() ? theme.surface2 : '#6C5CE7',
          color: loading || !topic.trim() ? theme.muted : '#fff',
          border: 'none', borderRadius: '8px',
          fontFamily: 'Syne, sans-serif', fontSize: '15px',
          fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '8px'
        }}>
          {loading ? '⏳ Generating...' : '✦ Add Slide'}
        </button>
      </div>
    </div>
  );
}

export default AddSlideModal;