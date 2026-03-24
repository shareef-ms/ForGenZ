import React, { useState } from 'react';

export default function ExportPage({ nav, slides, deckTitle, speakerNotes }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const chartCount = slides.filter(s => ['piechart', 'barchart', 'donut'].includes(s.type)).length;
  const hasNotes = Object.keys(speakerNotes || {}).length > 0;

  async function downloadPptx() {
    setDownloading(true);
    try {
      const themeKey = localStorage.getItem('slideai-theme-key') || 'dark-tech';
      const response = await fetch('http://localhost:5000/api/export', {
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

  const S = {
    page: { minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif', display: 'flex', flexDirection: 'column' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid #1a1a1a' },
    logo: { fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', cursor: 'pointer' },
    logoAccent: { color: '#D4FF00' },
    backBtn: { fontSize: '14px', color: '#555', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Syne, sans-serif' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' },
    title: { fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '12px', letterSpacing: '-1px', textAlign: 'center' },
    subtitle: { fontSize: '15px', color: '#555', marginBottom: '48px', fontFamily: 'DM Sans, sans-serif', textAlign: 'center' },
    deckCard: { background: '#111', border: '1px solid #222', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', width: '100%', maxWidth: '560px' },
    deckIcon: { width: '48px', height: '48px', background: '#1a1a1a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
    deckTitle: { fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '4px' },
    deckMeta: { fontSize: '13px', color: '#555', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' },
    deckStats: { fontSize: '13px', color: '#D4FF00', fontFamily: 'DM Sans, sans-serif', fontWeight: '600' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '560px', marginBottom: '28px' },
    exportCard: (recommended) => ({ background: recommended ? '#111' : '#0d0d0d', border: recommended ? '1px solid #D4FF00' : '1px solid #1a1a1a', borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'all 0.15s', position: 'relative' }),
    exportCardTitle: { fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
    exportCardText: { fontSize: '13px', color: '#555', fontFamily: 'DM Sans, sans-serif' },
    recommendedBadge: { fontSize: '10px', padding: '2px 8px', background: '#D4FF0020', color: '#D4FF00', border: '1px solid #D4FF0040', borderRadius: '4px', fontWeight: '700' },
    newBadge: { fontSize: '10px', padding: '2px 8px', background: '#00D2FF20', color: '#00D2FF', border: '1px solid #00D2FF40', borderRadius: '4px', fontWeight: '700' },
    downloadBtn: { width: '100%', maxWidth: '560px', padding: '18px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' },
    disabledBtn: { width: '100%', maxWidth: '560px', padding: '18px', background: '#1a1a1a', color: '#444', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '800', cursor: 'not-allowed', fontFamily: 'Syne, sans-serif' },
  };

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={S.logo} onClick={nav.toLanding}>For<span style={S.logoAccent}>GenZ</span></div>
        <button style={S.backBtn} onClick={nav.toBuilder2}>← Back to Editor</button>
      </nav>

      <div style={S.main}>
        <div style={S.title}>Your deck is ready 🎉</div>
        <div style={S.subtitle}>Choose your format and download in one click.</div>

        {/* Deck info card */}
        <div style={S.deckCard}>
          <div style={S.deckIcon}>📊</div>
          <div>
            <div style={S.deckTitle}>{deckTitle}</div>
            <div style={S.deckMeta}>Generated just now · Dark Modern theme</div>
            <div style={S.deckStats}>
              {slides.length} slides
              {chartCount > 0 && ` · ${chartCount} charts`}
              {hasNotes && ' · Speaker notes included'}
            </div>
          </div>
        </div>

        {/* Export options grid */}
        <div style={S.grid}>
          <div style={S.exportCard(true)} onClick={downloadPptx}
            onMouseEnter={e => e.currentTarget.style.background = '#151515'}
            onMouseLeave={e => e.currentTarget.style.background = '#111'}
          >
            <div style={S.exportCardTitle}>
              PowerPoint .pptx
              <span style={S.recommendedBadge}>recommended</span>
            </div>
            <div style={S.exportCardText}>Works in MS PowerPoint & Google Slides</div>
          </div>

          <div style={{ ...S.exportCard(false) }}
            onMouseEnter={e => e.currentTarget.style.background = '#111'}
            onMouseLeave={e => e.currentTarget.style.background = '#0d0d0d'}
          >
            <div style={S.exportCardTitle}>PDF</div>
            <div style={S.exportCardText}>Best for sharing & printing</div>
          </div>

          <div style={{ ...S.exportCard(false) }}
            onMouseEnter={e => e.currentTarget.style.background = '#111'}
            onMouseLeave={e => e.currentTarget.style.background = '#0d0d0d'}
          >
            <div style={S.exportCardTitle}>
              Google Slides
              <span style={S.newBadge}>new</span>
            </div>
            <div style={S.exportCardText}>Import directly to your Drive</div>
          </div>

          <div style={{ ...S.exportCard(false) }}
            onMouseEnter={e => e.currentTarget.style.background = '#111'}
            onMouseLeave={e => e.currentTarget.style.background = '#0d0d0d'}
          >
            <div style={S.exportCardTitle}>Share Link</div>
            <div style={S.exportCardText}>Send a live preview link to anyone</div>
          </div>
        </div>

        <button
          style={downloading ? S.disabledBtn : S.downloadBtn}
          onClick={downloadPptx}
          disabled={downloading}
        >
          {downloading ? 'Downloading...' : downloaded ? '✓ Downloaded! Download Again' : '↓ Download .pptx — Free'}
        </button>

        {downloaded && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={nav.toTopic} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#888', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', marginRight: '12px' }}>
              Create Another Deck
            </button>
            <button onClick={nav.toMyDecks} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#888', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
              View My Decks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}