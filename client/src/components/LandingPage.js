import React from 'react';

const S = {
  page: { minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Syne, sans-serif' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid #1a1a1a' },
  logo: { fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' },
  logoAccent: { color: '#D4FF00' },
  navRight: { display: 'flex', alignItems: 'center', gap: '24px' },
  navLink: { fontSize: '14px', color: '#888', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Syne, sans-serif' },
  ctaBtn: { padding: '10px 24px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  hero: { padding: '80px 40px 60px', maxWidth: '900px' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1px solid #333', borderRadius: '6px', fontSize: '13px', color: '#aaa', marginBottom: '32px', fontFamily: 'DM Sans, sans-serif' },
  h1: { fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: '800', lineHeight: '1.0', letterSpacing: '-3px', marginBottom: '24px', color: '#fff' },
  h1Accent: { color: '#D4FF00' },
  subtext: { fontSize: '18px', color: '#666', maxWidth: '500px', lineHeight: '1.6', marginBottom: '40px', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0' },
  btnRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  primaryBtn: { padding: '16px 36px', background: '#D4FF00', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  secondaryText: { fontSize: '13px', color: '#555', fontFamily: 'DM Sans, sans-serif' },
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: '#1a1a1a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', margin: '60px 0 0' },
  feature: { padding: '32px 40px', background: '#0A0A0A' },
  featureIcon: { fontSize: '24px', marginBottom: '12px' },
  featureTitle: { fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '6px' },
  featureText: { fontSize: '13px', color: '#555', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.5' },
  howSection: { padding: '80px 40px' },
  sectionLabel: { fontSize: '12px', color: '#D4FF00', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' },
  sectionTitle: { fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', letterSpacing: '-1px', marginBottom: '48px', color: '#fff' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' },
  step: { borderTop: '1px solid #222', paddingTop: '24px' },
  stepNum: { fontSize: '13px', color: '#D4FF00', fontWeight: '700', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' },
  stepTitle: { fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' },
  stepText: { fontSize: '14px', color: '#555', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6' },
  cta: { padding: '80px 40px', borderTop: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' },
  ctaTitle: { fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', letterSpacing: '-2px', color: '#fff', maxWidth: '600px', lineHeight: '1.1' },
  footer: { padding: '24px 40px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: '13px', color: '#444', fontFamily: 'DM Sans, sans-serif' },
};

export default function LandingPage({ nav }) {
  return (
    <div style={S.page}>
      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.logo}>For<span style={S.logoAccent}>GenZ</span></div>
        <div style={S.navRight}>
          <span style={S.navLink}>always free 🆓</span>
          <button style={S.navLink} onClick={nav.toMyDecks}>My Decks</button>
          <button style={S.ctaBtn} onClick={nav.toTopic}>Get Started 🔥</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={S.hero}>
        <div style={S.badge}>⚡ AI · Free · No signup</div>
        <h1 style={S.h1}>
          Make <span style={S.h1Accent}>fire</span><br />
          decks. Fast.
        </h1>
        <p style={S.subtext}>
          Type a topic. AI builds your whole presentation<br />
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
            { n: '01', title: 'Type your topic', text: 'Just write what your presentation is about. That\'s literally it.' },
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
        <p style={{ fontSize: '16px', color: '#555', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>Your assignment is due soon. Let AI do the heavy lifting.</p>
        <button style={S.primaryBtn} onClick={nav.toTopic}>Generate My Deck Now 🚀</button>
      </div>

      {/* Footer */}
      <div style={S.footer}>
        <div style={S.logo}>For<span style={S.logoAccent}>GenZ</span></div>
        <div style={S.footerText}>AI Presentations for Gen Z · Built different 🔥</div>
      </div>
    </div>
  );
}