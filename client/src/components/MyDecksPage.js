import React, { useState } from 'react';

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
    <div onClick={onClick} style={{
      background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px',
      overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s'
    }}
      onMouseEnter={e => { e.currentTarget.style.border = '1px solid #333'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.border = '1px solid #1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Preview */}
      <div style={{ background: '#0d0d0d', padding: '20px', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accent }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ height: '10px', background: accent, borderRadius: '2px', width: '60%' }} />
          <div style={{ height: '6px', background: '#222', borderRadius: '2px', width: '90%' }} />
          <div style={{ height: '6px', background: '#222', borderRadius: '2px', width: '75%' }} />
          <div style={{ height: '6px', background: '#222', borderRadius: '2px', width: '80%' }} />
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px', fontFamily: 'Syne, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{deck.title}</div>
        <div style={{ fontSize: '12px', color: '#444', fontFamily: 'DM Sans, sans-serif', marginBottom: '8px' }}>{timeAgo(deck.createdAt)}</div>
        <div style={{ fontSize: '12px', color: accent, fontFamily: 'DM Sans, sans-serif', fontWeight: '600' }}>{deck.slideCount} slides</div>
      </div>
    </div>
  );
}

export default function MyDecksPage({ nav, decks }) {
  const [search, setSearch] = useState('');

  const filtered = decks.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', cursor: 'pointer' }} onClick={nav.toLanding}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={nav.toTopic} style={{ padding: '10px 20px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
            + New Deck
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#D4FF00', border: '1px solid #333', cursor: 'pointer' }}>U</div>
        </div>
      </nav>

      <div style={{ padding: '48px 40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: '800', letterSpacing: '-1px', marginBottom: '6px' }}>
            My Decks 📁
          </div>
          <div style={{ fontSize: '14px', color: '#555', fontFamily: 'DM Sans, sans-serif' }}>
            {decks.length} presentation{decks.length !== 1 ? 's' : ''} generated
          </div>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your decks..."
          style={{
            width: '100%', maxWidth: '600px', padding: '14px 20px',
            background: '#111', border: '1px solid #222', borderRadius: '10px',
            color: '#fff', fontSize: '15px', outline: 'none',
            fontFamily: 'DM Sans, sans-serif', marginBottom: '32px',
            boxSizing: 'border-box'
          }}
        />

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#333' }}>
            {decks.length === 0 ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No decks yet</div>
                <div style={{ fontSize: '14px', color: '#444', fontFamily: 'DM Sans, sans-serif', marginBottom: '24px' }}>Generate your first presentation to see it here</div>
                <button onClick={nav.toTopic} style={{ padding: '14px 32px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>
                  Create First Deck 🔥
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontSize: '16px' }}>No decks match "{search}"</div>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filtered.map(deck => (
              <DeckCard key={deck.id} deck={deck} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}