import React, { useState, useEffect } from 'react';

import API from './config';

const EXPORT_OPTIONS = [
  { id: 'pptx', title: 'PowerPoint .pptx', desc: 'Works in MS PowerPoint & Google Slides', badge: 'recommended', badgeColor: '#D4FF00', available: true },
  { id: 'pdf', title: 'PDF', desc: 'Best for sharing & printing', badge: null, available: false },
  { id: 'google', title: 'Google Slides', desc: 'Import directly to your Drive', badge: 'new', badgeColor: '#00D2FF', available: false },
  { id: 'link', title: 'Share Link', desc: 'Send a live preview link to anyone', badge: null, available: false },
];

export default function ExportPage({ nav, slides, deckTitle, speakerNotes }) {
  const [selected, setSelected] = useState('pptx');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const chartCount = slides.filter(s => ['piechart', 'barchart', 'donut'].includes(s.type)).length;
  const hasNotes = Object.keys(speakerNotes || {}).length > 0;
  const m = mobile;
  const selectedOpt = EXPORT_OPTIONS.find(o => o.id === selected);

  async function handleDownload() {
    if (selected !== 'pptx') {
      alert('Coming soon! Only PowerPoint export is available right now.');
      return;
    }
    setDownloading(true);
    try {
      const themeKey = localStorage.getItem('slideai-theme-key') || 'dark-tech';
      const response = await fetch(`${API}/api/export`, {
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

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '14px 18px' : '18px 40px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ fontSize: m ? '18px' : '22px', fontWeight: '800', cursor: 'pointer' }} onClick={nav.toLanding}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <button onClick={nav.toBuilder2} style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          ← Back to Editor
        </button>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: m ? '32px 18px 40px' : '48px 24px' }}>
        <h1 style={{ fontSize: m ? '26px' : 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1.5px', textAlign: 'center' }}>
          Your deck is ready 🎉
        </h1>
        <p style={{ fontSize: m ? '13px' : '15px', color: '#555', marginBottom: '28px', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' }}>
          Choose your format and download in one click.
        </p>

        {/* Deck info card */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: m ? '14px 16px' : '20px 24px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px', width: '100%', maxWidth: '520px' }}>
          <div style={{ width: m ? '38px' : '48px', height: m ? '38px' : '48px', background: '#1a1a1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: m ? '18px' : '22px', flexShrink: 0 }}>📊</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: m ? '14px' : '17px', fontWeight: '700', color: '#fff', marginBottom: '3px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{deckTitle}</div>
            <div style={{ fontSize: '12px', color: '#444', fontFamily: 'DM Sans, sans-serif', marginBottom: '4px' }}>Generated just now</div>
            <div style={{ fontSize: '12px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif', fontWeight: '600' }}>
              {slides.length} slides{chartCount > 0 ? ` · ${chartCount} charts` : ''}{hasNotes ? ' · Notes included' : ''}
            </div>
          </div>
        </div>

        {/* Export options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: m ? '8px' : '10px', width: '100%', maxWidth: '520px', marginBottom: '16px' }}>
          {EXPORT_OPTIONS.map(opt => (
            <div key={opt.id} onClick={() => setSelected(opt.id)} style={{
              background: selected === opt.id ? '#111' : '#0d0d0d',
              border: selected === opt.id ? `1.5px solid ${opt.badgeColor || '#D4FF00'}` : '1.5px solid #1a1a1a',
              borderRadius: '10px', padding: m ? '12px 14px' : '16px 18px',
              cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
              opacity: opt.available ? 1 : 0.6
            }}>
              {selected === opt.id && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', background: opt.badgeColor || '#D4FF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#000', fontWeight: '800' }}>✓</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: m ? '12px' : '15px', fontWeight: '700', color: '#fff' }}>{opt.title}</span>
                {opt.badge && (
                  <span style={{ fontSize: '9px', padding: '2px 6px', background: `${opt.badgeColor}20`, color: opt.badgeColor, border: `1px solid ${opt.badgeColor}40`, borderRadius: '4px', fontWeight: '700' }}>{opt.badge}</span>
                )}
              </div>
              <div style={{ fontSize: m ? '10px' : '12px', color: '#555', fontFamily: 'DM Sans, sans-serif' }}>{opt.desc}</div>
              {!opt.available && <div style={{ marginTop: '5px', fontSize: '10px', color: '#2a2a2a', fontFamily: 'DM Sans, sans-serif' }}>Coming soon</div>}
            </div>
          ))}
        </div>

        {/* Download button */}
        <button onClick={handleDownload} disabled={downloading} style={{
          width: '100%', maxWidth: '520px', padding: m ? '16px' : '18px',
          background: downloading ? '#1a1a1a' : downloaded ? '#1a1a1a' : '#D4FF00',
          color: downloading ? '#444' : downloaded ? '#D4FF00' : '#000',
          border: downloaded ? '1.5px solid #D4FF00' : 'none',
          borderRadius: '12px', fontSize: m ? '15px' : '17px', fontWeight: '800',
          cursor: downloading ? 'not-allowed' : 'pointer',
          fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px', transition: 'all 0.2s'
        }}>
          {downloading ? '⏳ Preparing...'
            : downloaded ? '✓ Downloaded! Download Again'
            : selectedOpt?.id !== 'pptx' ? `${selectedOpt?.title} — Coming Soon`
            : '↓ Download .pptx — Free'}
        </button>

        {/* Post download */}
        {downloaded && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', width: '100%', maxWidth: '520px', flexDirection: m ? 'column' : 'row' }}>
            <button onClick={nav.toTopic} style={{ flex: 1, padding: '11px 20px', background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#666', fontSize: '13px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>Create Another Deck</button>
            <button onClick={nav.toMyDecks} style={{ flex: 1, padding: '11px 20px', background: 'transparent', border: '1px solid #222', borderRadius: '8px', color: '#666', fontSize: '13px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>View My Decks</button>
          </div>
        )}
      </div>
    </div>
  );
}