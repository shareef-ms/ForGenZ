import React from 'react';

const isMobile = () => window.innerWidth < 768;

export default function LandingPage({ nav }) {
  const m = isMobile();

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '14px 20px' : '18px 40px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: m ? '20px' : '22px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: m ? '8px' : '20px' }}>
          {!m && <button onClick={nav.toMyDecks} style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>My Decks</button>}
          <button onClick={nav.toTopic} style={{ padding: m ? '8px 16px' : '10px 24px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: m ? '13px' : '14px', fontWeight: '700', cursor: 'pointer' }}>
            {m ? 'Start 🔥' : 'Get Started 🔥'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: m ? '48px 20px 40px' : '80px 40px 60px', maxWidth: '900px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1px solid #333', borderRadius: '6px', fontSize: '12px', color: '#aaa', marginBottom: '24px', fontFamily: 'DM Sans, sans-serif' }}>
          ⚡ AI · Free · No signup
        </div>
        <h1 style={{ fontSize: m ? '48px' : 'clamp(48px, 7vw, 88px)', fontWeight: '800', lineHeight: '1.0', letterSpacing: '-3px', marginBottom: '20px', color: '#fff' }}>
          Make <span style={{ color: '#D4FF00' }}>fire</span><br />decks. Fast.
        </h1>
        <p style={{ fontSize: m ? '15px' : '18px', color: '#666', maxWidth: '500px', lineHeight: '1.6', marginBottom: '32px', fontFamily: 'DM Sans, sans-serif' }}>
          Type a topic. AI builds your whole presentation in seconds. Charts, notes, everything.
        </p>
        <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'stretch' : 'center', gap: '16px' }}>
          <button onClick={nav.toTopic} style={{ padding: '16px 36px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
            Generate My Deck +
          </button>
          <span style={{ fontSize: '13px', color: '#555', fontFamily: 'DM Sans, sans-serif', textAlign: m ? 'center' : 'left' }}>No cap. No card. Free.</span>
        </div>
      </div>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '1px', background: '#1a1a1a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
        {[
          { icon: '⚡', title: 'Done in 15 secs', text: 'Faster than finding a template' },
          { icon: '🎨', title: '17 Slide Types', text: 'SWOT, Roadmap, Charts & more' },
          { icon: '📊', title: 'Real Charts', text: 'Pie, bar, donut — auto generated' },
          { icon: '📁', title: 'Export .pptx', text: 'Opens in PowerPoint & Google Slides' },
          { icon: '🤖', title: 'AI Assistant', text: 'Edit slides by just chatting' },
          { icon: '🆓', title: 'Always Free', text: 'No cap, no credit card needed' },
        ].map((f, i) => (
          <div key={i} style={{ padding: m ? '20px 16px' : '32px 40px', background: '#0A0A0A' }}>
            <div style={{ fontSize: '22px', marginBottom: '10px' }}>{f.icon}</div>
            <div style={{ fontSize: m ? '13px' : '15px', fontWeight: '700', color: '#fff', marginBottom: '5px' }}>{f.title}</div>
            <div style={{ fontSize: m ? '11px' : '13px', color: '#555', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.5' }}>{f.text}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ padding: m ? '48px 20px' : '80px 40px' }}>
        <div style={{ fontSize: '12px', color: '#D4FF00', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px', fontFamily: 'DM Sans, sans-serif' }}>How it works</div>
        <div style={{ fontSize: m ? '26px' : 'clamp(28px, 4vw, 44px)', fontWeight: '800', letterSpacing: '-1px', marginBottom: '36px', color: '#fff' }}>Three steps to a fire deck</div>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: m ? '24px' : '32px' }}>
          {[
            { n: '01', title: 'Type your topic', text: 'Just write what your presentation is about. That\'s literally it.' },
            { n: '02', title: 'Review outline', text: 'AI shows you the structure first. Edit, reorder, add or remove slides.' },
            { n: '03', title: 'Build & export', text: 'Full deck with charts, images, speaker notes. Download as .pptx.' },
          ].map((s, i) => (
            <div key={i} style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
              <div style={{ fontSize: '13px', color: '#D4FF00', fontWeight: '700', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' }}>{s.n}</div>
              <div style={{ fontSize: m ? '16px' : '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>{s.title}</div>
              <div style={{ fontSize: m ? '13px' : '14px', color: '#555', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6' }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: m ? '48px 20px' : '80px 40px', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: m ? '28px' : 'clamp(32px, 5vw, 56px)', fontWeight: '800', letterSpacing: '-2px', color: '#fff', marginBottom: '16px', lineHeight: '1.1' }}>Stop procrastinating fr 💀</div>
        <p style={{ fontSize: m ? '14px' : '16px', color: '#555', fontFamily: 'DM Sans, sans-serif', marginBottom: '28px' }}>Your assignment is due soon. Let AI do the heavy lifting.</p>
        <button onClick={nav.toTopic} style={{ width: m ? '100%' : 'auto', padding: m ? '16px' : '16px 40px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
          Generate My Deck Now 🚀
        </button>
      </div>

      {/* Footer */}
      <div style={{ padding: m ? '20px' : '24px 40px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: m ? 'column' : 'row', gap: m ? '8px' : '0' }}>
        <div style={{ fontSize: m ? '18px' : '20px', fontWeight: '800', color: '#fff' }}>For<span style={{ color: '#D4FF00' }}>GenZ</span></div>
        <div style={{ fontSize: '12px', color: '#444', fontFamily: 'DM Sans, sans-serif' }}>AI Presentations for Gen Z · Built different 🔥</div>
      </div>
    </div>
  );
}