import React, { useState, useEffect } from 'react';

export default function LandingPage({ nav }) {
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const m = mobile;

  const S = {
    page: { minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '14px 18px' : '18px 40px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0A0A0A', zIndex: 10 },
    logo: { fontSize: m ? '19px' : '22px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' },
    logoAccent: { color: '#D4FF00' },
    ctaBtn: { padding: m ? '8px 14px' : '10px 24px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: m ? '13px' : '14px', fontWeight: '700', cursor: 'pointer' },
    hero: { padding: m ? '44px 20px 36px' : '80px 40px 60px', maxWidth: '900px' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1px solid #333', borderRadius: '6px', fontSize: '13px', color: '#e0e0e0', marginBottom: '24px', fontFamily: 'DM Sans, sans-serif' },
    h1: { fontSize: m ? 'clamp(38px, 11vw, 56px)' : 'clamp(48px, 7vw, 88px)', fontWeight: '800', lineHeight: '1.0', letterSpacing: m ? '-2px' : '-3px', marginBottom: '20px', color: '#fff' },
    subtext: { fontSize: m ? '15px' : '18px', color: '#e0e0e0', maxWidth: '500px', lineHeight: '1.6', marginBottom: '32px', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0' },
    btnRow: { display: 'flex', alignItems: 'center', gap: m ? '14px' : '20px', flexWrap: 'wrap' },
    primaryBtn: { padding: m ? '13px 26px' : '16px 36px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: m ? '14px' : '16px', fontWeight: '700', cursor: 'pointer' },
    secondaryText: { fontSize: '13px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' },
    features: { display: 'grid', gridTemplateColumns: m ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: '#1a1a1a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', margin: m ? '40px 0 0' : '60px 0 0' },
    feature: { padding: m ? '22px 20px' : '32px 40px', background: '#0A0A0A' },
    featureIcon: { fontSize: '22px', marginBottom: '10px' },
    featureTitle: { fontSize: m ? '13px' : '15px', fontWeight: '700', color: '#fff', marginBottom: '5px' },
    featureText: { fontSize: '12px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.5' },
    howSection: { padding: m ? '44px 20px' : '80px 40px' },
    sectionLabel: { fontSize: '12px', color: '#D4FF00', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px', fontFamily: 'DM Sans, sans-serif' },
    sectionTitle: { fontSize: m ? 'clamp(22px, 6vw, 32px)' : 'clamp(28px, 4vw, 44px)', fontWeight: '800', letterSpacing: '-1px', marginBottom: '36px', color: '#fff' },
    steps: { display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: m ? '20px' : '32px' },
    step: { borderTop: '1px solid #222', paddingTop: '20px' },
    stepNum: { fontSize: '13px', color: '#D4FF00', fontWeight: '700', marginBottom: '10px', fontFamily: 'DM Sans, sans-serif' },
    stepTitle: { fontSize: m ? '16px' : '18px', fontWeight: '700', color: '#fff', marginBottom: '6px' },
    stepText: { fontSize: '14px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6' },
    cta: { padding: m ? '44px 20px' : '80px 40px', borderTop: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' },
    ctaTitle: { fontSize: m ? 'clamp(26px, 8vw, 40px)' : 'clamp(32px, 5vw, 56px)', fontWeight: '800', letterSpacing: '-2px', color: '#fff', maxWidth: '600px', lineHeight: '1.1' },
    footer: { padding: m ? '18px 20px' : '24px 40px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
    footerText: { fontSize: '12px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif' },
  };

  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.logo}>For<span style={S.logoAccent}>GenZ</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: m ? '10px' : '24px' }}>
          {!m && <span style={{ fontSize: '14px', color: '#e0e0e0', fontFamily: 'Syne, sans-serif' }}>always free 🆓</span>}
          {!m && <button style={{ fontSize: '14px', color: '#e0e0e0', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Syne, sans-serif' }} onClick={nav.toMyDecks}>My Decks</button>}
          <button style={S.ctaBtn} onClick={nav.toTopic}>{m ? 'Start 🔥' : 'Get Started 🔥'}</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={S.hero}>
        <div style={S.badge}>⚡ AI · Free · No signup</div>
        <h1 style={S.h1}>
          Make <span style={{ color: '#D4FF00' }}>fire</span><br />
          decks. Fast.
        </h1>
        <p style={S.subtext}>
          Type a topic. AI builds your whole presentation{m ? ' ' : <br />}
          in seconds. Charts, notes, everything.
        </p>
        <div style={S.btnRow}>
          <button style={S.primaryBtn} onClick={nav.toTopic}>Generate My Deck +</button>
          <span style={S.secondaryText}>No cap. No card. Free.</span>
        </div>
      </div>

      {/* Features strip */}
      <div style={S.features}>
        {[
          { icon: '⚡', title: 'Done in 15 secs', text: 'Faster than finding a template' },
          { icon: '🎨', title: '17 Slide Types', text: 'SWOT, Roadmap, Charts & more' },
          { icon: '📊', title: 'Real Charts', text: 'Pie, bar, donut — auto generated' },
          { icon: '📁', title: 'Export .pptx', text: 'Opens in PowerPoint & Google Slides' },
          { icon: '🤖', title: 'AI Assistant', text: 'Edit slides by just chatting' },
          { icon: '🆓', title: 'Always Free', text: 'No cap, no credit card needed' },
        ].map((f, i) => (
          <div key={i} style={S.feature}>
            <div style={S.featureIcon}>{f.icon}</div>
            <div style={S.featureTitle}>{f.title}</div>
            <div style={S.featureText}>{f.text}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={S.howSection}>
        <div style={S.sectionLabel}>How it works</div>
        <div style={S.sectionTitle}>Three steps to a fire deck</div>
        <div style={S.steps}>
          {[
            { n: '01', title: 'Type your topic', text: "Just write what your presentation is about. That's literally it." },
            { n: '02', title: 'Review outline', text: 'AI shows you the structure first. Edit, reorder, add or remove slides.' },
            { n: '03', title: 'Build & export', text: 'Full deck with charts, images, speaker notes. Download as .pptx.' },
          ].map((s, i) => (
            <div key={i} style={S.step}>
              <div style={S.stepNum}>{s.n}</div>
              <div style={S.stepTitle}>{s.title}</div>
              <div style={S.stepText}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={S.cta}>
        <div style={S.ctaTitle}>Stop procrastinating fr 💀</div>
        <p style={{ fontSize: m ? '14px' : '16px', color: '#e0e0e0', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          Your assignment is due soon. Let AI do the heavy lifting.
        </p>
        <button style={S.primaryBtn} onClick={nav.toTopic}>Generate My Deck Now 🚀</button>
      </div>

      {/* Footer */}
      <div style={S.footer}>
        <div style={{ fontSize: m ? '17px' : '22px', fontWeight: '800', letterSpacing: '-1px' }}>
          For<span style={{ color: '#D4FF00' }}>GenZ</span>
        </div>
        <div style={S.footerText}>AI Presentations for Gen Z · Built different 🔥</div>
      </div>
    </div>
  );
}