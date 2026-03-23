import React, { useState } from 'react';

function EditModal({ slide, onSave, onClose }) {
  const [heading, setHeading] = useState(slide.heading || '');
  const [body, setBody] = useState(slide.body || '');
  const [items, setItems] = useState((slide.items || []).join('\n'));
  const [subheading, setSubheading] = useState(slide.subheading || '');
  const [quote, setQuote] = useState(slide.quote || '');
  const [attribution, setAttribution] = useState(slide.attribution || '');

  const inputStyle = {
    width: '100%', background: '#1E1E22',
    border: '1px solid #2A2A30', borderRadius: '8px',
    padding: '10px 14px', color: '#F0EFF8',
    fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
    outline: 'none', marginBottom: '12px'
  };

  const labelStyle = {
    fontSize: '11px', color: '#8B8A9E',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    marginBottom: '6px', display: 'block'
  };

  function handleSave() {
    const updated = { ...slide, heading };
    if (body) updated.body = body;
    if (subheading) updated.subheading = subheading;
    if (quote) updated.quote = quote;
    if (attribution) updated.attribution = attribution;
    if (items) updated.items = items.split('\n').filter(i => i.trim());
    onSave(updated);
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#161618', border: '1px solid #2A2A30',
        borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '560px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#F0EFF8' }}>
              Edit Slide {slide.num}
            </div>
            <div style={{ fontSize: '11px', color: '#8B8A9E', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
              {slide.type}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #2A2A30',
            borderRadius: '8px', color: '#8B8A9E', padding: '6px 12px',
            cursor: 'pointer', fontSize: '13px'
          }}>✕ Close</button>
        </div>

        {/* Heading — all slide types */}
        <label style={labelStyle}>Heading</label>
        <input
          style={inputStyle}
          value={heading}
          onChange={e => setHeading(e.target.value)}
          placeholder="Slide heading..."
        />

        {/* Subheading — title slides */}
        {(slide.type === 'title') && <>
          <label style={labelStyle}>Subheading</label>
          <input
            style={inputStyle}
            value={subheading}
            onChange={e => setSubheading(e.target.value)}
            placeholder="Subtitle..."
          />
        </>}

        {/* Body — title, closing, default */}
        {(slide.type === 'title' || slide.type === 'closing' || slide.type === 'image-text') && <>
          <label style={labelStyle}>Body Text</label>
          <textarea
            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Body text..."
          />
        </>}

        {/* Items — bullets, overview */}
        {(slide.type === 'bullets' || slide.type === 'overview') && <>
          <label style={labelStyle}>Bullet Points (one per line)</label>
          <textarea
            style={{ ...inputStyle, height: '150px', resize: 'vertical' }}
            value={items}
            onChange={e => setItems(e.target.value)}
            placeholder="Point 1&#10;Point 2&#10;Point 3"
          />
        </>}

        {/* Quote */}
        {slide.type === 'quote' && <>
          <label style={labelStyle}>Quote Text</label>
          <textarea
            style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
            value={quote}
            onChange={e => setQuote(e.target.value)}
            placeholder="Quote text..."
          />
          <label style={labelStyle}>Attribution</label>
          <input
            style={inputStyle}
            value={attribution}
            onChange={e => setAttribution(e.target.value)}
            placeholder="— Author Name"
          />
        </>}

        {/* Stats info */}
        {slide.type === 'stats' && (
          <div style={{
            background: '#1E1E22', border: '1px solid #2A2A30',
            borderRadius: '8px', padding: '12px',
            fontSize: '13px', color: '#8B8A9E', marginBottom: '12px'
          }}>
            💡 Stats data editing coming in next update. You can edit the heading above.
          </div>
        )}

        {/* Chart info */}
        {(slide.type === 'piechart' || slide.type === 'barchart' || slide.type === 'donut') && (
          <div style={{
            background: '#1E1E22', border: '1px solid #2A2A30',
            borderRadius: '8px', padding: '12px',
            fontSize: '13px', color: '#8B8A9E', marginBottom: '12px'
          }}>
            💡 Chart data editing coming in next update. You can edit the heading above.
          </div>
        )}

        {/* Save button */}
        <button onClick={handleSave} style={{
          width: '100%', padding: '12px',
          background: '#6C5CE7', color: '#fff',
          border: 'none', borderRadius: '8px',
          fontFamily: 'Syne, sans-serif', fontSize: '15px',
          fontWeight: '600', cursor: 'pointer', marginTop: '8px'
        }}>
          ✓ Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditModal;