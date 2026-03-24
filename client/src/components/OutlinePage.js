import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- CONFIGURATION ---
const LOCAL_IP = '172.28.178.17'; 

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : `http://${LOCAL_IP}:5000/api`;

export default function OutlinePage({ nav, topic, style, slideCount, detail }) {
  const [outline, setOutline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState('');
  const [editingType, setEditingType] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => { generateOutline(); }, []);

  async function generateOutline() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/outline`, { topic, style, slideCount });
      if (res.data.outline?.length > 0) setOutline(res.data.outline);
      else setError('Could not generate outline.');
    } catch (e) {
      setError(`Connection failed. If on mobile, enable 'Insecure Content' in site settings.`);
    }
    setLoading(false);
  }

  async function buildDeck() {
    setBuilding(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/generate`, {
        topic, style, slideCount: outline.length, detail, outline
      });
      const { title, slides, speakerNotes } = res.data;
      nav.toBuilder(outline, slides, title, speakerNotes || {});
    } catch (e) {
      setError('Failed to build deck.');
      setBuilding(false);
    }
  }

  function updateHeading(idx, val) { setOutline(prev => prev.map((s, i) => i === idx ? { ...s, heading: val } : s)); }
  function deleteSlide(idx) { if (outline.length <= 2) return; setOutline(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, num: i + 1 }))); }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', padding: '20px' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontWeight: '800' }}>ForGenZ</div>
        <button onClick={buildDeck} disabled={loading || building} style={{ background: '#D4FF00', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold' }}>
          {building ? 'Building...' : 'Build Deck ✦'}
        </button>
      </nav>
      <div style={{ maxWidth: '800px', margin: '20px auto' }}>
        <h2>{topic}</h2>
        {loading ? <p>Loading outline...</p> : outline.map((slide, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', background: '#111', padding: '10px', borderRadius: '8px' }}>
            <span style={{ color: '#444' }}>{idx + 1}</span>
            <input value={slide.heading} onChange={e => updateHeading(idx, e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
            <button onClick={() => deleteSlide(idx)} style={{ background: 'transparent', border: 'none', color: '#555' }}>✕</button>
          </div>
        ))}
        {error && <p style={{ color: '#FF6B6B' }}>{error}</p>}
      </div>
    </div>
  );
}