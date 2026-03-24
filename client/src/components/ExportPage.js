import React, { useState } from 'react';

const EXPORT_OPTIONS = [
  { id: 'pptx', title: 'PowerPoint .pptx', desc: 'Works in MS PowerPoint & Google Slides', badge: 'recommended', badgeColor: '#D4FF00', available: true },
  { id: 'pdf', title: 'PDF', desc: 'Best for sharing & printing', badge: null, available: false, comingSoon: true },
  { id: 'google', title: 'Google Slides', desc: 'Import directly to your Drive', badge: 'new', badgeColor: '#00D2FF', available: false, comingSoon: true },
  { id: 'link', title: 'Share Link', desc: 'Send a live preview link to anyone', badge: null, available: false, comingSoon: true },
];

export default function ExportPage({ nav, slides, deckTitle, speakerNotes }) {
  const [selected, setSelected] = useState('pptx');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const chartCount = slides.filter(s => ['piechart', 'barchart', 'donut'].includes(s.type)).length;
  const hasNotes = Object.keys(speakerNotes || {}).length > 0;

  async function handleDownload() {
    if (selected !== 'pptx') {
      alert('Coming soon! Only PowerPoint export is available right now.');
      return;
    }
    setDownloading(true);
    try {
      const themeKey = localStorage.getItem('slideai-theme-key') || 'dark-tech';
      const response = await fetch('https://forgenz-production.up.railway.app/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, deckTitle, theme: themeKey })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deckTitle || 'ForGenZ'}.pptx`;
      a.click();
      window.URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (e) {
      alert('Export failed. Please try again.');
    }
    setDownloading(false);
  }

  const selectedOpt = EXPORT_OPTIONS.find(o => o.id === selected);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', cursor: 'pointer' }} onClick={nav.toLanding}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <button onClick={nav.toBuilder2} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          ← Back to Editor
        </button>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1.5px', textAlign: 'center' }}>
          Your deck is ready 🎉
        </h1>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '40px', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
          Choose your format and download in one click.
        </p>

        {/* Deck info card */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', width: '100%', maxWidth: '560px' }}>
          <div style={{ width: '48px', height: '48px', background: '#1a1a1a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📊</div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{deckTitle}</div>
            <div style={{ fontSize: '13px', color: '#444', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>Generated just now · Dark Modern theme</div>
            <div style={{ fontSize: '13px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif', fontWeight: '600' }}>
              {slides.length} slides{chartCount > 0 ? ` · ${chartCount} charts` : ''}{hasNotes ? ' · Speaker notes included' : ''}
            </div>
          </div>
        </div>

        {/* Export options grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', maxWidth: '560px', marginBottom: '20px' }}>
          {EXPORT_OPTIONS.map(opt => (
            <div
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              style={{
                background: selected === opt.id ? '#111' : '#0d0d0d',
                border: selected === opt.id ? `1.5px solid ${opt.badgeColor || '#D4FF00'}` : '1.5px solid #1a1a1a',
                borderRadius: '12px', padding: '18px 20px',
                cursor: 'pointer', transition: 'all 0.15s',
                position: 'relative', opacity: opt.comingSoon ? 0.6 : 1
              }}
              onMouseEnter={e => { if (selected !== opt.id) e.currentTarget.style.borderColor = '#333'; }}
              onMouseLeave={e => { if (selected !== opt.id) e.currentTarget.style.borderColor = '#1a1a1a'; }}
            >
              {/* Selected indicator */}
              {selected === opt.id && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', background: opt.badgeColor || '#D4FF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#000', fontWeight: '800' }}>✓</div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{opt.title}</span>
                {opt.badge && (
                  <span style={{ fontSize: '10px', padding: '2px 8px', background: `${opt.badgeColor}20`, color: opt.badgeColor, border: `1px solid ${opt.badgeColor}40`, borderRadius: '4px', fontWeight: '700' }}>
                    {opt.badge}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{opt.desc}</div>
              {opt.comingSoon && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#333', fontFamily: 'DM Sans, sans-serif' }}>Coming soon</div>
              )}
            </div>
          ))}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            width: '100%', maxWidth: '560px', padding: '18px',
            background: downloading ? '#1a1a1a' : downloaded ? '#1a1a1a' : '#D4FF00',
            color: downloading ? '#444' : downloaded ? '#D4FF00' : '#000',
            border: downloaded ? '1.5px solid #D4FF00' : 'none',
            borderRadius: '12px', fontSize: '17px', fontWeight: '800',
            cursor: downloading ? 'not-allowed' : 'pointer',
            fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px',
            transition: 'all 0.2s'
          }}
        >
          {downloading
            ? '⏳ Preparing download...'
            : downloaded
              ? '✓ Downloaded! Download Again'
              : selectedOpt?.id !== 'pptx'
                ? `${selectedOpt?.title} — Coming Soon`
                : '↓ Download .pptx — Free'
          }
        </button>

        {/* Post download actions */}
        {downloaded && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={nav.toTopic} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#666', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.target.style.borderColor = '#444'}
              onMouseLeave={e => e.target.style.borderColor = '#222'}
            >Create Another Deck</button>
            <button onClick={nav.toMyDecks} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#666', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.target.style.borderColor = '#444'}
              onMouseLeave={e => e.target.style.borderColor = '#222'}
            >View My Decks</button>
          </div>
        )}
      </div>
    </div>
  );
}