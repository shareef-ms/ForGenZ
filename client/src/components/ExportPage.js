import React, { useState } from 'react';

// --- CONFIGURATION ---
const LOCAL_IP = '172.28.178.17'; 

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : `http://${LOCAL_IP}:5000/api`;

export default function ExportPage({ nav, slides, deckTitle }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/export`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, deckTitle, theme: 'dark-tech' })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${deckTitle}.pptx`; a.click();
    } catch (e) { alert('Download failed.'); }
    setDownloading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', background: '#111', padding: '40px', borderRadius: '20px' }}>
        <h1>Ready!</h1>
        <button onClick={handleDownload} style={{ background: '#D4FF00', color: '#000', padding: '15px 30px', borderRadius: '10px', fontWeight: 'bold' }}>
          {downloading ? 'Preparing...' : 'Download PPTX'}
        </button>
      </div>
    </div>
  );
}