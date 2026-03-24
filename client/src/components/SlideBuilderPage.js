import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- CONFIGURATION ---
const LOCAL_IP = '172.28.178.17'; 

const API = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${LOCAL_IP}:5000`;

export default function SlideBuilderPage({ nav, slides, setSlides, deckTitle, speakerNotes, setSpeakerNotes }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState('');

  async function askAI() {
    if (!aiMessage.trim()) return;
    setAiLoading(true);
    try {
      const res = await axios.post(`${API}/api/assistant`, { message: aiMessage, slides, currentSlide: slides[currentIdx]?.num || 1 });
      if (res.data.action === 'edit_slide') {
        setSlides(prev => prev.map(s => s.num === slides[currentIdx]?.num ? { ...res.data.updatedSlide, num: s.num } : s));
        setAiReply('Slide Updated!');
      } else {
        setAiReply(res.data.reply);
      }
    } catch (e) {
      setAiReply('AI Error. Check connection.');
    }
    setAiLoading(false);
  }

  return (
    <div style={{ height: '100vh', background: '#0A0A0A', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '20px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
        <div>{deckTitle}</div>
        <button onClick={() => nav.toExport(slides, deckTitle, speakerNotes)} style={{ background: '#D4FF00', color: '#000', padding: '8px 16px', borderRadius: '5px' }}>Export ↓</button>
      </nav>
      <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
        <div style={{ background: '#111', padding: '40px', borderRadius: '15px', border: '2px solid #D4FF00' }}>
          <h1>{slides[currentIdx]?.heading}</h1>
          <p>{slides[currentIdx]?.body || slides[currentIdx]?.items?.join(', ')}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setCurrentIdx(i => Math.max(0, i-1))}>Prev</button>
          <span style={{ margin: '0 20px' }}>{currentIdx + 1} / {slides.length}</span>
          <button onClick={() => setCurrentIdx(i => Math.min(slides.length-1, i+1))}>Next</button>
        </div>
      </div>
    </div>
  );
}