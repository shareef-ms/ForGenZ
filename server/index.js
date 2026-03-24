import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This logic handles: 1. Local Dev, 2. Mobile via IP, 3. Production
const getBaseURL = () => {
  if (window.location.hostname === 'localhost') return 'http://localhost:5000/api';
  // If you are using a public backend URL, put it here:
  return 'https://forgenz-production.up.railway.app/api';
};

const API_BASE_URL = getBaseURL();

// ... rest of your SLIDE_TYPES and THEME_MAP constants ...

export default function OutlinePage({ nav, topic, style, slideCount, detail }) {
  const [outline, setOutline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Update your axios calls to use the dynamic API_BASE_URL
  async function generateOutline() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/outline`, { topic, style, slideCount });
      if (res.data.outline) setOutline(res.data.outline);
    } catch (e) {
      setError('Failed to connect to the AI server. If testing locally, ensure the backend is running.');
    }
    setLoading(false);
  }

  // ... rest of your component code ...
}