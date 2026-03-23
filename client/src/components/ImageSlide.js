import React, { useState } from 'react';

function ImageSlide({ slide, accent }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState(false);

  async function generateImage() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('https://forgenz-production.up.railway.app/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${slide.heading} ${slide.body || ''}`
        })
      });
      const data = await res.json();

      // Pre-load the image to verify it works
      const img = new Image();
      img.onload = () => {
        setImageUrl(data.imageUrl);
        setGenerated(true);
        setLoading(false);
      };
      img.onerror = () => {
        // Fallback to a different search term
        const fallbackUrl = `https://source.unsplash.com/1280x720/?technology,professional`;
        setImageUrl(fallbackUrl);
        setGenerated(true);
        setLoading(false);
      };
      img.src = data.imageUrl;

    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }

  async function regenerate() {
    setLoading(true);
    // Add random param to get different image
    const res = await fetch('https://forgenz-production.up.railway.app/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `${slide.heading} ${Date.now()}`
      })
    });
    const data = await res.json();
    setImageUrl(data.imageUrl + '&r=' + Date.now());
    setLoading(false);
  }

  return (
    <div style={{ marginTop: '8px' }}>
      {!generated ? (
        <button
          onClick={generateImage}
          disabled={loading}
          style={{
            padding: '5px 12px',
            background: 'transparent',
            border: `1px solid ${accent}`,
            borderRadius: '6px',
            color: accent,
            fontSize: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Finding image...' : '🖼 Add Image'}
        </button>
      ) : error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#FF6B6B' }}>Failed</span>
          <button onClick={generateImage} style={{
            padding: '3px 8px', background: 'transparent',
            border: `1px solid ${accent}`, borderRadius: '4px',
            color: accent, fontSize: '10px', cursor: 'pointer'
          }}>↺ Retry</button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: '6px',
              fontSize: '10px', color: '#fff', zIndex: 1
            }}>⏳ Loading...</div>
          )}
          <img
            src={imageUrl}
            alt={slide.heading}
            style={{
              width: '100%', height: '80px',
              objectFit: 'cover', borderRadius: '6px',
              border: `1px solid ${accent}30`,
              display: 'block'
            }}
          />
          <button onClick={regenerate} style={{
            position: 'absolute', top: '4px', right: '4px',
            background: 'rgba(0,0,0,0.7)', border: 'none',
            borderRadius: '4px', color: '#fff',
            fontSize: '9px', padding: '3px 6px', cursor: 'pointer'
          }}>↺ new</button>
        </div>
      )}
    </div>
  );
}

export default ImageSlide;