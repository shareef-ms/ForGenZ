import React, { useState, useEffect } from 'react';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  if (hours < 24) return `Today, ${new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function DeckCard({ deck, onClick }) {
  const accent = '#D4FF00';
  return (
    <div onClick={onClick}
      style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.border = '1px solid #333'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.border = '1px solid #1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Preview */}
      <div style={{ background: '#0d0d0d', padding: '18px', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ height: '10px', background: accent, borderRadius: '2px', width: '60%' }} />
          <div style={{ height: '6px', background: '#222', borderRadius: '2px', width: '90%' }} />
          <div style={{ height: '6px', background: '#222', borderRadius: '2px', width: '75%' }} />
          <div style={{ height: '6px', background: '#222', borderRadius: '2px', width: '80%' }} />
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '3px', fontFamily: 'Syne, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{deck.title}</div>
        <div style={{ fontSize: '11px', color: '#444', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px' }}>{timeAgo(deck.createdAt)}</div>
        <div style={{ fontSize: '11px', color: accent, fontFamily: 'DM Sans, sans-serif', fontWeight: '600' }}>{deck.slideCount} slides</div>
      </div>
    </div>
  );
}

export default function MyDecksPage({ nav, decks }) {
  const [search, setSearch] = useState('');
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const m = mobile;
  const filtered = decks.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '14px 18px' : '18px 40px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ fontSize: m ? '19px' : '22px', fontWeight: '800', letterSpacing: '-1px', cursor: 'pointer' }} onClick={nav.toLanding}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={nav.toTopic} style={{ padding: m ? '8px 14px' : '10px 20px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontSize: m ? '12px' : '14px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
            + New Deck
          </button>
          {!m && (
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#D4FF00', border: '1px solid #333', cursor: 'pointer' }}>U</div>
          )}
        </div>
      </nav>

      <div style={{ padding: m ? '28px 18px' : '48px 40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: m ? 'clamp(20px, 6vw, 26px)' : 'clamp(24px, 3vw, 32px)', fontWeight: '800', letterSpacing: '-1px', marginBottom: '5px' }}>
            My Decks 📁
          </div>
          <div style={{ fontSize: '13px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' }}>
            {decks.length} presentation{decks.length !== 1 ? 's' : ''} generated
          </div>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your decks..."
          style={{
            width: '100%', maxWidth: '600px', padding: m ? '12px 16px' : '14px 20px',
            background: '#111', border: '1px solid #222', borderRadius: '10px',
            color: '#fff', fontSize: m ? '14px' : '15px', outline: 'none',
            fontFamily: 'DM Sans, sans-serif', marginBottom: '24px', boxSizing: 'border-box'
          }}
        />

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: m ? '48px 0' : '80px 0', color: '#333' }}>
            {decks.length === 0 ? (
              <>
                <div style={{ fontSize: '44px', marginBottom: '14px' }}>📭</div>
                <div style={{ fontSize: m ? '16px' : '18px', fontWeight: '700', marginBottom: '7px' }}>No decks yet</div>
                <div style={{ fontSize: '13px', color: '#444', fontFamily: 'DM Sans, sans-serif', marginBottom: '20px' }}>Generate your first presentation to see it here</div>
                <button onClick={nav.toTopic} style={{ padding: '13px 28px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
                  Create First Deck 🔥
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔍</div>
                <div style={{ fontSize: '15px' }}>No decks match "{search}"</div>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: m ? '10px' : '16px' }}>
            {filtered.map(deck => (
              <DeckCard key={deck.id} deck={deck} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}