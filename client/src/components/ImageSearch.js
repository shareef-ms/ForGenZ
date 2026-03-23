import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

function ImageSearch({ slide, onImageSelect }) {
  const theme = useTheme();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(slide.heading || '');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  async function search() {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      // Search multiple times to get variety
      const results = await Promise.all([
        fetch('https://forgenz-production.up.railway.app/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: searchTerm })
        }).then(r => r.json()),
        fetch('https://forgenz-production.up.railway.app/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: searchTerm + ' professional' })
        }).then(r => r.json()),
        fetch('https://forgenz-production.up.railway.app/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: searchTerm + ' background' })
        }).then(r => r.json()),
        fetch('https://forgenz-production.up.railway.app/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: searchTerm + ' technology' })
        }).then(r => r.json()),
      ]);
      setImages(results.map(r => r.imageUrl).filter(Boolean));
    } catch (e) {
      console.error('Search failed');
    }
    setLoading(false);
  }

  function handleSelect(url) {
    setSelected(url);
    onImageSelect && onImageSelect(url);
    setOpen(false);
  }

  return (
    <div style={{ marginTop: '6px' }}>
      {!open ? (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {selected ? (
            <>
              <img src={selected} alt="" style={{ height: '36px', width: '64px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${theme.border}` }} />
              <button onClick={() => setOpen(true)} style={{ fontSize: '10px', color: theme.muted, background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '4px', padding: '3px 8px', cursor: 'pointer' }}>
                Change
              </button>
              <button onClick={() => { setSelected(null); onImageSelect && onImageSelect(null); }} style={{ fontSize: '10px', color: '#FF6B6B', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </>
          ) : (
            <button onClick={() => { setOpen(true); search(); }} style={{
              padding: '4px 10px', background: 'transparent',
              border: `1px solid ${theme.border}`, borderRadius: '6px',
              color: theme.muted, fontSize: '10px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              🖼 Add Image
            </button>
          )}
        </div>
      ) : (
        <div style={{
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: '10px', padding: '12px', marginTop: '4px'
        }}>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search images..."
              style={{
                flex: 1, background: theme.surface2, border: `1px solid ${theme.border}`,
                borderRadius: '6px', padding: '6px 10px', color: theme.text,
                fontSize: '12px', outline: 'none', fontFamily: 'DM Sans, sans-serif'
              }}
            />
            <button onClick={search} disabled={loading} style={{
              padding: '6px 12px', background: '#6C5CE7', border: 'none',
              borderRadius: '6px', color: '#fff', fontSize: '12px', cursor: 'pointer'
            }}>
              {loading ? '...' : '🔍'}
            </button>
            <button onClick={() => setOpen(false)} style={{
              padding: '6px 10px', background: 'transparent',
              border: `1px solid ${theme.border}`, borderRadius: '6px',
              color: theme.muted, fontSize: '12px', cursor: 'pointer'
            }}>✕</button>
          </div>

          {/* Image grid */}
          {loading ? (
            <div style={{ textAlign: 'center', color: theme.muted, fontSize: '12px', padding: '12px' }}>
              ⏳ Finding images...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {images.map((url, i) => (
                <div key={i} onClick={() => handleSelect(url)} style={{ cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${theme.border}`, transition: 'transform 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src={url} alt="" style={{ width: '100%', height: '60px', objectFit: 'cover', display: 'block' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && !loading && (
            <div style={{ textAlign: 'center', color: theme.muted, fontSize: '11px' }}>
              Press 🔍 to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageSearch;